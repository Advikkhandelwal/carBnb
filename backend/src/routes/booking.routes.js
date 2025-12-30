const router = require("express").Router();
const {
  createBooking,
  getBookings,
  cancelBooking,
} = require("../controllers/booking.controller");

router.post("/", createBooking);
router.get("/", getBookings);
router.delete("/:id", cancelBooking);

module.exports = router;


