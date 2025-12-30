const bookingService = require("../services/booking.service");

exports.createBooking = async (req, res) => {
  const userId = 1;
  const booking = await bookingService.createBooking(userId, req.body);
  res.status(201).json(booking);
};

exports.getBookings = async (req, res) => {
  const userId = 1;
  const bookings = await bookingService.getBookings(userId);
  res.json(bookings);
};

exports.cancelBooking = async (req, res) => {
  await bookingService.cancelBooking(req.params.id);
  res.json({ message: "Booking cancelled" });
};

