const router = require("express").Router();
const { getMe, updateMe, getUserById } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

// All user routes require authentication
router.get("/profile", authenticateToken, getMe);
router.put("/profile", authenticateToken, updateMe);
router.get("/:id", authenticateToken, getUserById);

module.exports = router;
