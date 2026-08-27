import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";

// Guards routes that require a signed-in customer (checkout, account page).
// Sends the shopper to sign in first, then back to where they were headed.
export default function CustomerProtectedRoute({ children }) {
  const { customer, loading } = useCustomerAuth();
  const location = useLocation();

  if (loading) return <div className="max-w-7xl mx-auto px-5 py-16 text-muted">Loading...</div>;
  if (!customer) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }
  return children;
}
