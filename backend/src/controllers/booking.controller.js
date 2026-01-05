const bookingService = require("../services/booking.service");

exports.createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    
    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields: carId, startDate, endDate" });
    }

    const userId = 1; // TODO: Get from auth middleware
    const booking = await bookingService.createBooking(userId, req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking", message: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const userId = 1; // TODO: Get from auth middleware
    const bookings = await bookingService.getBookings(userId);
    res.json(bookings);
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings", message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const userId = 1; // TODO: Get from auth middleware
    const booking = await bookingService.getBookingById(req.params.id, userId);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json(booking);
  } catch (error) {
    console.error("Error getting booking:", error);
    res.status(500).json({ error: "Failed to fetch booking", message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const userId = 1; // TODO: Get from auth middleware
    const { startDate, endDate, status } = req.body;
    
    // Validate status if provided
    if (status && !['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be PENDING, CONFIRMED, CANCELLED, or COMPLETED" });
    }
    
    const booking = await bookingService.updateBooking(req.params.id, userId, req.body);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found or you don't have permission to update it" });
    }
    
    res.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking", message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Failed to cancel booking", message: error.message });
  }
};

