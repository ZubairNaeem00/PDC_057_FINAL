const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function uploadImages(imagePaths) {
  const form = new FormData();

  imagePaths.forEach(img =>
    form.append("images", fs.createReadStream(img))
  );

  const start = Date.now();
  const response = await axios.post(
    "http://localhost:3000/uploadImage",
    form,
    { headers: form.getHeaders() }
  );

  const end = Date.now();

  console.log("Images:", imagePaths.length);
  console.log("Response Time (ms):", end - start);
  console.log("Payload Size (bytes):",
    Buffer.byteLength(JSON.stringify(response.data))
  );
  console.log("Result:", response.data);
  console.log("-----------------------------");
}

// 🔹 Upload 1 Image
uploadImages(["sample1.jpg"]);

// 🔹 Upload 5 Images
uploadImages([
  "sample1.jpg",
  "sample2.jpg",
  "sample3.jpg",
  "sample4.jpg",
  "sample5.jpg"
]);
