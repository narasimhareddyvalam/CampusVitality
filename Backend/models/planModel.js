const mongoose = require("mongoose");

// Define the schema for insurance plans
const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // Duration in months
      required: true,
    },
    features: {
      type: [String], // Array of feature descriptions
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Sales user who created the plan
      required: true,
    },
    serviceProvider: {
      type: String, // Name of the service provider
      required: true,
    },
    discontinued: {
      type: Boolean,
      default: false, // Default to false
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
