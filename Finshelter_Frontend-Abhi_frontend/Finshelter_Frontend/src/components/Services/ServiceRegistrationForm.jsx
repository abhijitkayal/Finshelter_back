// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useCustomerAuth } from "../../Customer/CustomerAuthContext";
// import { useNotification } from "../../NotificationContext";
// import {
// 	Box,
// 	Container,
// 	Typography,
// 	TextField,
// 	Button,
// 	Grid,
// 	Card,
// 	CardContent,
// 	Divider,
// 	Paper,
// 	CircularProgress,
// 	RadioGroup,
// 	Radio,
// 	FormControlLabel,
// 	Link,
// } from "@mui/material";
// import { CheckCircle, ArrowBack } from "@mui/icons-material";
// import "./services.css";

// const ServiceRegistrationForm = ({
// 	service,
// 	selectedPackage,
// 	isLeadService = false,
// }) => {
// 	const navigate = useNavigate();
// 	const { login, fetchCustomerDashboard } = useCustomerAuth();
// 	const { showNotification } = useNotification();
// 	const [loading, setLoading] = useState(false);

// 	const [customerDetails, setCustomerDetails] = useState({
// 		name: "",
// 		lastname: "",
// 		email: "",
// 		mobile: "",
// 		username: "",
// 		password: "",
// 		referralCode: "",
// 		message: "",
// 	});

// 	const handleChange = (e) => {
// 		setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
// 	};

// 	const handleRegisterAndPay = async () => {
// 		setLoading(true);
// 		try {
// 			// Field validation
// 			const { name, email, mobile, username, password } = customerDetails;
// 			if (!name || !email || !mobile || !username || !password) {
// 				showNotification("Please fill in all required fields.", "error");
// 				setLoading(false);
// 				return;
// 			}

// 			// Determine the price to use (either from selected package or service)
// 			const basePrice = selectedPackage
// 				? selectedPackage.salePrice || selectedPackage.actualPrice
// 				: service.salePrice;

// 			if (!basePrice) {
// 				showNotification("Service price details are missing.", "error");
// 				setLoading(false);
// 				return;
// 			}

// 			// Calculate GST amount
// 			const gstRate = service.gstRate || 18; // Use service's gstRate or default to 18%
// 			const gstAmount = (basePrice * gstRate) / 100;
// 			const totalAmount = basePrice + gstAmount;

// 			// Step 1: Try to register the user, if already exists, just login
// 			let authToken = null;
// 			let isNewUser = false;

// 			try {
// 				// Try to register first
// 				const registrationResponse = await axios.post(
// 					"http://localhost:8000/api/customers/user-register",
// 					{
// 						name: customerDetails.name,
// 						lastname: customerDetails.lastname,
// 						email: customerDetails.email,
// 						mobile: customerDetails.mobile,
// 						username: customerDetails.username,
// 						password: customerDetails.password,
// 						referralCode: customerDetails.referralCode,
// 						serviceId: service._id,
// 					}
// 				);
				
// 				isNewUser = true;
// 				console.log("New user registered successfully");
				
// 				// If registration succeeds, automatically log in using the returned token
// 				if (registrationResponse.data && registrationResponse.data.token) {
// 					localStorage.setItem('customerToken', registrationResponse.data.token);
// 					authToken = registrationResponse.data.token;
// 					console.log("Auto-login successful after registration");
// 				}
// 			} catch (registrationError) {
// 				// If user already exists (400 error), that's okay, we'll login
// 				if (registrationError.response?.status === 400) {
// 					console.log("User already exists, proceeding with login:", registrationError.response?.data?.message);
// 					isNewUser = false;
// 				} else {
// 					// If it's a different error, throw it
// 					console.error("Registration error:", registrationError);
// 					throw registrationError;
// 				}
// 			}

// 			// Step 2: Log in the user to get authentication token (only if not auto-logged in from registration)
// 			if (!authToken) {
// 				console.log("Attempting login with email:", customerDetails.email);
// 				const loginResponse = await login(
// 					customerDetails.email,
// 					customerDetails.password
// 				);
// 				if (!loginResponse.success) {
// 					console.error("Login failed:", loginResponse.message);
// 					throw new Error(`Login failed: ${loginResponse.message}. Please check your email and password, or contact support if you just registered.`);
// 				}
				
// 				// Get the token from localStorage (login function stores it as 'customerToken')
// 				authToken = localStorage.getItem('customerToken');
// 			}
			
// 			// Get the token from localStorage (login function stores it as 'customerToken')
// 			authToken = localStorage.getItem('customerToken');
// 			if (!authToken) {
// 				throw new Error("Authentication token not found. Please try logging in again.");
// 			}

// 			console.log("User authenticated successfully");

// 			// Step 3: Create Razorpay order using the new payment endpoint
// 			const paymentResponse = await axios.post(
// 				"http://localhost:8000/api/payment/create-order",
// 				{
// 					serviceId: service._id,
// 					serviceName: service.name,
// 					packageId: selectedPackage?._id,
// 					packageName: selectedPackage?.name,
// 					servicePrice: basePrice,
// 					discountAmount: 0,
// 					CGST: gstAmount / 2,
// 					SGST: gstAmount / 2,
// 					IGST: 0,
// 					totalAmount: totalAmount,
// 				},
// 				{
// 					headers: {
// 						Authorization: `Bearer ${authToken}`,
// 					},
// 				}
// 			);

