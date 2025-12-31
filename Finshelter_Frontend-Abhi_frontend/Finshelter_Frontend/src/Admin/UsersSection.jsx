// import React, { useContext, useState, useMemo } from "react";
// import { AdminDashboardContext } from "./AdminDashboardContext";
// import { saveAs } from "file-saver";
// import Papa from "papaparse";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import axios from "./utils/axiosConfig";
// import { useNotification } from "../NotificationContext";
// import {
// 	Button,
// 	Dialog,     
// 	DialogActions,
// 	DialogContent,
// 	DialogContentText,
// 	DialogTitle,
// 	Select,
// 	MenuItem,
// 	TextField,
// } from "@mui/material";

// const UsersSection = () => {
// 	const {
// 		users,
// 		services,
// 		loading,
// 		error,
// 		handleActivateUser,
// 		handleDeactivateUser,
// 		handleDeleteUser,
// 		assigningService,
// 		handleAssignService, // We'll assume this function exists in context
// 		updateUsers,
// 		newUser,
// 		setNewUser,
// 		showUserForm,
// 		setShowUserForm,
// 		handleCreateUser,
// 	} = useContext(AdminDashboardContext);

// 	const [searchTerm, setSearchTerm] = useState("");
// 	const [filterOption, setFilterOption] = useState("newest");
// 	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
// 	const { showNotification } = useNotification();

// 	// State for row editing
// 	const [editingRow, setEditingRow] = useState(null);
// 	const [editedData, setEditedData] = useState({});
// 	const [originalData, setOriginalData] = useState({});
// 	const [openDialog, setOpenDialog] = useState(false);

// 	// State for service assignment
// 	const [assigningUserId, setAssigningUserId] = useState(null);
// 	const [selectedServiceId, setSelectedServiceId] = useState("");

// 	// Start editing row
// 	const handleStartEdit = (user) => {
// 		setEditingRow(user._id);
// 		setEditedData({
// 			name: user.name,
// 			email: user.email,
// 			username: user.username,
// 			mobile: user.mobile,
// 			gender: user.gender || "",
// 			pan: user.pan || "",
// 			gst: user.gst || "",
// 			address: user.address || "",
// 			city: user.city || "",
// 			state: user.state || "",
// 			country: user.country || "",
// 			postalCode: user.postalCode || "",
// 			natureEmployment: user.natureEmployment || "",
// 			annualIncome: user.annualIncome || "",
// 			education: user.education || "",
// 			university: user.university || "",
// 			certifications: user.certifications || "",
// 			institute: user.institute || "",
// 			reasonForInactive: user.reasonForInactive || "",
// 			activeTill: user.activeTill ? new Date(user.activeTill).toISOString().split('T')[0] : "",
// 		});
// 		setOriginalData({
// 			name: user.name,
// 			email: user.email,
// 			username: user.username,
// 			mobile: user.mobile,
// 			gender: user.gender || "",
// 			pan: user.pan || "",
// 			gst: user.gst || "",
// 			address: user.address || "",
// 			city: user.city || "",
// 			state: user.state || "",
// 			country: user.country || "",
// 			postalCode: user.postalCode || "",
// 			natureEmployment: user.natureEmployment || "",
// 			annualIncome: user.annualIncome || "",
// 			education: user.education || "",
// 			university: user.university || "",
// 			certifications: user.certifications || "",
// 			institute: user.institute || "",
// 			reasonForInactive: user.reasonForInactive || "",
// 			activeTill: user.activeTill ? new Date(user.activeTill).toISOString().split('T')[0] : "",
// 		});
// 	};

// 	// Handle field change
// 	const handleFieldChange = (field, value) => {
// 		setEditedData((prev) => ({
// 			...prev,
// 			[field]: value,
// 		}));
// 	};

// 	// Get changed fields
// 	const getChangedFields = () => {
// 		const changes = {};
// 		Object.keys(editedData).forEach((key) => {
// 			if (editedData[key] !== originalData[key]) {
// 				changes[key] = editedData[key];
// 			}
// 		});
// 		return changes;
// 	};

// 	// Handle save
// 	const handleSave = async () => {
// 		const changes = getChangedFields();
// 		if (Object.keys(changes).length === 0) {
// 			setEditingRow(null);
// 			return;
// 		}
// 		setOpenDialog(true);
// 	};

// 	// Handle confirm save
// 	const handleConfirmSave = async () => {
// 		const changes = getChangedFields();
// 		try {
// 			const response = await axios.patch(
// 				`https://195-35-45-82.sslip.io:8000/api/admin/users/${editingRow}`,
// 				changes
// 			);

// 			if (response.status === 200) {
// 				const updatedUsers = users.map((user) =>
// 					user._id === editingRow ? { ...user, ...changes } : user
// 				);
// 				updateUsers(updatedUsers);
// 				showNotification("Updated successfully", "success");
// 			}
// 		} catch (error) {
// 			showNotification("Error updating user", "error");
// 		}
// 		setEditingRow(null);
// 		setOpenDialog(false);
// 	};

// 	// Handle cancel
// 	const handleCancel = () => {
// 		setEditingRow(null);
// 		setEditedData({});
// 		setOriginalData({});
// 	};

// 	// Handle service assignment
// 	const startAssigningService = (userId) => {
// 		setAssigningUserId(userId);
// 		setSelectedServiceId(""); // Reset selected service
// 	};

// 	const confirmAssignService = () => {
// 		if (!selectedServiceId) {
// 			showNotification("Please select a service", "error");
// 			return;
// 		}
// 		handleAssignService(assigningUserId, selectedServiceId);
// 		setAssigningUserId(null);
// 		setSelectedServiceId("");
// 	};

