import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";

const AdminPlansPage = () => {
  const token = useSelector(selectToken);
  const [plans, setPlans] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/plans/plans-admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlans(response.data);
    } catch (err) {
      setError("Failed to fetch plans. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Filter plans based on their status
  const filteredPlans = plans.filter((plan) => {
    if (filter === "all") return true;
    if (filter === "active") return !plan.discontinued;
    if (filter === "discontinued") return plan.discontinued;
    return true;
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
      {/* Content Wrapper */}
      <div className="w-full max-w-7xl bg-white p-8 rounded-xl shadow-md">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-6 text-center">
          All Plans
        </h1>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center font-semibold mb-4">{error}</p>
        )}

        {/* Filter Dropdown */}
        <div className="flex justify-between items-center mb-6">
          <label className="font-medium text-lg text-gray-700">
            Filter by Status:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="ml-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>

        {/* Plans Table */}
        {filteredPlans.length === 0 ? (
          <p className="text-lg text-center text-gray-500">
            No plans available for the selected filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse rounded-lg shadow-md">
              <thead>
                <tr className="bg-[#5AA9E6] text-white">
                  <th className="px-6 py-4 text-center text-lg font-medium">
                    Plan Name
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-medium">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-medium">
                    Price
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-medium">
                    Service Provider
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => (
                  <tr
                    key={plan._id}
                    className="hover:bg-gray-100 transition-all duration-300 border-b"
                  >
                    <td className="px-6 py-4 text-center">{plan.planName}</td>
                    <td className="px-6 py-4 text-center">
                      {plan.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      ${plan.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {plan.serviceProvider || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        plan.discontinued ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {plan.discontinued ? "Discontinued" : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlansPage;
