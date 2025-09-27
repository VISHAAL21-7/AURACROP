// Firebase frontend logic placeholder
document.getElementById("btnUpload").addEventListener("click", () => {
  const file = document.getElementById("file").files[0];
  if (!file) return alert("Pick an image");
  document.getElementById("status").innerText = "Mock upload done. Diagnosis pending...";
  setTimeout(() => {
    document.getElementById("results").style.display = "block";
    document.getElementById("resultJson").innerText = JSON.stringify({
      label: "Leaf Blight",
      confidence: 0.88,
      stage: "early"
    }, null, 2);
  }, 2000);
});
