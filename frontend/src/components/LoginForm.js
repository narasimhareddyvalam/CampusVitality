import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  selectAuthLoading,
  selectAuthError,
} from "../redux/slices/authSlice";
import axios from "axios";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginRequest()); // Dispatch loading state
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        credentials
      );
      const { user, token } = response.data;
      localStorage.setItem("token", token);

      // Dispatch login success to Redux store
      dispatch(loginSuccess({ user, token }));
      navigate("/"); // Redirect to the home page
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      dispatch(loginFailure(errorMessage)); // Dispatch error state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row"
        style={{ height: "600px" }} // Set explicit height
      >
        {/* Left: Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://cdn.internationalstudentinsurance.com/assets/ISI/images/plan-icons/sh-icon-padded-transparent.png')`, // Replace with your image path
            backgroundColor: "#ffffff",
          }}
        ></div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-[#2c5676] mb-6">
            LOGIN
          </h2>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-2 border border-[#1e3a8a] rounded-md focus:ring-2 focus:ring-[#5AA9E6] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-2 border border-[#1e3a8a] rounded-md focus:ring-2 focus:ring-[#5AA9E6] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-semibold rounded-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2c5676] hover:bg-[#3B8CC4] transition"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className="text-sm text-[#1e3a8a] hover:underline block"
            >
              Forgot Password?
            </a>
            <p className="mt-4 text-sm text-gray-700">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-[#1e3a8a] font-semibold hover:underline"
              >
                Register now
              </a>{" "}
              and unlock the best plans tailored just for you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
