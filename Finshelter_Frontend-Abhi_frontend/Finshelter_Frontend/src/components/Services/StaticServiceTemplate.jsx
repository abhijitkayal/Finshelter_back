import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";
import { useNotification } from "../../NotificationContext";
import { useCustomerAuth } from "../../Customer/CustomerAuthContext";
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
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CircularProgress,
	useTheme,
	alpha,
} from "@mui/material";
import {
	CheckCircle,
	ExpandMore,
	AccessTime,
	VerifiedUser,
	Payments,
	Support,
	ArrowForward,
	KeyboardArrowDown,
} from "@mui/icons-material";
import "./services.css";

/**
 * A template for creating static service pages with dynamic content from the admin panel
 *
 * @param {Object} props Component props
 * @param {string} props.serviceId - The ID of the service in the database
 * @param {string} props.serviceName - The name of the service
 * @param {string} props.serviceDescription - Description of the service
 * @param {string} props.serviceHero - Hero image URL for the service
 * @param {Array} props.benefits - List of benefits
 * @param {Array} props.features - List of features
 * @param {Array} props.faqs - List of FAQs
 * @param {boolean} props.isLeadService - Whether this is a lead generation service
 * @param {string} props.leadButtonText - Text for the lead button
 * @param {string} props.packageButtonText - Text for the package selection button
 * @param {Object} props.customStyles - Custom styles for this specific service page
 * @param {Array} props.customSections - Custom sections to include in the template
 */
