import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchPlanDetails,
  selectPlan,
  selectPlanStatus,
  selectPlanError,
} from "../../redux/slices/plansSlice";
import { selectUser, selectToken } from "../../redux/slices/authSlice";

const PlanDetailsWithBuy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const plan = useSelector(selectPlan);
  const planStatus = useSelector(selectPlanStatus);
  const planError = useSelector(selectPlanError);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const [startDate, setStartDate] = useState("");
  const [durationType, setDurationType] = useState("monthly");
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate the max allowed start date (3 months from today)
  const today = new Date();
  const maxStartDate = new Date(today.setMonth(today.getMonth() + 3))
    .toISOString()
    .split("T")[0];

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch plan details
  useEffect(() => {
    dispatch(fetchPlanDetails(id));
  }, [dispatch, id]);

  // Calculate total price whenever duration or durationType changes
  useEffect(() => {
    if (plan) {
      if (durationType === "yearly") {
        setDuration(1); // Force duration to 1 when yearly is selected
        setTotalPrice(plan.price * 12 * 0.9); // 10% discount for yearly
      } else {
        setTotalPrice(duration * plan.price); // Monthly price
      }
    }
  }, [plan, duration, durationType]);

  const handleBuyNow = async () => {
    // Check if start date is selected
    if (!startDate) {
      toast.error("Please select a start date to proceed with the purchase.");
      return;
    }

    // Check if the user's email is verified
    if (!user.emailVerified) {
      toast.error(
        "Your email is not verified. Please verify your email to proceed with the purchase."
      );
      return;
    }

    if (!user.studentVerified) {
      toast.error(
        "Your Student status is not verified. Please wait for 12 hrs."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/payments/create-checkout-session",
        { planId: id, startDate, duration, durationType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.url; // Redirect to Stripe Checkout
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to redirect to payment. Please try again."
      );
    }
  };

  if (planStatus === "loading") {
    return <p>Loading plan details...</p>;
  }

  if (planStatus === "failed") {
    return (
      <p className="text-red-600">
        {planError || "Failed to load plan details."}
      </p>
    );
  }

  if (!plan) {
    return <p>No plan details available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen mt-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-0">
          {/* Left Side - Plan Details */}
          <div className="md:col-span-4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {plan.planName}
            </h1>

            <div className="mb-4">
              <p className="text-xl text-gray-700">{plan.description}</p>
            </div>

            {plan.features && plan.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Plan Features:
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-lg">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                <strong>Plan Status:</strong>{" "}
                {plan.discontinued ? "Discontinued" : "Active"}
              </p>
            </div>
          </div>

          {/* Right Side - Purchase Card */}
          {!plan.discontinued ? (
            <div className="md:col-span-3 p-6 md:p-8 flex items-center justify-center bg-gray-50">
              <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-8">
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900">
                    ${plan.price.toFixed(2)}{" "}
                    <span className="text-sm text-gray-600">per month</span>
                  </p>
                  {durationType === "yearly" && (
                    <p className="text-green-600 font-semibold">
                      10% Yearly Discount Applied
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Select Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      max={maxStartDate}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Duration Type
                    </label>
                    <select
                      value={durationType}
                      onChange={(e) => setDurationType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  {durationType === "monthly" && (
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Number of Months
                      </label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) =>
                          setDuration(Math.max(1, e.target.value))
                        }
                        min="1"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-xl font-bold">
                      Total Price: ${totalPrice.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-bold"
                  >
                    Checkout
                  </button>

                  <div className="text-sm text-gray-600 mt-2 text-center">
                    <p>✓ Secure transaction</p>
                    <p>✓ Instant activation</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:col-span-1 p-8 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg border border-red-200">
                <p className="text-red-600 text-center font-bold">
                  This plan is discontinued and cannot be purchased.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsWithBuy;
