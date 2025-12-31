import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
	Box,
	Typography,
	Grid,
	Paper,
	Divider,
	Avatar,
	Tooltip,
	Chip,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CalculateIcon from "@mui/icons-material/Calculate";
import SavingsIcon from "@mui/icons-material/Savings";
import PaymentsIcon from "@mui/icons-material/Payments";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PercentIcon from "@mui/icons-material/Percent";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MenuBookIcon from "@mui/icons-material/MenuBook";

// Create a context to handle dropdown closing - this will be used by Header.jsx
export const CalcDropdownContext = React.createContext(null);

// Create a context for mobile drawer (same as in DropDownMenu)
export const MobileDrawerContext = React.createContext(null);

const DropdownContainer = styled(Paper)(({ theme }) => ({
	position: "absolute",
	top: "calc(100% + 0px)",
	left: "77%",
	transform: "translateX(-50%)",
	zIndex: 1000,
	width: "350px",
	padding: "16px 20px 20px",
	boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
	border: "1px solid rgba(230, 230, 230, 0.7)",
	borderRadius: "16px",
	backgroundColor: "#fff",
	maxHeight: "450px",
	overflowY: "auto",
	[theme.breakpoints.down("md")]: {
		position: "relative",
		top: 0,
		left: 0,
		transform: "none",
		width: "100%",
		maxHeight: "300px",
		boxShadow: "none",
		borderRadius: "8px",
		padding: "12px 16px",
		border: "1px solid rgba(149, 184, 162, 0.3)",
		backgroundColor: "#fff",
	},
}));

const ResourceItem = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: "6px 12px",
	borderRadius: "10px",
	transition: "all 0.25s ease-in-out",
	position: "relative",
	overflow: "hidden",
	marginBottom: "-2px",
	"&:hover": {
		transform: "translateX(8px)",
		boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
		"&::before": {
			width: "100%",
		},
	},
	"&::before": {
		content: '""',
		position: "absolute",
		left: 0,
		top: 0,
		height: "100%",
		width: "0",
		backgroundColor: "rgba(255, 64, 129, 0.08)",
		transition: "width 0.3s ease",
		zIndex: 0,
	},
	[theme.breakpoints.down("md")]: {
		marginBottom: "10px",
		padding: "10px 12px",
	},
}));

// Organize resources by category
const resourcesData = {
	Resources: [
		{
			name: "Tax Glossary",
			description: "Comprehensive guide to tax terminology",
			path: "/glossary",
			icon: <MenuBookIcon />,
		},
	],
	"Financial Calculators": [
		{
			name: "EMI Calculator",
			description: "Calculate your loan EMI payments",
			path: "/emi-calculator",
			icon: <PaymentsIcon />,
		},
		{
			name: "Investment Calculator",
			description: "Plan your investments & estimate returns",
			path: "/investment-calculator",
			icon: <SavingsIcon />,
		},
		{
			name: "Tax Calculator",
			description: "Estimate your income tax liability",
			path: "/tax-calculator",
			icon: <CalculateIcon />,
		},
	],
};

const ResourcesDropdown = () => {
	// Get access to the parent's setIsCalcDropdownVisible function
	const closeCalcDropdown = useContext(CalcDropdownContext);
	// Get access to the mobile drawer state setter
	const setMobileOpen = useContext(MobileDrawerContext);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	// Get color for category title/chip
	const getCategoryColor = (category) => {
		if (category === "Resources") return "#1e4a30"; // primary green
		if (category === "Financial Calculators") return "#2C6040"; // lighter green
		return "#1b321d"; // default primary
	};

	// Function to handle link clicks
	const handleLinkClick = () => {
		// Close the calculator dropdown
		if (closeCalcDropdown) {
			closeCalcDropdown(false);
		}
		
		// Close the mobile drawer if we're on mobile
		if (isMobile && setMobileOpen) {
			setMobileOpen(false);
		}
	};

	return (
		<DropdownContainer className='dropdown-paper custom-scrollbar'>
			{Object.entries(resourcesData).map(([category, items], index) => (
				<Box
					key={category}
					sx={{ mb: index < Object.entries(resourcesData).length - 1 ? 2 : 0 }}>
					{/* Category Header */}
					<Box
						sx={{
							// mb: 1.5,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
						className='category-header dropdown-header'>
						<Chip
							label={category}
							className='category-chip'
							sx={{
								bgcolor: getCategoryColor(category),
								color: "white",
								fontWeight: 600,
								fontSize: "1rem",
								py: 0,
								px: 1.5,
								borderRadius: "14px",
								boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
								transition: "all 0.3s ease",
								"&:hover": {
									transform: "translateY(-2px)",
									bgcolor: "#ff4081",
									boxShadow: "0 4px 12px rgba(255, 64, 129, 0.25)",
								},
							}}
						/>
						<Divider
							sx={{ flex: 1, mx: 1.5, borderColor: "rgba(149, 184, 162, 0.4)" }}
						/>
					</Box>

					{/* Category Items */}
					<Grid container direction='column' spacing={0}>
						{items.map((item, itemIndex) => (
							<Grid item key={itemIndex}>
								<NavLink
									to={item.path}
									style={{ textDecoration: "none", color: "inherit" }}
									onClick={handleLinkClick}> 
									<Tooltip title={item.description} placement='right'>
										<ResourceItem>
											<Avatar
												sx={{
													width: 34,
													height: 34,
													bgcolor: "rgba(30, 74, 48, 0.08)",
													color: "var(--primary)",
													mr: 1.5,
													transition: "all 0.3s ease",
													boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
													border: "1px solid rgba(149, 184, 162, 0.2)",
													zIndex: 1,
													"& .MuiSvgIcon-root": {
														fontSize: "1.2rem",
													},
													"&:hover": {
														bgcolor: "#ff4081",
														color: "white",
														boxShadow: "0 3px 8px rgba(255, 64, 129, 0.25)",
													},
												}}
												className='service-icon'>
												{item.icon}
											</Avatar>
											<Box>
												<Typography
													sx={{
														fontWeight: 600,
														color: "var(--primary)",
														fontSize: "1.1rem",
														lineHeight: 1.1,
														transition: "all 0.2s ease",
														zIndex: 1,
														"&:hover": {
															color: "#ff4081",
														},
													}}
													className='service-name'>
													{item.name}
												</Typography>
												<Typography
													variant='body2'
													sx={{
														color: "var(--text-secondary)",
														fontSize: "0.8rem",
														lineHeight: 1.2,
													}}
													className='service-description'>
													{item.description}
												</Typography>
											</Box>
										</ResourceItem>
									</Tooltip>
								</NavLink>
							</Grid>
						))}
					</Grid>
				</Box>
			))}
		</DropdownContainer>
	);
};

export default ResourcesDropdown;
