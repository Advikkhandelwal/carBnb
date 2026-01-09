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
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          // phone intentionally excluded from public reviews
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

exports.getReviewById = (id) => {
  return prisma.review.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          // phone intentionally excluded from public review detail
        },
      },
      car: true,
    },
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

exports.getUserReviews = (userId) => {
  return prisma.review.findMany({
    where: { userId },
    include: {
      car: {
        select: {
          id: true,
          brand: true,
          model: true,
          image: true,
          owner: {
            select: {
              name: true,
              image: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

exports.checkReviewEligibility = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: Number(bookingId),
      userId,
      status: 'COMPLETED',
    }
  });

  if (!booking) return false;

  // Check if a review already exists for this booking (assuming one review per booking rule, 
  // though schema links review to car+user, not booking directly. 
  // For strict one-review-per-booking, we'd need a bookingId on Review model.
  // For now, allow if they have completed a booking.)

  // Refined logic: Check if they ALREADY reviewed this car based on this specific booking? 
  // Since Review schema doesn't have bookingId, we can just return true if they have a completed booking.
  // The frontend can enforce one-time UI or we can check if they reviewed this CAR recently.

  // Let's implement a simple check: return true if booking is completed.
  return true;
};