const StaticServiceTemplate = ({
	serviceId,
	serviceName,
	serviceDescription,
	serviceHero = "/images/service-default.jpg",
	benefits = [],
	features = [],
	faqs = [],
	isLeadService = false,
	leadButtonText = "Register Interest",
	packageButtonText = "Choose Package",
	customStyles = {},
	customSections = [],
}) => {
	const navigate = useNavigate();
	const { showNotification } = useNotification();
	const { isLoggedIn } = useCustomerAuth();
	const [loading, setLoading] = useState(true);
	const [service, setService] = useState(null);
	const [selectedPackage, setSelectedPackage] = useState(null);
	const theme = useTheme();

	// Default styles that can be overridden by customStyles
	const defaultStyles = {
		primaryColor: theme.palette.primary.main,
		secondaryColor: theme.palette.secondary.main,
		accentColor: "#f8f9fa",
		heroGradient: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(27,50,29,0.8) 100%)`,
		cardHoverEffect: {
			transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
			"&:hover": {
				transform: "translateY(-5px)",
				boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
			},
		},
	};

	// Merge default styles with custom styles
	const styles = { ...defaultStyles, ...customStyles };

	useEffect(() => {
		const fetchService = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8000/api/customers/user-services/${serviceId}`
				);
				setService(response.data.service);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching service:", error);
				showNotification(
					"Error loading service details. Please try again later.",
					"error"
				);
				setLoading(false);
			}
		};

		fetchService();
	}, [serviceId, showNotification]);

	const handlePackageSelect = (pkg) => {
		setSelectedPackage(pkg);
		
		// If user is logged in, go directly to payment
		if (isLoggedIn) {
			navigate(`/payment`, {
				state: {
					service: service,
					selectedPackage: pkg,
					isLeadService: false,
				},
			});
		} else {
			// If not logged in, show registration form
			navigate(`/service-registration`, {
				state: {
					service: service,
					selectedPackage: pkg,
					isLeadService: false,
				},
			});
		}
	};

	const handleRegisterInterest = () => {
		navigate(`/service-registration`, {
			state: {
				service: service,
				selectedPackage: null,
				isLeadService: true,
			},
		});
	};

	const scrollToPackages = () => {
		document.getElementById("packages-section")?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	return (
		<Box className='static-service-page'>
			{/* Loading State */}
			{loading && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "50vh",
					}}>
					<CircularProgress size={60} thickness={4} />
				</Box>
			)}

			{!loading && (
				<>
					{/* Enhanced Hero Section - Modified to be simpler like ITR Filing page */}
					<Box
						sx={{
							position: "relative",
							backgroundImage: `url(${serviceHero})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							minHeight: { xs: "400px", md: "500px" }, // Shorter on mobile
							color: "white",
							display: "flex",
							alignItems: "center",
							paddingTop: { xs: "80px", md: "100px" }, // Less padding on mobile
							"&::before": {
								content: '""',
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background:
									"linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(27,50,29,0.85) 100%)", // Simpler overlay like ITR Filing
								zIndex: 1,
							},
						}}>
						<Container
							maxWidth='lg'
							sx={{
								position: "relative",
								zIndex: 2,
								py: { xs: 6, md: 12 }, // Less padding on mobile
							}}>
							<Grid container spacing={{ xs: 2, md: 4 }} alignItems='center'>
								<Grid item xs={12} md={7}>
									<Box>
										<Typography
											variant='overline'
											sx={{
												letterSpacing: { xs: 1.5, md: 2 },
												opacity: 0.9,
												fontSize: { xs: "0.85rem", md: "1rem" },
												mb: { xs: 1, md: 2 },
												display: "block",
											}}>
											Professional Services
										</Typography>
										<Typography
											variant='h1'
											gutterBottom
											sx={{
												fontWeight: 700,
												fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
												lineHeight: 1.2,
												mb: { xs: 2, md: 3 },
												color: "white",
											}}>
											{serviceName}
										</Typography>
										{/* Adding 2 lines of description in the hero section */}
										<Typography
											variant='h5'
											sx={{
												mb: { xs: 3, md: 4 },
												opacity: 0.9,
												lineHeight: 1.6,
												maxWidth: "90%",
												display: "-webkit-box",
												WebkitLineClamp: 2,
												WebkitBoxOrient: "vertical",
												overflow: "hidden",
												textOverflow: "ellipsis",
												color: "white",
												fontSize: { xs: "1rem", md: "1.25rem" },
											}}>
											{serviceDescription}
										</Typography>
										<Box
											sx={{ 
												display: "flex", 
												flexWrap: "wrap", 
												gap: { xs: 1.5, md: 2 }, 
												mt: { xs: 4, md: 5 },
												flexDirection: { xs: "column", sm: "row" },
												alignItems: { xs: "stretch", sm: "flex-start" }
											}}>
											<Button
												variant='contained'
												color='primary'
												size='large'
												onClick={
													isLeadService
														? handleRegisterInterest
														: scrollToPackages
												}
												sx={{
													py: { xs: 1.2, md: 1.5 },
													px: { xs: 3, md: 4 },
													borderRadius: "30px",
													fontSize: { xs: "0.95rem", md: "1.1rem" },
													fontWeight: 600,
													boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
													transition: "transform 0.2s",
													"&:hover": {
														transform: "translateY(-3px)",
														boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
													},
													width: { xs: "100%", sm: "auto" }, 
												}}
												style={{ backgroundColor: "#1b321d" }}
												endIcon={
													isLeadService ? (
														<ArrowForward />
													) : (
														<KeyboardArrowDown />
													)
												}>
												{isLeadService ? leadButtonText : "Explore Packages"}
											</Button>
											<Button
												variant='outlined'
												size='large'
												onClick={() => navigate("/contact")}
												sx={{
													py: { xs: 1.2, md: 1.5 },
													px: { xs: 3, md: 4 },
													borderRadius: "30px",
													fontWeight: 600,
													borderWidth: 2,
													borderColor: "white",
													color: "white",
													"&:hover": {
														borderWidth: 2,
														borderColor: "white",
														backgroundColor: "rgba(255,255,255,0.1)",
													},
													width: { xs: "100%", sm: "auto" },
												}}>
												Contact Us
											</Button>
										</Box>
									</Box>
								</Grid>
							</Grid>
						</Container>
					</Box>

					{/* Benefits Section with enhanced styling - Added the full service description here */}
					<Container maxWidth='lg' sx={{ py: { xs: 5, md: 8 } }}>
						<Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>
							<Typography
								variant='h2'
								gutterBottom
								sx={{
									fontWeight: 700,
									position: "relative",
									display: "inline-block",
									pb: 2,
									fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
									"&::after": {
										content: '""',
										position: "absolute",
										width: { xs: "60px", md: "80px" },
										height: { xs: "3px", md: "4px" },
										backgroundColor: styles.primaryColor,
										bottom: 0,
										left: "50%",
										transform: "translateX(-50%)",
									},
								}}>
								Why Choose Our {serviceName}
							</Typography>

							{/* Full service description added here instead of in hero section */}
							<Typography
								variant='subtitle1'
								sx={{
									mt: { xs: 1.5, md: 2 },
									mb: { xs: 3, md: 4 },
									maxWidth: 800,
									mx: "auto",
									fontSize: { xs: "16px", md: "18px" },
									color: "black",
									px: { xs: 2, md: 0 },
								}}>
								{serviceDescription}
							</Typography>
						</Box>

						<Grid container spacing={{ xs: 5, md: 4 }}>
							{benefits.map((benefit, index) => (
								<Grid item xs={12} sm={6} md={4} key={index} sx={{ mb: { xs: 6, md: 0 } }}>
									<Card
										elevation={2}
										sx={{
											height: "100%",
											display: "flex",
											flexDirection: "column",
											borderRadius: "12px",
											overflow: "hidden",
											...styles.cardHoverEffect,
										}}>
										<CardContent
											sx={{
												flexGrow: 1,
												p: { xs: 3, md: 4 },
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
											}}>
											<Box
												sx={{
													mb: 2.5,
													p: 1.5,
													borderRadius: "12px",
													backgroundColor: alpha(styles.primaryColor, 0.1),
													color: styles.primaryColor,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}>
												{benefit.icon}
											</Box>
											<Typography
												variant='h5'
												component='h2'
												gutterBottom
												sx={{ 
													fontWeight: 600, 
													mb: 2,
													fontSize: { xs: "1.25rem", md: "1.5rem" } 
												}}>
												{benefit.title}
											</Typography>
											<Typography sx={{ 
												color: "black",
												fontSize: { xs: "0.95rem", md: "1rem" },
												lineHeight: { xs: 1.5, md: 1.6 },
											}}>
												{benefit.description}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Container>

					{/* Features Section with enhanced styling */}
					<Container maxWidth='lg' sx={{ py: { xs: 5, md: 8 } }}>
						<Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>
							<Typography
								variant='h2'
								gutterBottom
								sx={{
									fontWeight: 700,
									position: "relative",
									display: "inline-block",
									pb: 2,
									fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
									"&::after": {
										content: '""',
										position: "absolute",
										width: { xs: "60px", md: "80px" },
										height: { xs: "3px", md: "4px" },
										backgroundColor: styles.primaryColor,
										bottom: 0,
										left: "50%",
										transform: "translateX(-50%)",
									},
								}}>
								Key Features
							</Typography>
							<Typography
								variant='subtitle1'
								sx={{
									mt: { xs: 1.5, md: 2 },
									mb: { xs: 3, md: 4 },
									maxWidth: 800,
									mx: "auto",
									fontSize: { xs: "0.95rem", md: "1.1rem" },
									color: "text.secondary",
									px: { xs: 2, md: 0 },
								}}>
								Discover what makes our {serviceName.toLowerCase()} service
								stand out from the rest
							</Typography>
						</Box>

						<Grid container spacing={{ xs: 5, md: 4 }}>
							{features.map((feature, index) => (
								<Grid item xs={12} sm={6} md={4} key={index} sx={{ mb: { xs: 6, md: 0 } }}>
									<Card
										sx={{
											height: "100%",
											display: "flex",
											flexDirection: "column",
											borderRadius: "16px",
											boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
											transition: "transform 0.3s ease, box-shadow 0.3s ease",
											"&:hover": {
												transform: "translateY(-10px)",
												boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
											},
											overflow: "hidden",
										}}>
										<Box
											sx={{
												height: "8px",
												background: `linear-gradient(to right, ${
													styles.primaryColor
												}, ${alpha(styles.primaryColor, 0.7)})`,
											}}
										/>
										<CardContent sx={{ 
											flexGrow: 1, 
											p: { xs: 2.5, md: 4 },
										}}>
											<Typography
												variant='h5'
												component='h3'
												gutterBottom
												color='#1b321d'
												sx={{ 
													fontWeight: 600, 
													mb: 2,
													fontSize: { xs: "1.25rem", md: "1.5rem" },
													lineHeight: 1.3,
												}}>
												{feature.title}
											</Typography>
											<Typography 
												variant='body1' 
												color='black'
												sx={{
													fontSize: { xs: "0.95rem", md: "1rem" },
													lineHeight: { xs: 1.5, md: 1.6 },
												}}
											>
												{feature.description}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Container>

					{/* Custom Sections Rendering */}
					{customSections.map((section, index) => {
						if (section.component === "ProcessFlow") {
							return (
								<Container
									key={`custom-section-${index}`}
									maxWidth='lg'
									sx={{
										padding: section.styles?.padding || { xs: "40px 0", md: "60px 0" },
										backgroundColor:
											section.styles?.backgroundColor || "#ffffff",
										position: "relative",
									}}>
									<Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
										<Box>
											<Typography
												variant='h2'
												sx={
													section.styles?.heading || {
														fontFamily: "'Poppins', sans-serif",
														fontWeight: 700,
														fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3.2rem" },
														color: "#1b321d",
														marginBottom: { xs: "10px", md: "15px" },
														paddingLeft: { xs: "15px", md: 0 },
														paddingRight: { xs: "15px", md: 0 },
													}
												}>
												{section.title}
											</Typography>
										</Box>

										{section.subtitle && (
											<Box>
												<Typography
													variant='subtitle1'
													sx={
														section.styles?.subtitle || {
															fontSize: { xs: "1rem", md: "1.1rem" },
															color: "#4a6350",
															maxWidth: "700px",
															margin: "0 auto",
															marginBottom: { xs: "30px", md: "40px" },
															lineHeight: 1.6,
															paddingLeft: { xs: "15px", md: 0 },
															paddingRight: { xs: "15px", md: 0 },
														}
													}>
													{section.subtitle}
												</Typography>
											</Box>
										)}
									</Box>

									<Grid container spacing={{ xs: 6, md: 2 }} justifyContent='center'>
										{section.steps.map((step, stepIndex) => (
											<Grid
												item
												xs={12}
												sm={6}
												md={12 / section.steps.length}
												key={`step-${stepIndex}`}
												sx={{ mb: { xs: 5, md: 0 } }}
											>
												<Box sx={{ position: "relative" }}>
													{/* Horizontal connector line - visible only on desktop */}
													{stepIndex < section.steps.length - 1 && (
														<Box
															sx={{
																display: { xs: "none", md: "block" },
																position: "absolute",
																top: "30px",
																right: "-50%",
																width: "100%",
																height: "2px",
																backgroundColor: "#e0e0e0",
																zIndex: 1,
															}}
														/>
													)}

													<Box>
														<Box
															sx={
																section.styles?.step || {
																	display: "flex",
																	flexDirection: "column",
																	alignItems: "center",
																	textAlign: "center",
																	position: "relative",
																	zIndex: 2,
																	padding: { xs: "0 15px", md: "0 10px" },
																}
															}>
															<Box
																sx={
																	section.styles?.stepNumber || {
																		width: { xs: "50px", md: "60px" },
																		height: { xs: "50px", md: "60px" },
																		borderRadius: "50%",
																		backgroundColor: "#1b321d",
																		color: "#ffffff",
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																		fontSize: { xs: "1.25rem", md: "1.5rem" },
																		fontWeight: 700,
																		marginBottom: "20px",
																		boxShadow: "0 4px 8px rgba(27,50,29,0.15)",
																		position: "relative",
																		zIndex: 3,
																	}
																}>
																{stepIndex + 1}
															</Box>
															{step.icon && (
																<Box
																	sx={
																		section.styles?.stepIcon || {
																			fontSize: { xs: "1.75rem", md: "2rem" },
																			color: "#95b8a2",
																			marginBottom: "10px",
																		}
																	}>
																	{step.icon}
																</Box>
															)}
															<Typography
																variant='h6'
																sx={
																	section.styles?.stepTitle || {
																		fontFamily: "'Poppins', sans-serif",
																		fontWeight: 600,
																		fontSize: { xs: "1.1rem", md: "1.2rem" },
																		color: "#1b321d",
																		marginBottom: "8px",
																	}
																}>
																{step.title}
															</Typography>
															<Typography
																variant='body2'
																sx={
																	section.styles?.stepDescription || {
																		fontSize: { xs: "0.85rem", md: "0.9rem" },
																		color: "#4a6350",
																		lineHeight: 1.5,
																		maxWidth: { xs: "90%", md: "250px" },
																		margin: "0 auto",
																	}
																}>
																{step.description}
															</Typography>
														</Box>
													</Box>
												</Box>
											</Grid>
										))}
									</Grid>
								</Container>
							);
						}

						// Eligibility Criteria Section
						if (section.component === "EligibilityCriteria") {
							return (
								<Box
									key={section.id}
									sx={
										styles.eligibilitySection || {
											padding: { xs: "60px 0", md: "80px 0" },
											backgroundColor: "#f9fbf9",
											borderTop: "1px solid rgba(0,0,0,0.05)",
											borderBottom: "1px solid rgba(0,0,0,0.05)",
										}
									}>
									<Container maxWidth='lg'>
										<Typography
											variant='h2'
											sx={
												styles.eligibilityHeading || {
													fontWeight: 700,
													fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
													color: styles.primaryColor,
													textAlign: "center",
													marginBottom: { xs: "15px", md: "20px" },
													paddingLeft: { xs: "15px", md: 0 },
													paddingRight: { xs: "15px", md: 0 },
												}
											}>
											{section.title}
										</Typography>

										{section.subtitle && (
											<Typography
												variant='subtitle1'
												sx={{
													textAlign: "center",
													maxWidth: "800px",
													margin: "0 auto",
													marginBottom: { xs: "30px", md: "50px" },
													color: "text.secondary",
													fontSize: { xs: "1rem", md: "1.1rem" },
													paddingLeft: { xs: "15px", md: 0 },
													paddingRight: { xs: "15px", md: 0 },
												}}>
												{section.subtitle}
											</Typography>
										)}

										<Grid container spacing={{ xs: 6, md: 4 }}>
											{section.criteria &&
												section.criteria.map((criteria, index) => (
													<Grid item xs={12} md={4} key={index} sx={{ mb: { xs: 6, md: 0 } }}>
														<Paper
															elevation={0}
															sx={
																styles.eligibilityCard || {
																	backgroundColor: "#ffffff",
																	borderRadius: "12px",
																	boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
																	padding: { xs: "25px", md: "30px" },
																	height: "100%",
																	transition: "transform 0.3s ease",
																	"&:hover": {
																		transform: "translateY(-8px)",
																	},
																}
															}>
															<Typography
																variant='h6'
																sx={
																	styles.eligibilityCardTitle || {
																		fontWeight: 600,
																		fontSize: { xs: "1.1rem", md: "1.2rem" },
																		color: styles.primaryColor,
																		marginBottom: "15px",
																		display: "flex",
																		alignItems: "center",
																	}
																}>
																{criteria.icon && (
																	<Box
																		component='span'
																		sx={
																			styles.eligibilityCardIcon || {
																				color: alpha(styles.primaryColor, 0.7),
																				marginRight: "10px",
																				fontSize: { xs: "1.3rem", md: "1.5rem" },
																			}
																		}>
																		{criteria.icon}
																	</Box>
																)}
																{criteria.title}
															</Typography>

															{criteria.items && (
																<Box
																	component='ul'
																	sx={
																		styles.eligibilityList || {
																			paddingLeft: { xs: "5px", md: "10px" },
																			listStyleType: "none",
																			margin: 0,
																		}
																	}>
																	{criteria.items.map((item, itemIndex) => (
																		<Box
																			component='li'
																			key={itemIndex}
																			sx={
																				styles.eligibilityListItem || {
																					marginBottom: { xs: "12px", md: "10px" },
																					paddingLeft: "15px",
																					position: "relative",
																					fontSize: { xs: "0.9rem", md: "1rem" },
																					lineHeight: { xs: 1.4, md: 1.5 },
																					"&::before": {
																						content: '""',
																						position: "absolute",
																						left: 0,
																						top: "10px",
																						width: "6px",
																						height: "6px",
																						borderRadius: "50%",
																						backgroundColor: alpha(
																							styles.primaryColor,
																							0.7
																						),
																					},
																				}
																			}>
																			{item}
																		</Box>
																	))}
																</Box>
															)}
														</Paper>
													</Grid>
												))}
										</Grid>
									</Container>
								</Box>
							);
						}

						// Tax Tips Section
						if (section.component === "TaxTips") {
							return (
								<Box
									key={section.id}
									sx={
										styles.taxTipsSection || {
											padding: { xs: "60px 0", md: "90px 0" },
											backgroundColor: "#f5f9f6",
											backgroundImage:
												"linear-gradient(135deg, #f5f9f6 0%, #ffffff 100%)",
										}
									}>
									<Container maxWidth='lg'>
										<Typography
											variant='h2'
											sx={
												styles.taxTipsHeading || {
													fontWeight: 700,
													fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
													color: styles.primaryColor,
													textAlign: "center",
													marginBottom: { xs: "20px", md: "50px" },
													paddingLeft: { xs: "15px", md: 0 },
													paddingRight: { xs: "15px", md: 0 },
												}
											}>
											{section.title}
										</Typography>

										{section.subtitle && (
											<Typography
												variant='subtitle1'
												sx={{
													textAlign: "center",
													maxWidth: "800px",
													margin: "0 auto",
													marginBottom: { xs: "30px", md: "50px" },
													color: "text.secondary",
													fontSize: { xs: "1rem", md: "1.1rem" },
													paddingLeft: { xs: "15px", md: 0 },
													paddingRight: { xs: "15px", md: 0 },
												}}>
												{section.subtitle}
											</Typography>
										)}

										<Grid container spacing={{ xs: 6, md: 4 }}>
											{section.tips &&
												section.tips.map((tip, index) => (
													<Grid
														item
														xs={12}
														sm={6}
														md={index === 4 ? 12 : 6}
														key={index}
														sx={{ mb: { xs: 6, md: 0 } }}
													>
														<Paper
															elevation={0}
															sx={
																styles.taxTipCard || {
																	backgroundColor: "#ffffff",
																	borderRadius: "12px",
																	overflow: "hidden",
																	boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
																	height: "100%",
																	transition: "all 0.3s ease",
																	"&:hover": {
																		transform: "translateY(-8px)",
																		boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
																	},
																}
															}>
															<Box
																sx={
																	styles.taxTipCardHeader || {
																		backgroundColor: styles.primaryColor,
																		color: "#ffffff",
																		padding: { xs: "12px 15px", md: "15px 20px" },
																	}
																}>
																<Typography
																	variant='h6'
																	sx={
																		styles.taxTipCardTitle || {
																			fontWeight: 600,
																			fontSize: { xs: "1.1rem", md: "1.2rem" },
																			color: "#ffffff",
																			display: "flex",
																			alignItems: "center",
																		}
																	}>
																	{tip.icon && (
																		<Box
																			component='span'
																			sx={
																				styles.taxTipCardIcon || {
																					marginRight: "10px",
																					fontSize: { xs: "1.2rem", md: "1.4rem" },
																				}
																			}>
																			{tip.icon}
																		</Box>
																	)}
																	{tip.title}
																</Typography>
															</Box>

															<Box
																sx={
																	styles.taxTipCardContent || {
																		padding: { xs: "20px", md: "25px" },
																	}
																}>
																<Typography
																	variant='body2'
																	sx={
																		styles.taxTipCardDescription || {
																			fontSize: { xs: "0.9rem", md: "1rem" },
																			color: "text.secondary",
																			lineHeight: { xs: 1.5, md: 1.6 },
																		}
																	}>
																	{tip.description}
																</Typography>
															</Box>
														</Paper>
													</Grid>
												))}
										</Grid>
									</Container>
								</Box>
							);
						}

						// Default return empty fragment if section type not recognized
						return <React.Fragment key={section.id}></React.Fragment>;
					})}

					{/* Pricing Section - Dynamic from Admin Panel */}
					<Container
						id='packages-section'
						maxWidth='lg'
						sx={{ py: { xs: 6, md: 12 } }}>
						<Box sx={{ mb: { xs: 5, md: 8 }, textAlign: "center" }}>
							<Typography
								variant='h2'
								gutterBottom
								sx={{
									fontWeight: 700,
									position: "relative",
									display: "inline-block",
									pb: 2,
									fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
									"&::after": {
										content: '""',
										position: "absolute",
										width: { xs: "60px", md: "80px" },
										height: { xs: "3px", md: "4px" },
										backgroundColor: styles.primaryColor,
										bottom: 0,
										left: "50%",
										transform: "translateX(-50%)",
									},
								}}>
								Our Packages
							</Typography>
							<Typography
								variant='subtitle1'
								sx={{
									mt: { xs: 1.5, md: 2 },
									mb: { xs: 4, md: 6 },
									maxWidth: 800,
									mx: "auto",
									fontSize: { xs: "0.95rem", md: "1.1rem" },
									color: "text.secondary",
									px: { xs: 2, md: 0 },
								}}>
								Choose the perfect package for your needs
							</Typography>
						</Box>

						{service && service.packages && service.packages.length > 0 ? (
							<Grid container spacing={{ xs: 5, md: 4 }}>
								{service.packages.map((pkg, index) => (
									<Grid item xs={12} sm={6} md={4} key={index} sx={{ mb: { xs: 7, md: 0 } }}>
										<Paper
											elevation={3}
											sx={{
												p: { xs: 3, md: 4 },
												height: "100%",
												display: "flex",
												flexDirection: "column",
												position: "relative",
												borderRadius: "16px",
												border: index === 1 ? "2px solid" : "none",
												borderColor: styles.primaryColor,
												transition: "transform 0.3s ease, box-shadow 0.3s ease",
												"&:hover": {
													transform: "translateY(-10px)",
													boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
												},
											}}>
											{index === 1 && (
												<Box
													sx={{
														position: "absolute",
														top: -15,
														left: "50%",
														transform: "translateX(-50%)",
														bgcolor: styles.primaryColor,
														color: "white",
														py: 0.5,
														px: 3,
														borderRadius: "30px",
														fontWeight: "bold",
														boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
													}}>
														<Typography variant='body2' fontWeight='bold'>
															Most Popular
														</Typography>
													</Box>
											)}

											<Typography
												variant='h5'
												gutterBottom
												color='#1b321d'
												sx={{ 
													fontWeight: 700, 
													mb: 2,
													fontSize: { xs: "1.25rem", md: "1.5rem" },
												}}>
												{pkg.name}
											</Typography>

											<Typography
												variant='body2'
												paragraph
												sx={{ 
													mb: 3, 
													flexGrow: 1, 
													color: "text.secondary",
													fontSize: { xs: "0.9rem", md: "1rem" },
												}}>
												{pkg.description ||
													"Comprehensive package for your needs"}
											</Typography>

											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													alignItems: "baseline",
													mb: 3,
												}}>
												{pkg.actualPrice && pkg.actualPrice > pkg.salePrice && (
													<Typography
														component='span'
														sx={{
															textDecoration: "line-through",
															color: "text.secondary",
															fontSize: { xs: "1.5rem", md: "1.8rem" },
															ml: 1,
														}}>
														₹{pkg.actualPrice}
													</Typography>
												)}
												<Typography
													variant='h3'
													component='span'
													sx={{ 
														fontWeight: 700, 
														color: styles.primaryColor,
														fontSize: { xs: "2rem", md: "2.5rem" },
													}}>
													₹{pkg.salePrice} <span style={{fontSize: { xs: "0.9rem", md: "1rem" }}}>+GST</span>
												</Typography>
											</Box>

											<Divider sx={{ my: 2 }} />

											<List dense sx={{ mb: 3 }}>
												{pkg.features &&
													pkg.features.map((feature, i) => (
														<ListItem key={i} disableGutters sx={{ pb: 1 }}>
															<ListItemIcon sx={{ minWidth: 30 }}>
																<CheckCircle
																	sx={{
																		color: styles.primaryColor,
																		fontSize: "1rem",
																	}}
																/>
															</ListItemIcon>
															<ListItemText
																primary={feature}
																primaryTypographyProps={{ 
																	variant: "body2",
																	sx: { fontSize: { xs: "0.9rem", md: "1rem" } }
																}}
															/>
														</ListItem>
													))}
											</List>

											<Button
												variant='contained'
												color='primary'
												fullWidth
												size='large'
												onClick={() => handlePackageSelect(pkg)}
												sx={{
													mt: "auto",
													py: { xs: 1.2, md: 1.5 },
													borderRadius: "30px",
													fontWeight: 600,
													boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
													"&:hover": {
														boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
													},
													backgroundColor: styles.primaryColor,
													fontSize: { xs: "0.9rem", md: "1rem" },
												}}>
												{packageButtonText}
											</Button>
										</Paper>
									</Grid>
								))}
							</Grid>
						) : (
							<Box
								sx={{
									textAlign: "center",
									p: { xs: 4, md: 6 },
									borderRadius: "16px",
									backgroundColor: alpha(styles.primaryColor, 0.05),
								}}>
								<Typography paragraph sx={{ 
									fontSize: { xs: "1rem", md: "1.1rem" }, 
									mb: { xs: 2, md: 3 } 
								}}>
									Contact us for custom pricing tailored to your specific needs.
								</Typography>
								<Button
									variant='contained'
									color='#1b321d'
									size='large'
									onClick={handleRegisterInterest}
									sx={{
										py: { xs: 1.2, md: 1.5 },
										px: { xs: 3, md: 4 },
										borderRadius: "30px",
										fontWeight: 600,
										fontSize: { xs: "0.9rem", md: "1rem" },
									}}>
									{leadButtonText}
								</Button>
							</Box>
						)}
					</Container>

					{/* FAQ Section with enhanced styling - Modified to show in two columns */}
					<Box
						sx={{
							bgcolor: styles.accentColor,
							py: { xs: 5, md: 8 },
							position: "relative",
						}}>
						<Container maxWidth='lg'>
							<Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>
								<Typography
									variant='h2'
									gutterBottom
									sx={{
										fontWeight: 700,
										position: "relative",
										display: "inline-block",
										pb: 2,
										fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
										"&::after": {
											content: '""',
											position: "absolute",
											width: { xs: "60px", md: "80px" },
											height: { xs: "3px", md: "4px" },
											backgroundColor: styles.primaryColor,
											bottom: 0,
											left: "50%",
											transform: "translateX(-50%)",
										},
									}}>
									Frequently Asked Questions
								</Typography>
								<Typography
									variant='subtitle1'
									sx={{
										mt: { xs: 1.5, md: 2 },
										mb: { xs: 3, md: 4 },
										maxWidth: 800,
										mx: "auto",
										fontSize: { xs: "0.95rem", md: "1.1rem" },
										color: "text.secondary",
										px: { xs: 2, md: 0 },
									}}>
									Find answers to common questions about our{" "}
									{serviceName.toLowerCase()}
								</Typography>
							</Box>

							{/* Modified FAQ section with better mobile layout */}
							<Grid container spacing={{ xs: 4, md: 3 }}>
								<Grid item xs={12} md={6}>
									<Box
										sx={{
											height: "100%",
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
										}}>
										{faqs
											.slice(0, Math.ceil(faqs.length / 2))
											.map((faq, index) => (
												<Accordion
													key={index}
													sx={{
														mb: { xs: 4, md: 2 },
														boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
														borderRadius: "12px !important",
														overflow: "hidden",
														"&:before": {
															display: "none", // Remove the default divider
														},
													}}
													disableGutters
													elevation={0}>
													<AccordionSummary
														expandIcon={
															<ExpandMore sx={{ color: styles.primaryColor }} />
														}
														sx={{
															px: { xs: 2, md: 3 },
															py: { xs: 1, md: 1.5 },
															backgroundColor: "white",
															"&:hover": {
																backgroundColor: alpha(
																	styles.primaryColor,
																	0.02
																),
															},
														}}>
														<Typography
															variant='h6'
															sx={{ 
																fontWeight: 600, 
																fontSize: { xs: "1rem", md: "1.2rem" },
																lineHeight: 1.4,
															}}>
															{faq.question}
														</Typography>
													</AccordionSummary>
													<AccordionDetails
														sx={{
															px: { xs: 2, md: 3 },
															py: { xs: 1.5, md: 2 },
															backgroundColor: alpha(styles.primaryColor, 0.02),
														}}>
														<Typography 
															sx={{ 
																color: "black",
																whiteSpace: "pre-line",
																fontSize: { xs: "0.9rem", md: "1rem" },
																lineHeight: { xs: 1.5, md: 1.6 },
															}}>
															{faq.answer}
														</Typography>
													</AccordionDetails>
												</Accordion>
											))}
									</Box>
								</Grid>
								<Grid item xs={12} md={6}>
									<Box
										sx={{
											height: "100%",
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
										}}>
										{faqs
											.slice(Math.ceil(faqs.length / 2))
											.map((faq, index) => (
												<Accordion
													key={index + Math.ceil(faqs.length / 2)}
													sx={{
														mb: { xs: 4, md: 2 },
														boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
														borderRadius: "12px !important",
														overflow: "hidden",
														"&:before": {
															display: "none", // Remove the default divider
														},
													}}
													disableGutters
													elevation={0}>
													<AccordionSummary
														expandIcon={
															<ExpandMore sx={{ color: styles.primaryColor }} />
														}
														sx={{
															px: { xs: 2, md: 3 },
															py: { xs: 1, md: 1.5 },
															backgroundColor: "white",
															"&:hover": {
																backgroundColor: alpha(
																	styles.primaryColor,
																	0.02
																),
															},
														}}>
														<Typography
															variant='h6'
															sx={{ 
																fontWeight: 600, 
																fontSize: { xs: "1rem", md: "1.2rem" },
																lineHeight: 1.4,
															}}>
															{faq.question}
														</Typography>
													</AccordionSummary>
													<AccordionDetails
														sx={{
															px: { xs: 2, md: 3 },
															py: { xs: 1.5, md: 2 },
															backgroundColor: alpha(styles.primaryColor, 0.02),
														}}>
														<Typography 
															sx={{ 
																color: "black",
																whiteSpace: "pre-line",
																fontSize: { xs: "0.9rem", md: "1rem" },
																lineHeight: { xs: 1.5, md: 1.6 },
															}}>
															{faq.answer}
														</Typography>
													</AccordionDetails>
												</Accordion>
											))}
									</Box>
								</Grid>
							</Grid>
						</Container>
					</Box>

					{/* Enhanced CTA Section */}
					<Box
						sx={{
							position: "relative",
							bgcolor: styles.primaryColor,
							color: "white",
							py: { xs: 5, md: 8 },
							textAlign: "center",
							overflow: "hidden", 
							"&::before": {
								content: '""',
								position: "absolute",
								right: "-100px",
								bottom: "-100px",
								width: "300px",
								height: "300px",
								borderRadius: "50%",
								backgroundColor: alpha("#ffffff", 0.1),
							},
							"&::after": {
								content: '""',
								position: "absolute",
								left: "-50px",
								top: "-50px",
								width: "200px", 
								height: "200px",
								borderRadius: "50%",
								backgroundColor: alpha("#ffffff", 0.05),
							},
						}}>
						<Container maxWidth='md' sx={{ position: "relative", zIndex: 2 }}>
							<Typography
								variant='h2'
								gutterBottom
								sx={{
									fontWeight: 700,
									mb: { xs: 2, md: 3 },
									fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
									px: { xs: 2, md: 0 },
								}}
								style={{ color: "white" }}>
								Ready to Get Started?
							</Typography>
							<Typography
								paragraph
								sx={{
									mb: { xs: 4, md: 5 },
									maxWidth: 700,
									mx: "auto",
									fontSize: { xs: "1.1rem", md: "1.25rem" },
									opacity: 0.9,
									px: { xs: 2, md: 0 },
								}}>
								Join thousands of satisfied customers who have already benefited
								from our services.
							</Typography>
							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									flexDirection: { xs: "column", sm: "row" },
									justifyContent: "center",
									alignItems: { xs: "stretch", sm: "center" },
									gap: { xs: 2, md: 3 },
									px: { xs: 3, md: 0 },
								}}>
								<Button
									variant='contained'
									size='large'
									sx={{
										bgcolor: "white",
										color: styles.primaryColor,
										"&:hover": {
											bgcolor: "rgba(255,255,255,0.9)",
										},
										py: { xs: 1.2, md: 1.5 },
										px: { xs: 3, md: 4 },
										borderRadius: "30px",
										fontWeight: 600,
										boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
										width: { xs: "100%", sm: "auto" },
										fontSize: { xs: "0.95rem", md: "1rem" },
									}}
									onClick={
										isLeadService ? handleRegisterInterest : scrollToPackages
									}>
									{isLeadService ? leadButtonText : "View Packages"}
								</Button>
								<Button
									variant='outlined'
									size='large'
									sx={{
										borderColor: "white",
										color: "white",
										borderWidth: 2,
										"&:hover": {
											borderColor: "white",
											borderWidth: 2,
											bgcolor: "rgba(255,255,255,0.1)",
										},
										py: { xs: 1.2, md: 1.5 },
										px: { xs: 3, md: 4 },
										borderRadius: "30px",
										fontWeight: 600,
										width: { xs: "100%", sm: "auto" },
										fontSize: { xs: "0.95rem", md: "1rem" },
									}}
									onClick={() => navigate("/contact")}>
									Contact Us
								</Button>
							</Box>
						</Container>
					</Box>
				</>
			)}
		</Box>
	);
};

export default StaticServiceTemplate;
