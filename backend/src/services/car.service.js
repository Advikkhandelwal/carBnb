const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllCars = async () => {
  const cars = await prisma.car.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          // phone intentionally excluded from general car listing
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' }, // Show newest cars first
  });

  // Calculate average rating for each car
  return cars.map((car) => {
    const ratings = car.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

    const { reviews, ...carWithoutReviews } = car;
    return {
      ...carWithoutReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: reviews.length,
    };
  });
};

exports.getCar = async (id) => {
  const car = await prisma.car.findUnique({
    where: { id: Number(id) },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          // phone intentionally excluded here; it is shared via bookings logic only
        },
      },
      reviews: {
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
      },
    },
  });

  if (!car) return null;

  // Calculate average rating
  const ratings = car.reviews.map((r) => r.rating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  return {
    ...car,
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: car.reviews.length,
  };
};

exports.searchCars = async (filters) => {
  const where = {};

  if (filters.location) {
    where.location = { contains: filters.location };
  }
  if (filters.brand) {
    where.brand = { contains: filters.brand };
  }
  if (filters.model) {
    where.model = { contains: filters.model };
  }
  if (filters.fuelType) {
    where.fuelType = filters.fuelType;
  }
  if (filters.minPrice !== undefined) {
    where.pricePerDay = { ...where.pricePerDay, gte: parseFloat(filters.minPrice) };
  }
  if (filters.maxPrice !== undefined) {
    where.pricePerDay = { ...where.pricePerDay, lte: parseFloat(filters.maxPrice) };
  }

  const cars = await prisma.car.findMany({
    where,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate average rating for each car
  return cars.map((car) => {
    const ratings = car.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

    const { reviews, ...carWithoutReviews } = car;
    return {
      ...carWithoutReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    };
  });
};

exports.createCar = async (carData) => {
  return prisma.car.create({
    data: carData,
  });
};

exports.updateCar = async (id, carData) => {
  return prisma.car.update({
    where: { id: Number(id) },
    data: carData,
  });
};

exports.deleteCar = async (id) => {
  return prisma.car.delete({
    where: { id: Number(id) },
  });
};
