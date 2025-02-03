import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { selectUser, selectToken } from "../../redux/slices/authSlice";
import { HiArrowNarrowRight } from "react-icons/hi"; // Icon for button
import { FaDownload } from "react-icons/fa"; // Icon for Download

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  // Fetch bookings from the backend
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (err) {
      setError("Failed to fetch bookings. Please try again later.");
    }
  };

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "sales") {
      fetchBookings();
    }
  }, [user]);

  if (!user || (user.role !== "admin" && user.role !== "sales")) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 font-semibold text-lg">
          You are not authorized to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8 flex justify-center items-center">
      <div className="max-w-7xl w-full bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-6 text-center">
          All Bookings
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {bookings.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            No bookings available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse rounded-lg shadow-md">
              <thead>
                <tr className="text-left bg-[#5AA9E6] text-white">
                  <th className="px-4 py-3 text-center">Booking ID</th>
                  <th className="px-4 py-3 text-center">User</th>
                  <th className="px-4 py-3 text-center">Email</th>
                  <th className="px-4 py-3 text-center">Plan Name</th>
                  <th className="px-4 py-3 text-center">Service Provider</th>
                  <th className="px-4 py-3 text-center">Price</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b">
                    <td className="px-4 py-3 text-center">{booking._id}</td>
                    <td className="px-4 py-3 text-center">
                      {booking.userId?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {booking.userId?.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {booking.planId?.planName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {booking.planId?.serviceProvider || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      ${booking.amountPaid.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {booking.status || "Active"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {booking.invoiceUrl ? (
                        <a
                          href={`http://localhost:8000${booking.invoiceUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5AA9E6] font-semibold flex items-center justify-center"
                        >
                          <FaDownload className="text-xl" />
                        </a>
                      ) : (
                        "Not available"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Button to Navigate to Analytics Page - Now placed after the table */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/analytics")}
            className="bg-[#1E3A8A] hover:bg-[#142A61] text-white font-semibold py-2 px-6 rounded-md flex items-center transition-all duration-200"
          >
            <span className="mr-2">Go to Analytics</span>
            <HiArrowNarrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
