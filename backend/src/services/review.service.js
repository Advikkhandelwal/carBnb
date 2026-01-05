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
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
};

exports.getReviewById = (id) => {
  return prisma.review.findUnique({
    where: { id: Number(id) },
    include: { user: true, car: true },
  });
};

exports.updateReview = async (id, userId, data) => {
  // Verify review belongs to user
  const review = await prisma.review.findFirst({
    where: { id: Number(id), userId },
  });
  
  if (!review) {
    return null;
  }
  
  const updateData = {};
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.comment !== undefined) updateData.comment = data.comment;
  
  return prisma.review.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

exports.deleteReview = async (id, userId) => {
  // Verify review belongs to user
  const review = await prisma.review.findFirst({
    where: { id: Number(id), userId },
  });
  
  if (!review) {
    return null;
  }
  
  return prisma.review.delete({
    where: { id: Number(id) },
  });
};
