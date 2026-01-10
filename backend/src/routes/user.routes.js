const router = require("express").Router();
const { getMe, updateMe, getUserById } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");

// All user routes require authentication
router.get("/profile", authenticateToken, getMe);
router.put("/profile", authenticateToken, upload.single('image'), updateMe);
router.get("/:id", authenticateToken, getUserById);

module.exports = router;
