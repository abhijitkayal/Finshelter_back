import React, { useState, useEffect } from "react";
import {
	Box,
	Container,
	Paper,
	Typography,
	TextField,
	Button,
	MenuItem,
	Grid,
	CircularProgress,
	Alert,
	Divider,
	useMediaQuery,
	Stack,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "@mui/material/styles";
import "./FlexiCustomerForm.css";

const FlexiCustomerForm = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [services, setServices] = useState([]);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		mobile: "",
		password: "",
		referralCode: "",
		leadSource: "flexfunneli",
	});
	const [error, setError] = useState("");
	const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	useEffect(() => {
		// Check for referral code in URL
		const urlParams = new URLSearchParams(window.location.search);
		const refCode = urlParams.get('ref');
		if (refCode) {
			setFormData(prev => ({
				...prev,
				referralCode: refCode
			}));
		}

		const fetchServices = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/api/customers/user-services"
				);
				setServices(response.data.services);
			} catch (error) {
				console.error("Error fetching services:", error);
			}
		};
		fetchServices();
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Frontend: FlexiCustomerForm component
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Validate required fields
			const requiredFields = ["name", "email", "mobile", "password"];
			const missingFields = requiredFields.filter((field) => !formData[field]);

			if (missingFields.length > 0) {
				throw new Error(
					`Please fill in all required fields: ${missingFields.join(", ")}`
				);
			}

			const response = await axios.post(
				"http://localhost:8000/api/customers/flexi-register",
				formData
			);

			if (response.data.email) {
				navigate(`/customers/dashboard/${response.data.email}`, {
					state: {
						message:
							"Registration successful! Our team will assign your service within 24 hours.",
						email: formData.email,
					},
				});
			}
		} catch (error) {
			console.error("Registration error:", error);
			setError(error.message || "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Handle Google Sign-In success
	const handleGoogleLoginSuccess = async (credentialResponse) => {
		setGoogleLoginLoading(true);
		setError("");

		try {
			const decoded = jwtDecode(credentialResponse.credential);
			console.log("Google user data:", decoded);

			// Extract user info from Google response
			const googleUserData = {
				name: decoded.name,
				email: decoded.email,
				googleId: decoded.sub, // Google's unique identifier
				avatarUrl: decoded.picture,
			};

			// Send Google data to backend
			const response = await axios.post(
				"http://localhost:8000/api/customers/google-register",
				googleUserData
			);

			// Check for successful response and redirect
			if (response.data.userId) {
				// Store the token in localStorage
				localStorage.setItem("token", response.data.token);

				navigate(`/customers/dashboard`, {
					state: {
						message: "Google sign-in successful! Welcome to Tax-Buddy.",
						email: googleUserData.email,
					},
				});
			}
		} catch (error) {
			console.error("Google login error:", error);

			// Show more detailed error message if available
			if (error.response?.data?.error) {
				setError(`Google sign-in failed: ${error.response.data.error}`);
			} else if (error.response?.data?.message) {
				setError(`Google sign-in failed: ${error.response.data.message}`);
			} else {
				setError(
					"Google sign-in failed. Please try again or use email registration."
				);
			}
		} finally {
			setGoogleLoginLoading(false);
		}
	};

	// Handle Google Sign-In error
	const handleGoogleLoginError = () => {
		setError(
			"Google sign-in was unsuccessful. Please try again or use email registration."
		);
	};

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<Box sx={{ mt: "128px", mb: 4 }} className='register-container'>
				<Container maxWidth='lg'>
					<Paper
						elevation={3}
						sx={{
							p: 0,
							borderRadius: 2,
							overflow: "hidden",
							display: "flex",
							flexDirection: isMobile ? "column" : "row",
						}}>
						{/* Left Side - Tax Image and Content */}
						<Box
							sx={{
								width: isMobile ? "100%" : "40%",
								bgcolor: "#f5f8f6",
								p: 4,
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								position: "relative",
								backgroundImage:
									"linear-gradient(135deg, #f5f8f6 0%, #e6f0e9 100%)",
							}}
							className='pattern-bg'>
							{/* Box removed - using CSS pattern-bg class instead */}

							<Box
								sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
								<Typography
									variant='h3'
									component='h1'
									sx={{
										color: "#3a5a40",
										fontWeight: 700,
										mb: 3,
										fontFamily: "'Playfair Display', serif",
									}}>
									Welcome to FinShelter
								</Typography>

								<Box
									sx={{
										width: "100px",
										height: "100px",
										margin: "0 auto",
										display: "flex",
										justifyContent: "center",
										mb: 3,
									}}>
									<img
										src='/images/tax-icon.png'
										alt='Tax Planning Icon'
										style={{ width: "100%", height: "auto" }}
										onError={(e) => {
											e.target.onerror = null;
											e.target.src =
												"https://img.icons8.com/fluency/96/tax.png";
										}}
									/>
								</Box>

								<Typography
									variant='h6'
									component='p'
									sx={{
										color: "#3a5a40",
										fontWeight: 500, 
										mb: 4,
										lineHeight: 1.6,
									}}>
									Simplify Tax. Secure Loans. Insure Life. Grow your wealth
								</Typography>

								<Stack spacing={2}>
									<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
										<Box sx={{ mr: 2, color: "#95b8a2" }}>
											<i className='fas fa-check-circle fa-lg'></i>
										</Box>
										<Typography variant='body1' sx={{ color: "#333" }}>
											Expert tax consultants available 24/7
										</Typography>
									</Box>

									<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
										<Box sx={{ mr: 2, color: "#95b8a2" }}>
											<i className='fas fa-check-circle fa-lg'></i>
										</Box>
										<Typography variant='body1' sx={{ color: "#333" }}>
											Secure & confidential handling of all documents
										</Typography>
									</Box>

									<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
										<Box sx={{ mr: 2, color: "#95b8a2" }}>
											<i className='fas fa-check-circle fa-lg'></i>
										</Box>
										<Typography variant='body1' sx={{ color: "#333" }}>
											Maximum deductions guaranteed
										</Typography>
									</Box>
								</Stack>
							</Box>
						</Box>

						{/* Right Side - Form */}
						<Box
							sx={{
								width: isMobile ? "100%" : "60%",
								p: 4,
							}}>
							<Typography
								variant='h4'
								gutterBottom
								align='center'
								sx={{ mb: 4 }}>
								Register Today
							</Typography>

							<Typography variant='body1' sx={{ mb: 3 }} align='center'>
								Please fill in your details to complete the registration process
							</Typography>

							{error && (
								<Alert severity='error' sx={{ mb: 3 }}>
									{error}
								</Alert>
							)}

							{/* Google Sign-In Button */}
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									mb: 3,
									position: "relative",
								}}>
								{googleLoginLoading && (
									<Box
										sx={{
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											backgroundColor: "rgba(255, 255, 255, 0.7)",
											zIndex: 1,
											borderRadius: 1,
										}}>
										<CircularProgress size={24} />
									</Box>
								)}
								<GoogleLogin
									onSuccess={handleGoogleLoginSuccess}
									onError={handleGoogleLoginError}
									size='large'
									width='100%'
									text='continue_with'
									shape='rectangular'
									logo_alignment='center'
								/>
							</Box>

							{/* Divider between Google and traditional sign-in */}
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									mb: 3,
									mt: 3,
								}}>
								<Divider sx={{ flexGrow: 1 }} />
								<Typography
									variant='body2'
									sx={{
										mx: 2,
										color: "text.secondary",
										fontWeight: 500,
									}}>
									OR REGISTER WITH EMAIL
								</Typography>
								<Divider sx={{ flexGrow: 1 }} />
							</Box>

							<form onSubmit={handleSubmit}>
								<Grid container spacing={3}>
									<Grid item xs={12} sm={6}>
										<TextField
											required
											fullWidth
											label='Full Name'
											name='name'
											value={formData.name}
											onChange={handleChange}
										/>
									</Grid>

									<Grid item xs={12} sm={6}>
										<TextField
											required
											fullWidth
											label='Email'
											name='email'
											type='email'
											value={formData.email}
											onChange={handleChange}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											required
											fullWidth
											label='Password'
											name='password'
											type='password'
											value={formData.password}
											onChange={handleChange}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											required
											fullWidth
											label='Mobile Number'
											name='mobile'
											value={formData.mobile}
											onChange={handleChange}
										/>
									</Grid>

									<Grid item xs={12}>									<TextField
										fullWidth
										label='Referral Code (Optional)'
										name='referralCode'
										value={formData.referralCode}
										onChange={handleChange}
										placeholder='Enter referral code if you have one'
										helperText='Get special benefits by using a referral code'
										InputProps={{
											startAdornment: (
												<Box sx={{ mr: 1, color: '#95b8a2' }}>
													<i className='fas fa-gift'></i>
												</Box>
											),
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&.Mui-focused fieldset': {
													borderColor: '#95b8a2',
												},
											},
											'& .MuiFormHelperText-root': {
												color: '#666',
											},
										}}
									/>
								</Grid>

								<Grid item xs={12}>								
									<Button
											type='submit'
											fullWidth
											variant='contained'
											size='large'
											disabled={loading}
											sx={{
												mt: 2,
												bgcolor: "#95b8a2",
												"&:hover": {
													bgcolor: "#7a9985",
												},
											}}>
											{loading ? (
												<CircularProgress size={24} sx={{ color: "white" }} />
											) : (
												"Register"
											)}
										</Button>
									</Grid>
								</Grid>
							</form>
							<p style={{ textAlign: "center", marginTop: "20px" }}>
								Already Have An Account?
								<NavLink to='/customers/login' style={{ marginLeft: "10px" }}>
									Login
								</NavLink>
							</p>
						</Box>
					</Paper>
				</Container>
			</Box>
		</GoogleOAuthProvider>
	);
};

export default FlexiCustomerForm;
