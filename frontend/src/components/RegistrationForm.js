import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    studentDetails: {
      collegeId: "",
      collegeName: "",
      degreeType: "",
      graduationDate: {
        month: "",
        year: "",
      },
    },
    admissionLetter: null, // For file upload
  });

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z\s.'-]{3,25}$/;
    const emailRegex =
      /^[a-zA-Z0-9](?:[a-zA-Z0-9]|[.!#$%&'*+/=?^_`{|}~-](?![.!#$%&'*+/=?^_`{|}~-])){1,62}[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,15}$/;
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,24}$/;
    const phoneRegex = /^(?:\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const addressRegex = /^[a-zA-Z0-9 /-]+$/;

    if (!usernameRegex.test(formData.username)) {
      toast.error(
        "Username must start with a letter, be alphanumeric, and 3-25 characters long."
      );
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email address.");
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be 6-15 characters long, include one uppercase letter, one number, and one special character."
      );
      return false;
    }

    if (!nameRegex.test(formData.name)) {
      toast.error(
        "Name must be 3-25 characters long and only include letters, spaces, dots, hyphens, or apostrophes."
      );
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast.error(
        "Phone number must be valid (e.g., +1 (123) 456-7890 or 123-456-7890)."
      );
      return false;
    }

    if (!addressRegex.test(formData.address)) {
      toast.error(
        "Address must only contain letters, numbers, spaces, slashes, or hyphens."
      );
      return false;
    }

    if (
      formData.studentDetails.graduationDate.year < 1900 ||
      formData.studentDetails.graduationDate.year > 2100
    ) {
      toast.error("Graduation year must be between 1900 and 2100.");
      return false;
    }

    const validMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (!validMonths.includes(formData.studentDetails.graduationDate.month)) {
      toast.error("Invalid graduation month.");
      return false;
    }

    if (
      formData.admissionLetter &&
      formData.admissionLetter.size > 2 * 1024 * 1024
    ) {
      toast.error("Admission letter must be smaller than 2MB.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("studentDetails.graduationDate")) {
      const key = name.split(".")[2];
      setFormData((prevData) => ({
        ...prevData,
        studentDetails: {
          ...prevData.studentDetails,
          graduationDate: {
            ...prevData.studentDetails.graduationDate,
            [key]: value,
          },
        },
      }));
    } else if (name.startsWith("studentDetails.")) {
      const key = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        studentDetails: {
          ...prevData.studentDetails,
          [key]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      admissionLetter: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("role", "student");
    data.append("studentDetails.collegeId", formData.studentDetails.collegeId);
    data.append(
      "studentDetails.collegeName",
      formData.studentDetails.collegeName
    );
    data.append(
      "studentDetails.degreeType",
      formData.studentDetails.degreeType
    );
    data.append(
      "studentDetails.graduationDate.year",
      formData.studentDetails.graduationDate.year
    );
    data.append(
      "studentDetails.graduationDate.month",
      formData.studentDetails.graduationDate.month
    );
    data.append("admissionLetter", formData.admissionLetter);

    try {
      await axios.post("http://localhost:8000/api/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registration successful!", {
        position: "top-center",
      });

      // Reset form fields after success
      setFormData({
        username: "",
        email: "",
        password: "",
        name: "",
        phone: "",
        address: "",
        studentDetails: {
          collegeId: "",
          collegeName: "",
          degreeType: "",
          graduationDate: { month: "", year: "" },
        },
        admissionLetter: null,
      });
    } catch (error) {
      // Check if error response exists and has a specific message
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";

      if (error.response?.status === 409) {
        // Specific handling for duplicate key errors
        if (errorMessage.toLowerCase().includes("email")) {
          toast.error(
            "This email is already registered. Please use a different email.",
            {
              position: "top-center",
            }
          );
        } else if (errorMessage.toLowerCase().includes("username")) {
          toast.error(
            "This username is already taken. Please choose another username.",
            {
              position: "top-center",
            }
          );
        } else {
          toast.error("A duplicate entry exists. Please check your details.", {
            position: "top-center",
          });
        }
      } else {
        toast.error(errorMessage, { position: "top-center" });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center text-[#2c5676] mb-6">
        STUDENT REGISTRATION
      </h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Column */}
        <div>
          <label className="text-sm font-medium text-[#485550]">
            Username <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#485550]">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#485550]">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#485550]">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#485550]">
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#485550]">
            Address <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#485550]">
            College ID <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="studentDetails.collegeId"
            value={formData.studentDetails.collegeId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#485550]">
            College Name <span className="text-red-600">*</span>
          </label>
          <select
            name="studentDetails.collegeName"
            value={formData.studentDetails.collegeName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          >
            <option value="">Select College</option>
            <option value="Northeastern University">
              Northeastern University
            </option>
            <option value="Harvard University">Harvard University</option>
            <option value="Massachusetts Institute of Technology (MIT)">
              MIT
            </option>
            <option value="Stanford University">Stanford University</option>
            <option value="University of California, Berkeley">
              UC Berkeley
            </option>
            <option value="University of Chicago">University of Chicago</option>
            <option value="Columbia University">Columbia University</option>
            <option value="Yale University">Yale University</option>
            <option value="Princeton University">Princeton University</option>
            <option value="University of Michigan">
              University of Michigan
            </option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[#485550]">
            Degree Type <span className="text-red-600">*</span>
          </label>
          <select
            name="studentDetails.degreeType"
            value={formData.studentDetails.degreeType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          >
            <option value="">Select Degree</option>
            <option value="bachelors">Bachelors</option>
            <option value="masters">Masters</option>
            <option value="ph.D">Ph.D</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-[#485550]">
            Graduation Year <span className="text-red-600">*</span>
          </label>
          <select
            name="studentDetails.graduationDate.year"
            value={formData.studentDetails.graduationDate.year}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          >
            <option value="">Select Year</option>
            {Array.from({ length: 20 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[#485550]">
            Graduation Month <span className="text-red-600">*</span>
          </label>
          <select
            name="studentDetails.graduationDate.month"
            value={formData.studentDetails.graduationDate.month}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          >
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-[#485550]">
            Admission Letter (PDF) <span className="text-red-600">*</span>
          </label>
          <input
            type="file"
            name="admissionLetter"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="col-span-1 md:col-span-2 w-full py-2 mt-4 text-white bg-[#2c5676] hover:bg-[#5aa9e6] rounded-md font-semibold focus:ring-2 focus:ring-[#5aa9e6] focus:outline-none"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