// 			const { order, orderId } = paymentResponse?.data;
// 			console.log("Order created:", { order, orderId });

// 			// Validate Razorpay script
// 			if (typeof window.Razorpay === "undefined") {
// 				throw new Error("Razorpay script not loaded correctly");
// 			}

// 			// Step 4: Configure Razorpay options
// 			const options = {
// 				key: "rzp_test_brvO8EMMhXPsDD",
// 				amount: order.amount,
// 				currency: order.currency,
// 				name: "FinShelter",
// 				description: `${service?.name} ${
// 					selectedPackage ? `- ${selectedPackage.name}` : ""
// 				} (Incl. ${gstRate}% GST)`,
// 				order_id: order.id,
// 				prefill: {
// 					name: customerDetails.name,
// 					email: customerDetails.email,
// 					contact: customerDetails.mobile,
// 				},
// 				notes: {
// 					serviceId: service._id,
// 					gstRate: gstRate,
// 					gstAmount: gstAmount,
// 					basePrice: basePrice,
// 				},
// 				theme: {
// 					color: "#95b8a2",
// 				},
// 				modal: {
// 					ondismiss: function () {
// 						showNotification(
// 							"Payment cancelled. Please try again later.",
// 							"error"
// 						);
// 						setLoading(false);
// 					},
// 				},
// 				handler: async function (response) {
// 					try {
// 						// Step 5: Verify payment using the new verification endpoint
// 						await axios.post(
// 							"http://localhost:8000/api/payment/verify-payment",
// 							{
// 								razorpay_order_id: response.razorpay_order_id,
// 								razorpay_payment_id: response.razorpay_payment_id,
// 								razorpay_signature: response.razorpay_signature,
// 							},
// 							{
// 								headers: {
// 									Authorization: `Bearer ${authToken}`,
// 								},
// 							}
// 						);

// 						// Fetch customer dashboard data
// 						await fetchCustomerDashboard();

// 						showNotification(
// 							"Payment successful! Welcome to FinShelter.",
// 							"success"
// 						);
// 						navigate(`/customers/dashboard/${customerDetails.email}`);
// 					} catch (error) {
// 						console.error("Error verifying payment:", error);
// 						setLoading(false);
// 						showNotification(
// 							error.response?.data?.message || error.message || "Payment verification failed",
// 							"error"
// 						);
// 					}
// 				},
// 			};

// 			// Step 6: Initialize Razorpay
// 			const razorpay = new window.Razorpay(options);
// 			razorpay.open();
// 		} catch (error) {
// 			console.error("Error during registration or payment:", error);
// 			setLoading(false);
// 			showNotification(
// 				error.response?.data?.message || error.message || "An error occurred. Please try again.",
// 				"error"
// 			);
// 		}
// 	};

// 	const handleSubmitLead = async (e) => {
// 		e.preventDefault();
// 		setLoading(true);

// 		try {
// 			// Field validation
// 			const { name, email, mobile, message } = customerDetails;
// 			if (!name || !email || !mobile) {
// 				showNotification(
// 					"Please provide your name, email, and mobile number.",
// 					"error"
// 				);
// 				setLoading(false);
// 				return;
// 			}

// 			// Create lead
// 			await axios.post("http://localhost:8000/api/customers/lead", {
// 				name,
// 				email,
// 				mobile,
// 				serviceId: service._id,
// 				message:
// 					message ||
// 					`Interest in ${service.name} ${
// 						selectedPackage ? `- Package: ${selectedPackage.name}` : ""
// 					}`,
// 				source: "website",
// 			});

// 			showNotification(
// 				"Thank you for your interest! Our team will contact you soon.",
// 				"success"
// 			);
// 			setLoading(false);

// 			// Add a delay before navigation to allow users to see the notification
// 			setTimeout(() => {
// 				// Reset form and navigate back to service
// 				navigate(`/services/${service._id}`);
// 			}, 2500); // 2 second delay
// 		} catch (error) {
// 			console.error("Error submitting lead:", error);
// 			showNotification("An error occurred. Please try again.", "error");
// 			setLoading(false);
// 		}
// 	};

// 	const handleCancel = () => {
// 		navigate(`/services/${service._id}`);
// 	};

// 	return (
// 		<Container maxWidth='lg' sx={{ mb: 4 }}>
// 			{loading && (
// 				<Box
// 					sx={{
// 						position: "fixed",
// 						top: 0,
// 						left: 0,
// 						width: "100%",
// 						height: "100%",
// 						background: "rgba(27, 50, 29, 0.7)",
// 						display: "flex",
// 						justifyContent: "center",
// 						alignItems: "center",
// 						zIndex: 9999,
// 					}}>
// 					<CircularProgress size={60} sx={{ color: "#95b8a2" }} />
// 				</Box>
// 			)}

