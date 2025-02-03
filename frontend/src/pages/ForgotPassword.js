import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true); // To track email validity

  // Regular expression for email validation (ensures it starts with an alphabet character)
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  // Function to validate email and enable/disable button
  const validateEmail = (email) => {
    if (email === "") {
      setIsEmailValid(true); // If empty, set as valid (button should be disabled)
      setError(""); // Clear any previous error
      return false;
    }

    if (!emailRegex.test(email)) {
      setIsEmailValid(false); // Set invalid email flag
      setError(
        "Please enter a valid email address (must start with an alphabet)."
      );
      return false;
    }

    setIsEmailValid(true); // Reset invalid email flag if valid
    setError(""); // Clear error if email is valid
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only proceed if email is valid
    if (!validateEmail(email)) {
      return;
    }

    setMessage(""); // Clear previous messages or errors
    setError(""); // Clear previous error

    try {
      // Send email to backend API to request password reset
      const response = await axios.post(
        "http://localhost:8000/api/users/forgot-password",
        { email }
      );

      // If successful, show success message from the response
      setMessage(response.data.message);
    } catch (err) {
      // If error occurs, show backend error message
      setError(
        err.response?.data?.message || "Failed to request password reset."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F0] flex items-center justify-center py-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 max-w-4xl animate__animated animate__fadeIn animate__delay-1s">
        <h2 className="text-3xl font-semibold text-[#1e3a8a] mb-6 text-center animate__animated animate__fadeIn animate__delay-1s">
          Forgot Password
        </h2>

        {/* Displaying success or error messages */}
        {message && (
          <p className="text-blue-500 text-lg mt-4 text-center ">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-lg mt-4 text-center ">{error}</p>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value); // Validate email on change
              }}
              required
              className={`w-full p-4 border-2 rounded-lg focus:outline-none transition-all duration-300 ${
                isEmailValid
                  ? "border-[#485550] focus:border-[#1e3a8a]"
                  : "border-red-500 focus:border-red-500"
              }`}
            />
            {!isEmailValid && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid email address (must start with an
                alphabet).
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!email || !isEmailValid} // Disable button if email is invalid or empty
            className="w-full py-3 px-6 bg-[#F4F6F0] text-[#485550] rounded-lg font-semibold text-lg hover:bg-[#6e9aba] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Request Reset
          </button>
        </form>

        {/* Additional Instructions */}
        {!message && !error && (
          <p className="text-[#485550] text-lg mt-6 opacity-80 text-center animate__animated animate__fadeIn animate__delay-3s">
            Please enter your email to request a password reset link.
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
