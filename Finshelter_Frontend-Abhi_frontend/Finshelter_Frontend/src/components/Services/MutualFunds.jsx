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
	CardMedia,
	CardActions,
	Stack,
	ListItemButton,
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
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BalanceIcon from "@mui/icons-material/Balance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShieldIcon from "@mui/icons-material/Shield";
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
	[theme.breakpoints.down("sm")]: {
		padding: "10px 20px",
		fontSize: "0.85rem",
		width: "100%", // Full width buttons on mobile
		marginBottom: "10px", // Space between stacked buttons
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
		},
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
	},
	[theme.breakpoints.down("sm")]: {
		marginBottom: "20px", // Add spacing between cards on mobile
	},
}));

// Enhanced feature box with subtle gradient
const FeatureBox = styled(Box)(({ theme }) => ({
	textAlign: "center",
	padding: theme.spacing(3),
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
		},
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		background:
			"linear-gradient(135deg, rgba(27,50,29,0.03) 0%, rgba(198,219,206,0.1) 100%)",
		zIndex: 0,
		transform: "translateY(100%)",
		transition: "transform 0.4s ease",
	},
	[theme.breakpoints.down("sm")]: {
		padding: theme.spacing(2), // Less padding on mobile
		marginBottom: "15px", // Additional spacing between feature boxes
	},
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
	[theme.breakpoints.down("md")]: {
		position: "relative",
		top: 0,
		marginBottom: "20px",
	},
}));

