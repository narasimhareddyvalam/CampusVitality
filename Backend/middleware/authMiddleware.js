const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify the user's token
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add decoded user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

// Middleware to restrict access based on roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient permissions." });
    }
    next();
  };
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};

exports.ensureEmailVerified = (req, res, next) => {
  if (req.user.role === "student" && !req.user.isEmailVerified) {
    return res
      .status(403)
      .json({ message: "Please verify your email to access this feature." });
  }
  next();
};
