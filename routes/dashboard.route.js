// routes/dashboard.route.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/",authMiddleware, (req, res) => {

  res.render("dashboard/index", {
    title: "Dashboard",
    user:req.user,
  });
});

module.exports = router;
