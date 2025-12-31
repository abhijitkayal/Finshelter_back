import React, { useState, useContext, useRef, useMemo } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
	Checkbox,
	ListItemText,
} from "@mui/material";

const EmployeesSection = () => {
	// ... keep existing state variables ...
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
	const [promotingEmployee, setPromotingEmployee] = useState(null);
	const [showPromoteModal, setShowPromoteModal] = useState(false);
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [searchTerm, setSearchTerm] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [filterOption, setFilterOption] = useState("newest");
	// Add new state for row editing
	const [editingRow, setEditingRow] = useState(null);
	const [editedData, setEditedData] = useState({});
	const [originalData, setOriginalData] = useState({});
	const [openDialog, setOpenDialog] = useState(false);

	const [showAssignOrderForm, setShowAssignOrderForm] = useState(false);
	// const [assignOrder, setAssignOrder] = useState({
	// 	orderId: "",
	// 	employeeId: "",
	// });

	const [selectedServices, setSelectedServices] = useState([]);
	const [selectedL1Employees, setSelectedL1Employees] = useState([]);

	const {
		users,
		customers,
		setUsers,
		services,
		employees,
		newEmployee,
		setNewEmployee,
		assignCustomer,
		assignService,
		setAssignService,
		setAssignCustomer,
		handleCreateEmployee,
		handleAssignCustomer,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,

		updateUsers,
		orders,
		setOrders,
		assignOrder,
		setAssignOrder,
		handleAssignOrderToEmployee,
	} = useContext(AdminDashboardContext);

	// Add a state for L+1 validation
	const [l1ValidationError, setL1ValidationError] = useState("");

	// Add a function to validate L+1 employee code
	const validateL1EmpCode = (code) => {
		if (!code) return true; // Optional field
		const employee = employees.find(emp => emp._id === code);
		if (!employee) {
			setL1ValidationError("Employee not found with this code");
			return false;
		}
		setL1ValidationError("");
		return true;
	};

	// Handler to close employee form and reset state
	const handleCloseEmployeeForm = () => {
		setShowEmployeeForm(false);
		setSelectedL1Employees([]);
		setL1ValidationError("");
	};

	// Start editing row
	const handleStartEdit = (employee) => {
		setEditingRow(employee._id);
		const initialData = {
			name: employee.name,
			email: employee.email,
			username: employee.username,
			phoneNumber: employee.phoneNumber || "",
			gender: employee.gender || "",
			L1EmpCode: employee.L1EmpCode || "",
			L1Name: employee.L1Name || "",
			L2EmpCode: employee.L2EmpCode || "",
			L2Name: employee.L2Name || "",
			employeeStatus: employee.employeeStatus || "",
			pan: employee.pan || "",
			tan: employee.tan || "",
			gst: employee.gst || "",
			address: employee.fulladdress || employee.address || "",
			city: employee.city || "",
			state: employee.state || "",
			country: employee.country || "",
			postalCode: employee.postalCode || "",
			departmentName: employee.departmentName || "",
			designation: employee.designation || "",
			education: employee.educationQualification || employee.education || "",
			university: employee.university || "",
			certifications: employee.certifications || "",
		};
		setEditedData(initialData);
		setOriginalData(initialData);
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
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
				const updatedUsers = users.map((user) => {
					if (user._id === editingRow) {
						return { ...user, ...changes };
					}
					return user;
				});
				updateUsers(updatedUsers);
				alert("Updated successfully");
			}
		} catch (error) {
			console.error("Error updating employee:", error);
			alert("Error updating employee");
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

	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);
		return date;
	};

	const filteredEmployees = useMemo(() => {
		return employees
			.filter((employee) => {
				// Combined search for ID, name, and email
				const lowerSearchTerm = searchTerm.toLowerCase();
				return (
					employee._id.toLowerCase().includes(lowerSearchTerm) ||
					employee.name.toLowerCase().includes(lowerSearchTerm) ||
					employee.email.toLowerCase().includes(lowerSearchTerm) ||
					(employee.username &&
						employee.username.toLowerCase().includes(lowerSearchTerm))
				);
			})
			.filter((employee) => {
				if (!dateFilter.fromDate) return true;
				
				const joiningDate = new Date(employee.createdAt);
				const filterDate = normalizeDate(dateFilter.fromDate);
				
				// Match employees who joined on this specific date
				return joiningDate.toDateString() === filterDate.toDateString();
			})
			.sort((a, b) => {
				if (filterOption === "newest") {
					return new Date(b.createdAt) - new Date(a.createdAt);
				} else if (filterOption === "alphabetical") {
					return a.name.localeCompare(b.name);
				}
				return 0;
			});
	}, [employees, searchTerm, dateFilter, filterOption]);

	//promote
	const handlePromoteToManager = async () => {
		const token = localStorage.getItem("adminToken");
		if (!promotingEmployee) return;

		setLoading(true);
		try {
			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/admin/promote-to-manager",
				{
					employeeId: promotingEmployee._id,
				},
				{ headers: { Authorization: ` Bearer ${token}` } }
			);

			if (response.status === 200) {
				// Update the local state
				const updatedUsers = users.map((user) => {
					if (user._id === promotingEmployee._id) {
						return { ...user, role: "manager" };
					}
					return user;
				});
				updateUsers(updatedUsers);
				alert(
					response.data.message || "Employee promoted to manager successfully"
				);
			}
		} catch (error) {
			console.error("Error promoting employee:", error);
			alert(error.response?.data?.message || "Failed to promote employee");
		} finally {
			setLoading(false);
			setShowPromoteModal(false);
			setPromotingEmployee(null);
		}
	};

	const handleDownloadCSV = () => {
		const csvData = employees.map((employee) => ({
			"Employee Code": employee._id,
			"Full Name": employee.name,
			"Email ID": employee.email,
			Username: employee.username,
			"Phone Number": employee.phoneNumber || "-",
			"Date of Birth": formatDate(employee.dob),
			Gender: employee.gender || "-",
			"L1 Employee Code": employee.L1EmpCode || "-",
			"L1 Name": employee.L1Name || "-",
			"L2 Employee Code": employee.L2EmpCode || "-",
			"L2 Name": employee.L2Name || "-",
			// "Department Code": employee.departmentCode || "-",
			"Department Name": employee.departmentName || "-",
			"Position Code": employee.positionCode || "-",
			"Position Description": employee.positionDescription || "-",
			Designation: employee.designation || "-",
			"Employee Status": employee.employeeStatus || "-",
			"Date of Joining": formatDate(employee.dateOfJoining),
			PAN: employee.pan || "-",
			TAN: employee.tan || "-",
			GSTIN: employee.gst || "-",
			"Full Address": employee.fulladdress || employee.address || "-",
			City: employee.city || "-",
			State: employee.state || "-",
			Country: employee.country || "-",
			"Postal Code": employee.postalCode || "-",
			"Education Qualification":
				employee.educationQualification || employee.education || "-",
			University: employee.university || "-",
			"Passing Month & Year": formatDate(employee.passingMonthYear),
			"Total Experience": employee.totalExperience || "-",
			"Previous Organization": employee.previousOrganization || "-",
			"Previous Org From Date": formatDate(employee.previousOrgFromDate),
			"Previous Org To Date": formatDate(employee.previousOrgToDate),
			"Reason For Leaving": employee.reasonForLeaving || "-",
			"Bank Account Number": employee.bankDetails?.accountNumber || "-",
			"Account Holder Name": employee.bankDetails?.accountHolderName || "-",
			"Bank Name": employee.bankDetails?.bankName || "-",
			"IFSC Code": employee.bankDetails?.ifscCode || "-",
			"Account Type": employee.bankDetails?.accountType || "-",
			"Services Handled":
				employee.servicesHandled?.map((service) => service.name).join(", ") ||
				"No services handled",
			"Assigned Service":
				services.find((service) => service._id === employee.serviceId)?.name ||
				"No service assigned",
			"Assigned Customers": employee.assignedCustomers?.length || 0,
			"Download Access": employee.downloadAccess ? "Yes" : "No",
			"Created At": formatDate(employee.createdAt),
			"Last Updated": formatDate(employee.updatedAt),
		}));

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "employees_detailed.csv");
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF("landscape", "pt", "a3"); // Use landscape for more columns

		// Define table columns matching CSV fields
		const tableColumn = [
			"Employee Code",
			"Full Name",
			"Email ID",
			"Username",
			"Phone Number",
			"Date of Birth",
			"Gender",
			"L1 Emp Code",
			"L1 Name",
			"L2 Emp Code",
			"L2 Name",
			"Dept Name",
			"Position Code",
			"Position Desc",
			"Designation",
			"Emp Status",
			"Joining Date",
			"PAN",
			"TAN",
			"GSTIN",
			"Address",
			"City",
			"State",
			"Country",
			"Postal Code",
			"Education",
			"University",
			"Passing Date",
			"Experience",
			"Prev Org",
			"Prev From",
			"Prev To",
			"Reason",
			"Bank Acc",
			"Acc Holder",
			"Bank Name",
			"IFSC",
			"Acc Type",
			"Services",
			"Customers",
			"DownloadAccess",
			"Created At",
			"Last Updated",
		];

		// Prepare table rows with matching CSV data
		const tableRows = employees.map((employee) => [
			employee._id,
			employee.name,
			employee.email,
			employee.username || "-",
			employee.phoneNumber || "-",
			formatDate(employee.dob),
			employee.gender || "-",
			employee.L1EmpCode || "-",
			employee.L1Name || "-",
			employee.L2EmpCode || "-",
			employee.L2Name || "-",
			employee.departmentName || "-",
			employee.positionCode || "-",
			employee.positionDescription || "-",
			employee.designation || "-",
			employee.employeeStatus || "-",
			formatDate(employee.dateOfJoining),
			employee.pan || "-",
			employee.tan || "-",
			employee.gst || "-",
			employee.fulladdress || employee.address || "-",
			employee.city || "-",
			employee.state || "-",
			employee.country || "-",
			employee.postalCode || "-",
			employee.educationQualification || employee.education || "-",
			employee.university || "-",
			formatDate(employee.passingMonthYear),
			employee.totalExperience || "-",
			employee.previousOrganization || "-",
			formatDate(employee.previousOrgFromDate),
			formatDate(employee.previousOrgToDate),
			employee.reasonForLeaving || "-",
			employee.bankDetails?.accountNumber || "-",
			employee.bankDetails?.accountHolderName || "-",
			employee.bankDetails?.bankName || "-",
			employee.bankDetails?.ifscCode || "-",
			employee.bankDetails?.accountType || "-",
			employee.servicesHandled?.length || "No services handled",
			employee.assignedCustomers?.length || 0,
			employee.downloadAccess ? "Yes" : "No",
			formatDate(employee.createdAt),
			formatDate(employee.updatedAt),
		]);

		// Add title
		doc.text("Employee Detailed Report", 14, 15);

		// Configure and generate the table
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
			styles: {
				fontSize: 6, // Reduce font size to fit more columns
				cellPadding: 1,
				overflow: "linebreak",
			},
			columnStyles: {
				0: { cellWidth: 15 }, // Employee Code
				1: { cellWidth: 15 }, // Full Name
				2: { cellWidth: 20 }, // Email ID
				// Add more specific widths if needed
			},
			margin: { top: 20, left: 5, right: 5 },
			theme: "grid",
			headStyles: {
				fillColor: [41, 128, 185],
				textColor: 255,
				fontSize: 7,
			},
		});

		doc.save("employees_detailed.pdf");
	};

	const handleToggleDownloadAccess = async (employeeId, allowDownload) => {
		setLoading(true);
		try {
			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/admin/update-download-access",
				{
					employeeId,
					allowDownload,
				}
			);
			alert(response.data.message);
			setUsers((prevUsers) =>
				prevUsers.map((employee) =>
					employee._id === employeeId
						? { ...employee, downloadAccess: allowDownload }
						: employee
				)
			);
		} catch (error) {
			console.error("Error updating download access:", error);
			alert("Failed to update download access.");
		}
	};

	const renderCell = (employee, field, value) => {
		if (editingRow === employee._id) {
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
		return (
			<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
				<span>{value}</span>
				<button
					onClick={() => handleStartEdit(employee)}
					style={{ border: "none", cursor: "pointer" }}>
					{/* <i className='fa-solid fa-pencil'></i> */}
				</button>
			</div>
		);
	};
	const navigate = useNavigate();
	const clearAllFilters = () => {
		// setSearchTerm("");
		// setFilterOption("newest");
		// setDateFilter({ fromDate: "", toDate: "" });
		// setFilterCriteria("name");
		window.location.reload();
	};

	// Add a function to handle service selection in multi-select
	const handleServiceSelection = (e) => {
		const selectedOptions = Array.from(
			e.target.selectedOptions,
			(option) => option.value
		);
		setSelectedServices(selectedOptions);
		// Update newEmployee state with selected services
		setNewEmployee({ ...newEmployee, services: selectedOptions });
	};

	// Add a helper function to count orders
	const countEmployeeOrders = (employee) => {
		if (!employee.assignedCustomers || employee.assignedCustomers.length === 0) {
			return { total: 0, completed: 0 };
		}
		
		let totalOrders = 0;
		let completedOrders = 0;
		
		employee.assignedCustomers.forEach(customer => {
			if (customer.services && customer.services.length > 0) {
				customer.services.forEach(service => {
					totalOrders++;
					if (service.status === 'completed') {
						completedOrders++;
					}
				});
			}
		});
		
		return { total: totalOrders, completed: completedOrders };
	};

	return (
		<div className='tax-dashboard-employee'>
			{/* ... keep existing filter and buttons section ... */}
			<div className='filter-div'>
				<input
					type='text'
					placeholder='Search by Employee Name, Email, Mobile, or ID'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div>
					<label style={{ marginRight: '8px', fontWeight: '500' }}>Filter by Joining Date:</label>
					<input
						type='date'
						placeholder='Joining Date'
						value={dateFilter.fromDate}
						onChange={(e) =>
							setDateFilter({ fromDate: e.target.value, toDate: '' })
						}
						style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
					/>
				</div>

				<button
					onClick={clearAllFilters}
					style={{
						padding: '10px 20px',
						backgroundColor: '#dc3545',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
						fontWeight: 'bold',
						fontSize: '14px',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						transition: 'background-color 0.3s'
					}}
					onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
					onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
					title='Clear all filters including search, date range, and sorting'>
					<i className='fa-solid fa-filter-circle-xmark'></i>
					Clear All Filters
				</button>

				<div className='table-bottom-btns'>
					<button
						className='tax-service-btn'
						onClick={() => setShowEmployeeForm(true)}>
						Add Employee
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
					{/* ... keep existing table header ... */}
					<thead>
						<tr>
							<th>Employee Code</th>
							<th>Date of Joining</th>
							{/* <th>Date of Relieving</th> */}
							<th>Total Orders Assigned</th>
							<th>Orders Completed</th>
							<th>Full Name</th>
							<th>Email ID</th>
							<th>Username</th>
							<th>Phone Number</th>
							<th>Date of Birth</th>
							<th>Gender</th>
							<th>L1 Employee Code</th>
							<th>L1 Name</th>
							<th>L2 Employee Code</th>
							<th>L-1 Code</th>
							<th>L2 Name</th>
							<th>Employee Status</th>
							<th>Reason For Leaving</th>

							<th>PAN</th>
							<th>TAN</th>
							<th>GSTIN</th>
							<th>Full Address</th>
							<th>City</th>
							<th>State</th>
							<th>Country</th>
							<th>Postal Code</th>
							{/* <th>Department Code</th> */}
							<th>Department Name</th>
							{/* <th>Position Code</th>
							<th>Position Description</th> */}
							<th>Designation</th>

							<th>Previous Organization</th>
							<th>Previous Org From Date</th>
							<th>Previous Org To Date</th>

							<th>Total Experience</th>
							<th>Education Qualification</th>
							<th>University</th>
							<th>Passing Month & Year</th>
							<th>Certifications</th>
							<th>Institute</th>

							<th>Bank Account Number</th>
							<th>Account Holder Name</th>
							<th>Bank Name</th>
							<th>IFSC Code</th>
							<th>Account Type</th>
							<th>Assigned Service</th>
							<th>Assigned Orders</th>
							<th>Download Access</th>
							<th>Created At</th>
							<th>Last Updated</th>

							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredEmployees.map((employee) => (
							<tr key={employee._id}>
								{/* ... keep existing static cells ... */}
								<td>{employee._id}</td>
								{/* <td>{formatDate(employee.dateOfJoining)}</td> */}
								<td>{formatDate(employee.createdAt)}</td>
								<td>{countEmployeeOrders(employee).total}</td>
								<td>{countEmployeeOrders(employee).completed}</td>
								<td>{renderCell(employee, "name", employee.name)}</td>
								<td>{renderCell(employee, "email", employee.email)}</td>
								<td>{renderCell(employee, "username", employee.username)}</td>
								<td>
									{renderCell(
										employee,
										"phoneNumber",
										employee.phoneNumber || "-"
									)}
								</td>
								<td>{formatDate(employee.dob)}</td>
								<td>
									{renderCell(employee, "gender", employee.gender || "-")}
								</td>
								<td>
									{renderCell(employee, "L1EmpCode", employee.L1EmpCode || "-")}
								</td>
								<td>
									{renderCell(employee, "L1Name", employee.L1Name || "-")}
								</td>
								<td>
									{renderCell(employee, "L2EmpCode", employee.L2EmpCode || "-")}
								</td>
								<td>
									{renderCell(
										employee,
										"Lminus1code",
										employee.Lminus1code || "-"
									)}
								</td>
								<td>
									{renderCell(employee, "L2Name", employee.L2Name || "-")}
								</td>
								<td>
									{renderCell(
										employee,
										"employeeStatus",
										employee.employeeStatus || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"reasonForLeaving",
										employee.reasonForLeaving || "-"
									)}
								</td>
								<td>{renderCell(employee, "pan", employee.pan || "-")}</td>
								<td>{renderCell(employee, "tan", employee.tan || "-")}</td>
								<td>{renderCell(employee, "gst", employee.gst || "-")}</td>
								<td>
									{renderCell(
										employee,
										"address",
										employee.fulladdress || employee.address || "-"
									)}
								</td>
								<td>{renderCell(employee, "city", employee.city || "-")}</td>
								<td>{renderCell(employee, "state", employee.state || "-")}</td>
								<td>
									{renderCell(employee, "country", employee.country || "-")}
								</td>
								<td>
									{renderCell(
										employee,
										"postalCode",
										employee.postalCode || "-"
									)}
								</td>

								<td>
									{renderCell(
										employee,
										"departmentName",
										employee.departmentName || "-"
									)}
								</td>

								<td>
									{renderCell(
										employee,
										"designation",
										employee.designation || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"previousOrganization",
										employee.previousOrganization || "-"
									)}
								</td>
								<td>{formatDate(employee.previousOrgFromDate)}</td>
								<td>{formatDate(employee.previousOrgToDate)}</td>
								<td>
									{renderCell(
										employee,
										"totalExperience",
										employee.totalExperience || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"education",
										employee.educationQualification || employee.education || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"university",
										employee.university || "-"
									)}
								</td>
								<td>{formatDate(employee.passingMonthYear)}</td>
								<td>
									{renderCell(
										employee,
										"certifications",
										employee.certifications || "-"
									)}
								</td>
								<td>
									{renderCell(employee, "institute", employee.institute || "-")}
								</td>
								<td>
									{renderCell(
										employee,
										"accountNumber",
										employee.bankDetails?.accountNumber || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"accountHolderName",
										employee.bankDetails?.accountHolderName || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"bankName",
										employee.bankDetails?.bankName || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"ifscCode",
										employee.bankDetails?.ifscCode || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"accountType",
										employee.bankDetails?.accountType || "-"
									)}
								</td>

								<td>
									{employee.servicesHandled &&
									employee.servicesHandled.length > 0 ? (
										<select
											style={{
												border: "1px solid var(--accent)",
												borderRadius: "15px",
												padding: "15px",
												fontSize: "16px",
											}}>
											{employee.servicesHandled.map((serviceId) => {
												const service = services.find(
													(s) => s._id === serviceId
												);
												return (
													<option key={serviceId} value={serviceId}>
														{service ? service.name : "Unknown Service"}
													</option>
												);
											})}
										</select>
									) : (
										"No services assigned"
									)}
								</td>

								<td>
									{employee.assignedCustomers &&
									employee.assignedCustomers.length > 0 ? (
										<select
											style={{
												border: "1px solid var(--accent)",
												borderRadius: "15px",
												padding: "15px",
												fontSize: "16px",
											}}>
											{employee.assignedCustomers.map((customer) =>
												customer.services.length > 0 ? (
													customer.services.map((service) => (
														<option key={service.orderId}>
															{service.orderId}
														</option>
													))
												) : (
													<option key={customer._id}>No Orders</option>
												)
											)}
										</select>
									) : (
										"No customers assigned"
									)}
								</td>
								<td>{employee.downloadAccess ? "Yes" : "No"}</td>
								<td>{formatDate(employee.createdAt)}</td>
								<td>{formatDate(employee.updatedAt)}</td>

								<td className='tax-btn-cont'>
									{editingRow === employee._id ? (
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
											onClick={() => handleStartEdit(employee)}>
											<i class='fa-solid fa-pencil'></i>
										</button>
									)}
									{/* ... keep existing action buttons ... */}
									<button
										onClick={() =>
											employee.isActive
												? handleDeactivateUser(employee._id)
												: handleActivateUser(employee._id)
										}
										className={
											employee.isActive ? "userDeactivate" : "userActivate"
										}>
										{employee.isActive ? "Deactivate" : "Activate"}
									</button>

									<button
										className={`tax-service-btn ${
											employee.downloadAccess
												? "access-granted"
												: "access-revoked"
										}`}
										onClick={() =>
											handleToggleDownloadAccess(
												employee._id,
												!employee.downloadAccess
											)
										}>
										{employee.downloadAccess ? "Revoke Access" : "Grant Access"}
									</button>
									{/* {employee.role === "employee" && (
										<button
											className='tax-service-btn'
											onClick={() => openPromoteModal(employee)}
											disabled={!employee.isActive}>
											Promote
										</button>
									)} */}
									<button
										className='serviceDelete'
										onClick={() => handleDeleteUser(employee._id)}
										disabled={employee.isActive}>
										<i class='fa-solid fa-trash'></i>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Confirmation Dialog - remains unchanged */}
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

			{/* Add Employee Modal with MUI */}
			<Dialog
				open={showEmployeeForm}
				onClose={handleCloseEmployeeForm}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>Add Employee</DialogTitle>
				<DialogContent>
					<TextField
						margin='dense'
						label='Employee Full Name'
						fullWidth
						value={newEmployee.name}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, name: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Email ID'
						type='email'
						fullWidth
						value={newEmployee.email}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, email: e.target.value })
						}
					/>
					<FormControl fullWidth margin='dense'>
						<InputLabel shrink>Services</InputLabel>
						<Select
							multiple
							value={newEmployee.services || []} // Directly use newEmployee.services
							onChange={(e) => {
								const selected = e.target.value;
								setNewEmployee({ ...newEmployee, services: selected });
							}}
							label='Services'
							renderValue={(selected) =>
								selected
									.map(
										(serviceId) =>
											services.find((s) => s._id === serviceId)?.name ||
											serviceId
									)
									.join(", ")
							}>
							{services.map((service) => (
								<MenuItem key={service._id} value={service._id}>
									<Checkbox
										checked={
											(newEmployee.services || []).indexOf(service._id) > -1
										}
									/>
									<ListItemText primary={service.name} />
								</MenuItem>
							))}
						</Select>
						<FormHelperText>
							Hold Ctrl/Cmd to select multiple services
						</FormHelperText>
					</FormControl>
					<TextField
						margin='dense'
						label='Username'
						fullWidth
						value={newEmployee.username}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, username: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Password'
						type='password'
						fullWidth
						value={newEmployee.password}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, password: e.target.value })
						}
					/>
					<FormControl fullWidth margin='dense'>
						<InputLabel id="lminus1-employee-label">L-1 Employees (Optional)</InputLabel>
						<Select
							labelId="lminus1-employee-label"
							multiple
							value={selectedL1Employees}
							onChange={(e) => {
								const selectedValues = e.target.value;
								setSelectedL1Employees(selectedValues);
								setNewEmployee({ 
									...newEmployee, 
									Lminus1code: selectedValues.join(',')
								});
							}}
							renderValue={(selected) => {
								if (selected.length === 0) {
									return <em>Select L-1 Employees</em>;
								}
								
								return selected.map(id => {
									const emp = employees.find(e => e._id === id);
									return emp ? emp.name : id;
								}).join(', ');
							}}
						>
							{employees.map((emp) => (
								<MenuItem key={emp._id} value={emp._id}>
									<Checkbox checked={selectedL1Employees.indexOf(emp._id) > -1} />
									<ListItemText primary={`${emp.name} (${emp._id})`} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth margin='dense'>
						<InputLabel id="l1-employee-label">L+1 Employee</InputLabel>
						<Select
							labelId="l1-employee-label"
							value={newEmployee.L1EmpCode || ''}
							onChange={(e) => {
								const selectedEmp = employees.find(emp => emp._id === e.target.value);
								setNewEmployee({ 
									...newEmployee, 
									L1EmpCode: e.target.value,
									L1Name: selectedEmp ? selectedEmp.name : ''
								});
								setL1ValidationError("");
							}}
							error={!!l1ValidationError}
						>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{employees.map((emp) => (
								<MenuItem key={emp._id} value={emp._id}>
									{emp.name} ({emp._id})
								</MenuItem>
							))}
						</Select>
						{l1ValidationError && (
							<FormHelperText error>{l1ValidationError}</FormHelperText>
						)}
					</FormControl>
					
					<TextField
						margin='dense'
						label='Designation'
						fullWidth
						value={newEmployee.designation || ''}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, designation: e.target.value })
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCreateEmployee}>Create</Button>
					<Button onClick={handleCloseEmployeeForm}>Cancel</Button>
				</DialogActions>
			</Dialog>

			{/* Assign Order Modal with MUI */}
			<Dialog
				open={showAssignOrderForm}
				onClose={() => setShowAssignOrderForm(false)}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>Assign Order to Employee</DialogTitle>
				<DialogContent>
					<FormControl fullWidth margin='dense'>
						<InputLabel>Select Order</InputLabel>
						<Select
							value={assignOrder.orderId}
							label='Select Order'
							onChange={(e) =>
								setAssignOrder({
									...assignOrder,
									orderId: e.target.value,
								})
							}>
							<MenuItem value=''>Select Order</MenuItem>
							{orders.map((order) => (
								<MenuItem key={order["Order ID"]} value={order["Order ID"]}>
									{order["Order ID"]} - {order["Service Name"]} -{" "}
									{order["Customer Name"]}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth margin='dense'>
						<InputLabel>Select Employee</InputLabel>
						<Select
							value={assignOrder.employeeId}
							label='Select Employee'
							onChange={(e) =>
								setAssignOrder({
									...assignOrder,
									employeeId: e.target.value,
								})
							}>
							<MenuItem value=''>Select Employee</MenuItem>
							{employees.map((employee) => (
								<MenuItem key={employee._id} value={employee._id}>
									{employee.name} - Handles: {employee.servicesHandled.length}{" "}
									services
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAssignOrderToEmployee} disabled={loading}>
						{loading ? "Assigning..." : "Assign"}
					</Button>
					<Button onClick={() => setShowAssignOrderForm(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>

			<div className='table-bottom-btns'>
				<button
					className='tax-service-btn'
					onClick={() => setShowAssignOrderForm(true)}>
					Assign Order to Employee
				</button>
			</div>
		</div>
	);
};

export default EmployeesSection;