// 	const normalizeDate = (dateStr) => {
// 		const date = new Date(dateStr);
// 		date.setHours(0, 0, 0, 0);
// 		return date;
// 	};

// 	const formatDate = (dateStr) => {
// 		if (!dateStr) return "Not available";
// 		const date = new Date(dateStr);
// 		const options = { day: "2-digit", month: "short", year: "numeric" };
// 		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
// 	};

// 	const filteredCustomers = useMemo(() => {
// 		return users
// 			.filter((user) => user.role === "customer")
// 			.filter((user) => {
// 				const lowerSearchTerm = searchTerm.toLowerCase();
// 				return (
// 					user.name.toLowerCase().includes(lowerSearchTerm) ||
// 					user._id.toLowerCase().includes(lowerSearchTerm)
// 				);
// 			})
// 			.filter((user) => {
// 				const userDate = new Date(user.createdAt);
// 				const fromDate = dateFilter.fromDate
// 					? normalizeDate(dateFilter.fromDate)
// 					: null;
// 				const toDate = dateFilter.toDate
// 					? normalizeDate(dateFilter.toDate)
// 					: null;

// 				return (
// 					(fromDate === null || userDate >= fromDate) &&
// 					(toDate === null || userDate <= toDate)
// 				);
// 			})
// 			.sort((a, b) => {
// 				if (filterOption === "newest") {
// 					return new Date(b.createdAt) - new Date(a.createdAt);
// 				} else if (filterOption === "alphabetical") {
// 					return a.name.localeCompare(b.name);
// 				}
// 				return 0;
// 			});
// 	}, [users, searchTerm, dateFilter, filterOption]);

// 	const handleDownloadCSV = () => {
// 		const csvData = filteredCustomers.map((user) => ({
// 			CustomerCode: user._id,
// 			FullName: user.name,
// 			EmailID: user.email,
// 			PhoneNumber: user.mobile,
// 			DateOfBirth: formatDate(user.dob),
// 			Gender: user.gender || "",
// 			PAN: user.pan || "-",
// 			GSTIN: user.gst || "-",
// 			FullAddress: user.address || "-",
// 			City: user.city || "-",
// 			State: user.state || "-",
// 			Country: user.country || "-",
// 			PostalCode: user.postalCode || "-",
// 			NatureOfEmployment: user.natureEmployment || "-",
// 			AnnualIncome: user.annualIncome || "-",
// 			EducationQualification: user.education || "-",
// 			University: user.university || "-",
// 			MonthYearOfPassing: formatDate(user.passingMonthYear),
// 			Certifications: user.certifications || "-",
// 			Institute: user.institute || "-",
// 			CompletionDate: formatDate(user.completionDate),
// 			BankAccountNumber: user.bankDetails?.accountNumber || "-",
// 			IFSCCode: user.bankDetails?.ifscCode || "-",
// 		ReferralCode: user.referralCode || "-",
// 		ReferredUsersCount: user.referredUsers?.length || 0,
// 			ReferredBy: user.referredBy || "-",
// 			Services: user.services?.length || 0,
// 			TotalPayments:
// 				user.paymentHistory?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
// 			IsActive: user.isActive ? "Yes" : "No",
// 			CreatedAt: formatDate(user.createdAt),
// 			LastUpdated: formatDate(user.updatedAt),
// 			CurrentStatus: user.isActive ? "Active" : "Inactive",
// 			ReasonForInactive: user.reasonForInactive || "-",
// 		}));

// 		const csv = Papa.unparse(csvData);
// 		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// 		saveAs(blob, "customers_detailed.csv");
// 	};

// 	const handleDownloadPDF = () => {
// 		const doc = new jsPDF("landscape", "pt", "a3");
// 		const tableColumn = [
// 			"Customer Code",
// 			"Full Name",
// 			"Email ID",
// 			"Phone Number",
// 			"Creation Date",
// 			"Date of Birth",
// 			"Gender",
// 			"PAN",
// 			"GSTIN",
// 			"Full Address",
// 			"City",
// 			"State",
// 			"Country",
// 			"Postal Code",
// 			"Nature of Employment",
// 			"Annual Income",
// 			"Education Qualification",
// 			"University",
// 			"Month & Year of Passing",
// 			"Certifications",
// 			"Institute",
// 			"Completion Date",
// 			"Bank Account Number",
// 			"IFSC Code",
// 			"Referral Code",
// 			"Referred Users Count",
// 			"Referred By",
// 			"Services",
// 			"Total Payments",
// 			"IsActive",
// 			"Created At",
// 			"Last Updated",
// 			"Current Status",
// 			"Active Till",
// 			"Reason For Inactive",
// 		];
// 		const tableRows = filteredCustomers.map((user) => [
// 			user._id,
// 			user.name,
// 			user.email,
// 			user.mobile,
// 			formatDate(user.dob),
// 			user.gender || "-",
// 			user.pan || "-",
// 			user.gst || "-",
// 			user.address || "-",
// 			user.city || "-",
// 			user.state || "-",
// 			user.country || "-",
// 			user.postalCode || "-",
// 			user.natureEmployment || "-",
// 			user.annualIncome || "-",
// 			user.education || "-",
// 			user.university || "-",
// 			formatDate(user.passingMonthYear),
// 			user.certifications || "-",
// 			user.institute || "-",
// 			formatDate(user.completionDate),
// 			user.bankDetails?.accountNumber || "-",
// 			user.bankDetails?.ifscCode || "-",
// 		user.referralCode || "-",
// 		user.referredUsers?.length || 0,
// 			user.referredBy || "-",
// 			user.services?.length || 0,
// 			user.paymentHistory?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
// 			user.isActive ? "Yes" : "No",
// 			user.activeTill ? formatDate(user.activeTill) : "-",
// 			user.isActive ? "Active" : "Inactive",
// 			user.reasonForInactive || "-",
// 		]);

