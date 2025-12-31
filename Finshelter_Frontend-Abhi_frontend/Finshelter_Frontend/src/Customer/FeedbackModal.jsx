import React, { useState, useEffect } from "react";
import axios from "../Admin/utils/axiosConfig";
import { useCustomerAuth } from "./CustomerAuthContext";
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
	Box,
	Rating,
	CircularProgress,
	Alert
} from "@mui/material";
import { Close, Send, Star } from "@mui/icons-material";

const FeedbackModal = ({ service, onClose, open, onFeedbackSubmitted }) => {
	const [feedback, setFeedback] = useState("");
	const [rating, setRating] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useCustomerAuth();

	useEffect(() => {
		console.log("FeedbackModal - Received service:", service);
	}, [service]);

	// Reset form when modal closes
	useEffect(() => {
		if (!open) {
			setFeedback("");
			setRating(0);
			setError(null);
		}
	}, [open]);

	const handleSubmit = async () => {
		if (!service) {
			setError("Invalid service data");
			return;
		}

		if (!feedback.trim()) {
			setError("Feedback cannot be empty");
			return;
		}

		if (rating === 0) {
			setError("Please select a rating");
			return;
		}

		setLoading(true);

		try {
			const token = localStorage.getItem("customerToken");

			if (!token) {
				setError("You are not authenticated. Please log in.");
				setLoading(false);
				return;
			}

			// Make the request with the token in headers
			await axios.post(
				"http://localhost:8000/api/customers/feedback",
				{
					userId: user._id,
					serviceId: service.serviceId || service.orderId, // Use serviceId or orderId
					feedback,
					rating, // Include the rating
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log("Feedback submitted successfully!");
			// Notify parent component about successful submission
			if (onFeedbackSubmitted) {
				onFeedbackSubmitted(service.serviceId || service.orderId);
			}
			// Show success message
			setError(null);
			// You can add a success state here if you want a different UI
			onClose();
		} catch (err) {
			console.error("Error submitting feedback:", err);
			setError("Failed to submit feedback");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={() => !loading && onClose()} fullWidth maxWidth="sm">
			<DialogTitle>
				<Grid container justifyContent="space-between" alignItems="center">
					<Typography variant="h6">
						Feedback for {service?.serviceName || service?.name || 'Service'}
					</Typography>
					<IconButton onClick={onClose} size="small" disabled={loading}>
						<Close />
					</IconButton>
				</Grid>
			</DialogTitle>
			
			<DialogContent dividers>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 2 }}>
					<Typography component="legend" gutterBottom>
						Your Rating
					</Typography>
					<Rating
						name="feedback-rating"
						value={rating}
						onChange={(event, newValue) => {
							setRating(newValue);
						}}
						precision={1}
						size="large"
						icon={<Star fontSize="inherit" />}
					/>
					<Typography variant="body2" sx={{ mt: 1 }}>
						{rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
					</Typography>
				</Box>
				
				<TextField
					fullWidth
					multiline
					rows={4}
					value={feedback}
					onChange={(e) => setFeedback(e.target.value)}
					placeholder="Write your feedback here..."
					variant="outlined"
					margin="normal"
				/>
				
				{error && (
					<Alert severity="error" sx={{ mt: 2 }}>
						{error}
					</Alert>
				)}
			</DialogContent>
			
			<DialogActions>
				<Button onClick={onClose} color="primary" disabled={loading}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					color="primary"
					variant="contained"
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : <Send />}
				>
					{loading ? "Submitting..." : "Submit"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FeedbackModal;
