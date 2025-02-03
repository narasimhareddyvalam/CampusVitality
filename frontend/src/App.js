import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// import LandingPage from "./pages/LandingPage";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import AdminPage from "./pages/Admin/AdminPage";
import SalesPage from "./pages/Sales/SalesPage";
import BrowsePlans from "./pages/Student/BrowsePlans";
import CreateSalesUser from "./pages/Admin/CreateSalesUser";
import MyTeam from "./pages/Admin/MyTeam";
import ProtectedRoute from "./components/protectedRoute";
import { UserProvider } from "./context/userContext";
import CreatePlan from "./pages/Student/CreatePlan";
import ModifyPlan from "./pages/Sales/ModifyPlan";
import PlanDetailsWithBuy from "./pages/Student/PlanDetailsWithBuy";
import MyPlans from "./pages/Sales/MyPlans";
import SuccessPage from "./pages/successPage";
import MyProfile from "./pages/Student/MyProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SendVerificationEmail from "./pages/SendVerificationEmail";
import VerifyEmail from "./pages/VerifyEmail";
import BookingsPage from "./pages/Admin/BookingsPage";
import BookingsAnalyticsPage from "./pages/Admin/BookingsAnalyticsPage";
import AdminPlansPage from "./pages/Admin/AdminPlansPage";
import ContactUs from "./pages/Main/ContactUs";
import Homepage from "./pages/Main/Homepage";
import AboutUs from "./pages/Main/AboutUs";
import Footer from "./components/Footer";
// Stripe integration
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentFailed from "./pages/PaymentFailed";

const stripePromise = loadStripe(
  "pk_test_51QPxa2L1athdecW2ejeQuZe103b8wnu5jkIe9Zgxs5zeR2mvwsyPb7ueGOTt5c639MCOarK50sGp15edVXRDE9J4004UzDUACx"
); // Replace with your Stripe publishable key

const App = () => {
  return (
    <UserProvider>
      <div style={{ fontFamily: "'Maven Pro', sans-serif" }}>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-sales"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateSalesUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/create-plan"
              element={
                <ProtectedRoute requiredRole="sales">
                  <CreatePlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/modify-plan/:id"
              element={
                <ProtectedRoute requiredRole="sales">
                  <ModifyPlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/my-team"
              element={
                <ProtectedRoute requiredRole="admin">
                  <MyTeam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute requiredRole="sales">
                  <SalesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/my-team"
              element={
                <ProtectedRoute requiredRole="sales">
                  <MyTeam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/browse-plans"
              element={
                <ProtectedRoute requiredRole="student">
                  <BrowsePlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/browse-plans/:id"
              element={
                <ProtectedRoute requiredRole="student">
                  <Elements stripe={stripePromise}>
                    <PlanDetailsWithBuy />
                  </Elements>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-plans"
              element={
                <ProtectedRoute requiredRole="student">
                  <MyPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute requiredRole="student">
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/send-verification-email"
              element={<SendVerificationEmail />}
            />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/analytics" element={<BookingsAnalyticsPage />} />
            <Route path="/admin/plans" element={<AdminPlansPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </UserProvider>
  );
};

export default App;
