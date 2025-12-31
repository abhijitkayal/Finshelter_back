import React, { useState, useEffect, useRef } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import "./customer.css";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Typography,
	IconButton,
	Grid,
	Chip,
	Divider,
	Box,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { 
	Close, 
	AttachFile, 
	ExpandMore, 
	Send,
	History,
	Delete,
} from "@mui/icons-material";

const QueryModal = ({ service, onClose, open }) => {
	const [query, setQuery] = useState("");
	const [files, setFiles] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [queryHistory, setQueryHistory] = useState([]);
	const [showHistory, setShowHistory] = useState(false);
	const fileInputRef = useRef(null);
	const { user } = useCustomerAuth();
	const { fetchQueries, sendQuery } = useCustomerAuth();

	useEffect(() => {
		const fetchQueryHistory = async () => {
			try {
				const queries = await fetchQueries();
				setQueryHistory(queries || []);
			} catch (error) {
				console.error("Error fetching query history:", error);
			}
		};
		fetchQueryHistory();
	}, [fetchQueries]);

	const handleFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		setFiles(selectedFiles);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!query.trim() && files.length === 0) return;

		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append("userId", user._id);
			formData.append("serviceId", service.serviceId);
			formData.append("query", query);

			files.forEach((file) => {
				formData.append("files", file);
			});

			const success = await sendQuery(formData);

			if (success) {
				const queries = await fetchQueries();
				setQueryHistory(queries || []);
				setQuery("");
				setFiles([]);
				onClose();
			}
		} catch (error) {
			console.error("Failed to submit query:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderFilePreview = (file) => {
		// Create base URL for uploaded files
		const baseUrl = "https://195-35-45-82.sslip.io:8000/"; // Adjust this to match your server URL
		const filePath = `${baseUrl}${file.filePath}`;

		if (file.mimetype?.startsWith("image/")) {
			return (
				<Box sx={{ maxWidth: "100px", maxHeight: "100px", overflow: "hidden" }}>
					<img
						src={filePath}
						alt={file.originalName}
						style={{ width: "100%", height: "auto" }}
					/>
				</Box>
			);
		}
		// For PDFs and other files
		return (
			<Chip 
				icon={<AttachFile />} 
				label={file.originalName}
				component="a"
				href={filePath}
				target="_blank"
				rel="noopener noreferrer"
				clickable
				variant="outlined"
			/>
		);
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>
				<Grid container justifyContent="space-between" alignItems="center">
					<Typography variant="h6">
						Submit a Query for {service.serviceName}
					</Typography>
					<IconButton onClick={onClose} size="small">
						<Close />
					</IconButton>
				</Grid>
			</DialogTitle>
			
			<DialogContent dividers>
				<Button
					variant="outlined"
					startIcon={<History />}
					onClick={() => setShowHistory(!showHistory)}
					sx={{ mb: 2 }}
				>
					{showHistory ? "Hide History" : "Show History"}
				</Button>

				{showHistory && (
					<Box sx={{ mt: 2, mb: 3 }}>
						{queryHistory.length > 0 ? (
							queryHistory.map((q, index) => (
								<Accordion key={index} sx={{ mb: 1 }}>
									<AccordionSummary expandIcon={<ExpandMore />}>
										<Typography>
											{q.query.length > 50 ? `${q.query.substring(0, 50)}...` : q.query}
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Box sx={{ mb: 2 }}>
											<Typography variant="body1"><strong>Query:</strong> {q.query}</Typography>
											<Typography variant="body2" color="textSecondary">
												<strong>Status:</strong> {q.status}
											</Typography>
										</Box>
										
										{/* File Attachments */}
										{q.attachments && q.attachments.length > 0 && (
											<Box sx={{ mb: 2 }}>
												<Typography variant="subtitle2"><strong>Attachments:</strong></Typography>
												<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
													{q.attachments.map((file, i) => (
														<Box key={i}>
															{renderFilePreview(file)}
														</Box>
													))}
												</Box>
											</Box>
										)}

										{/* Replies */}
										{q.replies && Array.isArray(q.replies) && q.replies.length > 0 && (
											<Box sx={{ mt: 2, bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
												<Typography variant="subtitle2"><strong>Replies:</strong></Typography>
												<List>
													{q.replies.map((reply, i) => (
														<ListItem key={i} divider={i < q.replies.length - 1}>
															<ListItemText
																primary={reply.message}
																secondary={
																	<>
																		<Typography variant="body2" component="span">
																			By: {reply.responder}
																		</Typography>
																		<br />
																		<Typography variant="caption" component="span">
																			{new Date(reply.timestamp).toLocaleString()}
																		</Typography>
																	</>
																}
															/>
														</ListItem>
													))}
												</List>
											</Box>
										)}
									</AccordionDetails>
								</Accordion>
							))
						) : (
							<Typography color="textSecondary">No queries found for this service.</Typography>
						)}
					</Box>
				)}

				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						multiline
						rows={4}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Enter your query here"
						variant="outlined"
						sx={{ mb: 2 }}
					/>

					<Box sx={{ mb: 2 }}>
						<Button
							variant="outlined"
							startIcon={<AttachFile />}
							onClick={() => fileInputRef.current.click()}
							sx={{ mb: 1 }}
						>
							Attach Files
						</Button>
						
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							multiple
							accept="image/*,application/pdf"
							style={{ display: "none" }}
						/>

						{files.length > 0 && (
							<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
								{files.map((file, index) => (
									<Chip
										key={index}
										label={file.name}
										onDelete={() => setFiles(files.filter((_, i) => i !== index))}
										variant="outlined"
										sx={{ mb: 1 }}
									/>
								))}
							</Box>
						)}
					</Box>
				</form>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					color="primary"
					variant="contained"
					disabled={isSubmitting || (!query.trim() && files.length === 0)}
					startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
				>
					{isSubmitting ? "Submitting..." : "Submit"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default QueryModal;
