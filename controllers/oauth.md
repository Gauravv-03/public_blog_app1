const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user.model"); // adjust path
const { generateToken } = require("../utils/jwt"); // adjust if needed

// Redirect to Google login
router.get("/google", (req, res) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(redirectUrl);
});

// Handle Google callback
router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Step 1: Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { access_token, id_token } = tokenRes.data;

    // Step 2: Get user info from Google
    const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, picture } = userInfo.data;

    // Step 3: Find or create user in DB
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        avatar: picture,
        password: null, // No password for Google users
      });
    }

    // Step 4: Generate JWT token
    const token = generateToken(user._id);

    // Step 5: Set cookie and redirect
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production
    });

    res.redirect("/dashboard"); // or your frontend route

  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(500).send("Authentication failed");
  }
});

module.exports = router;
