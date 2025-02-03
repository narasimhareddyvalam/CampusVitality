import React, { useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa"; // Success icon
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Error icon
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const regexPatterns = {
  planName: /^[a-zA-Z\s.'-]{3,25}$/,
  description: /^(\b\w+\b[\s]*){1,150}$/,
  price: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
};

const toastMessages = {
  planName:
    "Plan Name must be 3-25 characters long and can include letters, spaces, periods, apostrophes, or hyphens.",
  description:
    "Description must have up to 150 words with valid alphanumeric characters.",
  price:
    "Price must be a valid number, optionally with up to two decimal places.",
};

const CreatePlan = () => {
  const [formData, setFormData] = useState({
    planName: "",
    description: "",
    price: "",
    features: "",
    serviceProvider: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const serviceProviders = [
    "Blue Cross Blue Shield",
    "UnitedHealthcare",
    "Aetna",
    "Cigna",
    "Humana",
    "Kaiser Permanente",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate input value in real-time only for fields with regex patterns
    if (regexPatterns[name]) {
      if (value && !regexPatterns[name].test(value)) {
        setValidationErrors((prev) => ({
          ...prev,
          [name]: toastMessages[name],
        }));
      } else {
        setValidationErrors((prev) => {
          const updatedErrors = { ...prev };
          delete updatedErrors[name];
          return updatedErrors;
        });
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    // Display toast message on blur only if the input fails validation
    if (validationErrors[name]) {
      toast.error(toastMessages[name]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/plans",
        {
          ...formData,
          duration: 1,
          features: formData.features.split(","),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Plan created successfully!");
      toast.success("Plan created successfully!");
      setError("");
      setFormData({
        planName: "",
        description: "",
        price: "",
        features: "",
        serviceProvider: "",
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create plan.";
      setError(errorMessage);
      toast.error(errorMessage);
      setSuccess("");
    }
  };

  const isFormValid = Object.keys(validationErrors).length === 0;

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4 sm:px-6 lg:px-8 pt-32">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-semibold text-[#1E3A8A] text-center mb-6 animate__animated animate__fadeIn">
          Create New Plan
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-center">
              <HiOutlineExclamationCircle className="mr-2 text-2xl" />
              <p>{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex items-center">
              <FaCheckCircle className="mr-2 text-2xl" />
              <p>{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Plan Name
            </label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`mt-1 block w-full px-4 py-2 border ${
                validationErrors.planName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`mt-1 block w-full px-4 py-2 border ${
                validationErrors.description
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]`}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`mt-1 block w-full px-4 py-2 border ${
                validationErrors.price ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]`}
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Features (comma-separated)
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              rows={6}
              className={`mt-1 block w-full px-4 py-2 border
               rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]`}
            />
          </div>

          {/* Service Provider */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Service Provider
            </label>
            <select
              name="serviceProvider"
              value={formData.serviceProvider}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]"
            >
              <option value="">Select a service provider</option>
              {serviceProviders.map((provider, index) => (
                <option key={index} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 px-6 font-semibold rounded-md transition-all duration-300 transform ${
              isFormValid
                ? "bg-[#1E3A8A] text-white hover:bg-[#142A61] hover:scale-105"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Create Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlan;
