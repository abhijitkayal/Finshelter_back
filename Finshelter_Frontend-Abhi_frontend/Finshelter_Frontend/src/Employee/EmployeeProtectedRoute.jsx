// EmployeeProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { EmployeeContext } from "./EmployeeContext";

const EmployeeProtectedRoute = ({ element }) => {
 const token = localStorage.getItem("employeeToken");
 
  if (!token) {
    return <Navigate to='/employees/login' replace />;
  }

  return element; // Show the protected element if authenticated
};

export default EmployeeProtectedRoute;
