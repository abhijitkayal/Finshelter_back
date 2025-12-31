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
import MenuIcon from "@mui/icons-material/Menu";
import "./services.css";

// Theme configuration with updated colors
const theme = createTheme({
	palette: {
		primary: {
			main: "#1e4a30", // Darker green from reference
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
			alternate: "#edf1ef", // Consistent color for alternating sections
		},
		accent: {
			main: "#8cc63f", // Green accent color from reference
			light: "#c6dbce",
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
	components: {
		MuiContainer: {
			styleOverrides: {
				maxWidthLg: {
					maxWidth: "1400px !important", // Wider container for all sections
				},
			},
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

const PersonalLoanPage = () => {
	// Service ID from backend - change this for each loan page
	const SERVICE_ID = "SER010"; // Replace with your actual service ID
	const navigate = useNavigate();

	// State variables
	const [loanAmount, setLoanAmount] = useState(50000);
	const [loanTerm, setLoanTerm] = useState(12);
	const [interestRate, setInterestRate] = useState(11.5);
	const [expanded, setExpanded] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const calculatorRef = useRef(null);
	const heroRef = useRef(null);

	// Service data from backend
	const [service, setService] = useState(null);
	const [loading, setLoading] = useState(true);
	const { showNotification } = useNotification();

	// Section refs for scrolling
	const aboutLoanRef = useRef(null);
	const typesLoanRef = useRef(null);
	const featuresRef = useRef(null);
	const eligibilityRef = useRef(null);
	const faqsRef = useRef(null);
	const packagesRef = useRef(null);

	// Additional state for tab height
	const [tabHeight, setTabHeight] = useState(0);

	// First, add a new useEffect for scroll tracking to update active tab based on section visibility
	useEffect(() => {
		const handleScroll = () => {
			// Get all section elements with their positions
			const sections = [
				{ ref: aboutLoanRef, index: 0 },
				{ ref: typesLoanRef, index: 1 },
				{ ref: featuresRef, index: 2 },
				{ ref: eligibilityRef, index: 3 },
				{ ref: faqsRef, index: 4 },
			];

			// Add calculator section (Apply Now tab)
			const calculatorIndex = service?.packages?.length > 0 ? 6 : 5;
			sections.push({ ref: calculatorRef, index: calculatorIndex });

			// Add packages section if it exists
			if (service?.packages?.length > 0) {
				sections.push({ ref: packagesRef, index: 5 });
			}

			// Get current scroll position with a buffer
			const scrollPosition = window.scrollY + 150; // Reduced buffer for better precision

			// Get the height of the viewport
			const viewportHeight = window.innerHeight;

			// Get the height of the document
			const documentHeight = document.documentElement.scrollHeight;

			// Check if we're at the bottom of the page
			const isAtBottom =
				window.innerHeight + window.scrollY >= documentHeight - 100;

			// Find the current visible section
			let currentSection = 0; // Default to the first tab

			// Sort sections by their position to ensure proper order when scrolling
			const sortedSections = [...sections].sort((a, b) => {
				if (!a.ref?.current || !b.ref?.current) return 0;
				return a.ref.current.offsetTop - b.ref.current.offsetTop;
			});

			// Find the section that is currently in view
			for (const section of sortedSections) {
				if (section.ref && section.ref.current) {
					const sectionTop = section.ref.current.offsetTop;
					const sectionHeight = section.ref.current.offsetHeight;
					const sectionBottom = sectionTop + sectionHeight;

					// Check if the section is currently visible in the viewport
					if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
						currentSection = section.index;
						break;
					}
				}
			}

			// Special case: if at bottom of page, select the last tab (Apply Now/Calculator)
			if (isAtBottom) {
				currentSection = calculatorIndex;
			}

			// Only update the active tab if it's different (prevent unnecessary re-renders)
			if (currentSection !== activeTab) {
				setActiveTab(currentSection);
			}
		};

		// Add scroll event listener with throttling to improve performance
		let scrollTimeout;
		const throttledScroll = () => {
			if (!scrollTimeout) {
				scrollTimeout = setTimeout(() => {
					handleScroll();
					scrollTimeout = null;
				}, 100); // 100ms throttle
			}
		};

		window.addEventListener("scroll", throttledScroll);

		// Run once on mount to set initial active tab
		handleScroll();

		// Clean up event listener
		return () => {
			window.removeEventListener("scroll", throttledScroll);
			clearTimeout(scrollTimeout);
		};
	}, [
		aboutLoanRef,
		typesLoanRef,
		featuresRef,
		eligibilityRef,
		faqsRef,
		calculatorRef,
		packagesRef,
		service,
		activeTab, // Add activeTab to dependencies
	]);

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

					// Don't automatically close the sidebar if it was manually opened
					// Only keep it closed if it was already closed
					if (isMobile && !tabsContainer.classList.contains("sidebar-open")) {
						tabsContainer.classList.remove("sidebar-open");
					}
				} else {
					tabsContainer.classList.remove("fixed-tabs");
					document
						.getElementById("tabs-spacer")
						?.classList.remove("active-spacer");

					// Don't automatically open sidebar when scrolling back to top
					if (isMobile) {
						tabsContainer.classList.remove("sidebar-open");
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		// Run once on mount to set initial state
		handleScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [tabHeight, isMobile]);

	// Fetch service data from backend
	useEffect(() => {
		const fetchServiceData = async () => {
			try {
				setLoading(true);
				const response = await axios.get(
					`http://localhost:8000/api/customers/user-services/${SERVICE_ID}`
				);
				setService(response.data.service);
				// Set interest rate from backend if available
				if (response.data.service && response.data.service.interestRate) {
					setInterestRate(response.data.service.interestRate);
				}
				setLoading(false);
			} catch (error) {
				console.error("Error fetching service:", error);
				// If service not found (404), just continue without service data
				if (error.response?.status === 404) {
					console.log(`Service ${SERVICE_ID} not found in database, using default values`);
					setService(null);
				} else {
					showNotification(
						"Error loading service details. Please try again later.",
						"error"
					);
				}
				setLoading(false);
			}
		};

		fetchServiceData();
	}, [SERVICE_ID, showNotification]);

	// Function to scroll to calculator section
	const scrollToCalculator = () => {
		if (calculatorRef.current) {
			// Get the height of the tabs to offset the scroll position
			const tabsHeight =
				document.querySelector(".MuiTabs-root")?.offsetHeight || 56;

			// Add the sticky tabs position (100px) to the offset
			const yOffset = -(tabsHeight + 100); // Offset for both the tabs height and their sticky position
			const y =
				calculatorRef.current.getBoundingClientRect().top +
				window.pageYOffset +
				yOffset;

			window.scrollTo({
				top: y,
				behavior: "smooth",
			});
		}
	};

	// Generic function to scroll to any section by ref
	const scrollToSection = (ref) => {
		if (ref && ref.current) {
			// Get the height of the tabs to offset the scroll position
			const tabsHeight =
				document.querySelector(".MuiTabs-root")?.offsetHeight || 56;

			// Add the sticky tabs position (100px) to the offset
			const yOffset = -(tabsHeight + 100); // Offset for both the tabs height and their sticky position
			const y =
				ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

			window.scrollTo({
				top: y,
				behavior: "smooth",
			});
		}
	};

	// Handle tab change
	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);

		// Get the index adjustments based on whether packages exist
		const hasPackages = service?.packages?.length > 0;
		const packagesTabIndex = hasPackages ? 5 : -1;
		const applyNowIndex = hasPackages ? 6 : 5;

		// Scroll to appropriate section based on tab index
		switch (newValue) {
			case 0: // About Loan
				scrollToSection(aboutLoanRef);
				break;
			case 1: // Types of Loan
				scrollToSection(typesLoanRef);
				break;
			case 2: // Features & Benefits
				scrollToSection(featuresRef);
				break;
			case 3: // Eligibility
				scrollToSection(eligibilityRef);
				break;
			case 4: // FAQ's
				scrollToSection(faqsRef);
				break;
			case packagesTabIndex: // Packages (only if they exist)
				scrollToSection(packagesRef);
				break;
			case applyNowIndex: // Apply now
				scrollToCalculator();
				break;
			default:
				break;
		}
	};

	// Calculate monthly payment
	const calculateMonthlyPayment = () => {
		const rate = interestRate / 100 / 12;
		const n = loanTerm;
		const presentValue = loanAmount;
		const monthlyPayment =
			(presentValue * rate * Math.pow(1 + rate, n)) /
			(Math.pow(1 + rate, n) - 1);
		return monthlyPayment.toFixed(2);
	};

	// Default fallback data (used if backend data is not available)
	const defaultLoanProducts = [
		{
			title: "Medical Loans",
			description:
				"Specifically designed to cover medical emergencies, surgeries, or any healthcare-related expenses. These loans are disbursed quickly, ensuring financial aid during critical moments.",
			icon: <MoneyIcon fontSize='large' />,
		},
		{
			title: "Education Loans",
			description:
				"Used to finance higher education, whether it's for studying abroad or within the country. These loans help students achieve their academic dreams without financial strain.",
			icon: <GroupIcon fontSize='large' />,
		},
		{
			title: "Home Renovation Loans",
			description:
				"Cover the cost of repairs, remodeling, or upgrades to your home. These loans ensure you can enhance your living space without dipping into your savings.",

			icon: <SavingsIcon fontSize='large' />,
		},
		{
			title: "Wedding Loans",
			description:
				" Tailored to meet expenses for weddings or other major events. These loans let you create memorable celebrations without financial hurdles.",
			icon: <AutoGraphIcon fontSize='large' />,
		},
		{
			title: "Personal Emergency Loans ",
			description:
				"For unforeseen emergencies, such as urgent repairs, unexpected bills, or other financial surprises. They're flexible and provide quick funds to address immediate needs.",
			icon: <AutoGraphIcon fontSize='large' />,
		},
		{
			title: "Consumer Durable Loans",
			description:
				"Used to purchase household appliances, gadgets, or electronics such as televisions, washing machines, or smartphones. ",
			icon: <AutoGraphIcon fontSize='large' />,
		},
	];

	const defaultLoanFeatures = [
		{
			title: "Flexible Loan Amount",
			description:
				"You can borrow a specific amount based on your financial need, making it ideal for both small and large expenses.",
			icon: <AccessTimeIcon fontSize='large' />,
		},
		{
			title: "Quick Disbursal",
			description:
				"Funds are disbursed swiftly, often within a few hours or days of approval, ensuring access to money when you need it most.",
			icon: <MoneyIcon fontSize='large' />,
		},
		{
			title: "Flexible Tenure Options",
			description:
				"Personal loans come with a variety of repayment tenure options, typically ranging from 1 to 5 years, allowing you to choose a plan that suits your financial capacity. ",
			icon: <AccountBalanceIcon fontSize='large' />,
		},
		{
			title: "Minimal Documentation",
			description:
				"The application process is straightforward, requiring minimal paperwork for a seamless experience. ",
			icon: <DescriptionIcon fontSize='large' />,
		},
	];

	const defaultFaqs = [
		{
			question: "Can I apply for a personal loan online?",
			answer:
				"Yes, with FinShelter's user-friendly platform, you can complete the entire application process online from the comfort of your home.",
		},
		{
			question: "What are the repayment options?",
			answer:
				"You can repay the loan through easy Equated Monthly Installments (EMIs) over a tenure of your choice, ranging from 1 to 5 years.",
		},
		{
			question: "Is there a penalty for prepayment or foreclosure?",
			answer:
				"Many lenders charge a small fee for prepayment or foreclosure of the loan. FinShelter ensures transparency about all charges upfront.",
		},
		{
			question: "Can I get a loan with a low credit score?",
			answer:
				" While a good credit score improves your chances, we also evaluate other factors like income and employment. Reach out to explore your options.",
		},
		{
			question: "How is my loan disbursed?",
			answer:
				" Once approved, the loan amount is directly transferred to your registered bankaccount.",
		},
		{
			question: "Can I use a personal loan for debt consolidation?",
			answer:
				"Yes, personal loans can be used to consolidate multiple debts into a single loan, making repayment more manageable.",
		},
	];

	// Use data from backend or fallback to defaults
	const loanProducts = service?.loanProducts || defaultLoanProducts;
	const loanFeatures = service?.features || defaultLoanFeatures;
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
			<Box className='borrow-loan-page' style={{ marginTop: "100px" }}>
				{/* Mobile tab toggle button - Always visible and outside the tab container */}
				{isMobile && (
					<Box
						className='mobile-tab-toggle'
						onClick={() => {
							const tabsContainer = document.getElementById(
								"sticky-tabs-container"
							);
							tabsContainer?.classList.toggle("sidebar-open");
						}}
						sx={{
							position: "fixed !important",
							top: "64px !important",
							left: "0 !important",
							width: "40px !important",
							height: "40px !important",
							backgroundColor: "#1e4a30 !important",
							color: "white !important",
							zIndex: "9999 !important",
							display: "flex !important",
							alignItems: "center !important",
							justifyContent: "center !important",
							borderRadius: "0 4px 4px 0 !important",
							boxShadow: "2px 2px 5px rgba(0,0,0,0.2) !important",
							cursor: "pointer !important",
						}}>
						<MenuIcon />
					</Box>
				)}

				{/* Hero Section - Redesigned with enhanced visuals */}
				<Box
					ref={heroRef}
					className='hero-section'
					sx={{
						position: "relative",
						background: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.45)), url(${
							service?.heroImage || "/images/loan1.jpg"
						})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						borderBottom: "5px solid #1e4a30",
						pt: { xs: 8, md: 4 },
						pb: 3,
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundImage:
								"linear-gradient(135deg, rgba(30,74,48,0.4) 0%, rgba(198,219,206,0.2) 100%)",
							zIndex: 1,
						},
					}}
					style={{
						padding: "133px 0px 64px 0px",
					}}>
					<Container
						maxWidth='lg'
						sx={{ position: "relative", zIndex: 10, py: 0 }}>
						<Box
							sx={{
								boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
								borderRadius: { xs: "8px", md: "0 8px 8px 8px" },
								overflow: "hidden",
								mx: { xs: 1, md: 0 },
							}}>
							<HeroPaper
								sx={{
									borderLeft: { xs: "none", md: "4px solid #1e4a30" },
									borderRadius: { xs: "8px 8px 0 0", md: "0 8px 0 0" },
									boxShadow: "none",
									my: 0,
									mb: 0,
									p: { xs: 2, md: 4 },
									backgroundColor: "rgba(255,255,255,0.95)",
									flexDirection: { xs: "column", md: "row" },
								}}>
								<Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
									<Typography
										variant='h1'
										color='primary'
										sx={{
											fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
											fontWeight: 700,
											position: "relative",
											paddingBottom: "10px",
											mb: 1,
											"&::after": {
												content: '""',
												position: "absolute",
												bottom: 0,
												left: { xs: "50%", md: 0 },
												transform: {
													xs: "translateX(-50%)",
													md: "translateX(0)",
												},
												width: "80px",
												height: "4px",
												background:
													"linear-gradient(to right, #1e4a30, #8cc63f)",
											},
										}}>
										{service?.serviceName || "Personal Loan"}
									</Typography>
								</Box>

								<Box
									sx={{
										display: "flex",
										flexDirection: { xs: "column", md: "row" },
										alignItems: "center",
										gap: 2,
										mt: { xs: 2, md: 0 },
										width: { xs: "100%", md: "auto" },
									}}>
									<Box
										sx={{
											borderRadius: "8px",
											bgcolor: "#f9f9f9",
											border: "1px solid #e0e0e0",
											px: 3,
											py: 1,
											textAlign: "center",
											width: { xs: "100%", md: "auto" },
										}}>
										<Typography
											variant='h2'
											sx={{
												fontWeight: 700,
												color: "#ff4081",
												fontSize: { xs: "1.8rem", md: "2.2rem" },
											}}>
											10.5% - 24%
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											Rate of Interest
										</Typography>
									</Box>

									<Box
										sx={{
											display: "flex",
											flexDirection: { xs: "column", sm: "row" },
											gap: 2,
											width: { xs: "100%", md: "auto" },
										}}>
										<Button
											variant='contained'
											color='primary'
											onClick={() => handleApplyNow(true)}
											sx={{
												bgcolor: "#1e4a30",
												color: "#ffffff",
												"&:hover": { bgcolor: "#2C6040" },
												width: { xs: "100%", sm: "auto" },
												textTransform: "uppercase",
												fontWeight: 600,
												fontSize: "0.9rem",
												py: 1.5,
												px: 3,
												borderRadius: "4px",
											}}>
											GET A CALL BACK
										</Button>
										<Button
											variant='contained'
											onClick={scrollToCalculator}
											sx={{
												bgcolor: "#ff4081",
												color: "#ffffff",
												"&:hover": { bgcolor: "#e0356f" },
												width: { xs: "100%", sm: "auto" },
												textTransform: "uppercase",
												fontWeight: 600,
												fontSize: "0.9rem",
												py: 1.5,
												px: 3,
												borderRadius: "4px",
											}}>
											EMI CALCULATOR
										</Button>
									</Box>
								</Box>
							</HeroPaper>

							{/* Tabs Navigation */}
							<Box
								id='sticky-tabs-container'
								className='tabs-container'
								sx={{
									borderBottom: "1px solid #e0e0e0",
									borderRadius: "0 0 8px 8px",
									boxShadow: "none",
									backgroundColor: "#f2f6f4",
									mt: 0,
									ml: "4px",
									justifyContent: "space-between",
									position: "relative",
									width: "100%",
									overflowX: { xs: "auto", md: "visible" },
								}}>
								<style jsx='true'>{`
									.fixed-tabs {
										position: fixed;
										top: 109px;
										left: 0;
										right: 0;
										z-index: 1100;
										box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
										background-color: #f2f6f4;
										border-radius: 0 0 8px 8px;
									}
									.tabs-spacer {
										display: none;
									}
									.active-spacer {
										display: block;
									}
									/* Fix the indicator position for both states */
									.MuiTabs-root .MuiTabs-indicator {
										height: 3px !important;
										bottom: 0 !important;
										background-color: #1e4a30 !important;
									}

									/* Target the about tab specifically if needed */
									.MuiTabs-root
										.MuiTabs-flexContainer
										button:nth-child(1).Mui-selected
										+ .MuiTabs-indicator {
										left: calc(
											0 * (100% / 6)
										) !important; /* Adjust based on number of tabs */
									}

									/* Ensure the indicator's width matches tab width */
									.MuiTabs-flexContainer {
										width: 100%;
									}

									.MuiTabs-root .MuiTab-root {
										flex: 1;
										min-width: 0;
									}

									/* Remove any fixed positioning of the indicator */
									.MuiTabs-indicator {
										position: absolute !important;
									}

									/* Mobile sidebar navigation */
									@media (max-width: 768px) {
										.fixed-tabs {
											position: fixed;
											top: 60px;
											left: 0;
											width: 180px !important;
											height: calc(100vh - 60px);
											max-height: 100vh;
											overflow-y: auto;
											z-index: 999;
											box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1);
											background-color: #f2f6f4;
											padding: 0;
											transform: translateX(-100%);
											transition: transform 0.3s ease;
											border-radius: 0 !important;
										}

										.fixed-tabs.sidebar-open {
											transform: translateX(0);
										}

										.tabs-container .MuiTabs-flexContainer {
											flex-direction: column;
										}

										.tabs-container .MuiTab-root {
											border-bottom: 1px solid rgba(30, 74, 48, 0.1);
											text-align: left;
											justify-content: flex-start;
											min-height: 56px;
											padding: 12px 15px;
										}

										.tabs-container .MuiTabs-indicator {
											display: none !important;
										}

										.mobile-tab-toggle {
											position: fixed !important;
											top: 64px !important;
											left: 0 !important;
											width: 40px !important;
											height: 40px !important;
											background-color: #1e4a30 !important;
											color: white !important;
											z-index: 9999 !important;
											display: flex !important;
											align-items: center !important;
											justify-content: center !important;
											border-radius: 0 4px 4px 0 !important;
											cursor: pointer !important;
											box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2) !important;
										}
									}
								`}</style>
								<StyledTabs
									value={activeTab}
									onChange={handleTabChange}
									variant={isMobile ? "standard" : "fullWidth"}
									scrollButtons={false}
									centered={!isMobile}
									orientation={isMobile ? "vertical" : "horizontal"}
									sx={{
										"& .MuiTabs-indicator": {
											backgroundColor: "#1e4a30",
											height: "3px",
											transition: "all 0.3s ease",
											position: "absolute",
											bottom: 0,
											display: { xs: "none", md: "block" },
										},
										"& .MuiTabs-flexContainer": {
											width: "100%",
											justifyContent: "space-between",
											flexDirection: { xs: "column", md: "row" },
										},
										"& .MuiTab-root": {
											transition: "all 0.3s ease",
											position: "relative",
											fontSize: { xs: "15px", md: "17px" },
											minWidth: "auto",
											padding: { xs: "12px 15px", md: "15px 5px" },
											textTransform: "uppercase",
											fontWeight: 600,
											color: "#555555",
											backgroundColor: "#c6e9bc",
											flex: 1,
											textAlign: { xs: "left", md: "center" },
											justifyContent: { xs: "flex-start", md: "center" },
											"&::after": {
												content: '""',
												position: "absolute",
												bottom: 0,
												left: { xs: 0, md: "50%" },
												width: { xs: "4px", md: "0%" },
												height: { xs: "100%", md: "3px" },
												backgroundColor: "transparent",
												transform: { xs: "none", md: "translateX(-50%)" },
												transition: "width 0.3s ease, height 0.3s ease",
											},
											"&:hover": {
												color: "#1e4a30",
												backgroundColor: "rgba(30,74,48,0.05)",
												"&::after": {
													width: { xs: "4px", md: "30%" },
													height: { xs: "70%", md: "3px" },
													backgroundColor: "rgba(30, 74, 48, 0.3)",
												},
											},
											"&.Mui-selected": {
												color: "#1e4a30",
												fontWeight: "600",
												backgroundColor: {
													xs: "rgba(30,74,48,0.1)",
													md: "#c6e9bc",
												},
												"&::after": {
													width: { xs: "4px", md: "30%" },
													height: { xs: "70%", md: "3px" },
													backgroundColor: "#1e4a30",
												},
											},
										},
										width: "100%",
										height: { xs: "100%", md: "auto" },
									}}
									aria-label='personal loan tabs'>
									<StyledTab label='ABOUT LOAN' />
									<StyledTab label='TYPES OF LOAN' />
									<StyledTab label='FEATURES & BENEFITS' />
									{/* <StyledTab label='ELIGIBILITY' /> */}
									<StyledTab label="FAQ'S" />
									{service?.packages?.length > 0 && (
										<StyledTab label='PACKAGES' />
									)}
									<StyledTab label='APPLY NOW' />
								</StyledTabs>
							</Box>
						</Box>
						{/* Spacer div to prevent content jump when tabs become fixed */}
						<div
							id='tabs-spacer'
							className='tabs-spacer'
							style={{ height: tabHeight }}></div>
					</Container>
				</Box>

				{/* About Loan Section */}
				<Box
					id='about-loan'
					sx={{
						py: 8,
						bgcolor: "#ffffff",
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							left: 0,
							top: "20%",
							width: "8px",
							height: "60%",
							background: "#1e4a30",
							borderRadius: "0 4px 4px 0",
						},
					}}
					ref={aboutLoanRef}
					className='section-container'>
					<Container maxWidth='lg' sx={{ position: "relative", zIndex: 1 }}>
						<Box
							sx={{
								maxWidth: 1100,
								mx: "auto",
								position: "relative",
								zIndex: 1,
								px: { xs: 2, md: 0 },
							}}>
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
									color: "#1e4a30",
									"&::after": {
										content: '""',
										position: "absolute",
										bottom: 0,
										left: 0,
										width: "80px",
										height: "3px",
										background: "#1e4a30",
									},
								}}>
								About {service?.serviceName || "Personal Loan"}
							</Typography>

							{/* <Typography
								variant='body1'
								paragraph
								sx={{
									fontSize: "1.1rem",
									lineHeight: 1.7,
									color: "#555",
									mb: 3,
								}}>
								{service?.description || ""}
							</Typography> */}
							{service?.longDescription ? (
								service.longDescription.map((para, index) => (
									<Typography
										key={index}
										variant='body1'
										paragraph
										sx={{
											fontSize: "1.1rem",
											lineHeight: 1.7,
											color: "#555",
											mb: 3,
										}}>
										{para}
									</Typography>
								))
							) : (
								<>
									<Typography
										variant='body1'
										paragraph
										sx={{
											fontSize: "1.1rem",
											lineHeight: 1.7,
											color: "black",
											mb: 3,
										}}>
										<b>Personal Loan Services: Empower Your Financial Goals</b>
										<br />
										<br /> At FinShelter, we believe that financial freedom
										starts with flexibility and accessibility. Our Personal Loan
										Services are designed to cater to your unique needs,
										providing quick and hassle-free access to funds when you
										need them the most. Whether it's for an emergency, a special
										occasion, or fulfilling your dreams, FinShelter is here to
										guide you through every step of the journey.
									</Typography>
									<Typography
										variant='body1'
										paragraph
										sx={{
											fontSize: "1.1rem",
											lineHeight: 1.7,
											color: "#555",
											mb: 3,
										}}></Typography>
								</>
							)}
							<Button
								variant='contained'
								color='primary'
								sx={{
									mt: 2,
									textTransform: "uppercase",
									px: 4,
									py: 1.5,
									fontSize: "0.9rem",
									fontWeight: 600,
									borderRadius: "4px",
									background: "#1e4a30",
									boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
									transition: "all 0.3s ease",
									"&:hover": {
										background: "#2C6040",
										boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
									},
								}}
								onClick={() => handleApplyNow(true)}>
								Apply for loan
							</Button>
						</Box>
					</Container>
				</Box>

				{/* Loan Types Section */}
				<Box
					id='types'
					sx={{
						py: 7,
						bgcolor: theme.palette.background.alternate, // Changed from #f5f5f5
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							bottom: 0,
							left: 0,
							width: "100%",
							height: "100%",
							background:
								"linear-gradient(135deg, rgba(30,74,48,0.08) 0%, rgba(255,255,255,0) 100%)",
							zIndex: 0,
						},
						boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)",
					}}
					ref={typesLoanRef}
					className='section-container'>
					<Container maxWidth='lg'>
						<Typography
							variant='h3'
							gutterBottom
							color='primary'
							align='center'
							sx={{
								fontWeight: 700,
								color: "#1e4a30",
								position: "relative",
								paddingBottom: "15px",
								marginBottom: "15px",
								"&::after": {
									content: '""',
									position: "absolute",
									bottom: 0,
									left: "50%",
									transform: "translateX(-50%)",
									width: "80px",
									height: "3px",
									background: "#1e4a30",
								},
							}}>
							Types of Personal Loans
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{ mb: 6, maxWidth: "800px", mx: "auto", color: "#666" }}>
							{service?.productsTagline || ""}
						</Typography>
						{/* Mobile view uses a different approach with no grid spacing to prevent overlap */}
						{isMobile ? (
							<Box sx={{ px: 1 }}>
								{loanProducts.map((product, index) => (
									<Card
										key={index}
										sx={{
											display: "flex",
											flexDirection: "column",
											boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
											transition: "transform 0.3s ease, box-shadow 0.3s ease",
											borderRadius: "8px",
											border: "1px solid #eaeaea",
											overflow: "hidden",
											"&:hover": {
												transform: "translateY(-5px)",
												boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
											},
											mb: 5, // Large fixed bottom margin to ensure no overlap
											mx: 1, // Side margin
										}}>
										<CardContent sx={{ p: 3, flexGrow: 1 }}>
											<Box
												sx={{ mb: 2.5, color: "#ff4081", textAlign: "center" }}>
												{product.icon || <MoneyIcon fontSize='large' />}
											</Box>
											<Typography
												variant='h5'
												component='h3'
												gutterBottom
												sx={{
													fontWeight: 600,
													textAlign: "center",
													color: "#1e4a30",
													fontSize: { xs: "1.1rem", md: "1.3rem" },
													mb: 2,
												}}>
												{product.title}
											</Typography>
											<Typography
												variant='body2'
												color='text.secondary'
												sx={{
													fontSize: { xs: "0.95rem", md: "1.06rem" },
													color: "black",
													lineHeight: 1.6,
													textAlign: "center",
													mb: 2,
												}}>
												{product.description}
											</Typography>
										</CardContent>
									</Card>
								))}
							</Box>
						) : (
							<Grid container spacing={4} style={{ justifyContent: "center" }}>
								{loanProducts.map((product, index) => (
									<Grid item xs={12} sm={6} md={3} key={index}>
										<Card
											sx={{
												height: "100%",
												display: "flex",
												flexDirection: "column",
												boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
												transition: "transform 0.3s ease, box-shadow 0.3s ease",
												borderRadius: "8px",
												border: "1px solid #eaeaea",
												overflow: "hidden",
												"&:hover": {
													transform: "translateY(-5px)",
													boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
												},
											}}>
											<CardContent sx={{ p: 3, flexGrow: 1 }}>
												<Box
													sx={{
														mb: 2.5,
														color: "#ff4081",
														textAlign: "center",
													}}>
													{product.icon || <MoneyIcon fontSize='large' />}
												</Box>
												<Typography
													variant='h5'
													component='h3'
													gutterBottom
													sx={{
														fontWeight: 600,
														textAlign: "center",
														color: "#1e4a30",
														fontSize: { xs: "1.1rem", md: "1.3rem" },
														mb: 2,
													}}>
													{product.title}
												</Typography>
												<Typography
													variant='body2'
													color='text.secondary'
													sx={{
														fontSize: { xs: "0.95rem", md: "1.06rem" },
														color: "black",
														lineHeight: 1.6,
														textAlign: "center",
														mb: 2,
													}}>
													{product.description}
												</Typography>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>
						)}
					</Container>
				</Box>

				{/* CTA Banner - Updated with enhanced design */}
				<Box
					className='cta-section'
					sx={{
						py: 5,
						background: "#1e4a30",
						textAlign: "center",
						color: "white",
						position: "relative",
						overflow: "hidden",
					}}>
					<Container maxWidth='lg' sx={{ position: "relative", zIndex: 2 }}>
						<Typography
							variant='h4'
							gutterBottom
							sx={{
								fontWeight: 600,
								maxWidth: "800px",
								mx: "auto",
								lineHeight: 1.4,
								fontSize: { xs: "1.5rem", md: "1.8rem" },
								mb: 3,
								color: "#ffffff",
							}}>
							{service?.ctaMessage || "Get financing for whatever you need now"}
						</Typography>
						<Button
							variant='contained'
							sx={{
								bgcolor: "#ff4081",
								color: "white",
								textTransform: "uppercase",
								fontWeight: 600,
								px: 4,
								py: 1.5,
								fontSize: "0.9rem",
								borderRadius: "4px",
								"&:hover": {
									bgcolor: "#e0356f",
								},
								boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
							}}
							onClick={() => handleApplyNow(true)}>
							{service?.ctaButtonText || "ENQUIRE NOW"}
						</Button>
					</Container>
				</Box>

				{/* Features Section */}
				<Box
					sx={{
						py: 7,
						bgcolor: "#ffffff",
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							bottom: 0,
							right: 0,
							width: "250px",
							height: "250px",
							backgroundImage:
								"radial-gradient(circle, rgba(198,219,206,0.2) 0%, rgba(198,219,206,0) 70%)",
							zIndex: 0,
							pointerEvents: "none",
						},
					}}
					ref={featuresRef}
					className='section-container'>
					<Container maxWidth='lg' sx={{ position: "relative", zIndex: 1 }}>
						<Typography
							variant='h3'
							gutterBottom
							color='primary'
							align='center'
							sx={{
								fontWeight: 700,
								mb: 2,
								color: "#1e4a30",
								position: "relative",
								paddingBottom: "15px",
								"&::after": {
									content: '""',
									position: "absolute",
									bottom: 0,
									left: "50%",
									transform: "translateX(-50%)",
									width: "80px",
									height: "3px",
									background: "#1e4a30",
								},
							}}>
							Features of {service?.serviceName || "Personal Loan"}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{ mb: 6, maxWidth: "800px", mx: "auto", color: "#666" }}>
							{service?.featuresTagline || ""}
						</Typography>
						<Grid
							container
							spacing={{ xs: 2, md: 4 }}
							alignItems='stretch'
							justifyContent='center'>
							{loanFeatures.map((feature, index) => (
								<Grid
									item
									xs={12}
									sm={6}
									md={3}
									key={index}
									sx={{
										display: "flex",
										marginBottom: { xs: "30px", md: "50px" },
									}}>
									<Box
										sx={{
											textAlign: "center",
											padding: { xs: 2, md: 3 },
											transition: "all 0.3s ease",
											borderRadius: "8px",
											border: "1px solid #eaeaea",
											backgroundColor: "#ffffff",
											height: "100%",
											width: "100%",
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											"&:hover": {
												transform: "translateY(-5px)",
												backgroundColor: "#f5f9f6",
												boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
												borderColor: "#c6dbce",
											},
										}}>
										<Box
											sx={{
												mb: 3,
												color: "#ff4081",
												display: "inline-flex",
												p: 2.5,
												border: "1px solid #f0f0f0",
												borderRadius: "50%",
												transition: "all 0.3s ease",
												backgroundColor: "#fff",
												"&:hover": {
													boxShadow: "0 5px 15px rgba(255, 64, 129, 0.1)",
													border: "1px solid rgba(255, 64, 129, 0.3)",
													backgroundColor: "#fff9fb",
												},
											}}>
											{feature.icon || <DescriptionIcon fontSize='large' />}
										</Box>
										<Typography
											variant='h5'
											component='h3'
											gutterBottom
											sx={{
												fontWeight: 600,
												color: "#1e4a30",
												mb: 2,
												fontSize: { xs: "1.1rem", md: "1.3rem" },
											}}>
											{feature.title}
										</Typography>
										<Typography
											variant='body2'
											color='text.secondary'
											sx={{
												fontSize: { xs: "0.95rem", md: "1.06rem" },
												color: "black",
												lineHeight: 1.6,
												flexGrow: 1,
											}}>
											{feature.description}
										</Typography>
									</Box>
								</Grid>
							))}
						</Grid>
					</Container>
				</Box>

				{/* Eligibility Section */}
				<Box
					sx={{
						py: { xs: 5, md: 7 },
						bgcolor: theme.palette.background.alternate,
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							background:
								"linear-gradient(135deg, rgba(30,74,48,0.08) 0%, rgba(255,255,255,0) 100%)",
							zIndex: 0,
						},
						boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)",
					}}
					ref={eligibilityRef}
					className='section-container'>
					<Container maxWidth='lg' sx={{ position: "relative", zIndex: 1 }}>
						<Typography
							variant='h3'
							gutterBottom
							color='primary'
							align='center'
							sx={{
								fontWeight: 700,
								color: "#1e4a30",
								position: "relative",
								paddingBottom: "15px",
								marginBottom: "15px",
								fontSize: { xs: "1.8rem", md: "2.2rem" },
								"&::after": {
									content: '""',
									position: "absolute",
									bottom: 0,
									left: "50%",
									transform: "translateX(-50%)",
									width: "80px",
									height: "3px",
									background: "#1e4a30",
								},
							}}>
							Frequently Ask Questions
						</Typography>
						<Typography
							variant='body1'
							align='center'
							sx={{
								mb: { xs: 3, md: 5 },
								maxWidth: "900px",
								mx: "auto",
								color: "#666",
								px: { xs: 2, md: 0 },
								fontSize: { xs: "0.95rem", md: "1.1rem" },
							}}>
							{service?.faqTagline || ""}
						</Typography>

						{/* Two column FAQ layout - single column on mobile */}
						<Grid container spacing={3}>
							{/* Single column on mobile, two columns on desktop */}
							{isMobile ? (
								// Single column layout for mobile
								<Grid item xs={12}>
									{faqs.map((faq, index) => (
										<Accordion
											key={index}
											expanded={expanded === index}
											onChange={() =>
												setExpanded(expanded === index ? false : index)
											}
											sx={{
												mb: 2,
												boxShadow: "none",
												"&:before": {
													display: "none",
												},
												border: "1px solid #e0e0e0",
												borderRadius: "8px !important", // Important to override default
												overflow: "hidden",
												position: "relative",
												mx: { xs: 1, md: 0 },
												"&::before":
													expanded === index
														? {
																content: '""',
																position: "absolute",
																left: 0,
																top: 0,
																height: "100%",
																width: "4px",
																background:
																	"linear-gradient(to bottom, #1e4a30, #8cc63f)",
																borderRadius: "4px 0 0 4px",
														  }
														: {},
											}}>
											<AccordionSummary
												expandIcon={
													<ExpandMoreIcon
														sx={{
															color: expanded === index ? "#1e4a30" : "#666",
														}}
													/>
												}
												sx={{
													backgroundColor:
														expanded === index ? "rgba(30,74,48,0.05)" : "#fff",
													borderBottom:
														expanded === index
															? "1px solid rgba(30,74,48,0.1)"
															: "none",
													borderRadius: "8px",
													transition: "all 0.3s ease",
													"& .MuiAccordionSummary-content": {
														margin: "12px 0",
													},
													"&:hover": {
														backgroundColor:
															expanded === index
																? "rgba(30,74,48,0.07)"
																: "rgba(30,74,48,0.02)",
													},
												}}>
												<Typography
													variant='h6'
													sx={{
														fontSize: { xs: "0.95rem", md: "1.1rem" },
														fontWeight: 600,
														color: expanded === index ? "#1e4a30" : "#333",
														pl: expanded === index ? 1 : 0,
														transition: "all 0.3s ease",
													}}>
													{faq.question}
												</Typography>
											</AccordionSummary>
											<AccordionDetails
												sx={{
													p: { xs: 2, md: 3 },
													backgroundColor: "rgba(248,250,249,0.7)",
													borderTop: "1px solid rgba(30,74,48,0.05)",
												}}>
												<Typography
													variant='body1'
													sx={{
														color: "black",
														lineHeight: 1.7,
														fontSize: { xs: "0.9rem", md: "1rem" },
													}}
													dangerouslySetInnerHTML={{ __html: faq.answer }}
												/>
											</AccordionDetails>
										</Accordion>
									))}
								</Grid>
							) : (
								// Two column layout for desktop
								<>
									{/* Left Column */}
									<Grid item xs={12} md={6}>
										{faqs
											.slice(0, Math.ceil(faqs.length / 2))
											.map((faq, index) => (
												<Accordion
													key={index}
													expanded={expanded === index}
													onChange={() =>
														setExpanded(expanded === index ? false : index)
													}
													sx={{
														mb: 2,
														boxShadow: "none",
														"&:before": {
															display: "none",
														},
														border: "1px solid #e0e0e0",
														borderRadius: "8px !important", // Important to override default
														overflow: "hidden",
														position: "relative",
														"&::before":
															expanded === index
																? {
																		content: '""',
																		position: "absolute",
																		left: 0,
																		top: 0,
																		height: "100%",
																		width: "4px",
																		background:
																			"linear-gradient(to bottom, #1e4a30, #8cc63f)",
																		borderRadius: "4px 0 0 4px",
																  }
																: {},
													}}>
													<AccordionSummary
														expandIcon={
															<ExpandMoreIcon
																sx={{
																	color:
																		expanded === index ? "#1e4a30" : "#666",
																}}
															/>
														}
														sx={{
															backgroundColor:
																expanded === index
																	? "rgba(30,74,48,0.05)"
																	: "#fff",
															borderBottom:
																expanded === index
																	? "1px solid rgba(30,74,48,0.1)"
																	: "none",
															borderRadius: "8px",
															transition: "all 0.3s ease",
															"& .MuiAccordionSummary-content": {
																margin: "12px 0",
															},
															"&:hover": {
																backgroundColor:
																	expanded === index
																		? "rgba(30,74,48,0.07)"
																		: "rgba(30,74,48,0.02)",
															},
														}}>
														<Typography
															variant='h6'
															sx={{
																fontSize: "1.1rem",
																fontWeight: 600,
																color: expanded === index ? "#1e4a30" : "#333",
																pl: expanded === index ? 1 : 0,
																transition: "all 0.3s ease",
															}}>
															{faq.question}
														</Typography>
													</AccordionSummary>
													<AccordionDetails
														sx={{
															p: 3,
															backgroundColor: "rgba(248,250,249,0.7)",
															borderTop: "1px solid rgba(30,74,48,0.05)",
														}}>
														<Typography
															variant='body1'
															sx={{
																color: "black",
																lineHeight: 1.7,
															}}
															dangerouslySetInnerHTML={{ __html: faq.answer }}
														/>
													</AccordionDetails>
												</Accordion>
											))}
									</Grid>

									{/* Right Column */}
									<Grid item xs={12} md={6}>
										{faqs
											.slice(Math.ceil(faqs.length / 2))
											.map((faq, index) => {
												// Adjust index for the right column
												const actualIndex = index + Math.ceil(faqs.length / 2);
												return (
													<Accordion
														key={actualIndex}
														expanded={expanded === actualIndex}
														onChange={() =>
															setExpanded(
																expanded === actualIndex ? false : actualIndex
															)
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
															position: "relative",
															"&::before":
																expanded === actualIndex
																	? {
																			content: '""',
																			position: "absolute",
																			left: 0,
																			top: 0,
																			height: "100%",
																			width: "4px",
																			background:
																				"linear-gradient(to bottom, #1e4a30, #8cc63f)",
																			borderRadius: "4px 0 0 4px",
																	  }
																	: {},
														}}>
														<AccordionSummary
															expandIcon={
																<ExpandMoreIcon
																	sx={{
																		color:
																			expanded === actualIndex
																				? "#1e4a30"
																				: "#666",
																	}}
																/>
															}
															sx={{
																backgroundColor:
																	expanded === actualIndex
																		? "rgba(30,74,48,0.05)"
																		: "#fff",
																borderBottom:
																	expanded === actualIndex
																		? "1px solid rgba(30,74,48,0.1)"
																		: "none",
																borderRadius: "8px",
																transition: "all 0.3s ease",
																"& .MuiAccordionSummary-content": {
																	margin: "12px 0",
																},
																"&:hover": {
																	backgroundColor:
																		expanded === actualIndex
																			? "rgba(30,74,48,0.07)"
																			: "rgba(30,74,48,0.02)",
																},
															}}>
															<Typography
																variant='h6'
																sx={{
																	fontSize: "1.1rem",
																	fontWeight: 600,
																	color:
																		expanded === actualIndex
																			? "#1e4a30"
																			: "#333",
																	pl: expanded === actualIndex ? 1 : 0,
																	transition: "all 0.3s ease",
																}}>
																{faq.question}
															</Typography>
														</AccordionSummary>
														<AccordionDetails
															sx={{
																p: 3,
																backgroundColor: "rgba(248,250,249,0.7)",
																borderTop: "1px solid rgba(30,74,48,0.05)",
															}}>
															<Typography
																variant='body1'
																sx={{
																	color: "black",
																	lineHeight: 1.7,
																}}
																dangerouslySetInnerHTML={{ __html: faq.answer }}
															/>
														</AccordionDetails>
													</Accordion>
												);
											})}
									</Grid>
								</>
							)}
						</Grid>
					</Container>
				</Box>

				{/* Packages Section - only shown if service has packages */}
				{service && service.packages && service.packages.length > 0 && (
					<Box
						sx={{
							pt: 8,
							pb: { xs: 5, md: 8 },
							bgcolor: "white",
							position: "relative",
							"&::before": {
								content: '""',
								position: "absolute",
								top: "-50px",
								right: "10%",
								width: "200px",
								height: "200px",
								backgroundColor: alpha(theme.palette.primary.main, 0.03),
								borderRadius: "50%",
							},
						}}
						className='section-container'
						ref={packagesRef}>
						<Container>
							<Box sx={{ mb: 6, textAlign: "center" }}>
								<Typography
									variant='h3'
									gutterBottom
									color='primary'
									align='center'
									sx={{
										fontWeight: 700,
										position: "relative",
										display: "inline-block",
										pb: 2,
										fontSize: { xs: "1.8rem", md: "2.2rem" },
										"&::after": {
											content: '""',
											position: "absolute",
											width: "80px",
											height: "4px",
											backgroundColor: theme.palette.primary.main,
											bottom: 0,
											left: "50%",
											transform: "translateX(-50%)",
										},
									}}>
									Our Packages
								</Typography>
								<Typography
									variant='body1'
									align='center'
									sx={{
										mb: 6,
										maxWidth: "800px",
										mx: "auto",
										fontSize: { xs: "1rem", md: "1.1rem" },
										px: { xs: 2, md: 0 },
									}}>
									Choose the package that best fits your needs
								</Typography>
							</Box>

							{/* Mobile view for package cards */}
							{isMobile ? (
								<Box sx={{ px: 1 }}>
									{service.packages.map((pkg, index) => (
										<Paper
											key={index}
											elevation={3}
											sx={{
												display: "flex",
												flexDirection: "column",
												position: "relative",
												borderRadius: "16px",
												border:
													index === 1
														? `2px solid ${theme.palette.primary.main}`
														: "none",
												transition: "transform 0.3s ease, box-shadow 0.3s ease",
												p: 3,
												mb: 6, // Large bottom margin to prevent overlap
												mx: 1, // Side margin
												"&:hover": {
													transform: "translateY(-10px)",
													boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
												},
											}}>
											{index === 1 && (
												<Box
													sx={{
														position: "absolute",
														top: "-15px",
														left: "50%",
														transform: "translateX(-50%)",
														bgcolor: theme.palette.primary.main,
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
												color='primary'
												sx={{
													fontWeight: 700,
													mb: 2,
													fontSize: { xs: "1.2rem", md: "1.5rem" },
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
												{pkg.description}
											</Typography>

											<Box
												sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
												<Typography
													variant='h3'
													component='span'
													sx={{
														fontWeight: 700,
														color: "primary.main",
														fontSize: { xs: "1.8rem", md: "2.2rem" },
													}}>
													₹{pkg.salePrice || pkg.actualPrice}
												</Typography>
												{pkg.salePrice &&
													pkg.actualPrice &&
													pkg.salePrice < pkg.actualPrice && (
														<Typography
															component='span'
															sx={{
																textDecoration: "line-through",
																color: "text.secondary",
																fontSize: { xs: "0.9rem", md: "1rem" },
																ml: 1,
															}}>
															₹{pkg.actualPrice}
														</Typography>
													)}
											</Box>

											<Divider sx={{ my: 2 }} />

											{pkg.features && pkg.features.length > 0 && (
												<List dense sx={{ mb: 3 }}>
													{pkg.features.map((feature, idx) => (
														<ListItem key={idx} disableGutters sx={{ pb: 1 }}>
															<ListItemIcon sx={{ minWidth: 30 }}>
																<CheckCircleIcon
																	sx={{
																		color: "primary.main",
																		fontSize: "1rem",
																	}}
																/>
															</ListItemIcon>
															<ListItemText
																primary={feature}
																primaryTypographyProps={{
																	variant: "body2",
																	sx: {
																		fontSize: { xs: "0.85rem", md: "0.95rem" },
																	},
																}}
															/>
														</ListItem>
													))}
												</List>
											)}

											<Button
												variant='contained'
												color='primary'
												fullWidth
												onClick={() => handlePackageSelect(pkg)}
												endIcon={<ArrowForwardIcon />}
												sx={{
													mt: "auto",
													py: 1.5,
													borderRadius: "30px",
													fontWeight: 600,
													boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
													"&:hover": {
														boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
													},
												}}>
												Select Package
											</Button>
										</Paper>
									))}
								</Box>
							) : (
								// Desktop view with grid layout
								<Grid container spacing={4} justifyContent='center'>
									{service.packages.map((pkg, index) => (
										<Grid
											item
											xs={12}
											sm={6}
											md={4}
											key={index}
											data-aos='fade-up'
											data-aos-delay={index * 150}>
											<Paper
												elevation={3}
												sx={{
													height: "100%",
													display: "flex",
													flexDirection: "column",
													position: "relative",
													borderRadius: "16px",
													border:
														index === 1
															? `2px solid ${theme.palette.primary.main}`
															: "none",
													transition:
														"transform 0.3s ease, box-shadow 0.3s ease",
													p: { xs: 3, md: 4 },
													"&:hover": {
														transform: "translateY(-10px)",
														boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
													},
												}}>
												{index === 1 && (
													<Box
														sx={{
															position: "absolute",
															top: "-15px",
															left: "50%",
															transform: "translateX(-50%)",
															bgcolor: theme.palette.primary.main,
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
													color='primary'
													sx={{
														fontWeight: 700,
														mb: 2,
														fontSize: { xs: "1.2rem", md: "1.5rem" },
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
													{pkg.description}
												</Typography>

												<Box
													sx={{
														display: "flex",
														alignItems: "baseline",
														mb: 3,
													}}>
													<Typography
														variant='h3'
														component='span'
														sx={{
															fontWeight: 700,
															color: "primary.main",
															fontSize: { xs: "1.8rem", md: "2.2rem" },
														}}>
														₹{pkg.salePrice || pkg.actualPrice}
													</Typography>
													{pkg.salePrice &&
														pkg.actualPrice &&
														pkg.salePrice < pkg.actualPrice && (
															<Typography
																component='span'
																sx={{
																	textDecoration: "line-through",
																	color: "text.secondary",
																	fontSize: { xs: "0.9rem", md: "1rem" },
																	ml: 1,
																}}>
																₹{pkg.actualPrice}
															</Typography>
														)}
												</Box>

												<Divider sx={{ my: 2 }} />

												{pkg.features && pkg.features.length > 0 && (
													<List dense sx={{ mb: 3 }}>
														{pkg.features.map((feature, idx) => (
															<ListItem key={idx} disableGutters sx={{ pb: 1 }}>
																<ListItemIcon sx={{ minWidth: 30 }}>
																	<CheckCircleIcon
																		sx={{
																			color: "primary.main",
																			fontSize: "1rem",
																		}}
																	/>
																</ListItemIcon>
																<ListItemText
																	primary={feature}
																	primaryTypographyProps={{
																		variant: "body2",
																		sx: {
																			fontSize: {
																				xs: "0.85rem",
																				md: "0.95rem",
																			},
																		},
																	}}
																/>
															</ListItem>
														))}
													</List>
												)}

												<Button
													variant='contained'
													color='primary'
													fullWidth
													onClick={() => handlePackageSelect(pkg)}
													endIcon={<ArrowForwardIcon />}
													sx={{
														mt: "auto",
														py: 1.5,
														borderRadius: "30px",
														fontWeight: 600,
														boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
														"&:hover": {
															boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
														},
													}}>
													Select Package
												</Button>
											</Paper>
										</Grid>
									))}
								</Grid>
							)}
						</Container>
					</Box>
				)}

				{/* EMI Calculator Section */}
				<Box
					id='calculator'
					sx={{
						py: { xs: 5, md: 7 },
						bgcolor: "#f5f5f5",
						position: "relative",
						scrollMarginTop: { xs: "80px", md: "160px" },
					}}
					ref={calculatorRef}
					className='section-container'>
					<Container maxWidth='lg'>
						<Typography
							variant='h3'
							gutterBottom
							color='primary'
							align='center'
							className='scroll-animation'
							sx={{
								fontWeight: 700,
								color: "#1e4a30",
								position: "relative",
								paddingBottom: "15px",
								marginBottom: "15px",
								fontSize: { xs: "1.8rem", md: "2.2rem" },
								"&::after": {
									content: '""',
									position: "absolute",
									bottom: 0,
									left: "50%",
									transform: "translateX(-50%)",
									width: "80px",
									height: "3px",
									background: "#1e4a30",
								},
							}}>
							Calculate Your Payment
						</Typography>
						<Typography
							variant='body1'
							align='center'
							className='scroll-animation'
							sx={{
								mb: { xs: 3, md: 6 },
								maxWidth: "800px",
								mx: "auto",
								color: "#666",
								fontSize: { xs: "0.95rem", md: "1.1rem" },
								px: { xs: 2, md: 0 },
							}}>
							Use our simple calculator to estimate your monthly loan payment
						</Typography>
						<Grid container spacing={4} justifyContent='center'>
							<Grid item xs={12} md={8}>
								<Paper
									className='calculator-form'
									sx={{
										p: { xs: 2, md: 4 },
										borderRadius: "8px",
										boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
										border: "1px solid #e8e8e8",
										overflow: "hidden",
										mx: { xs: 1, md: 0 },
									}}>
									<Grid container spacing={{ xs: 2, md: 3 }}>
										<Grid item xs={12} md={6}>
											<Typography
												gutterBottom
												sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
												Loan Amount
											</Typography>
											<Slider
												value={loanAmount}
												onChange={(e, newValue) => setLoanAmount(newValue)}
												min={1000}
												max={100000}
												step={1000}
												valueLabelDisplay='auto'
												sx={{
													mb: 1,
													color: "#ff4081",
													"& .MuiSlider-rail": {
														opacity: 0.3,
													},
													"& .MuiSlider-thumb": {
														width: 14,
														height: 14,
														backgroundColor: "#fff",
														border: "2px solid currentColor",
														"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible":
															{
																boxShadow:
																	"0px 0px 0px 8px rgba(255, 64, 129, 0.16)",
															},
													},
												}}
											/>
											<TextField
												fullWidth
												value={loanAmount}
												onChange={(e) => setLoanAmount(Number(e.target.value))}
												InputProps={{
													startAdornment: (
														<InputAdornment position='start'>₹</InputAdornment>
													),
												}}
												sx={{
													mb: { xs: 2, md: 3 },
													"& .MuiOutlinedInput-root": {
														"&.Mui-focused fieldset": {
															borderColor: "#ff4081",
														},
													},
												}}
											/>
										</Grid>

										<Grid item xs={12} md={6}>
											<Typography
												gutterBottom
												sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
												Interest Rate (%)
											</Typography>
											<Slider
												value={interestRate}
												onChange={(e, newValue) => setInterestRate(newValue)}
												min={10.5}
												max={24}
												step={0.1}
												valueLabelDisplay='auto'
												sx={{
													mb: 1,
													color: "#ff4081",
													"& .MuiSlider-rail": {
														opacity: 0.3,
													},
													"& .MuiSlider-thumb": {
														width: 14,
														height: 14,
														backgroundColor: "#fff",
														border: "2px solid currentColor",
														"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible":
															{
																boxShadow:
																	"0px 0px 0px 8px rgba(255, 64, 129, 0.16)",
															},
													},
												}}
											/>
											<TextField
												fullWidth
												value={interestRate}
												onChange={(e) =>
													setInterestRate(Number(e.target.value))
												}
												InputProps={{
													endAdornment: (
														<InputAdornment position='end'>%</InputAdornment>
													),
												}}
												sx={{
													mb: { xs: 2, md: 3 },
													"& .MuiOutlinedInput-root": {
														"&.Mui-focused fieldset": {
															borderColor: "#ff4081",
														},
													},
												}}
											/>
										</Grid>

										<Grid item xs={12}>
											<Typography
												gutterBottom
												sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
												Loan Term
											</Typography>
											<FormControl
												fullWidth
												sx={{
													mb: { xs: 2, md: 3 },
													"& .MuiOutlinedInput-root": {
														"&.Mui-focused fieldset": {
															borderColor: "#ff4081",
														},
													},
												}}>
												<Select
													value={loanTerm}
													onChange={(e) => setLoanTerm(e.target.value)}>
													<MenuItem value={6}>6 months</MenuItem>
													<MenuItem value={12}>12 months</MenuItem>
													<MenuItem value={18}>18 months</MenuItem>
													<MenuItem value={24}>24 months</MenuItem>
													<MenuItem value={36}>36 months</MenuItem>
													<MenuItem value={48}>48 months</MenuItem>
													<MenuItem value={60}>60 months</MenuItem>
												</Select>
											</FormControl>
										</Grid>

										<Grid item xs={12}>
											<Box
												sx={{
													background: "#1e4a30",
													p: { xs: 2, md: 3 },
													borderRadius: 2,
													mb: { xs: 2, md: 3 },
													color: "white",
												}}>
												<Typography
													variant='h6'
													gutterBottom
													color='white'
													sx={{ fontWeight: 500 }}>
													Monthly Payment
												</Typography>
												<Typography
													variant='h3'
													sx={{
														fontWeight: 700,
														color: "#ffffff",
														fontSize: { xs: "1.8rem", md: "2.2rem" },
													}}>
													₹{calculateMonthlyPayment()}
												</Typography>
											</Box>

											<Button
												variant='contained'
												fullWidth
												className='borrow-btn'
												endIcon={
													service?.packages?.length > 0 ? (
														<ArrowForwardIcon />
													) : (
														<CalculateIcon />
													)
												}
												sx={{
													backgroundColor: "#ff4081",
													color: "white",
													py: 1.5,
													fontWeight: 600,
													fontSize: "1rem",
													borderRadius: "4px",
													"&:hover": {
														backgroundColor: "#e0356f",
													},
												}}
												onClick={() => {
													if (service?.packages?.length > 0) {
														// If service has packages, scroll to packages section
														scrollToSection(packagesRef);
													} else {
														// Otherwise, proceed with direct application
														handleApplyNow(true);
													}
												}}>
												{service?.packages?.length > 0
													? "View Packages"
													: "Apply Now"}
											</Button>
										</Grid>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Container>
				</Box>

				{/* Newsletter Section */}
				<Box sx={{ py: 3, bgcolor: "#1e4a30" }}>
					<Container maxWidth='lg'>
						<Grid
							container
							alignItems='center'
							justifyContent='center'
							spacing={2}>
							<Grid item xs={12} sm='auto'>
								<Typography
									variant='h6'
									align='center'
									gutterBottom
									sx={{
										color: "white",
										fontWeight: 500,
										fontSize: "1rem",
										m: 0,
										mb: { xs: 1, sm: 0 },
									}}>
									Signup For Our Newsletter
								</Typography>
							</Grid>
							<Grid item xs={12} sm='auto'>
								<Box
									sx={{
										display: "flex",
										maxWidth: { xs: "100%", sm: "auto" },
										mx: "auto",
									}}>
									<TextField
										placeholder='Email Address'
										size='small'
										variant='outlined'
										fullWidth
										sx={{
											backgroundColor: "white",
											borderRadius: "4px 0 0 4px",
											"& .MuiOutlinedInput-root": {
												borderRadius: "4px 0 0 4px",
											},
											"& .MuiOutlinedInput-notchedOutline": {
												borderRight: 0,
											},
										}}
									/>
									<Button
										variant='contained'
										sx={{
											backgroundColor: "#000",
											color: "white",
											borderRadius: "0 4px 4px 0",
											padding: "8px 16px",
											"&:hover": {
												backgroundColor: "#333",
											},
										}}>
										Go!
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default PersonalLoanPage;
