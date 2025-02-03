import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiDelete } from "react-icons/fi"; // Importing delete icon

const MyTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState("");

  // Fetch team members
  const fetchTeam = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8000/api/users/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamMembers(response.data);
    } catch (err) {
      setError("Failed to fetch team members.");
    }
  };

  // Delete a team member
  const deleteMember = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/users/sales/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamMembers((prev) => prev.filter((member) => member._id !== id));
    } catch (err) {
      setError("Failed to delete team member.");
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex justify-center items-center"> {/* Flexbox to center the content */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-[#1E3A8A] mb-6 text-center">
          My Team
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <table className="w-full table-auto bg-white border-collapse rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="text-left border-b bg-[#5AA9E6] text-white">
              <th className="px-4 py-3 text-center">Username</th>
              <th className="px-4 py-3 text-center">Email</th>
              <th className="px-4 py-3 text-center">Name</th>
              <th className="px-4 py-3 text-center">Phone</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-3 text-center">{member.username}</td>
                <td className="px-4 py-3 text-center">{member.email}</td>
                <td className="px-4 py-3 text-center">{member.name}</td>
                <td className="px-4 py-3 text-center">{member.phone}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => deleteMember(member._id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full transition-colors duration-200"
                  >
                    <FiDelete className="inline-block text-lg mr-2" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTeam;