// 			<Button
// 				startIcon={<ArrowBack />}
// 				onClick={handleCancel}
// 				sx={{
// 					mb: 2,
// 					color: "#1b321d",
// 					borderColor: "#1b321d",
// 					"&:hover": {
// 						backgroundColor: "rgba(149, 184, 162, 0.1)",
// 						borderColor: "#1b321d",
// 					},
// 				}}
// 				variant='outlined'>
// 				Back to Service
// 			</Button>

// 			<Grid container spacing={4}>
// 				{/* Service Summary */}
// 				<Grid item xs={12} md={4}>
// 					<Card
// 						elevation={0}
// 						sx={{
// 							height: "100%",
// 							borderRadius: "16px",
// 							overflow: "hidden",
// 							border: "1px solid rgba(149, 184, 162, 0.3)",
// 							transition: "all 0.3s ease",
// 							boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
// 							background: "linear-gradient(145deg, #ffffff, #f5f9f7)",
// 						}}>
// 						<CardContent sx={{ p: 3 }}>
// 							<Typography
// 								variant='h5'
// 								gutterBottom
// 								sx={{
// 									color: "#1b321d",
// 									fontWeight: 700,
// 									pb: 1,
// 								}}>
// 								Service Summary
// 							</Typography>
// 							<Divider
// 								sx={{ mb: 2, borderColor: "rgba(149, 184, 162, 0.4)" }}
// 							/>

// 							<Typography
// 								variant='h6'
// 								gutterBottom
// 								sx={{ color: "#1b321d", fontWeight: 600 }}>
// 								{service?.name}
// 							</Typography>

// 							{selectedPackage ? (
// 								<>
// 									<Typography
// 										variant='subtitle1'
// 										gutterBottom
// 										sx={{
// 											color: "#1b321d",
// 											opacity: 0.9,
// 											fontWeight: 500,
// 											mb: 2,
// 										}}>
// 										Selected Package: {selectedPackage.name}
// 									</Typography>

// 									<Box sx={{ my: 2 }}>
// 										<Typography
// 											variant='h4'
// 											gutterBottom
// 											sx={{
// 												color: "#1b321d",
// 												fontWeight: 700,
// 											}}>
// 											₹{selectedPackage.salePrice}
// 											{selectedPackage.actualPrice &&
// 												selectedPackage.actualPrice >
// 													selectedPackage.salePrice && (
// 													<Typography
// 														component='span'
// 														sx={{
// 															textDecoration: "line-through",
// 															color: "text.secondary",
// 															fontSize: "1rem",
// 															ml: 1,
// 														}}>
// 														₹{selectedPackage.actualPrice}
// 													</Typography>
// 												)}
// 										</Typography>

// 										{/* GST Information */}
// 										<Box
// 											sx={{
// 												mt: 1,
// 												mb: 2,
// 												p: 2,
// 												bgcolor: "rgba(198, 219, 206, 0.2)",
// 												borderRadius: 2,
// 												border: "1px solid rgba(149, 184, 162, 0.2)",
// 											}}>
// 											<Typography
// 												variant='body2'
// 												sx={{
// 													display: "flex",
// 													justifyContent: "space-between",
// 													mb: 0.5,
// 												}}>
// 												<span>Base Price:</span>
// 												<span>₹{selectedPackage.salePrice}</span>
// 											</Typography>
// 											<Typography
// 												variant='body2'
// 												sx={{
// 													display: "flex",
// 													justifyContent: "space-between",
// 													mb: 0.5,
// 												}}>
// 												<span>GST ({service.gstRate || 18}%):</span>
// 												<span>
// 													₹
// 													{(
// 														(selectedPackage.salePrice *
// 															(service.gstRate || 18)) /
// 														100
// 													).toFixed(2)}
// 												</span>
// 											</Typography>
// 											<Divider
// 												sx={{ my: 1, borderColor: "rgba(149, 184, 162, 0.4)" }}
// 											/>
// 											<Typography
// 												variant='body1'
// 												fontWeight='bold'
// 												sx={{
// 													display: "flex",
// 													justifyContent: "space-between",
// 													color: "#1b321d",
// 												}}>
// 												<span>Total Amount:</span>
// 												<span>
// 													₹
// 													{(
// 														selectedPackage.salePrice +
// 														(selectedPackage.salePrice *
// 															(service.gstRate || 18)) /
// 															100
// 													).toFixed(2)}
// 												</span>
// 											</Typography>
// 										</Box>
// 									</Box>

// 									<Typography
// 										variant='subtitle2'
// 										gutterBottom
// 										sx={{
// 											color: "#1b321d",
// 											fontWeight: 600,
// 											mt: 3,
// 										}}>
// 										Features:
// 									</Typography>
// 									{selectedPackage.features &&
// 										selectedPackage.features.map((feature, idx) => (
// 											<Box
// 												key={idx}
// 												sx={{
// 													display: "flex",
// 													alignItems: "flex-start",
// 													mb: 1,
// 												}}>
// 												<CheckCircle
// 													sx={{
// 														fontSize: 16,
// 														color: "#1b321d",
// 														mr: 1,
// 														mt: 0.5,
// 													}}
// 												/>
// 												<Typography
// 													variant='body2'
// 													sx={{
// 														color: "#1b321d",
// 														opacity: 0.9,
// 													}}>
// 													{feature}
// 												</Typography>
// 											</Box>
// 										))}
// 								</>
// 							) : (
// 								<>
// 									<Typography variant='body1' sx={{ mb: 2 }}>
// 										{service?.description ||
// 											"Complete the form to register for this service."}
// 									</Typography>

