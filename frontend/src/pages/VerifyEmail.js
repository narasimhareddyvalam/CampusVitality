import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../redux/slices/emailVerificationSlice";
import 'animate.css'; // Import animate.css for animations

const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state.emailVerification);

  useEffect(() => {
    dispatch(verifyEmail(token));
  }, [dispatch, token]);

  return (
    <div className="min-h-screen bg-[#F4F6F0] text-[#1E3A8A] flex items-center justify-center py-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg animate__animated animate__fadeIn animate__duration-500 animate__delay-1s">
        <h2 className="text-3xl font-semibold text-[#1E3A8A] mb-6 animate__animated animate__fadeIn animate__duration-500 animate__delay-1s text-center">
          Email Verification
        </h2>

        {/* Success Message */}
        {message && (
          <p className="text-green-500 text-lg mb-4 animate__animated animate__fadeIn animate__duration-500 animate__delay-2s text-center">
            {message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-lg mb-4 animate__animated animate__fadeIn animate__duration-500 animate__delay-2s text-center">
            {error}
          </p>
        )}

        {/* Information Text */}
        {!message && !error && (
          <p className="text-[#485550] text-lg mb-6 opacity-80 animate__animated animate__fadeIn animate__duration-500 animate__delay-3s text-center">
            Please wait while we verify your email. Once verified, you will be redirected to your dashboard.
          </p>
        )}

        {/* Additional Action */}
        {!message && !error && (
          <div className="mt-6 flex justify-center space-x-6">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#F4F6F0] text-[#485550] rounded-lg font-semibold text-lg hover:bg-[#C0EB6A] transition-all duration-300 transform hover:scale-110"
            >
              Retry Verification
            </button>
            <button
              onClick={() => window.location.href = "/login"}
              className="px-6 py-3 bg-[#F4F6F0] text-[#485550] rounded-lg font-semibold text-lg hover:bg-[#C0EB6A] transition-all duration-300 transform hover:scale-110"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
