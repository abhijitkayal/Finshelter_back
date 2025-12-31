// In EmAssignedCustomers.js
import React, { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "./EmployeeContext";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import StarRating from "./StarRating"; // We'll create this component

const EmAssignedCustomers = () => {
	const {
		assignedCustomers,
		loading,
		error,
		updateServiceStatus,
		fetchAssignedCustomers,
		user,
		updateServiceDelayReason,
	} = useContext(EmployeeContext);

	const [canDownload, setCanDownload] = useState(false);
	const [delayReasons, setDelayReasons] = useState({});
	const [isEditingReason, setIsEditingReason] = useState(null);
	const [showAllFeedback, setShowAllFeedback] = useState({});

	const handleStatusChange = async (event, serviceId, status, customerId) => {
		event.preventDefault();
		try {
			console.log(
				"Updating service with ID:",
				serviceId,
				"to status:",
				status,
				"for customer ID:",
				customerId
			);
			const response = await updateServiceStatus(serviceId, status, customerId);
			alert(response.message);
		} catch (err) {
			alert("Failed to update service status.");
		}
	};

	const handleDelayReasonChange = (serviceId, reason) => {
		setDelayReasons((prev) => ({
			...prev,
			[serviceId]: reason,
		}));
	};

	const saveDelayReason = async (serviceId, customerId) => {
		try {
			await updateServiceDelayReason(
				serviceId,
				delayReasons[serviceId],
				customerId
			);
			setIsEditingReason(null);
		} catch (err) {
			alert("Failed to save delay reason.");
		}
	};

	const toggleFeedbackDisplay = (serviceId) => {
		setShowAllFeedback((prev) => ({
			...prev,
			[serviceId]: !prev[serviceId],
		}));
	};

	// Calculate days delayed
	const calculateDaysDelayed = (dueDate, completionDate) => {
		if (!dueDate) return 0;

		const due = new Date(dueDate);
		const completion = completionDate ? new Date(completionDate) : new Date();

		// Calculate difference in days
		const diffTime = completion - due;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return diffDays > 0 ? diffDays : 0;
	};

	// Format date
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	useEffect(() => {
		console.log("EmAssignedCustomers component mounted, fetching data...");
		fetchAssignedCustomers();
		// Check if the user has download access
		if (user && user.downloadAccess) {
			setCanDownload(true);
		} else {
			setCanDownload(false);
		}
	}, [fetchAssignedCustomers, user]); // Add user as a dependency

	const handleRefresh = () => {
		console.log("Manual refresh triggered");
		fetchAssignedCustomers();
	};

	// Ensure assignedCustomers is an array before mapping
	const isAssignedCustomersArray =
		Array.isArray(assignedCustomers) && assignedCustomers.length > 0;

	const downloadAsPDF = () => {
		const doc = new jsPDF();
		const tableData = [];

		assignedCustomers.forEach((customer) => {
			customer.services.forEach((service) => {
				tableData.push([
					service.orderId,
					formatDate(service.purchasedAt),
					customer._id,
					customer.name,
					customer.L1Name || "N/A",
					service.serviceName || "Unknown",
					service.status,
					formatDate(service.completionDate),
					calculateDaysDelayed(service.dueDate, service.completionDate),
					delayReasons[service._id] || "",
					service.feedback && service.feedback.length > 0
						? "Received"
						: "Pending",
					service.feedback && service.feedback.length > 0
						? service.feedback[0].feedback.substring(0, 30) + "..."
						: "",
					service.feedback && service.feedback.length > 0
						? service.feedback[0].rating
						: "N/A",
				]);
			});
		});

		doc.autoTable({
			head: [
				[
					"Order ID",
					"Order Date",
					"Customer ID",
					"Customer Name",
					"L+1 Employee Name",
					"Service Name",
					"Order Status",
					"Completion Date",
					"Days Delayed",
					"Reason for Delay",
					"Feedback Status",
					"Feedback",
					"Rating",
				],
			],
			body: tableData,
		});

		doc.save("assigned_customers.pdf");
	};

	const downloadAsCSV = () => {
		const csvData = [];
		assignedCustomers.forEach((customer) => {
			customer.services.forEach((service) => {
				csvData.push({
					"Order ID": service.orderId,
					"Order Date": formatDate(service.purchasedAt),
					"Customer ID": customer._id,
					Name: customer.name,
					"L+1 Employee Name": customer.L1Name || "N/A",
					"Service Name": service.serviceName || "Unknown",
					"Service Status": service.status,
					"Completion Date": formatDate(service.completionDate),
					"Days Delayed": calculateDaysDelayed(
						service.dueDate,
						service.completionDate
					),
					"Reason for Delay": delayReasons[service._id] || "",
					"Feedback Status":
						service.feedback && service.feedback.length > 0
							? "Received"
							: "Pending",
					Feedback:
						service.feedback && service.feedback.length > 0
							? service.feedback[0].feedback.substring(0, 30) + "..."
							: "",
					Rating:
						service.feedback && service.feedback.length > 0
							? service.feedback[0].rating
							: "N/A",
				});
			});
		});

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "assigned_customers.csv");
	};

	return (
		<div className='assigned-customers tax-dashboard-employee'>
			<div className="header-controls" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h3>Assigned Orders</h3>
				<button 
					onClick={handleRefresh}
					style={{ 
						padding: '8px 16px', 
						backgroundColor: '#007bff', 
						color: 'white', 
						border: 'none', 
						borderRadius: '4px', 
						cursor: 'pointer' 
					}}
				>
					🔄 Refresh
				</button>
			</div>
			{error && <p style={{color: 'red'}}>Error fetching customers: {error}</p>}
			{loading && <p>Loading assigned customers...</p>}
			<div style={{marginBottom: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px'}}>
				<strong>Debug Info:</strong> Found {assignedCustomers?.length || 0} assigned customers
			</div>
			{canDownload && (
				<div className='table-bottom-btns'>
					<button className='tax-service-btn' onClick={downloadAsCSV}>
						<i className='fa-solid fa-file-csv fa-2xl'></i>
					</button>
					<button className='tax-service-btn' onClick={downloadAsPDF}>
						<i className='fa-solid fa-file-pdf fa-2xl'></i>
					</button>
				</div>
			)}
			{isAssignedCustomersArray ? (
				<div className='tax-services-wrap-table'>
					<table className='table'>
						<thead>
							<tr>
								<th>Order ID</th>
								<th>Order Date</th>
								<th>Customer ID</th>
								<th>Customer Name</th>
								<th>L+1 Employee Name</th>
								<th>Service Name</th>
								<th>Order Status</th>
								<th>Completion Date</th>
								<th>Days Delayed</th>
								<th>Reason for Delay</th>
								<th>Feedback Status</th>
								<th>Feedback</th>
								<th>Rating</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{assignedCustomers.map((customer) =>
								customer.services.map((service) => (
									<tr key={service._id}>
										<td>{service.orderId}</td>
										<td>{formatDate(service.purchasedAt)}</td>
										<td>{customer._id}</td>
										<td>{customer.name}</td>
										<td>{customer.L1Name || "N/A"}</td>
										<td>{service.serviceName || "Unknown"}</td>
										<td>
											<span
												style={{
													backgroundColor:
														service.status === "completed"
															? "#d4edda"
															: service.status === "in-process"
															? "#cce5ff"
															: service.status === "rejected"
															? "#f8d7da"
															: "#ffeeba",
													padding: "3px 8px",
													borderRadius: "4px",
													fontWeight: "bold",
													color:
														service.status === "completed"
															? "#155724"
															: service.status === "in-process"
															? "#004085"
															: service.status === "rejected"
															? "#721c24"
															: "#856404",
												}}>
												{service.status || "Pending"}
											</span>
										</td>
										<td>{formatDate(service.completionDate)}</td>
										<td>
											{calculateDaysDelayed(
												service.dueDate,
												service.completionDate
											)}
										</td>
										<td>
											{isEditingReason === service._id ? (
												<div>
													<input
														type='text'
														value={delayReasons[service._id] || ""}
														onChange={(e) =>
															handleDelayReasonChange(
																service._id,
																e.target.value
															)
														}
														className='form-control form-control-sm'
													/>
													<button
														className='btn btn-sm btn-success mt-1'
														onClick={() =>
															saveDelayReason(service._id, customer._id)
														}>
														Save
													</button>
												</div>
											) : (
												<div>
													{delayReasons[service._id] || "N/A"}
													<button
														className='btn btn-sm btn-link'
														onClick={() => setIsEditingReason(service._id)}>
														Edit
													</button>
												</div>
											)}
										</td>
										<td>
											{service.feedback && service.feedback.length > 0 ? (
												<span style={{ color: "green", fontWeight: "bold" }}>
													Received
												</span>
											) : (
												<span style={{ color: "orange" }}>Pending</span>
											)}
										</td>
										<td>
											{service.feedback && service.feedback.length > 0 ? (
												<div>
													<div
														style={{
															maxWidth: "150px",
															overflow: "hidden",
															textOverflow: "ellipsis",
															whiteSpace: showAllFeedback[service._id]
																? "normal"
																: "nowrap",
														}}>
														{service.feedback[0].feedback}
													</div>
													<button
														className='btn btn-sm btn-link'
														onClick={() => toggleFeedbackDisplay(service._id)}>
														{showAllFeedback[service._id]
															? "Show Less"
															: "Show More"}
													</button>
												</div>
											) : (
												"N/A"
											)}
										</td>
										<td>
											{service.feedback && service.feedback.length > 0 ? (
												<StarRating rating={service.feedback[0].rating} />
											) : (
												"N/A"
											)}
										</td>
										<td className='tax-btn-cont'>
											<button
												className='tax-service-btn'
												onClick={(e) =>
													handleStatusChange(
														e,
														service.serviceId,
														"completed",
														customer._id
													)
												}
												disabled={service.status === "completed"}>
												Approve
											</button>
											<button
												className='tax-service-btn'
												onClick={(e) =>
													handleStatusChange(
														e,
														service.serviceId,
														"in-process",
														customer._id
													)
												}
												disabled={service.status === "in-process"}>
												In-Process
											</button>
											<button
												className='serviceDelete'
												onClick={(e) =>
													handleStatusChange(
														e,
														service.serviceId,
														"rejected",
														customer._id
													)
												}
												disabled={service.status === "rejected"}>
												Reject
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			) : (
				<p>No assigned orders available.</p>
			)}
		</div>
	);
};

export default EmAssignedCustomers;
