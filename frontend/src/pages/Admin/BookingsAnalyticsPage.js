import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { FaFilter, FaChartBar, FaChartPie, FaChartLine } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement, // Register PointElement for line chart
  LineElement // Register LineElement for line chart
);

const BookingsAnalyticsPage = () => {
  const token = useSelector(selectToken);
  const [bookings, setBookings] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState({
    serviceProvider: "",
    maxPrice: "",
    showDiscontinued: true,
  });
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookingsData = response.data;

      setBookings(bookingsData);

      // Extract unique service providers
      const providers = [
        ...new Set(
          bookingsData.map(
            (booking) => booking.planId?.serviceProvider || "N/A"
          )
        ),
      ];
      setServiceProviders(providers);
      setFilteredBookings(bookingsData);
    } catch (err) {
      setError("Failed to fetch bookings. Please try again.");
    }
  };

  const applyFilters = () => {
    let filtered = bookings;

    // Filter by service provider
    if (filter.serviceProvider) {
      filtered = filtered.filter(
        (booking) => booking.planId?.serviceProvider === filter.serviceProvider
      );
    }

    // Filter by price
    if (filter.maxPrice) {
      filtered = filtered.filter(
        (booking) => booking.amountPaid <= parseFloat(filter.maxPrice)
      );
    }

    // Filter by discontinued plans
    if (!filter.showDiscontinued) {
      filtered = filtered.filter((booking) => !booking.planId?.discontinued);
    }

    setFilteredBookings(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, bookings]);

  // Chart Data for Bar Chart
  const chartData = {
    labels: serviceProviders,
    datasets: [
      {
        label: "Revenue by Service Provider",
        data: serviceProviders.map((provider) =>
          bookings
            .filter((booking) => booking.planId?.serviceProvider === provider)
            .reduce((total, booking) => total + booking.amountPaid, 0)
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: serviceProviders,
    datasets: [
      {
        data: serviceProviders.map((provider) =>
          bookings
            .filter((booking) => booking.planId?.serviceProvider === provider)
            .reduce((total, booking) => total + booking.amountPaid, 0)
        ),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  // Line Chart Data
  const lineChartData = {
    labels: serviceProviders,
    datasets: [
      {
        label: "Bookings Over Time",
        data: serviceProviders.map(
          (provider) =>
            bookings.filter(
              (booking) => booking.planId?.serviceProvider === provider
            ).length
        ),
        borderColor: "rgba(54, 162, 235, 0.6)",
        fill: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 max-w-6xl mx-auto mt-16">
      {" "}
      {/* Adjusted margin for larger screens */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-[#5AA9E6] text-center mb-8">
          Bookings Analytics
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Filters Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            <FaFilter className="inline-block mr-2" />
            Filters
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2">
              <label className="text-lg">Service Provider:</label>
              <select
                name="serviceProvider"
                value={filter.serviceProvider}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-md w-full sm:w-auto"
              >
                <option value="">All</option>
                {serviceProviders.map((provider, index) => (
                  <option key={index} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2">
              <label className="text-lg">Maximum Price:</label>
              <input
                type="number"
                name="maxPrice"
                value={filter.maxPrice}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-md w-full sm:w-auto"
                placeholder="Enter max price"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="showDiscontinued"
                checked={filter.showDiscontinued}
                onChange={handleFilterChange}
                className="h-5 w-5"
              />
              <label className="text-lg">Show Discontinued Plans</label>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-center mb-4">
              <FaChartBar className="inline-block mr-2" />
              Revenue by Service Provider (Bar Chart)
            </h3>
            <Bar data={chartData} options={{ responsive: true }} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-center mb-4">
              <FaChartPie className="inline-block mr-2" />
              Revenue Distribution (Pie Chart)
            </h3>
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-center mb-4">
              <FaChartLine className="inline-block mr-2" />
              Bookings Over Time (Line Chart)
            </h3>
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Filtered Bookings Table */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Filtered Bookings
          </h2>
          {filteredBookings.length === 0 ? (
            <p>No bookings match the selected filters.</p>
          ) : (
            <div className="overflow-x-auto">
              {" "}
              {/* Ensures horizontal scroll on smaller screens */}
              <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-300">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-4 py-2 border-b">Booking ID</th>
                    <th className="px-4 py-2 border-b">User</th>
                    <th className="px-4 py-2 border-b">Service Provider</th>
                    <th className="px-4 py-2 border-b">Plan Name</th>
                    <th className="px-4 py-2 border-b">Discontinued</th>
                    <th className="px-4 py-2 border-b">Price</th>
                    <th className="px-4 py-2 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-4 py-2 border-b">{booking._id}</td>
                      <td className="px-4 py-2 border-b">
                        {booking.userId?.name || "N/A"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {booking.planId?.serviceProvider || "N/A"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {booking.planId?.planName || "N/A"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {booking.planId?.discontinued ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        ${booking.amountPaid.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {booking.status || "active"}
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

export default BookingsAnalyticsPage;
