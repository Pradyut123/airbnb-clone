const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const bcryptSalt = bcrypt.genSaltSync(10);

//user registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user if the email doesn't exist
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDocs = await User.findOne({ email });

    if (userDocs) {
      // Compare the provided password with the stored hash
      const passwordMatch = await bcrypt.compare(password, userDocs.password);

      if (passwordMatch) {
        // Passwords match, login successful
        jwt.sign(
          { email: userDocs.email, id: userDocs._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }, // Token expiration time (adjust as needed)
          (err, token) => {
            if (err) {
              console.error("Error signing JWT token:", err);
              return res.status(500).json({ message: "Server error" });
            }

            res.cookie("token", token, {
              httpOnly: true,
              maxAge: 3600000, // Cookie expiration time in milliseconds (adjust as needed)
            });

            res.status(200).json(userDocs);
          }
        );
      } else {
        // Passwords do not match, login failed
        res.status(401).json({ message: "Login failed: Incorrect password" });
      }
    } else {
      // User not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//user logout
router.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

module.exports = router;
