// controllers/google.controller.js
const axios = require("axios");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

function googleLogin(req, res) {
  const redirectUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    }).toString();

  res.redirect(redirectUrl);
}

async function googleCallback(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Missing code from Google");
  }

  try {
    //exchage code for tokennn
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      { headers: { "Content-Type": "application/json" } }
    );


    // console.log("google Data token😶‍🌫️😶‍🌫️ ",tokenRes);
    const { access_token } = tokenRes.data;

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { 
          Authorization: `Bearer ${access_token}`
         } 
      }
    );

    const { email, name, picture: avatar } = userRes.data;
    // console.log("💕💕💕", userRes);

    // console.log("email,,, name ,picture 🤣🤣🤣🤣🤣", email, name);

    userModel.findByEmail(email, (err, users) => {
      if (err) {
        return res.status(401).json({
          meesage: "error in find by email",
          meesage: err,
        });
      }

      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = users[0];

      const token = jwt.sign(
        {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
      });
      res.locals.loginSuccess = true;

      console.log("login last tk");
      // console.log("print cookie",cookies);
      console.log("req.cookies ______________:", req.cookies);

      res.redirect("/dashboard");
    });
  } catch (err) {
    console.error("Google OAuth error:", err.response?.data || err.message);
    return res.status(500).send("Google authentication failed");
  }
}

module.exports = { googleLogin, googleCallback };
