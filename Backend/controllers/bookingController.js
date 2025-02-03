const Booking = require("../models/booking");
const User = require("../models/userModel");
const Plan = require("../models/planModel");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { planId, paymentInfo } = req.body;
    const userId = req.user.id; // Extract logged-in user ID from token

    // Validate plan ID
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    // Check if user is verified
    const user = await User.findById(userId);
    if (!user.studentDetails.isStudentVerified) {
      return res.status(403).json({
        message:
          "You are not verified. Please complete verification before purchasing.",
      });
    }

    // Create a new booking
    const booking = new Booking({
      userId,
      planId,
      amountPaid: plan.price,
      paymentInfo: {
        id: paymentInfo.id,
        status: paymentInfo.status,
      },
      paidAt: new Date(),
    });

    await booking.save();

    res.status(201).json({ message: "Booking created successfully.", booking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ message: "Failed to create booking." });
  }
};

// Get a booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("userId", "name email")
      .populate("planId", "planName price duration");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email") // Populate user details
      .populate("planId", "planName price duration serviceProvider"); // Populate plan details

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

// Get bookings by sales user
exports.getBookingsBySalesUser = async (req, res) => {
  try {
    const salesUserId = req.user.id;

    // Find all plans created by the sales user
    const plans = await Plan.find({ createdBy: salesUserId }).select("_id");

    // Fetch bookings for those plans
    const bookings = await Booking.find({
      planId: { $in: plans.map((p) => p._id) },
    })
      .populate("userId", "name email") // Populate user details
      .populate("planId", "planName price duration"); // Populate plan details

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings for sales user:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "expired", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bookings for a user
exports.getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId }).populate(
      "planId",
      "planName price duration"
    );

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMyPlans = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user's ID

    // Find all bookings for the user
    const bookings = await Booking.find({ userId })
      .populate("planId", "planName duration price")
      .exec();

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};
