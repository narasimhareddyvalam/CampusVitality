import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendVerificationEmail } from "../redux/slices/emailVerificationSlice";
import 'animate.css'; // Import animate.css for animations

const SendVerificationEmail = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector(
    (state) => state.emailVerification
  );

  // Email validation function
  const isValidEmail = (email) => {
    // Regular expression to match email starting with alphabet and excluding special characters (other than @ and .)
    const regex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidEmail(email)) {
      dispatch(sendVerificationEmail(email));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F0] flex items-center justify-center py-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl animate__animated animate__fadeIn animate__delay-1s">
        <h2 className="text-3xl font-semibold text-[#485550] mb-6 text-center animate__animated animate__fadeIn animate__delay-1s">
          Send Verification Email
        </h2>

        {/* Email Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-4 border-2 border-[#485550] rounded-lg focus:outline-none focus:border-[#C0EB6A] transition-all duration-300"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !isValidEmail(email)} // Disable if loading or email is invalid
            className="w-full py-3 px-6 bg-[#F4F6F0] text-[#485550] rounded-lg font-semibold text-lg hover:bg-[#C0EB6A] transition-all duration-300"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>

        {/* Display Success or Error Messages */}
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

        {/* Additional Information */}
        {!message && !error && (
          <p className="text-[#485550] text-lg mt-6 opacity-80 text-center animate__animated animate__fadeIn animate__delay-3s">
            Please enter your email to receive a verification link.
          </p>
        )}
      </div>
    </div>
  );
};

export default SendVerificationEmail;
