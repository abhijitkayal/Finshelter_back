import React, { useState, useEffect, useRef } from "react";
import axios from "../../Admin/utils/axiosConfig";
import { useNotification } from "../../NotificationContext";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Container,
	Typography,
	Grid,
	Button,
	TextField,
	Card,
	CardContent,
	Paper,
	Slider,
	InputAdornment,
	FormControl,
	Select,
	MenuItem,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	useMediaQuery,
	Tab,
	Tabs,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	alpha,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalculateIcon from "@mui/icons-material/Calculate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoneyIcon from "@mui/icons-material/Money";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DescriptionIcon from "@mui/icons-material/Description";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import GroupIcon from "@mui/icons-material/Group";
import SavingsIcon from "@mui/icons-material/Savings";
import "./services.css";

// Theme configuration with updated colors
const theme = createTheme({
	palette: {
		primary: {
			main: "#1b321d", // Dark green
			light: "#2C6040", // Lighter green for hover states
		},
		secondary: {
			main: "#ff4081", // Pink color
		},
		tertiary: {
			main: "#000000", // Black as specified
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
				fontSize: "2.2rem",
			},
		},
		h2: {
			fontWeight: 700,
			fontSize: "2.2rem",
			"@media (max-width:600px)": {
				fontSize: "2rem",
			},
		},
		h3: {
			fontWeight: 600,
			fontSize: "2rem",
			"@media (max-width:600px)": {
				fontSize: "1.75rem",
			},
		},
		h4: {
			fontWeight: 600,
			fontSize: "1.5rem",
			"@media (max-width:600px)": {
				fontSize: "1.25rem",
			},
		},
		body1: {
			fontSize: "1.1rem",
			lineHeight: 1.7,
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
	[theme.breakpoints.down("sm")]: {
		padding: "10px 20px",
		fontSize: "0.85rem",
	},
}));

const StyledTab = styled(Tab)(({ theme }) => ({
	textTransform: "uppercase",
	fontSize: "0.9rem",
	fontWeight: 500,
	color: "#6c757d",
	padding: "20px 16px",
	"&.Mui-selected": {
		color: theme.palette.primary.main,
		fontWeight: 600,
	},
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
	background: "#f8f9fa",
	"& .MuiTabs-flexContainer": {
		justifyContent: "center",
	},
}));

// Hero Section Paper - matching the reference design
const HeroPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
	borderRadius: 0,
	boxShadow: "none",
	backgroundColor: "#ffffff",
	[theme.breakpoints.down("md")]: {
		flexDirection: "column",
		textAlign: "center",
	},
}));

// New styled component for the gradient cards
const GradientCard = styled(Card)(({ theme }) => ({
	height: "100%",
	display: "flex",
	flexDirection: "column",
	boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	borderRadius: "8px",
	border: "1px solid #eaeaea",
	overflow: "hidden",
	position: "relative",
	"&:hover": {
		transform: "translateY(-5px)",
		boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
		"&::before": {
			opacity: 1,
		}
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "4px",
		background: "linear-gradient(to right, #1b321d, #c6dbce)",
		opacity: 0.6,
		transition: "opacity 0.3s ease",
	}
}));

// Enhanced feature box with subtle gradient
const FeatureBox = styled(Box)(({ theme }) => ({
	textAlign: "center",
	padding: 3,
	transition: "all 0.3s ease",
	borderRadius: "8px",
	border: "1px solid #eaeaea",
	backgroundColor: "#ffffff",
	height: "100%",
	width: "100%", 
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	position: "relative",
	overflow: "hidden",
	"&:hover": {
		transform: "translateY(-5px)",
		boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
		borderColor: "#c6dbce",
		"&::before": {
			transform: "translateY(0)",
		}
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		background: "linear-gradient(135deg, rgba(27,50,29,0.03) 0%, rgba(198,219,206,0.1) 100%)",
		zIndex: 0,
		transform: "translateY(100%)",
		transition: "transform 0.4s ease",
	}
}));

// New styled component for the sidebar
const SidebarNav = styled(Box)(({ theme }) => ({
	position: "sticky",
	top: "120px", // Adjust based on header height
	backgroundColor: "#fff",
	borderRadius: "8px",
	boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
	border: "1px solid #eaeaea",
	overflow: "hidden",
	"& .MuiList-root": {
		padding: 0,
	},
}));

const SidebarNavItem = styled(ListItem)(({ theme, active }) => ({
	borderBottom: "1px solid #eaeaea",
	cursor: "pointer",
	padding: "16px 20px",
	transition: "all 0.3s ease",
	backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : "transparent",
	color: active ? theme.palette.primary.main : theme.palette.text.primary,
	borderLeft: active ? `4px solid ${theme.palette.primary.main}` : "4px solid transparent",
	fontWeight: active ? 600 : 400,
	"&:hover": {
		backgroundColor: alpha(theme.palette.primary.main, 0.05),
		borderLeft: `4px solid ${alpha(theme.palette.primary.main, 0.5)}`,
	},
	"& .MuiListItemIcon-root": {
		color: active ? theme.palette.primary.main : "#999",
		minWidth: "40px",
	},
}));

const ContentSection = styled(Box)(({ theme }) => ({
	paddingLeft: { xs: 0, md: "30px" },
	marginTop: { xs: "30px", md: 0 },
}));

