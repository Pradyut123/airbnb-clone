const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Place = require("../models/Place");

//user profile
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

//add places
router.get("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, process.env.JWT_KEY, {}, async (err, userData) => {
    if (err) throw err;
    const placeDocs = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDocs);
  });
});

module.exports = router;
