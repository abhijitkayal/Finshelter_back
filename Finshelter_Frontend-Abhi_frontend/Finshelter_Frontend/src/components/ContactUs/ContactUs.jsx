import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Container,
	Typography,
	Grid,
	TextField,
	Button,
	Paper,
	Card,
	CardContent,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	IconButton,
	Divider,
	useMediaQuery,
	Snackbar,
	Alert,
	CircularProgress,
} from "@mui/material";
import {
	ThemeProvider,
	createTheme,
	styled,
	alpha,
} from "@mui/material/styles";
import { motion } from "framer-motion";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./contact.css";

// Theme configuration with updated colors matching the site
const theme = createTheme({
	palette: {
		primary: {
			main: "#1b321d", // Dark green
			light: "#2C6040", // Lighter green for hover states
		},
		secondary: {
			main: "#ff4081", // Pink color
		},
		background: {
			default: "#ffffff",
			paper: "#ffffff",
			light: "#f5f9f6", // Very light green background
			alternate: "#f5f5f5", // Light gray for alternating sections
		},
		accent: {
			main: "#8cc63f", // Green accent color
			light: "#c6dbce", // Light green
		},
		text: {
			primary: "#333333",
			secondary: "#666666",
		},
	},
	typography: {
		fontFamily: "'Poppins', 'Roboto', sans-serif",
		h1: {
			fontWeight: 700,
			fontSize: "2.5rem",
			"@media (max-width:600px)": {
				fontSize: "1.8rem",
			},
		},
		h2: {
			fontWeight: 700,
			fontSize: "2.2rem",
			"@media (max-width:600px)": {
				fontSize: "1.6rem",
			},
		},
		h3: {
			fontWeight: 600,
			fontSize: "2rem",
			"@media (max-width:600px)": {
				fontSize: "1.5rem",
			},
		},
		h4: {
			fontWeight: 600,
			fontSize: "1.5rem",
			"@media (max-width:600px)": {
				fontSize: "1.2rem",
			},
		},
		body1: {
			fontSize: "1.1rem",
			lineHeight: 1.7,
			"@media (max-width:600px)": {
				fontSize: "0.95rem",
				lineHeight: 1.6,
			},
		},
		button: {
			textTransform: "none",
			fontWeight: 600,
		},
	},
});

// Styled Components
const StyledButton = styled(Button)(({ theme }) => ({
	borderRadius: "4px",
	padding: "12px 24px",
	textTransform: "uppercase",
	fontSize: "0.95rem",
	fontWeight: 600,
	letterSpacing: "0.5px",
	width: 'auto',
	[theme.breakpoints.down("sm")]: {
		padding: "10px 20px",
		fontSize: "0.85rem",
		width: '100%', // Full width on mobile
	},
}));

const AnimatedContactCard = styled(Card)(({ theme }) => ({
	height: "100%",
	display: "flex",
	flexDirection: "column",
	boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	borderRadius: "12px",
	border: "1px solid #eaeaea",
	overflow: "hidden",
	position: "relative",
	"&:hover": {
		transform: "translateY(-8px)",
		boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
		"&::before": {
			opacity: 1,
		},
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "5px",
		background: "linear-gradient(to right, #1b321d, #8cc63f)",
		opacity: 0.8,
		transition: "opacity 0.3s ease",
	},
}));

const IconCircle = styled(Box)(({ theme }) => ({
	width: "70px",
	height: "70px",
	borderRadius: "50%",
	backgroundColor: alpha(theme.palette.primary.main, 0.1),
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	marginBottom: "1.5rem",
	transition: "all 0.3s ease",
	"& svg": {
		fontSize: "32px",
		color: theme.palette.primary.main,
		transition: "all 0.3s ease",
	},
	"&:hover": {
		backgroundColor: theme.palette.primary.main,
		transform: "scale(1.1)",
		"& svg": {
			color: "#ffffff",
		},
	},
}));

