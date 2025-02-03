import React, { useState } from "react";
import axios from "axios";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaPhoneAlt, FaEnvelope, FaUserAlt, FaLock } from "react-icons/fa";

const regexPatterns = {
  username: /^[a-zA-Z][a-zA-Z0-9]{2,24}$/,
  email:
    /^[a-zA-Z0-9](?:[a-zA-Z0-9]|[.!#$%&'*+/=?^_`{|}~-](?![.!#$%&'*+/=?^_`{|}~-])){1,62}[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,15}$/,
  name: /^[a-zA-Z\s.'-]{3,25}$/,
  phone: /^(?:\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
};

const CreateSalesUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error message when input changes
  };

  // Handle input blur for real-time validation
  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (!regexPatterns[name].test(value)) {
      setError(`Invalid ${name}. Please check your input.`);
    } else {
      setError(""); // Clear error if input is valid
    }
  };

  // Form validation before submission
  const validateForm = () => {
    for (const field in formData) {
      if (!regexPatterns[field].test(formData[field])) {
        setError(`Invalid ${field}. Please check your input.`);
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!validateForm()) {
      setSuccess("");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/users/register",
        { ...formData, role: "sales" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(response.data.message);
      setError("");
      setFormData({
        username: "",
        email: "",
        password: "",
        name: "",
        phone: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create sales user.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F8FF] flex items-center justify-center p-6 font-lato">
      <div className="w-full md:w-3/4 bg-white p-8 rounded-lg shadow-lg animate__animated animate__fadeIn">
        <h2 className="text-3xl font-semibold text-[#1E3A8A] mb-6 flex items-center justify-center">
          <AiOutlineUserAdd className="mr-2 text-4xl" />
          Create Sales User
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-6 animate__animated animate__fadeIn">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-center mb-6 animate__animated animate__fadeIn">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center border-2 border-[#5AA9E6] p-3 rounded-lg">
            <FaUserAlt className="text-[#5AA9E6] mr-3" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Username"
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border-2 border-[#5AA9E6] p-3 rounded-lg">
            <FaEnvelope className="text-[#5AA9E6] mr-3" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border-2 border-[#5AA9E6] p-3 rounded-lg">
            <FaLock className="text-[#5AA9E6] mr-3" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border-2 border-[#5AA9E6] p-3 rounded-lg">
            <FaUserAlt className="text-[#5AA9E6] mr-3" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Full Name"
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border-2 border-[#5AA9E6] p-3 rounded-lg">
            <FaPhoneAlt className="text-[#5AA9E6] mr-3" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Phone"
              className="w-full outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg hover:bg-[#142A61] transition-all"
          >
            Create Sales User
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSalesUser;
