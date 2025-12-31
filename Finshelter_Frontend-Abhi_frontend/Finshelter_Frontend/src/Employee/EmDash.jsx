import React, { useContext, useEffect } from "react";
import { EmployeeContext } from "./EmployeeContext";
import EmployeeDashboardCharts from "./EmployeeDashboardCharts";

const EmDash = () => {
	const {
		employeeInfo,
		metrics,
		status,
		loading,
		error,
		fetchEmployeeDashboard,
	} = useContext(EmployeeContext);

	useEffect(() => {
		const loadDashboard = async () => {
			try {
				await fetchEmployeeDashboard();
			} catch (error) {
				console.error('Failed to fetch employee dashboard:', error);
				// Error is already handled in the context
			}
		};
		
		loadDashboard();
	}, []); // Remove dependency to avoid infinite loops

	if (loading) return (
		<div className="loading-container">
			<div>Loading dashboard data...</div>
		</div>
	);
	
	if (error) return (
		<div className="error-container">
			<div className="error-message">
				<h3>Unable to load dashboard</h3>
				<p>{error}</p>
				<button onClick={() => fetchEmployeeDashboard()}>
					Try Again
				</button>
			</div>
		</div>
	);

	return (
		<div className='ctax-dashboard-section'>
			{employeeInfo ? (
				<>
					<div className='cdashboard-summary'>
						<h1>Welcome, {employeeInfo.name}</h1>

						{/* <div>
							<div className='cdashboard-card'>
								<p>
									<strong>Assigned Customers:</strong> {metrics.totalCustomers}
								</p>
							</div>
							<div className='cdashboard-card'>
								<p>
									<strong>Active Customers:</strong> {metrics.activeCustomers}
								</p>
							</div>
							<div className='cdashboard-card'>
								<p>
									<strong>Completed Services:</strong>{" "}
									{metrics.completedServices}
								</p>
							</div>
							<div className='cdashboard-card'>
								<p>
									<strong>Service:</strong>{" "}
									{employeeInfo.serviceId?.name || "Not Assigned"}
								</p>
							</div>
							<div className='cdashboard-card'>
								<p>
									<strong>Profile Status:</strong>{" "}
									{status.isProfileComplete ? "Complete" : "Incomplete"}
								</p>
							</div>
						</div> */}
					</div>

					{/* Add the charts component */}
					<EmployeeDashboardCharts
						metrics={metrics}
						employeeInfo={employeeInfo}
					/>
				</>
			) : (
				<p>No dashboard data available</p>
			)}
		</div>
	);
};

export default EmDash;
