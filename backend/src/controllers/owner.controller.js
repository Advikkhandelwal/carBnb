const ownerService = require("../services/owner.service");
const bookingService = require("../services/booking.service");

exports.addCar = async (req, res) => {
  try {
    const { brand, model, engine, fuelType, color, pricePerDay, location } = req.body;

    if (!brand || !model || !engine || !fuelType || !color || !pricePerDay || !location) {
      return res.status(400).json({
        error: "Missing required fields: brand, model, engine, fuelType, color, pricePerDay, location"
      });
    }

    const numericPrice = Number(pricePerDay);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        error: "Invalid pricePerDay. It must be a positive number.",
      });
    }

    const ownerId = req.user.id;
    let image = req.body.image;

    if (req.file) {
      // Assuming server is running on localhost:3001 or using env var
      const baseUrl = process.env.API_URL || "http://localhost:3001";
      image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const car = await ownerService.addCar(ownerId, {
      ...req.body,
      pricePerDay: numericPrice,
      image,
    });

    // Calculate rating for the newly created car (will be 0 since no reviews yet)
    const carWithRating = {
      ...car,
      averageRating: 0,
      reviewCount: 0,
    };

    res.status(201).json(carWithRating);
  } catch (error) {
    console.error("Error adding car:", error);

    // Common Prisma foreign key error when the owner user row does not exist
    if (error.code === "P2003") {
      return res.status(400).json({
        error: "Invalid owner. Please make sure your user account exists before adding a car.",
        message: error.meta?.field || undefined,
      });
    }

    res
      .status(500)
      .json({ error: "Failed to add car", message: error.message });
  }
};

exports.getOwnerCars = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const cars = await ownerService.getCars(ownerId);
    res.json(cars);
  } catch (error) {
    console.error("Error getting owner cars:", error);
    res.status(500).json({ error: "Failed to fetch owner cars", message: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const ownerId = req.user.id;
    let updateData = { ...req.body };

    if (req.file) {
      const baseUrl = process.env.API_URL || "http://localhost:3001";
      updateData.image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const car = await ownerService.updateCar(req.params.id, ownerId, updateData);

    if (!car) {
      return res.status(404).json({ error: "Car not found or you don't have permission to update it" });
    }

    res.json(car);
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Failed to update car", message: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const car = await ownerService.deleteCar(req.params.id, ownerId);

    if (!car) {
      return res.status(404).json({ error: "Car not found or you don't have permission to delete it" });
    }

    res.json({ message: "Car deleted successfully", car });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Failed to delete car", message: error.message });
  }
};

// ----- Owner bookings (for cars owned by the user) -----

exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const bookings = await bookingService.getOwnerBookings(ownerId);

    const sanitized = bookings.map((b) => {
      const booking = { ...b };

      // From owner's perspective, renter phone is only shared when CONFIRMED
      if (booking.user) {
        booking.user = { ...booking.user };
        if (booking.status !== "CONFIRMED") {
          delete booking.user.phone;
        }
      }

      // Owner already knows their own phone; no special handling needed
      return booking;
    });

    res.json(sanitized);
  } catch (error) {
    console.error("Error getting owner bookings:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch owner bookings", message: error.message });
  }
};

exports.updateOwnerBookingStatus = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { status } = req.body;

    if (
      !status ||
      !["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)
    ) {
      return res.status(400).json({
        error:
          "Invalid status. Must be PENDING, CONFIRMED, CANCELLED, or COMPLETED",
      });
    }

    // Auto-complete past bookings before updating
    await bookingService.autoCompletePastBookings();

    const booking = await bookingService.updateBookingStatusByOwner(
      req.params.id,
      ownerId,
      status
    );

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found or you don't have permission to update it",
      });
    }

    const sanitized = { ...booking };

    if (sanitized.user) {
      sanitized.user = { ...sanitized.user };
      if (sanitized.status !== "CONFIRMED") {
        delete sanitized.user.phone;
      }
    }

    res.json(sanitized);
  } catch (error) {
    console.error("Error updating owner booking status:", error);

    // Handle conflict error
    if (error.message.includes("Cannot confirm") || error.message.includes("already booked")) {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({
      error: "Failed to update booking status",
      message: error.message,
    });
  }
};
