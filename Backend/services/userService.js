const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Create a new user
exports.createUser = async (userData) => {
  const {
    username,
    email,
    password,
    role,
    name,
    phone,
    address,
    studentDetails,
  } = userData;

  // Check for duplicate username or email
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new Error("Username or email already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Prepare the user object
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role,
    name,
    phone,
    address,
    studentDetails: role === "student" ? studentDetails : undefined, // Include studentDetails only for students
  });

  // Save the user
  return await newUser.save();
};

// Login a user and generate JWT
exports.login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

// Modify user details (except role)
exports.modifyUser = async (userId, updates) => {
  if (updates.role) {
    throw new Error("Modifying user role is not allowed");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  });
  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

// Fetch all students
exports.getAllStudents = async () => {
  return await User.find({ role: "student" });
};

// Fetch all sales users
exports.getAllSalesUsers = async () => {
  return await User.find({ role: "sales" });
};

// Fetch bookings by user
exports.getBookingsByUser = async (userId, BookingModel) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await BookingModel.find({ userId }).populate(
    "planId",
    "planName price duration"
  );
};

exports.updateStudentVerification = async (studentId, isStudentVerified) => {
  const student = await User.findById(studentId);

  if (!student || student.role !== "student") {
    throw new Error("Student not found");
  }

  // Update the verification status
  student.studentDetails.isStudentVerified = isStudentVerified;
  return await student.save();
};
