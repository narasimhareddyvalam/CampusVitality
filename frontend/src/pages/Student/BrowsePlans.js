import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPlans,
  selectPlans,
  selectPlansStatus,
  selectPlansError,
} from "../../redux/slices/plansSlice";

const BrowsePlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const plans = useSelector(selectPlans);
  const plansStatus = useSelector(selectPlansStatus);
  const error = useSelector(selectPlansError);

  const [showDiscontinued, setShowDiscontinued] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 10000]); // Set a default price range
  const [selectedProvider, setSelectedProvider] = useState("all");

  const plansPerPage = 10;

  useEffect(() => {
    if (plansStatus === "idle") {
      dispatch(fetchPlans());
    }
  }, [dispatch, plansStatus]);

  const toggleDiscontinued = () => {
    setShowDiscontinued((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to the first page on sort
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split("-").map(Number);
    setPriceRange([min, max]);
    setCurrentPage(1); // Reset to the first page
  };

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const filteredPlans = plans
    .filter((plan) => (showDiscontinued ? true : !plan.discontinued))
    .filter(
      (plan) =>
        plan.planName.toLowerCase().includes(searchQuery) ||
        plan.description.toLowerCase().includes(searchQuery) ||
        plan.serviceProvider.toLowerCase().includes(searchQuery)
    )
    .filter(
      (plan) => plan.price >= priceRange[0] && plan.price <= priceRange[1] // Filter by price range
    )
    .filter(
      (plan) =>
        selectedProvider === "all" || plan.serviceProvider === selectedProvider // Filter by provider
    );

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0; // Default order (no sorting)
  });

  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = sortedPlans.slice(indexOfFirstPlan, indexOfLastPlan);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewDetails = (planId) => {
    navigate(`/browse-plans/${planId}`);
  };

  // Get unique providers for the dropdown
  const uniqueProviders = [
    "all",
    ...new Set(plans.map((plan) => plan.serviceProvider)),
  ];

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen"
      style={{ width: "90%", margin: "0 auto" }}
    >
      <h1 className="text-xl font-bold text-[#2A3A2B] mb-6">Browse Plans</h1>

      {plansStatus === "loading" && (
        <p className="text-base text-gray-600">Loading plans...</p>
      )}
      {plansStatus === "failed" && (
        <p className="text-base text-red-600">{error}</p>
      )}

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search plans..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]"
        />

        {/* Price Range */}
        <select
          value={`${priceRange[0]}-${priceRange[1]}`}
          onChange={handlePriceChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]"
        >
          <option value="0-1000">All Prices</option>
          <option value="0-100">Up to $100</option>
          <option value="100-200">$100 to $200</option>
          <option value="200-400">$200 to $400</option>
          <option value="400-600">$400 to $600</option>
          <option value="400-1000">$400 to $1000</option>
        </select>

        {/* Service Provider */}
        <select
          value={selectedProvider}
          onChange={handleProviderChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]"
        >
          {uniqueProviders.map((provider) => (
            <option key={provider} value={provider}>
              {provider === "all" ? "All Providers" : provider}
            </option>
          ))}
        </select>

        {/* Sort by Price */}
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5AA9E6]"
        >
          <option value="default">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {currentPlans.length === 0 && plansStatus === "succeeded" ? (
        <p className="text-base text-gray-600">No plans available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {currentPlans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-xl"
            >
              <div className="flex-grow">
                <h2 className="text-base font-bold text-[#2A3A2B] mb-2">
                  {plan.planName}
                </h2>
                <p className="text-base text-gray-600 mb-2">
                  Provider: {plan.serviceProvider}
                </p>
                <p
                  className="text-base text-[#485550] mb-4"
                  style={{ maxWidth: "100%", wordWrap: "break-word" }}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mt-4 flex flex-col items-start">
                {/* Features Section */}
                <div className="w-full lg:w-1/2">
                  <h3 className="text-base font-semibold text-[#2A3A2B] mb-2">
                    Features:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-base">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and Button Section */}
                <div className="w-full lg:w-1/2 flex flex-col items-start">
                  <div className="text-black font-bold text-base mb-4">
                    ${plan.price.toFixed(2)}
                  </div>

                  <button
                    onClick={() => handleViewDetails(plan._id)}
                    className="px-6 py-3 bg-[#5AA9E6] text-white rounded-md hover:scale-105 transform transition-all duration-300 w-full"
                  >
                    View Details & Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedPlans.length > plansPerPage && (
        <div className="flex flex-wrap justify-center mt-6">
          {Array.from({
            length: Math.ceil(sortedPlans.length / plansPerPage),
          }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 mx-1 mb-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-[#5AA9E6] text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:scale-105 transform transition-all duration-300`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePlans;