const FormPaper = styled(Paper)(({ theme }) => ({
	borderRadius: "15px",
	padding: theme.spacing(4),
	boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
	position: "relative",
	overflow: "hidden",
	[theme.breakpoints.down("sm")]: {
		padding: theme.spacing(3, 2),
		boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
	},
	"&::after": {
		content: '""',
		position: "absolute",
		top: 0,
		right: 0,
		width: "150px",
		height: "150px",
		background: `linear-gradient(135deg, ${alpha(
			theme.palette.accent.main,
			0.15
		)}, transparent)`,
		borderRadius: "0 0 0 100%",
		zIndex: 0,
	},
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	[theme.breakpoints.down("sm")]: {
		marginBottom: theme.spacing(2),
	},
	"& .MuiOutlinedInput-root": {
		borderRadius: "8px",
		"& fieldset": {
			borderColor: "#e0e0e0",
		},
		"&:hover fieldset": {
			borderColor: theme.palette.primary.light,
		},
		"&.Mui-focused fieldset": {
			borderColor: theme.palette.primary.main,
		},
	},
}));

const MapContainer = styled(Box)(({ theme }) => ({
	height: "500px",
	width: "100%",
	borderRadius: "15px",
	overflow: "hidden",
	boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
	position: "relative",
	[theme.breakpoints.down("sm")]: {
		height: "300px", // Shorter height on mobile
		borderRadius: "10px",
		boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "5px",
		background: "linear-gradient(to right, #1b321d, #8cc63f)",
		opacity: 0.8,
		zIndex: 2,
	},
}));

