import React, { useState, useEffect } from "react";
import axios from "../../Admin/utils/axiosConfig";
import { useNotification } from "../../NotificationContext";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Container,
	Grid,
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Card,
	CardContent,
	Divider,
	useScrollTrigger,
	Paper,
	Link,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Hidden,
	useMediaQuery,
	CircularProgress,
	Chip,
	CardActions,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormControlLabel,
	Checkbox,
	InputAdornment,
	Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShieldIcon from "@mui/icons-material/Shield";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import "./services.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SecurityIcon from "@mui/icons-material/Security";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HistoryIcon from "@mui/icons-material/History";
import SavingsIcon from "@mui/icons-material/Savings";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CalculateIcon from "@mui/icons-material/Calculate";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

// Create custom theme with provided colors
const theme = createTheme({
	palette: {
		primary: {
			main: "#1b321d",
		},
		secondary: {
			main: "#ffffff",
		},
		tertiary: {
			main: "#000000",
		},
		background: {
			default: "#c6dbce",
			paper: "#ffffff",
		},
		accent: {
			main: "#95b8a2",
			dark: "#75a485",
		},
	},
	typography: {
		// fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
		h1: {
			fontWeight: 700,
		},
		h2: {
			fontWeight: 700,
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
		},
		button: {
			textTransform: "none",
			fontWeight: 600,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "4px",
					padding: "12px 24px",
				},
				containedPrimary: {
					backgroundColor: "#1b321d",
					"&:hover": {
						backgroundColor: "#152718",
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					transition: "transform 0.3s ease, box-shadow 0.3s ease",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
					},
				},
			},
		},
	},
});

// Custom styled components
const HeroSection = styled(Box)(({ theme }) => ({
	position: "relative",
	padding: "140px 0",
	backgroundColor: "#F5F5F5",
	"@media (max-width:600px)": {
		padding: "80px 0",
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundImage: "url('/images/loan4.jpg')",
		backgroundSize: "cover",
		backgroundPosition: "center",
		opacity: 0.45,
	},
	"&::after": {
		content: '""',
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: "120px",
		background:
			"linear-gradient(to top, rgba(198, 219, 206, 1), rgba(198, 219, 206, 0))",
	},
}));

const HeroContent = styled(Box)(({ theme }) => ({
	position: "relative",
	zIndex: 1,
	maxWidth: "700px",
	background: "rgba(255, 255, 255, 0.85)",
	backdropFilter: "blur(10px)",
	padding: "40px",
	borderRadius: "16px",
	boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
	"@media (max-width:600px)": {
		padding: "24px 16px",
	},
}));

const StickyNav = styled(Box)(({ theme, trigger }) => ({
	position: trigger ? "fixed" : "relative",
	top: trigger ? "130px" : "0",
	width: "300px",
	transition: "all 0.5s ease",
	zIndex: "1",
}));

const NavList = styled(List)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: "12px",
	boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
	overflow: "hidden",
	borderTop: `4px solid ${theme.palette.primary.main}`,
}));

const NavItem = styled(ListItem)(({ theme, active }) => ({
	padding: "16px 24px",
	borderLeft: active
		? `4px solid ${theme.palette.primary.main}`
		: "4px solid transparent",
	backgroundColor: active ? theme.palette.accent.main + "30" : "transparent",
	"&:hover": {
		backgroundColor: theme.palette.accent.main + "15",
		cursor: "pointer",
	},
	transition: "all 0.2s ease",
}));

const ContentSection = styled(Box)(({ theme }) => ({
	padding: "50px 0",
	backgroundColor: theme.palette.background.paper,
	marginBottom: "32px",
	borderRadius: "12px",
	boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
	"&:hover": {
		boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
	},
	transition: "box-shadow 0.3s ease",
}));

const SectionBox = styled(Box)(({ theme }) => ({
	padding: "40px",
	backgroundColor: theme.palette.background.paper,
	marginBottom: "32px",
	borderRadius: "12px",
	boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
	"&:hover": {
		boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
	},
	transition: "box-shadow 0.3s ease",
	"@media (max-width:600px)": {
		padding: "24px 16px",
	},
}));

const AccentBox = styled(Box)(({ theme }) => ({
	background: `linear-gradient(135deg, ${theme.palette.accent.main}30, ${theme.palette.accent.main}50)`,
	padding: "36px",
	borderRadius: "12px",
	marginBottom: "30px",
	borderLeft: `4px solid ${theme.palette.primary.main}`,
	position: "relative",
	overflow: "hidden",
	"&:after": {
		content: '""',
		position: "absolute",
		width: "200px",
		height: "200px",
		background: `${theme.palette.accent.main}20`,
		borderRadius: "50%",
		bottom: "-100px",
		right: "-100px",
		zIndex: 0,
	},
	"@media (max-width:600px)": {
		padding: "24px 16px",
	},
}));

