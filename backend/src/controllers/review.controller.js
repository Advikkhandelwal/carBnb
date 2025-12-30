const reviewService = require("../services/review.service");

exports.addReview = async (req, res) => {
  const userId = 1;
  const review = await reviewService.addReview(userId, req.body);
  res.status(201).json(review);
};

exports.getReviews = async (req, res) => {
  const reviews = await reviewService.getReviews(req.params.carId);
  res.json(reviews);
};