// 		doc.text("Detailed Customer Data", 40, 40);
// 		doc.autoTable({
// 			head: [tableColumn],
// 			body: tableRows,
// 			startY: 50,
// 			styles: { fontSize: 8, cellPadding: 2 },
// 			columnStyles: {
// 				0: { cellWidth: 40 }, // Customer Code
// 				1: { cellWidth: 40 }, // Name
// 				2: { cellWidth: 60 }, // Email
// 				3: { cellWidth: 35 }, // Mobile
// 			},
// 			margin: { top: 50 },
// 		});

// 		doc.save("customers_detailed.pdf");
// 	};

// 	if (loading) return <div>Loading Users...</div>;
// 	if (error) return <div>{error}</div>;

// 	const renderCell = (user, field, value) => {
// 		if (editingRow === user._id) {
// 			if (field === "activeTill") {
// 				return (
// 					<input
// 						type='date'
// 						value={editedData[field] || ""}
// 						onChange={(e) => handleFieldChange(field, e.target.value)}
// 						style={{
// 							border: "1px solid var(--accent)",
// 							padding: "12px",
// 							borderRadius: "15px",
// 							fontSize: "16px",
// 							width: "100%",
// 							minWidth: "150px",
// 							pointerEvents: "auto",
// 							cursor: "text",
// 						}}
// 					/>
// 				);
// 			}
// 			return (
// 				<input
// 					type='text'
// 					value={editedData[field] || ""}
// 					onChange={(e) => handleFieldChange(field, e.target.value)}
// 					style={{
// 						border: "1px solid var(--accent)",
// 						padding: "12px",
// 						borderRadius: "15px",
// 						fontSize: "16px",
// 						width: "100%",
// 						minWidth: "150px",
// 						pointerEvents: "auto",
// 						cursor: "text",
// 					}}
// 				/>
// 			);
// 		}
// 		return <span>{value}</span>;
// 	};

// 	const clearAllFilters = () => {
// 		setSearchTerm("");
// 		setFilterOption("newest");
// 		setDateFilter({ fromDate: "", toDate: "" });
// 	};

