const User = require("../models/userModel");
const Plan = require("../models/planModel");
const Booking = require("../models/booking");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Generate a JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      name,
      phone,
      address,
      role,
      "studentDetails.collegeId": collegeId,
      "studentDetails.collegeName": collegeName,
      "studentDetails.degreeType": degreeType,
      "studentDetails.graduationDate.year": graduationYear,
      "studentDetails.graduationDate.month": graduationMonth,
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Student-specific validation
    let studentDetails = {};
    if (role === "student") {
      if (!collegeId || !collegeName) {
        return res.status(400).json({
          message: "College ID and College Name are required for students.",
        });
      }
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Admission letter PDF is required for students." });
      }

      // Build studentDetails object
      studentDetails = {
        collegeId,
        collegeName,
        degreeType,
        graduationDate: {
          year: graduationYear,
          month: graduationMonth,
        },
        collegeAdmissionLetterURL: `/uploads/${req.file.filename}`,
      };
    }

    // Create user object
    const userData = {
      username,
      email,
      password,
      name,
      phone,
      address,
      role,
      studentDetails: role === "student" ? studentDetails : undefined,
    };

    const user = await User.create(userData);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    // Handle Duplicate Key Errors
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0]; // e.g., 'email' or 'username'
      return res.status(409).json({
        message: `The ${duplicateField} '${error.keyValue[duplicateField]}' is already in use.`,
      });
    }

    // Handle General Errors
    res.status(500).json({ message: "Failed to register student" });
  }
};

// Login a user and generate JWT
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        emailVerified: user.isEmailVerified,
        studentVerified: user.studentDetails.isStudentVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Modify a user's details (except role)
exports.modifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent modification of role
    if (updates.role) {
      return res
        .status(400)
        .json({ message: "Modifying user role is not allowed" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await userService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// Get all sales users
exports.getAllSalesUsers = async (req, res) => {
  try {
    const salesUsers = await User.find({ role: "sales" });
    res.status(200).json(salesUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bookings by user
exports.getBookingsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user existence
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch bookings for the user
    const bookings = await Booking.find({ userId: id }).populate(
      "planId",
      "planName price duration"
    );

    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStudentVerification = async (req, res) => {
  try {
    const { id } = req.params; // Get student ID from the request URL
    const { isStudentVerified } = req.body; // Get updated value from the request body

    if (typeof isStudentVerified !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid isStudentVerified value" });
    }

    const updatedStudent = await userService.updateStudentVerification(
      id,
      isStudentVerified
    );

    res.status(200).json({
      message: "Student verification status updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student verification:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.createStudentWithUpload = async (req, res) => {
  try {
    const { username, email, password, role, studentDetails } = req.body;

    if (role !== "student") {
      return res
        .status(400)
        .json({ message: "Only students can upload admission letters." });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Admission letter PDF is required." });
    }

    // Construct the student object
    const newUser = new User({
      username,
      email,
      password,
      role,
      studentDetails: {
        ...studentDetails,
        collegeAdmissionLetterURL: `/uploads/${req.file.filename}`, // Save file path
      },
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Student registered successfully", user: newUser });
  } catch (error) {
    console.error("Error creating student with upload:", error.message);
    res.status(500).json({ message: "Failed to register student" });
  }
};

exports.getSalesUsers = async (req, res) => {
  try {
    const salesUsers = await User.find({ role: "sales" }).select(
      "username email name phone"
    );
    res.status(200).json(salesUsers);
  } catch (error) {
    console.error("Error fetching sales users:", error.message);
    res.status(500).json({ message: "Failed to fetch sales users." });
  }
};

exports.deleteSalesUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Sales user not found" });
    }

    // Check if the user is a sales user
    if (user.role !== "sales") {
      return res
        .status(400)
        .json({ message: "Only sales users can be deleted" });
    }

    // Delete the sales user
    await user.deleteOne({ _id: id });

    const result = await Plan.updateMany(
      { createdBy: user._id },
      { discontinued: true }
    );
    console.log(
      `Plans discontinued for sales user ${user._id}:`,
      result.modifiedCount
    );

    res.status(200).json({ message: "Sales user deleted successfully" });
  } catch (error) {
    console.error("Error deleting sales user:", error.message);
    res.status(500).json({ message: "Failed to delete sales user" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Failed to fetch user details." });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Use existing values as fallbacks for undefined fields
    const updatedData = {
      username: req.body.username || existingUser.username,
      email: req.body.email || existingUser.email,
      name: req.body.name || existingUser.name,
      phone: req.body.phone || existingUser.phone,
      address: req.body.address || existingUser.address,
      studentDetails: {
        collegeId:
          req.body.studentDetails?.collegeId ||
          existingUser.studentDetails?.collegeId,
        collegeName:
          req.body.studentDetails?.collegeName ||
          existingUser.studentDetails?.collegeName,
        degreeType:
          req.body.studentDetails?.degreeType ||
          existingUser.studentDetails?.degreeType,
        graduationDate: {
          year:
            req.body.studentDetails?.graduationDate?.year ||
            existingUser.studentDetails?.graduationDate?.year,
          month:
            req.body.studentDetails?.graduationDate?.month ||
            existingUser.studentDetails?.graduationDate?.month,
        },
        collegeAdmissionLetterURL:
          existingUser.studentDetails?.collegeAdmissionLetterURL, // File remains unchanged
      },
      alreadyEnrolledPlan: {
        isEnrolled:
          req.body.studentDetails?.alreadyEnrolledPlan?.isEnrolled ||
          existingUser.studentDetails?.alreadyEnrolledPlan?.isEnrolled,
        details: {
          insuranceCompany:
            req.body.studentDetails?.alreadyEnrolledPlan?.details
              ?.insuranceCompany ||
            existingUser.studentDetails?.alreadyEnrolledPlan?.details
              ?.insuranceCompany,
          duration:
            req.body.studentDetails?.alreadyEnrolledPlan?.details?.duration ||
            existingUser.studentDetails?.alreadyEnrolledPlan?.details?.duration,
          hasPreviousClaim:
            req.body.studentDetails?.alreadyEnrolledPlan?.details
              ?.hasPreviousClaim ||
            existingUser.studentDetails?.alreadyEnrolledPlan?.details
              ?.hasPreviousClaim,
          previousClaimDetails:
            req.body.studentDetails?.alreadyEnrolledPlan?.details
              ?.previousClaimDetails ||
            existingUser.studentDetails?.alreadyEnrolledPlan?.details
              ?.previousClaimDetails,
        },
      },
    };

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Failed to update user details." });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 hour expiration

    // Save the token and expiry in the user's record
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpires;
    await user.save();

    // Create the email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or other email provider
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Password Reset",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error requesting password reset:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash and save the new password
    const salt = await bcrypt.genSalt(10);
    user.password = newPassword;
    user.passwordResetToken = null; // Clear the token
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