// 									{service?.salePrice && (
// 										<Box
// 											sx={{
// 												mt: 2,
// 												mb: 2,
// 												p: 1.5,
// 												bgcolor: "background.paper",
// 												borderRadius: 1,
// 												border: "1px solid",
// 												borderColor: "divider",
// 											}}>
// 											<Typography
// 												variant='body2'
// 												sx={{
// 													display: "flex",
// 													justifyContent: "space-between",
// 													mb: 0.5,
// 												}}>
// 												<span>Base Price:</span>
// 												<span>₹{service.salePrice}</span>
// 											</Typography>
// 											<Typography
// 												variant='body2'
// 												sx={{
// 													display: "flex",
// 													justifyContent: "space-between",
// 													mb: 0.5,
// 												}}>
// 												<span>GST ({service.gstRate || 18}%):</span>
// 												<span>
// 													₹
// 													{(
// 														(service.salePrice * (service.gstRate || 18)) /
// 														100
// 													).toFixed(2)}
// 												</span>
// 											</Typography>
// 											<Divider sx={{ my: 1 }} />
// 											<Typography
// 												variant='body1'
// 												fontWeight='bold'
// 												sx={{
// 													display: "flex",
// 													justifyContent: "space-between",
// 												}}>
// 												<span>Total Amount:</span>
// 												<span>
// 													₹
// 													{(
// 														service.salePrice +
// 														(service.salePrice * (service.gstRate || 18)) / 100
// 													).toFixed(2)}
// 												</span>
// 											</Typography>
// 										</Box>
// 									)}
// 								</>
// 							)}

// 							{!isLeadService && (
// 								<Box sx={{ mt: 4 }}>
// 									<Typography
// 										variant='subtitle2'
// 										sx={{
// 											color: "#1b321d",
// 											opacity: 0.7,
// 											fontSize: "0.85rem",
// 											fontStyle: "italic",
// 										}}>
// 										* Payment will be processed securely via Razorpay
// 									</Typography>
// 								</Box>
// 							)}
// 						</CardContent>
// 					</Card>
// 				</Grid>

// 				{/* Registration Form */}
// 				<Grid item xs={12} md={8}>
// 					<Paper
// 						elevation={0}
// 						sx={{
// 							p: 4,
// 							borderRadius: "16px",
// 							border: "1px solid rgba(149, 184, 162, 0.3)",
// 							boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
// 							background: "#ffffff",
// 						}}>
// 						<Typography
// 							variant='h5'
// 							gutterBottom
// 							sx={{
// 								color: "#1b321d",
// 								fontWeight: 700,
// 							}}>
// 							{isLeadService
// 								? "Register Your Interest"
// 								: "Complete Registration"}
// 						</Typography>
// 						<Divider sx={{ mb: 3, borderColor: "rgba(149, 184, 162, 0.4)" }} />

// 						<Grid container spacing={2}>
// 							<Grid item xs={12} sm={6}>
// 								<TextField
// 									fullWidth
// 									label='First Name'
// 									name='name'
// 									value={customerDetails.name}
// 									onChange={handleChange}
// 									required
// 									margin='normal'
// 								/>
// 							</Grid>
// 							<Grid item xs={12} sm={6}>
// 								<TextField
// 									fullWidth
// 									label='Last Name'
// 									name='lastname'
// 									value={customerDetails.lastname}
// 									onChange={handleChange}
// 									margin='normal'
// 								/>
// 							</Grid>
// 							<Grid item xs={12} sm={6}>
// 								<TextField
// 									fullWidth
// 									label='Email'
// 									name='email'
// 									type='email'
// 									value={customerDetails.email}
// 									onChange={handleChange}
// 									required
// 									margin='normal'
// 								/>
// 							</Grid>
// 							<Grid item xs={12} sm={6}>
// 								<TextField
// 									fullWidth
// 									label='Mobile Number'
// 									name='mobile'
// 									value={customerDetails.mobile}
// 									onChange={handleChange}
// 									required
// 									margin='normal'
// 								/>
// 							</Grid>

// 							{!isLeadService && (
// 								<>
// 									<Grid item xs={12} sm={6}>
// 										<TextField
// 											fullWidth
// 											label='Username'
// 											name='username'
// 											value={customerDetails.username}
// 											onChange={handleChange}
// 											required
// 											margin='normal'
// 										/>
// 									</Grid>
// 									<Grid item xs={12} sm={6}>
// 										<TextField
// 											fullWidth
// 											label='Password'
// 											name='password'
// 											type='password'
// 											value={customerDetails.password}
// 											onChange={handleChange}
// 											required
// 											margin='normal'
// 										/>
// 									</Grid>
// 								</>
// 							)}

