// EmployeeDashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import EmSidebar from "./EmSidebar";
import EmDash from "./EmDash";
import EmAssignedCustomers from "./EmAssignedCustomers";
import EmployeeQueries from "./EmployeeQueries";
import EmProfile from "./EmProfile";
import EmLeads from "./EmLeads";
import { useNotification } from "../NotificationContext";
import EmTopbar from "./EmTopbar";

const EmployeeDashboard = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { email } = useParams();
	const { showNotification, setCurrentPage } = useNotification();

	// Get current active section based on route
	const getCurrentSection = () => {
		const path = location.pathname.split('/').pop();
		switch(path) {
			case 'overview': return 'Dashboard';
			case 'orders': return 'Orders';
			case 'leads': return 'Leads';
			case 'queries': return 'Customer Queries';
			case 'profile': return 'Profile';
			default: return 'Dashboard';
		}
	};

	const activeSection = getCurrentSection();

	useEffect(() => {
		setCurrentPage("employee");
	}, [setCurrentPage]);

	// Function to handle section navigation
	const handleSectionChange = (section) => {
		const routeMap = {
			'Dashboard': 'overview',
			'Orders': 'orders',
			'Leads': 'leads',
			'Customer Queries': 'queries',
			'Profile': 'profile'
		};
		navigate(`/employees/dashboard/${email}/${routeMap[section]}`);
	};

	// Function to render current component based on route
	const renderCurrentComponent = () => {
		const path = location.pathname.split('/').pop();
		switch(path) {
			case 'overview': return <EmDash />;
			case 'orders': return <EmAssignedCustomers />;
			case 'leads': return <EmLeads />;
			case 'queries': return <EmployeeQueries />;
			case 'profile': return <EmProfile />;
			default: return <EmDash />;
		}
	};

	return (
		<div className='employee-dashboard'>
			<EmSidebar
				activeSection={activeSection}
				onSectionChange={handleSectionChange}
			/>
			<div className='content1'>
				<EmTopbar 
					activeSection={activeSection} 
					onSectionChange={handleSectionChange}
				/>
				<div className='content'>
					{renderCurrentComponent()}
				</div>
			</div>
		</div>
	);
};

export default EmployeeDashboard;
