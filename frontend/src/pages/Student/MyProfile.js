import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  FaUserAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaAddressCard,
  FaUniversity,
  FaCalendarAlt,
  FaIdCard,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const MyProfile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emailVerified: false,
    phone: "",
    address: "",
    studentDetails: {
      collegeId: "",
      collegeName: "",
      graduationDate: {
        month: "",
        year: "",
      },
      homeAddress: "",
      degreeType: "",
      alreadyEnrolledPlan: {
        isEnrolled: false,
        details: {
          insuranceCompany: "",
          duration: "",
          hasPreviousClaim: false,
          previousClaimDetails: "",
        },
      },
    },
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // State for edit mode
  const [isEditing, setIsEditing] = useState({
    phone: false,
    address: false,
  });

  // State for temporary edit values
  const [editValues, setEditValues] = useState({
    phone: "",
    address: "",
  });

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData(response.data);
    } catch (err) {
      setError("Failed to fetch user details. Please try again.");
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  const handleSendVerificationEmail = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/auth/send-verification-email`,
        { email: formData.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message || "Verification email sent.");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send verification email."
      );
      setMessage("");
    }
  };

  // Start editing a field
  const startEditing = (field) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: formData[field],
    }));
    setIsEditing((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // Cancel editing
  const cancelEditing = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  // Handle input change during editing
  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save edited field
  const saveEdit = async (field) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/users/${user.id}`,
        { [field]: editValues[field] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update form data with new value
      setFormData((prev) => ({
        ...prev,
        [field]: editValues[field],
      }));

      // Exit edit mode
      setIsEditing((prev) => ({
        ...prev,
        [field]: false,
      }));

      // Set success message
      setMessage(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } updated successfully.`
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update ${field}.`);
      setMessage("");

      // Revert to original value if save fails
      setEditValues((prev) => ({
        ...prev,
        [field]: formData[field],
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10">
      <h1 className="text-4xl font-bold text-center text-[#485550] mb-6">
        My Profile
      </h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Information */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#485550] mb-4 flex items-center">
            <FaUserAlt className="mr-3 text-[#5aa9e6]" />
            Personal Information
          </h2>
          <div className="mb-4">
            <p className="text-lg font-semibold text-[#485550]">Name:</p>
            <p className="text-gray-700">{formData.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-[#485550] flex items-center">
              <FaEnvelope className="mr-3 text-[#5aa9e6]" />
              Email:
            </p>
            <p className="text-gray-700">{formData.email}</p>
            {!formData.emailVerified && (
              <button
                onClick={handleSendVerificationEmail}
                className="mt-2 px-6 py-2 bg-[#F4F6F0] text-[#485550] rounded-lg hover:bg-[#C0EB6A] focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 ease-in-out"
              >
                Verify Email
              </button>
            )}
            {formData.emailVerified && (
              <span className="text-blue-500 mt-2 inline-block">
                Email Verified
              </span>
            )}
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-[#485550] flex items-center">
              <FaPhoneAlt className="mr-3 text-[#5aa9e6]" />
              Phone:
            </p>
            {!isEditing.phone ? (
              <div className="flex items-center">
                <p className="text-gray-700 flex-grow">{formData.phone}</p>
                <button
                  onClick={() => startEditing("phone")}
                  className="text-[#5aa9e6] hover:text-blue-700"
                >
                  <FaEdit />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editValues.phone}
                  onChange={(e) => handleEditChange("phone", e.target.value)}
                  className="flex-grow mr-2 px-2 py-1 border rounded"
                  placeholder="Enter phone number"
                />
                <button
                  onClick={() => saveEdit("phone")}
                  className="text-green-500 hover:text-green-700 mr-2"
                >
                  <FaSave />
                </button>
                <button
                  onClick={() => cancelEditing("phone")}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-[#485550] flex items-center">
              <FaAddressCard className="mr-3 text-[#5aa9e6]" />
              Address:
            </p>
            {!isEditing.address ? (
              <div className="flex items-center">
                <p className="text-gray-700 flex-grow">{formData.address}</p>
                <button
                  onClick={() => startEditing("address")}
                  className="text-[#5aa9e6] hover:text-blue-700"
                >
                  <FaEdit />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editValues.address}
                  onChange={(e) => handleEditChange("address", e.target.value)}
                  className="flex-grow mr-2 px-2 py-1 border rounded"
                  placeholder="Enter address"
                />
                <button
                  onClick={() => saveEdit("address")}
                  className="text-green-500 hover:text-green-700 mr-2"
                >
                  <FaSave />
                </button>
                <button
                  onClick={() => cancelEditing("address")}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rest of the component remains the same as in the original code */}
        {/* Student Information section */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#485550] mb-4 flex items-center">
            <FaUniversity className="mr-3 text-[#5aa9e6]" />
            Student Details
          </h2>
          {/* ... (rest of the student details rendering) ... */}
          {/* Keep the rest of the component exactly the same as in the original code */}
          <div className="mb-4">
            <p className="text-lg font-semibold text-[#485550] flex items-center">
              <FaIdCard className="mr-3 text-[#5aa9e6]" />
              College ID:
            </p>
            <p className="text-gray-700">{formData.studentDetails.collegeId}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-[#485550] flex items-center">
              <FaUniversity className="mr-3 text-[#5aa9e6]" />
              College Name:
            </p>
            <p className="text-gray-700">
              {formData.studentDetails.collegeName}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-[#485550] flex items-center">
              <FaCalendarAlt className="mr-3 text-[#5aa9e6]" />
              Graduation Date:
            </p>
            <p className="text-gray-700">
              {formData.studentDetails.graduationDate.month}{" "}
              {formData.studentDetails.graduationDate.year}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-[#485550] flex items-center">
              <FaIdCard className="mr-3 text-[#5aa9e6]" />
              Degree Type:
            </p>
            <p className="text-gray-700">
              {formData.studentDetails.degreeType}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