// 							<Grid item xs={12}>
// 								<TextField
// 									fullWidth
// 									label='Referral Code (Optional)'
// 									name='referralCode'
// 									value={customerDetails.referralCode}
// 									onChange={handleChange}
// 									margin='normal'
// 								/>
// 							</Grid>

// 							{isLeadService && (
// 								<Grid item xs={12}>
// 									<TextField
// 										fullWidth
// 										label='Message (Optional)'
// 										name='message'
// 										value={customerDetails.message}
// 										onChange={handleChange}
// 										multiline
// 										rows={4}
// 										margin='normal'
// 										placeholder='Tell us more about your requirements...'
// 									/>
// 								</Grid>
// 							)}
// 						</Grid>

// 						<Box
// 							sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
// 							<Button
// 								variant='outlined'
// 								onClick={handleCancel}
// 								size='large'
// 								sx={{
// 									borderColor: "#1b321d",
// 									color: "#1b321d",
// 									px: 3,
// 									"&:hover": {
// 										backgroundColor: "rgba(149, 184, 162, 0.1)",
// 										borderColor: "#1b321d",
// 									},
// 								}}>
// 								Cancel
// 							</Button>

// 							<Button
// 								variant='contained'
// 								size='large'
// 								onClick={
// 									isLeadService ? handleSubmitLead : handleRegisterAndPay
// 								}
// 								disabled={loading}
// 								sx={{
// 									bgcolor: "#1b321d",
// 									color: "#ffffff",
// 									px: 4,
// 									"&:hover": {
// 										bgcolor: "#28482d",
// 									},
// 									"&:disabled": {
// 										bgcolor: "rgba(27, 50, 29, 0.5)",
// 									},
// 								}}>
// 								{isLeadService ? "Submit Inquiry" : "Register & Pay"}
// 							</Button>
// 						</Box>

// 						<Box sx={{ mt: 3, textAlign: "center" }}>
// 							<Typography
// 								variant='body2'
// 								sx={{ color: "rgba(27, 50, 29, 0.7)" }}>
// 								By continuing, you agree to our{" "}
// 								<Link
// 									href='/terms'
// 									target='_blank'
// 									sx={{
// 										color: "#1b321d",
// 										fontWeight: 500,
// 										textDecoration: "none",
// 										borderBottom: "1px dashed",
// 										"&:hover": {
// 											color: "#28482d",
// 										},
// 									}}>
// 									Terms of Service
// 								</Link>{" "}
// 								and{" "}
// 								<Link
// 									href='/privacy'
// 									target='_blank'
// 									sx={{
// 										color: "#1b321d",
// 										fontWeight: 500,
// 										textDecoration: "none",
// 										borderBottom: "1px dashed",
// 										"&:hover": {
// 											color: "#28482d",
// 										},
// 									}}>
// 									Privacy Policy
// 								</Link>
// 							</Typography>
// 						</Box>
// 					</Paper>
// 				</Grid>
// 			</Grid>
// 		</Container>
// 	);
// };

// export default ServiceRegistrationForm;





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCustomerAuth } from "../../Customer/CustomerAuthContext";
import { useNotification } from "../../NotificationContext";
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Grid,
	Card,
	CardContent,
	Divider,
	Paper,
	CircularProgress,
	RadioGroup,
	Radio,
	FormControlLabel,
	Link,
} from "@mui/material";
import { CheckCircle, ArrowBack } from "@mui/icons-material";
import "./services.css";

