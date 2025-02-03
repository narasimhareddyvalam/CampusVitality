const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use("/uploads", express.static("uploads"));
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    next(); // Skip body parsing for the webhook
  } else {
    express.json()(req, res, next);
  }
});

// API Routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/plans", planRoutes); // Plan routes
app.use("/api/bookings", bookingRoutes); // Booking routes
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Student Insurance Broker Platform API!");
});

// Middleware for handling 404 errors
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Middleware

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
