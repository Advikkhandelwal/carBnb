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

exports.getBookingById = (id, userId) => {
  return prisma.booking.findFirst({
    where: { 
      id: Number(id),
      userId 
    },
    include: { car: true, user: true },
  });
};

exports.updateBooking = async (id, userId, data) => {
  const booking = await prisma.booking.findFirst({
    where: { id: Number(id), userId },
  });
  
  if (!booking) {
    return null;
  }
  
  const updateData = {};
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);
  if (data.status) updateData.status = data.status;
  
  return prisma.booking.update({
    where: { id: Number(id) },
    data: updateData,
    include: { car: true },
  });
};

exports.cancelBooking = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
  });
  
  if (!booking) {
    return null;
  }
  
  return prisma.booking.update({
    where: { id: Number(id) },
    data: { status: "CANCELLED" },
  });
};
