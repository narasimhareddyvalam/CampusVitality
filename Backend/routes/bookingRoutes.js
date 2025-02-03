const express = require("express");
const bookingController = require("../controllers/bookingController");
const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const {
  createBooking,
  getMyPlans,
} = require("../controllers/bookingController");
const router = express.Router();

router.post("/", authenticate, authorizeRoles("student"), createBooking);

// Get all bookings for the logged-in user
router.get("/my-plans", authenticate, authorizeRoles("student"), getMyPlans);

router.get("/", bookingController.getAllBookings);

// Route to get bookings specific to sales user
router.get(
  "/sales",
  authenticate,
  authorizeRoles(["sales"]),
  bookingController.getBookingsBySalesUser
);

module.exports = router;
