const reviewService = require("../services/review.service");

exports.addReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;
    
    if (!carId || !rating) {
      return res.status(400).json({ error: "Missing required fields: carId, rating" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const userId = 1; // TODO: Get from auth middleware
    const review = await reviewService.addReview(userId, req.body);
    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review", message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getReviews(req.params.carId);
    res.json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews", message: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    res.json(review);
  } catch (error) {
    console.error("Error getting review:", error);
    res.status(500).json({ error: "Failed to fetch review", message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const userId = 1; // TODO: Get from auth middleware
    const { rating, comment } = req.body;
    
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    
    const review = await reviewService.updateReview(req.params.id, userId, req.body);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found or you don't have permission to update it" });
    }
    
    res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review", message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const userId = 1; // TODO: Get from auth middleware
    const review = await reviewService.deleteReview(req.params.id, userId);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found or you don't have permission to delete it" });
    }
    
    res.json({ message: "Review deleted successfully", review });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review", message: error.message });
  }
};