const ServiceRegistrationForm = ({
	service,
	selectedPackage,
	isLeadService = false,
}) => {
	const navigate = useNavigate();
	const { login, fetchCustomerDashboard } = useCustomerAuth();
	const { showNotification } = useNotification();
	const [loading, setLoading] = useState(false);

	const [customerDetails, setCustomerDetails] = useState({
		name: "",
		lastname: "",
		email: "",
		mobile: "",
		username: "",
		password: "",
		referralCode: "",
		message: "",
	});

	const handleChange = (e) => {
		setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
	};

	const handleRegisterAndPay = async () => {
		setLoading(true);
		try {
			// Field validation
			const { name, email, mobile, username, password } = customerDetails;
			if (!name || !email || !mobile || !username || !password) {
				showNotification("Please fill in all required fields.", "error");
				setLoading(false);
				return;
			}

			// Determine the price to use (either from selected package or service)
			const basePrice = selectedPackage
				? selectedPackage.salePrice || selectedPackage.actualPrice
				: service.salePrice;

			if (!basePrice) {
				showNotification("Service price details are missing.", "error");
				setLoading(false);
				return;
			}

			// Calculate GST amount
			const gstRate = service.gstRate || 18; // Use service's gstRate or default to 18%
			const gstAmount = (basePrice * gstRate) / 100;
			const totalAmount = basePrice + gstAmount;

			// Step 1: Try to register the user, if already exists, just login
			let authToken = null;
			let isNewUser = false;

			try {
				// Try to register first
				const registrationResponse = await axios.post(
					"http://http://localhost:8000/api/customers/user-register",
					{
						name: customerDetails.name,
						lastname: customerDetails.lastname,
						email: customerDetails.email,
						mobile: customerDetails.mobile,
						username: customerDetails.username,
						password: customerDetails.password,
						referralCode: customerDetails.referralCode,
						serviceId: service._id,
					}
				);
				
				isNewUser = true;
				console.log("New user registered successfully");
				
				// If registration succeeds, automatically log in using the returned token
				if (registrationResponse.data && registrationResponse.data.token) {
					localStorage.setItem('customerToken', registrationResponse.data.token);
					authToken = registrationResponse.data.token;
					console.log("Auto-login successful after registration");
				}
			} catch (registrationError) {
				// If user already exists (400 error), that's okay, we'll login
				if (registrationError.response?.status === 400) {
					console.log("User already exists, proceeding with login:", registrationError.response?.data?.message);
					isNewUser = false;
				} else {
					// If it's a different error, throw it
					console.error("Registration error:", registrationError);
					throw registrationError;
				}
			}

			// Step 2: Log in the user to get authentication token (only if not auto-logged in from registration)
			if (!authToken) {
				console.log("Attempting login with email:", customerDetails.email);
				const loginResponse = await login(
					customerDetails.email,
					customerDetails.password
				);
				if (!loginResponse.success) {
					console.error("Login failed:", loginResponse.message);
					throw new Error(`Login failed: ${loginResponse.message}. Please check your email and password, or contact support if you just registered.`);
				}
				
				// Get the token from localStorage (login function stores it as 'customerToken')
				authToken = localStorage.getItem('customerToken');
			}
			
			// Get the token from localStorage (login function stores it as 'customerToken')
			authToken = localStorage.getItem('customerToken');
			if (!authToken) {
				throw new Error("Authentication token not found. Please try logging in again.");
			}

			console.log("User authenticated successfully");

			// Step 3: Create Razorpay order using the new payment endpoint
			const paymentResponse = await axios.post(
				"http://localhost:8000/api/payment/create-order",
				{
					serviceId: service._id,
					serviceName: service.name,
					packageId: selectedPackage?._id,
					packageName: selectedPackage?.name,
					servicePrice: basePrice,
					discountAmount: 0,
					CGST: gstAmount / 2,
					SGST: gstAmount / 2,
					IGST: 0,
					totalAmount: totalAmount,
				},
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			);

			const { order, orderId } = paymentResponse?.data;
			console.log("Order created:", { order, orderId });

			// Validate Razorpay script
			if (typeof window.Razorpay === "undefined") {
				throw new Error("Razorpay script not loaded correctly");
			}

			// Step 4: Configure Razorpay options
			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_brvO8EMMhXPsDD",
				amount: order.amount,
				currency: order.currency,
				name: "FinShelter",
				description: `${service?.name} ${
					selectedPackage ? `- ${selectedPackage.name}` : ""
				} (Incl. ${gstRate}% GST)`,
				order_id: order.id,
				prefill: {
					name: customerDetails.name,
					email: customerDetails.email,
					contact: customerDetails.mobile,
				},
				notes: {
					serviceId: service._id,
					gstRate: gstRate,
					gstAmount: gstAmount,
					basePrice: basePrice,
				},
				theme: {
					color: "#95b8a2",
				},
				modal: {
					ondismiss: function () {
						showNotification(
							"Payment cancelled. Please try again later.",
							"error"
						);
						setLoading(false);
					},
				},
				handler: async function (response) {
					try {
						// Step 5: Verify payment using the new verification endpoint
						await axios.post(
							"http://localhost:8000/api/payment/verify-payment",
							{
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature,
							},
							{
								headers: {
									Authorization: `Bearer ${authToken}`,
								},
							}
						);

						// Fetch customer dashboard data
						await fetchCustomerDashboard();

						showNotification(
							"Payment successful! Welcome to FinShelter.",
							"success"
						);
						navigate(`/customers/dashboard/${customerDetails.email}`);
					} catch (error) {
						console.error("Error verifying payment:", error);
						setLoading(false);
						showNotification(
							error.response?.data?.message || error.message || "Payment verification failed",
							"error"
						);
					}
				},
			};

			// Step 6: Initialize Razorpay
			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error) {
			console.error("Error during registration or payment:", error);
			setLoading(false);
			showNotification(
				error.response?.data?.message || error.message || "An error occurred. Please try again.",
				"error"
			);
		}
	};

	const handleSubmitLead = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Field validation
			const { name, email, mobile, message } = customerDetails;
			if (!name || !email || !mobile) {
				showNotification(
					"Please provide your name, email, and mobile number.",
					"error"
				);
				setLoading(false);
				return;
			}

			// Create lead
			await axios.post("http://localhost:8000/api/customers/lead", {
				name,
				email,
				mobile,
				serviceId: service._id,
				message:
					message ||
					`Interest in ${service.name} ${
						selectedPackage ? `- Package: ${selectedPackage.name}` : ""
					}`,
				source: "website",
			});

			showNotification(
				"Thank you for your interest! Our team will contact you soon.",
				"success"
			);
			setLoading(false);

			// Add a delay before navigation to allow users to see the notification
			setTimeout(() => {
				// Reset form and navigate back to service
				navigate(`/services/${service._id}`);
			}, 2500); // 2 second delay
		} catch (error) {
			console.error("Error submitting lead:", error);
			showNotification("An error occurred. Please try again.", "error");
			setLoading(false);
		}
	};

	const handleCancel = () => {
		navigate(`/services/${service._id}`);
	};

	return (
		<Container maxWidth='lg' sx={{ mb: 4 }}>
			{loading && (
				<Box
					sx={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						background: "rgba(27, 50, 29, 0.7)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 9999,
					}}>
					<CircularProgress size={60} sx={{ color: "#95b8a2" }} />
				</Box>
			)}

			<Button
				startIcon={<ArrowBack />}
				onClick={handleCancel}
				sx={{
					mb: 2,
					color: "#1b321d",
					borderColor: "#1b321d",
					"&:hover": {
						backgroundColor: "rgba(149, 184, 162, 0.1)",
						borderColor: "#1b321d",
					},
				}}
				variant='outlined'>
				Back to Service
			</Button>

			<Grid container spacing={4}>
				{/* Service Summary */}
				<Grid item xs={12} md={4}>
					<Card
						elevation={0}
						sx={{
							height: "100%",
							borderRadius: "16px",
							overflow: "hidden",
							border: "1px solid rgba(149, 184, 162, 0.3)",
							transition: "all 0.3s ease",
							boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
							background: "linear-gradient(145deg, #ffffff, #f5f9f7)",
						}}>
						<CardContent sx={{ p: 3 }}>
							<Typography
								variant='h5'
								gutterBottom
								sx={{
									color: "#1b321d",
									fontWeight: 700,
									pb: 1,
								}}>
								Service Summary
							</Typography>
							<Divider
								sx={{ mb: 2, borderColor: "rgba(149, 184, 162, 0.4)" }}
							/>

							<Typography
								variant='h6'
								gutterBottom
								sx={{ color: "#1b321d", fontWeight: 600 }}>
								{service?.name}
							</Typography>

							{selectedPackage ? (
								<>
									<Typography
										variant='subtitle1'
										gutterBottom
										sx={{
											color: "#1b321d",
											opacity: 0.9,
											fontWeight: 500,
											mb: 2,
										}}>
										Selected Package: {selectedPackage.name}
									</Typography>

									<Box sx={{ my: 2 }}>
										<Typography
											variant='h4'
											gutterBottom
											sx={{
												color: "#1b321d",
												fontWeight: 700,
											}}>
											₹{selectedPackage.salePrice}
											{selectedPackage.actualPrice &&
												selectedPackage.actualPrice >
													selectedPackage.salePrice && (
													<Typography
														component='span'
														sx={{
															textDecoration: "line-through",
															color: "text.secondary",
															fontSize: "1rem",
															ml: 1,
														}}>
														₹{selectedPackage.actualPrice}
													</Typography>
												)}
										</Typography>

										{/* GST Information */}
										<Box
											sx={{
												mt: 1,
												mb: 2,
												p: 2,
												bgcolor: "rgba(198, 219, 206, 0.2)",
												borderRadius: 2,
												border: "1px solid rgba(149, 184, 162, 0.2)",
											}}>
											<Typography
												variant='body2'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mb: 0.5,
												}}>
												<span>Base Price:</span>
												<span>₹{selectedPackage.salePrice}</span>
											</Typography>
											<Typography
												variant='body2'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mb: 0.5,
												}}>
												<span>GST ({service.gstRate || 18}%):</span>
												<span>
													₹
													{(
														(selectedPackage.salePrice *
															(service.gstRate || 18)) /
														100
													).toFixed(2)}
												</span>
											</Typography>
											<Divider
												sx={{ my: 1, borderColor: "rgba(149, 184, 162, 0.4)" }}
											/>
											<Typography
												variant='body1'
												fontWeight='bold'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													color: "#1b321d",
												}}>
												<span>Total Amount:</span>
												<span>
													₹
													{(
														selectedPackage.salePrice +
														(selectedPackage.salePrice *
															(service.gstRate || 18)) /
															100
													).toFixed(2)}
												</span>
											</Typography>
										</Box>
									</Box>

									<Typography
										variant='subtitle2'
										gutterBottom
										sx={{
											color: "#1b321d",
											fontWeight: 600,
											mt: 3,
										}}>
										Features:
									</Typography>
									{selectedPackage.features &&
										selectedPackage.features.map((feature, idx) => (
											<Box
												key={idx}
												sx={{
													display: "flex",
													alignItems: "flex-start",
													mb: 1,
												}}>
												<CheckCircle
													sx={{
														fontSize: 16,
														color: "#1b321d",
														mr: 1,
														mt: 0.5,
													}}
												/>
												<Typography
													variant='body2'
													sx={{
														color: "#1b321d",
														opacity: 0.9,
													}}>
													{feature}
												</Typography>
											</Box>
										))}
								</>
							) : (
								<>
									<Typography variant='body1' sx={{ mb: 2 }}>
										{service?.description ||
											"Complete the form to register for this service."}
									</Typography>

									{service?.salePrice && (
										<Box
											sx={{
												mt: 2,
												mb: 2,
												p: 1.5,
												bgcolor: "background.paper",
												borderRadius: 1,
												border: "1px solid",
												borderColor: "divider",
											}}>
											<Typography
												variant='body2'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mb: 0.5,
												}}>
												<span>Base Price:</span>
												<span>₹{service.salePrice}</span>
											</Typography>
											<Typography
												variant='body2'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mb: 0.5,
												}}>
												<span>GST ({service.gstRate || 18}%):</span>
												<span>
													₹
													{(
														(service.salePrice * (service.gstRate || 18)) /
														100
													).toFixed(2)}
												</span>
											</Typography>
											<Divider sx={{ my: 1 }} />
											<Typography
												variant='body1'
												fontWeight='bold'
												sx={{
													display: "flex",
													justifyContent: "space-between",
												}}>
												<span>Total Amount:</span>
												<span>
													₹
													{(
														service.salePrice +
														(service.salePrice * (service.gstRate || 18)) / 100
													).toFixed(2)}
												</span>
											</Typography>
										</Box>
									)}
								</>
							)}

							{!isLeadService && (
								<Box sx={{ mt: 4 }}>
									<Typography
										variant='subtitle2'
										sx={{
											color: "#1b321d",
											opacity: 0.7,
											fontSize: "0.85rem",
											fontStyle: "italic",
										}}>
										* Payment will be processed securely via Razorpay
									</Typography>
								</Box>
							)}
						</CardContent>
					</Card>
				</Grid>

				{/* Registration Form */}
				<Grid item xs={12} md={8}>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							borderRadius: "16px",
							border: "1px solid rgba(149, 184, 162, 0.3)",
							boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
							background: "#ffffff",
						}}>
						<Typography
							variant='h5'
							gutterBottom
							sx={{
								color: "#1b321d",
								fontWeight: 700,
							}}>
							{isLeadService
								? "Register Your Interest"
								: "Complete Registration"}
						</Typography>
						<Divider sx={{ mb: 3, borderColor: "rgba(149, 184, 162, 0.4)" }} />

						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='First Name'
									name='name'
									value={customerDetails.name}
									onChange={handleChange}
									required
									margin='normal'
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Last Name'
									name='lastname'
									value={customerDetails.lastname}
									onChange={handleChange}
									margin='normal'
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Email'
									name='email'
									type='email'
									value={customerDetails.email}
									onChange={handleChange}
									required
									margin='normal'
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Mobile Number'
									name='mobile'
									value={customerDetails.mobile}
									onChange={handleChange}
									required
									margin='normal'
								/>
							</Grid>

							{!isLeadService && (
								<>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Username'
											name='username'
											value={customerDetails.username}
											onChange={handleChange}
											required
											margin='normal'
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Password'
											name='password'
											type='password'
											value={customerDetails.password}
											onChange={handleChange}
											required
											margin='normal'
										/>
									</Grid>
								</>
							)}

							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Referral Code (Optional)'
									name='referralCode'
									value={customerDetails.referralCode}
									onChange={handleChange}
									margin='normal'
								/>
							</Grid>

							{isLeadService && (
								<Grid item xs={12}>
									<TextField
										fullWidth
										label='Message (Optional)'
										name='message'
										value={customerDetails.message}
										onChange={handleChange}
										multiline
										rows={4}
										margin='normal'
										placeholder='Tell us more about your requirements...'
									/>
								</Grid>
							)}
						</Grid>

						<Box
							sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
							<Button
								variant='outlined'
								onClick={handleCancel}
								size='large'
								sx={{
									borderColor: "#1b321d",
									color: "#1b321d",
									px: 3,
									"&:hover": {
										backgroundColor: "rgba(149, 184, 162, 0.1)",
										borderColor: "#1b321d",
									},
								}}>
								Cancel
							</Button>

							<Button
								variant='contained'
								size='large'
								onClick={
									isLeadService ? handleSubmitLead : handleRegisterAndPay
								}
								disabled={loading}
								sx={{
									bgcolor: "#1b321d",
									color: "#ffffff",
									px: 4,
									"&:hover": {
										bgcolor: "#28482d",
									},
									"&:disabled": {
										bgcolor: "rgba(27, 50, 29, 0.5)",
									},
								}}>
								{isLeadService ? "Submit Inquiry" : "Register & Pay"}
							</Button>
						</Box>

						<Box sx={{ mt: 3, textAlign: "center" }}>
							<Typography
								variant='body2'
								sx={{ color: "rgba(27, 50, 29, 0.7)" }}>
								By continuing, you agree to our{" "}
								<Link
									href='/terms'
									target='_blank'
									sx={{
										color: "#1b321d",
										fontWeight: 500,
										textDecoration: "none",
										borderBottom: "1px dashed",
										"&:hover": {
											color: "#28482d",
										},
									}}>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href='/privacy'
									target='_blank'
									sx={{
										color: "#1b321d",
										fontWeight: 500,
										textDecoration: "none",
										borderBottom: "1px dashed",
										"&:hover": {
											color: "#28482d",
										},
									}}>
									Privacy Policy
								</Link>
							</Typography>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};

export default ServiceRegistrationForm;