const FeatureCard = styled(Card)(({ theme }) => ({
	height: "100%",
	borderRadius: "12px",
	overflow: "hidden",
	boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
	position: "relative",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	"&:hover": {
		transform: "translateY(-8px)",
		boxShadow: "0 16px 30px rgba(0,0,0,0.12)",
	},
	"&:before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "4px",
		background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.accent.main})`,
	},
}));

const CTAButton = styled(Button)(({ theme }) => ({
	padding: "16px 32px",
	fontSize: "18px",
	borderRadius: "50px",
	boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	"&:hover": {
		transform: "translateY(-3px)",
		boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
	},
	"@media (max-width:600px)": {
		padding: "12px 24px",
		fontSize: "16px",
		width: "100%",
		marginBottom: "16px",
	},
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
	boxShadow: "none",
	marginBottom: "16px",
	border: `1px solid ${theme.palette.accent.main}30`,
	borderRadius: "8px !important",
	"&:before": {
		display: "none",
	},
	"&.Mui-expanded": {
		margin: "0 0 16px 0",
		borderRadius: "8px !important",
	},
	overflow: "hidden",
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
	padding: "0 16px",
	backgroundColor: theme.palette.accent.main + "15",
	"&.Mui-expanded": {
		minHeight: "48px",
	},
}));

const PackageCard = styled(Card)(({ theme, featured }) => ({
	height: "100%",
	overflow: "hidden",
	borderRadius: "12px",
	boxShadow: featured
		? "0 12px 30px rgba(0,0,0,0.12)"
		: "0 8px 24px rgba(0,0,0,0.08)",
	border: featured ? `2px solid ${theme.palette.primary.main}` : "none",
	position: "relative",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	"&:hover": {
		transform: featured ? "translateY(-8px)" : "translateY(-8px)",
		boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
	},
	zIndex: featured ? 1 : "auto",
}));

// Mobile menu component for section navigation on small screens
const MobileSectionMenu = ({ sections, activeSection, scrollToSection }) => {
	return (
		<Box sx={{ mb: 4, mt: 2 }}>
			<StyledAccordion>
				<StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6' color='primary'>
						{sections.find((section) => section.id === activeSection)?.label ||
							"Sections"}
					</Typography>
				</StyledAccordionSummary>
				<AccordionDetails>
					<List>
						{sections.map((section) => (
							<ListItem
								key={section.id}
								onClick={() => scrollToSection(section.ref)}
								sx={{
									backgroundColor:
										activeSection === section.id
											? "accent.main" + "30"
											: "transparent",
									borderRadius: "4px",
									mb: 1,
									cursor: "pointer",
								}}>
								<ListItemText primary={section.label} />
							</ListItem>
						))}
					</List>
				</AccordionDetails>
			</StyledAccordion>
		</Box>
	);
};

// Main component
const WorkmenInsurancePage = () => {
	// Service ID from backend - change this for each insurance page
	const SERVICE_ID = "SER021"; // Replace with your actual service ID for insurance

	const navigate = useNavigate();
	const { showNotification } = useNotification();
	const [activeSection, setActiveSection] = useState("overview");
	const [expanded, setExpanded] = useState(false);
	const muiTheme = useTheme();
	const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

	// Add missing state variables
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedPackage, setSelectedPackage] = useState(null);
	const [calculatorData, setCalculatorData] = useState({
		age: 30,
		income: 1000000,
		debt: 500000,
		dependents: 2,
		term: 20,
	});
	const [calculatorResult, setCalculatorResult] = useState({
		calculated: false,
		coverage: 0,
		monthlyPremium: 0,
		annualPremium: 0,
	});

	// Enhanced sticky sidebar behavior
	const [sidebarPosition, setSidebarPosition] = useState({
		isSticky: false,
		shouldStop: false,
	});

	// Store sidebar height
	const [sidebarHeight, setSidebarHeight] = useState(0);

	// Container refs for tracking positions
	const contentRef = React.useRef(null);
	const sidebarRef = React.useRef(null);
	const sidebarContainerRef = React.useRef(null);

	// For sticky sidebar tracking with a threshold of 109px
	const scrollTrigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 109, // Changed to 109px as specified
	});

	// Service data from backend
	const [service, setService] = useState(null);
	const [loading, setLoading] = useState(true);

	// Create refs for each section to use for smoother scrolling
	const overviewRef = React.useRef(null);
	const howItWorksRef = React.useRef(null);
	const benefitsRef = React.useRef(null);
	const typesRef = React.useRef(null);
	const packagesRef = React.useRef(null);
	const faqRef = React.useRef(null);
	const eligibilityRef = React.useRef(null);
	const calculatorRef = React.useRef(null);

	// Define sections dynamically based on whether packages exist
	const getSections = () => {
		const baseSections = [
			{ id: "overview", label: "Overview", ref: overviewRef },
			{ id: "how-it-works", label: "How It Works", ref: howItWorksRef },
			{ id: "benefits", label: "Benefits", ref: benefitsRef },
			{ id: "types", label: "Types of Insurance", ref: typesRef },
			{ id: "faq", label: "FAQs", ref: faqRef },
		];

		// Add packages section only if packages exist
		if (service?.packages && service.packages.length > 0) {
			baseSections.splice(4, 0, {
				id: "packages",
				label: "Packages",
				ref: packagesRef,
			});
		}

		return baseSections;
	};

	const [sections, setSections] = useState([
		{ id: "overview", label: "Overview", ref: overviewRef },
		{ id: "how-it-works", label: "How It Works", ref: howItWorksRef },
		{ id: "benefits", label: "Benefits", ref: benefitsRef },
		{ id: "types", label: "Types of Insurance", ref: typesRef },
		{ id: "faq", label: "FAQs", ref: faqRef },
	]);

	// Fetch service data from backend
	useEffect(() => {
		const fetchServiceData = async () => {
			try {
				setLoading(true);
				const response = await axios.get(
					`http://localhost:8000/api/customers/user-services/${SERVICE_ID}`
				);
				setService(response.data.service);
				// Update sections based on packages existence
				setSections(getSections());
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

	// Measure sidebar height after it renders
	useEffect(() => {
		if (sidebarRef.current) {
			setSidebarHeight(sidebarRef.current.clientHeight);
		}
	}, [service]); // Re-measure when service data changes

	// Enhanced scroll handler to control sidebar behavior
	useEffect(() => {
		const handleScroll = () => {
			if (
				!contentRef.current ||
				!sidebarRef.current ||
				!sidebarContainerRef.current
			)
				return;

			const scrollPosition = window.scrollY;
			const topThreshold = 109; // Specified threshold

			// Get the content and sidebar boundaries
			const contentTop =
				contentRef.current.getBoundingClientRect().top + window.scrollY;
			const contentBottom =
				contentRef.current.getBoundingClientRect().bottom + window.scrollY;
			const sidebarContainerTop = sidebarContainerRef.current.offsetTop;
			const sidebarContainerHeight = sidebarContainerRef.current.offsetHeight;
			const sidebarHeight = sidebarRef.current.clientHeight;
			const windowHeight = window.innerHeight;

			// Determine if sidebar should be sticky - only when content has scrolled to threshold
			const isSticky =
				scrollPosition > topThreshold &&
				scrollPosition > sidebarContainerTop - topThreshold;

			// Calculate where the sidebar should stop (at the bottom of the main content)
			const stopPoint = contentBottom - sidebarHeight - 30; // 30px buffer from bottom

			// Should sidebar stop following and anchor to bottom?
			const shouldStop =
				scrollPosition + topThreshold + sidebarHeight > contentBottom - 30;

			setSidebarPosition({
				isSticky,
				shouldStop,
			});

			// Update active section based on scroll position
			const activeSetionPos = scrollPosition + 200;
			for (const section of sections) {
				const element = section.ref.current;
				if (element) {
					const offsetTop = element.offsetTop;
					const offsetBottom = offsetTop + element.offsetHeight;

					if (activeSetionPos >= offsetTop && activeSetionPos < offsetBottom) {
						setActiveSection(section.id);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // Run once immediately to set initial state

		// Call on window resize too
		window.addEventListener("resize", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, [sections, sidebarHeight]);

	// Handle scrolling to section - improved for smoother scrolling
	const scrollToSection = (sectionRef) => {
		if (sectionRef && sectionRef.current) {
			const yOffset = -120; // Adjust this value based on your header height
			const y =
				sectionRef.current.getBoundingClientRect().top +
				window.pageYOffset +
				yOffset;
			window.scrollTo({ top: y, behavior: "smooth" });

			// Find the section id by ref and set it as active
			const section = sections.find((s) => s.ref === sectionRef);
			if (section) {
				setActiveSection(section.id);
			}
		}
	};

	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	// Function to handle CTA button clicks for lead generation
	const handleApplyNow = (isLead = true) => {
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

	// Function to handle package selection
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

	// Initialize AOS animation library if available
	useEffect(() => {
		if (typeof window !== "undefined" && typeof AOS !== "undefined") {
			AOS.init({
				duration: 800,
				once: true,
				easing: "ease-out-cubic",
			});
		}
	}, []);

	// Function to calculate coverage
	const calculateCoverage = () => {
		// Simple calculation - can be made more sophisticated
		const incomeFactor = parseInt(calculatorData.income) * 10;
		const debtAmount = parseInt(calculatorData.debt);
		const dependentFactor = parseInt(calculatorData.dependents) * 2000000;

		const recommendedCoverage = incomeFactor + debtAmount + dependentFactor;

		// Estimate premium (this is a simplified calculation)
		const ageFactor = parseInt(calculatorData.age) / 30;
		const termFactor = parseInt(calculatorData.term) / 20;
		const coverageFactor = recommendedCoverage / 10000000;

		const annualPremium = Math.round(
			2000 * ageFactor * termFactor * coverageFactor
		);
		const monthlyPremium = Math.round(annualPremium / 12);

		setCalculatorResult({
			calculated: true,
			coverage: recommendedCoverage,
			monthlyPremium: monthlyPremium,
			annualPremium: annualPremium,
		});
	};

	// Function to scroll to calculator section
	const scrollToCalculator = () => {
		scrollToSection(calculatorRef);
	};

	// Show loading state if data is being fetched
	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "50vh",
					backgroundColor: "background.default",
				}}>
				<CircularProgress size={60} thickness={4} color='primary' />
			</Box>
		);
	}

	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{ backgroundColor: "background.default", minHeight: "80vh" }}
				ref={contentRef}>
				{/* Hero Banner */}
				<HeroSection>
					<Container maxWidth='xl' sx={{ mt: { xs: "80px", md: "160px" } }}>
						<Grid
							container
							spacing={4}
							alignItems='center'
							justifyContent='center'>
							<Grid
								item
								xs={12}
								md={7}
								lg={6}
								sx={{ display: "flex", justifyContent: "center" }}>
								<HeroContent>
									<Box sx={{ textAlign: "center", mb: 2 }}>
										<Chip
											icon={<ShieldIcon />}
											label='Protect Your Future'
											sx={{
												bgcolor: "accent.main",
												color: "primary.main",
												fontWeight: "bold",
												mb: 2,
												p: 1.5,
												fontSize: "0.9rem",
												"& .MuiChip-icon": { color: "primary.main" },
											}}
										/>
									</Box>
									<Typography
										variant='h1'
										color='primary'
										gutterBottom
										sx={{
											fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
											background: "linear-gradient(to right, #1b321d, #3d6c42)",
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
											textAlign: "center",
										}}>
										{service?.serviceName || "Workmen Compensation"}
									</Typography>
									<Typography
										variant='h4'
										color='primary'
										gutterBottom
										sx={{
											mb: 5,
											fontWeight: 400,
											fontSize: { xs: "1.2rem", md: "1.3rem" },
											textAlign: "center",
										}}>
										{service?.tagline ||
											"Secure peace of mind for you and your loved ones"}
									</Typography>
									{/* <Typography
										variant='body1'
										color='primary'
										paragraph
										sx={{
											mb: 4,
											fontSize: { xs: "1rem", md: "1.1rem" },
											textAlign: "center",
										}}>
										{service?.description || ""}
									</Typography> */}
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											gap: 2,
											flexWrap: { xs: "wrap", md: "nowrap" },
										}}>
										<CTAButton
											variant='contained'
											color='primary'
											size='large'
											endIcon={<ArrowForwardIcon />}
											fullWidth={isMobile}
											onClick={() => handleApplyNow(true)}>
											{service?.ctaButtonText || "Get a Free Quote"}
										</CTAButton>
										{service?.packages && service.packages.length > 0 && (
											<CTAButton
												variant='outlined'
												color='primary'
												size='large'
												fullWidth={isMobile}
												onClick={() => scrollToSection(packagesRef)}>
												View Packages
											</CTAButton>
										)}
									</Box>
								</HeroContent>
							</Grid>
						</Grid>
					</Container>
				</HeroSection>

				{/* Main Content Section with Sticky Sidebar */}
				<Container maxWidth='xl' sx={{ py: { xs: 4, md: 8 } }}>
					<Grid container spacing={4}>
						{/* Sticky Sidebar Navigation - Desktop Only */}
						<Grid item xs={12} md={3} lg={2.5} ref={sidebarContainerRef}>
							<Hidden mdDown>
								<Box
									ref={sidebarRef}
									sx={{
										width: "300px",
										transition: "all 0.3s ease",
										position: sidebarPosition.isSticky
											? sidebarPosition.shouldStop
												? "absolute"
												: "fixed"
											: "static",
										top:
											sidebarPosition.isSticky && !sidebarPosition.shouldStop
												? "130px"
												: "auto",
										bottom: sidebarPosition.shouldStop ? "30px" : "auto",
										maxHeight: "80vh",
										overflow: "auto",
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
									<NavList component='nav'>
										{sections.map((section) => (
											<NavItem
												key={section.id}
												active={activeSection === section.id}
												onClick={() => scrollToSection(section.ref)}>
												<ListItemText
													primary={section.label}
													primaryTypographyProps={{
														fontWeight:
															activeSection === section.id ? 600 : 400,
														color: "primary",
													}}
												/>
												{section.id === "packages" && (
													<Chip
														size='small'
														label='New'
														sx={{
															backgroundColor: "primary.main",
															color: "white",
															ml: 1,
															fontSize: "0.7rem",
														}}
													/>
												)}
											</NavItem>
										))}
									</NavList>
									<Box
										sx={{
											mt: 4,
											p: 3,
											borderRadius: "12px",
											textAlign: "center",
											background: "linear-gradient(135deg, #1b321d, #2c4e30)",
											color: "white",
											position: "relative",
											overflow: "hidden",
											boxShadow: "0 8px 24px rgba(27, 50, 29, 0.3)",
											"&::before": {
												content: '""',
												position: "absolute",
												top: "-30px",
												right: "-30px",
												width: "100px",
												height: "100px",
												borderRadius: "50%",
												background: "rgba(255,255,255,0.1)",
												zIndex: 0,
											},
										}}>
										<FamilyRestroomIcon sx={{ fontSize: 40, mb: 1 }} />
										<Typography variant='h5' color='white' gutterBottom>
											Need Help?
										</Typography>
										<Typography
											variant='body2'
											color='white'
											sx={{ opacity: 0.9 }}
											paragraph>
											Our insurance experts are here to assist you with your
											coverage needs
										</Typography>
										<Button
											variant='outlined'
											sx={{
												mt: 1,
												borderColor: "white",
												color: "white",
												"&:hover": {
													backgroundColor: "rgba(255,255,255,0.1)",
													borderColor: "white",
												},
											}}
											onClick={() => handleApplyNow(true)}>
											Contact Us
										</Button>
									</Box>

									<Box
										sx={{
											mt: 4,
											p: 3,
											backgroundColor: "accent.main",
											borderRadius: "12px",
											textAlign: "center",
											boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
										}}>
										<LocalAtmIcon
											sx={{ fontSize: 36, color: "primary.main", mb: 1 }}
										/>
										<Typography variant='h5' color='primary' gutterBottom>
											Tax Benefits
										</Typography>
										<Typography variant='body2' color='primary' paragraph>
											Enjoy tax benefits on premiums under Section 80C
										</Typography>
										{service?.packages && service.packages.length > 0 ? (
											<Button
												variant='contained'
												color='primary'
												sx={{ mt: 1 }}
												onClick={() => scrollToSection(packagesRef)}>
												View Plans
											</Button>
										) : (
											<Button
												variant='contained'
												color='primary'
												sx={{ mt: 1 }}
												onClick={() => handleApplyNow(true)}>
												Contact Us
											</Button>
										)}
									</Box>
								</Box>
							</Hidden>
						</Grid>

						{/* Main Content */}
						<Grid item xs={12} md={9} lg={9.5}>
							{/* Mobile Navigation Menu */}
							{isMobile && (
								<MobileSectionMenu
									sections={sections}
									activeSection={activeSection}
									scrollToSection={(sectionId) => {
										const section = sections.find((s) => s.id === sectionId);
										if (section) scrollToSection(section.ref);
									}}
								/>
							)}

							{/* Overview Section */}
							<section ref={overviewRef} id='overview'>
								<SectionBox
									id='overview-section'
									style={{ paddingBottom: "90px" }}>
									<Typography
										variant='h3'
										color='primary'
										gutterBottom
										sx={{
											mb: 4,
											fontSize: { xs: "1.6rem", md: "2.2rem" },
											position: "relative",
											display: "inline-block",
											"&:after": {
												content: '""',
												position: "absolute",
												width: "60%",
												height: "4px",
												bottom: "-10px",
												left: "0",
												backgroundColor: "accent.main",
												borderRadius: "4px",
											},
										}}>
										Overview
									</Typography>

									<Grid container spacing={3}>
										<Grid item xs={12} md={7}>
											<Typography
												variant='body1'
												paragraph
												sx={{
													fontSize: { xs: "1rem", md: "1.05rem" },
													lineHeight: 1.7,
												}}>
												At FinShelter, we understand the importance of
												protecting your workforce and ensuring the well-being of
												your employees. Workmen Compensation Insurance provides
												financial coverage to workers in case of workplace
												injuries, accidents, or illnesses arising out of
												employment.
											</Typography>
											<Typography
												variant='body1'
												paragraph
												sx={{
													fontSize: { xs: "1rem", md: "1.05rem" },
													lineHeight: 1.7,
												}}>
												With FinShelter's reliable insurance solutions, you can
												safeguard your employees while complying with statutory
												requirements. Workmen Compensation Insurance is a vital
												component of workplace safety and employer
												responsibility.
											</Typography>
											<Typography
												variant='body1'
												paragraph
												sx={{
													fontSize: { xs: "1rem", md: "1.05rem" },
													lineHeight: 1.7,
												}}>
												Investing in Workmen Compensation Insurance is more than
												a legal obligation—it's a commitment to your employees
												and the longevity of your business. With FinShelter, you
												can ensure that your team is protected, your business is
												compliant, and your operations run smoothly.
											</Typography>
										</Grid>
										<Grid item xs={12} md={5}>
											<Box
												sx={{
													backgroundColor: "accent.main" + "15",
													borderRadius: "12px",
													p: { xs: 3, md: 3 },
													height: "100%",
													boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
													border: "1px solid",
													borderColor: "accent.main" + "30",
													position: "relative",
													overflow: "hidden",
													marginTop: { xs: 3, md: "-70px" },
													marginBottom: { xs: 4, md: 0 },
													paddingBottom: { xs: 5, md: 3 },
													"&:after": {
														content: '""',
														position: "absolute",
														width: "150px",
														height: "150px",
														background: "accent.main" + "15",
														borderRadius: "50%",
														bottom: "-80px",
														right: "-80px",
														zIndex: 0,
													},
													"&:before": {
														content: '""',
														position: "absolute",
														top: 0,
														left: 0,
														width: "100%",
														height: "4px",
														background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.accent.main})`,
													},
												}}>
												<Typography
													variant='h5'
													color='primary'
													gutterBottom
													sx={{
														mb: 2,
														fontWeight: 600,
														fontSize: { xs: "1.3rem", md: "1.5rem" },
													}}>
													Why Workmen Compensation Insurance Matters
												</Typography>
												<List sx={{ pl: 1, position: "relative", zIndex: 1 }}>
													{[
														"Legal Compliance: Meet the statutory obligations under the Workmen's Compensation Act and other relevant laws.",
														"Financial Protection for Employees: Provide compensation for medical expenses, disability, or loss of income due to work-related injuries or illnesses.",
														"Employee Retention: Foster trust and loyalty among employees by demonstrating care for their well-being.",
														"Business Continuity: Protect your organization against financial liabilities arising from employee claims, ensuring uninterrupted operations.",
													].map((benefit, index) => (
														<ListItem
															key={index}
															sx={{
																px: 0,
																py: 0.7,
																alignItems: "flex-start",
																transition: "transform 0.2s ease",
																"&:hover": {
																	transform: "translateX(5px)",
																},
															}}>
															<ListItemIcon sx={{ minWidth: "36px" }}>
																<CheckCircleOutlineIcon
																	sx={{
																		color: "primary.main",
																		fontSize: "1.25rem",
																	}}
																/>
															</ListItemIcon>
															<ListItemText
																primary={benefit}
																primaryTypographyProps={{
																	fontSize: { xs: "0.9rem", md: "0.95rem" },
																	fontWeight: 400,
																	color: "primary.main",
																}}
															/>
														</ListItem>
													))}
												</List>
											</Box>
										</Grid>
									</Grid>
								</SectionBox>
							</section>

							{/* Why Choose Vehicle Insurance Section */}
							<section id='why-choose'>
								<SectionBox sx={{ mb: { xs: 5, md: 4 } }}>
									<Typography
										variant='h3'
										color='primary'
										gutterBottom
										sx={{
											mb: 4,
											fontSize: { xs: "1.6rem", md: "2.2rem" },
											position: "relative",
											display: "inline-block",
											"&:after": {
												content: '""',
												position: "absolute",
												width: "60%",
												height: "4px",
												bottom: "-10px",
												left: "0",
												backgroundColor: "accent.main",
												borderRadius: "4px",
											},
										}}>
										Coverage Offered
									</Typography>

									<Grid container spacing={{ xs: 4, md: 2 }} sx={{ mx: -1 }}>
										{[
											{
												title: "Medical Expenses",
												description:
													"Covers hospitalization, treatment, and rehabilitation costs for injured workers.",
												icon: (
													<FavoriteIcon
														sx={{ fontSize: 36, color: "primary.main" }}
													/>
												),
											},
											{
												title: "Disability Benefits",
												description:
													"Provides compensation for temporary or permanent disabilities caused by workplace accidents.",
												icon: (
													<SecurityIcon
														sx={{ fontSize: 36, color: "primary.main" }}
													/>
												),
											},
											{
												title: "Death Benefits",
												description:
													"Offers financial support to the family of an employee in case of a fatal accident.",
												icon: (
													<AccountBalanceWalletIcon
														sx={{ fontSize: 36, color: "primary.main" }}
													/>
												),
											},
											{
												title: "Legal Expenses",
												description:
													"Covers costs related to legal claims arising from workplace incidents.",
												icon: (
													<AccountBalanceIcon
														sx={{ fontSize: 36, color: "primary.main" }}
													/>
												),
											},
											{
												title: "Occupational Diseases",
												description:
													"Includes coverage for illnesses directly linked to the nature of employment.",
												icon: (
													<HistoryIcon
														sx={{ fontSize: 36, color: "primary.main" }}
													/>
												),
											},
										].map((item, index) => (
											<Grid
												item
												xs={12}
												sm={6}
												key={index}
												sx={{ mb: { xs: "40px", md: "60px" } }}>
												<Card
													sx={{
														height: "100%",
														p: { xs: 2.5, md: 3 },
														border: "1px solid rgba(0,0,0,0.08)",
														boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
														transition:
															"transform 0.3s ease, box-shadow 0.3s ease",
														"&:hover": {
															transform: "translateY(-10px)",
															boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
														},
														overflow: "hidden",
													}}>
													<Box
														sx={{
															mb: 2,
															display: "flex",
															alignItems: "flex-start",
														}}>
														<Box sx={{ mr: 2, mt: 0.5 }}>{item.icon}</Box>
														<Typography
															variant='h5'
															color='primary'
															sx={{
																fontWeight: 600,
																fontSize: { xs: "1.2rem", md: "1.5rem" },
															}}>
															{item.title}
														</Typography>
													</Box>
													<Typography
														variant='body1'
														sx={{
															color: "text.secondary",
															lineHeight: 1.7,
															fontSize: { xs: "0.9rem", md: "1rem" },
														}}>
														{item.description}
													</Typography>
												</Card>
											</Grid>
										))}
									</Grid>
								</SectionBox>
							</section>

							{/* Add-On Covers Section */}
							<section id='add-on-covers'>
								<SectionBox
									sx={{
										background:
											"linear-gradient(to right, rgba(198, 219, 206, 0.4), rgba(198, 219, 206, 0.1))",
										mb: { xs: 5, md: 4 },
									}}>
									<Typography
										variant='h3'
										color='primary'
										gutterBottom
										sx={{
											mb: 4,
											fontSize: { xs: "1.6rem", md: "2.2rem" },
											position: "relative",
											display: "inline-block",
											"&:after": {
												content: '""',
												position: "absolute",
												width: "60%",
												height: "4px",
												bottom: "-10px",
												left: "0",
												backgroundColor: "accent.main",
												borderRadius: "4px",
											},
										}}>
										Why Choose FinShelter?
									</Typography>

									<Typography
										variant='body1'
										paragraph
										sx={{
											mb: 4,
											maxWidth: "850px",
											fontSize: { xs: "0.95rem", md: "1rem" },
										}}>
										At FinShelter, we aim to provide employers with dependable,
										cost-effective solutions that protect their workforce:
									</Typography>

									<Grid container spacing={{ xs: 4, md: 3 }}>
										{[
											{
												title: "Expert Guidance",
												description:
													"We help you understand your legal obligations and select the right coverage for your specific industry and workforce size.",
												icon: <SupportAgentIcon />,
											},
											{
												title: "Tailored Solutions",
												description:
													"Our policies are designed to meet the unique needs of your organization, ensuring maximum coverage and flexibility.",
												icon: <CalculateIcon />,
											},
											{
												title: "Efficient Claims Process",
												description:
													"We provide fast and hassle-free claims assistance, minimizing delays and disruptions.",
												icon: <SecurityIcon />,
											},
											{
												title: "Comprehensive Protection",
												description:
													"Our insurance plans offer holistic coverage, ensuring both the employer's and employees' interests are safeguarded.",
												icon: <ShieldIcon />,
											},
										].map((offering, index) => (
											<Grid
												item
												xs={12}
												sm={6}
												md={3}
												key={index}
												sx={{ mb: { xs: 5, md: 0 } }}>
												<Card sx={{ height: "100%", pb: { xs: 2, md: 0 } }}>
													<CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
														<Box
															sx={{
																mb: 2,
																display: "flex",
																alignItems: "center",
															}}>
															<Avatar
																sx={{
																	bgcolor: "primary.main",
																	color: "white",
																	mr: 2,
																}}>
																{offering.icon}
															</Avatar>
															<Typography
																variant='h5'
																color='primary'
																sx={{
																	fontWeight: 600,
																	fontSize: { xs: "1.1rem", md: "1.25rem" },
																}}>
																{offering.title}
															</Typography>
														</Box>
														<Typography
															variant='body2'
															sx={{
																color: "text.secondary",
																fontSize: { xs: "0.85rem", md: "0.9rem" },
																lineHeight: 1.6,
															}}>
															{offering.description}
														</Typography>
													</CardContent>
												</Card>
											</Grid>
										))}
									</Grid>
								</SectionBox>
							</section>

							{/* Why Choose FinShelter Section */}
							<section id='types' ref={typesRef}>
								<SectionBox sx={{ mb: { xs: 5, md: 4 } }}>
									<Typography
										variant='h3'
										color='primary'
										gutterBottom
										sx={{
											mb: 4,
											fontSize: { xs: "1.6rem", md: "2.2rem" },
											position: "relative",
											display: "inline-block",
											"&:after": {
												content: '""',
												position: "absolute",
												width: "60%",
												height: "4px",
												bottom: "-10px",
												left: "0",
												backgroundColor: "accent.main",
												borderRadius: "4px",
											},
										}}>
										Protect Your Workforce, Secure Your Business
									</Typography>

									<Grid container spacing={4} alignItems='flex-start'>
										<Grid item xs={12} md={6}>
											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													justifyContent: "flex-start",
													paddingTop: "20px",
												}}>
												<Typography
													variant='body1'
													paragraph
													sx={{
														fontSize: { xs: "1rem", md: "1.05rem" },
														lineHeight: 1.7,
													}}>
													Investing in Workmen Compensation Insurance is more
													than a legal obligation—it's a commitment to your
													employees and the longevity of your business. With
													FinShelter, you can ensure that your team is
													protected, your business is compliant, and your
													operations run smoothly.
												</Typography>

												<Typography
													variant='body1'
													paragraph
													sx={{
														fontSize: { xs: "1rem", md: "1.05rem" },
														lineHeight: 1.7,
														mb: 0,
													}}>
													Our insurance plans provide comprehensive coverage for
													a range of scenarios, including medical expenses,
													disability benefits, death benefits, legal expenses,
													and coverage for occupational diseases. Our team of
													experts will help you navigate the complexities of
													workmen compensation insurance and tailor a solution
													that meets your specific business needs.
												</Typography>

												{/* Decorative Image Element */}
												<Box
													sx={{
														mt: 4,
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
													}}>
													<Box
														sx={{
															width: "100%",
															maxWidth: "250px",
															height: "120px",
															borderRadius: "10px",
															position: "relative",
															overflow: "hidden",
															boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
															background:
																"linear-gradient(135deg, rgba(27, 50, 29, 0.02), rgba(198, 219, 206, 0.2))",
															border: "1px solid rgba(198, 219, 206, 0.5)",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															flexDirection: "column",
														}}>
														<ShieldIcon
															sx={{
																fontSize: 40,
																color: "primary.main",
																opacity: 0.8,
																mb: 1,
															}}
														/>
														<Typography
															variant='body2'
															color='primary.main'
															sx={{ fontWeight: 600, textAlign: "center" }}>
															Trusted Protection for Your Workforce
														</Typography>
													</Box>
												</Box>
											</Box>
										</Grid>

										<Grid item xs={12} md={6}>
											<Box sx={{ pl: { xs: 0, md: 2 } }}>
												<List
													sx={{
														display: "flex",
														flexDirection: "column",
														gap: 1,
														pt: 0,
													}}>
													{[
														{
															title: "Legal Compliance",
															description:
																"Meet statutory obligations under the Workmen's Compensation Act and other relevant laws.",
														},
														{
															title: "Financial Security",
															description:
																"Protect your business from unexpected financial liabilities arising from workplace accidents.",
														},
														{
															title: "Employee Welfare",
															description:
																"Demonstrate your commitment to your employees' well-being and safety.",
														},
														{
															title: "Operational Continuity",
															description:
																"Ensure uninterrupted business operations even in the face of workplace incidents.",
														},
														{
															title: "Peace of Mind",
															description:
																"Focus on growing your business knowing your workforce is protected by comprehensive insurance coverage.",
														},
													].map((item, index) => (
														<ListItem
															key={index}
															sx={{
																py: 1.5,
																px: 0,
																borderBottom:
																	index !== 4 ? "1px solid #e0e0e0" : "none",
															}}>
															<ListItemIcon sx={{ minWidth: "44px" }}>
																<Avatar
																	sx={{
																		bgcolor: "primary.main",
																		width: 34,
																		height: 34,
																		fontSize: "0.9rem",
																	}}>
																	{index + 1}
																</Avatar>
															</ListItemIcon>
															<ListItemText
																primary={
																	<Typography
																		variant='h6'
																		color='primary'
																		sx={{
																			mb: 0.5,
																			fontWeight: 600,
																			fontSize: { xs: "1rem", md: "1.1rem" },
																		}}>
																		{item.title}
																	</Typography>
																}
																secondary={
																	<Typography
																		variant='body2'
																		color='text.secondary'
																		sx={{
																			fontSize: { xs: "0.85rem", md: "0.9rem" },
																		}}>
																		{item.description}
																	</Typography>
																}
															/>
														</ListItem>
													))}
												</List>
											</Box>
										</Grid>
									</Grid>
								</SectionBox>
							</section>

							{/* How It Works Section */}
							<section id='how-it-works' ref={howItWorksRef}>
								<SectionBox
									sx={{
										background:
											"linear-gradient(135deg, rgba(27, 50, 29, 0.05), rgba(198, 219, 206, 0.2))",
										mb: { xs: 5, md: 4 },
									}}>
									<Typography
										variant='h3'
										color='primary'
										gutterBottom
										sx={{
											mb: 4,
											fontSize: { xs: "1.6rem", md: "2.2rem" },
											position: "relative",
											display: "inline-block",
											"&:after": {
												content: '""',
												position: "absolute",
												width: "60%",
												height: "4px",
												bottom: "-10px",
												left: "0",
												backgroundColor: "accent.main",
												borderRadius: "4px",
											},
										}}>
										How It Works
									</Typography>

									<Typography
										variant='body1'
										paragraph
										sx={{
											mb: 4,
											maxWidth: "850px",
											fontSize: { xs: "0.95rem", md: "1rem" },
										}}>
										We follow a simple and streamlined process to ensure you get
										the right coverage for your workforce:
									</Typography>

									<Box sx={{ position: "relative" }}>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Box
													sx={{
														width: "100%",
														height: { xs: "300px", md: "460px" },
														backgroundColor: "accent.main",
														borderRadius: "16px",
														overflow: "hidden",
														backgroundImage: "url('/images/loan1.jpg')",
														backgroundSize: "cover",
														backgroundPosition: "center",
														boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
														position: "relative",
														"&::after": {
															content: '""',
															position: "absolute",
															top: 0,
															left: 0,
															right: 0,
															bottom: 0,
															background: "rgba(27, 50, 29, 0.3)",
															zIndex: 1,
														},
													}}
												/>
											</Grid>

											<Grid item xs={12} md={6}>
												<Box>
													<Box
														sx={{
															mb: 4,
															display: "flex",
															alignItems: "flex-start",
														}}>
														<Box
															sx={{
																width: 36,
																height: 36,
																borderRadius: "50%",
																bgcolor: "primary.main",
																color: "white",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																fontWeight: "bold",
																fontSize: "1.2rem",
																mr: 2,
																flexShrink: 0,
															}}>
															1
														</Box>
														<Box>
															<Typography
																variant='h5'
																color='primary'
																sx={{
																	fontWeight: 600,
																	mb: 1,
																	fontSize: { xs: "1.1rem", md: "1.25rem" },
																}}>
																Needs Assessment
															</Typography>
															<Typography
																variant='body1'
																color='text.secondary'
																sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
																Our team evaluates your business requirements
																and risks to determine the most suitable
																coverage.
															</Typography>
														</Box>
													</Box>

													<Box
														sx={{
															mb: 4,
															display: "flex",
															alignItems: "flex-start",
														}}>
														<Box
															sx={{
																width: 36,
																height: 36,
																borderRadius: "50%",
																bgcolor: "primary.main",
																color: "white",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																fontWeight: "bold",
																fontSize: "1.2rem",
																mr: 2,
																flexShrink: 0,
															}}>
															2
														</Box>
														<Box>
															<Typography
																variant='h5'
																color='primary'
																sx={{
																	fontWeight: 600,
																	mb: 1,
																	fontSize: { xs: "1.1rem", md: "1.25rem" },
																}}>
																Policy Customization
															</Typography>
															<Typography
																variant='body1'
																color='text.secondary'
																sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
																We tailor the insurance plan to align with your
																workforce size, industry, and operational risks.
															</Typography>
														</Box>
													</Box>

													<Box
														sx={{
															mb: 4,
															display: "flex",
															alignItems: "flex-start",
														}}>
														<Box
															sx={{
																width: 36,
																height: 36,
																borderRadius: "50%",
																bgcolor: "primary.main",
																color: "white",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																fontWeight: "bold",
																fontSize: "1.2rem",
																mr: 2,
																flexShrink: 0,
															}}>
															3
														</Box>
														<Box>
															<Typography
																variant='h5'
																color='primary'
																sx={{
																	fontWeight: 600,
																	mb: 1,
																	fontSize: { xs: "1.1rem", md: "1.25rem" },
																}}>
																Seamless Enrollment
															</Typography>
															<Typography
																variant='body1'
																color='text.secondary'
																sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
																Benefit from our simplified documentation and
																approval process for quick implementation.
															</Typography>
														</Box>
													</Box>

													<Box
														sx={{ display: "flex", alignItems: "flex-start" }}>
														<Box
															sx={{
																width: 36,
																height: 36,
																borderRadius: "50%",
																bgcolor: "primary.main",
																color: "white",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																fontWeight: "bold",
																fontSize: "1.2rem",
																mr: 2,
																flexShrink: 0,
															}}>
															4
														</Box>
														<Box>
															<Typography
																variant='h5'
																color='primary'
																sx={{
																	fontWeight: 600,
																	mb: 1,
																	fontSize: { xs: "1.1rem", md: "1.25rem" },
																}}>
																Claims Assistance
															</Typography>
															<Typography
																variant='body1'
																color='text.secondary'
																sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
																In the event of an incident, our dedicated
																claims team provides prompt and efficient
																support to resolve issues.
															</Typography>
														</Box>
													</Box>
												</Box>
											</Grid>
										</Grid>

										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												mt: { xs: 8, md: 6 },
												position: "relative",
												zIndex: 1,
											}}>
											<Button
												variant='contained'
												color='primary'
												size='large'
												onClick={() => handleApplyNow(true)}
												sx={{ px: 4 }}>
												Contact Us Today
											</Button>
										</Box>
									</Box>
								</SectionBox>
							</section>

							{/* Packages Section - Only render if packages exist */}
							{service?.packages && service.packages.length > 0 && (
								<section ref={packagesRef} id='packages'>
									<SectionBox
										id='packages-section'
										sx={{ mb: { xs: 5, md: 4 } }}>
										<Typography
											variant='h3'
											color='primary'
											gutterBottom
											sx={{
												mb: 1,
												fontSize: { xs: "1.6rem", md: "2.2rem" },
												position: "relative",
												display: "inline-block",
												"&:after": {
													content: '""',
													position: "absolute",
													width: "60%",
													height: "4px",
													bottom: "-10px",
													left: "0",
													backgroundColor: "accent.main",
													borderRadius: "4px",
												},
											}}>
											Insurance Packages
										</Typography>
										<Typography
											variant='subtitle1'
											paragraph
											sx={{
												mb: 4,
												maxWidth: "850px",
												fontSize: { xs: "0.95rem", md: "1rem" },
											}}>
											Choose the right coverage to safeguard your workforce and
											your business. Our insurance plans offer comprehensive
											protection at affordable rates.
										</Typography>

										<Grid container spacing={{ xs: 6, md: 3 }}>
											{service.packages.map((pkg, index) => (
												<Grid
													item
													xs={12}
													sm={6}
													md={4}
													key={index}
													sx={{ mb: { xs: 9, md: 0 } }}>
													<PackageCard
														featured={index === 1}
														sx={{
															transform: index === 1 ? "scale(1.05)" : "none",
															my: index === 1 ? 0 : 2,
															position: "relative",
															overflow: "visible",
															"&::before":
																index === 1
																	? {
																			content: '""',
																			position: "absolute",
																			top: "-15px",
																			right: "-10px",
																			background: "primary.main",
																			color: "white",
																			padding: "5px 12px",
																			borderRadius: "20px",
																			fontSize: "0.7rem",
																			fontWeight: "bold",
																			boxShadow:
																				"0 4px 8px rgba(0, 0, 0, 0.15)",
																			zIndex: 2,
																	  }
																	: {},
														}}
														onClick={() => handlePackageSelect(pkg)}>
														<CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
															<Box
																sx={{
																	mb: 2,
																	display: "flex",
																	justifyContent: "space-between",
																	alignItems: "flex-start",
																}}>
																<Box>
																	<Typography
																		variant='h5'
																		color='primary'
																		sx={{
																			fontWeight: 600,
																			mb: 0.5,
																			fontSize: { xs: "1.2rem", md: "1.4rem" },
																		}}>
																		{pkg.name}
																	</Typography>
																	<Typography
																		variant='body2'
																		color='text.secondary'
																		sx={{
																			mb: 2,
																			fontSize: { xs: "0.85rem", md: "0.9rem" },
																		}}>
																		{pkg.shortDescription}
																	</Typography>
																</Box>
																{index === 1 && (
																	<Chip
																		label='Popular'
																		size='small'
																		sx={{
																			bgcolor: "primary.main",
																			color: "white",
																			fontWeight: 600,
																		}}
																	/>
																)}
															</Box>

															<Typography
																variant='h4'
																color='primary'
																sx={{
																	display: "flex",
																	alignItems: "baseline",
																	fontWeight: 700,
																	mb: 3,
																	fontSize: { xs: "1.5rem", md: "2rem" },
																}}>
																₹{pkg.price}
																<Typography
																	component='span'
																	variant='subtitle2'
																	color='text.secondary'
																	sx={{
																		ml: 1,
																		fontWeight: 400,
																		fontSize: { xs: "0.8rem", md: "0.9rem" },
																	}}>
																	/ year
																</Typography>
															</Typography>

															<Divider sx={{ mb: 2 }} />

															<List sx={{ mb: 2 }}>
																{pkg.features &&
																	pkg.features.map((feature, idx) => (
																		<ListItem
																			key={idx}
																			sx={{
																				px: 0,
																				py: 0.5,
																				alignItems: "flex-start",
																			}}>
																			<ListItemIcon sx={{ minWidth: "32px" }}>
																				<CheckCircleOutlineIcon
																					sx={{
																						color: "success.main",
																						fontSize: "1.2rem",
																					}}
																				/>
																			</ListItemIcon>
																			<ListItemText
																				primary={feature}
																				primaryTypographyProps={{
																					fontSize: {
																						xs: "0.85rem",
																						md: "0.9rem",
																					},
																				}}
																			/>
																		</ListItem>
																	))}
															</List>
														</CardContent>
														<CardActions sx={{ px: 3, pb: { xs: 4, md: 3 } }}>
															<Button
																variant='contained'
																color='primary'
																fullWidth
																onClick={() => handlePackageSelect(pkg)}>
																Select Package
															</Button>
														</CardActions>
													</PackageCard>
												</Grid>
											))}
										</Grid>
									</SectionBox>
								</section>
							)}

							{/* FAQ Section */}
							<section ref={faqRef} id='faq'>
								<SectionBox id='faq-section'>
									<Typography
										variant='h3'
										color='primary'
										gutterBottom
										sx={{
											mb: 4,
											fontSize: { xs: "1.6rem", md: "2.2rem" },
											position: "relative",
											display: "inline-block",
											"&:after": {
												content: '""',
												position: "absolute",
												width: "60%",
												height: "4px",
												bottom: "-10px",
												left: "0",
												backgroundColor: "accent.main",
												borderRadius: "4px",
											},
										}}>
										Frequently Asked Questions
									</Typography>

									<Accordion sx={{ mb: { xs: 3, md: 2 } }}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls='panel1a-content'
											id='panel1a-header'>
											<Typography
												variant='h6'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												What is Workmen Compensation?
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography
												sx={{
													fontSize: { xs: "0.9rem", md: "1rem" },
													lineHeight: 1.6,
												}}>
												Workmen Compensation Insurance is a type of business
												insurance that provides financial coverage to employees
												who suffer from work-related injuries or illnesses. It
												helps employers fulfill their legal obligations while
												ensuring that injured workers receive proper medical
												care and compensation for lost wages.
											</Typography>
										</AccordionDetails>
									</Accordion>

									<Accordion sx={{ mb: { xs: 3, md: 2 } }}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls='panel2a-content'
											id='panel2a-header'>
											<Typography
												variant='h6'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												Is Workmen Compensation Insurance mandatory?
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography
												sx={{
													fontSize: { xs: "0.9rem", md: "1rem" },
													lineHeight: 1.6,
												}}>
												Yes, in most states and industries, Workmen Compensation
												Insurance is mandatory for businesses with employees.
												The specific requirements vary by location, industry,
												and the number of employees, but generally, businesses
												must provide this coverage to comply with legal
												obligations and protect their workforce.
											</Typography>
										</AccordionDetails>
									</Accordion>

									<Accordion sx={{ mb: { xs: 3, md: 2 } }}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls='panel3a-content'
											id='panel3a-header'>
											<Typography
												variant='h6'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												What does Workmen Compensation Insurance cover?
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography
												paragraph
												sx={{
													fontSize: { xs: "0.9rem", md: "1rem" },
													lineHeight: 1.6,
												}}>
												Workmen Compensation Insurance typically covers:
											</Typography>
											<List>
												<ListItem>
													<ListItemIcon>
														<ArrowRightIcon color='primary' />
													</ListItemIcon>
													<ListItemText
														primary='Medical expenses for work-related injuries or illnesses'
														primaryTypographyProps={{
															fontSize: { xs: "0.9rem", md: "1rem" },
														}}
													/>
												</ListItem>
												<ListItem>
													<ListItemIcon>
														<ArrowRightIcon color='primary' />
													</ListItemIcon>
													<ListItemText
														primary='Lost wages during recovery periods'
														primaryTypographyProps={{
															fontSize: { xs: "0.9rem", md: "1rem" },
														}}
													/>
												</ListItem>
												<ListItem>
													<ListItemIcon>
														<ArrowRightIcon color='primary' />
													</ListItemIcon>
													<ListItemText
														primary='Rehabilitation costs for injured employees'
														primaryTypographyProps={{
															fontSize: { xs: "0.9rem", md: "1rem" },
														}}
													/>
												</ListItem>
												<ListItem>
													<ListItemIcon>
														<ArrowRightIcon color='primary' />
													</ListItemIcon>
													<ListItemText
														primary='Death benefits to the dependents of deceased workers'
														primaryTypographyProps={{
															fontSize: { xs: "0.9rem", md: "1rem" },
														}}
													/>
												</ListItem>
												<ListItem>
													<ListItemIcon>
														<ArrowRightIcon color='primary' />
													</ListItemIcon>
													<ListItemText
														primary='Legal expenses related to workplace injury claims'
														primaryTypographyProps={{
															fontSize: { xs: "0.9rem", md: "1rem" },
														}}
													/>
												</ListItem>
											</List>
										</AccordionDetails>
									</Accordion>

									<Accordion sx={{ mb: { xs: 3, md: 2 } }}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls='panel4a-content'
											id='panel4a-header'>
											<Typography
												variant='h6'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												How is the premium for Workmen Compensation calculated?
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography
												sx={{
													fontSize: { xs: "0.9rem", md: "1rem" },
													lineHeight: 1.6,
												}}>
												The premium for Workmen Compensation Insurance is
												typically calculated based on several factors including
												the type of industry, the nature of work performed, the
												number of employees, the total payroll, past claims
												history, and the level of risk associated with the
												business operations. Higher-risk industries generally
												pay higher premiums.
											</Typography>
										</AccordionDetails>
									</Accordion>

									<Accordion sx={{ mb: { xs: 3, md: 2 } }}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls='panel5a-content'
											id='panel5a-header'>
											<Typography
												variant='h6'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												What should I do if an employee is injured at work?
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography
												sx={{
													fontSize: { xs: "0.9rem", md: "1rem" },
													lineHeight: 1.6,
												}}>
												If an employee is injured at work, you should
												immediately provide necessary medical assistance,
												document the incident thoroughly, notify your insurance
												provider promptly, file the required reports with the
												appropriate government agencies, and maintain open
												communication with both the injured employee and the
												insurance company throughout the claims process. Our
												team at FinShelter can guide you through these steps to
												ensure proper handling of the situation.
											</Typography>
										</AccordionDetails>
									</Accordion>

									<Box sx={{ mt: 4, textAlign: "center" }}>
										<Typography
											variant='body1'
											paragraph
											sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}>
											Have more questions? Our insurance experts are here to
											help.
										</Typography>
										<Button
											variant='outlined'
											color='primary'
											size='large'
											startIcon={<ContactSupportIcon />}
											onClick={() => handleApplyNow(true)}
											sx={{ mt: { xs: 2, md: 0 } }}>
											Contact Our Support Team
										</Button>
									</Box>
								</SectionBox>
							</section>

							{/* CTA Banner */}
							<SectionBox
								sx={{
									mt: 6,
									background:
										"linear-gradient(135deg, #1b321d 0%, #2d4d31 100%)",
									borderRadius: "16px",
									p: { xs: 3, md: 5 },
									color: "white",
									position: "relative",
									overflow: "hidden",
								}}>
								<Box
									sx={{
										position: "absolute",
										top: 0,
										right: 0,
										width: "40%",
										height: "100%",
										backgroundImage:
											"linear-gradient(to right, rgba(27, 50, 29, 0) 0%, rgba(198, 219, 206, 0.3) 100%)",
										zIndex: 1,
									}}
								/>

								<Grid
									container
									spacing={{ xs: 4, md: 3 }}
									alignItems='center'
									sx={{ position: "relative", zIndex: 2 }}>
									<Grid item xs={12} md={8}>
										<Typography
											variant='h3'
											sx={{
												mb: 2,
												fontWeight: 700,
												color: "white",
												fontSize: { xs: "1.6rem", md: "2rem" },
											}}>
											Protect Your Workforce Today
										</Typography>
										<Typography
											variant='h6'
											sx={{
												mb: 3,
												fontWeight: 400,
												opacity: 0.9,
												color: "white",
												fontSize: { xs: "1.1rem", md: "1.3rem" },
											}}>
											Get comprehensive workmen compensation coverage at
											affordable rates to secure your business and employees.
										</Typography>
										<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
											<Button
												variant='contained'
												size='large'
												sx={{
													bgcolor: "#c6dbce",
													color: "#1b321d",
													"&:hover": {
														bgcolor: "#a9c6b2",
													},
													px: 4,
													fontWeight: 600,
												}}
												onClick={() => handleApplyNow(true)}>
												Apply Now
											</Button>
											<Button
												variant='outlined'
												size='large'
												sx={{
													borderColor: "white",
													color: "white",
													"&:hover": {
														borderColor: "#c6dbce",
														bgcolor: "rgba(255,255,255,0.1)",
													},
												}}
												onClick={() => scrollToCalculator()}>
												Calculate Coverage
											</Button>
										</Box>
									</Grid>
									<Grid
										item
										xs={12}
										md={4}
										sx={{ textAlign: { xs: "center", md: "right" } }}>
										<Box
											sx={{
												display: "inline-flex",
												alignItems: "center",
												justifyContent: "center",
												p: 2,
												borderRadius: "16px",
												background: "rgba(255,255,255,0.1)",
												backdropFilter: "blur(10px)",
												border: "1px solid rgba(255,255,255,0.2)",
											}}>
											<ShieldIcon
												sx={{ fontSize: 80, color: "#c6dbce", opacity: 0.9 }}
											/>
										</Box>
									</Grid>
								</Grid>
							</SectionBox>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</ThemeProvider>
	);
};

export default WorkmenInsurancePage;
