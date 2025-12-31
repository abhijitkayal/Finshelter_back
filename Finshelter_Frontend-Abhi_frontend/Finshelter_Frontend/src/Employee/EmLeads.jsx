import React, { useContext, useState, useEffect, useMemo } from "react";
import { EmployeeContext } from "./EmployeeContext";
import { useNotification } from "../NotificationContext";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	CircularProgress,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Box,
	Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

const EmLeads = () => {
	const {
		user,
		leads,
		loading,
		error,
		fetchAssignedLeads,
		approveLead,
		rejectLead,
		uploadLeadDocuments,
		setLeads,
	} = useContext(EmployeeContext);

	const { showNotification } = useNotification();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterOption, setFilterOption] = useState("newest");
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [statusFilter, setStatusFilter] = useState("all");

	// State for approval dialog
	const [approvingLeadId, setApprovingLeadId] = useState(null);
	const [approvingLead, setApprovingLead] = useState(null);
	const [isApproving, setIsApproving] = useState(false);

	// State for rejection dialog
	const [rejectingLeadId, setRejectingLeadId] = useState(null);
	const [rejectingLead, setRejectingLead] = useState(null);
	const [rejectionReason, setRejectionReason] = useState("");
	const [isRejecting, setIsRejecting] = useState(false);

	// State for document upload dialog
	const [uploadingLeadId, setUploadingLeadId] = useState(null);
	const [uploadingLead, setUploadingLead] = useState(null);
	const [uploadingFiles, setUploadingFiles] = useState([]);
	const [uploadNote, setUploadNote] = useState("");
	const [paymentDetails, setPaymentDetails] = useState({
		amount: "",
		method: "cash",
		reference: "",
	});
	const [isUploading, setIsUploading] = useState(false);

	const [isRefreshing, setIsRefreshing] = useState(false);
	const [canDownload, setCanDownload] = useState(false);

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
					lead.name?.toLowerCase().includes(lowerSearchTerm) ||
					lead.email?.toLowerCase().includes(lowerSearchTerm) ||
					lead._id?.toLowerCase().includes(lowerSearchTerm) ||
					lead.mobile?.includes(searchTerm)
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

	// Lead approval handlers
	const startApprovingLead = (leadId) => {
		const lead = leads.find((l) => l._id === leadId);
		setApprovingLeadId(leadId);
		setApprovingLead(lead);
	};

	const confirmApproveLead = async () => {
		setIsApproving(true);

		// Optimistic UI update - update the lead status in the UI immediately
		const updatedLeads = leads.map((lead) =>
			lead._id === approvingLeadId ? { ...lead, status: "accepted" } : lead
		);
		setLeads(updatedLeads);

		try {
			const success = await approveLead(approvingLeadId);
			if (success) {
				showNotification(
					"Lead approved successfully. It will be converted to an order.",
					"success"
				);
				setApprovingLeadId(null);
				setApprovingLead(null);
				// We don't need to fetch all leads again since we already updated the UI
				// fetchAssignedLeads();
			} else {
				// If the approval failed, revert the optimistic update
				setLeads(leads);
				showNotification("Failed to approve lead", "error");
			}
		} catch (error) {
			// If there was an error, revert the optimistic update
			setLeads(leads);
			console.error("Error approving lead:", error);
			showNotification("Failed to approve lead", "error");
		} finally {
			setIsApproving(false);
		}
	};

	// Lead rejection handlers
	const startRejectingLead = (leadId) => {
		const lead = leads.find((l) => l._id === leadId);
		setRejectingLeadId(leadId);
		setRejectingLead(lead);
		setRejectionReason("");
	};

	const confirmRejectLead = async () => {
		if (!rejectionReason.trim()) {
			showNotification("Please provide a reason for rejection", "error");
			return;
		}

		setIsRejecting(true);
		try {
			const success = await rejectLead(rejectingLeadId, rejectionReason);
			if (success) {
				showNotification("Lead rejected successfully", "success");
				setRejectingLeadId(null);
				setRejectingLead(null);
				setRejectionReason("");
			}
		} catch (error) {
			console.error("Error rejecting lead:", error);
			showNotification("Failed to reject lead", "error");
		} finally {
			setIsRejecting(false);
		}
	};

	// Document upload handlers
	const startUploadingDocuments = (leadId) => {
		const lead = leads.find((l) => l._id === leadId);
		setUploadingLeadId(leadId);
		setUploadingLead(lead);
		setUploadingFiles([]);
		setUploadNote("");
		setPaymentDetails({
			amount: "",
			method: "cash",
			reference: "",
		});
	};

	const handleFileChange = (e) => {
		setUploadingFiles(Array.from(e.target.files));
	};

	const confirmUploadDocuments = async () => {
		if (uploadingFiles.length === 0) {
			showNotification("Please select at least one file to upload", "error");
			return;
		}

		setIsUploading(true);
		try {
			const success = await uploadLeadDocuments(
				uploadingLeadId,
				uploadingFiles,
				uploadNote,
				paymentDetails.amount ||
					paymentDetails.method ||
					paymentDetails.reference
					? paymentDetails
					: null
			);
			if (success) {
				showNotification("Documents uploaded successfully", "success");
				setUploadingLeadId(null);
				setUploadingLead(null);
				setUploadingFiles([]);
				setUploadNote("");
				setPaymentDetails({
					amount: "",
					method: "cash",
					reference: "",
				});
			}
		} catch (error) {
			console.error("Error uploading documents:", error);
			showNotification("Failed to upload documents", "error");
		} finally {
			setIsUploading(false);
		}
	};

	const clearAllFilters = () => {
		setSearchTerm("");
		setFilterOption("newest");
		setDateFilter({ fromDate: "", toDate: "" });
		setStatusFilter("all");
	};

	// Helper function for refreshing leads without full loading state
	const refreshLeads = async () => {
		setIsRefreshing(true);
		try {
			await fetchAssignedLeads();
			showNotification("Leads refreshed successfully", "success");
		} catch (error) {
			console.error("Error refreshing leads:", error);
		} finally {
			setIsRefreshing(false);
		}
	};

	// Fetch leads on component mount
	useEffect(() => {
		fetchAssignedLeads();
	}, [fetchAssignedLeads]);

	useEffect(() => {
		// Check if the user has download access
		if (user && user.downloadAccess) {
			setCanDownload(true);
		} else {
			setCanDownload(false);
		}
	}, [user]);

	const handleDownloadCSV = () => {
		const csvData = filteredLeads.map((lead) => ({
			"Lead ID": lead._id,
			Name: lead.name,
			Email: lead.email,
			Mobile: lead.mobile,
			Service: lead.serviceId?.name || "Unknown Service",
			"Created At": formatDate(lead.createdAt),
			Status: lead.status,
			Message: lead.message,
			"Order ID": lead.orderId || "Not Converted",
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
			"Message",
			"Order ID",
		];
		const tableRows = filteredLeads.map((lead) => [
			lead._id,
			lead.name,
			lead.email,
			lead.mobile,
			lead.serviceId?.name || "Unknown Service",
			formatDate(lead.createdAt),
			lead.status,
			lead.message,
			lead.orderId || "Not Converted",
		]);

		doc.text("Leads Data", 14, 15);
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
		});

		doc.save("leads.pdf");
	};

	// Remove loading condition
	if (error) return <div className='error-message'>{error}</div>;

	return (
		<div className='assigned-customers tax-dashboard-employee'>
			<div className='filter-div'>
				<input
					type='text'
					placeholder='Search by Name, Email, Mobile or ID'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					style={{ padding: "12px 19px" }}
				/>
				<div>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						style={{ padding: "12px 19px" }}>
						<option value='all'>All Statuses</option>
						<option value='assigned'>Assigned</option>
						<option value='accepted'>Approved</option>
						<option value='rejected'>Rejected</option>
						<option value='converted'>Converted</option>
					</select>
					<input
						type='date'
						placeholder='From Date'
						value={dateFilter.fromDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, fromDate: e.target.value })
						}
						style={{ padding: "12px 19px", marginLeft: "3px" }}
					/>
					<input
						type='date'
						placeholder='To Date'
						value={dateFilter.toDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, toDate: e.target.value })
						}
						style={{ padding: "12px 19px", marginLeft: "3px" }}
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
						onClick={refreshLeads}
						disabled={isRefreshing}
						style={{ backgroundColor: "var(--primary)" }}>
						{isRefreshing ? (
							<CircularProgress size={20} style={{ color: "white" }} />
						) : (
							<i className='fa-solid fa-refresh'></i>
						)}
					</button>
					{canDownload && (
						<>
							<button className='tax-service-btn' onClick={handleDownloadCSV}>
								<i className='fa-solid fa-file-csv fa-2xl'></i>
							</button>
							<button className='tax-service-btn' onClick={handleDownloadPDF}>
								<i className='fa-solid fa-file-pdf fa-2xl'></i>
							</button>
						</>
					)}
				</div>
			</div>

			<div className='tax-services-wrap-table'>
				{filteredLeads.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th>Lead ID</th>
								<th>Date</th>
								<th>Name</th>
								<th>Email</th>
								<th>Mobile</th>
								<th>Service</th>
								<th>Source</th>
								<th>Message</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredLeads.map((lead) => (
								<tr key={lead._id}>
									<td>{lead._id}</td>
									<td>{formatDate(lead.createdAt)}</td>
									<td>{lead.name}</td>
									<td>{lead.email}</td>
									<td>{lead.mobile}</td>
									<td>{lead.serviceId?.name || "Unknown Service"}</td>
									<td>{lead.source || "Website"}</td>
									<td>{lead.message || "No message"}</td>
									<td>
										<span
											className={`status-badge status-${lead.status}`}
											style={{
												padding: "3px 8px",
												borderRadius: "12px",
												fontSize: "12px",
												fontWeight: "bold",
												backgroundColor:
													lead.status === "new"
														? "#e3f2fd"
														: lead.status === "assigned"
														? "#fff9c4"
														: lead.status === "accepted"
														? "#c8e6c9"
														: lead.status === "converted"
														? "#4caf50"
														: lead.status === "declined"
														? "#ffcdd2"
														: lead.status === "rejected"
														? "#f44336"
														: "#f5f5f5",
												color:
													lead.status === "new"
														? "#0d47a1"
														: lead.status === "assigned"
														? "#f57f17"
														: lead.status === "accepted"
														? "#1b5e20"
														: lead.status === "converted"
														? "#ffffff"
														: lead.status === "declined"
														? "#b71c1c"
														: lead.status === "rejected"
														? "#ffffff"
														: "#333333",
											}}>
											{lead.status === "accepted"
												? "Approved"
												: lead.status.charAt(0).toUpperCase() +
												  lead.status.slice(1)}
										</span>
										{lead.adminNote && (
											<div
												style={{
													marginTop: "5px",
													fontSize: "11px",
													color: "#d32f2f",
												}}>
												Admin note: {lead.adminNote}
											</div>
										)}
									</td>
									<td>
										{lead.status === "assigned" && (
											<div style={{ display: "flex", gap: "5px" }}>
												<button
													className='tax-service-btn'
													onClick={() => startApprovingLead(lead._id)}
													style={{ backgroundColor: "var(--primary)" }}
													disabled={
														isApproving && approvingLeadId === lead._id
													}>
													{isApproving && approvingLeadId === lead._id ? (
														<span>Processing...</span>
													) : (
														"Approve"
													)}
												</button>
												<button
													className='tax-service-btn'
													onClick={() => startRejectingLead(lead._id)}
													style={{ backgroundColor: "#f44336" }}
													disabled={
														isRejecting && rejectingLeadId === lead._id
													}>
													{isRejecting && rejectingLeadId === lead._id ? (
														<span>Processing...</span>
													) : (
														"Reject"
													)}
												</button>
											</div>
										)}
										{lead.status === "accepted" && (
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													gap: "5px",
												}}>
												<button
													className='tax-service-btn'
													onClick={() => startUploadingDocuments(lead._id)}
													style={{ backgroundColor: "#4caf50" }}>
													Upload Documents
												</button>
												<span
													style={{
														color: "var(--accent)",
														fontStyle: "italic",
														fontSize: "12px",
													}}>
													{lead.documents && lead.documents.length > 0
														? `${lead.documents.length} document(s) uploaded`
														: "No documents yet"}
												</span>
											</div>
										)}
										{lead.status === "converted" && (
											<span
												style={{ color: "var(--accent)", fontStyle: "italic" }}>
												Converted to order
											</span>
										)}
										{lead.status === "rejected" && (
											<span
												style={{
													color: "#d32f2f",
													fontStyle: "italic",
													fontSize: "12px",
												}}>
												Reason: {lead.rejectReason}
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className='no-data-message'>
						<p>
							No leads found.{" "}
							{searchTerm ||
							statusFilter !== "all" ||
							dateFilter.fromDate ||
							dateFilter.toDate
								? "Try clearing filters."
								: ""}
						</p>
					</div>
				)}
			</div>

			{/* Lead Approval Dialog */}
			<Dialog
				open={!!approvingLeadId}
				onClose={() => !isApproving && setApprovingLeadId(null)}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>Approve Lead</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to approve this lead? Once approved, it can be
						converted to a customer order.
					</DialogContentText>
					{approvingLead && (
						<div style={{ marginTop: "20px" }}>
							<p>
								<strong>Name:</strong> {approvingLead.name}
							</p>
							<p>
								<strong>Email:</strong> {approvingLead.email}
							</p>
							<p>
								<strong>Mobile:</strong> {approvingLead.mobile}
							</p>
							<p>
								<strong>Service:</strong>{" "}
								{approvingLead.serviceId?.name || "Unknown"}
							</p>
							<p>
								<strong>Message:</strong>{" "}
								{approvingLead.message || "No message"}
							</p>
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => !isApproving && setApprovingLeadId(null)}
						color='primary'
						disabled={isApproving}>
						Cancel
					</Button>
					<Button
						onClick={confirmApproveLead}
						color='primary'
						variant='contained'
						disabled={isApproving}>
						{isApproving ? <CircularProgress size={24} /> : "Approve"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Lead Rejection Dialog */}
			<Dialog
				open={!!rejectingLeadId}
				onClose={() => !isRejecting && setRejectingLeadId(null)}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>Reject Lead</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please provide a reason for rejecting this lead:
					</DialogContentText>
					{rejectingLead && (
						<div style={{ marginTop: "20px", marginBottom: "20px" }}>
							<p>
								<strong>Name:</strong> {rejectingLead.name}
							</p>
							<p>
								<strong>Email:</strong> {rejectingLead.email}
							</p>
							<p>
								<strong>Service:</strong>{" "}
								{rejectingLead.serviceId?.name || "Unknown"}
							</p>
						</div>
					)}
					<TextField
						autoFocus
						margin='dense'
						label='Rejection Reason'
						type='text'
						fullWidth
						multiline
						rows={4}
						value={rejectionReason}
						onChange={(e) => setRejectionReason(e.target.value)}
						required
						error={!rejectionReason.trim()}
						helperText={!rejectionReason.trim() ? "Reason is required" : ""}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => !isRejecting && setRejectingLeadId(null)}
						color='primary'
						disabled={isRejecting}>
						Cancel
					</Button>
					<Button
						onClick={confirmRejectLead}
						color='error'
						variant='contained'
						disabled={isRejecting || !rejectionReason.trim()}>
						{isRejecting ? <CircularProgress size={24} /> : "Reject"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Document Upload Dialog */}
			<Dialog
				open={!!uploadingLeadId}
				onClose={() => !isUploading && setUploadingLeadId(null)}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Upload Documents</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Upload payment receipt and any other documents for this lead.
					</DialogContentText>
					{uploadingLead && (
						<Box sx={{ marginTop: "20px", marginBottom: "20px" }}>
							<Typography>
								<strong>Name:</strong> {uploadingLead.name}
							</Typography>
							<Typography>
								<strong>Email:</strong> {uploadingLead.email}
							</Typography>
							<Typography>
								<strong>Service:</strong>{" "}
								{uploadingLead.serviceId?.name || "Unknown"}
							</Typography>
							<Box
								sx={{
									marginTop: "10px",
									padding: "10px",
									bgcolor: "#f5f5f5",
									borderRadius: "4px",
								}}>
								<Typography
									variant='subtitle2'
									sx={{ fontWeight: "bold", marginBottom: "10px" }}>
									Payment Details:
								</Typography>
								<TextField
									label='Amount (₹)'
									type='number'
									size='small'
									value={paymentDetails.amount}
									onChange={(e) =>
										setPaymentDetails({
											...paymentDetails,
											amount: e.target.value,
										})
									}
									sx={{
										marginBottom: "10px",
										marginRight: "10px",
										width: "150px",
									}}
								/>
								<FormControl
									size='small'
									sx={{
										width: "150px",
										marginRight: "10px",
										marginBottom: "10px",
									}}>
									<InputLabel>Payment Method</InputLabel>
									<Select
										value={paymentDetails.method}
										onChange={(e) =>
											setPaymentDetails({
												...paymentDetails,
												method: e.target.value,
											})
										}
										label='Payment Method'>
										<MenuItem value='cash'>Cash</MenuItem>
										<MenuItem value='bank_transfer'>Bank Transfer</MenuItem>
										<MenuItem value='upi'>UPI</MenuItem>
										<MenuItem value='cheque'>Cheque</MenuItem>
										<MenuItem value='other'>Other</MenuItem>
									</Select>
								</FormControl>
								<TextField
									label='Reference/Transaction ID'
									type='text'
									size='small'
									value={paymentDetails.reference}
									onChange={(e) =>
										setPaymentDetails({
											...paymentDetails,
											reference: e.target.value,
										})
									}
									sx={{ width: "200px", marginBottom: "10px" }}
								/>
							</Box>
						</Box>
					)}
					<Box sx={{ marginY: 2 }}>
						<Typography
							variant='subtitle2'
							sx={{ fontWeight: "bold", marginBottom: "10px" }}>
							Upload Documents:
						</Typography>
						<input
							type='file'
							accept='image/*,application/pdf'
							multiple
							onChange={handleFileChange}
							style={{ marginBottom: "15px" }}
						/>
						{uploadingFiles.length > 0 && (
							<Box sx={{ marginY: 1 }}>
								<Typography variant='body2' sx={{ fontWeight: "bold" }}>
									Selected files:
								</Typography>
								<ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
									{uploadingFiles.map((file, index) => (
										<li key={index}>
											{file.name} ({(file.size / 1024).toFixed(2)} KB)
										</li>
									))}
								</ul>
							</Box>
						)}
					</Box>
					<TextField
						margin='dense'
						label='Note to Admin'
						type='text'
						fullWidth
						multiline
						rows={3}
						value={uploadNote}
						onChange={(e) => setUploadNote(e.target.value)}
						placeholder='Add any notes about the payment or documents'
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => !isUploading && setUploadingLeadId(null)}
						color='primary'
						disabled={isUploading}>
						Cancel
					</Button>
					<Button
						onClick={confirmUploadDocuments}
						color='primary'
						variant='contained'
						disabled={isUploading || uploadingFiles.length === 0}>
						{isUploading ? <CircularProgress size={24} /> : "Upload"}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default EmLeads;
