import React from "react";
import {
	Box,
	Container,
	Typography,
	Grid,
	Button,
	Paper,
	useMediaQuery,
	alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
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
	transition: "all 0.3s ease",
	"&:hover": {
		transform: "translateY(-2px)",
		boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
	},
	[theme.breakpoints.down("sm")]: {
		padding: "10px 20px",
		fontSize: "0.85rem",
	},
}));

// Animated gradient card
const GradientCard = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(4),
	height: "100%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
	borderRadius: "16px",
	overflow: "hidden",
	position: "relative",
	background: "linear-gradient(135deg, rgba(27,50,29,0.03) 0%, rgba(198,219,206,0.15) 100%)",
	border: "1px solid rgba(198,219,206,0.5)",
	transition: "all 0.5s ease",
	"&:hover": {
		transform: "translateY(-10px)",
		boxShadow: "0 16px 50px rgba(0,0,0,0.15)",
		"&::before": {
			transform: "rotate(210deg) scale(1.5)",
		},
		"&::after": {
			transform: "rotate(-210deg) scale(1.5)",
	},
	},
	"&::before, &::after": {
		content: '""',
		position: "absolute",
		width: "300px",
		height: "300px",
		borderRadius: "50%",
		transition: "all 3s ease-in-out",
	},
	"&::before": {
		background: "radial-gradient(circle, rgba(255,64,129,0.1) 0%, rgba(255,255,255,0) 70%)",
		top: "-150px",
		left: "-150px",
		transform: "rotate(0deg) scale(1)",
	},
	"&::after": {
		background: "radial-gradient(circle, rgba(140,198,63,0.1) 0%, rgba(255,255,255,0) 70%)",
		bottom: "-150px",
		right: "-150px",
		transform: "rotate(0deg) scale(1)",
	},
}));

// Animated icon component
const AnimatedIcon = styled(Box)(({ theme }) => ({
	position: "relative",
	margin: theme.spacing(2, 0, 4, 0),
	"& svg": {
		fontSize: "5rem",
		color: theme.palette.primary.main,
		opacity: 0.8,
		transition: "all 0.5s ease",
	},
	"&::before": {
		content: '""',
		position: "absolute",
		width: "120px",
		height: "120px",
		borderRadius: "50%",
		background: "radial-gradient(circle, rgba(27,50,29,0.1) 0%, rgba(255,255,255,0) 70%)",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		zIndex: -1,
		animation: "pulse 3s infinite",
	},
	"@keyframes pulse": {
		"0%": {
			transform: "translate(-50%, -50%) scale(0.8)",
			opacity: 0.8,
		},
		"50%": {
			transform: "translate(-50%, -50%) scale(1.2)",
			opacity: 0.5,
		},
		"100%": {
			transform: "translate(-50%, -50%) scale(0.8)",
			opacity: 0.8,
		},
	},
}));

// Decorative element
const Dot = styled(Box)(({ size, position, color, delay }) => ({
	position: "absolute",
	width: size,
	height: size,
	borderRadius: "50%",
	backgroundColor: color,
	...position,
	opacity: 0,
	animation: `floatIn 2s ease forwards ${delay}s`,
	"@keyframes floatIn": {
		"0%": {
			opacity: 0,
			transform: "translateY(20px)",
		},
		"100%": {
			opacity: 0.8,
			transform: "translateY(0)",
		},
	},
}));

