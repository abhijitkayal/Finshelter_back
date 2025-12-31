import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to='/admin/login' replace />;
  }

  return element;
};

export default ProtectedRoute;
