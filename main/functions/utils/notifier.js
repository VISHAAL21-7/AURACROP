const admin = require("firebase-admin");

const sendNotification = async (userId, payload) => {
  try {
    const userSnap = await admin.firestore().collection("users").doc(userId).get();
    const user = userSnap.exists ? userSnap.data() : null;
    if (user && user.fcmToken) {
      const message = {
        token: user.fcmToken,
        notification: { title: payload.title, body: payload.body },
        data: { imageId: payload.imageId || "" },
      };
      await admin.messaging().send(message);
      console.log("FCM sent to", userId);
      return;
    }
    console.log(`Notify[${userId}]`, payload.title, "-", payload.body);
  } catch (err) {
    console.error("Notifier error:", err.message || err);
  }
};

module.exports = { sendNotification };
