const router = require("express").Router();
const { 
  addReview, 
  getReviews, 
  getReviewById,
  updateReview,
  deleteReview 
} = require("../controllers/review.controller");

router.post("/", addReview);
router.get("/car/:carId", getReviews);
router.get("/:id", getReviewById);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
