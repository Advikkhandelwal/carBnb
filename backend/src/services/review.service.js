const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addReview = (userId, data) => {
  return prisma.review.create({
    data: {
      userId,
      carId: data.carId,
      rating: data.rating,
      comment: data.comment,
    },
  });
};

exports.getReviews = (carId) => {
  return prisma.review.findMany({
    where: { carId: Number(carId) },
  });
};
