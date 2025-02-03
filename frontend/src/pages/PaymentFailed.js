import React from "react";
import { useNavigate } from "react-router-dom"; // Import React Router for navigation

const PaymentFailed = () => {
  const navigate = useNavigate(); // React Router hook to handle page redirection

  const handleRedirect = () => {
    navigate("/"); // Redirect to the home page (root path)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-lato">
      {/* Error Message Section */}
      <div className="max-w-lg w-full text-center bg-white p-10 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500 animate__animated animate__fadeIn animate__delay-1s">
        <div className="mb-6">
          {/* New Icon (Payment Failed) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-red-600 mx-auto animate__animated animate__shakeX animate__delay-1s"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M5.1 5.1l13.8 13.8M5.1 19.9l13.8-13.8"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-[#1E3A8A] mb-4 animate__animated animate__fadeIn animate__delay-2s">
          Oops! Payment Failed
        </h1>
        <p className="text-lg text-[#5AA9E6] mb-6 animate__animated animate__fadeIn animate__delay-3s">
          We encountered an issue processing your payment. Don't worry, you can
          retry or contact support.
        </p>

        {/* Retry and Redirect Button */}
        <div className="mt-6">
          <button
            onClick={handleRedirect}
            className="bg-[#1E3A8A] text-white py-3 px-8 rounded-full hover:bg-[#142A61] transition-all duration-300 transform shadow-xl animate__animated animate__bounceIn animate__delay-4s hover:shadow-2xl"
          >
            Go Back to Home
          </button>
        </div>
      </div>

      {/* Additional Information Section */}
      <section className="mt-12 text-center animate__animated animate__fadeIn animate__delay-5s">
        <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4">
          But Don’t Worry! Here’s What You Can Do
        </h2>

        {/* Card Layout for Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-8 justify-items-center">
          {/* Retry Payment */}
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#C0EB6A] text-[#2A3A2B] text-3xl mb-6 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 10l4-4m0 0l-4-4m4 4H3"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#1E3A8A] mb-4">
              Retry Your Payment
            </h3>
            <p className="text-[#5AA9E6]">
              Double-check your payment details and try again to complete the
              transaction.
            </p>
          </div>

          {/* Contact Support */}
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FF6B6B] text-white text-3xl mb-6 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11l-2 2m0 0l-2-2m2 2H5"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#1E3A8A] mb-4">
              Contact Customer Support
            </h3>
            <p className="text-[#5AA9E6]">
              Reach out to our support team for assistance. We’re here to help
              you resolve the issue.
            </p>
          </div>

          {/* Refund Information */}
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#A8D25E] text-[#2A3A2B] text-3xl mb-6 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#1E3A8A] mb-4">
              Refund Process
            </h3>
            <p className="text-[#5AA9E6]">
              If your money has been deducted, it will be reflected back into
              your account within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentFailed;