const PortfolioBPage = () => {
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<ThemeProvider theme={theme}>
				<Box
				className='service-page mutual-funds-page' 
					sx={{
						pt: "196px",
					minHeight: "100vh",
					background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)"
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={4} justifyContent="center" alignItems="center">
						<Grid item xs={12} textAlign="center">
									<Typography
								variant="h2" 
										sx={{
											fontWeight: 700,
									mb: 2,
											position: "relative",
											display: "inline-block",
									color: theme.palette.primary.main,
											"&::after": {
												content: '""',
												position: "absolute",
										width: "60%",
										height: "4px",
										background: "linear-gradient(to right, #1b321d 30%, #ff4081 100%)",
										bottom: "-10px",
										left: "50%",
										transform: "translateX(-50%)",
										borderRadius: "4px"
									}
								}}
							>
								Portfolio Builder
									</Typography>
									<Typography
								variant="h5" 
								color="textSecondary"
										sx={{
									mb: 4, 
									opacity: 0.9,
									fontWeight: 500,
									maxWidth: "700px",
									mx: "auto"
								}}
							>
								Your personalized investment strategy is on its way
									</Typography>
										</Grid>

						<Grid item xs={12} md={10} lg={8}>
							<GradientCard>
								{/* Decorative elements */}
								<Dot size="15px" position={{top: '10%', left: '10%'}} color={alpha(theme.palette.primary.main, 0.3)} delay={0.2} />
								<Dot size="25px" position={{bottom: '15%', right: '12%'}} color={alpha(theme.palette.secondary.main, 0.2)} delay={0.5} />
								<Dot size="10px" position={{top: '30%', right: '20%'}} color={alpha(theme.palette.accent.main, 0.3)} delay={0.8} />
								<Dot size="20px" position={{bottom: '25%', left: '15%'}} color={alpha(theme.palette.primary.light, 0.2)} delay={1.1} />
								
								<AnimatedIcon>
									<AutoGraphIcon fontSize="inherit" />
								</AnimatedIcon>
								
													<Typography
									variant="h3" 
									align="center" 
										gutterBottom
										sx={{
											fontWeight: 700,
										color: theme.palette.primary.main,
										mb: 3,
											position: "relative",
										zIndex: 2
									}}
								>
									Coming Soon
									</Typography>

									<Typography
									variant="body1" 
									align="center"
										sx={{
										maxWidth: "600px", 
											mb: 4,
										color: theme.palette.text.secondary,
										position: "relative",
										zIndex: 2
									}}
								>
									We're building a powerful portfolio management solution to help you achieve your financial goals. Our team is working to create a personalized experience that will revolutionize how you plan, build, and track your investments.
									</Typography>

								<Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mt: 2, position: "relative", zIndex: 2 }}>
									<StyledButton
										variant="contained"
										color="primary"
										startIcon={<NotificationsActiveIcon />}
									>
										Notify Me When Ready
									</StyledButton>
									
									<StyledButton
										variant="outlined"
										color="primary"
										startIcon={<AccessTimeIcon />}
									>
										Explore Other Services
									</StyledButton>
														</Box>
								
														<Typography
									variant="body2" 
									align="center" 
														sx={{
										mt: 4, 
										fontStyle: "italic", 
										color: theme.palette.text.secondary,
										opacity: 0.7,
										position: "relative",
										zIndex: 2
									}}
								>
									Expected launch: Q1 2023
														</Typography>
											</GradientCard>
										</Grid>

						<Grid item xs={12} textAlign="center" sx={{ mt: 6 }}>
							<Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
								Features to Look Forward To
														</Typography>
							
							<Grid container spacing={3} sx={{ mt: 2 }} justifyContent="center">
								<Grid item xs={12} sm={6} md={4}>
									<Box sx={{ 
										p: 3, 
										textAlign: "center",
													height: "100%",
										background: alpha(theme.palette.background.light, 0.6),
										borderRadius: "12px",
										border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
										transition: "transform 0.3s ease",
													"&:hover": {
											transform: "translateY(-5px)"
										}
									}}>
										<Typography variant="h6" color="primary" gutterBottom>
											Risk Assessment
													</Typography>
										<Typography variant="body2" color="textSecondary">
											Personalized portfolio recommendations based on your risk tolerance and financial goals.
												</Typography>
													</Box>
										</Grid>

								<Grid item xs={12} sm={6} md={4}>
									<Box sx={{ 
										p: 3, 
										textAlign: "center",
													height: "100%",
										background: alpha(theme.palette.background.light, 0.6),
										borderRadius: "12px",
										border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
										transition: "transform 0.3s ease",
													"&:hover": {
											transform: "translateY(-5px)"
										}
									}}>
										<Typography variant="h6" color="primary" gutterBottom>
											Performance Tracking
													</Typography>
										<Typography variant="body2" color="textSecondary">
											Real-time dashboards to monitor your investments and track progress toward your goals.
												</Typography>
									</Box>
										</Grid>

								<Grid item xs={12} sm={6} md={4}>
									<Box sx={{ 
										p: 3, 
										textAlign: "center",
													height: "100%",
										background: alpha(theme.palette.background.light, 0.6),
										borderRadius: "12px",
										border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
										transition: "transform 0.3s ease",
													"&:hover": {
											transform: "translateY(-5px)"
										}
									}}>
										<Typography variant="h6" color="primary" gutterBottom>
											Smart Rebalancing
													</Typography>
										<Typography variant="body2" color="textSecondary">
											Automated suggestions to optimize your portfolio and maintain your desired asset allocation.
													</Typography>
											</Box>
										</Grid>
										</Grid>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</ThemeProvider>
	);
};

export default PortfolioBPage;
