import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icons for actions
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Loading spinner

const AdminPage = () => {
  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch students from the backend
  const fetchStudents = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:8000/api/users/students",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Separate students into verified and unverified
      const verified = response.data.filter(
        (student) => student.studentDetails?.isStudentVerified
      );
      const unverified = response.data.filter(
        (student) => !student.studentDetails?.isStudentVerified
      );

      setVerifiedStudents(verified);
      setUnverifiedStudents(unverified);
    } catch (err) {
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle student verification status
  const toggleVerification = async (student) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const isCurrentlyVerified = student.studentDetails?.isStudentVerified;

    try {
      // Update the verification status in the backend
      await axios.patch(
        `http://localhost:8000/api/users/${student._id}/verify`,
        { isStudentVerified: !isCurrentlyVerified },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the UI state
      if (isCurrentlyVerified) {
        // Move from verified to unverified
        setVerifiedStudents((prev) =>
          prev.filter((s) => s._id !== student._id)
        );
        setUnverifiedStudents((prev) => [
          ...prev,
          {
            ...student,
            studentDetails: {
              ...student.studentDetails,
              isStudentVerified: false,
            },
          },
        ]);
      } else {
        // Move from unverified to verified
        setUnverifiedStudents((prev) =>
          prev.filter((s) => s._id !== student._id)
        );
        setVerifiedStudents((prev) => [
          ...prev,
          {
            ...student,
            studentDetails: {
              ...student.studentDetails,
              isStudentVerified: true,
            },
          },
        ]);
      }
    } catch (err) {
      setError("Failed to update student verification status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F8FF] font-lato flex items-center justify-center">
      <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-lg animate__animated animate__fadeIn">
        <h1 className="text-4xl md:text-5xl font-black text-[#1E3A8A] mb-6 text-center">
          Admin Dashboard
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-6 animate__animated animate__fadeIn">
            {error}
          </p>
        )}

        {/* Unverified Students */}
        <div className="mb-8 animate__animated animate__fadeIn">
          <h2 className="text-2xl font-black text-[#1E3A8A] flex items-center mb-4">
            <FaTimesCircle className="mr-3 text-red-600" />
            Unverified Students
          </h2>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="table-auto w-full border-collapse text-center">
              <thead>
                <tr className="bg-[#5AA9E6]"> {/* Updated background */}
                  <th className="px-6 py-3 text-white">Name</th>
                  <th className="px-6 py-3 text-white">College Name</th>
                  <th className="px-6 py-3 text-white">College ID</th>
                  <th className="px-6 py-3 text-white">Admission Letter</th>
                  <th className="px-6 py-3 text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {unverifiedStudents.map((student, index) => (
                  <tr
                    key={student._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b`}
                  >
                    <td className="px-6 py-3">{student?.name || "Unknown Name"}</td>
                    <td className="px-6 py-3">
                      {student?.studentDetails?.collegeName || "No College Name"}
                    </td>
                    <td className="px-6 py-3">
                      {student?.studentDetails?.collegeId || "No College ID"}
                    </td>
                    <td className="px-6 py-3">
                      {student?.studentDetails?.collegeAdmissionLetterURL ? (
                        <a
                          href={`http://localhost:8000${student.studentDetails.collegeAdmissionLetterURL}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5AA9E6] hover:underline"
                        >
                          View Admission Letter
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => toggleVerification(student)}
                        className="bg-[#5AA9E6] text-white py-2 px-6 rounded-lg hover:bg-[#3B8CC4] transition-all transform hover:scale-110"
                      >
                        {loading ? (
                          <AiOutlineLoading3Quarters className="animate-spin mx-auto" size={24} />
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verified Students */}
        <div className="animate__animated animate__fadeIn">
          <h2 className="text-2xl font-black text-[#1E3A8A] flex items-center mb-4">
            <FaCheckCircle className="mr-3 text-green-600" />
            Verified Students
          </h2>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="table-auto w-full border-collapse text-center">
              <thead>
                <tr className="bg-[#5AA9E6]"> {/* Updated background */}
                  <th className="px-6 py-3 text-white">Name</th>
                  <th className="px-6 py-3 text-white">College Name</th>
                  <th className="px-6 py-3 text-white">College ID</th>
                  <th className="px-6 py-3 text-white">Admission Letter</th>
                  <th className="px-6 py-3 text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {verifiedStudents.map((student, index) => (
                  <tr
                    key={student._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b`}
                  >
                    <td className="px-6 py-3">{student?.name || "Unknown Name"}</td>
                    <td className="px-6 py-3">
                      {student?.studentDetails?.collegeName || "No College Name"}
                    </td>
                    <td className="px-6 py-3">
                      {student?.studentDetails?.collegeId || "No College ID"}
                    </td>
                    <td className="px-6 py-3">
                      {student?.studentDetails?.collegeAdmissionLetterURL ? (
                        <a
                          href={`http://localhost:8000${student.studentDetails.collegeAdmissionLetterURL}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5AA9E6] hover:underline"
                        >
                          View Admission Letter
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => toggleVerification(student)}
                        className="bg-[#5AA9E6] text-white py-2 px-6 rounded-lg hover:bg-[#3B8CC4] transition-all transform hover:scale-110"
                      >
                        {loading ? (
                          <AiOutlineLoading3Quarters className="animate-spin mx-auto" size={24} />
                        ) : (
                          "Unverify"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
