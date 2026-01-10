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
      pricePerDay: Number(data.pricePerDay),
      location: data.location,
      image: data.image ?? null,
    },
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
  });
};

exports.getCars = (ownerId) => {
  return prisma.car.findMany({
    where: { ownerId },
  });
};

exports.updateCar = async (carId, ownerId, data) => {
  // Verify car belongs to owner
  const car = await prisma.car.findFirst({
    where: { id: Number(carId), ownerId },
  });
  
  if (!car) {
    return null;
  }
  
  return prisma.car.update({
    where: { id: Number(carId) },
    data: {
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

exports.deleteCar = async (carId, ownerId) => {
  // Verify car belongs to owner
  const car = await prisma.car.findFirst({
    where: { id: Number(carId), ownerId },
  });
  
  if (!car) {
    return null;
  }
  
  return prisma.car.delete({
    where: { id: Number(carId) },
  });
};
