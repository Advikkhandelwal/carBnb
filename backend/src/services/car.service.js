const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllCars = () => {
  return prisma.car.findMany({
    include: { owner: true },
  });
};

exports.getCar = (id) => {
  return prisma.car.findUnique({
    where: { id: Number(id) },
    include: { owner: true, reviews: { include: { user: true } } },
  });
};

exports.searchCars = (filters) => {
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
  
  return prisma.car.findMany({
    where,
    include: { owner: true },
    orderBy: { createdAt: 'desc' },
  });
};
