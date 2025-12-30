const router = require("express").Router();
const { addReview, getReviews } = require("../controllers/review.controller");

router.post("/", addReview);
router.get("/:carId", getReviews);

module.exports = router;
