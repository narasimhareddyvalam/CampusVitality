import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import 'animate.css'; // Import animate.css for animations

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/reset-password",
        {
          token,
          newPassword,
        }
      );
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F0] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 animate__animated animate__fadeIn animate__delay-1s">
        <h2 className="text-3xl font-semibold text-[#485550] mb-6 text-center animate__animated animate__fadeIn animate__delay-1s">
          Reset Password
        </h2>
        
        {/* Displaying success or error messages */}
        {message && (
          <p className="text-green-500 text-lg mt-4 text-center animate__animated animate__fadeIn animate__delay-2s">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-lg mt-4 text-center animate__animated animate__fadeIn animate__delay-2s">
            {error}
          </p>
        )}
        
        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-4 border-2 border-[#485550] rounded-lg focus:outline-none focus:border-[#C0EB6A] transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={!newPassword}
            className="w-full py-3 px-6 bg-[#1E3A8A] text-white rounded-lg font-semibold text-lg hover:bg-[#142A61] transition-colors duration-300"
          >
            Reset Password
          </button>
        </form>

        {/* Additional Instructions */}
        {!message && !error && (
          <p className="text-[#485550] text-lg mt-6 opacity-80 text-center animate__animated animate__fadeIn animate__delay-3s">
            Please enter your new password to reset it.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
