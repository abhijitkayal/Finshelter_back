import React, { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCustomerAuth } from "../../Customer/CustomerAuthContext";
import { useNotification } from "../../NotificationContext";
import {
	Box,
	Container,
	Typography,
	Button,
	Grid,
	Card,
	CardContent,
	Divider,
	Paper,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { CheckCircle, Payment, ArrowBack } from "@mui/icons-material";

const PaymentPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, isLoggedIn } = useCustomerAuth();
	const { showNotification } = useNotification();
	const [loading, setLoading] = useState(false);
	const [processingPayment, setProcessingPayment] = useState(false);

	// If there's no state or user is not logged in, redirect
	if (!location.state || !location.state.service || !isLoggedIn) {
		return <Navigate to="/" replace />;
	}

	const { service, selectedPackage } = location.state;

	// Calculate pricing
	const basePrice = selectedPackage
		? selectedPackage.salePrice || selectedPackage.actualPrice
		: service.salePrice;

	const gstRate = service.gstRate || 18;
	const gstAmount = (basePrice * gstRate) / 100;
	const totalAmount = basePrice + gstAmount;

	const handlePayment = async () => {
		setProcessingPayment(true);
		try {
			// Get auth token
			const authToken = localStorage.getItem("customerToken");
			if (!authToken) {
				showNotification("Please login to continue", "error");
				navigate("/customer-login");
				return;
			}

			// Step 1: Create Razorpay order
			const paymentResponse = await axios.post(
				"http://localhost:8000/api/payment/create-order",
				{
					serviceId: service._id,
					serviceName: service.name,
					packageId: selectedPackage?._id,
					packageName: selectedPackage?.name,
					baseAmount: basePrice,
					gstAmount: gstAmount,
					totalAmount: totalAmount,
				},
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			);

			const { order, orderId } = paymentResponse?.data;

			if (!order || !orderId) {
				throw new Error("Failed to create payment order");
			}

			// Step 2: Initialize Razorpay
			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_brvO8EMMhXPsDD",
				amount: order.amount,
				currency: order.currency,
				name: "FinShelter",
				description: `Payment for ${service.name}${
					selectedPackage ? ` - ${selectedPackage.name}` : ""
				}`,
				order_id: order.id,
				prefill: {
					name: user?.name || "",
					email: user?.email || "",
					contact: user?.mobile || "",
				},
				theme: {
					color: "#1b321d",
				},
				handler: async function (response) {
					try {
						// Step 3: Verify payment
						const verifyResponse = await axios.post(
							"http://localhost:8000/api/payment/verify-payment",
							{
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature,
								orderId: orderId,
							},
							{
								headers: {
									Authorization: `Bearer ${authToken}`,
								},
							}
						);

						if (verifyResponse.data.success) {
							showNotification(
								"Payment successful! Opening message center for your service.",
								"success"
							);
							// Navigate to customer dashboard message center with order details
							navigate("/customer-dashboard", {
								state: { 
									initialSection: "Message Center",
									orderId: verifyResponse.data.orderId,
									serviceName: service.name
								}
							});
						}
					} catch (error) {
						console.error("Error verifying payment:", error);
						showNotification(
							error.response?.data?.message ||
								error.message ||
								"Payment verification failed",
							"error"
						);
					} finally {
						setProcessingPayment(false);
					}
				},
				modal: {
					ondismiss: function () {
						showNotification(
							"Payment cancelled. Please try again later.",
							"warning"
						);
						setProcessingPayment(false);
					},
				},
			};

			const rzp = new window.Razorpay(options);
			rzp.open();
		} catch (error) {
			console.error("Error initiating payment:", error);
			showNotification(
				error.response?.data?.message ||
					error.message ||
					"Failed to initiate payment",
				"error"
			);
			setProcessingPayment(false);
		}
	};

	return (
		<Box
			sx={{
				background: "linear-gradient(to bottom, #ffffff, #c6dbce)",
				minHeight: "100vh",
				pt: 4,
				pb: 8,
			}}>
			<Container maxWidth="lg">
				<Button
					startIcon={<ArrowBack />}
					onClick={() => navigate(-1)}
					sx={{
						mb: 3,
						color: "#1b321d",
						"&:hover": {
							backgroundColor: "rgba(27, 50, 29, 0.05)",
						},
					}}>
					Back
				</Button>

				<Paper
					elevation={3}
					sx={{
						p: 4,
						borderRadius: "16px",
						mb: 4,
					}}>
					<Typography
						variant="h4"
						gutterBottom
						sx={{
							color: "#1b321d",
							fontWeight: 700,
							mb: 3,
							textAlign: "center",
						}}>
						Complete Your Payment
					</Typography>

					<Grid container spacing={4}>
						{/* Service Details */}
						<Grid item xs={12} md={7}>
							<Card
								elevation={0}
								sx={{
									backgroundColor: "#f9fbf9",
									borderRadius: "12px",
									p: 3,
								}}>
								<Typography
									variant="h6"
									gutterBottom
									sx={{
										color: "#1b321d",
										fontWeight: 600,
										mb: 2,
									}}>
									Service Details
								</Typography>

								<List>
									<ListItem disableGutters>
										<ListItemText
											primary="Service"
											secondary={service.name}
											primaryTypographyProps={{
												fontWeight: 600,
												color: "text.secondary",
											}}
											secondaryTypographyProps={{
												fontSize: "1.1rem",
												color: "#1b321d",
											}}
										/>
									</ListItem>

									{selectedPackage && (
										<ListItem disableGutters>
											<ListItemText
												primary="Package"
												secondary={selectedPackage.name}
												primaryTypographyProps={{
													fontWeight: 600,
													color: "text.secondary",
												}}
												secondaryTypographyProps={{
													fontSize: "1.1rem",
													color: "#1b321d",
												}}
											/>
										</ListItem>
									)}

									{selectedPackage?.description && (
										<ListItem disableGutters>
											<ListItemText
												primary="Description"
												secondary={selectedPackage.description}
												primaryTypographyProps={{
													fontWeight: 600,
													color: "text.secondary",
												}}
											/>
										</ListItem>
									)}

									{selectedPackage?.features && (
										<ListItem disableGutters>
											<Box>
												<Typography
													variant="body2"
													color="text.secondary"
													fontWeight={600}
													gutterBottom>
													Features
												</Typography>
												<List dense>
													{selectedPackage.features.map((feature, index) => (
														<ListItem
															key={index}
															disableGutters
															sx={{ py: 0.5 }}>
															<CheckCircle
																sx={{
																	fontSize: "1rem",
																	color: "#1b321d",
																	mr: 1,
																}}
															/>
															<Typography variant="body2">
																{feature}
															</Typography>
														</ListItem>
													))}
												</List>
											</Box>
										</ListItem>
									)}
								</List>
							</Card>

							<Card
								elevation={0}
								sx={{
									backgroundColor: "#f9fbf9",
									borderRadius: "12px",
									p: 3,
									mt: 3,
								}}>
								<Typography
									variant="h6"
									gutterBottom
									sx={{
										color: "#1b321d",
										fontWeight: 600,
										mb: 2,
									}}>
									Customer Information
								</Typography>

								<List>
									<ListItem disableGutters>
										<ListItemText
											primary="Name"
											secondary={user?.name || ""}
											primaryTypographyProps={{
												fontWeight: 600,
												color: "text.secondary",
											}}
										/>
									</ListItem>
									<ListItem disableGutters>
										<ListItemText
											primary="Email"
											secondary={user?.email || ""}
											primaryTypographyProps={{
												fontWeight: 600,
												color: "text.secondary",
											}}
										/>
									</ListItem>
									<ListItem disableGutters>
										<ListItemText
											primary="Mobile"
											secondary={user?.mobile || ""}
											primaryTypographyProps={{
												fontWeight: 600,
												color: "text.secondary",
											}}
										/>
									</ListItem>
								</List>
							</Card>
						</Grid>

						{/* Payment Summary */}
						<Grid item xs={12} md={5}>
							<Card
								elevation={2}
								sx={{
									borderRadius: "12px",
									overflow: "hidden",
									border: "2px solid #1b321d",
								}}>
								<Box
									sx={{
										backgroundColor: "#1b321d",
										color: "white",
										p: 2,
									}}>
									<Typography variant="h6" fontWeight={600}>
										Payment Summary
									</Typography>
								</Box>

								<CardContent sx={{ p: 3 }}>
									<Box sx={{ mb: 2 }}>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												mb: 1,
											}}>
											<Typography>Base Price</Typography>
											<Typography fontWeight={600}>
												₹{basePrice.toFixed(2)}
											</Typography>
										</Box>

										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												mb: 1,
											}}>
											<Typography>GST ({gstRate}%)</Typography>
											<Typography fontWeight={600}>
												₹{gstAmount.toFixed(2)}
											</Typography>
										</Box>

										<Divider sx={{ my: 2 }} />

										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												mb: 2,
											}}>
											<Typography variant="h6" fontWeight={700}>
												Total Amount
											</Typography>
											<Typography
												variant="h6"
												fontWeight={700}
												color="#1b321d">
												₹{totalAmount.toFixed(2)}
											</Typography>
										</Box>
									</Box>

									<Button
										variant="contained"
										fullWidth
										size="large"
										onClick={handlePayment}
										disabled={processingPayment}
										startIcon={
											processingPayment ? (
												<CircularProgress size={20} color="inherit" />
											) : (
												<Payment />
											)
										}
										sx={{
											backgroundColor: "#1b321d",
											color: "white",
											py: 1.5,
											fontWeight: 600,
											fontSize: "1.1rem",
											"&:hover": {
												backgroundColor: "#2d4a2e",
											},
											"&:disabled": {
												backgroundColor: "#95b8a2",
											},
										}}>
										{processingPayment ? "Processing..." : "Pay Now"}
									</Button>

									<Typography
										variant="caption"
										sx={{
											display: "block",
											textAlign: "center",
											mt: 2,
											color: "text.secondary",
										}}>
										* Payment will be processed securely via Razorpay
									</Typography>

									<Typography
										variant="caption"
										sx={{
											display: "block",
											textAlign: "center",
											mt: 1,
											color: "text.secondary",
										}}>
										By proceeding, you agree to our Terms & Conditions
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Paper>
			</Container>
		</Box>
	);
};

export default PaymentPage;