// 	return (
// 		<div className='tax-dashboard-customers'>
// 			<div className='filter-div'>
// 				<input
// 					type='text'
// 					placeholder='Search by Name or ID'
// 					value={searchTerm}
// 					onChange={(e) => setSearchTerm(e.target.value)}
// 				/>
// 				<div>
// 					<input
// 						type='date'
// 						placeholder='From Date'
// 						value={dateFilter.fromDate}
// 						onChange={(e) =>
// 							setDateFilter({ ...dateFilter, fromDate: e.target.value })
// 						}
// 					/>
// 					<input
// 						type='date'
// 						placeholder='To Date'
// 						value={dateFilter.toDate}
// 						onChange={(e) =>
// 							setDateFilter({ ...dateFilter, toDate: e.target.value })
// 						}
// 					/>
// 				</div>
// 				<div className='table-bottom-btns'>
// 					<button
// 						className='tax-service-btn'
// 						onClick={clearAllFilters}
// 						style={{ backgroundColor: "var(--accent)" }}>
// 						<i className='fa-solid fa-rotate-left'></i>
// 					</button>
// 					<button 
// 						className='tax-service-btn' 
// 						onClick={() => setShowUserForm(true)}>
// 						Add Customer
// 					</button>
// 					<button className='tax-service-btn' onClick={handleDownloadCSV}>
// 						<i className='fa-solid fa-file-csv fa-2xl'></i>
// 					</button>
// 					<button className='tax-service-btn' onClick={handleDownloadPDF}>
// 						<i className='fa-solid fa-file-pdf fa-2xl'></i>
// 					</button>
// 				</div>
// 			</div>
// 			<div className='tax-services-wrap-table'>
// 				<table>
// 					<thead>
// 						<tr>
// 							<th>Customer Code</th>
// 							<th>Full Name</th>
// 							<th>Email ID</th>
// 							<th>Phone Number</th>
// 							<th>Creation Date</th>
// 							<th>Date of Birth</th>
// 							<th>Gender</th>
// 							<th>PAN</th>
// 							<th>GSTIN</th>
// 							<th>Full Address</th>
// 							<th>City</th>
// 							<th>State</th>
// 							<th>Country</th>
// 							<th>Postal Code</th>
// 							<th>Nature of Employment</th>
// 							<th>Annual Income</th>
// 							<th>Education Qualification</th>
// 							<th>University</th>
// 							<th>Month & Year of Passing</th>
// 							<th>Certifications</th>
// 							<th>Institute</th>
// 							<th>Completion Date</th>
// 							<th>Bank Account Number</th>
// 							<th>IFSC Code</th>
// 							<th>Referral Code</th>
// 							<th>Referred Users</th>
// 							<th>Referred By</th>
// 							<th>Services</th>
// 							<th>Assign Service</th> {/* New Column */}
// 							<th>Total Payments</th>
// 							<th>Created At</th>
// 							<th>Last Updated</th>
// 							<th>Current Status</th>
// 							<th>Active Till</th>
// 							<th>Reason For Inactive</th>
// 							<th>Actions</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{filteredCustomers.map((user) => (
// 							<tr key={user._id}>
// 								<td>{user._id}</td>
// 								<td>{renderCell(user, "name", user.name)}</td>
// 								<td>{renderCell(user, "email", user.email)}</td>
// 								<td>{renderCell(user, "mobile", user.mobile)}</td>
// 								<td>{formatDate(user.createdAt)}</td>
// 								<td>{formatDate(user.dob)}</td>
// 								<td>{renderCell(user, "gender", user.gender || "-")}</td>
// 								<td>{renderCell(user, "pan", user.pan || "-")}</td>
// 								<td>{renderCell(user, "gst", user.gst || "-")}</td>
// 								<td>{renderCell(user, "address", user.address || "-")}</td>
// 								<td>{renderCell(user, "city", user.city || "-")}</td>
// 								<td>{renderCell(user, "state", user.state || "-")}</td>
// 								<td>{renderCell(user, "country", user.country || "-")}</td>
// 								<td>
// 									{renderCell(user, "postalCode", user.postalCode || "-")}
// 								</td>
// 								<td>
// 									{renderCell(
// 										user,
// 										"natureEmployment",
// 										user.natureEmployment || "-"
// 									)}
// 								</td>
// 								<td>
// 									{renderCell(user, "annualIncome", user.annualIncome || "-")}
// 								</td>
// 								<td>{renderCell(user, "education", user.education || "-")}</td>
// 								<td>
// 									{renderCell(user, "university", user.university || "-")}
// 								</td>
// 								<td>{formatDate(user.passingMonthYear) || "-"}</td>
// 								<td>
// 									{renderCell(
// 										user,
// 										"certifications",
// 										user.certifications || "-"
// 									)}
// 								</td>
// 								<td>{renderCell(user, "institute", user.institute || "-")}</td>
// 								<td>{formatDate(user.completionDate)}</td>
// 								<td>{user.bankDetails?.accountNumber || "-"}</td>
// 								<td>{user.bankDetails?.ifscCode || "-"}</td>
// 						<td>{user.referralCode || "-"}</td>
// 						<td style={{ fontWeight: 'bold', color: user.referredUsers?.length > 0 ? '#4CAF50' : '#666' }}>
// 							{user.referredUsers?.length || 0}
// 						</td>
// 								<td>{user.referredBy || "-"}</td>
// 								<td>
// 									{user.services && user.services.length > 0 ? (
// 										<select
// 											style={{
// 												border: "1px solid var(--accent)",
// 												borderRadius: "15px",
// 												padding: "15px",
// 												fontSize: "16px",
// 											}}>
// 											{user.services.map((service) => (
// 												<option
// 													key={service.serviceId}
// 													className='service-info'>
// 													{service.name} - {service.status || "In Process"}
// 												</option>
// 											))}
// 										</select>
// 									) : (
// 										"No services"
// 									)}
// 								</td>
// 								<td>
// 									{assigningUserId === user._id ? (
// 										<div className='service-assignment'>
// 											<Select
// 												value={selectedServiceId}
// 												onChange={(e) => setSelectedServiceId(e.target.value)}
// 												displayEmpty
// 												style={{
// 													border: "1px solid var(--accent)",
// 													borderRadius: "15px",
// 													padding: "5px",
// 													fontSize: "16px",
// 												}}>
// 												<MenuItem value='' disabled>
// 													Select a service
// 												</MenuItem>
// 												{services.map((service) => (
// 													<MenuItem key={service._id} value={service._id}>
// 														{service.name}
// 													</MenuItem>
// 												))}
// 											</Select>
// 											<button
// 												className='tax-service-btn'
// 												onClick={confirmAssignService}
// 												disabled={assigningService}>
// 												{assigningService ? "Assigning..." : "Confirm"}
// 											</button>
// 											<button
// 												className='tax-service-btn'
// 												onClick={() => setAssigningUserId(null)}>
// 												Cancel
// 											</button>
// 										</div>
// 									) : (
// 										<button
// 											className='tax-service-btn'
// 											onClick={() => startAssigningService(user._id)}>
// 											Assign Service
// 										</button>
// 									)}
// 								</td>
// 								<td>
// 									₹
// 									{user.paymentHistory?.reduce(
// 										(acc, curr) => acc + curr.amount,
// 										0
// 									) || 0}
// 								</td>
// 								<td>{formatDate(user.createdAt)}</td>
// 								<td>{formatDate(user.updatedAt)}</td>
// 								<td>{user.isActive ? "Active" : "Inactive"}</td>
// 								<td>{renderCell(user, "activeTill", user.activeTill ? formatDate(user.activeTill) : "-")}</td>
// 								<td>
// 									{renderCell(
// 										user,
// 										"reasonForInactive",
// 										user.reasonForInactive || "-"
// 									)}
// 								</td>
// 								<td className='tax-btn-cont'>
// 									{editingRow === user._id ? (
// 										<>
// 											<button className='tax-service-btn' onClick={handleSave}>
// 												Save
// 											</button>
// 											<button
// 												className='tax-service-btn'
// 												onClick={handleCancel}>
// 												Cancel
// 											</button>
// 										</>
// 									) : (
// 										<button
// 											className='tax-service-btn'
// 											onClick={() => handleStartEdit(user)}>
// 											<i className='fa-solid fa-pencil'></i>
// 										</button>
// 									)}
// 									<button
// 										onClick={() =>
// 											user.isActive
// 												? handleDeactivateUser(user._id)
// 												: handleActivateUser(user._id)
// 										}
// 										className={
// 											user.isActive ? "userDeactivate" : "userActivate"
// 										}>
// 										{user.isActive ? "Deactivate" : "Activate"}
// 									</button>
// 									<button
// 										className='serviceDelete'
// 										onClick={() => handleDeleteUser(user._id)}
// 										disabled={user.isActive}>
// 										<i className='fa-solid fa-trash'></i>
// 									</button>
// 								</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 			</div>

