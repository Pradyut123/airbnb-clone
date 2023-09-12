const express = require("express");
require("dotenv").config();
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const imageDownloader = require("image-downloader");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

require("./db/connection");

// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Enable credentials (cookies)
// };

// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());
app.use("/api", authRoutes);
app.use("/api", userRoutes);

//upload photos
app.post("/api/upload-by-link", async (req, res) => {
  const { link } = req.body;
  try {
    const newName = "photo" + Date.now() + ".jpg";
    const destination = path.join(__dirname, "uploads", newName);

    console.log("File destination:", destination);

    await imageDownloader.image({
      url: link,
      dest: destination,
    });
    res.json(newName);
  } catch (error) {
    console.error("Image download error:", error);
    res.status(500).json({ error: "Image download failed" });
  }
});

const photosMiddleware = multer({ dest: path.join(__dirname, "uploads/") });

app.post("/api/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