const ContactUs = () => {
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	
	// Form state
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "General Inquiry", // Default subject
		message: "",
	});
	
	// Form submission states
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState({
		success: false,
		message: "",
		open: false
	});

	// Form validation state
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		
		// Clear errors when user types
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: null
			});
		}
	};

	// Validate form fields
	const validateForm = () => {
		const newErrors = {};
		
		// Validate name
		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}
		
		// Validate email
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}
		
		// Validate phone (optional but must be valid if provided)
		if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
			newErrors.phone = "Please enter a valid 10-digit phone number";
		}
		
		// Validate subject
		if (!formData.subject) {
			newErrors.subject = "Please select a subject";
		}
		
		// Validate message
		if (!formData.message.trim()) {
			newErrors.message = "Message is required";
		} else if (formData.message.trim().length < 10) {
			newErrors.message = "Message must be at least 10 characters";
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Validate form
		if (!validateForm()) {
			return;
		}
		
		setIsSubmitting(true);
		
		try {
			// Send data to backend API
			const response = await axios.post('http://localhost:8000/api/contact', formData);
			
			// Show success message
			setSubmitStatus({
				success: true,
				message: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
				open: true
			});
			
			// Reset form after submission
			setFormData({
				name: "",
				email: "",
				phone: "",
				subject: "General Inquiry",
				message: "",
			});
		} catch (error) {
			// Show error message
			setSubmitStatus({
				success: false,
				message: error.response?.data?.message || "Something went wrong. Please try again later.",
				open: true
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCloseSnackbar = () => {
		setSubmitStatus(prev => ({
			...prev,
			open: false
		}));
	};

	// Animation variants for Framer Motion
	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	const staggerChildren = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
			},
		},
	};

	return (
		<ThemeProvider theme={theme}>
			<Box className='contact-page'>
				{/* Hero Section with background */}
				<Box
					sx={{
						backgroundColor: "background.light",
						pt: { xs: 16, sm: 10, md: 16 },
						pb: { xs: 4, sm: 5, md: 6 },
						position: "relative",
						overflow: "hidden",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundImage: "url('/images/sec7banner.jpg')",
							backgroundSize: "cover",
							backgroundPosition: "center",
							opacity: 0.15,
							zIndex: 0,
						},
					}}>
					<Container maxWidth='xl'>
						<Grid container spacing={3} alignItems='center'>
							<Grid
								item
								xs={12}
								md={6}
								sx={{ 
									position: "relative", 
									zIndex: 2,
									textAlign: { xs: 'center', md: 'left' }
								}}>
								<Typography
									variant='h2'
									component='h1'
									sx={{
										fontWeight: 700,
										fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
										color: "primary.main",
										mb: 2,
										position: "relative",
										"&::after": {
											content: '""',
											position: "absolute",
											bottom: -10,
											left: { xs: '50%', md: 0 },
											transform: { xs: 'translateX(-50%)', md: 'none' },
											width: "80px",
											height: "4px",
											background: "linear-gradient(to right, #1b321d, #8cc63f)",
										},
									}}>
									Get In Touch
								</Typography>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 500,
										mb: 3,
										color: "text.secondary",
										fontSize: { xs: '1.25rem', md: '1.5rem' }
									}}>
									We're here to help and answer any questions
								</Typography>
								<Typography
									variant='body1'
									paragraph
									sx={{
										fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.1rem' },
										lineHeight: 1.7,
										mb: 4,
										maxWidth: { xs: '100%', md: "600px" },
										color: "text.primary",
									}}>
									Whether you need help with our services, have inquiries about
									our solutions, or just want to say hello, our team is ready to
									hear from you.
								</Typography>
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								sx={{
									position: "relative",
									zIndex: 2,
									display: { xs: "none", md: "block" },
								}}>
								{/* Decorative element */}
								<Box
									component='img'
									src='/images/sec7img.png'
									alt='Contact Illustration'
									sx={{
										width: "100%",
										maxWidth: "450px",
										display: "block",
										margin: "0 auto",
									}}
								/>
							</Grid>
						</Grid>
					</Container>
				</Box>

				{/* Contact Info Cards with Animations */}
				<Container
					maxWidth='xl'
					sx={{ py: { xs: 5, md: 8 }, position: "relative", zIndex: 1 }}>
					<Box
						component={motion.div}
						initial='hidden'
						animate='visible'
						variants={staggerChildren}>
						<Grid container spacing={{ xs: 3, md: 4 }} justifyContent='center'>
							<Grid item xs={12} sm={6} md={4}>
								<Box component={motion.div} variants={fadeInUp}>
									<AnimatedContactCard style={{ minHeight: { xs: "auto", md: "322px" }}}>
										<CardContent sx={{ textAlign: "center", p: { xs: 3, md: 4 } }}>
											<IconCircle
												component={motion.div}
												whileHover={{ rotate: 15 }}
												sx={{ margin: "0 auto 1.5rem" }}>
												<CallIcon />
											</IconCircle>
											<Typography
												variant='h5'
												sx={{ 
													fontWeight: 600, 
													mb: 2, 
													color: "primary.main",
													fontSize: { xs: '1.25rem', md: '1.5rem' }
												}}>
												Call Us
											</Typography>
											<Typography
												variant='body1'
												sx={{ mb: 2, color: "text.secondary" }}>
												Our customer service team is available to help you
											</Typography>
											<Typography
												variant='h6'
												sx={{ fontWeight: 500, color: "primary.main" }}>
												+91 95376 01955
											</Typography>
											<Box
												sx={{
													mt: 2,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}>
												{/* <AccessTimeIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} /> */}
												{/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Mon-Fri: 9:00 AM - 6:00 PM
                        </Typography> */}
											</Box>
										</CardContent>
									</AnimatedContactCard>
								</Box>
							</Grid>

							<Grid item xs={12} sm={6} md={4}>
								<Box component={motion.div} variants={fadeInUp}>
									<AnimatedContactCard style={{ minHeight: { xs: "auto", md: "322px" }}}>
										<CardContent sx={{ textAlign: "center", p: { xs: 3, md: 4 } }}>
											<IconCircle
												component={motion.div}
												whileHover={{ scale: 1.1 }}
												sx={{ margin: "0 auto 1.5rem" }}>
												<EmailIcon />
											</IconCircle>
											<Typography
												variant='h5'
												sx={{ 
													fontWeight: 600, 
													mb: 2, 
													color: "primary.main",
													fontSize: { xs: '1.25rem', md: '1.5rem' }
												}}>
												Email Us
											</Typography>
											<Typography
												variant='body1'
												sx={{ mb: 2, color: "text.secondary" }}>
												Send us an email and we'll get back to your query as
												soon as possible
											</Typography>
											<Typography
												variant='h6'
												sx={{ fontWeight: 500, color: "primary.main" }}>
												Info@thefinshelter.com
											</Typography>
										</CardContent>
									</AnimatedContactCard>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Container>

				{/* Contact Form Section */}
				<Box sx={{ backgroundColor: "background.light", py: { xs: 5, md: 8 } }}>
					<Container maxWidth='xl'>
						<Grid container spacing={{ xs: 4, md: 6 }} alignItems='center'>
							<Grid item xs={12} md={5}>
								<Box
									component={motion.div}
									initial={{ opacity: 0, x: -50 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: 0.2 }}
									sx={{ textAlign: { xs: 'center', md: 'left' } }}>
									<Typography
										variant='h3'
										sx={{
											fontWeight: 700,
											mb: 3,
											color: "primary.main",
											position: "relative",
											display: "inline-block",
											paddingBottom: "15px",
											fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
											"&::after": {
												content: '""',
												position: "absolute",
												bottom: 0,
												left: { xs: '50%', md: 0 },
												transform: { xs: 'translateX(-50%)', md: 'none' },
												width: "80px",
												height: "3px",
												background:
													"linear-gradient(to right, #1b321d 30%, #8cc63f 100%)",
											},
										}}>
										Send Us A Message
									</Typography>

									<Typography
										variant='body1'
										paragraph
										sx={{ mb: 4, color: "text.secondary" }}>
										Have questions or need assistance? Fill out the form, and
										one of our team members will be in touch shortly.
									</Typography>

									<Box sx={{ mb: 4 }}>
										<Typography
											variant='h6'
											sx={{ 
												fontWeight: 600, 
												mb: 2, 
												color: "primary.main",
												fontSize: { xs: '1.1rem', md: '1.25rem' }
											}}>
												Why Contact Us?
											</Typography>

											{[
												"Get expert financial advice",
												"Fast and reliable customer support",
												"Schedule a consultation",
												"Learn more about our services",
											].map((item, index) => (
												<Box
													key={index}
													sx={{ 
														display: "flex", 
														alignItems: "center", 
														mb: 2,
														justifyContent: { xs: 'center', md: 'flex-start' }
													}}>
														<Box
															component={motion.div}
															whileHover={{ scale: 1.2, rotate: 180 }}
															transition={{ duration: 0.3 }}
															sx={{
																width: "24px",
																height: "24px",
																borderRadius: "50%",
																backgroundColor: "accent.main",
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																mr: 2,
															}}>
																<Typography
																	variant='body2'
																	sx={{ color: "#fff", fontWeight: "bold" }}>
																	✓
																</Typography>
															</Box>
															<Typography variant='body1'>{item}</Typography>
														</Box>
													))}
											</Box>
										</Box>
									</Grid>

									<Grid item xs={12} md={7}>
										<Box
											component={motion.div}
											initial={{ opacity: 0, y: 50 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.5 }}>
											<FormPaper elevation={0}>
												<form onSubmit={handleSubmit}>
													<Grid container spacing={{ xs: 2, md: 3 }}>
														<Grid item xs={12} md={6}>
															<StyledTextField
																label='Full Name'
																name='name'
																variant='outlined'
																fullWidth
																required
																value={formData.name}
																onChange={handleChange}
																error={!!errors.name}
																helperText={errors.name}
															/>
														</Grid>
														<Grid item xs={12} md={6}>
															<StyledTextField
																label='Email Address'
																name='email'
																type='email'
																variant='outlined'
																fullWidth
																required
																value={formData.email}
																onChange={handleChange}
																error={!!errors.email}
																helperText={errors.email}
															/>
														</Grid>
														<Grid item xs={12} md={6}>
															<StyledTextField
																label='Phone Number'
																name='phone'
																variant='outlined'
																fullWidth
																value={formData.phone}
																onChange={handleChange}
																error={!!errors.phone}
																helperText={errors.phone}
															/>
														</Grid>
														<Grid item xs={12} md={6}>
															<FormControl
																fullWidth
																variant='outlined'
																sx={{ mb: { xs: 2, md: 3 } }}
																error={!!errors.subject}
															>
																<InputLabel id='subject-label'>Subject</InputLabel>
																<Select
																	labelId='subject-label'
																	name='subject'
																	value={formData.subject}
																	onChange={handleChange}
																	label='Subject'
																	sx={{ borderRadius: "8px" }}>
																	<MenuItem value='General Inquiry'>
																		General Inquiry
																	</MenuItem>
																	<MenuItem value='Investment Consultation'>
																		Investment Consultation
																	</MenuItem>
																	<MenuItem value='Tax Services'>
																		Tax Services
																	</MenuItem>
																	<MenuItem value='Insurance'>Insurance</MenuItem>
																	<MenuItem value='Partnership'>
																		Partnership
																	</MenuItem>
																	<MenuItem value='Other'>Other</MenuItem>
																</Select>
																{errors.subject && (
																	<Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
																		{errors.subject}
																	</Typography>
																)}
															</FormControl>
														</Grid>
														<Grid item xs={12}>
															<StyledTextField
																label='Your Message'
																name='message'
																multiline
																rows={5}
																variant='outlined'
																fullWidth
																required
																value={formData.message}
																onChange={handleChange}
																error={!!errors.message}
																helperText={errors.message}
															/>
														</Grid>
														<Grid item xs={12}>
															<Box
																component={motion.div}
																whileHover={{ scale: 1.03 }}
																whileTap={{ scale: 0.97 }}
																sx={{ 
																	display: 'flex', 
																	justifyContent: { xs: 'center', md: 'flex-start' } 
																}}>
																<StyledButton
																	type='submit'
																	variant='contained'
																	color='primary'
																	size='large'
																	disabled={isSubmitting}
																	endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
																	sx={{
																		mt: 2,
																		py: 1.5,
																		px: 4,
																		background:
																			"linear-gradient(45deg, #1b321d 30%, #2C6040 90%)",
																		boxShadow: "0 3px 15px rgba(27,50,29,0.3)",
																	}}>
																	{isSubmitting ? 'Sending...' : 'Send Message'}
																</StyledButton>
															</Box>
															<Typography
																variant='body2'
																sx={{ 
																	mt: 2, 
																	color: "text.secondary",
																	textAlign: { xs: 'center', md: 'left' } 
																}}>
																	We respect your privacy. Your information will not
																	be shared.
																</Typography>
															</Grid>
														</Grid>
													</form>
												</FormPaper>
											</Box>
										</Grid>
									</Grid>
								</Container>
							</Box>

							{/* Map Section */}
							<Container maxWidth='xl' sx={{ py: { xs: 5, md: 8 } }}>
								<Typography
									variant='h3'
									sx={{
										fontWeight: 700,
										mb: { xs: 3, md: 5 },
										textAlign: "center",
										color: "primary.main",
										fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
										position: "relative",
										"&::after": {
											content: '""',
											position: "absolute",
											bottom: -15,
											left: "50%",
											transform: "translateX(-50%)",
											width: "80px",
											height: "3px",
											background:
												"linear-gradient(to right, #1b321d 30%, #8cc63f 100%)",
										},
									}}>
										Find Us Here
									</Typography>

									<Box
										component={motion.div}
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: 0.3 }}>
										<MapContainer>
											<iframe
												src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243646.9050970772!2d78.24323223000582!3d17.412608641550744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1745861290209!5m2!1sen!2sin'
												width='100%'
												height='100%'
												style={{ border: 0 }}
												allowFullScreen=''
												loading='lazy'
												referrerPolicy='no-referrer-when-downgrade'
												title='FinShelter Office Location'
											/>
										</MapContainer>
									</Box>
								</Container>

								{/* Updated Snackbar to use submitStatus state */}
								<Snackbar
									open={submitStatus.open}
									autoHideDuration={6000}
									onClose={handleCloseSnackbar}
									anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
									<Alert
										onClose={handleCloseSnackbar}
										severity={submitStatus.success ? "success" : "error"}
										sx={{ width: "100%" }}>
										{submitStatus.message}
									</Alert>
								</Snackbar>
							</Box>
						</ThemeProvider>
					);
				};

			export default ContactUs;
