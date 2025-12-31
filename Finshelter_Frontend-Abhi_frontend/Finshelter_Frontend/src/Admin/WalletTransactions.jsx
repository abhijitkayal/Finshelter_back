import React, { useState, useEffect } from "react";
import axios from "./utils/axiosConfig";
import {
	Box,
	Container,
	Typography,
	Card,
	CardHeader,
	CardContent,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Grid,
	Stack,
	Chip,
	Divider,
	Alert,
	CircularProgress,
	IconButton,
	Paper,
} from "@mui/material";
import {
	AccountBalance as BankIcon,
	Person as UserIcon,
	Payment as PaymentIcon,
	Description as ReceiptIcon,
	Close as CloseIcon,
} from "@mui/icons-material";

const WalletTransactions = () => {
	const [withdrawalRequests, setWithdrawalRequests] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [receiptDialog, setReceiptDialog] = useState(false);
	const [receiptDetails, setReceiptDetails] = useState({
		transferDate: "",
		remarks: "",
	});
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchWithdrawalRequests();
	}, []);

	const fetchWithdrawalRequests = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("adminToken");
			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/admin/withdrawal-requests",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setWithdrawalRequests(response.data);
			setError(null);
		} catch (error) {
			console.error("Error fetching withdrawal requests:", error);
			setError("Failed to fetch withdrawal requests. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleApproveRequest = (request) => {
		setSelectedRequest(request);
		setReceiptDialog(true);
	};

	const handleSubmitReceipt = async () => {
		if (!receiptDetails.transferDate || !receiptDetails.remarks) {
			setError("Please fill in all fields");
			return;
		}

		setLoading(true);
		try {
			const token = localStorage.getItem("adminToken");
			await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/admin/approve-withdrawal",
				{
					requestId: selectedRequest._id,
					userId: selectedRequest.userId,
					amount: selectedRequest.amount,
					receipt: receiptDetails,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setReceiptDialog(false);
			setSelectedRequest(null);
			setReceiptDetails({ transferDate: "", remarks: "" });
			fetchWithdrawalRequests();
		} catch (error) {
			console.error("Error approving withdrawal:", error);
			setError("Failed to process payment. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleCloseDialog = () => {
		setReceiptDialog(false);
		setError(null);
		setReceiptDetails({ transferDate: "", remarks: "" });
	};

	return (
		<Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
			<Paper elevation={3} sx={{ p: 3 }}>
				<Stack direction='row' alignItems='center' spacing={2} mb={3}>
					<PaymentIcon color='primary' fontSize='large' />
					<Typography variant='h5'>Withdrawal Requests</Typography>
				</Stack>

				{error && (
					<Alert severity='error' sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				{loading && !receiptDialog ? (
					<Box display='flex' justifyContent='center' p={4}>
						<CircularProgress />
					</Box>
				) : (
					<Grid container spacing={3}>
						{withdrawalRequests.map((request) => (
							<Grid item xs={12} sm={6} md={4} key={request._id}>
								<Card elevation={2}>
									<CardHeader
										avatar={<UserIcon color='primary' />}
										title={request.user?.name}
										subheader={`Request ID: ${request._id.slice(-6)}`}
									/>
									<Divider />
									<CardContent>
										<Stack spacing={2}>
											<Box>
												<Typography variant='h6' color='primary'>
													₹{request.amount.toLocaleString()}
												</Typography>
												<Chip
													label={request.status}
													color={
														request.status === "approved"
															? "success"
															: "warning"
													}
													size='small'
													sx={{ mt: 1 }}
												/>
											</Box>

											<Box>
												<Stack direction='row' alignItems='center' spacing={1}>
													<BankIcon fontSize='small' color='action' />
													<Typography variant='body2' color='text.secondary'>
														Bank Details
													</Typography>
												</Stack>
												<Typography variant='body2'>
													{request.user?.bankDetails?.bankName}
												</Typography>
												<Typography variant='caption' color='text.secondary'>
													Acc: {request.user?.bankDetails?.accountNumber}
												</Typography>
												<Typography
													variant='caption'
													display='block'
													color='text.secondary'>
													IFSC: {request.user?.bankDetails?.ifscCode}
												</Typography>
											</Box>

											<Button
												variant='contained'
												color='primary'
												fullWidth
												onClick={() => handleApproveRequest(request)}
												disabled={request.status === "approved"}
												startIcon={<PaymentIcon />}>
												{request.status === "approved"
													? "Processed"
													: "Process Payment"}
											</Button>
										</Stack>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				)}

				{!loading && withdrawalRequests.length === 0 && (
					<Box textAlign='center' p={4}>
						<Typography color='text.secondary'>
							No pending withdrawal requests
						</Typography>
					</Box>
				)}
			</Paper>

			<Dialog
				open={receiptDialog}
				onClose={handleCloseDialog}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>
					<Stack
						direction='row'
						justifyContent='space-between'
						alignItems='center'>
						<Stack direction='row' spacing={1} alignItems='center'>
							<ReceiptIcon color='primary' />
							<Typography variant='h6'>Process Payment</Typography>
						</Stack>
						<IconButton onClick={handleCloseDialog} size='small'>
							<CloseIcon />
						</IconButton>
					</Stack>
				</DialogTitle>

				<DialogContent>
					<Stack spacing={3} sx={{ mt: 2 }}>
						{selectedRequest && (
							<Alert severity='info' sx={{ mb: 2 }}>
								Processing payment of ₹{selectedRequest.amount} for{" "}
								{selectedRequest.user?.name}
							</Alert>
						)}

						<TextField
							fullWidth
							type='date'
							label='Transfer Date'
							InputLabelProps={{ shrink: true }}
							value={receiptDetails.transferDate}
							onChange={(e) =>
								setReceiptDetails({
									...receiptDetails,
									transferDate: e.target.value,
								})
							}
							required
						/>

						<TextField
							fullWidth
							multiline
							rows={3}
							label='Remarks'
							value={receiptDetails.remarks}
							onChange={(e) =>
								setReceiptDetails({
									...receiptDetails,
									remarks: e.target.value,
								})
							}
							required
							placeholder='Enter payment reference number or any other relevant details'
						/>
					</Stack>
				</DialogContent>

				<DialogActions sx={{ p: 2.5 }}>
					<Button onClick={handleCloseDialog} disabled={loading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmitReceipt}
						variant='contained'
						disabled={loading}
						startIcon={
							loading ? <CircularProgress size={20} /> : <PaymentIcon />
						}>
						{loading ? "Processing..." : "Submit Receipt"}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default WalletTransactions;