const SidebarNavItem = styled(ListItem)(({ theme, active }) => ({
	borderBottom: "1px solid #eaeaea",
	cursor: "pointer",
	padding: "16px 20px",
	transition: "all 0.3s ease",
	backgroundColor: active
		? alpha(theme.palette.primary.main, 0.08)
		: "transparent",
	color: active ? theme.palette.primary.main : theme.palette.text.primary,
	borderLeft: active
		? `4px solid ${theme.palette.primary.main}`
		: "4px solid transparent",
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

// Mobile menu component for section navigation on small screens
const MobileSectionMenu = ({ activeTab, handleTabChange }) => {
	return (
		<Box sx={{ mb: 4, mt: 2, display: { xs: 'block', md: 'none' } }}>
			<FormControl fullWidth variant="outlined" sx={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
				<Select
					value={activeTab}
					onChange={(e) => handleTabChange(e, e.target.value)}
					sx={{ 
						'& .MuiSelect-select': { 
							py: 1.5, 
							fontWeight: 500,
							color: 'primary.main'
						}
					}}
				>
					<MenuItem value={0}>About Mutual Funds</MenuItem>
					<MenuItem value={1}>Investment Types</MenuItem>
					<MenuItem value={2}>How It Works</MenuItem>
					<MenuItem value={3}>Features & Benefits</MenuItem>
					<MenuItem value={4}>Portfolio Options</MenuItem>
					<MenuItem value={5}>Eligibility</MenuItem>
					<MenuItem value={6}>FAQ's</MenuItem>
					<MenuItem value={7}>Return Calculator</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
};

const MutualFundsPage = () => {
	// Service ID from backend - update this for Investments page
	const SERVICE_ID = "SER117"; // Replace with your actual service ID for investments
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
	
	// Enhanced sticky sidebar behavior 
	const [sidebarPosition, setSidebarPosition] = useState({
		isSticky: false,
		shouldStop: false
	});
	
	// Refs for tracking content and sidebar positions
	const contentRef = useRef(null);
	const sidebarRef = useRef(null);
	const sidebarContainerRef = useRef(null);

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
	const howItWorksRef = useRef(null);

	// Additional state for tab height
	const [tabHeight, setTabHeight] = useState(0);

	// Enhanced scroll handler to control sidebar behavior
	useEffect(() => {
		const handleSidebarScroll = () => {
			if (!contentRef.current || !sidebarRef.current || !sidebarContainerRef.current) return;
			
			const scrollPosition = window.scrollY;
			const topThreshold = 109; // Specified threshold
			
			// Get the content and sidebar boundaries
			const contentTop = contentRef.current.getBoundingClientRect().top + window.scrollY;
			const contentBottom = contentRef.current.getBoundingClientRect().bottom + window.scrollY;
			const sidebarContainerTop = sidebarContainerRef.current.offsetTop;
			const sidebarHeight = sidebarRef.current.clientHeight;
			
			// Determine if sidebar should be sticky - only when content has scrolled to threshold
			const isSticky = scrollPosition > topThreshold && scrollPosition > sidebarContainerTop - topThreshold;
			
			// Should sidebar stop following and anchor to bottom?
			const shouldStop = scrollPosition + topThreshold + sidebarHeight > contentBottom - 30;
			
			setSidebarPosition({
				isSticky,
				shouldStop
			});
		};

		window.addEventListener("scroll", handleSidebarScroll);
		handleSidebarScroll(); // Run once immediately to set initial state
		
		// Call on window resize too
		window.addEventListener("resize", handleSidebarScroll);
		
		return () => {
			window.removeEventListener("scroll", handleSidebarScroll);
			window.removeEventListener("resize", handleSidebarScroll);
		};
	}, []);

	// Scroll listener for fixed tabs
	useEffect(() => {
		const handleScroll = () => {
			const tabsContainer = document.getElementById("sticky-tabs-container");
			if (tabsContainer) {
				// Get tab height once for the spacer
				if (tabHeight === 0) {
					setTabHeight(tabsContainer.offsetHeight);
				}

				// Make tabs sticky at 100px from top
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
			setActiveTab(7); // Switch to calculator tab
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
			case 2: // How It Works
				scrollToSection(howItWorksRef);
				break;
			case 3: // Features & Benefits
				scrollToSection(featuresRef);
				break;
			case 4: // Portfolio
				scrollToSection(portfolioRef);
				break;
			case 5: // Eligibility
				scrollToSection(eligibilityRef);
				break;
			case 6: // FAQ's
				scrollToSection(faqsRef);
				break;
			case 7: // Calculator
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
			<Box className='service-page mutual-funds-page' ref={contentRef}>
				{/* Hero Section with background image */}
				<Box
					ref={heroRef}
					className='service-hero'
					sx={{
						backgroundColor: "#f8f9fa",
						pt: { xs: "120px", md: "196px" }, // Responsive padding top
						pb: { xs: 4, md: 6 }, // Responsive padding bottom
						position: "relative",
						overflow: "hidden",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundImage: "url('/images/mutualFunds.jpg')",
							backgroundSize: "cover",
							backgroundPosition: "center",
							opacity: 0.8,
							zIndex: 0,
						},
						"&::after": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay
							zIndex: 1,
						},
					}}>
					<Container maxWidth='xl'>
						<Grid container spacing={3} alignItems='center'>
							<Grid
								item
								xs={12}
								md={6}
								sx={{ position: "relative", zIndex: 2 }}>
								{" "}
								{/* Increased z-index to appear above overlay */}
								<Typography
									variant='h2'
									component='h1'
									sx={{
										fontWeight: 700,
										fontSize: { xs: "2.2rem", sm: "2.5rem", md: "3.5rem" },
										color: "#ffffff", // Changed to white
										mb: 2,
										textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
										textAlign: { xs: "center", md: "left" }, // Center on mobile
									}}>
									{service?.name || "Mutual Funds"}
								</Typography>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 500,
										mb: 3,
										color: "#ffffff", // Changed to white
										textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
										textAlign: { xs: "center", md: "left" }, // Center on mobile
										fontSize: { xs: "1.2rem", md: "1.5rem" }, // Smaller on mobile
									}}>
									{service?.tagline ||
										"Grow your wealth with professionally managed investments"}
								</Typography>
								<Typography
									variant='body1'
									paragraph
									sx={{
										fontSize: { xs: "1rem", md: "1.1rem" },
										lineHeight: 1.7,
										mb: 4,
										maxWidth: "600px",
										color: "#ffffff", // Changed to white
										textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
										textAlign: { xs: "center", md: "left" }, // Center on mobile
										mx: { xs: "auto", md: 0 }, // Center on mobile
									}}>
									{service?.shortDescription ||
										"Build a diversified investment portfolio tailored to your financial goals with our expert-managed mutual fund solutions."}
								</Typography>
								<Stack 
									direction={{ xs: 'column', sm: 'row' }} 
									spacing={2} 
									sx={{ 
										justifyContent: { xs: 'center', md: 'flex-start' } // Center on mobile
									}}>
									<StyledButton
										variant='contained'
										color='primary'
										onClick={() => handleApplyNow("Hero")}
										endIcon={<ArrowForwardIcon />}
										size='large'
										sx={{ py: 1.5, px: 3, fontWeight: 500 }}>
										Start Investing
									</StyledButton>
									<StyledButton
										variant='outlined'
										onClick={scrollToCalculator}
										endIcon={<CalculateIcon />}
										size='large'
										sx={{
											py: 1.5,
											px: 3,
											fontWeight: 500,
											color: "#ffffff",
											borderColor: "#ffffff",
											"&:hover": {
												borderColor: "#c6dbce",
												backgroundColor: "rgba(255, 255, 255, 0.1)",
											},
										}}>
										Calculate Returns
									</StyledButton>
								</Stack>
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								sx={{ position: "relative", zIndex: 2 }}>
								{" "}
								{/* Increased z-index to appear above overlay */}
								{/* Hero image or illustration can be added here */}
							</Grid>
						</Grid>
					</Container>
				</Box>

				{/* Content Sections */}
				<Container maxWidth='xl' sx={{ py: { xs: 3, md: 6 } }}>
					{/* Mobile navigation dropdown */}
					<MobileSectionMenu activeTab={activeTab} handleTabChange={handleTabChange} />
					
					{/* Tabs navigation - visible on desktop/tablet */}
					<Box id='tabs-spacer' sx={{ height: tabHeight, display: "none" }} />
					<Box
						id='sticky-tabs-container'
						sx={{
							backgroundColor: "#fff",
							zIndex: 10,
							width: "100%",
							transition: "all 0.3s ease",
							boxShadow: "none",
							display: { xs: "none", md: "block" }, // Hide on mobile
							"&.fixed-tabs": {
								position: "fixed",
								top: "100px", // Set top position to 100px
								left: 0,
								right: 0,
								boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
								"& .MuiTabs-indicator": {
									bottom: 0,
								},
							},
						}}>
						<Container maxWidth='xl'>
							<Tabs
								value={activeTab}
								onChange={handleTabChange}
								variant='scrollable'
								scrollButtons={isMobile ? "auto" : false}
								aria-label='service information tabs'
								sx={{
									borderBottom: 1,
									borderColor: "divider",
									"& .MuiTabs-flexContainer": {
										justifyContent: isMobile ? "flex-start" : "center",
									},
								}}>
								<StyledTab label='About' />
								<StyledTab label='Investment Types' />
								<StyledTab label='How It Works' />
								<StyledTab label='Features & Benefits' />
								<StyledTab label='Portfolio Options' />
								<StyledTab label='Eligibility' />
								<StyledTab label="FAQ's" />
								<StyledTab label='Return Calculator' />
							</Tabs>
						</Container>
					</Box>

					<Grid container spacing={4} sx={{ mt: { xs: 0, md: 3 } }}>
						{/* Sidebar - Hidden on mobile */}
						<Grid
							item
							md={3}
							sx={{
								display: { xs: "none", md: "block" },
							}}
							ref={sidebarContainerRef}>
							<Box
								ref={sidebarRef}
								sx={{
									transition: "all 0.3s ease",
									position: sidebarPosition.isSticky ? 
										(sidebarPosition.shouldStop ? "absolute" : "fixed") :
										"static",
									top: sidebarPosition.isSticky && !sidebarPosition.shouldStop ? "180px" : "auto",
									bottom: sidebarPosition.shouldStop ? "30px" : "auto",
									width: "300px",
									bgcolor: "#fff",
									borderRadius: "8px",
									boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
									overflow: "hidden",
									maxHeight: "80vh",
									overflowY: "auto",
									// Custom scrollbar styles
									"&::-webkit-scrollbar": {
										width: "4px",
									},
									"&::-webkit-scrollbar-track": {
										background: "#f1f1f1",
										borderRadius: "10px",
									},
									"&::-webkit-scrollbar-thumb": {
										background: "#95b8a2",
										borderRadius: "10px",
									},
									"&::-webkit-scrollbar-thumb:hover": {
										background: "#1b321d",
									},
									// Firefox scrollbar
									scrollbarWidth: "thin",
									scrollbarColor: "#95b8a2 #f1f1f1",
								}}>
								<List
									component='nav'
									sx={{
										p: 0,
										"& .MuiListItemButton-root:hover": {
											bgcolor: alpha(theme.palette.primary.main, 0.08),
										},
									}}>
									<ListItemButton
										selected={activeTab === 0}
										onClick={(e) => handleTabChange(e, 0)}
										sx={{
											borderLeft:
												activeTab === 0 ? `4px solid #1b321d` : "none",
											pl: activeTab === 0 ? 2 : 3,
										}}>
										<ListItemText
											primary='About Mutual Funds'
											primaryTypographyProps={{
												fontWeight: activeTab === 0 ? 600 : 400,
												color: activeTab === 0 ? "#1b321d" : "inherit",
											}}
										/>
									</ListItemButton>

									<ListItemButton
										selected={activeTab === 1}
										onClick={(e) => handleTabChange(e, 1)}
								sx={{
											borderLeft:
												activeTab === 1 ? `4px solid #1b321d` : "none",
											pl: activeTab === 1 ? 2 : 3,
										}}>
										<ListItemText
											primary='Investment Types'
											primaryTypographyProps={{
												fontWeight: activeTab === 1 ? 600 : 400,
												color: activeTab === 1 ? "#1b321d" : "inherit",
											}}
										/>
									</ListItemButton>

									<ListItemButton
										selected={activeTab === 2}
										onClick={(e) => handleTabChange(e, 2)}
									sx={{
											borderLeft:
												activeTab === 2 ? `4px solid #1b321d` : "none",
											pl: activeTab === 2 ? 2 : 3,
										}}>
										<ListItemText
											primary='How It Works'
											primaryTypographyProps={{
												fontWeight: activeTab === 2 ? 600 : 400,
												color: activeTab === 2 ? "#1b321d" : "inherit",
											}}
										/>
									</ListItemButton>

									<ListItemButton
										selected={activeTab === 3}
										onClick={(e) => handleTabChange(e, 3)}
										sx={{
											borderLeft:
												activeTab === 3 ? `4px solid #1b321d` : "none",
											pl: activeTab === 3 ? 2 : 3,
										}}>
										<ListItemText
											primary='Features & Benefits'
											primaryTypographyProps={{
												fontWeight: activeTab === 3 ? 600 : 400,
												color: activeTab === 3 ? "#1b321d" : "inherit",
											}}
										/>
									</ListItemButton>

									<ListItemButton
										selected={activeTab === 4}
										onClick={(e) => handleTabChange(e, 4)}
										sx={{
											borderLeft:
												activeTab === 4 ? `4px solid #1b321d` : "none",
											pl: activeTab === 4 ? 2 : 3,
										}}>
										<ListItemText
											primary='Portfolio Options'
											primaryTypographyProps={{
												fontWeight: activeTab === 4 ? 600 : 400,
												color: activeTab === 4 ? "#1b321d" : "inherit",
											}}
										/>
									</ListItemButton>

									<ListItemButton
										selected={activeTab === 5}
										onClick={(e) => handleTabChange(e, 5)}
										sx={{
											borderLeft:
												activeTab === 5 ? `4px solid #1b321d` : "none",
											pl: activeTab === 5 ? 2 : 3,
										}}>
										<ListItemText
											primary='Eligibility'
											primaryTypographyProps={{
												fontWeight: activeTab === 5 ? 600 : 400,
												color: activeTab === 5 ? "#1b321d" : "inherit",
											}}
										/>
									</ListItemButton>

									<ListItemButton
										selected={activeTab === 6}
										onClick={(e) => handleTabChange(e, 6)}
										sx={{
											borderLeft:
												activeTab === 6 ? `4px solid #1b321d` : "none",
											pl: activeTab === 6 ? 2 : 3,
										}}>
										<ListItemText
											primary="FAQ's"
											primaryTypographyProps={{
												fontWeight: activeTab === 6 ? 600 : 400,
												color: activeTab === 6 ? "#1b321d" : "inherit",
											}}
										/>
									</ListItemButton>

									<ListItemButton
										selected={activeTab === 7}
										onClick={(e) => handleTabChange(e, 7)}
										sx={{
											borderLeft:
												activeTab === 7 ? `4px solid #1b321d` : "none",
											pl: activeTab === 7 ? 2 : 3,
										}}>
										<ListItemText
											primary='Return Calculator'
											primaryTypographyProps={{
												fontWeight: activeTab === 7 ? 600 : 400,
												color: activeTab === 7 ? "#1b321d" : "inherit",
											}}
										/>
									</ListItemButton>
								</List>
							</Box>
						</Grid>

						{/* Main Content */}
						<Grid item xs={12} md={9}>
							<ContentSection>
								{/* About Investment Section */}
								<Box
									ref={aboutInvestmentRef}
									className='section-content'
									sx={{ mb: { xs: 5, md: 8 } }}>
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
											fontSize: { xs: "1.6rem", md: "2.2rem" },
											"&::after": {
												content: '""',
												position: "absolute",
												bottom: 0,
												left: 0,
												width: "80px",
												height: "3px",
												background:
													"linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
											},
										}}>
										FinShelter: Your Partner in Smarter Investing
									</Typography>

									<Typography
										variant='body1'
										paragraph
										sx={{
											fontSize: { xs: "0.95rem", md: "1.1rem" },
											lineHeight: 1.7,
											color: "#555",
											mb: 3,
										}}>
										At FinShelter, we believe that financial growth isn't just about
										numbers—it's about building the life you've always envisioned. Our
										Mutual Fund Distribution Services are here to guide you on a journey
										to financial freedom, whether you're saving for your dream home,
										planning for retirement, or creating a legacy for future generations.
									</Typography>

									<Typography
										variant='h4'
										gutterBottom
										sx={{
											fontWeight: 600,
											color: "#1b321d",
											mt: 4,
											mb: 2,
											fontSize: { xs: "1.2rem", md: "1.5rem" },
										}}>
										Why Mutual Funds? Think Growth. Think Balance. Think Freedom.
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
										Mutual funds are the powerhouse of wealth creation, offering a
										unique blend of flexibility, accessibility, and professional expertise.
										Here's why they're a game-changer:
									</Typography>

								<Grid container spacing={{ xs: 2, md: 4 }} sx={{ mt: 2 }}>
									<Grid item xs={12} md={6}>
										<Paper
											elevation={0}
											sx={{
												p: { xs: 2, md: 3 },
												height: "100%",
												border: "1px solid #eaeaea",
												borderRadius: "8px",
												transition:
													"transform 0.3s ease, box-shadow 0.3s ease",
												"&:hover": {
													transform: "translateY(-5px)",
													boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
												},
											}}>
											<Box
												sx={{
													display: "flex",
													alignItems: { xs: "flex-start", sm: "center" },
													flexDirection: { xs: "column", sm: "row" },
													mb: 2,
												}}>
												<Box
													sx={{
														mr: { xs: 0, sm: 2 },
														mb: { xs: 1, sm: 0 },
														bgcolor: alpha(theme.palette.primary.main, 0.1),
														borderRadius: "50%",
														width: 50,
														height: 50,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														color: theme.palette.primary.main,
													}}>
													<AutoGraphIcon fontSize='medium' />
												</Box>
												<Typography
													variant='h6'
													sx={{ 
														fontWeight: 600, 
														color: "#1b321d",
														fontSize: { xs: "1.1rem", md: "1.25rem" }
													}}>
													Power of Compounding
												</Typography>
											</Box>
											<Typography 
												variant='body2' 
												color='text.secondary'
												sx={{ fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
												Let your money grow exponentially over time. Start small, dream big.
												Watch as your investments multiply through the magic of compounding returns.
											</Typography>
										</Paper>
									</Grid>

									<Grid item xs={12} md={6}>
										<Paper
											elevation={0}
											sx={{
												p: { xs: 2, md: 3 },
												height: "100%",
												border: "1px solid #eaeaea",
												borderRadius: "8px",
												transition:
													"transform 0.3s ease, box-shadow 0.3s ease",
												"&:hover": {
													transform: "translateY(-5px)",
													boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
												},
											}}>
											<Box
												sx={{
													display: "flex",
													alignItems: { xs: "flex-start", sm: "center" },
													flexDirection: { xs: "column", sm: "row" },
													mb: 2,
												}}>
												<Box
													sx={{
														mr: { xs: 0, sm: 2 },
														mb: { xs: 1, sm: 0 },
														bgcolor: alpha(theme.palette.primary.main, 0.1),
														borderRadius: "50%",
														width: 50,
														height: 50,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														color: theme.palette.primary.main,
													}}>
													<PeopleAltIcon fontSize='medium' />
												</Box>
												<Typography
													variant='h6'
													sx={{ 
														fontWeight: 600, 
														color: "#1b321d",
														fontSize: { xs: "1.1rem", md: "1.25rem" }
													}}>
													Diversification Done Right
												</Typography>
											</Box>
											<Typography 
												variant='body2' 
												color='text.secondary'
												sx={{ fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
												Spread your investments across different sectors, reducing risk while 
												amplifying opportunities. This strategic approach protects your portfolio 
												during market fluctuations.
											</Typography>
										</Paper>
									</Grid>

									<Grid item xs={12} md={6}>
										<Paper
											elevation={0}
											sx={{
												p: { xs: 2, md: 3 },
												height: "100%",
												border: "1px solid #eaeaea",
												borderRadius: "8px",
												transition:
													"transform 0.3s ease, box-shadow 0.3s ease",
												"&:hover": {
													transform: "translateY(-5px)",
													boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
												},
											}}>
											<Box
												sx={{
													display: "flex",
													alignItems: { xs: "flex-start", sm: "center" },
													flexDirection: { xs: "column", sm: "row" },
													mb: 2,
												}}>
												<Box
													sx={{
														mr: { xs: 0, sm: 2 },
														mb: { xs: 1, sm: 0 },
														bgcolor: alpha(theme.palette.primary.main, 0.1),
														borderRadius: "50%",
														width: 50,
														height: 50,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														color: theme.palette.primary.main,
													}}>
													<GroupIcon fontSize='medium' />
												</Box>
												<Typography
													variant='h6'
													sx={{ 
														fontWeight: 600, 
														color: "#1b321d",
														fontSize: { xs: "1.1rem", md: "1.25rem" }
													}}>
													Expert Management
												</Typography>
											</Box>
											<Typography 
												variant='body2' 
												color='text.secondary'
												sx={{ fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
												Skilled fund managers make informed decisions so you can focus on what 
												matter most. Benefit from their market expertise, research capabilities, 
												and strategic investment insights.
											</Typography>
										</Paper>
									</Grid>

									<Grid item xs={12} md={6}>
										<Paper
											elevation={0}
											sx={{
												p: { xs: 2, md: 3 },
												height: "100%",
												border: "1px solid #eaeaea",
												borderRadius: "8px",
												transition:
													"transform 0.3s ease, box-shadow 0.3s ease",
												"&:hover": {
													transform: "translateY(-5px)",
													boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
												},
											}}>
											<Box
												sx={{
													display: "flex",
													alignItems: { xs: "flex-start", sm: "center" },
													flexDirection: { xs: "column", sm: "row" },
													mb: 2,
												}}>
												<Box
													sx={{
														mr: { xs: 0, sm: 2 },
														mb: { xs: 1, sm: 0 },
														bgcolor: alpha(theme.palette.primary.main, 0.1),
														borderRadius: "50%",
														width: 50,
														height: 50,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														color: theme.palette.primary.main,
													}}>
													<BalanceIcon fontSize='medium' />
												</Box>
												<Typography
													variant='h6'
													sx={{ 
														fontWeight: 600, 
														color: "#1b321d",
														fontSize: { xs: "1.1rem", md: "1.25rem" }
													}}>
													Adaptable for Everyone
												</Typography>
											</Box>
											<Typography 
												variant='body2' 
												color='text.secondary'
												sx={{ fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
												Whether you're cautious or daring, there's a fund designed just for you.
												From conservative debt options to high-growth equity funds, find the perfect 
												match for your risk appetite.
											</Typography>
										</Paper>
									</Grid>
								</Grid>
												</Box>

							{/* Investment Types Section */}
							<Box
								ref={investmentTypesRef}
								className='section-content'
								sx={{ mb: { xs: 5, md: 8 } }}>
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
										fontSize: { xs: "1.6rem", md: "2.2rem" },
										"&::after": {
											content: '""',
											position: "absolute",
											bottom: 0,
											left: 0,
											width: "80px",
											height: "3px",
											background:
												"linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
										},
									}}>
								Your Tailor-Made Portfolio
								</Typography>

								<Typography
									variant='body1'
									paragraph
									sx={{
										fontSize: { xs: "0.95rem", md: "1.1rem" },
										lineHeight: 1.7,
										color: "#555",
										mb: 4,
									}}>
								Based on your needs, we handpick funds from top-performing categories to create a portfolio
								that perfectly aligns with your financial goals, risk appetite, and investment horizon.
								</Typography>

							{/* Fund Types Cards */}
							<Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 2 }}>
								<Grid item xs={12} sm={6} lg={4}>
									<GradientCard>
										<CardContent sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
											<Box sx={{ 
												display: "flex", 
												alignItems: { xs: "flex-start", sm: "center" },
												flexDirection: { xs: "column", sm: "row" }, 
												mb: 2 
											}}>
												<Box
													sx={{
														backgroundColor: alpha(
															theme.palette.primary.main,
																0.1
														),
														borderRadius: "50%",
														p: 1,
														mr: { xs: 0, sm: 2 },
														mb: { xs: 1, sm: 0 },
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}>
														<TrendingUpIcon
															fontSize='medium'
															sx={{ color: theme.palette.primary.main }}
														/>
												</Box>
												<Typography
													variant='h6'
													component='h3'
													sx={{ 
														fontWeight: 600, 
														color: "#1b321d",
														fontSize: { xs: "1.1rem", md: "1.25rem" }
													}}>
														Equity Funds
												</Typography>
											</Box>
											<Typography 
												variant='body2' 
												color='text.secondary' 
												sx={{ 
													mb: 2,
													fontSize: { xs: "0.85rem", md: "0.9rem" }
												}}>
												High-growth potential for long-term investors. These funds invest 
												primarily in stocks, offering substantial returns over time while 
												managing market fluctuations through diversification.
											</Typography>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													mt: 2,
													backgroundColor: alpha(
														theme.palette.primary.main,
															0.05
													),
													p: { xs: 1, md: 1.5 },
													borderRadius: "8px",
												}}>
												<CheckCircleIcon
													fontSize='small'
													sx={{ color: theme.palette.primary.main, mr: 1 }}
												/>
												<Typography 
													variant='body2' 
													sx={{ 
														fontWeight: 500,
														fontSize: { xs: "0.8rem", md: "0.9rem" }
													}}>
														Ideal for: Long-term wealth creation
												</Typography>
											</Box>
										</CardContent>
									</GradientCard>
								</Grid>

								<Grid item xs={12} sm={6} lg={4}>
									<GradientCard>
										<CardContent sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
											<Box sx={{ 
												display: "flex", 
												alignItems: { xs: "flex-start", sm: "center" },
												flexDirection: { xs: "column", sm: "row" }, 
												mb: 2 
											}}>
												<Box
													sx={{
														backgroundColor: alpha(
															theme.palette.primary.main,
																0.1
														),
														borderRadius: "50%",
														p: 1,
														mr: { xs: 0, sm: 2 },
														mb: { xs: 1, sm: 0 },
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}>
														<ShieldIcon
															fontSize='medium'
															sx={{ color: theme.palette.primary.main }}
														/>
												</Box>
												<Typography
													variant='h6'
													component='h3'
													sx={{ 
														fontWeight: 600, 
														color: "#1b321d",
														fontSize: { xs: "1.1rem", md: "1.25rem" }
													}}>
														Debt Funds
												</Typography>
											</Box>
											<Typography 
												variant='body2' 
												color='text.secondary' 
												sx={{ 
													mb: 2,
													fontSize: { xs: "0.85rem", md: "0.9rem" }
												}}>
												Stability-focused investments for predictable returns. These funds 
												invest in fixed-income securities like government bonds, corporate 
												bonds, and money market instruments.
											</Typography>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													mt: 2,
													backgroundColor: alpha(
														theme.palette.primary.main,
															0.05
													),
													p: { xs: 1, md: 1.5 },
													borderRadius: "8px",
												}}>
												<CheckCircleIcon
													fontSize='small'
													sx={{ color: theme.palette.primary.main, mr: 1 }}
												/>
												<Typography 
													variant='body2' 
													sx={{ 
														fontWeight: 500,
														fontSize: { xs: "0.8rem", md: "0.9rem" }
													}}>
														Ideal for: Income generation & stability
												</Typography>
											</Box>
										</CardContent>
									</GradientCard>
								</Grid>

								<Grid item xs={12} sm={6} lg={4}>
									<GradientCard>
										<CardContent sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
											<Box sx={{ 
												display: "flex", 
												alignItems: { xs: "flex-start", sm: "center" },
												flexDirection: { xs: "column", sm: "row" }, 
												mb: 2 
											}}>
												<Box
													sx={{
														backgroundColor: alpha(
															theme.palette.primary.main,
																0.1
														),
														borderRadius: "50%",
														p: 1,
														mr: { xs: 0, sm: 2 },
														mb: { xs: 1, sm: 0 },
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}>
														<BalanceIcon
															fontSize='medium'
															sx={{ color: theme.palette.primary.main }}
														/>
												</Box>
												<Typography
													variant='h6'
													component='h3'
													sx={{ 
														fontWeight: 600, 
														color: "#1b321d",
														fontSize: { xs: "1.1rem", md: "1.25rem" }
													}}>
														Hybrid Funds
												</Typography>
											</Box>
											<Typography 
												variant='body2' 
												color='text.secondary' 
												sx={{ 
													mb: 2,
													fontSize: { xs: "0.85rem", md: "0.9rem" }
												}}>
												A smart mix of equity and debt for balanced growth. These funds 
												provide a middle path by investing in both stocks and bonds, 
												offering moderate growth with reduced volatility.
											</Typography>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													mt: 2,
													backgroundColor: alpha(
														theme.palette.primary.main,
															0.05
													),
													p: { xs: 1, md: 1.5 },
													borderRadius: "8px",
												}}>
												<CheckCircleIcon
													fontSize='small'
													sx={{ color: theme.palette.primary.main, mr: 1 }}
												/>
												<Typography 
													variant='body2' 
													sx={{ 
														fontWeight: 500,
														fontSize: { xs: "0.8rem", md: "0.9rem" }
													}}>
														Ideal for: Balanced risk-return profile
												</Typography>
											</Box>
										</CardContent>
									</GradientCard>
								</Grid>

								<Grid item xs={12} sm={6} lg={4}>
									<GradientCard>
										<CardContent sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
											<Box sx={{ 
												display: "flex", 
												alignItems: { xs: "flex-start", sm: "center" },
												flexDirection: { xs: "column", sm: "row" }, 
												mb: 2 
											}}>
												<Box
													sx={{
														backgroundColor: alpha(
															theme.palette.primary.main,
																0.1
														),
														borderRadius: "50%",
														p: 1,
														mr: { xs: 0, sm: 2 },
														mb: { xs: 1, sm: 0 },
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}>
														<AccountBalanceIcon
															fontSize='medium'
															sx={{ color: theme.palette.primary.main }}
														/>
												</Box>
												<Typography
													variant='h6'
													component='h3'
													sx={{ 
														fontWeight: 600, 
														color: "#1b321d",
														fontSize: { xs: "1.1rem", md: "1.25rem" }
													}}>
														Tax-Saving Funds (ELSS)
												</Typography>
											</Box>
											<Typography 
												variant='body2' 
												color='text.secondary' 
												sx={{ 
													mb: 2,
													fontSize: { xs: "0.85rem", md: "0.9rem" }
												}}>
												Grow wealth while saving on taxes. ELSS funds offer tax benefits 
												under Section 80C with a shorter lock-in period of just 3 years 
												compared to other tax-saving instruments.
											</Typography>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													mt: 2,
													backgroundColor: alpha(
														theme.palette.primary.main,
															0.05
													),
													p: { xs: 1, md: 1.5 },
													borderRadius: "8px",
												}}>
												<CheckCircleIcon
													fontSize='small'
													sx={{ color: theme.palette.primary.main, mr: 1 }}
												/>
												<Typography 
													variant='body2' 
													sx={{ 
														fontWeight: 500,
														fontSize: { xs: "0.8rem", md: "0.9rem" }
													}}>
														Ideal for: Tax optimization & growth
												</Typography>
											</Box>
										</CardContent>
									</GradientCard>
								</Grid>

								<Grid item xs={12} sm={6} lg={4}>
									<GradientCard>
										<CardContent sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
											<Box sx={{ 
												display: "flex", 
												alignItems: { xs: "flex-start", sm: "center" },
												flexDirection: { xs: "column", sm: "row" }, 
												mb: 2 
											}}>
												<Box
													sx={{
														backgroundColor: alpha(
															theme.palette.primary.main,
																0.1
														),
														borderRadius: "50%",
														p: 1,
														mr: { xs: 0, sm: 2 },
														mb: { xs: 1, sm: 0 },
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}>
														<MoneyIcon
															fontSize='medium'
															sx={{ color: theme.palette.primary.main }}
														/>
												</Box>
												<Typography
													variant='h6'
													component='h3'
													sx={{ 
														fontWeight: 600, 
														color: "#1b321d",
														fontSize: { xs: "1.1rem", md: "1.25rem" }
													}}>
														Liquid Funds
												</Typography>
											</Box>
											<Typography 
												variant='body2' 
												color='text.secondary' 
												sx={{ 
													mb: 2,
													fontSize: { xs: "0.85rem", md: "0.9rem" }
												}}>
												Emergency-ready investments with easy access. These funds invest in 
												very short-term securities and provide high liquidity, allowing you 
												to withdraw your money quickly when needed.
											</Typography>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													mt: 2,
													backgroundColor: alpha(
														theme.palette.primary.main,
															0.05
													),
													p: { xs: 1, md: 1.5 },
													borderRadius: "8px",
												}}>
												<CheckCircleIcon
													fontSize='small'
													sx={{ color: theme.palette.primary.main, mr: 1 }}
												/>
												<Typography 
													variant='body2' 
													sx={{ 
														fontWeight: 500,
														fontSize: { xs: "0.8rem", md: "0.9rem" }
													}}>
														Ideal for: Short-term needs & emergency funds
												</Typography>
											</Box>
										</CardContent>
									</GradientCard>
								</Grid>
							</Grid>
							</Box>

							{/* Features & Benefits Section */}
							<Box
								ref={featuresRef}
								className='section-content'
								sx={{ mb: { xs: 5, md: 8 } }}>
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
											fontSize: { xs: "1.6rem", md: "2.2rem" },
											"&::after": {
												content: '""',
												position: "absolute",
												bottom: 0,
												left: 0,
												width: "80px",
												height: "3px",
												background:
													"linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
											},
										}}>
									Innovative Features You Won't Find Elsewhere
									</Typography>

									<Typography
										variant='body1'
										paragraph
										sx={{
											fontSize: { xs: "0.95rem", md: "1.1rem" },
											lineHeight: 1.7,
											color: "#555",
											mb: 4,
										}}>
									Our commitment to your financial success goes beyond standard offerings. 
									Discover exclusive features designed to enhance your investment experience 
									and maximize your potential for wealth creation.
									</Typography>

								<Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 6 }}>
									<Grid item xs={12} md={6}>
										<Paper
											elevation={0}
											sx={{
												p: { xs: 2, md: 3 },
												height: "100%",
												border: "1px solid #eaeaea",
												borderRadius: "8px",
												transition:
													"transform 0.3s ease, box-shadow 0.3s ease",
												"&:hover": {
													transform: "translateY(-5px)",
													boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
												},
											}}>
											<Box
												sx={{
													display: "flex",
													alignItems: { xs: "flex-start", sm: "center" },
													flexDirection: { xs: "column", sm: "row" },
													mb: 2,
												}}>
												<Box
													sx={{
															mr: { xs: 0, sm: 2 },
															mb: { xs: 1, sm: 0 },
															bgcolor: alpha(theme.palette.primary.main, 0.1),
															borderRadius: "50%",
															width: 50,
															height: 50,
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															color: theme.palette.primary.main,
															}}>
															<DescriptionIcon fontSize='medium' />
															</Box>
																<Typography
															variant='h6'
															sx={{ fontWeight: 600, color: "#1b321d" }}>
															Goal-Based Planning
																	</Typography>
																</Box>
											<Typography variant='body2' color='text.secondary'>
												Start with your dreams and work backward. Want to buy a car in five years? 
												Planning a child's education fund? We design your investments around your 
												timeline and aspirations, creating a clear path to your financial goals.
											</Typography>
										</Paper>
									</Grid>

									<Grid item xs={12} md={6}>
										<Paper
											elevation={0}
										sx={{
												p: 3,
												height: "100%",
												border: "1px solid #eaeaea",
												borderRadius: "8px",
												transition:
													"transform 0.3s ease, box-shadow 0.3s ease",
												"&:hover": {
													transform: "translateY(-5px)",
													boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
										},
									}}>
											<Box
												sx={{
														display: "flex",
														alignItems: "center",
														mb: 2,
													}}>
													<Box
														sx={{
															mr: 2,
															bgcolor: alpha(theme.palette.primary.main, 0.1),
															borderRadius: "50%",
															width: 50,
															height: 50,
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															color: theme.palette.primary.main,
														}}>
														<AutoGraphIcon fontSize='medium' />
										</Box>
													<Typography
														variant='h6'
														sx={{ fontWeight: 600, color: "#1b321d" }}>
														Portfolio Growth Dashboard
													</Typography>
									</Box>
											<Typography variant='body2' color='text.secondary'>
												Stay in control with real-time performance updates on your investments. 
												Visualize your progress through easy-to-understand graphs and data, 
												all accessible through our intuitive mobile app and web dashboard.
											</Typography>
										</Paper>
									</Grid>

									<Grid item xs={12} md={6}>
										<Paper
											elevation={0}
										sx={{
												p: 3,
												height: "100%",
												border: "1px solid #eaeaea",
												borderRadius: "8px",
												transition:
													"transform 0.3s ease, box-shadow 0.3s ease",
												"&:hover": {
													transform: "translateY(-5px)",
													boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
										},
									}}>
											<Box
											sx={{
														display: "flex",
														alignItems: "center",
														mb: 2,
													}}>
													<Box
														sx={{
															mr: 2,
															bgcolor: alpha(theme.palette.primary.main, 0.1),
															borderRadius: "50%",
															width: 50,
															height: 50,
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															color: theme.palette.primary.main,
														}}>
														<TrendingUpIcon fontSize='medium' />
													</Box>
													<Typography
														variant='h6'
														sx={{ fontWeight: 600, color: "#1b321d" }}>
														Thematic Investment Options
										</Typography>
												</Box>
											<Typography variant='body2' color='text.secondary'>
												Explore funds based on what matters most to you—invest in green energy, 
												innovation, or sectors aligned with your values. Our thematic investment 
												options let you support causes you believe in while growing your wealth.
											</Typography>
										</Paper>
									</Grid>

									<Grid item xs={12} md={6}>
												<Paper
											elevation={0}
													sx={{
												p: 3,
												height: "100%",
														border: "1px solid #eaeaea",
												borderRadius: "8px",
												transition:
													"transform 0.3s ease, box-shadow 0.3s ease",
														"&:hover": {
													transform: "translateY(-5px)",
													boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
														},
													}}>
											<Box
															sx={{
																	display: "flex",
																	alignItems: "center",
														mb: 2,
																}}>
																<Box
																	sx={{
															mr: 2,
															bgcolor: alpha(theme.palette.primary.main, 0.1),
																		borderRadius: "50%",
															width: 50,
															height: 50,
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																		color: theme.palette.primary.main,
																	}}>
														<GroupIcon fontSize='medium' />
																</Box>
													<Typography
														variant='h6'
														sx={{ fontWeight: 600, color: "#1b321d" }}>
														Personalized Guidance
													</Typography>
												</Box>
											<Typography variant='body2' color='text.secondary'>
												Access your dedicated financial advisor anytime for questions, advice, 
												or portfolio tweaks. We're committed to providing ongoing support 
												throughout your investment journey, ensuring you're never alone in 
												making financial decisions.
											</Typography>
										</Paper>
															</Grid>
								</Grid>

								{/* Why FinShelter */}
																	<Typography
										variant='h4'
																		gutterBottom
																		sx={{
																			fontWeight: 600,
																			color: "#1b321d",
											mt: 6,
											mb: 3,
										}}>
										Why FinShelter?
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
										Here's how we ensure your success in achieving your financial goals:
									</Typography>

									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Box
												sx={{
													display: "flex",
													alignItems: "flex-start",
													mb: 3,
												}}>
												<CheckCircleIcon
													sx={{
														color: theme.palette.primary.main,
														mr: 2,
														mt: 0.5,
													}}
												/>
												<Box>
													<Typography
														variant='h6'
														sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 0.5 }}>
														Clarity in Communication
													</Typography>
													<Typography variant='body2' color='text.secondary'>
														No jargon—just honest, straightforward advice. We speak in terms 
														you can understand and ensure you're fully informed about your investments.
																	</Typography>
												</Box>
																</Box>
															</Grid>

										<Grid item xs={12} md={6}>
											<Box
												sx={{
													display: "flex",
													alignItems: "flex-start",
													mb: 3,
												}}>
												<CheckCircleIcon
													sx={{
														color: theme.palette.primary.main,
														mr: 2,
														mt: 0.5,
													}}
												/>
												<Box>
													<Typography
														variant='h6'
														sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 0.5 }}>
														Trusted Expertise
													</Typography>
													<Typography variant='body2' color='text.secondary'>
														Years of experience guiding investors across all walks of life. 
														Our team consists of certified financial advisors with proven 
														track records in wealth management.
													</Typography>
												</Box>
											</Box>
										</Grid>

										<Grid item xs={12} md={6}>
											<Box
											sx={{
													display: "flex",
													alignItems: "flex-start",
													mb: 3,
												}}>
												<CheckCircleIcon
													sx={{
														color: theme.palette.primary.main,
														mr: 2,
														mt: 0.5,
													}}
												/>
												<Box>
													<Typography
														variant='h6'
														sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 0.5 }}>
														Holistic Financial Planning
													</Typography>
													<Typography variant='body2' color='text.secondary'>
														Beyond mutual funds, we help integrate your investments with 
														tax-saving strategies and insurance solutions, creating a 
														comprehensive financial plan for your future.
													</Typography>
												</Box>
											</Box>
												</Grid>

										<Grid item xs={12} md={6}>
											<Box
														sx={{
													display: "flex",
													alignItems: "flex-start",
													mb: 3,
												}}>
												<CheckCircleIcon
													sx={{
														color: theme.palette.primary.main,
														mr: 2,
														mt: 0.5,
													}}
												/>
												<Box>
													<Typography
														variant='h6'
														sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 0.5 }}>
														Stress-Free Process
													</Typography>
													<Typography variant='body2' color='text.secondary'>
														From onboarding to performance tracking, we simplify every step 
														of your investment journey. Our digital platform makes managing 
														your portfolio easy and convenient.
													</Typography>
												</Box>
											</Box>
												</Grid>
											</Grid>
									</Box>

								{/* Portfolio Options Section */}
								<Box
									ref={portfolioRef}
									className='section-content'
									sx={{ mb: 8 }}>
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
													background:
														"linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
												},
											}}>
										Portfolio Options
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
										We offer various portfolio strategies based on your risk
										appetite and investment goals. Whether you're looking for
										conservative growth, balanced returns, or aggressive wealth
										creation, we have options designed for every investor
										profile.
										</Typography>

									{/* Portfolio options content here... */}
									</Box>

								{/* Eligibility Criteria Section */}
								<Box
									ref={eligibilityRef}
									className='section-content'
									sx={{ mb: 8 }}>
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
													background:
														"linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
														},
													}}>
										Eligibility Criteria
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
										{service?.eligibilityTagline ||
											"Investing in mutual funds is accessible to most individuals. Here are the basic requirements to get started with our investment services."}
														</Typography>

									{/* Eligibility content here... */}
										</Box>

								{/* FAQ's Section */}
								<Box ref={faqsRef} className='section-content' sx={{ mb: 8 }}>
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
													background:
														"linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
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
											"Find answers to common questions about mutual funds and our investment services."}
										</Typography>

									{/* FAQ content here... */}
											</Box>

								{/* Calculator Section */}
									<Box ref={calculatorRef} className='section-content'>
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
													background:
														"linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
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
										Use our calculator to estimate the potential future value of
										your mutual fund investments based on different parameters.
										</Typography>

									{/* Calculator content here... */}
														</Box>

								{/* How It Works Section */}
								<Box
									ref={howItWorksRef}
									className='section-content'
									sx={{ mb: 8 }}>
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
													background:
														"linear-gradient(to right, #1b321d 30%, #c6dbce 100%)",
												},
											}}>
										Our Approach: Personalized. Simple. Impactful.
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
										At FinShelter, we don't just offer mutual funds—we craft strategies
										tailored to you. Our process is designed to bring clarity, confidence,
										and success to your investment journey.
										</Typography>

									{/* How it works steps */}
									<Box sx={{ my: 4 }}>
										<Grid container spacing={6}>
											<Grid item xs={12} md={6}>
												<Box
														sx={{
														position: "relative",
														"&::before": {
															content: '""',
															position: "absolute",
															top: 0,
															bottom: 0,
															left: "24px",
															width: "2px",
															background:
																"linear-gradient(to bottom, #1b321d 60%, rgba(27,50,29,0.2))",
															zIndex: 0,
														},
													}}>
													{/* Step 1 */}
													<Box
															sx={{
															display: "flex",
															mb: 5,
															position: "relative",
															}}>
														<Box
															sx={{
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																backgroundColor: "#1b321d",
																color: "white",
																borderRadius: "50%",
																width: "50px",
																height: "50px",
																fontWeight: "bold",
																fontSize: "1.2rem",
																flexShrink: 0,
																zIndex: 1,
																boxShadow: "0 0 0 5px rgba(27,50,29,0.1)",
															}}>
															1
														</Box>
														<Box sx={{ ml: 3 }}>
															<Typography
																variant='h6'
																gutterBottom
																sx={{ fontWeight: 600, color: "#1b321d" }}>
																Step Into Your Future
															</Typography>
															<Typography
																variant='body1'
																sx={{ color: "#555", lineHeight: 1.6 }}>
																Begin with a one-on-one consultation where
																we understand your unique financial goals, preferences, 
																and risk tolerance. Whether you're an experienced investor 
																or a complete beginner, we simplify the complex world of mutual funds.
															</Typography>
														</Box>
													</Box>

													{/* Step 2 */}
													<Box
															sx={{
															display: "flex",
															mb: 5,
															position: "relative",
															}}>
														<Box
															sx={{
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																backgroundColor: "#1b321d",
																color: "white",
																borderRadius: "50%",
																width: "50px",
																height: "50px",
																fontWeight: "bold",
																fontSize: "1.2rem",
																flexShrink: 0,
																zIndex: 1,
																boxShadow: "0 0 0 5px rgba(27,50,29,0.1)",
															}}>
															2
														</Box>
														<Box sx={{ ml: 3 }}>
															<Typography
																variant='h6'
																gutterBottom
																sx={{ fontWeight: 600, color: "#1b321d" }}>
																Your Tailor-Made Portfolio
															</Typography>
															<Typography
																variant='body1'
																sx={{ color: "#555", lineHeight: 1.6 }}>
																Based on your needs, we handpick funds from top-performing 
																categories like Equity Funds, Debt Funds, Hybrid Funds, 
																Tax-Saving Funds (ELSS), and Liquid Funds. We create a portfolio
																that perfectly suits your unique situation.
															</Typography>
														</Box>
													</Box>

													{/* Step 3 */}
													<Box
															sx={{
															display: "flex",
															mb: 5,
															position: "relative",
														}}>
														<Box
															sx={{
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																backgroundColor: "#1b321d",
																color: "white",
																borderRadius: "50%",
																width: "50px",
																height: "50px",
																fontWeight: "bold",
																fontSize: "1.2rem",
																flexShrink: 0,
																zIndex: 1,
																boxShadow: "0 0 0 5px rgba(27,50,29,0.1)",
															}}>
															3
														</Box>
														<Box sx={{ ml: 3 }}>
											<Typography
																variant='h6'
												gutterBottom
																sx={{ fontWeight: 600, color: "#1b321d" }}>
																Let Your Money Work Harder
											</Typography>
															<Typography
																variant='body1'
																sx={{ color: "#555", lineHeight: 1.6 }}>
																Once your portfolio is in place, we actively monitor 
																its performance, providing insights and updates
																to keep you ahead in your wealth-building journey.
																We make adjustments as market conditions change.
											</Typography>
														</Box>
													</Box>
												</Box>
											</Grid>

											<Grid item xs={12} md={6}>
												<Box
															sx={{
														mt: 6,
														p: 4,
																borderRadius: "8px",
														backgroundColor: alpha(theme.palette.primary.main, 0.05),
														border: `1px solid ${alpha(
															theme.palette.primary.main,
															0.1
														)}`,
														height: "calc(100% - 48px)",
														display: "flex",
														flexDirection: "column",
														justifyContent: "center",
															}}>
															<Typography
																variant='h5'
														sx={{ fontWeight: 600, color: "#1b321d", mb: 3 }}>
														Success Stories: Real People, Real Achievements
															</Typography>
													
													<Box sx={{ mb: 4, pl: 2, borderLeft: "3px solid #8cc63f" }}>
															<Typography
															variant="body1" 
															sx={{ 
																fontStyle: "italic", 
																mb: 1,
																color: "#555"
															}}>
															"I started with small, monthly contributions through an ELSS fund
															suggested by FinShelter. In just a few years, I've saved enough for my
															child's education—and the tax benefits are a bonus!"
															</Typography>
														<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
															– Rahul S., Teacher
															</Typography>
													</Box>
													
													<Box sx={{ pl: 2, borderLeft: "3px solid #8cc63f" }}>
														<Typography 
															variant="body1" 
															sx={{ 
																fontStyle: "italic", 
																mb: 1,
																color: "#555" 
															}}>
															"Thanks to FinShelter's guidance, I've invested in hybrid funds that
															perfectly balance growth and security. Now I'm closer to retiring early
															than I ever thought possible."
														</Typography>
														<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
															– Meena K., Business Owner
														</Typography>
													</Box>
												</Box>
													</Grid>
											</Grid>
										</Box>

									{/* Call to action */}
										<Box
											sx={{
												mt: 6,
												p: 4,
												borderRadius: "8px",
											backgroundColor: alpha(theme.palette.primary.main, 0.05),
											border: `1px solid ${alpha(
												theme.palette.primary.main,
												0.1
											)}`,
										}}>
													<Typography
														variant='h5'
											sx={{ fontWeight: 600, color: "#1b321d", mb: 2 }}>
											Ready to Grow Your Wealth? Let's Begin.
													</Typography>
													<Typography variant='body1' paragraph>
											Investing in mutual funds is not just about earning returns—it's about
											creating the life you've envisioned. At FinShelter, we're here to simplify
											the process and maximize your potential. Contact us today to schedule your 
											consultation and take the first step toward your financial goals.
													</Typography>
													<Button
														variant='contained'
											color='primary'
											onClick={() => handleApplyNow("How It Works")}
											endIcon={<ArrowForwardIcon />}
											sx={{ mt: 1 }}>
											Schedule a Consultation
													</Button>
										</Box>
									</Box>
							</ContentSection>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</ThemeProvider>
	);
};

export default MutualFundsPage;
