const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Place = require("../models/Place");
const Booking = require("../models/Booking");

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.cookies.token,
      process.env.JWT_KEY,
      {},
      async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      }
    );
  });
}

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

// add places
router.post("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;

  try {
    const userData = jwt.verify(token, process.env.JWT_KEY);
    const placeDoc = await Place.create({
      owner: userData.id,
      price,
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
    res.json(placeDoc);
  } catch (err) {
    console.error("Error adding place:", err);
    res.status(500).json({ error: "Failed to add place" });
  }
});

//get specific user places
router.get("/getPlaces", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_KEY, {}, async (err, userData) => {
    if (err) {
      console.error("Error verifying JWT:", err);
      res.status(401).json({ error: "Unauthorized" });
      return; // Exit the function early
    }

    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

// get details of a specific place
router.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

//update details of a specific place
router.put("/updatePlaces", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, process.env.JWT_KEY, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

//get all places
router.get("/getAllPlaces", async (req, res) => {
  res.json(await Place.find());
});

// create user hotel booking
router.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});


//get a specific user bookings
router.get("/getUserBookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

module.exports = router;
