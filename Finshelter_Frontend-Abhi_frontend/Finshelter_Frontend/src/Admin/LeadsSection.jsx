import React, { useContext, useState, useMemo } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
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
	Typography,
	Box,
	Chip,
	List,
	ListItem,
	Divider,
	CircularProgress,
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import { useNotification } from "../NotificationContext";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

const LeadsSection = () => {
	const {
		leads,
		employees,
		loading,
		error,
		handleAssignLead,
		handleConvertLead,
		fetchAllLeads,
		handleSendLeadBack,
	} = useContext(AdminDashboardContext);

	const { showNotification } = useNotification();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterOption, setFilterOption] = useState("newest");
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [statusFilter, setStatusFilter] = useState("all");

	// State for lead assignment
	const [assigningLeadId, setAssigningLeadId] = useState(null);
	const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

	// State for lead conversion
	const [convertingLeadId, setConvertingLeadId] = useState(null);
	const [convertingLead, setConvertingLead] = useState(null);
	const [selectedPackageId, setSelectedPackageId] = useState("");
	const [paymentDetails, setPaymentDetails] = useState({
		amount: "",
		method: "cash",
		reference: "",
		isInterstate: false,
	});

	// Add state for sending back leads and viewing documents
	const [sendBackLeadId, setSendBackLeadId] = useState(null);
	const [sendBackLead, setSendBackLead] = useState(null);
	const [sendBackMessage, setSendBackMessage] = useState("");
	const [isSendingBack, setIsSendingBack] = useState(false);

	const [viewingDocumentsLeadId, setViewingDocumentsLeadId] = useState(null);
	const [viewingDocumentsLead, setViewingDocumentsLead] = useState(null);

	// Helper functions
	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);
		return date;
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	// Filter leads
	const filteredLeads = useMemo(() => {
		return leads
			.filter((lead) => {
				const lowerSearchTerm = searchTerm.toLowerCase();
				return (
					lead.name.toLowerCase().includes(lowerSearchTerm) ||
					lead.email.toLowerCase().includes(lowerSearchTerm) ||
					lead._id.toLowerCase().includes(lowerSearchTerm)
				);
			})
			.filter((lead) => {
				// Filter by status
				if (statusFilter !== "all") {
					return lead.status === statusFilter;
				}
				return true;
			})
			.filter((lead) => {
				// Filter by date
				const leadDate = new Date(lead.createdAt);
				const fromDate = dateFilter.fromDate
					? normalizeDate(dateFilter.fromDate)
					: null;
				const toDate = dateFilter.toDate
					? normalizeDate(dateFilter.toDate)
					: null;

				return (
					(fromDate === null || leadDate >= fromDate) &&
					(toDate === null || leadDate <= toDate)
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
	}, [leads, searchTerm, dateFilter, filterOption, statusFilter]);

	// Lead assignment handlers
	const startAssigningLead = (leadId) => {
		setAssigningLeadId(leadId);
		setSelectedEmployeeId("");
	};

	const confirmAssignLead = async () => {
		if (!selectedEmployeeId) {
			showNotification("Please select an employee", "error");
			return;
		}

		const success = await handleAssignLead(assigningLeadId, selectedEmployeeId);
		if (success) {
			setAssigningLeadId(null);
			setSelectedEmployeeId("");
			fetchAllLeads();
		}
	};

	// Lead conversion handlers
	const startConvertingLead = (leadId) => {
		const lead = leads.find((l) => l._id === leadId);
		setConvertingLeadId(leadId);
		setConvertingLead(lead);
		setSelectedPackageId("");

		// If service has packages, default the amount field to the first package price
		const hasPackages = lead?.serviceId?.packages?.length > 0;
		if (hasPackages) {
			const firstPackage = lead.serviceId.packages[0];
			const defaultPrice =
				firstPackage.salePrice || firstPackage.actualPrice || "";
			setPaymentDetails({
				amount: defaultPrice.toString(),
				method: "cash",
				reference: "",
				isInterstate: false,
			});
		} else {
			// If no packages, just clear the amount
			setPaymentDetails({
				amount: "",
				method: "cash",
				reference: "",
				isInterstate: false,
			});
		}
	};

	const confirmConvertLead = async () => {
		if (!paymentDetails.amount) {
			showNotification("Please enter payment amount", "error");
			return;
		}

		// Only validate package selection if the service has packages
		const hasPackages = convertingLead?.serviceId?.packages?.length > 0;
		if (hasPackages && !selectedPackageId) {
			showNotification("Please select a package", "error");
			return;
		}

		const success = await handleConvertLead(convertingLeadId, {
			...paymentDetails,
			packageId: selectedPackageId || undefined,
		});

		if (success) {
			setConvertingLeadId(null);
			setConvertingLead(null);
			setSelectedPackageId("");
			setPaymentDetails({
				amount: "",
				method: "cash",
				reference: "",
				isInterstate: false,
			});
			fetchAllLeads();
		}
	};

	const clearAllFilters = () => {
		setSearchTerm("");
		setFilterOption("newest");
		setDateFilter({ fromDate: "", toDate: "" });
		setStatusFilter("all");
	};

	// Add functions for sending back leads
	const startSendingBackLead = (leadId) => {
		const lead = leads.find((l) => l._id === leadId);
		setSendBackLeadId(leadId);
		setSendBackLead(lead);
		setSendBackMessage("");
	};

	const confirmSendBackLead = async () => {
		if (!sendBackMessage.trim()) {
			showNotification("Please provide a message for the employee", "error");
			return;
		}

		setIsSendingBack(true);
		try {
			const success = await handleSendLeadBack(sendBackLeadId, sendBackMessage);
			if (success) {
				showNotification("Lead sent back to employee successfully", "success");
				setSendBackLeadId(null);
				setSendBackLead(null);
				setSendBackMessage("");
			}
		} catch (error) {
			console.error("Error sending lead back:", error);
			showNotification("Failed to send lead back", "error");
		} finally {
			setIsSendingBack(false);
		}
	};

	// Add function for viewing documents
	const viewLeadDocuments = (leadId) => {
		const lead = leads.find((l) => l._id === leadId);
		setViewingDocumentsLeadId(leadId);
		setViewingDocumentsLead(lead);
	};

	const handleDownloadCSV = () => {
		const csvData = filteredLeads.map((lead) => ({
			"Lead ID": lead._id,
			Name: lead.name,
			Email: lead.email,
			Mobile: lead.mobile,
			Service: lead.serviceId?.name || "Unknown Service",
			"Created At": formatDate(lead.createdAt),
			Status: lead.status,
			"Lead Assigned To": lead.assignedToEmployee?.name || "Not Assigned",
			Message: lead.message,
			"Employee Note": lead.employeeNotes && lead.employeeNotes.length > 0 ? lead.employeeNotes[lead.employeeNotes.length - 1].note : "No note",
			"Order ID": lead.orderId || "Not Converted",
			"Converted At":
				lead.status === "converted" && lead.convertedAt
					? formatDate(lead.convertedAt)
					: "N/A",
			"Order Assigned To":
				lead.status === "converted"
					? lead.orderAssignedEmployee?.name ||
					  (lead.orderAssignedEmployee
							? "Employee ID: " + lead.orderAssignedEmployee
							: lead.assignedToEmployee?.name || "Same as Lead")
					: "N/A",
		}));

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "leads.csv");
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF("landscape", "pt", "a3");
		const tableColumn = [
			"Lead ID",
			"Name",
			"Email",
			"Mobile",
			"Service",
			"Created At",
			"Status",
			"Lead Assigned To",
			"Message",
			"Employee Note",
			"Order ID",
			"Converted At",
			"Order Assigned To",
		];
		const tableRows = filteredLeads.map((lead) => [
			lead._id,
			lead.name,
			lead.email,
			lead.mobile,
			lead.serviceId?.name || "Unknown Service",
			formatDate(lead.createdAt),
			lead.status,
			lead.assignedToEmployee?.name || "Not Assigned",
			lead.message,
			lead.employeeNotes && lead.employeeNotes.length > 0 ? lead.employeeNotes[lead.employeeNotes.length - 1].note : "No note",
			lead.orderId || "Not Converted",
			lead.status === "converted" && lead.convertedAt
				? formatDate(lead.convertedAt)
				: "N/A",
			lead.status === "converted"
				? lead.orderAssignedEmployee?.name ||
				  (lead.orderAssignedEmployee
						? "Employee ID: " + lead.orderAssignedEmployee
						: lead.assignedToEmployee?.name || "Same as Lead")
				: "N/A",
		]);

		doc.text("Leads Data", 14, 15);
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
		});

		doc.save("leads.pdf");
	};

	if (loading) return <div>Loading leads...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className='tax-dashboard-services'>
			<div className='filter-div'>
				<input
					type='text'
					placeholder='Search by Name, Email or ID'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}>
						<option value='all'>All Statuses</option>
						<option value='new'>New</option>
						<option value='assigned'>Assigned</option>
						<option value='accepted'>Accepted</option>
						<option value='declined'>Declined</option>
						<option value='converted'>Converted</option>
					</select>
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
					<button className='tax-service-btn' onClick={() => fetchAllLeads()}>
						<i className='fa-solid fa-refresh'></i>
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
							<th>Lead ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Mobile</th>
							<th>Service</th>
							<th>Created At</th>
							<th>Status</th>
							<th>Lead Assigned To</th>
							<th>Message</th>
							<th>Employee Note</th>
							<th>Order ID</th>
							<th>Converted At</th>
							<th>Order Assigned To</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredLeads.length === 0 ? (
							<tr>
								<td colSpan='14' style={{ textAlign: "center" }}>
									No leads found
								</td>
							</tr>
						) : (
							filteredLeads.map((lead) => (
								<tr key={lead._id}>
									<td>{lead._id}</td>
									<td>{lead.name}</td>
									<td>{lead.email}</td>
									<td>{lead.mobile}</td>
									<td>{lead.serviceId?.name || "Unknown Service"}</td>
									<td>{formatDate(lead.createdAt)}</td>
									<td>
										<span
											className={`status-badge status-${lead.status}`}
											style={{
												padding: "5px 10px",
												borderRadius: "15px",
												backgroundColor:
													lead.status === "new"
														? "#94c2f3"
														: lead.status === "assigned"
														? "#ffcc80"
														: lead.status === "accepted"
														? "#a5d6a7"
														: lead.status === "declined"
														? "#ef9a9a"
														: lead.status === "converted"
														? "#81c784"
														: "#e0e0e0",
												color: "#000",
												fontWeight: "bold",
											}}>
											{lead.status.charAt(0).toUpperCase() +
												lead.status.slice(1)}
										</span>
									</td>
									<td>
										{lead.assignedToEmployee?.name ||
											(lead.assignedToEmployee
												? "Employee ID: " + lead.assignedToEmployee
												: "Not Assigned")}
									</td>
									<td>
										<div
											style={{
												maxWidth: "200px",
												overflow: "hidden",
											}}>
											{lead.message || "No message"}
										</div>
									</td>
									<td>
										{lead.employeeNotes && lead.employeeNotes.length > 0 && (
											<div
												style={{
													maxWidth: "200px",
													overflow: "hidden",
													fontSize: "13px",
													color: "#1976d2",
													fontStyle: "italic",
												}}>
												{lead.employeeNotes[lead.employeeNotes.length - 1].note}
											</div>
										)}
									</td>
									<td>
										{lead.status === "converted" && lead.convertedToOrderId ? (
											<span style={{ fontWeight: "bold", color: "#2e7d32" }}>
												{lead.convertedToOrderId}
											</span>
										) : (
											"N/A"
										)}
									</td>
									<td>
										{lead.status === "converted" && lead.convertedAt ? (
											<span style={{ fontWeight: "bold", color: "#2e7d32" }}>
												{formatDate(lead.convertedAt)}
											</span>
										) : (
											"N/A"
										)}
									</td>
									<td>
										{lead.status === "converted" ? (
											<span style={{ fontWeight: "bold", color: "#2e7d32" }}>
												{lead.orderAssignedEmployee?.name ||
													(lead.orderAssignedEmployee
														? "Employee ID: " + lead.orderAssignedEmployee
														: lead.assignedToEmployee?.name || "Same as Lead")}
											</span>
										) : (
											"N/A"
										)}
									</td>
									<td className='tax-btn-cont'>
										{lead.status === "new" && (
											<button
												className='tax-service-btn'
												onClick={() => startAssigningLead(lead._id)}>
												Assign
											</button>
										)}
										{lead.status === "accepted" && (
											<>
												<button
													className='tax-service-btn'
													onClick={() => startConvertingLead(lead._id)}>
													Convert
												</button>
												<button
													className='tax-service-btn'
													onClick={() => startSendingBackLead(lead._id)}
													style={{
														backgroundColor: "#ff9800",
														margin: "0 5px",
													}}>
													Send Back
												</button>
												{lead.documents && lead.documents.length > 0 && (
													<button
														className='tax-service-btn'
														onClick={() => viewLeadDocuments(lead._id)}
														style={{ backgroundColor: "#2196f3" }}>
														View Documents
													</button>
												)}
											</>
										)}
										{lead.status === "declined" && (
											<button
												className='tax-service-btn'
												onClick={() => startAssigningLead(lead._id)}>
												Reassign
											</button>
										)}
										{lead.status === "converted" && (
											<button className='tax-service-btn' disabled>
												Converted
											</button>
										)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Assign Lead Dialog */}
			<Dialog
				open={assigningLeadId !== null}
				onClose={() => setAssigningLeadId(null)}>
				<DialogTitle>Assign Lead</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Select an employee to assign this lead to:
					</DialogContentText>
					<Select
						fullWidth
						value={selectedEmployeeId}
						onChange={(e) => setSelectedEmployeeId(e.target.value)}
						margin='dense'>
						<MenuItem value='' disabled>
							Select an employee
						</MenuItem>
						{employees.map((employee) => (
							<MenuItem key={employee._id} value={employee._id}>
								{employee.name} ({employee.email})
							</MenuItem>
						))}
					</Select>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setAssigningLeadId(null)}>Cancel</Button>
					<Button onClick={confirmAssignLead} color='primary'>
						Assign
					</Button>
				</DialogActions>
			</Dialog>

			{/* Convert Lead Dialog */}
			<Dialog
				open={convertingLeadId !== null}
				onClose={() => {
					setConvertingLeadId(null);
					setConvertingLead(null);
				}}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Convert Lead to Customer</DialogTitle>
				<DialogContent>
					{convertingLead && (
						<div style={{ marginBottom: "20px" }}>
							<h3>Lead Information</h3>
							<p>
								<strong>Name:</strong> {convertingLead.name}
							</p>
							<p>
								<strong>Email:</strong> {convertingLead.email}
							</p>
							<p>
								<strong>Mobile:</strong> {convertingLead.mobile}
							</p>
							<p>
								<strong>Service:</strong>{" "}
								{convertingLead.serviceId?.name || "Unknown Service"}
							</p>
						</div>
					)}

					{/* Package Selection - only shown if the service has packages */}
					{convertingLead?.serviceId?.packages?.length > 0 ? (
						<div style={{ marginBottom: "20px" }}>
							<h4>Select Package</h4>
							<Select
								fullWidth
								value={selectedPackageId}
								onChange={(e) => {
									setSelectedPackageId(e.target.value);
									const selectedPackage =
										convertingLead.serviceId.packages.find(
											(pkg) => pkg._id === e.target.value
										);
									if (selectedPackage) {
										setPaymentDetails({
											...paymentDetails,
											amount: (
												selectedPackage.salePrice || selectedPackage.actualPrice
											).toString(),
										});
									}
								}}
								margin='dense'>
								<MenuItem value='' disabled>
									Select a package
								</MenuItem>
								{convertingLead.serviceId.packages.map((pkg) => (
									<MenuItem key={pkg._id} value={pkg._id}>
										{pkg.name} (₹{pkg.salePrice || pkg.actualPrice})
									</MenuItem>
								))}
							</Select>
						</div>
					) : (
						convertingLead && (
							<div style={{ marginBottom: "20px" }}>
								<p style={{ color: "#666" }}>
									This service does not have any predefined packages.
								</p>
							</div>
						)
					)}

					<h4>Payment Details</h4>
					<TextField
						margin='dense'
						label='Amount'
						type='number'
						fullWidth
						value={paymentDetails.amount}
						onChange={(e) =>
							setPaymentDetails({ ...paymentDetails, amount: e.target.value })
						}
					/>
					<Select
						fullWidth
						value={paymentDetails.method}
						onChange={(e) =>
							setPaymentDetails({ ...paymentDetails, method: e.target.value })
						}
						margin='dense'>
						<MenuItem value='cash'>Cash</MenuItem>
						<MenuItem value='bank_transfer'>Bank Transfer</MenuItem>
						<MenuItem value='check'>Check</MenuItem>
						<MenuItem value='card'>Credit/Debit Card</MenuItem>
						<MenuItem value='upi'>UPI</MenuItem>
					</Select>
					<TextField
						margin='dense'
						label='Reference/Transaction ID'
						fullWidth
						value={paymentDetails.reference}
						onChange={(e) =>
							setPaymentDetails({
								...paymentDetails,
								reference: e.target.value,
							})
						}
					/>
					
					{/* Add Interstate Transaction Checkbox */}
					<FormControlLabel
						control={
							<Checkbox
								checked={paymentDetails.isInterstate || false}
								onChange={(e) =>
									setPaymentDetails({
										...paymentDetails,
										isInterstate: e.target.checked,
									})
								}
							/>
						}
						label="Interstate Transaction (IGST applicable)"
						sx={{ marginTop: 2 }}
					/>
					<Typography variant="body2" color="text.secondary" sx={{ marginLeft: 4, marginTop: 0.5 }}>
						Check this box if the customer is from a different state than your business.
						This will apply IGST instead of CGST/SGST.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setConvertingLeadId(null);
							setConvertingLead(null);
						}}>
						Cancel
					</Button>
					<Button onClick={confirmConvertLead} color='primary'>
						Convert
					</Button>
				</DialogActions>
			</Dialog>

			{/* Send Back Lead Dialog */}
			<Dialog
				open={!!sendBackLeadId}
				onClose={() => !isSendingBack && setSendBackLeadId(null)}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>Send Lead Back to Employee</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please provide a message explaining why you're sending this lead
						back to the employee:
					</DialogContentText>
					{sendBackLead && (
						<div style={{ marginTop: "20px", marginBottom: "20px" }}>
							<p>
								<strong>Lead ID:</strong> {sendBackLead._id}
							</p>
							<p>
								<strong>Customer:</strong> {sendBackLead.name} (
								{sendBackLead.email})
							</p>
							<p>
								<strong>Service:</strong>{" "}
								{sendBackLead.serviceId?.name || "Unknown"}
							</p>
							<p>
								<strong>Lead Assigned To:</strong>{" "}
								{sendBackLead.assignedToEmployee?.name || "Not assigned"}
							</p>
						</div>
					)}
					<TextField
						autoFocus
						margin='dense'
						label='Message for Employee'
						type='text'
						fullWidth
						multiline
						rows={4}
						value={sendBackMessage}
						onChange={(e) => setSendBackMessage(e.target.value)}
						required
						error={!sendBackMessage.trim()}
						helperText={!sendBackMessage.trim() ? "Message is required" : ""}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => !isSendingBack && setSendBackLeadId(null)}
						color='primary'
						disabled={isSendingBack}>
						Cancel
					</Button>
					<Button
						onClick={confirmSendBackLead}
						color='warning'
						variant='contained'
						disabled={isSendingBack || !sendBackMessage.trim()}>
						{isSendingBack ? <CircularProgress size={24} /> : "Send Back"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* View Lead Documents Dialog */}
			<Dialog
				open={!!viewingDocumentsLeadId}
				onClose={() => setViewingDocumentsLeadId(null)}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Lead Documents and Notes</DialogTitle>
				<DialogContent>
					{viewingDocumentsLead && (
						<>
							<Box sx={{ marginBottom: 3 }}>
								<Typography variant='h6'>Lead Details</Typography>
								<Typography>
									<strong>ID:</strong> {viewingDocumentsLead._id}
								</Typography>
								<Typography>
									<strong>Customer:</strong> {viewingDocumentsLead.name}
								</Typography>
								<Typography>
									<strong>Service:</strong>{" "}
									{viewingDocumentsLead.serviceId?.name || "Unknown"}
								</Typography>
								<Typography>
									<strong>Status:</strong> {viewingDocumentsLead.status}
								</Typography>
							</Box>

							{viewingDocumentsLead.paymentDetails && (
								<Box
									sx={{
										marginBottom: 3,
										padding: 2,
										bgcolor: "#f5f5f5",
										borderRadius: 1,
									}}>
									<Typography variant='h6'>Payment Details</Typography>
									{viewingDocumentsLead.paymentDetails.amount && (
										<Typography>
											<strong>Amount:</strong> ₹
											{viewingDocumentsLead.paymentDetails.amount}
										</Typography>
									)}
									{viewingDocumentsLead.paymentDetails.method && (
										<Typography>
											<strong>Method:</strong>{" "}
											{viewingDocumentsLead.paymentDetails.method}
										</Typography>
									)}
									{viewingDocumentsLead.paymentDetails.reference && (
										<Typography>
											<strong>Reference:</strong>{" "}
											{viewingDocumentsLead.paymentDetails.reference}
										</Typography>
									)}
									{viewingDocumentsLead.paymentDetails.date && (
										<Typography>
											<strong>Date:</strong>{" "}
											{formatDate(viewingDocumentsLead.paymentDetails.date)}
										</Typography>
									)}
								</Box>
							)}

							<Box sx={{ marginBottom: 3 }}>
								<Typography variant='h6'>Documents</Typography>
								{viewingDocumentsLead.documents &&
								viewingDocumentsLead.documents.length > 0 ? (
									<List>
										{viewingDocumentsLead.documents.map((doc, index) => (
											<ListItem key={index}>
												<Box
													sx={{
														display: "flex",
														flexDirection: "column",
														width: "100%",
													}}>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															justifyContent: "space-between",
														}}>
														<Typography variant='body1'>
															{doc.originalName}
														</Typography>
														<Chip
															label={
																doc.mimetype.includes("pdf") ? "PDF" : "Image"
															}
															color={
																doc.mimetype.includes("pdf")
																	? "primary"
																	: "success"
															}
															size='small'
														/>
													</Box>
													<Typography variant='body2' color='text.secondary'>
														Uploaded: {formatDate(doc.uploadedAt)}
													</Typography>
													<Typography variant='body2' color='text.secondary'>
														Size: {(doc.size / 1024).toFixed(2)} KB
													</Typography>
													<a
														href={`https://195-35-45-82.sslip.io:8000/${doc.path}`}
														target='_blank'
														rel='noopener noreferrer'
														style={{ marginTop: "5px" }}>
														<Button
															color='primary'
															size='small'
															variant='outlined'>
															View Document
														</Button>
													</a>
												</Box>
											</ListItem>
										))}
									</List>
								) : (
									<Typography color='text.secondary'>
										No documents uploaded
									</Typography>
								)}
							</Box>

							{viewingDocumentsLead.employeeNotes &&
								viewingDocumentsLead.employeeNotes.length > 0 && (
									<Box sx={{ marginBottom: 3 }}>
										<Typography variant='h6'>Employee Notes</Typography>
										<List>
											{viewingDocumentsLead.employeeNotes.map((note, index) => (
												<React.Fragment key={index}>
													<ListItem>
														<Box sx={{ width: "100%" }}>
															<Typography
																variant='body1'
																sx={{ whiteSpace: "pre-wrap" }}>
																{note.note}
															</Typography>
															<Typography
																variant='caption'
																color='text.secondary'>
																Added: {formatDate(note.createdAt)}
															</Typography>
														</Box>
													</ListItem>
													{index <
														viewingDocumentsLead.employeeNotes.length - 1 && (
														<Divider />
													)}
												</React.Fragment>
											))}
										</List>
									</Box>
								)}
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setViewingDocumentsLeadId(null)}
						color='primary'>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default LeadsSection;
