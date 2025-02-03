const express = require("express");
const {
  sendVerificationEmail,
  verifyEmail,
} = require("../controllers/authController");

const router = express.Router();

router.post("/send-verification-email", sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
