import React, { useContext, useState, useEffect } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";
import DocumentRequirements from "./DocumentRequirements";
import DashboardCharts from "./DashboardCharts";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import {
	DialogContentText,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
	Checkbox,
	ListItemText,
} from "@mui/material";

const DashboardSection = () => {
	const navigate = useNavigate();
	const { showNotification } = useNotification();

	// Move all useState declarations to the top level
	const [showServiceForm, setShowServiceForm] = useState(false);
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	const [showManagerForm, setShowManagerForm] = useState(false);
	const [showUserForm, setShowUserForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showDocuments, setShowDocuments] = useState(false);
	const [showDocRequirements, setShowDocRequirements] = useState(false);
	const [uniqueCategories, setUniqueCategories] = useState([]);
	const [newCategoryInput, setNewCategoryInput] = useState("");
	const [categoryInputMode, setCategoryInputMode] = useState(false);
	// Add state variables for employee form
	const [l1ValidationError, setL1ValidationError] = useState("");
	const [selectedL1Employees, setSelectedL1Employees] = useState([]);

	const {
		servicesCount,
		usersCount,
		employeesCount,
		customersCount,
		managersCount,
		services,
		newService,
		setNewService,
		handleCreateService,
		users,
		newUser,
		setNewUser,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
		showAssignCustomerForm,
		setShowAssignCustomerForm,
		newManager,
		setNewManager,
		newEmployee,
		setNewEmployee,
		handleCreateEmployee,
		handleCreateManager,
		isAuthenticated,
		fetchDashboardData,
		error,
		setError,
		handleCreateUser,
		userGrowthData,
		employees,
	} = useContext(AdminDashboardContext);

	useEffect(() => {
		if (isAuthenticated) {
			setError(null);
			setLoading(false);
			fetchDashboardData();
		}
	}, [isAuthenticated, setError, fetchDashboardData]);

	// Extract unique categories from services
	useEffect(() => {
		if (services && services.length > 0) {
			const categories = [...new Set(services.map(service => service.category))];
			setUniqueCategories(categories.filter(Boolean).sort());
		}
	}, [services]);

	const handleToggleDocRequirements = () => {
		setShowDocRequirements((prev) => !prev);
	};

	// Add a function to validate L+1 employee code
	const validateL1EmpCode = (code) => {
		if (!code) return true; // Optional field
		const employee = employees && employees.find(emp => emp._id === code);
		if (!employee) {
			setL1ValidationError("Employee not found with this code");
			return false;
		}
		setL1ValidationError("");
		return true;
	};

	// Handle category selection or new category creation
	const handleCategoryChange = (e) => {
		const value = e.target.value;
		if (value === "add_new_category") {
			setCategoryInputMode(true);
		} else {
			setNewService({ ...newService, category: value });
		}
	};

	// Handle saving a new category
	const handleSaveNewCategory = () => {
		if (newCategoryInput.trim()) {
			setNewService({ ...newService, category: newCategoryInput.trim() });
			setUniqueCategories([...uniqueCategories, newCategoryInput.trim()].sort());
			setCategoryInputMode(false);
			setNewCategoryInput("");
		}
	};

	// Cancel adding a new category
	const handleCancelNewCategory = () => {
		setCategoryInputMode(false);
		setNewCategoryInput("");
	};

	// Package Management Functions
	const addPackage = () => {
		setNewService((prev) => ({
			...prev,
			packages: [
				...(prev.packages || []),
				{
					name: "",
					description: "",
					actualPrice: "",
					salePrice: "",
					features: [],
					processingDays: 7,
				},
			],
		}));
	};

	const removePackage = (index) => {
		setNewService((prev) => ({
			...prev,
			packages: (prev.packages || []).filter((_, i) => i !== index),
		}));
	};

	const updatePackage = (index, field, value) => {
		setNewService((prev) => ({
			...prev,
			packages: (prev.packages || []).map((pkg, i) =>
				i === index ? { ...pkg, [field]: value } : pkg
			),
		}));
	};

	const addFeature = (packageIndex) => {
		setNewService((prev) => ({
			...prev,
			packages: (prev.packages || []).map((pkg, i) =>
				i === packageIndex
					? { ...pkg, features: [...(pkg.features || []), ""] }
					: pkg
			),
		}));
	};

	const updateFeature = (packageIndex, featureIndex, value) => {
		setNewService((prev) => ({
			...prev,
			packages: (prev.packages || []).map((pkg, i) =>
				i === packageIndex
					? {
							...pkg,
							features: (pkg.features || []).map((feat, j) =>
								j === featureIndex ? value : feat
							),
					  }
					: pkg
			),
		}));
	};

	const removeFeature = (packageIndex, featureIndex) => {
		setNewService((prev) => ({
			...prev,
			packages: (prev.packages || []).map((pkg, i) =>
				i === packageIndex
					? {
							...pkg,
							features: (pkg.features || []).filter(
								(_, j) => j !== featureIndex
							),
					  }
					: pkg
			),
		}));
	};

	// Separate component for session expired message
	const SessionExpiredMessage = () => (
		<div className='session-expired'>
			<h2>Session Expired</h2>
			<p>{error}</p>
			<button
				onClick={() => navigate("/admin/login")}
				className='login-again-btn'>
				Log In Again
			</button>
		</div>
	);

	if (error) {
		return <SessionExpiredMessage />;
	}

	return (
		<div className='tax-dashboard-section'>
			{loading && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						background: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}>
					<ClipLoader size={50} color='#ffffff' />
				</div>
			)}

			<div style={{ display: "flex", gap: "15px" }}>
				<button
					className='tax-service-btn'
					onClick={() => {
						// Initialize a new service with default values
						setNewService({
							name: "",
							description: "",
							category: "",
							actualPrice: "",
							salePrice: "",
							currency: "INR",
							processingDays: 7,
							packages: [],
							requiredDocuments: [],
							gstRate: 18,
							hsncode: ""
						});
						setShowServiceForm(true);
					}}>
					Add Service
				</button>

				<button
					className='tax-service-btn'
					onClick={() => setShowEmployeeForm(true)}>
					Add Employee
				</button>
				<button
					className='tax-service-btn'
					onClick={() => setShowUserForm(true)}>
					Add Customer
				</button>
			</div>

			<DashboardCharts
				servicesCount={servicesCount}
				usersCount={usersCount}
				managersCount={managersCount}
				employeesCount={employeesCount}
				customersCount={customersCount}
				services={services}
				users={users}
				userGrowthData={userGrowthData}
			/>

			{/* Service Form Dialog */}
			<Dialog
				open={showServiceForm}
				onClose={() => {
					setShowServiceForm(false);
					setCategoryInputMode(false);
					setNewCategoryInput("");
				}}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Add Service</DialogTitle>
				<DialogContent>
					<FormControl fullWidth>
						<InputLabel id='service-category-label'>Service Category</InputLabel>
						<Select
							labelId='service-category-label'
							id='service-category'
							value={newService.category}
							onChange={handleCategoryChange}
							label='Service Category'
						>
							{uniqueCategories.map((category) => (
								<MenuItem key={category} value={category}>
									{category}
								</MenuItem>
							))}
							<MenuItem value='add_new_category'>Add New Category</MenuItem>
						</Select>
					</FormControl>
					{categoryInputMode && (
						<>
							<TextField
								margin='dense'
								label='New Category'
								fullWidth
								value={newCategoryInput}
								onChange={(e) => setNewCategoryInput(e.target.value)}
							/>
							<div style={{ marginTop: '10px', marginBottom: '10px' }}>
								<button
									className='tax-service-btn2'
									onClick={handleSaveNewCategory}
									style={{ marginRight: '10px' }}
								>
									Save
								</button>
								<button
									className='tax-service-btn2'
									onClick={handleCancelNewCategory}
								>
									Cancel
								</button>
							</div>
						</>
					)}
					<TextField
						margin='dense'
						label='Service Name'
						fullWidth
						value={newService.name}
						onChange={(e) =>
							setNewService({ ...newService, name: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Service Description'
						fullWidth
						value={newService.description}
						onChange={(e) =>
							setNewService({ ...newService, description: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Service Price'
						type='number'
						fullWidth
						value={newService.actualPrice}
						onChange={(e) =>
							setNewService({ ...newService, actualPrice: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Discounted Service Price'
						type='number'
						fullWidth
						value={newService.salePrice}
						onChange={(e) =>
							setNewService({ ...newService, salePrice: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='GST Rate (%)'
						type='number'
						fullWidth
						value={newService.gstRate}
						onChange={(e) =>
							setNewService({
								...newService,
								gstRate: parseFloat(e.target.value) || 0,
							})
						}
						InputProps={{
							endAdornment: <InputAdornment position='end'>%</InputAdornment>,
						}}
					/>
					<TextField
						margin='dense'
						label='HSN Code'
						fullWidth
						value={newService.hsncode}
						onChange={(e) =>
							setNewService({ ...newService, hsncode: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Currency'
						fullWidth
						value={newService.currency}
						onChange={(e) =>
							setNewService({ ...newService, currency: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Processing Days'
						type='number'
						fullWidth
						value={newService.processingDays}
						onChange={(e) =>
							setNewService((prev) => ({
								...prev,
								processingDays: parseInt(e.target.value),
							}))
						}
						inputProps={{ min: 1 }}
					/>

					{/* Packages Section */}
					<div style={{ marginTop: "20px", marginBottom: "20px" }}>
						<h3>Service Packages</h3>
						<p style={{ fontSize: "0.9rem", color: "#666" }}>
							Create packages for this service (optional). Users will be able to
							select from these packages.
						</p>

						{newService.packages && newService.packages.length > 0 ? (
							<>
								{newService.packages.map((pkg, index) => (
									<div
										key={index}
										style={{
											border: "1px solid #ddd",
											borderRadius: "8px",
											padding: "15px",
											marginBottom: "15px",
											backgroundColor: "#f9f9f9",
										}}>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}>
											<h4>Package {index + 1}</h4>
											{newService.packages.length > 1 && (
												<button
													className='tax-service-btn'
													onClick={() => removePackage(index)}
													style={{ backgroundColor: "#ff6b6b" }}>
													<i className='fa-solid fa-trash'></i> Remove Package
												</button>
											)}
										</div>

										<TextField
											margin='dense'
											label='Package Name'
											fullWidth
											value={pkg.name}
											onChange={(e) =>
												updatePackage(index, "name", e.target.value)
											}
										/>
										<TextField
											margin='dense'
											label='Package Description'
											fullWidth
											value={pkg.description}
											onChange={(e) =>
												updatePackage(index, "description", e.target.value)
											}
										/>
										<div style={{ display: "flex", gap: "10px" }}>
											<TextField
												margin='dense'
												label='Price'
												type='number'
												fullWidth
												value={pkg.actualPrice}
												onChange={(e) =>
													updatePackage(index, "actualPrice", e.target.value)
												}
											/>
											<TextField
												margin='dense'
												label='Discounted Price'
												type='number'
												fullWidth
												value={pkg.salePrice}
												onChange={(e) =>
													updatePackage(index, "salePrice", e.target.value)
												}
											/>
											<TextField
												margin='dense'
												label='Processing Days'
												type='number'
												fullWidth
												value={pkg.processingDays}
												onChange={(e) =>
													updatePackage(
														index,
														"processingDays",
														parseInt(e.target.value) || 7
													)
												}
												inputProps={{ min: 1 }}
											/>
										</div>

										{/* Features Section */}
										<div style={{ marginTop: "15px" }}>
											<h5>Features</h5>
											<p style={{ fontSize: "0.8rem", color: "#666" }}>
												Add key features for this package
											</p>

											{pkg.features && pkg.features.map((feature, featureIndex) => (
												<div
													key={featureIndex}
													style={{
														display: "flex",
														gap: "10px",
														marginBottom: "8px",
													}}>
													<TextField
														size='small'
														label={`Feature ${featureIndex + 1}`}
														fullWidth
														value={feature}
														onChange={(e) =>
															updateFeature(index, featureIndex, e.target.value)
														}
													/>
													<button
														className='tax-service-btn'
														onClick={() => removeFeature(index, featureIndex)}
														style={{ backgroundColor: "#ff6b6b" }}>
														<i className='fa-solid fa-times'></i>
													</button>
												</div>
											))}

											<button
												className='tax-service-btn2'
												onClick={() => addFeature(index)}
												style={{ marginTop: "10px" }}>
												<i className='fa-solid fa-plus'></i> Add Feature
											</button>
										</div>
									</div>
								))}

								<button
									className='tax-service-btn2'
									onClick={addPackage}
									style={{ marginTop: "10px" }}>
									<i className='fa-solid fa-plus'></i> Add Another Package
								</button>
							</>
						) : (
							<div
								style={{
									textAlign: "center",
									padding: "20px",
									border: "1px dashed #ccc",
									borderRadius: "8px",
								}}>
								<p>
									No packages added yet. You can create service without packages
									or add packages below.
								</p>
								<button
									className='tax-service-btn2'
									onClick={addPackage}
									style={{ marginTop: "10px" }}>
									<i className='fa-solid fa-plus'></i> Add Package
								</button>
							</div>
						)}
					</div>

					<div>
						<button
							className='tax-service-btn2'
							onClick={handleToggleDocRequirements}>
							{showDocRequirements
								? "Hide Document Requirements"
								: "Show Document Requirements"}
						</button>
					</div>

					<div
						className={`doc-requirements ${
							showDocRequirements ? "visible" : "hidden"
						}`}>
						<DocumentRequirements
							documents={newService.requiredDocuments}
							onUpdate={(docs) =>
								setNewService({ ...newService, requiredDocuments: docs })
							}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button 
						onClick={() => {
							handleCreateService();
							setShowServiceForm(false);
						}}
					>
						Create
					</Button>
					<Button onClick={() => setShowServiceForm(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>

			{/* Employee Form Dialog - Updated from EmployeesSection.jsx */}
			<Dialog
				open={showEmployeeForm}
				onClose={() => {
					setShowEmployeeForm(false);
					setSelectedL1Employees([]);
					setL1ValidationError("");
				}}
				maxWidth='md'
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
									const emp = employees?.find(e => e._id === id);
									return emp ? emp.name : id;
								}).join(', ');
							}}
						>
							{employees?.map((emp) => (
								<MenuItem key={emp._id} value={emp._id}>
									<Checkbox checked={selectedL1Employees.indexOf(emp._id) > -1} />
									<ListItemText primary={`${emp.name} (${emp._id})`} />
								</MenuItem>
							)) || []}
						</Select>
					</FormControl>
					<FormControl fullWidth margin='dense'>
						<InputLabel id="l1-employee-label">L+1 Employee</InputLabel>
						<Select
							labelId="l1-employee-label"
							value={newEmployee.L1EmpCode || ''}
							onChange={(e) => {
								const selectedEmp = employees?.find(emp => emp._id === e.target.value);
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
							{employees?.map((emp) => (
								<MenuItem key={emp._id} value={emp._id}>
									{emp.name} ({emp._id})
								</MenuItem>
							)) || []}
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
					<Button 
						onClick={() => {
							if (validateL1EmpCode(newEmployee.L1EmpCode)) {
								handleCreateEmployee();
								setShowEmployeeForm(false);
								setSelectedL1Employees([]);
							}
						}}
					>
						Create
					</Button>
					<Button 
						onClick={() => {
							setShowEmployeeForm(false);
							setSelectedL1Employees([]);
							setL1ValidationError("");
						}}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			{/* User Form Dialog */}
			<Dialog
				open={showUserForm}
				onClose={() => setShowUserForm(false)}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Add User</DialogTitle>
				<DialogContent>
					<TextField
						margin='dense'
						label='Full Name'
						fullWidth
						value={newUser.name || ""}
						onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
					/>
					<TextField
						margin='dense'
						label='Email'
						type='email'
						fullWidth
						value={newUser.email || ""}
						onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
					/>
					<TextField
						margin='dense'
						label='Password'
						type='password'
						fullWidth
						value={newUser.password || ""}
						onChange={(e) =>
							setNewUser({ ...newUser, password: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Username'
						fullWidth
						value={newUser.username || ""}
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
						Add User
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DashboardSection;
