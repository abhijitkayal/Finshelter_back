import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "./CustomerAuthContext";

const CustomerProtectedRoute = ({ element }) => {
	const token = localStorage.getItem("customerToken");
	const { isLoggedIn, fetchCustomerDashboard } = useCustomerAuth();
	const location = useLocation();

	useEffect(() => {
		// If token exists but user isn't logged in context, fetch dashboard
		if (token && !isLoggedIn) {
			fetchCustomerDashboard();
		}
	}, [token, isLoggedIn, fetchCustomerDashboard]);

	// If no token, redirect to login
	if (!token) {
		return <Navigate to='/customers/login' replace state={{ from: location }} />;
	}

	return element;
};

export default CustomerProtectedRoute;

