import React, { useContext, useState, useEffect } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useNotification } from "../NotificationContext";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DocumentRequirements from "./DocumentRequirements";
import Orders from "./Orders";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const ServicesSection = () => {
	const [showServiceForm, setShowServiceForm] = useState(false);
	const {
		services,
		newService,
		setNewService,
		handleCreateService,
		handleUpdateService,
		handleDeleteService,
		handleToggleServiceActivation,
	} = useContext(AdminDashboardContext);

	const { showNotification } = useNotification();

	// Filter and sorting state
	const [searchTerm, setSearchTerm] = useState("");
	const [filterOption, setFilterOption] = useState("newest");
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [filterCriteria, setFilterCriteria] = useState("name");
	const [editingService, setEditingService] = useState(null);
	const [showDocuments, setShowDocuments] = useState(false);

	const [showDocRequirements, setShowDocRequirements] = useState(false); // State for toggling Documen
	const handleToggleDocRequirements = () => {
		setShowDocRequirements((prev) => !prev); // Toggle visibility
	};

	const [uniqueCategories, setUniqueCategories] = useState([]);
	const [newCategoryInput, setNewCategoryInput] = useState("");
	const [categoryInputMode, setCategoryInputMode] = useState(false);

	const [editCategoryInputMode, setEditCategoryInputMode] = useState(false);
	const [editNewCategoryInput, setEditNewCategoryInput] = useState("");

	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);
		return date;
	};

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	// Filtered Services based on column filters and search term
	const filteredServices = [...services]
		.filter((service) => {
			const lowerSearchTerm = searchTerm.toLowerCase();
			return (
				service.name.toLowerCase().includes(lowerSearchTerm) ||
				service._id.toLowerCase().includes(lowerSearchTerm)
			);
		})
		.filter((service) => {
			const serviceDate = new Date(service.createdAt);
			const fromDate = dateFilter.fromDate
				? normalizeDate(dateFilter.fromDate)
				: null;
			const toDate = dateFilter.toDate
				? normalizeDate(dateFilter.toDate)
				: null;

			return (
				(fromDate === null || serviceDate >= fromDate) &&
				(toDate === null || serviceDate <= toDate)
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

	// Extract unique categories from services
	useEffect(() => {
		if (services && services.length > 0) {
			const categories = [...new Set(services.map(service => service.category))];
			setUniqueCategories(categories.filter(Boolean).sort());
		}
	}, [services]);

	// Handle category selection or new category creation
	const handleCategoryChange = (e) => {
		const value = e.target.value;
		if (value === "add_new_category") {
			setCategoryInputMode(true);
		} else {
			setNewService({ 
				...newService, 
				category: value,
				packages: newService?.packages || [] 
			});
		}
	};

	// Handle saving a new category
	const handleSaveNewCategory = () => {
		if (newCategoryInput.trim()) {
			setNewService({ 
				...newService, 
				category: newCategoryInput.trim(),
				packages: newService?.packages || [] 
			});
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

	// Handle category change in edit form
	const handleEditCategoryChange = (e) => {
		const value = e.target.value;
		if (value === "add_new_category") {
			setEditCategoryInputMode(true);
		} else {
			setEditingService({
				...editingService,
				category: value,
			});
		}
	};

	// Handle saving a new category in edit form
	const handleSaveEditNewCategory = () => {
		if (editNewCategoryInput.trim()) {
			setEditingService({
				...editingService,
				category: editNewCategoryInput.trim(),
			});
			setUniqueCategories([...uniqueCategories, editNewCategoryInput.trim()].sort());
			setEditCategoryInputMode(false);
			setEditNewCategoryInput("");
		}
	};

	// Cancel adding a new category in edit form
	const handleCancelEditNewCategory = () => {
		setEditCategoryInputMode(false);
		setEditNewCategoryInput("");
	};

	const handleUpdateServiceWithProcessingDays = async (updatedService) => {
		const originalService = services.find((s) => s._id === updatedService._id);

		if (originalService.processingDays !== updatedService.processingDays) {
			const daysDifference =
				updatedService.processingDays - originalService.processingDays;
			const success = await handleUpdateService(updatedService);

			if (success) {
				const action = daysDifference > 0 ? "increased" : "decreased";
				const days = Math.abs(daysDifference);
				showNotification(
					`Processing days ${action} by ${days} days successfully!`,
					"success",
					"admin"
				);
			}
		} else {
			await handleUpdateService(updatedService);
		}
		setEditingService(null);
		setEditCategoryInputMode(false);
		setEditNewCategoryInput("");
	};

	// Export functions
	const handleDownloadCSV = () => {
		const csvData = services.map((service) => ({
			ServiceID: service._id,
			ServiceDate: formatDate(service.createdAt),
			ServiceCategory: service.category,
			ServiceName: service.name,
			ServiceDescription: service.description,
			SalePrice: service.actualPrice,
			DiscountedPrice: service.salePrice,
			Currency: service.currency,
			HSNCode: service.hsncode,
			ProcessingDays: service.processingDays,
			RequiredDocuments: service.requiredDocuments.length,
		}));

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "services.csv");
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF("landscape", "pt", "a3");
		const tableColumn = [
			"Service ID",
			"Service Date",
			"Service Category",
			"Service Name",
			"Service Description",
			"Sale Price",
			"Discounted Price",
			"Currency",
			"HSN Code",
			"Processing Days",
			"Required Documents",
		];
		const tableRows = services.map((service) => [
			service._id,
			formatDate(service.createdAt),
			service.category,
			service.name,
			service.description,
			service.actualPrice,
			service.salePrice,
			service.currency,
			service.hsncode,
			service.processingDays,
			service.requiredDocuments?.length,
		]);

		doc.text("Service Data", 14, 15);
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
		});

		doc.save("services.pdf");
	};

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

	const clearAllFilters = () => {
		setSearchTerm("");
		setFilterOption("newest");
		setDateFilter({ fromDate: "", toDate: "" });
		setFilterCriteria("name");
	};

	return (
		<div className='tax-dashboard-services'>
			<div className='filter-div'>
				<input
					type='text'
					placeholder='Search by Service Name or ID'
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
							<th>Service ID</th>
							<th>Service Start Date</th>
							<th>Service Category</th>
							<th>Service Name</th>
							<th>Service Description</th>
							<th>Packages</th>
							<th>HSN Code</th>
							<th>Currency</th>
							<th>Required Documents</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredServices.flatMap((service) => {
							// If the service has packages, create a row for each package
							if (service.packages && service.packages.length > 0) {
								return service.packages.map((pkg, pkgIndex) => (
									<tr
										key={`${service._id}-pkg-${pkgIndex}`}
										style={pkgIndex > 0 ? { backgroundColor: "#f9f9f9" } : {}}>
										<td>{pkgIndex === 0 ? service._id : ""}</td>
										<td>
											{pkgIndex === 0 ? formatDate(service.createdAt) : ""}
										</td>
										<td>{pkgIndex === 0 ? service.category : ""}</td>
										<td>{service.name}</td>
										<td>{pkgIndex === 0 ? service.description : ""}</td>
										<td>
											<div
												style={{
													padding: "8px",
													border: "1px solid var(--accent)",
													borderRadius: "15px",
													fontSize: "14px",
												}}>
												<strong>{pkg.name}</strong>
												<br />
												Price: ₹{pkg.salePrice || pkg.actualPrice}
												<br />
												Processing: {pkg.processingDays} days
											</div>
										</td>
										<td>
											{pkgIndex === 0 ? service.hsncode || "No HSN Code" : ""}
										</td>
										<td>{pkgIndex === 0 ? service.currency : ""}</td>
										<td>
											{pkgIndex === 0 ? (
												service.requiredDocuments &&
												service.requiredDocuments.length > 0 ? (
													<select
														style={{
															border: "1px solid var(--accent)",
															borderRadius: "15px",
															padding: "15px",
															fontSize: "16px",
														}}>
														{service.requiredDocuments.map((doc) => (
															<option key={doc._id} className='service-info'>
																{doc.name} - {doc.description || "no desc"}
															</option>
														))}
													</select>
												) : (
													"No documnets specified"
												)
											) : (
												""
											)}
										</td>
										<td>
											{pkgIndex === 0 ? (
												<span
													style={{
														color: service.isActive ? "green" : "red",
														fontWeight: "bold",
													}}>
													{service.isActive !== false ? "Active" : "Inactive"}
												</span>
											) : (
												""
											)}
										</td>
										<td className='tax-btn-cont'>
											{pkgIndex === 0 ? (
												<>
													<button
														className='tax-service-btn'
														onClick={() => setEditingService(service)}>
														<i className='fa-solid fa-pencil'></i>
													</button>
													<button
														className='tax-service-btn'
														onClick={() =>
															handleToggleServiceActivation(service._id)
														}
														style={{
															backgroundColor:
																service.isActive !== false
																	? "#ff6b6b"
																	: "#4caf50",
															color: "white",
														}}>
														{service.isActive !== false
															? "Deactivate"
															: "Activate"}
													</button>
													<button
														className='serviceDelete'
														onClick={() => handleDeleteService(service._id)}>
														<i className='fa-solid fa-trash'></i>
													</button>
												</>
											) : (
												""
											)}
										</td>
									</tr>
								));
							} else {
								// For services without packages, create a single row
								return (
									<tr key={service._id}>
										<td>{service._id}</td>
										<td>{formatDate(service.createdAt)}</td>
										<td>{service.category}</td>
										<td>{service.name}</td>
										<td>{service.description}</td>
										<td>
											<span style={{ color: "#666", fontStyle: "italic" }}>
												No packages
											</span>
										</td>
										<td>{service.hsncode || "No HSN Code"}</td>
										<td>{service.currency}</td>
										<td>
											{service.requiredDocuments &&
											service.requiredDocuments.length > 0 ? (
												<select
													style={{
														border: "1px solid var(--accent)",
														borderRadius: "15px",
														padding: "15px",
														fontSize: "16px",
													}}>
													{service.requiredDocuments.map((doc) => (
														<option key={doc._id} className='service-info'>
															{doc.name} - {doc.description || "no desc"}
														</option>
													))}
												</select>
											) : (
												"No documnets specified"
											)}
										</td>
										<td>
											<span
												style={{
													color: service.isActive ? "green" : "red",
													fontWeight: "bold",
												}}>
												{service.isActive !== false ? "Active" : "Inactive"}
											</span>
										</td>
										<td className='tax-btn-cont'>
											<button
												className='tax-service-btn'
												onClick={() => setEditingService(service)}>
												<i className='fa-solid fa-pencil'></i>
											</button>
											<button
												className='tax-service-btn'
												onClick={() =>
													handleToggleServiceActivation(service._id)
												}
												style={{
													backgroundColor:
														service.isActive !== false ? "#ff6b6b" : "#4caf50",
													color: "white",
												}}>
												{service.isActive !== false ? "Deactivate" : "Activate"}
											</button>
											<button
												className='serviceDelete'
												onClick={() => handleDeleteService(service._id)}>
												<i className='fa-solid fa-trash'></i>
											</button>
										</td>
									</tr>
								);
							}
						})}
					</tbody>
				</table>
			</div>

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
							value={newService?.category || ""}
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

						{newService?.packages && newService.packages.length > 0 ? (
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

											{pkg.features.map((feature, featureIndex) => (
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
					<Button onClick={handleCreateService}>Create</Button>
					<Button onClick={() => setShowServiceForm(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Service Modal with MUI */}
			<Dialog
				open={!!editingService}
				onClose={() => {
					setEditingService(null);
					setEditCategoryInputMode(false);
					setEditNewCategoryInput("");
				}}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Edit Service</DialogTitle>
				<DialogContent>
					{editingService && (
						<>
							<FormControl fullWidth margin="dense">
								<InputLabel id="edit-service-category-label">Service Category</InputLabel>
								<Select
									labelId="edit-service-category-label"
									id="edit-service-category"
									value={editingService.category}
									onChange={handleEditCategoryChange}
									label="Service Category"
								>
									{uniqueCategories.map((category) => (
										<MenuItem key={category} value={category}>
											{category}
										</MenuItem>
									))}
									<MenuItem value="add_new_category">Add New Category</MenuItem>
								</Select>
							</FormControl>
							{editCategoryInputMode && (
								<>
									<TextField
										margin="dense"
										label="New Category"
										fullWidth
										value={editNewCategoryInput}
										onChange={(e) => setEditNewCategoryInput(e.target.value)}
									/>
									<div style={{ marginTop: '10px', marginBottom: '10px' }}>
										<button
											className="tax-service-btn2"
											onClick={handleSaveEditNewCategory}
											style={{ marginRight: '10px' }}
										>
											Save
										</button>
										<button
											className="tax-service-btn2"
											onClick={handleCancelEditNewCategory}
										>
											Cancel
										</button>
									</div>
								</>
							)}
							<TextField
								margin="dense"
								label="Service Name"
								fullWidth
								value={editingService.name}
								onChange={(e) =>
									setEditingService({ ...editingService, name: e.target.value })
								}
							/>
							<TextField
								margin='dense'
								label='Service Description'
								fullWidth
								value={editingService.description}
								onChange={(e) =>
									setEditingService({
										...editingService,
										description: e.target.value,
									})
								}
							/>
							<TextField
								margin='dense'
								label='Service Price'
								type='number'
								fullWidth
								value={editingService.actualPrice}
								onChange={(e) =>
									setEditingService({
										...editingService,
										actualPrice: parseFloat(e.target.value) || 0,
									})
								}
							/>
							<TextField
								margin='dense'
								label='Discounted Service Price'
								type='number'
								fullWidth
								value={editingService.salePrice}
								onChange={(e) =>
									setEditingService({
										...editingService,
										salePrice: parseFloat(e.target.value) || 0,
									})
								}
							/>
							<TextField
								margin='dense'
								label='HSN Code'
								fullWidth
								value={editingService.hsncode}
								onChange={(e) =>
									setEditingService({
										...editingService,
										hsncode: e.target.value,
									})
								}
							/>
							<TextField
								margin='dense'
								label='Currency'
								fullWidth
								value={editingService.currency}
								onChange={(e) =>
									setEditingService({
										...editingService,
										currency: e.target.value,
									})
								}
							/>

							{/* Packages Section */}
							<div style={{ marginTop: "20px", marginBottom: "20px" }}>
								<h3>Service Packages</h3>
								<p style={{ fontSize: "0.9rem", color: "#666" }}>
									Edit packages for this service (optional).
								</p>

								{editingService.packages &&
								editingService.packages.length > 0 ? (
									<>
										{editingService.packages.map((pkg, index) => (
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
													{editingService.packages.length > 1 && (
														<button
															className='tax-service-btn'
															onClick={() => {
																setEditingService({
																	...editingService,
																	packages: (
																		editingService.packages || []
																	).filter((_, i) => i !== index),
																});
															}}
															style={{ backgroundColor: "#ff6b6b" }}>
															<i className='fa-solid fa-trash'></i> Remove
															Package
														</button>
													)}
												</div>

												<TextField
													margin='dense'
													label='Package Name'
													fullWidth
													value={pkg.name}
													onChange={(e) => {
														setEditingService({
															...editingService,
															packages: (editingService.packages || []).map(
																(p, i) =>
																	i === index
																		? { ...p, name: e.target.value }
																		: p
															),
														});
													}}
												/>
												<TextField
													margin='dense'
													label='Package Description'
													fullWidth
													value={pkg.description}
													onChange={(e) => {
														setEditingService({
															...editingService,
															packages: (editingService.packages || []).map(
																(p, i) =>
																	i === index
																		? { ...p, description: e.target.value }
																		: p
															),
														});
													}}
												/>
												<div style={{ display: "flex", gap: "10px" }}>
													<TextField
														margin='dense'
														label='Actual Price'
														type='number'
														fullWidth
														value={pkg.actualPrice}
														onChange={(e) => {
															setEditingService({
																...editingService,
																packages: (editingService.packages || []).map(
																	(p, i) =>
																		i === index
																			? { ...p, actualPrice: e.target.value }
																			: p
																),
															});
														}}
													/>
													<TextField
														margin='dense'
														label='Sale Price'
														type='number'
														fullWidth
														value={pkg.salePrice}
														onChange={(e) => {
															setEditingService({
																...editingService,
																packages: (editingService.packages || []).map(
																	(p, i) =>
																		i === index
																			? { ...p, salePrice: e.target.value }
																			: p
																),
															});
														}}
													/>
													<TextField
														margin='dense'
														label='Processing Days'
														type='number'
														fullWidth
														value={pkg.processingDays}
														onChange={(e) => {
															setEditingService({
																...editingService,
																packages: (editingService.packages || []).map(
																	(p, i) =>
																		i === index
																			? {
																					...p,
																					processingDays:
																						parseInt(e.target.value) || 7,
																			  }
																			: p
																),
															});
														}}
														inputProps={{ min: 1 }}
													/>
												</div>

												{/* Features Section */}
												<div style={{ marginTop: "15px" }}>
													<h5>Features</h5>
													<p style={{ fontSize: "0.8rem", color: "#666" }}>
														Edit key features for this package
													</p>

													{(pkg.features || []).map((feature, featureIndex) => (
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
																onChange={(e) => {
																	setEditingService({
																		...editingService,
																		packages: (
																			editingService.packages || []
																		).map((p, i) =>
																			i === index
																				? {
																						...p,
																						features: (p.features || []).map(
																							(f, j) =>
																								j === featureIndex
																									? e.target.value
																									: f
																						),
																				  }
																				: p
																		),
																	});
																}}
															/>
															<button
																className='tax-service-btn'
																onClick={() => {
																	setEditingService({
																		...editingService,
																		packages: (
																			editingService.packages || []
																		).map((p, i) =>
																			i === index
																				? {
																						...p,
																						features: (p.features || []).filter(
																							(_, j) => j !== featureIndex
																						),
																				  }
																				: p
																		),
																	});
																}}
																style={{ backgroundColor: "#ff6b6b" }}>
																<i className='fa-solid fa-times'></i>
															</button>
														</div>
													))}

													<button
														className='tax-service-btn2'
														onClick={() => {
															setEditingService({
																...editingService,
																packages: (editingService.packages || []).map(
																	(p, i) =>
																		i === index
																			? {
																					...p,
																					features: [...(p.features || []), ""],
																			  }
																			: p
																),
															});
														}}
														style={{ marginTop: "10px" }}>
														<i className='fa-solid fa-plus'></i> Add Feature
													</button>
												</div>
											</div>
										))}

										<button
											className='tax-service-btn2'
											onClick={() => {
												setEditingService({
													...editingService,
													packages: [
														...(editingService.packages || []),
														{
															name: "",
															description: "",
															actualPrice: "",
															salePrice: "",
															features: [],
															processingDays: 7,
														},
													],
												});
											}}
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
											No packages added yet. You can keep the service without
											packages or add packages below.
										</p>
										<button
											className='tax-service-btn2'
											onClick={() => {
												setEditingService({
													...editingService,
													packages: [
														{
															name: "",
															description: "",
															actualPrice: "",
															salePrice: "",
															features: [],
															processingDays: 7,
														},
													],
												});
											}}
											style={{ marginTop: "10px" }}>
											<i className='fa-solid fa-plus'></i> Add Package
										</button>
									</div>
								)}
							</div>

							<div className='processing-days-section'>
								<TextField
									margin='dense'
									label='Default Processing Days'
									type='number'
									fullWidth
									value={editingService.processingDays}
									onChange={(e) =>
										setEditingService({
											...editingService,
											processingDays: parseInt(e.target.value) || 0,
										})
									}
									inputProps={{ min: 1 }}
								/>
								{editingService.processingDays !==
									services.find((s) => s._id === editingService._id)
										?.processingDays && (
									<span className='processing-days-notice'>
										This will update processing days for all active services
									</span>
								)}
							</div>

							<div>
								<button
									className='tax-service-btn2'
									onClick={() => setShowDocuments((prev) => !prev)}>
									{showDocuments
										? "Hide Document Requirements"
										: "Show Document Requirements"}
								</button>
							</div>

							{showDocuments && (
								<DocumentRequirements
									documents={editingService.requiredDocuments || []}
									onUpdate={(docs) =>
										setEditingService({
											...editingService,
											requiredDocuments: docs,
										})
									}
								/>
							)}
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() =>
							handleUpdateServiceWithProcessingDays(editingService)
						}>
						Update
					</Button>
					<Button onClick={() => setEditingService(null)}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ServicesSection;
