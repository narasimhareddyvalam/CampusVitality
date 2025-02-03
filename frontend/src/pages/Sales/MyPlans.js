import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";

const MyPlans = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const token = useSelector(selectToken);

  const fetchMyPlans = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/bookings/my-plans",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings.");
    }
  };

  useEffect(() => {
    fetchMyPlans();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="w-4/5 mx-auto p-6">
        <p className="text-lg text-gray-700">No plans purchased yet.</p>
      </div>
    );
  }

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen"
      style={{ width: "80%", margin: "0 auto" }}
    >
      <h1 className="text-2xl font-extrabold text-[#2A3A2B] mb-6">My Plans</h1>

      <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-[#5aa9e6] text-white">
            <tr>
              <th className="px-6 py-3 text-lg font-medium">Plan Name</th>
              <th className="px-6 py-3 text-lg font-medium">Price</th>
              <th className="px-6 py-3 text-lg font-medium">Payment Status</th>
              <th className="px-6 py-3 text-lg font-medium">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="hover:bg-gray-100 transition-all duration-300"
              >
                <td className="px-6 py-4">{booking.planId.planName}</td>
                <td className="px-6 py-4">${booking.amountPaid}</td>

                <td className="px-6 py-4">{booking.paymentInfo.status}</td>
                <td className="px-6 py-4">
                  {booking.invoiceUrl ? (
                    <a
                      href={`http://localhost:8000${booking.invoiceUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5aa9e6] hover:text-[#485550] transition-all duration-300"
                    >
                      Download Invoice
                    </a>
                  ) : (
                    <span className="text-gray-400">Not Available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPlans;