const InvestmentsPage = () => {
	// Service ID from backend - update this for Investments page
	const SERVICE_ID = "SER105"; // Replace with your actual service ID for investments
	const navigate = useNavigate();

	// State variables
	const [investmentAmount, setInvestmentAmount] = useState(50000);
	const [investmentTerm, setInvestmentTerm] = useState(12);
	const [expectedReturn, setExpectedReturn] = useState(12);
	const [expanded, setExpanded] = useState(0);
	const [activeTab, setActiveTab] = useState(0);
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const calculatorRef = useRef(null);
	const heroRef = useRef(null);

	// Service data from backend
	const [service, setService] = useState(null);
	const [loading, setLoading] = useState(true);
	const { showNotification } = useNotification();

	// Section refs for scrolling
	const aboutInvestmentRef = useRef(null);
	const investmentTypesRef = useRef(null);
	const featuresRef = useRef(null);
	const eligibilityRef = useRef(null);
	const faqsRef = useRef(null);
	const packagesRef = useRef(null);
	const portfolioRef = useRef(null);

	// Additional state for tab height
	const [tabHeight, setTabHeight] = useState(0);

	// Scroll listener for fixed tabs
	useEffect(() => {
		const handleScroll = () => {
			const tabsContainer = document.getElementById("sticky-tabs-container");
			if (tabsContainer) {
				// Get tab height once for the spacer
				if (tabHeight === 0) {
					setTabHeight(tabsContainer.offsetHeight);
				}

				// Use a simple scroll position check for 100px
				if (window.scrollY > 100) {
					tabsContainer.classList.add("fixed-tabs");
					document
						.getElementById("tabs-spacer")
						?.classList.add("active-spacer");
				} else {
					tabsContainer.classList.remove("fixed-tabs");
					document
						.getElementById("tabs-spacer")
						?.classList.remove("active-spacer");
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [tabHeight]);

	// Fetch service data from backend
	useEffect(() => {
		const fetchServiceData = async () => {
			try {
				setLoading(true);
				const response = await axios.get(
					`http://localhost:8000/api/customers/user-services/${SERVICE_ID}`
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

		fetchServiceData();
	}, [SERVICE_ID, showNotification]);

	// Function to scroll to calculator section
	const scrollToCalculator = () => {
		if (calculatorRef.current) {
			setActiveTab(6); // Switch to calculator tab
			window.scrollTo({
				top: calculatorRef.current.offsetTop - 120, // Adjust for header
				behavior: "smooth",
			});
		}
	};

	// Generic function to scroll to any section by ref
	const scrollToSection = (ref) => {
		if (ref && ref.current) {
			window.scrollTo({
				top: ref.current.offsetTop - 120, // Adjust for header
				behavior: "smooth",
			});
		}
	};

	// Handle tab change
	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);

		// Scroll to appropriate section based on tab index
		switch (newValue) {
			case 0: // About Investment
				scrollToSection(aboutInvestmentRef);
				break;
			case 1: // Types of Investments
				scrollToSection(investmentTypesRef);
				break;
			case 2: // Features & Benefits
				scrollToSection(featuresRef);
				break;
			case 3: // Portfolio
				scrollToSection(portfolioRef);
				break;
			case 4: // Eligibility
				scrollToSection(eligibilityRef);
				break;
			case 5: // FAQ's
				scrollToSection(faqsRef);
				break;
			case 6: // Calculator
				scrollToSection(calculatorRef);
				break;
			default:
				break;
		}
	};

	// Calculate future value
	const calculateFutureValue = () => {
		const principal = investmentAmount;
		const rate = expectedReturn / 100;
		const time = investmentTerm / 12; // Convert months to years
		const futureValue = principal * Math.pow(1 + rate, time);
		return futureValue.toFixed(2);
	};

	// Default fallback data (used if backend data is not available)
	const defaultInvestmentProducts = [
		{
			title: "Mutual Funds",
			description:
				"Invest in a diversified portfolio of stocks, bonds, or other securities managed by professional fund managers to meet specific investment objectives.",
			icon: <MoneyIcon fontSize='large' />,
		},
		{
			title: "Fixed Deposits",
			description:
				"Secure investment option with guaranteed returns over a fixed period. Ideal for conservative investors looking for stability and predictable income.",
			icon: <SavingsIcon fontSize='large' />,
		},
		{
			title: "Stocks & Securities",
			description:
				"Invest directly in publicly traded companies through stock markets. Potential for high returns with corresponding higher risks and market volatility.",
			icon: <AutoGraphIcon fontSize='large' />,
		},
		{
			title: "Retirement Plans",
			description:
				"Long-term investment plans designed to build a corpus for retirement years. Tax-efficient options with systematic investment approach for financial security.",
			icon: <GroupIcon fontSize='large' />,
		},
	];

	const defaultInvestmentFeatures = [
		{
			title: "Professional Management",
			description:
				"Our investment products are managed by experienced professionals with proven track records in wealth management and market analysis.",
			icon: <GroupIcon fontSize='large' />,
		},
		{
			title: "Customized Solutions",
			description:
				"We offer tailored investment strategies designed to match your financial goals, risk tolerance, and investment horizon.",
			icon: <DescriptionIcon fontSize='large' />,
		},
		{
			title: "Competitive Returns",
			description:
				"Our investment products aim to provide optimal returns based on market conditions and strategic asset allocation principles.",
			icon: <MoneyIcon fontSize='large' />,
		},
		{
			title: "Regular Monitoring",
			description:
				"We continuously track market trends and investment performance, making adjustments as needed to protect and grow your assets.",
			icon: <AccessTimeIcon fontSize='large' />,
		},
	];

	const defaultFaqs = [
		{
			question: "What is the minimum investment amount?",
			answer:
				"The minimum investment amount varies by product. Our mutual funds typically start at ₹5,000 for lump sum investments or ₹1,000 for monthly SIPs. Fixed deposits usually start at ₹10,000, while direct equity investments can begin with as little as the cost of a single share.",
		},
		{
			question: "How do I track my investment performance?",
			answer:
				"You can monitor your investments through our dedicated investor portal and mobile app. We also provide detailed quarterly reports and performance analytics. Additionally, our relationship managers are available to explain your portfolio performance and answer any questions.",
		},
		{
			question: "Can I withdraw my investments before maturity?",
			answer:
				"Most of our investment products offer liquidity options, but terms vary by product type. Mutual funds can generally be redeemed anytime (subject to exit loads in some cases). Fixed deposits may incur a penalty for premature withdrawal. Retirement plans typically have lock-in periods aligned with retirement goals.",
		},
		{
			question: "What tax implications should I consider?",
			answer:
				"Investment returns are subject to various tax regulations in India. Short-term and long-term capital gains taxes apply differently to different asset classes. Certain investments like ELSS mutual funds offer tax benefits under Section 80C. We recommend consulting with our tax advisors to optimize your investment strategy for tax efficiency.",
		},
	];

	// Use data from backend or fallback to defaults
	const investmentProducts = service?.loanProducts || defaultInvestmentProducts;
	const investmentFeatures = service?.features || defaultInvestmentFeatures;
	const faqs = service?.faqs || defaultFaqs;

	// Function to handle Apply Now button clicks (for services without packages)
	const handleApplyNow = (isLead = false) => {
		if (service) {
			navigate("/service-registration", {
				state: {
					service: service,
					selectedPackage: null,
					isLeadService: isLead,
				},
			});
		} else {
			showNotification(
				"Service information not available. Please try again later.",
				"error"
			);
		}
	};

	// Function to handle package selection (for services with packages)
	const handlePackageSelect = (pkg) => {
		if (service) {
			navigate("/service-registration", {
				state: {
					service: service,
					selectedPackage: pkg,
					isLeadService: false,
				},
			});
		} else {
			showNotification(
				"Service information not available. Please try again later.",
				"error"
			);
		}
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "50vh",
				}}>
				<Typography>Loading service details...</Typography>
			</Box>
		);
	}

	return (
		<ThemeProvider theme={theme}>
			<Box className='investment-page' style={{ marginTop: "100px" }}>
				{/* Hero Section */}
				<Box
					ref={heroRef}
					className='hero-section'
					sx={{
						position: "relative",
						background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${
							service?.heroImage || "/images/investment-hero.jpg"
						})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						borderBottom: "5px solid #1b321d",
						py: 8,
						mb: 5,
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundImage:
								"linear-gradient(135deg, rgba(27,50,29,0.5) 0%, rgba(198,219,206,0.3) 100%)",
							zIndex: 1,
						},
					}}>
					<Container sx={{ position: "relative", zIndex: 10 }}>
						<Grid container spacing={0} justifyContent="center">
							<Grid item xs={12} md={8} textAlign="center">
								<Typography
									variant='h1'
									color="white"
									gutterBottom
									sx={{
										fontSize: { xs: "2.4rem", md: "3.2rem" },
										fontWeight: 700,
										textShadow: "0 2px 10px rgba(0,0,0,0.3)",
										mb: 2
									}}>
									{service?.serviceName || "Investment Services"}
								</Typography>
								<Typography 
									variant="h6" 
									color="white"
									sx={{ 
										opacity: 0.9, 
										maxWidth: "700px", 
										margin: "0 auto", 
										mb: 4,
										textShadow: "0 1px 5px rgba(0,0,0,0.2)" 
									}}>
									Secure your future with expert investment management and personalized strategies
								</Typography>
								<Box 
									sx={{
										display: "flex",
										justifyContent: "center",
										gap: 3,
										flexWrap: { xs: "wrap", sm: "nowrap" }
									}}
								>
									<Button
										variant='contained'
										onClick={() => handleApplyNow(true)}
										sx={{
											bgcolor: "#1b321d",
											color: "#ffffff",
											"&:hover": { bgcolor: "#2C6040" },
											textTransform: "uppercase",
											fontWeight: 600,
											fontSize: "0.9rem",
											py: 1.5,
											px: 4,
											borderRadius: "4px",
										}}>
										START INVESTING
									</Button>
									<Button
										variant='outlined'
										onClick={scrollToCalculator}
										sx={{
											borderColor: "#ffffff",
											color: "#ffffff",
											"&:hover": { 
												bgcolor: "rgba(255,255,255,0.1)",
												borderColor: "#ffffff" 
											},
											textTransform: "uppercase",
											fontWeight: 600,
											fontSize: "0.9rem",
											py: 1.5,
											px: 4,
											borderRadius: "4px",
										}}>
										CALCULATE RETURNS
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Container>
				</Box>

				<Container sx={{ pb: 8 }}>
					<Grid container spacing={4}>
						{/* Left Sidebar Navigation */}
						<Grid item xs={12} md={3}>
							<SidebarNav>
								<List component="nav" aria-label="investment navigation">
									<SidebarNavItem 
										active={activeTab === 0}
										onClick={() => handleTabChange(null, 0)}
									>
										<ListItemIcon>
											<DescriptionIcon />
										</ListItemIcon>
										<ListItemText primary="About" />
									</SidebarNavItem>
									<SidebarNavItem 
										active={activeTab === 1}
										onClick={() => handleTabChange(null, 1)}
									>
										<ListItemIcon>
											<MoneyIcon />
										</ListItemIcon>
										<ListItemText primary="Investment Products" />
									</SidebarNavItem>
									<SidebarNavItem 
										active={activeTab === 2}
										onClick={() => handleTabChange(null, 2)}
									>
										<ListItemIcon>
											<AccountBalanceIcon />
										</ListItemIcon>
										<ListItemText primary="Features & Benefits" />
									</SidebarNavItem>
									<SidebarNavItem 
										active={activeTab === 3}
										onClick={() => handleTabChange(null, 3)}
									>
										<ListItemIcon>
											<AutoGraphIcon />
										</ListItemIcon>
										<ListItemText primary="Portfolio" />
									</SidebarNavItem>
									<SidebarNavItem 
										active={activeTab === 4}
										onClick={() => handleTabChange(null, 4)}
									>
										<ListItemIcon>
											<GroupIcon />
										</ListItemIcon>
										<ListItemText primary="Eligibility" />
									</SidebarNavItem>
									<SidebarNavItem 
										active={activeTab === 5}
										onClick={() => handleTabChange(null, 5)}
									>
										<ListItemIcon>
											<ExpandMoreIcon />
										</ListItemIcon>
										<ListItemText primary="FAQs" />
									</SidebarNavItem>
									<SidebarNavItem 
										active={activeTab === 6}
										onClick={() => handleTabChange(null, 6)}
										sx={{
											backgroundColor: activeTab === 6 ? alpha("#ff4081", 0.08) : "transparent",
											color: activeTab === 6 ? "#ff4081" : null,
											borderLeft: activeTab === 6 ? "4px solid #ff4081" : "4px solid transparent",
											"&:hover": {
												backgroundColor: alpha("#ff4081", 0.05),
												borderLeft: `4px solid ${alpha("#ff4081", 0.5)}`,
											},
											"& .MuiListItemIcon-root": {
												color: activeTab === 6 ? "#ff4081" : "#999",
											},
										}}
									>
										<ListItemIcon>
											<CalculateIcon />
										</ListItemIcon>
										<ListItemText primary="Calculator" />
									</SidebarNavItem>
								</List>
								
								{/* Contact info */}
								<Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
									<Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 600 }}>
										Need Help?
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										Our investment experts are here to guide you through your financial journey.
									</Typography>
									<Button 
										variant="contained"
										color="primary"
										fullWidth
										onClick={() => handleApplyNow(true)}
										sx={{ 
											textTransform: "none",
											fontWeight: 600
										}}
									>
										Get a Callback
									</Button>
								</Box>
							</SidebarNav>

							{/* Brochure download card - like in Finano */}
							<Paper 
								sx={{ 
									p: 3, 
									mt: 4,
									borderRadius: "8px",
									backgroundColor: "#1b321d",
									color: "white"
								}}
							>
								<Typography variant="h6" fontWeight={600} mb={2}>
									Investment Brochure
								</Typography>
								<Typography variant="body2" mb={3}>
									View our 2023 financial prospectus brochure for an easy to read guide on all our investment services.
								</Typography>
								<Button 
									variant="outlined"
									startIcon={<DescriptionIcon />}
									sx={{
										color: "white",
										borderColor: "white",
										"&:hover": {
											borderColor: "white",
											backgroundColor: "rgba(255,255,255,0.1)"
										}
									}}
								>
									Download Brochure
								</Button>
							</Paper>
						</Grid>
						
						{/* Right Content Area */}
						<Grid item xs={12} md={9}>
							<ContentSection>
								{/* Content sections will be displayed based on activeTab */}
								{activeTab === 0 && (
									<Box ref={aboutInvestmentRef} className="section-content">
										<Typography
											variant='h3'
											gutterBottom
											color='primary'
											sx={{
												fontWeight: 700,
												position: "relative",
												display: "inline-block",
												paddingBottom: "15px",
												marginBottom: "20px",
												color: "#1b321d",
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: 0,
													left: 0,
													width: "80px",
													height: "3px",
													background: "linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
												},
											}}>
											About {service?.serviceName || "Investment Services"}
										</Typography>
										
										<Typography
											variant='body1'
											paragraph
											sx={{
												fontSize: "1.1rem",
												lineHeight: 1.7,
												color: "#555",
												mb: 3,
											}}>
											{service?.description ||
												"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden."}
										</Typography>
										
										<Typography
											variant='body1'
											paragraph
											sx={{
												fontSize: "1.1rem",
												lineHeight: 1.7,
												color: "#555",
												mb: 3,
											}}>
											All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.
										</Typography>
										
										{/* Bullet points section from Finano template */}
										<Box sx={{ mb: 4 }}>
											<List>
												{[
													"Sed do eiusmod tempor incididunt ut",
													"Labore et dolore magna aliqua",
													"Ut enim ad minim veniam quis nostrud",
													"Randomised words which don't look",
												].map((item, index) => (
													<ListItem key={index} sx={{ py: 0.5 }}>
														<ListItemIcon sx={{ minWidth: 36 }}>
															<CheckCircleIcon sx={{ color: "#1b321d" }} />
														</ListItemIcon>
														<ListItemText primary={item} />
													</ListItem>
												))}
											</List>
										</Box>
										
										{/* Gallery with investment images - like in Finano */}
										<Grid container spacing={3} sx={{ mt: 4, mb: 5 }}>
											{[
												"/images/investment-gallery1.jpg",
												"/images/investment-gallery2.jpg",
												"/images/investment-gallery3.jpg"
											].map((img, index) => (
												<Grid item xs={12} md={4} key={index}>
													<Box
														sx={{
															height: 220,
															backgroundColor: "#e0e0e0",
															backgroundImage: `url(${img})`,
															backgroundSize: "cover",
															backgroundPosition: "center",
															borderRadius: "8px",
															boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
															transition: "transform 0.3s ease",
															"&:hover": {
																transform: "scale(1.03)"
															}
														}}
													/>
												</Grid>
											))}
										</Grid>
										
										{/* Investment approach tabs - like in Finano */}
										<Box sx={{ width: '100%', mt: 6 }}>
											<Typography variant="h4" gutterBottom fontWeight={600} color="#1b321d" mb={3}>
												Our Investment Approach
											</Typography>
											<Tabs
												value={expanded}
												onChange={(e, newValue) => setExpanded(newValue)}
												aria-label="investment-approach-tabs"
												sx={{
													mb: 3,
													"& .MuiTabs-indicator": {
														backgroundColor: "#1b321d",
													},
													"& .MuiTab-root": {
														color: "#555",
														fontWeight: 600,
														fontSize: "1rem",
														textTransform: "none",
														"&.Mui-selected": {
															color: "#1b321d",
														},
													},
												}}>
												<Tab label="Research" />
												<Tab label="Strategy" />
												<Tab label="Sustainability" />
											</Tabs>
											
											<Box sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "8px", minHeight: "200px" }}>
												{expanded === 0 && (
													<Box>
														<Typography variant="h5" gutterBottom fontWeight={600} color="#1b321d">
															Research
														</Typography>
														<Typography variant="body1" paragraph>
															Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
														</Typography>
														<Typography variant="body1">
															Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
														</Typography>
													</Box>
												)}
												
												{expanded === 1 && (
													<Box>
														<Typography variant="h5" gutterBottom fontWeight={600} color="#1b321d">
															Strategy
														</Typography>
														<Typography variant="body1" paragraph>
															Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
														</Typography>
														<Typography variant="body1">
															Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
														</Typography>
													</Box>
												)}
												
												{expanded === 2 && (
													<Box>
														<Typography variant="h5" gutterBottom fontWeight={600} color="#1b321d">
															Sustainability
														</Typography>
														<Typography variant="body1" paragraph>
															Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
														</Typography>
														<Typography variant="body1">
															Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
														</Typography>
													</Box>
												)}
											</Box>
										</Box>
									</Box>
								)}

								{/* Investment Products Section */}
								{activeTab === 1 && (
									<Box ref={investmentTypesRef} className="section-content">
										<Typography
											variant='h3'
											gutterBottom
											color='primary'
											sx={{
												fontWeight: 700,
												position: "relative",
												display: "inline-block",
												paddingBottom: "15px",
												marginBottom: "30px",
												color: "#1b321d",
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: 0,
													left: 0,
													width: "80px",
													height: "3px",
													background: "linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
												},
											}}>
											Investment Products
										</Typography>
										
										<Typography
											variant='body1'
											paragraph
											sx={{
												fontSize: "1.1rem",
												lineHeight: 1.7,
												color: "#555",
												mb: 4,
											}}>
											{service?.productsTagline ||
												"Choose from our diverse range of investment options to achieve your financial goals and secure your future. Our experts will guide you through selecting the right products for your needs."}
										</Typography>
										
										{/* Investment Products Cards - with enhanced styling */}
										<Grid container spacing={4}>
											{investmentProducts.map((product, index) => (
												<Grid item xs={12} md={6} key={index}>
													<Card
														sx={{
															display: 'flex',
															flexDirection: 'column',
															height: '100%',
															borderRadius: '8px',
															transition: 'all 0.3s ease',
															boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
															border: '1px solid #eaeaea',
															overflow: 'hidden',
															position: 'relative',
															"&:hover": {
																transform: "translateY(-5px)",
																boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
																"& .product-icon": {
																	transform: "scale(1.1) rotate(5deg)",
																	boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
																}
															},
															"&::before": {
																content: '""',
																position: "absolute",
																top: 0,
																left: 0,
																right: 0,
																height: "4px",
																background: "linear-gradient(to right, #1b321d, #c6dbce)",
																opacity: 0.8,
															}
														}}
													>
														<CardContent sx={{ p: 0, flexGrow: 1 }}>
															<Grid container>
																<Grid item xs={3} sx={{ 
																	bgcolor: '#f9f9f9',
																	display: 'flex',
																	flexDirection: 'column',
																	justifyContent: 'center',
																	alignItems: 'center',
																	p: 3,
																	borderRight: '1px solid #eaeaea'
																}}>
																	<Box 
																		className="product-icon"
																		sx={{ 
																			color: "#1b321d",
																			bgcolor: "rgba(198,219,206,0.3)",
																			p: 2,
																			borderRadius: "50%",
																			transition: "all 0.4s ease",
																			display: "flex",
																			alignItems: "center",
																			justifyContent: "center"
																		}}
																	>
																		{product.icon || <MoneyIcon fontSize='large' />}
																	</Box>
																</Grid>
																<Grid item xs={9}>
																	<Box sx={{ p: 3 }}>
																		<Typography
																			variant='h5'
																			component='h3'
																			gutterBottom
																			sx={{
																				fontWeight: 600,
																				color: "#1b321d",
																				fontSize: "1.3rem",
																				mb: 2,
																			}}>
																			{product.title}
																		</Typography>
																		<Typography
																			variant='body2'
																			color='text.secondary'
																			sx={{
																				fontSize: "0.95rem",
																				lineHeight: 1.6,
																			}}>
																			{product.description}
																		</Typography>
																	
																		<Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
																			<Button
																				endIcon={<ArrowForwardIcon />}
																				sx={{
																					color: "#1b321d",
																					"&:hover": {
																						backgroundColor: "rgba(27,50,29,0.05)"
																					}
																				}}
																			>
																				Learn More
																			</Button>
																		</Box>
																	</Box>
																</Grid>
															</Grid>
														</CardContent>
													</Card>
												</Grid>
											))}
										</Grid>
										
										{/* Compare investment returns */}
										<Paper sx={{ p: 4, mt: 5, borderRadius: "8px", bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
											<Typography variant="h5" gutterBottom sx={{ color: "#1b321d", fontWeight: 600, mb: 3 }}>
												Maximize Your Returns
											</Typography>
											<Typography variant="body1" paragraph>
												Our investment products offer competitive returns to help you achieve your financial goals faster. Speak with our advisors to find the best option for your needs.
											</Typography>
											<Button 
												variant="contained" 
												color="primary" 
												onClick={scrollToCalculator}
												endIcon={<CalculateIcon />}
												sx={{ mt: 2 }}
											>
												Calculate Returns
											</Button>
										</Paper>
									</Box>
								)}

								{/* Features & Benefits Section */}
								{activeTab === 2 && (
									<Box ref={featuresRef} className="section-content">
										<Typography
											variant='h3'
											gutterBottom
											color='primary'
											sx={{
												fontWeight: 700,
												position: "relative",
												display: "inline-block",
												paddingBottom: "15px",
												marginBottom: "30px",
												color: "#1b321d",
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: 0,
													left: 0,
													width: "80px",
													height: "3px",
													background: "linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
												},
											}}>
											Features & Benefits
										</Typography>
										
										<Typography
											variant='body1'
											paragraph
											sx={{
												fontSize: "1.1rem",
												lineHeight: 1.7,
												color: "#555",
												mb: 4,
											}}>
											{service?.featuresTagline ||
												"Discover the advantages of investing with us. Our tailored solutions are designed to help you achieve your financial goals with confidence and peace of mind."}
										</Typography>
										
										{/* Features with enhanced styling */}
										<Grid container spacing={4}>
											{investmentFeatures.map((feature, index) => (
												<Grid item xs={12} key={index}>
													<Paper 
														sx={{ 
															p: 0, 
															overflow: "hidden", 
															borderRadius: "8px",
															boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
															border: "1px solid #eaeaea",
															transition: "all 0.3s ease",
															"&:hover": {
																boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
																transform: "translateY(-3px)",
																"& .feature-icon-container": {
																	bgcolor: alpha(theme.palette.primary.main, 0.15),
																}
															}
														}}
													>
														<Grid container>
															<Grid item xs={12} sm={3} 
																className="feature-icon-container"
																sx={{
																	bgcolor: alpha(theme.palette.primary.main, 0.08),
																	display: "flex",
																	justifyContent: "center",
																	alignItems: "center",
																	p: 3,
																	transition: "all 0.3s ease",
																}}
															>
																<Box
																	sx={{
																		color: theme.palette.primary.main,
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																		borderRadius: "50%",
																		p: 1.5,
																		border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
																		transition: "all 0.3s ease",
																		"& .MuiSvgIcon-root": {
																		fontSize: "2.5rem",
																		}
																	}}
																>
																	{feature.icon || <DescriptionIcon fontSize='large' />}
																</Box>
															</Grid>
															<Grid item xs={12} sm={9}>
																<Box sx={{ p: 3 }}>
																	<Typography
																		variant='h5'
																		component='h3'
																		gutterBottom
																		sx={{
																			fontWeight: 600,
																			color: "#1b321d",
																			fontSize: "1.4rem",
																			mb: 2,
																		}}>
																		{feature.title}
																	</Typography>
																	<Typography
																		variant='body1'
																		color='text.secondary'
																		sx={{
																			fontSize: "1rem",
																			lineHeight: 1.6,
																		}}>
																		{feature.description}
																	</Typography>
																</Box>
															</Grid>
														</Grid>
													</Paper>
												</Grid>
											))}
										</Grid>
										
										{/* CTA Banner */}
										<Box
											sx={{
												mt: 6,
												p: 4,
												borderRadius: "8px",
												background: "linear-gradient(to right, #1b321d, #2C6040)",
												position: "relative",
												overflow: "hidden",
												boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
												"&::before": {
													content: '""',
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: "100%",
													backgroundImage: "radial-gradient(circle at 10% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
													zIndex: 0,
												}
											}}
										>
											<Grid container spacing={3} alignItems="center">
												<Grid item xs={12} md={8} sx={{ position: "relative", zIndex: 2 }}>
													<Typography variant="h4" color="white" fontWeight={600} gutterBottom>
														Ready to Start Your Investment Journey?
													</Typography>
													<Typography variant="body1" color="white" sx={{ opacity: 0.9 }}>
														Our experts are ready to help you build a personalized investment strategy.
													</Typography>
												</Grid>
												<Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" }, position: "relative", zIndex: 2 }}>
													<Button
														variant="contained"
														size="large"
														onClick={() => handleApplyNow(true)}
														sx={{
															bgcolor: "#ff4081",
															color: "white",
															"&:hover": { bgcolor: "#e0356f" },
															py: 1.5,
															px: 4,
															fontWeight: 600,
														}}
													>
														Get Started Now
													</Button>
												</Grid>
											</Grid>
										</Box>
									</Box>
								)}

								{/* Portfolio Section */}
								{activeTab === 3 && (
									<Box ref={eligibilityRef} className="section-content">
										<Typography
											variant='h3'
											gutterBottom
											color='primary'
											sx={{
												fontWeight: 700,
												position: "relative",
												display: "inline-block",
												paddingBottom: "15px",
												marginBottom: "30px",
												color: "#1b321d",
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: 0,
													left: 0,
													width: "80px",
													height: "3px",
													background: "linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
												},
											}}>
											Investment Eligibility
										</Typography>
										
										<Typography
											variant='body1'
											paragraph
											sx={{
												fontSize: "1.1rem",
												lineHeight: 1.7,
												color: "#555",
												mb: 4,
											}}>
											{service?.eligibilityText ||
												"To begin your investment journey with us, you need to meet the following basic requirements. Our team is ready to guide you through the process and help you get started on your path to financial growth."}
										</Typography>
										
										{/* Eligibility cards with enhanced styling */}
										<Grid container spacing={4}>
											{(
												service?.eligibilityCriteria || [
													{
														title: "KYC Documentation",
														description:
															"Valid ID proof, Address proof, PAN card, and recent photograph",
													},
													{
														title: "Minimum Investment",
														description: "Starting from ₹10,000 for most investment products",
													},
													{
														title: "Bank Account",
														description:
															"Active savings account with a recognized bank for fund transfers",
													},
												]
											).map((criteria, index) => (
												<Grid item xs={12} key={index}>
													<Paper
														sx={{
															p: 0,
															borderRadius: "8px",
															boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
															overflow: "hidden",
															position: "relative",
															transition: "all 0.3s ease",
															"&:hover": {
																transform: "translateY(-5px)",
																boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
																"& .eligibility-icon": {
																	transform: "rotate(360deg)",
																	borderColor: theme.palette.primary.main,
																},
															},
														}}>
														<Grid container>
															<Grid item xs={12} sm={3} sx={{ 
																bgcolor: "#f9f9f9", 
																p: 3,
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																borderRight: "1px solid #eaeaea"
															}}>
																<Box
																	className="eligibility-icon"
																	sx={{
																		width: 80,
																		height: 80,
																		borderRadius: "50%",
																		border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																		fontSize: "2rem",
																		fontWeight: 700,
																		color: theme.palette.primary.main,
																		bgcolor: alpha(theme.palette.primary.main, 0.08),
																		transition: "all 0.5s ease",
																	}}
																>
																	{index + 1}
																</Box>
															</Grid>
															<Grid item xs={12} sm={9}>
																<Box sx={{ p: 3 }}>
																	<Typography
																		variant='h5'
																		gutterBottom
																		sx={{
																			fontWeight: 600,
																			color: "#1b321d",
																			position: "relative",
																			paddingBottom: "8px",
																			marginBottom: "12px",
																			display: "inline-block",
																			"&::after": {
																				content: '""',
																				position: "absolute",
																				bottom: 0,
																				left: 0,
																				width: "50px",
																				height: "2px",
																				background: "#8cc63f",
																			},
																		}}>
																		{criteria.title}
																	</Typography>
																	<Typography
																		variant='body1'
																		sx={{
																			color: "#555",
																			fontSize: "1rem",
																			lineHeight: 1.6,
																		}}>
																		{criteria.description}
																	</Typography>
																</Box>
															</Grid>
														</Grid>
													</Paper>
												</Grid>
											))}
										</Grid>
										
										{/* Additional information box */}
										<Paper 
											sx={{ 
												p: 4, 
												mt: 5, 
												borderRadius: "8px",
												background: "linear-gradient(to right bottom, #f9fbfa, #f5f9f6)",
												border: "1px solid #e0e0e0"
											}}
										>
											<Grid container spacing={4} alignItems="center">
												<Grid item xs={12} md={8}>
													<Typography variant="h5" gutterBottom sx={{ color: "#1b321d", fontWeight: 600 }}>
														Don't Meet All Requirements?
													</Typography>
													<Typography variant="body1" paragraph>
														We can still help you start your investment journey. Our team can work with you to find alternative investment options based on your current situation.
													</Typography>
													<List>
														<ListItem sx={{ py: 1, px: 0 }}>
															<ListItemIcon sx={{ minWidth: 36 }}>
																<CheckCircleIcon sx={{ color: "#1b321d" }} />
															</ListItemIcon>
															<ListItemText primary="Personalized investment advice" />
														</ListItem>
														<ListItem sx={{ py: 1, px: 0 }}>
															<ListItemIcon sx={{ minWidth: 36 }}>
																<CheckCircleIcon sx={{ color: "#1b321d" }} />
															</ListItemIcon>
															<ListItemText primary="Step-by-step KYC assistance" />
														</ListItem>
														<ListItem sx={{ py: 1, px: 0 }}>
															<ListItemIcon sx={{ minWidth: 36 }}>
																<CheckCircleIcon sx={{ color: "#1b321d" }} />
															</ListItemIcon>
															<ListItemText primary="Flexible minimum investment options" />
														</ListItem>
													</List>
												</Grid>
												<Grid item xs={12} md={4}>
													<Button
														variant="contained"
														fullWidth
														onClick={() => handleApplyNow(true)}
														sx={{
															bgcolor: "#1b321d",
															color: "#ffffff",
															py: 1.5,
															"&:hover": { bgcolor: "#2C6040" },
															textTransform: "none",
															fontSize: "1rem",
															fontWeight: 600,
														}}
													>
														Talk to an Advisor
													</Button>
													<Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "#666" }}>
														No obligation consultation
													</Typography>
												</Grid>
											</Grid>
										</Paper>
									</Box>
								)}

								{/* FAQ Section */}
								{activeTab === 5 && (
									<Box ref={faqsRef} className="section-content">
										<Typography
											variant='h3'
											gutterBottom
											color='primary'
											sx={{
												fontWeight: 700,
												position: "relative",
												display: "inline-block",
												paddingBottom: "15px",
												marginBottom: "30px",
												color: "#1b321d",
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: 0,
													left: 0,
													width: "80px",
													height: "3px",
													background: "linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
												},
											}}>
											Frequently Asked Questions
										</Typography>
										
										<Typography
											variant='body1'
											paragraph
											sx={{
												fontSize: "1.1rem",
												lineHeight: 1.7,
												color: "#555",
												mb: 4,
											}}>
											{service?.faqTagline ||
												"Find answers to common questions about our investment services. If you have additional questions, please contact our support team for personalized assistance."}
										</Typography>
										
										{/* Enhanced FAQ accordion */}
										<Box sx={{ mb: 5 }}>
											{faqs.map((faq, index) => (
												<Accordion
													key={index}
													expanded={expanded === (index + 10)} // Offset to not conflict with about tabs
													onChange={() =>
														setExpanded(expanded === (index + 10) ? false : (index + 10))
													}
													sx={{
														mb: 2,
														boxShadow: "none",
														"&:before": {
															display: "none",
														},
														border: "1px solid #e0e0e0",
														borderRadius: "8px !important",
														overflow: "hidden",
														"&.Mui-expanded": {
															borderColor: alpha(theme.palette.primary.main, 0.3),
															boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.08)}`,
														},
													}}>
													<AccordionSummary
														expandIcon={<ExpandMoreIcon sx={{ 
															color: expanded === (index + 10) ? theme.palette.primary.main : "#666",
															transform: expanded === (index + 10) ? "rotate(180deg)" : "rotate(0deg)",
															transition: "transform 0.3s ease"
														}} />}
														sx={{
															backgroundColor: expanded === (index + 10) ? alpha(theme.palette.primary.main, 0.04) : "#fff",
															borderBottom:
																expanded === (index + 10) ? "1px solid #e0e0e0" : "none",
															"&:hover": {
																backgroundColor: alpha(theme.palette.primary.main, 0.02),
															},
															padding: "0 24px",
														}}>
														<Typography
															variant='h6'
															sx={{
																fontSize: "1.1rem",
																fontWeight: 600,
																color: expanded === (index + 10) ? theme.palette.primary.main : "#333",
																py: 2,
															}}>
															{faq.question}
														</Typography>
													</AccordionSummary>
													<AccordionDetails sx={{ p: 3, backgroundColor: alpha(theme.palette.background.paper, 0.4) }}>
														<Typography
															variant='body1'
															sx={{
																color: "#555",
																lineHeight: 1.7,
															}}>
															{faq.answer}
														</Typography>
													</AccordionDetails>
												</Accordion>
											))}
										</Box>
										
										{/* Contact us for more questions */}
										<Paper
											sx={{
												p: 4,
												borderRadius: "8px",
												background: "linear-gradient(135deg, #1b321d 0%, #2C6040 100%)",
												color: "white",
												position: "relative",
												overflow: "hidden",
												"&::before": {
													content: '""',
													position: "absolute",
													top: -50,
													right: -50,
													width: 200,
													height: 200,
													borderRadius: "50%",
													background: "rgba(255,255,255,0.1)",
													zIndex: 0,
												},
											}}
										>
											<Box sx={{ position: "relative", zIndex: 1 }}>
												<Typography variant="h5" gutterBottom fontWeight={600}>
													Still Have Questions?
												</Typography>
												<Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
													Our investment experts are ready to answer any questions you may have about our services or how to get started.
												</Typography>
												<Grid container spacing={2}>
													<Grid item xs={12} sm={6}>
														<Button
															fullWidth
															variant="contained"
															sx={{
																bgcolor: "rgba(255,255,255,0.9)",
																color: "#1b321d",
																"&:hover": { bgcolor: "#ffffff" },
																fontWeight: 600,
															}}
															onClick={() => handleApplyNow(true)}
														>
															Contact Us
														</Button>
													</Grid>
													<Grid item xs={12} sm={6}>
														<Button
															fullWidth
															variant="outlined"
															sx={{
																borderColor: "rgba(255,255,255,0.5)",
																color: "#ffffff",
																"&:hover": { 
																	borderColor: "#ffffff",
																	bgcolor: "rgba(255,255,255,0.1)" 
																},
																fontWeight: 600,
															}}
															onClick={() => window.location.href = "/contact"}
														>
															View Support Options
														</Button>
													</Grid>
												</Grid>
											</Box>
										</Paper>
									</Box>
								)}

								{/* Calculator Section */}
								{activeTab === 6 && (
									<Box ref={calculatorRef} className="section-content">
										<Typography
											variant='h3'
											gutterBottom
											color='primary'
											sx={{
												fontWeight: 700,
												position: "relative",
												display: "inline-block",
												paddingBottom: "15px",
												marginBottom: "30px",
												color: "#1b321d",
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: 0,
													left: 0,
													width: "80px",
													height: "3px",
													background: "linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
												},
											}}>
											Investment Returns Calculator
										</Typography>
										
										<Typography
											variant='body1'
											paragraph
											sx={{
												fontSize: "1.1rem",
												lineHeight: 1.7,
												color: "#555",
												mb: 4,
											}}>
											Use our simple calculator to estimate the future value of your investments. Adjust the parameters to see how different factors affect your potential returns.
										</Typography>
										
										{/* Enhanced calculator with more visual appeal */}
										<Paper
											sx={{
												p: 0,
												borderRadius: "12px",
												boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
												overflow: "hidden",
												border: "1px solid #e0e0e0",
											}}
										>
											<Grid container>
												<Grid item xs={12} md={4} sx={{ bgcolor: "#1b321d", color: "white", position: "relative" }}>
													<Box 
														sx={{ 
															p: 4, 
															height: "100%",
															display: "flex",
															flexDirection: "column",
															justifyContent: "center",
															position: "relative",
															zIndex: 2,
														}}
													>
														<Typography variant="h4" gutterBottom fontWeight={700}>
															Future Value
														</Typography>
														<Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
															₹{calculateFutureValue()}
														</Typography>
														<Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 2 }} />
														<Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
															Based on your inputs:
														</Typography>
														<Box sx={{ mb: 1 }}>
															<Typography variant="body2" sx={{ opacity: 0.7 }}>
																Initial Investment
															</Typography>
															<Typography variant="h6" fontWeight={600}>
																₹{investmentAmount.toLocaleString()}
															</Typography>
														</Box>
														<Box sx={{ mb: 1 }}>
															<Typography variant="body2" sx={{ opacity: 0.7 }}>
																Time Period
															</Typography>
															<Typography variant="h6" fontWeight={600}>
																{investmentTerm / 12} {investmentTerm <= 12 ? 'Year' : 'Years'}
															</Typography>
														</Box>
														<Box>
															<Typography variant="body2" sx={{ opacity: 0.7 }}>
																Expected Annual Return
															</Typography>
															<Typography variant="h6" fontWeight={600}>
																{expectedReturn}%
															</Typography>
														</Box>
													</Box>
													<Box 
														sx={{ 
															position: "absolute", 
															bottom: "-30px", 
															right: "-30px", 
															width: "150px", 
															height: "150px", 
															borderRadius: "50%",
															background: "rgba(255,255,255,0.07)",
															zIndex: 1 
														}} 
													/>
													<Box 
														sx={{ 
															position: "absolute", 
															top: "30px", 
															left: "20px", 
															width: "80px", 
															height: "80px", 
															borderRadius: "50%",
															background: "rgba(255,255,255,0.05)",
															zIndex: 1 
														}} 
													/>
												</Grid>
												<Grid item xs={12} md={8}>
													<Box sx={{ p: 4 }}>
														<Typography variant="h5" gutterBottom fontWeight={600} color="#1b321d">
															Adjust Your Parameters
														</Typography>
														<Box sx={{ mt: 4 }}>
															<Typography
																gutterBottom
																sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
																Investment Amount
															</Typography>
															<Slider
																value={investmentAmount}
																onChange={(e, newValue) => setInvestmentAmount(newValue)}
																min={10000}
																max={1000000}
																step={10000}
																valueLabelDisplay='auto'
																sx={{
																	mb: 1,
																	color: "#1b321d",
																	"& .MuiSlider-rail": {
																		opacity: 0.3,
																	},
																	"& .MuiSlider-thumb": {
																		width: 14,
																		height: 14,
																		backgroundColor: "#fff",
																		border: "2px solid currentColor",
																		"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
																		boxShadow: "0px 0px 0px 8px rgba(27, 50, 29, 0.16)",
																		},
																	},
																}}
															/>
															<TextField
																fullWidth
																value={investmentAmount}
																onChange={(e) => 
																	setInvestmentAmount(
																		Math.max(10000, Math.min(1000000, Number(e.target.value)))
																	)
																}
																InputProps={{
																	startAdornment: (
																		<InputAdornment position='start'>₹</InputAdornment>
																	),
																}}
																variant='outlined'
																margin='dense'
															/>
														</Box>

														<Box sx={{ mt: 4 }}>
															<Typography
																gutterBottom
																sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
																Investment Period (Months)
															</Typography>
															<Slider
																value={investmentTerm}
																onChange={(e, newValue) => setInvestmentTerm(newValue)}
																min={6}
																max={60}
																step={6}
																valueLabelDisplay='auto'
																sx={{
																	mb: 1,
																	color: "#1b321d",
																	"& .MuiSlider-rail": {
																		opacity: 0.3,
																	},
																}}
															/>
															<TextField
																fullWidth
																value={investmentTerm}
																onChange={(e) =>
																	setInvestmentTerm(
																		Math.max(6, Math.min(60, Number(e.target.value)))
																	)
																}
																InputProps={{
																	endAdornment: (
																		<InputAdornment position='end'>months</InputAdornment>
																	),
																}}
																variant='outlined'
																margin='dense'
															/>
														</Box>

														<Box sx={{ mt: 4 }}>
															<Typography
																gutterBottom
																sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
																Expected Annual Return (%)
															</Typography>
															<Slider
																value={expectedReturn}
																onChange={(e, newValue) => setExpectedReturn(newValue)}
																min={4}
																max={24}
																step={0.5}
																valueLabelDisplay='auto'
																sx={{
																	mb: 1,
																	color: "#1b321d",
																	"& .MuiSlider-rail": {
																		opacity: 0.3,
																	},
																}}
															/>
															<TextField
																fullWidth
																value={expectedReturn}
																onChange={(e) =>
																	setExpectedReturn(
																		Math.max(4, Math.min(24, Number(e.target.value)))
																	)
																}
																InputProps={{
																	endAdornment: (
																		<InputAdornment position='end'>%</InputAdornment>
																	),
																}}
																variant='outlined'
																margin='dense'
															/>
														</Box>

														<Box sx={{ mt: 4, textAlign: "center" }}>
															<Button
																variant='contained'
																size='large'
																onClick={() => handleApplyNow(true)}
																sx={{
																	bgcolor: "#ff4081",
																	color: "#ffffff",
																	"&:hover": { bgcolor: "#e0356f" },
																	py: 1.5,
																	px: 5,
																	fontWeight: 600,
																}}>
																Start Investing Now
															</Button>
														</Box>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Box>
								)}

								{/* Eligibility Section */}
								{activeTab === 4 && (
									<Box ref={portfolioRef} className="section-content">
										<Typography
											variant='h3'
											gutterBottom
											color='primary'
											sx={{
												fontWeight: 700,
												position: "relative",
												display: "inline-block",
												paddingBottom: "15px",
												marginBottom: "30px",
												color: "#1b321d",
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: 0,
													left: 0,
													width: "80px",
													height: "3px",
													background: "linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
												},
											}}>
											Portfolio Overview
										</Typography>
										
										<Typography
											variant='body1'
											paragraph
											sx={{
												fontSize: "1.1rem",
												lineHeight: 1.7,
												color: "#555",
												mb: 4,
											}}>
											Explore our diverse investment portfolio options designed to meet various financial goals and risk appetites. Our expert-managed portfolios are tailored to deliver optimal returns based on your investment horizon.
										</Typography>
										
										{/* Portfolio showcase with table */}
										<TableContainer component={Paper} sx={{ mb: 5, boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
											<Table>
												<TableHead>
													<TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
														<TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Portfolio Type</TableCell>
														<TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Risk Level</TableCell>
														<TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Asset Mix</TableCell>
														<TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Target Return</TableCell>
														<TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Minimum Investment</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{[
														{
															type: "Conservative",
															risk: "Low",
															assetMix: "70% Debt, 20% Equity, 10% Gold",
															targetReturn: "8-10%",
															minInvestment: "₹50,000"
														},
														{
															type: "Balanced",
															risk: "Medium",
															assetMix: "50% Debt, 40% Equity, 10% Alternative",
															targetReturn: "10-14%",
															minInvestment: "₹25,000"
														},
														{
															type: "Growth",
															risk: "High",
															assetMix: "25% Debt, 65% Equity, 10% Alternative",
															targetReturn: "14-18%",
															minInvestment: "₹100,000"
														},
														{
															type: "Aggressive",
															risk: "Very High",
															assetMix: "10% Debt, 80% Equity, 10% Alternative",
															targetReturn: "18-22%",
															minInvestment: "₹250,000"
														}
													].map((portfolio, index) => (
														<TableRow 
															key={index}
															sx={{ 
																"&:nth-of-type(odd)": { 
																	bgcolor: alpha(theme.palette.primary.main, 0.02) 
																},
																"&:hover": {
																	bgcolor: alpha(theme.palette.primary.main, 0.05)
																}
															}}
														>
															<TableCell sx={{ fontWeight: 500 }}>{portfolio.type}</TableCell>
															<TableCell>{portfolio.risk}</TableCell>
															<TableCell>{portfolio.assetMix}</TableCell>
															<TableCell>{portfolio.targetReturn}</TableCell>
															<TableCell>{portfolio.minInvestment}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
										
										{/* Investment timeline section */}
										<Box sx={{ mt: 6, mb: 5 }}>
											<Typography variant="h4" gutterBottom sx={{ color: "#1b321d", fontWeight: 600, mb: 3 }}>
												Investment Timeline
											</Typography>
											<Typography variant="body1" paragraph>
												Our portfolios are designed for various investment horizons to align with your financial goals:
											</Typography>
											
											<Grid container spacing={3} sx={{ mt: 2 }}>
												{[
													{
														title: "Short Term",
														period: "1-3 Years",
														description: "Focused on capital preservation with steady returns"
													},
													{
														title: "Medium Term",
														period: "3-7 Years",
														description: "Balanced approach with moderate growth and stability"
													},
													{
														title: "Long Term",
														period: "7+ Years",
														description: "Emphasis on capital appreciation and wealth building"
													}
												].map((item, index) => (
													<Grid item xs={12} md={4} key={index}>
														<Paper
															sx={{
																p: 3,
																height: "100%",
																borderRadius: "8px",
																border: "1px solid #e0e0e0",
																transition: "all 0.3s ease",
																position: "relative",
																overflow: "hidden",
																"&:hover": {
																	transform: "translateY(-5px)",
																	boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
																},
																"&::before": {
																	content: '""',
																	position: "absolute",
																	top: 0,
																	left: 0,
																	width: "100%",
																	height: "4px",
																	background: "linear-gradient(to right, #1b321d, #c6dbce)",
																}
															}}
														>
															<Typography variant="h5" gutterBottom fontWeight={600} color="#1b321d">
																{item.title}
															</Typography>
															<Typography variant="subtitle1" gutterBottom color="text.secondary" fontWeight={500}>
																{item.period}
															</Typography>
															<Typography variant="body1">
																{item.description}
															</Typography>
														</Paper>
													</Grid>
												))}
											</Grid>
										</Box>
										
										{/* CTA for portfolio consultation */}
										<Box
											sx={{
												mt: 6,
												p: 4,
												borderRadius: "8px",
												background: "linear-gradient(135deg, #f5f9f6, #ffffff)",
												border: "1px solid #e0e0e0",
												position: "relative",
												overflow: "hidden",
											}}
										>
											<Grid container spacing={3} alignItems="center">
												<Grid item xs={12} md={8}>
													<Typography variant="h5" gutterBottom fontWeight={600} color="#1b321d">
														Personalized Portfolio Analysis
													</Typography>
													<Typography variant="body1" paragraph>
														Get a comprehensive analysis of your current investments and recommendations for optimizing your portfolio based on your financial goals and risk tolerance.
													</Typography>
													<List>
														<ListItem sx={{ py: 0.5, px: 0 }}>
															<ListItemIcon sx={{ minWidth: 36 }}>
																<CheckCircleIcon sx={{ color: "#1b321d" }} />
															</ListItemIcon>
															<ListItemText primary="Expert portfolio evaluation" />
														</ListItem>
														<ListItem sx={{ py: 0.5, px: 0 }}>
															<ListItemIcon sx={{ minWidth: 36 }}>
																<CheckCircleIcon sx={{ color: "#1b321d" }} />
															</ListItemIcon>
															<ListItemText primary="Asset allocation recommendations" />
														</ListItem>
														<ListItem sx={{ py: 0.5, px: 0 }}>
															<ListItemIcon sx={{ minWidth: 36 }}>
																<CheckCircleIcon sx={{ color: "#1b321d" }} />
															</ListItemIcon>
															<ListItemText primary="Risk assessment and optimization" />
														</ListItem>
													</List>
												</Grid>
												<Grid item xs={12} md={4}>
													<Button
														variant="contained"
														fullWidth
														onClick={() => handleApplyNow(true)}
														sx={{
															bgcolor: "#1b321d",
															color: "#ffffff",
															py: 1.5,
															"&:hover": { bgcolor: "#2C6040" },
															textTransform: "none",
															fontSize: "1rem",
															fontWeight: 600,
														}}
													>
														Get Portfolio Analysis
													</Button>
												</Grid>
											</Grid>
										</Box>
									</Box>
								)}
							</ContentSection>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</ThemeProvider>
	);
};

export default InvestmentsPage; 