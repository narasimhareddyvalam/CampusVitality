const express = require("express");
const {
  createUser,
  login,
  modifyUser,
  getAllStudents,
  getAllSalesUsers,
  updateStudentVerification,
  getSalesUsers,
  deleteSalesUser,
  updateUser,
  getUserById,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/userController");
const {
  authenticateToken,
  authorizeAdmin,
  authenticate,
  authorizeRoles,
  ensureEmailVerified,
} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", upload.single("admissionLetter"), createUser);
router.post("/login", login);
router.put("/users/:id", authenticate, authorizeAdmin, modifyUser);
router.get("/students", authenticate, authorizeRoles("admin"), getAllStudents);
router.get("/users/sales", authenticate, authorizeAdmin, getAllSalesUsers);
router.patch(
  "/:id/verify",
  authenticate,
  authorizeRoles("admin"), // Only admins can modify this status
  updateStudentVerification
);

router.delete(
  "/sales/:id",
  authenticate,
  authorizeRoles("admin", "sales"),
  deleteSalesUser
);

router.get(
  "/sales",
  authenticate,
  authorizeRoles("admin", "sales"), // Both admin and sales can access
  getSalesUsers
);

router.get("/:id", authenticate, getUserById); // Get user by ID
router.patch("/:id", authenticate, updateUser);
router.post("/forgot-password", requestPasswordReset);

// Route to reset the password
router.post("/reset-password", resetPassword);

module.exports = router;
