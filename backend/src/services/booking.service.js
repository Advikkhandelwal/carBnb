const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createBooking = (userId, data) => {
  return prisma.booking.create({
    data: {
      userId,
      carId: data.carId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
};

exports.getBookings = (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    include: { car: true },
  });
};

exports.cancelBooking = (id) => {
  return prisma.booking.update({
    where: { id: Number(id) },
    data: { status: "CANCELLED" },
  });
};
