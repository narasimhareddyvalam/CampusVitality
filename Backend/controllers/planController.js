const planService = require("../services/planService");
const Plan = require("../models/planModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
// Get all plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await planService.getAllPlans();
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPlansForAdmin = async (req, res) => {
  try {
    const plans = await Plan.find({})
      .populate("createdBy", "username email") // Populate sales user info
      .exec();

    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error.message);
    res.status(500).json({ message: "Failed to fetch plans." });
  }
};

// Get plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the plan by ID
    const plan = await Plan.findById(id);
    const user = await User.findById(req.user.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    // Ensure the logged-in sales user is the creator of the plan
    if (plan.createdBy.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this plan." });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching plan details:", error.message);
    res.status(500).json({ message: "Failed to fetch plan details." });
  }
};

exports.getPlanByIdForStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate plan ID format
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }

    // Find the plan by ID
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching plan details for student:", error.message);
    res.status(500).json({ message: "Failed to fetch plan details." });
  }
};

// Create a new plan
exports.createPlan = async (req, res) => {
  try {
    // Fetch the sales user details from the database
    const salesUser = await User.findById(req.user.id);

    // Ensure the user exists and is a sales user
    if (!salesUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (salesUser.role !== "sales") {
      return res
        .status(403)
        .json({ message: "Only sales users can create plans." });
    }

    const {
      planName,
      description,
      price,
      duration,
      features,
      serviceProvider,
    } = req.body;

    // Validate input
    if (
      !planName ||
      !description ||
      !price ||
      !duration ||
      !features ||
      !serviceProvider
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create the new plan
    const plan = new Plan({
      planName,
      description,
      price,
      duration,
      features,
      createdBy: salesUser._id, // Use the sales user’s ID
      serviceProvider,
    });

    const savedPlan = await plan.save();
    res
      .status(201)
      .json({ message: "Plan created successfully", plan: savedPlan });
  } catch (error) {
    console.error("Error creating plan:", error.message);
    res.status(500).json({ message: "Failed to create plan." });
  }
};

// Update a plan
exports.updatePlan = async (req, res) => {
  try {
    const updatedPlan = await planService.updatePlan(req.params.id, req.body);
    if (!updatedPlan)
      return res.status(404).json({ message: "Plan not found" });
    res.status(200).json(updatedPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all plans created by the logged-in sales user
exports.getAllPlansBySales = async (req, res) => {
  try {
    const salesUser = await User.findById(req.user.id);
    const plans = await Plan.find({ createdBy: salesUser._id });
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching plans by sales user:", error.message);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

// Get all plans (admin and sales)
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().populate("createdBy", "username email");
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching all plans:", error.message);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

// Delete a plan
exports.deletePlan = async (req, res) => {
  try {
    const deletedPlan = await planService.deletePlan(req.params.id);
    if (!deletedPlan)
      return res.status(404).json({ message: "Plan not found" });
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.modifyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the plan by ID
    const plan = await Plan.findById(id);
    const user = await User.findById(req.user.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    console.log(plan.createdBy);
    console.log(user._id);

    // Ensure the logged-in sales user is the creator of the plan
    if (plan.createdBy.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this plan." });
    }

    // Apply updates
    Object.keys(updates).forEach((key) => {
      plan[key] = updates[key];
    });

    await plan.save();

    res.status(200).json({ message: "Plan updated successfully", plan });
  } catch (error) {
    console.error("Error modifying plan:", error.message);
    res.status(500).json({ message: "Failed to modify plan" });
  }
};