// 			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
// 				<DialogTitle>Confirm Changes</DialogTitle>
// 				<DialogContent>
// 					<DialogContentText>
// 						You have modified the following fields:
// 						<ul>
// 							{Object.entries(getChangedFields()).map(([field, value]) => (
// 								<li key={field}>
// 									{field}: {originalData[field]} → {value}
// 								</li>
// 							))}
// 						</ul>
// 						Do you want to save these changes?
// 					</DialogContentText>
// 				</DialogContent>
// 				<DialogActions>
// 					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
// 					<Button onClick={handleConfirmSave} autoFocus>
// 						Save Changes
// 					</Button>
// 				</DialogActions>
// 			</Dialog>

// 			{/* Add Customer Dialog */}
// 			<Dialog
// 				open={showUserForm}
// 				onClose={() => setShowUserForm(false)}
// 				maxWidth='md'
// 				fullWidth>
// 				<DialogTitle>Add Customer</DialogTitle>
// 				<DialogContent>
// 					<TextField
// 						margin='dense'
// 						label='Full Name'
// 						fullWidth
// 						value={newUser.name || ''}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, name: e.target.value })
// 						}
// 					/>
// 					<TextField
// 						margin='dense'
// 						label='Email'
// 						type='email'
// 						fullWidth
// 						value={newUser.email || ''}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, email: e.target.value })
// 						}
// 					/>
// 					<TextField
// 						margin='dense'
// 						label='Password'
// 						type='password'
// 						fullWidth
// 						value={newUser.password || ''}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, password: e.target.value })
// 						}
// 					/>
// 					{/* <TextField
// 						margin='dense'
// 						label='Mobile Number'
// 						fullWidth
// 						value={newUser.mobile || ''}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, mobile: e.target.value })
// 						}
// 					/> */}
// 					<TextField
// 						margin='dense'
// 						label='Username'
// 						fullWidth
// 						value={newUser.username || ''}
// 						onChange={(e) =>
// 							setNewUser({ ...newUser, username: e.target.value })
// 						}
// 					/>
// 				</DialogContent>
// 				<DialogActions>
// 					<Button onClick={() => setShowUserForm(false)}>Cancel</Button>
// 					<Button 
// 						onClick={() => {
// 							handleCreateUser();
// 							setShowUserForm(false);
// 						}}>
// 						Add Customer
// 					</Button>
// 				</DialogActions>
// 			</Dialog>
// 		</div>
// 	);
// };

// export default UsersSection;





import React, { useContext, useState, useMemo } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "./utils/axiosConfig";
import { useNotification } from "../NotificationContext";
import {
	Button,
	Dialog,     
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Select,
	MenuItem,
	TextField,
} from "@mui/material";

