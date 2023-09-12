const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const path = require("path");

//user registration
router.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, {}, async (err, userData) => {
      if (err) throw err;
      const userDocs = await User.findById(userData.id).select("-password"); // Exclude the 'password' field
      res.json(userDocs);
    });
  } else {
    res.json(null);
  }
});



module.exports = router;
