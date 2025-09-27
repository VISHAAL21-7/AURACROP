const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const { sendNotification } = require("./utils/notifier");

admin.initializeApp();
const db = admin.firestore();

exports.apiHandler = functions.https.onRequest(async (req, res) => {
  res.set("Cache-Control", "private, max-age=0, s-maxage=0");
  return res.json({
    status: "ok",
    service: "AuraCrop Backend",
    timestamp: new Date().toISOString(),
  });
});

exports.submitImage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
  }

  const uid = context.auth.uid;
  const { storagePath, crop = null, part = null } = data || {};

  if (!storagePath) {
    throw new functions.https.HttpsError("invalid-argument", "storagePath is required");
  }

  const docRef = db.collection("images").doc();
  const payload = {
    userId: uid,
    storagePath,
    crop,
    part,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await docRef.set(payload);
  return { imageId: docRef.id, status: "pending" };
});

exports.detectPendingImages = functions.pubsub
  .schedule("every 3 minutes")
  .onRun(async (context) => {
    const pending = await db.collection("images").where("status", "==", "pending").limit(10).get();
    if (pending.empty) return null;

    const mlApiUrl = functions.config().ml?.api_url || null;
    const mlApiKey = functions.config().ml?.api_key || null;

    for (const doc of pending.docs) {
      try {
        const data = doc.data();
        let inference;
        if (mlApiUrl && mlApiKey) {
          const resp = await axios.post(
            mlApiUrl,
            { storagePath: data.storagePath, crop: data.crop, part: data.part },
            { headers: { Authorization: `Bearer ${mlApiKey}` }, timeout: 10000 }
          );
          inference = resp.data;
        } else {
          inference = {
            label: "Leaf Blight",
            confidence: 0.88,
            stage: "early",
            recommendedActions: [
              "Remove infected leaves",
              "Apply recommended fungicide as per local guidelines",
            ],
          };
        }

        await doc.ref.update({
          status: "inferred",
          inference,
          inferredAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.error("Inference failed for", doc.id, err.message || err);
        await doc.ref.update({
          status: "failed",
          error: err.message || "inference_failed",
        });
      }
    }
    return null;
  });
