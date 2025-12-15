const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "upload-ui.html"));
});

// Endpoint to upload images
app.post("/uploadImage", upload.array("images", 10), (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files uploaded.");
  }

  // Simulate processing (like classification)
  const results = req.files.map(file => ({
    filename: file.filename,
    label: "cat",        // dummy label
    confidence: 0.92     // dummy confidence
  }));

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`REST API server running at http://localhost:${PORT}`);
});
