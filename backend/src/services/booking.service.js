const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createBooking = async (userId, data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }

  if (startDate < today) {
    throw new Error("Start date cannot be in the past");
  }

  if (endDate <= startDate) {
    throw new Error("End date must be after start date");
  }

  // Check for date conflicts with existing PENDING or CONFIRMED bookings
  const isAvailable = await exports.checkAvailability(data.carId, data.startDate, data.endDate);
  if (!isAvailable) {
    throw new Error("Car is not available for the selected dates");
  }

  return prisma.booking.create({
    data: {
      userId,
      carId: data.carId,
      startDate,
      endDate,
      status: "PENDING",
    },
  });
};

exports.getBookings = (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      car: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
        },
      },
    },
  });
};

exports.getBookingById = (id, userId) => {
  return prisma.booking.findFirst({
    where: {
      id: Number(id),
      userId
    },
    include: {
      car: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
    },
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
    include: {
      car: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
    },
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

// Owner-side helpers
exports.getOwnerBookings = (ownerId) => {
  return prisma.booking.findMany({
    where: {
      car: {
        ownerId,
      },
    },
    include: {
      car: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
    },
  });
};

exports.updateBookingStatusByOwner = async (id, ownerId, status) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: Number(id),
      car: {
        ownerId,
      },
    },
  });

  if (!booking) {
    return null;
  }

  // If confirming, re-check for date conflicts (excluding this booking)
  if (status === "CONFIRMED") {
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        carId: booking.carId,
        id: { not: Number(id) },
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          {
            startDate: { lte: booking.endDate },
            endDate: { gte: booking.startDate },
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new Error("Cannot confirm: Car is already booked for these dates");
    }
  }

  const updateData = { status };

  const updated = await prisma.booking.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      car: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
    },
  });

  return updated;
};

exports.checkAvailability = async (carId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      carId: Number(carId),
      status: { in: ["PENDING", "CONFIRMED"] }, // Ignore CANCELLED and COMPLETED (though COMPLETED should effectively be in the past)
      OR: [
        {
          startDate: { lte: end },
          endDate: { gte: start },
        },
      ],
    },
  });

  return !overlappingBooking;
};

exports.getCarBookings = (carId) => {
  return prisma.booking.findMany({
    where: {
      carId: Number(carId),
      status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      status: true,
    },
  });
};

// Auto-complete past bookings (should be called periodically or on booking fetch)
exports.autoCompletePastBookings = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updated = await prisma.booking.updateMany({
    where: {
      status: "CONFIRMED",
      endDate: { lt: today },
    },
    data: {
      status: "COMPLETED",
    },
  });

  return updated.count;
};
