const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addCar = (ownerId, data) => {
  return prisma.car.create({
    data: {
      ownerId,
      brand: data.brand,
      model: data.model,
      engine: data.engine,
      fuelType: data.fuelType,
      color: data.color,
      pricePerDay: data.pricePerDay,
      location: data.location,
    },
  });
};

exports.getCars = (ownerId) => {
  return prisma.car.findMany({
    where: { ownerId },
  });
};
