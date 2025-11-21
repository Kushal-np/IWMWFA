import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth); // Only check user

  // Check if user is authenticated
  if (!user) {
    // Redirect to auth page
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    // Redirect to unauthorized page or home page
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and is admin, render the protected component
  return children;
};

export default AdminRoute;