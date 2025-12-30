const express = require("express");
const router = express.Router();

// later we will plug Google OAuth here
router.get("/google", (req, res) => {
  res.json({ message: "Google OAuth route" });
});

router.get("/me", (req, res) => {
  res.json({ message: "Get logged-in user" });
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

module.exports = router;
