const Plan = require("../models/planModel");

exports.getAllPlans = () => Plan.find();

exports.createPlan = (planData) => Plan.create(planData);

exports.updatePlan = (id, planData) =>
  Plan.findByIdAndUpdate(id, planData, { new: true });

exports.deletePlan = (id) => Plan.findByIdAndDelete(id);