const UsersSection = () => {
	const {
		users,
		services,
		loading,
		error,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
		assigningService,
		handleAssignService, // We'll assume this function exists in context
		updateUsers,
		newUser,
		setNewUser,
		showUserForm,
		setShowUserForm,
		handleCreateUser,
	} = useContext(AdminDashboardContext);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterOption, setFilterOption] = useState("newest");
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const { showNotification } = useNotification();

	// State for row editing
	const [editingRow, setEditingRow] = useState(null);
	const [editedData, setEditedData] = useState({});
	const [originalData, setOriginalData] = useState({});
	const [openDialog, setOpenDialog] = useState(false);

	// State for service assignment
	const [assigningUserId, setAssigningUserId] = useState(null);
	const [selectedServiceId, setSelectedServiceId] = useState("");

	// Start editing row
	const handleStartEdit = (user) => {
		setEditingRow(user._id);
		setEditedData({
			name: user.name,
			email: user.email,
			username: user.username,
			mobile: user.mobile,
			gender: user.gender || "",
			pan: user.pan || "",
			gst: user.gst || "",
			address: user.address || "",
			city: user.city || "",
			state: user.state || "",
			country: user.country || "",
			postalCode: user.postalCode || "",
			natureEmployment: user.natureEmployment || "",
			annualIncome: user.annualIncome || "",
			education: user.education || "",
			university: user.university || "",
			certifications: user.certifications || "",
			institute: user.institute || "",
			reasonForInactive: user.reasonForInactive || "",
			activeTill: user.activeTill ? new Date(user.activeTill).toISOString().split('T')[0] : "",
		});
		setOriginalData({
			name: user.name,
			email: user.email,
			username: user.username,
			mobile: user.mobile,
			gender: user.gender || "",
			pan: user.pan || "",
			gst: user.gst || "",
			address: user.address || "",
			city: user.city || "",
			state: user.state || "",
			country: user.country || "",
			postalCode: user.postalCode || "",
			natureEmployment: user.natureEmployment || "",
			annualIncome: user.annualIncome || "",
			education: user.education || "",
			university: user.university || "",
			certifications: user.certifications || "",
			institute: user.institute || "",
			reasonForInactive: user.reasonForInactive || "",
			activeTill: user.activeTill ? new Date(user.activeTill).toISOString().split('T')[0] : "",
		});
	};

	// Handle field change
	const handleFieldChange = (field, value) => {
		setEditedData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Get changed fields
	const getChangedFields = () => {
		const changes = {};
		Object.keys(editedData).forEach((key) => {
			if (editedData[key] !== originalData[key]) {
				changes[key] = editedData[key];
			}
		});
		return changes;
	};

	// Handle save
	const handleSave = async () => {
		const changes = getChangedFields();
		if (Object.keys(changes).length === 0) {
			setEditingRow(null);
			return;
		}
		setOpenDialog(true);
	};

	// Handle confirm save
	const handleConfirmSave = async () => {
		const changes = getChangedFields();
		try {
			const response = await axios.patch(
				`https://195-35-45-82.sslip.io:8000/api/admin/users/${editingRow}`,
				changes
			);

			if (response.status === 200) {
				const updatedUsers = users.map((user) =>
					user._id === editingRow ? { ...user, ...changes } : user
				);
				updateUsers(updatedUsers);
				showNotification("Updated successfully", "success");
			}
		} catch (error) {
			showNotification("Error updating user", "error");
		}
		setEditingRow(null);
		setOpenDialog(false);
	};

	// Handle cancel
	const handleCancel = () => {
		setEditingRow(null);
		setEditedData({});
		setOriginalData({});
	};

	// Handle service assignment
	const startAssigningService = (userId) => {
		setAssigningUserId(userId);
		setSelectedServiceId(""); // Reset selected service
	};

	const confirmAssignService = () => {
		if (!selectedServiceId) {
			showNotification("Please select a service", "error");
			return;
		}
		handleAssignService(assigningUserId, selectedServiceId);
		setAssigningUserId(null);
		setSelectedServiceId("");
	};

	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);
		return date;
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	const filteredCustomers = useMemo(() => {
		return users
			.filter((user) => user.role === "customer")
			.filter((user) => {
				const lowerSearchTerm = searchTerm.toLowerCase();
				return (
					user.name.toLowerCase().includes(lowerSearchTerm) ||
					user._id.toLowerCase().includes(lowerSearchTerm)
				);
			})
			.filter((user) => {
				const userDate = new Date(user.createdAt);
				const fromDate = dateFilter.fromDate
					? normalizeDate(dateFilter.fromDate)
					: null;
				const toDate = dateFilter.toDate
					? normalizeDate(dateFilter.toDate)
					: null;

				return (
					(fromDate === null || userDate >= fromDate) &&
					(toDate === null || userDate <= toDate)
				);
			})
			.sort((a, b) => {
				if (filterOption === "newest") {
					return new Date(b.createdAt) - new Date(a.createdAt);
				} else if (filterOption === "alphabetical") {
					return a.name.localeCompare(b.name);
				}
				return 0;
			});
	}, [users, searchTerm, dateFilter, filterOption]);

	const handleDownloadCSV = () => {
		const csvData = filteredCustomers.map((user) => ({
			CustomerCode: user._id,
			FullName: user.name,
			EmailID: user.email,
			PhoneNumber: user.mobile,
			DateOfBirth: formatDate(user.dob),
			Gender: user.gender || "",
			PAN: user.pan || "-",
			GSTIN: user.gst || "-",
			FullAddress: user.address || "-",
			City: user.city || "-",
			State: user.state || "-",
			Country: user.country || "-",
			PostalCode: user.postalCode || "-",
			NatureOfEmployment: user.natureEmployment || "-",
			AnnualIncome: user.annualIncome || "-",
			EducationQualification: user.education || "-",
			University: user.university || "-",
			MonthYearOfPassing: formatDate(user.passingMonthYear),
			Certifications: user.certifications || "-",
			Institute: user.institute || "-",
			CompletionDate: formatDate(user.completionDate),
			BankAccountNumber: user.bankDetails?.accountNumber || "-",
			IFSCCode: user.bankDetails?.ifscCode || "-",
			ReferralCode: user.referralCode,
			ReferredUsers: user.referredUsers.length,
			ReferredBy: user.referredBy ? 
				(typeof user.referredBy === 'object' ? 
					user.referredBy.name : 
					user.referrerName || user.referredBy
				) : "-",
			Services: user.services?.length || 0,
			TotalPayments:
				user.paymentHistory?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
			IsActive: user.isActive ? "Yes" : "No",
			CreatedAt: formatDate(user.createdAt),
			LastUpdated: formatDate(user.updatedAt),
			CurrentStatus: user.isActive ? "Active" : "Inactive",
			ActiveTill: user.activeTill ? formatDate(user.activeTill) : "-",
			ReasonForInactive: user.reasonForInactive || "-",
		}));

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "customers_detailed.csv");
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF("landscape", "pt", "a3");
		const tableColumn = [
			"Customer Code",
			"Full Name",
			"Email ID",
			"Phone Number",
			"Date of Birth",
			"Gender",
			"PAN",
			"GSTIN",
			"Full Address",
			"City",
			"State",
			"Country",
			"Postal Code",
			"Nature of Employment",
			"Annual Income",
			"Education Qualification",
			"University",
			"Month & Year of Passing",
			"Certifications",
			"Institute",
			"Completion Date",
			"Bank Account Number",
			"IFSC Code",
			"Referral Code",
			"Referred Users",
			"Referred By",
			"Services",
			"Total Payments",
			"IsActive",
			"Created At",
			"Last Updated",
			"Current Status",
			"Active Till",
			"Reason For Inactive",
		];
		const tableRows = filteredCustomers.map((user) => [
			user._id,
			user.name,
			user.email,
			user.mobile,
			formatDate(user.dob),
			user.gender || "-",
			user.pan || "-",
			user.gst || "-",
			user.address || "-",
			user.city || "-",
			user.state || "-",
			user.country || "-",
			user.postalCode || "-",
			user.natureEmployment || "-",
			user.annualIncome || "-",
			user.education || "-",
			user.university || "-",
			formatDate(user.passingMonthYear),
			user.certifications || "-",
			user.institute || "-",
			formatDate(user.completionDate),
			user.bankDetails?.accountNumber || "-",
			user.bankDetails?.ifscCode || "-",
			user.referralCode,
			user.referredUsers.length,
			user.referredBy ? 
				(typeof user.referredBy === 'object' ? 
					user.referredBy.name : 
					user.referrerName || user.referredBy
				) : "-",
			user.services?.length || 0,
			user.paymentHistory?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
			user.isActive ? "Yes" : "No",
			formatDate(user.createdAt),
			formatDate(user.updatedAt),
			user.isActive ? "Active" : "Inactive",
			user.activeTill ? formatDate(user.activeTill) : "-",
			user.reasonForInactive || "-",
		]);

		doc.text("Detailed Customer Data", 40, 40);
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 50,
			styles: { fontSize: 8, cellPadding: 2 },
			columnStyles: {
				0: { cellWidth: 40 }, // Customer Code
				1: { cellWidth: 40 }, // Name
				2: { cellWidth: 60 }, // Email
				3: { cellWidth: 35 }, // Mobile
			},
			margin: { top: 50 },
		});

		doc.save("customers_detailed.pdf");
	};

	if (loading) return <div>Loading Users...</div>;
	if (error) return <div>{error}</div>;

	const renderCell = (user, field, value) => {
		if (editingRow === user._id) {
			if (field === "activeTill") {
				return (
					<input
						type='date'
						value={editedData[field] || ""}
						onChange={(e) => handleFieldChange(field, e.target.value)}
						style={{
							border: "1px solid var(--accent)",
							padding: "12px",
							borderRadius: "15px",
							fontSize: "16px",
						}}
					/>
				);
			}
			return (
				<input
					type='text'
					value={editedData[field] || ""}
					onChange={(e) => handleFieldChange(field, e.target.value)}
					style={{
						border: "1px solid var(--accent)",
						padding: "12px",
						borderRadius: "15px",
						fontSize: "16px",
					}}
				/>
			);
		}
		return <span>{value}</span>;
	};

	const clearAllFilters = () => {
		setSearchTerm("");
		setFilterOption("newest");
		setDateFilter({ fromDate: "", toDate: "" });
	};

	return (
		<div className='tax-dashboard-customers'>
			<div className='filter-div'>
				<input
					type='text'
					placeholder='Search by Name or ID'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div>
					<input
						type='date'
						placeholder='From Date'
						value={dateFilter.fromDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, fromDate: e.target.value })
						}
					/>
					<input
						type='date'
						placeholder='To Date'
						value={dateFilter.toDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, toDate: e.target.value })
						}
					/>
				</div>
				<div className='table-bottom-btns'>
					<button
						className='tax-service-btn'
						onClick={clearAllFilters}
						style={{ backgroundColor: "var(--accent)" }}>
						<i className='fa-solid fa-rotate-left'></i>
					</button>
					<button 
						className='tax-service-btn' 
						onClick={() => setShowUserForm(true)}>
						Add Customer
					</button>
					<button className='tax-service-btn' onClick={handleDownloadCSV}>
						<i className='fa-solid fa-file-csv fa-2xl'></i>
					</button>
					<button className='tax-service-btn' onClick={handleDownloadPDF}>
						<i className='fa-solid fa-file-pdf fa-2xl'></i>
					</button>
				</div>
			</div>
			<div className='tax-services-wrap-table'>
				<table>
					<thead>
						<tr>
							<th>Customer Code</th>
							<th>Full Name</th>
							<th>Email ID</th>
							<th>Phone Number</th>
							<th>Date of Birth</th>
							<th>Gender</th>
							<th>PAN</th>
							<th>GSTIN</th>
							<th>Full Address</th>
							<th>City</th>
							<th>State</th>
							<th>Country</th>
							<th>Postal Code</th>
							<th>Nature of Employment</th>
							<th>Annual Income</th>
							<th>Education Qualification</th>
							<th>University</th>
							<th>Month & Year of Passing</th>
							<th>Certifications</th>
							<th>Institute</th>
							<th>Completion Date</th>
							<th>Bank Account Number</th>
							<th>IFSC Code</th>
							<th>Referral Code</th>
							<th>Referred Users</th>
							<th>Referred By</th>
							<th>Services</th>
							<th>Assign Service</th> {/* New Column */}
							<th>Total Payments</th>
							<th>Created At</th>
							<th>Last Updated</th>
							<th>Current Status</th>
							<th>Active Till</th>
							<th>Reason For Inactive</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredCustomers.map((user) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{renderCell(user, "name", user.name)}</td>
								<td>{renderCell(user, "email", user.email)}</td>
								<td>{renderCell(user, "mobile", user.mobile)}</td>
								<td>{formatDate(user.dob)}</td>
								<td>{renderCell(user, "gender", user.gender || "-")}</td>
								<td>{renderCell(user, "pan", user.pan || "-")}</td>
								<td>{renderCell(user, "gst", user.gst || "-")}</td>
								<td>{renderCell(user, "address", user.address || "-")}</td>
								<td>{renderCell(user, "city", user.city || "-")}</td>
								<td>{renderCell(user, "state", user.state || "-")}</td>
								<td>{renderCell(user, "country", user.country || "-")}</td>
								<td>
									{renderCell(user, "postalCode", user.postalCode || "-")}
								</td>
								<td>
									{renderCell(
										user,
										"natureEmployment",
										user.natureEmployment || "-"
									)}
								</td>
								<td>
									{renderCell(user, "annualIncome", user.annualIncome || "-")}
								</td>
								<td>{renderCell(user, "education", user.education || "-")}</td>
								<td>
									{renderCell(user, "university", user.university || "-")}
								</td>
								<td>{formatDate(user.passingMonthYear) || "-"}</td>
								<td>
									{renderCell(
										user,
										"certifications",
										user.certifications || "-"
									)}
								</td>
								<td>{renderCell(user, "institute", user.institute || "-")}</td>
								<td>{formatDate(user.completionDate)}</td>
								<td>{user.bankDetails?.accountNumber || "-"}</td>
								<td>{user.bankDetails?.ifscCode || "-"}</td>
								<td>{user.referralCode}</td>
								<td>{user.referredUsers.length}</td>
								<td>
									{user.referredBy ? 
										(typeof user.referredBy === 'object' ? 
											user.referredBy.name : 
											user.referrerName || user.referredBy
										) : "-"
									}
								</td>
								<td>
									{user.services && user.services.length > 0 ? (
										<select
											style={{
												border: "1px solid var(--accent)",
												borderRadius: "15px",
												padding: "15px",
												fontSize: "16px",
											}}>
											{user.services.map((service) => (
												<option
													key={service.serviceId}
													className='service-info'>
													{service.name} - {service.status || "In Process"}
												</option>
											))}
										</select>
									) : (
										"No services"
									)}
								</td>
								<td>
									{assigningUserId === user._id ? (
										<div className='service-assignment'>
											<Select
												value={selectedServiceId}
												onChange={(e) => setSelectedServiceId(e.target.value)}
												displayEmpty
												style={{
													border: "1px solid var(--accent)",
													borderRadius: "15px",
													padding: "5px",
													fontSize: "16px",
												}}>
												<MenuItem value='' disabled>
													Select a service
												</MenuItem>
												{services.map((service) => (
													<MenuItem key={service._id} value={service._id}>
														{service.name}
													</MenuItem>
												))}
											</Select>
											<button
												className='tax-service-btn'
												onClick={confirmAssignService}
												disabled={assigningService}>
												{assigningService ? "Assigning..." : "Confirm"}
											</button>
											<button
												className='tax-service-btn'
												onClick={() => setAssigningUserId(null)}>
												Cancel
											</button>
										</div>
									) : (
										<button
											className='tax-service-btn'
											onClick={() => startAssigningService(user._id)}>
											Assign Service
										</button>
									)}
								</td>
								<td>
									₹
									{user.paymentHistory?.reduce(
										(acc, curr) => acc + curr.amount,
										0
									) || 0}
								</td>
								<td>{formatDate(user.createdAt)}</td>
								<td>{formatDate(user.updatedAt)}</td>
								<td>{user.isActive ? "Active" : "Inactive"}</td>
								<td>{renderCell(user, "activeTill", user.activeTill ? formatDate(user.activeTill) : "-")}</td>
								<td>
									{renderCell(
										user,
										"reasonForInactive",
										user.reasonForInactive || "-"
									)}
								</td>
								<td className='tax-btn-cont'>
									{editingRow === user._id ? (
										<>
											<button className='tax-service-btn' onClick={handleSave}>
												Save
											</button>
											<button
												className='tax-service-btn'
												onClick={handleCancel}>
												Cancel
											</button>
										</>
									) : (
										<button
											className='tax-service-btn'
											onClick={() => handleStartEdit(user)}>
											<i className='fa-solid fa-pencil'></i>
										</button>
									)}
									<button
										onClick={() =>
											user.isActive
												? handleDeactivateUser(user._id)
												: handleActivateUser(user._id)
										}
										className={
											user.isActive ? "userDeactivate" : "userActivate"
										}>
										{user.isActive ? "Deactivate" : "Activate"}
									</button>
									<button
										className='serviceDelete'
										onClick={() => handleDeleteUser(user._id)}
										disabled={user.isActive}>
										<i className='fa-solid fa-trash'></i>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>Confirm Changes</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You have modified the following fields:
						<ul>
							{Object.entries(getChangedFields()).map(([field, value]) => (
								<li key={field}>
									{field}: {originalData[field]} → {value}
								</li>
							))}
						</ul>
						Do you want to save these changes?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
					<Button onClick={handleConfirmSave} autoFocus>
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add Customer Dialog */}
			<Dialog
				open={showUserForm}
				onClose={() => setShowUserForm(false)}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Add Customer</DialogTitle>
				<DialogContent>
					<TextField
						margin='dense'
						label='Full Name'
						fullWidth
						value={newUser.name || ''}
						onChange={(e) =>
							setNewUser({ ...newUser, name: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Email'
						type='email'
						fullWidth
						value={newUser.email || ''}
						onChange={(e) =>
							setNewUser({ ...newUser, email: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Password'
						type='password'
						fullWidth
						value={newUser.password || ''}
						onChange={(e) =>
							setNewUser({ ...newUser, password: e.target.value })
						}
					/>
					{/* <TextField
						margin='dense'
						label='Mobile Number'
						fullWidth
						value={newUser.mobile || ''}
						onChange={(e) =>
							setNewUser({ ...newUser, mobile: e.target.value })
						}
					/> */}
					<TextField
						margin='dense'
						label='Username'
						fullWidth
						value={newUser.username || ''}
						onChange={(e) =>
							setNewUser({ ...newUser, username: e.target.value })
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowUserForm(false)}>Cancel</Button>
					<Button 
						onClick={() => {
							handleCreateUser();
							setShowUserForm(false);
						}}>
						Add Customer
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default UsersSection;
