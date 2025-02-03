const express = require("express");
const {
  createPaymentIntent,
  generateInvoice,
  createCheckoutSession,
} = require("../controllers/paymentController");
const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();
const { stripeWebhook } = require("../controllers/paymentController");
const bodyParser = require("body-parser");

// Create a payment intent
router.post(
  "/create-payment-intent",
  authenticate,
  authorizeRoles("student"),
  createPaymentIntent
);

// Generate an invoice
router.get(
  "/invoice/:paymentId",
  authenticate,
  authorizeRoles("student"),
  generateInvoice
);

router.post(
  "/create-checkout-session",
  authenticate,
  authorizeRoles("student"),
  createCheckoutSession
);

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }), // Use express.raw instead of bodyParser
  stripeWebhook
);

// router.post("/webhook", (req, res) => {
//   console.log("Webhook route hit!");
//   res.status(200).send("Webhook route hit!");
// });

module.exports = router;
