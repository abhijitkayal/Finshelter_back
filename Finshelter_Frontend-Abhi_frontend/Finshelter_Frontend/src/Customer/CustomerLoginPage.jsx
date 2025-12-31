import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./customer.css";
import { useCustomerAuth } from "./CustomerAuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "../Admin/utils/axiosConfig";
import {
	Box,
	Container,
	Paper,
	Typography,
	TextField,
	Button,
	Divider,
	InputAdornment,
	IconButton,
	useMediaQuery,
	CircularProgress,
	Stack,
	Modal,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./customer-login.css";

const CustomerLoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { login, googleLogin, forgotPassword, error } = useCustomerAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);

	// Forgot password states
	const [openForgotPassword, setOpenForgotPassword] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
	const [resetEmailSent, setResetEmailSent] = useState(false);

	const navigate = useNavigate();

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const { showNotification } = useNotification();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await login(email, password);

		if (response.success) {
			// Check if OTP verification is required
			if (response.requiresOTP) {
				showNotification(
					response.message || "OTP sent to your email",
					"success"
				);
				setTimeout(() => {
					setLoading(false);
					navigate('/verify-login-otp', { state: { email: response.email } });
				}, 1000);
			} else {
				// Direct login (legacy flow)
				showNotification(
					"Login successful! Redirecting to dashboard...",
					"success"
				);
				setTimeout(() => {
					setLoading(false);
					navigate(`/customers/dashboard/${email}`);
				}, 2000);
			}
		} else {
			showNotification(response.message || "Login failed. Please try again.", "error");
			setLoading(false);
		}
	};

	// Handle Google Sign-In success
	const handleGoogleLoginSuccess = async (credentialResponse) => {
		setGoogleLoading(true);

		try {
			const decoded = jwtDecode(credentialResponse.credential);
			console.log("Google user data:", decoded);

			// Extract user info from Google response
			const googleUserData = {
				name: decoded.name,
				email: decoded.email,
				googleId: decoded.sub,
				avatarUrl: decoded.picture,
			};

			// Use the context's googleLogin method
			const response = await googleLogin(googleUserData);

			if (response.success) {
				showNotification(
					"Google sign-in successful! Redirecting to dashboard...",
					"success"
				);

				// Navigate after successful login
				setTimeout(() => {
					navigate(`/customers/dashboard/${googleUserData.email}`);
				}, 1000);
			} else {
				throw new Error(response.message || "Google sign-in failed");
			}
		} catch (error) {
			console.error("Google login error:", error);

			let errorMessage = "Google sign-in failed. Please try again.";
			if (error.response?.data?.error) {
				errorMessage = `Google sign-in failed: ${error.response.data.error}`;
			} else if (error.response?.data?.message) {
				errorMessage = `Google sign-in failed: ${error.response.data.message}`;
			} else if (error.message) {
				errorMessage = error.message;
			}

			showNotification(errorMessage, "error");
		} finally {
			setGoogleLoading(false);
		}
	};

	// Handle Google Sign-In error
	const handleGoogleLoginError = () => {
		showNotification(
			"Google sign-in was unsuccessful. Please try again.",
			"error"
		);
	};

	// Handle forgot password modal open/close
	const handleOpenForgotPassword = () => {
		setOpenForgotPassword(true);
		setForgotEmail(email); // Pre-fill with the email from login form if available
		setResetEmailSent(false);
	};

	const handleCloseForgotPassword = () => {
		setOpenForgotPassword(false);
		// Reset state when closing the modal
		setForgotPasswordLoading(false);
		if (resetEmailSent) {
			setForgotEmail("");
			setResetEmailSent(false);
		}
	};

	// Handle forgot password submit
	const handleForgotPasswordSubmit = async () => {
		if (!forgotEmail || !forgotEmail.trim()) {
			showNotification("Please enter your email address", "error");
			return;
		}

		setForgotPasswordLoading(true);

		try {
			const response = await forgotPassword(forgotEmail);

			if (response.success) {
				setResetEmailSent(true);
				showNotification(response.message, "success");
			} else {
				showNotification(response.message, "error");
			}
		} catch (error) {
			showNotification(
				"Failed to send password reset email. Please try again.",
				"error"
			);
		} finally {
			setForgotPasswordLoading(false);
		}
	};

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<Box sx={{ mt: "128px", mb: 4 }} className='login-container'>
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
						{/* Left Side - Content */}
						<Box
							sx={{
								width: isMobile ? "100%" : "40%",
								bgcolor: "#17422d",
								p: 4,
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								position: "relative",
								backgroundImage:
									"linear-gradient(135deg, #17422d 0%, #1e5438 100%)",
							}}
							className='pattern-bg dark'>
							<Box
								sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
								<Typography
									variant='h3'
									component='h1'
									sx={{
										color: "#ffffff",
										fontWeight: 700,
										mb: 3,
										fontFamily: "'Playfair Display', serif",
									}}>
									Welcome Back
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
										style={{
											width: "100%",
											height: "auto",
											filter: "brightness(0) invert(1)",
										}}
										onError={(e) => {
											e.target.onerror = null;
											e.target.src =
												"https://img.icons8.com/fluency/96/tax.png";
											e.target.style.filter = "brightness(0) invert(1)";
										}}
									/>
								</Box>

								<Typography
									variant='h6'
									component='p'
									sx={{
										color: "#e0e0e0",
										fontWeight: 500,
										mb: 4,
										lineHeight: 1.6,
									}}>
									Simplify Tax. Secure Loans. Insure Life. Grow your wealth
								</Typography>

								<Stack spacing={2}>
									<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
										<Box sx={{ mr: 2, color: "#95b8a2" }}>
											<i className='fas fa-lock fa-lg'></i>
										</Box>
										<Typography variant='body1' sx={{ color: "#e0e0e0" }}>
											Secure access to your documents
										</Typography>
									</Box>

									<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
										<Box sx={{ mr: 2, color: "#95b8a2" }}>
											<i className='fas fa-chart-line fa-lg'></i>
										</Box>
										<Typography variant='body1' sx={{ color: "#e0e0e0" }}>
											Track your service progress
										</Typography>
									</Box>

									<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
										<Box sx={{ mr: 2, color: "#95b8a2" }}>
											<i className='fas fa-headset fa-lg'></i>
										</Box>
										<Typography variant='body1' sx={{ color: "#e0e0e0" }}>
											Direct communication with experts
										</Typography>
									</Box>
								</Stack>
							</Box>
						</Box>

						{/* Right Side - Login Form */}
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
								Login to Your Account
							</Typography>

							{error && (
								<Typography
									variant='body2'
									color='error'
									align='center'
									sx={{ mb: 2 }}>
									{error}
								</Typography>
							)}

							{/* Google Sign-In Button */}
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									mb: 3,
									position: "relative",
								}}>
								{googleLoading && (
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
								width={isMobile ? 300 : 400}
									text='signin_with'
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
									OR LOGIN WITH EMAIL
								</Typography>
								<Divider sx={{ flexGrow: 1 }} />
							</Box>

							<form onSubmit={handleSubmit}>
								<Box sx={{ mb: 3 }}>
									<TextField
										fullWidth
										label='Email Address'
										variant='outlined'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										placeholder='Enter your email address'
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<i className='fas fa-envelope'></i>
												</InputAdornment>
											),
										}}
									/>
								</Box>

								<Box sx={{ mb: 2 }}>
									<TextField
										fullWidth
										label='Password'
										variant='outlined'
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<i className='fas fa-lock'></i>
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton
														onClick={() => setShowPassword(!showPassword)}
														edge='end'>
														<i
															className={`fas ${
																showPassword ? "fa-eye-slash" : "fa-eye"
															}`}></i>
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								</Box>

								{/* Forgot Password Link */}
								<Box
									sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
									<Button
										onClick={handleOpenForgotPassword}
										sx={{
											textTransform: "none",
											color: "#3a5a40",
											p: 0,
											fontSize: "0.875rem",
											"&:hover": {
												backgroundColor: "transparent",
												textDecoration: "underline",
											},
										}}>
										Forgot Password?
									</Button>
								</Box>

								<Button
									type='submit'
									fullWidth
									variant='contained'
									size='large'
									disabled={loading}
									sx={{
										py: 1.5,
										bgcolor: "#95b8a2",
										"&:hover": {
											bgcolor: "#7a9985",
										},
									}}>
									{loading ? (
										<CircularProgress size={24} sx={{ color: "white" }} />
									) : (
										"Login"
									)}
								</Button>

								<Box sx={{ textAlign: "center", mt: 3 }}>
									<Typography variant='body2'>
										Don't have an account?{" "}
										<Button
											component='a'
											href='/register'
											sx={{
												textTransform: "none",
												color: "#3a5a40",
												fontWeight: "bold",
												p: 0,
												"&:hover": {
													bgcolor: "transparent",
													textDecoration: "underline",
												},
											}}>
											Register Now
										</Button>
									</Typography>
								</Box>
							</form>
						</Box>
					</Paper>
				</Container>
			</Box>

			{/* Forgot Password Dialog */}
			<Dialog
				open={openForgotPassword}
				onClose={handleCloseForgotPassword}
				maxWidth='sm'
				fullWidth>
				<DialogTitle
					sx={{
						bgcolor: "#f5f9f6",
						color: "#1e4a30",
						fontWeight: 600,
						borderBottom: "1px solid #e0e0e0",
					}}>
					{resetEmailSent ? "Password Reset Email Sent" : "Forgot Password"}
				</DialogTitle>
				<DialogContent sx={{ pt: 3, pb: 2, mt: 1 }}>
					{resetEmailSent ? (
						<DialogContentText>
							We've sent a password reset link to <strong>{forgotEmail}</strong>
							. Please check your email and follow the instructions to reset
							your password.
						</DialogContentText>
					) : (
						<>
							<DialogContentText sx={{ mb: 2 }}>
								Enter your email address and we'll send you a link to reset your
								password.
							</DialogContentText>
							<TextField
								autoFocus
								margin='dense'
								label='Email Address'
								type='email'
								fullWidth
								variant='outlined'
								value={forgotEmail}
								onChange={(e) => setForgotEmail(e.target.value)}
								required
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<i className='fas fa-envelope'></i>
										</InputAdornment>
									),
								}}
							/>
						</>
					)}
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button
						onClick={handleCloseForgotPassword}
						color='inherit'
						sx={{ color: "#666" }}>
						{resetEmailSent ? "Close" : "Cancel"}
					</Button>

					{!resetEmailSent && (
						<Button
							onClick={handleForgotPasswordSubmit}
							variant='contained'
							disabled={forgotPasswordLoading || !forgotEmail}
							sx={{
								bgcolor: "#95b8a2",
								"&:hover": {
									bgcolor: "#7a9985",
								},
							}}>
							{forgotPasswordLoading ? (
								<CircularProgress size={24} sx={{ color: "white" }} />
							) : (
								"Send Reset Link"
							)}
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</GoogleOAuthProvider>
	);
};

export default CustomerLoginPage;
