import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModifyPlan = () => {
  const { id } = useParams(); // Get the plan ID from the URL
  const [formData, setFormData] = useState({
    planName: "",
    description: "",
    price: "",
    discontinued: false,
  });
  const navigate = useNavigate();

  // Regex patterns
  const regexPatterns = {
    planName: /^[a-zA-Z\s.'-]{3,25}$/,
    description: /^([a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*){1,150}$/,
    price: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  };

  // Toast messages for validation
  const toastMessages = {
    planName:
      "Plan Name must be 3-25 characters long and can include letters, spaces, periods, apostrophes, or hyphens.",
    description:
      "Description must have up to 150 words with valid alphanumeric characters.",
    price:
      "Price must be a valid number, optionally with up to two decimal places.",
  };

  useEffect(() => {
    const fetchPlanDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:8000/api/plans/getPlan/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFormData(response.data);
      } catch (err) {
        console.error(
          "Error fetching plan details:",
          err.response?.data || err.message
        );
        toast.error("Failed to fetch plan details.");
      }
    };

    fetchPlanDetails();
  }, [id]);

  const validateField = (field, value) => {
    if (!regexPatterns[field].test(value)) {
      toast.error(toastMessages[field]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const isPlanNameValid = validateField("planName", formData.planName);
    const isDescriptionValid = validateField(
      "description",
      formData.description
    );
    const isPriceValid = validateField("price", formData.price);

    if (!isPlanNameValid || !isDescriptionValid || !isPriceValid) {
      return; // Exit if validation fails
    }

    const token = localStorage.getItem("token");

    try {
      await axios.patch(`http://localhost:8000/api/plans/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Plan updated successfully!");
    } catch (err) {
      toast.error("Failed to update the plan.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="min-h-screen pt-24 py-10 px-4 sm:px-8 lg:px-10">
      {" "}
      {/* Added pt-24 to give space for navbar */}
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl z-10">
        <h1 className="text-4xl font-extrabold text-[#5AA9E6] text-center mb-6">
          Modify Plan
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">
              Plan Name
            </label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              required
              className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5AA9E6] focus:border-[#5AA9E6] transition-all duration-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5AA9E6] focus:border-[#5AA9E6] transition-all duration-300"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5AA9E6] focus:border-[#5AA9E6] transition-all duration-300"
            />
          </div>

          {/* Discontinued Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="discontinued"
              checked={formData.discontinued}
              onChange={handleChange}
              className="h-5 w-5 text-[#5AA9E6] border-gray-300 rounded focus:ring-[#5AA9E6] transition-all duration-300"
            />
            <label className="ml-3 text-lg text-gray-700">Discontinued</label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto py-3 px-6 bg-[#5AA9E6] text-white font-semibold rounded-lg hover:bg-[#4a90e2] focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-300"
            >
              Update Plan
            </button>
            <button
              type="button"
              className="w-full sm:w-auto py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300"
              onClick={() => navigate("/sales")}
            >
              Back to Sales Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyPlan;
