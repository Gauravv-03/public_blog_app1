const express = require("express");
const { googleLogin, googleCallback } = require("../controllers/google.controller");

const router = express.Router();

router.get("/auth/google", googleLogin);
router.get("/auth/google/callback", googleCallback);

module.exports = router;