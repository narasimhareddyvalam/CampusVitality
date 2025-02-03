import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../redux/slices/authSlice";
import Confetti from "react-confetti"; // Confetti effect
import 'animate.css'; // Import animate.css for animations

const SuccessPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser); // Ensure user state is accessed properly

  if (!user) {
    navigate("/login"); // Redirect if user state is missing
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#F4F6F0] text-[#1E3A8A] flex flex-col items-center justify-center">
      {/* Confetti Animation */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={200}
      />

      {/* Success Message Box */}
      <div className="bg-white p-8 rounded-lg shadow-xl text-center animate__animated animate__fadeIn animate__duration-500 animate__delay-1s relative z-10">
        <div className="text-[#1E3A8A] text-6xl mb-4">
          <i className="fas fa-check-circle"></i> {/* Success icon */}
        </div>
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-[#1E3A8A] max-w-3xl mx-auto mb-6 opacity-80 animate__animated animate__fadeIn animate__duration-500 animate__delay-2s">
          Thank you for your purchase. You can view your plans or explore more options below.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={() => navigate("/my-plans")}
            className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg font-semibold text-lg hover:bg-[#142A61] transition-all duration-300"
          >
            My Plans
          </button>
          <button
            onClick={() => navigate("/browse-plans")}
            className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg font-semibold text-lg hover:bg-[#142A61] transition-all duration-300"
          >
            Browse Plans
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
