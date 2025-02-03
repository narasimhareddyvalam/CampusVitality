const express = require("express");
const planController = require("../controllers/planController");
const {
  createPlan,
  getAllPlansBySales,
  getAllPlans,
  modifyPlan,
  getPlanById,
  getAllPlansForAdmin,
} = require("../controllers/planController");

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticate, authorizeRoles("sales"), createPlan);

router.get("/plans-admin", getAllPlansForAdmin);

// Get all plans created by the logged-in sales user
router.get(
  "/my-plans",
  authenticate,
  authorizeRoles("sales"),
  getAllPlansBySales
);

// Get all plans (admin and sales users can access)
router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "sales", "student"),
  getAllPlans
);

router.patch("/:id", authenticate, authorizeRoles("sales"), modifyPlan);

router.get(
  "/getPlan/:id",
  authenticate,
  authorizeRoles("sales", "student"),
  getPlanById
);

router.get(
  "/getPlanStudent/:id",
  authenticate,
  authorizeRoles("student"),
  planController.getPlanByIdForStudent
);

module.exports = router;
