
// ProtectedRoute.jsx - For Cookie-based Authentication
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth); // Only check user

  // Check if user is authenticated
  if (!user) {
    // Redirect to auth page and save the attempted location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;