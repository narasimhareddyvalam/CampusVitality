import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlusCircle, FaEdit, FaTrashAlt } from "react-icons/fa"; // Adding icons

const SalesPage = () => {
  const [plans, setPlans] = useState([]);
  const [allPlans, setAllPlans] = useState([]); // State to store all plans
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch plans created by the logged-in sales user
  const fetchMyPlans = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:8000/api/plans/my-plans",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlans(response.data);
    } catch (err) {
      setError("Failed to fetch plans.");
    }
  };

  // Fetch all plans available (for sales user to view)
  const fetchAllPlans = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8000/api/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllPlans(response.data);
    } catch (err) {
      setError("Failed to fetch all plans.");
    }
  };

  useEffect(() => {
    fetchMyPlans();
    fetchAllPlans();
  }, []);

  // Navigate to the modify plan page
  const handleModifyPlan = (planId) => {
    navigate(`/sales/modify-plan/${planId}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8 mt-20">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-[#1E3A8A] text-center mb-8">
          Sales Dashboard
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Button to create a new plan */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/sales/create-plan")}
            className="flex items-center px-6 py-3 bg-[#1E3A8A] text-white font-semibold rounded-md hover:bg-[#142A61] transition-all duration-300"
          >
            <FaPlusCircle className="mr-2" />
            Create New Plan
          </button>
        </div>

        {/* My Plans Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Plans</h2>
          {plans.length === 0 ? (
            <p>No plans created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-separate border-spacing-2 mb-8">
                <thead>
                  <tr className="bg-[#5AA9E6] text-white text-left">
                    <th className="py-2 px-4 text-center">Plan Name</th>
                    <th className="py-2 px-4 text-center">Description</th>
                    <th className="py-2 px-4 text-center">Price</th>
                    <th className="py-2 px-4 text-center">Duration (Months)</th>
                    <th className="py-2 px-4 text-center">Discontinued</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan._id} className="border-b">
                      <td className="py-2 px-4 text-center">{plan.planName}</td>
                      <td className="py-2 px-4 text-center">{plan.description}</td>
                      <td className="py-2 px-4 text-center">${plan.price}</td>
                      <td className="py-2 px-4 text-center">{plan.duration}</td>
                      <td className="py-2 px-4 text-center">
                        {plan.discontinued ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-4 text-center flex justify-center">
                        <button
                          onClick={() => handleModifyPlan(plan._id)}
                          className="text-[#5AA9E6] hover:text-[#4a90e2] transition-all"
                        >
                          <FaEdit className="text-2xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Available Plans Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Available Plans</h2>
          {allPlans.length === 0 ? (
            <p>No plans available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-separate border-spacing-2">
                <thead>
                  <tr className="bg-[#5AA9E6] text-white text-left">
                    <th className="py-2 px-4 text-center">Plan Name</th>
                    <th className="py-2 px-4 text-center">Description</th>
                    <th className="py-2 px-4 text-center">Price</th>
                    <th className="py-2 px-4 text-center">Duration (Months)</th>
                    <th className="py-2 px-4 text-center">Discontinued</th>
                  </tr>
                </thead>
                <tbody>
                  {allPlans.map((plan) => (
                    <tr key={plan._id} className="border-b">
                      <td className="py-2 px-4 text-center">{plan.planName}</td>
                      <td className="py-2 px-4 text-center">{plan.description}</td>
                      <td className="py-2 px-4 text-center">${plan.price}</td>
                      <td className="py-2 px-4 text-center">{plan.duration}</td>
                      <td className="py-2 px-4 text-center">
                        {plan.discontinued ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
