import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/slices/authSlice";

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = useSelector(selectUser); // Get user from Redux store

  // If no user is logged in, redirect to the home page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a role is required and the user's role doesn't match, redirect to home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
