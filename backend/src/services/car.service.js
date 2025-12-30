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
    include: { owner: true, reviews: true },
  });
};
