// middleware/errorMiddleware.js
exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

exports.notFound = (req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
};
