import React, { useState, useEffect } from "react";
import "./header.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import DropDownMenu, { DropdownContext, MobileDrawerContext as ServicesMobileDrawerContext } from "./DropDownMenu";
import ResourcesDropdown, { CalcDropdownContext, MobileDrawerContext as ResourcesMobileDrawerContext } from "./ResourcesDropdown";
import {
	AppBar,
	Box,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	useTheme,
	useMediaQuery,
	Collapse,
	styled,
	Avatar,
	Badge,
	Popover,
	Typography,
	Button,
	Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMore from "@mui/icons-material/ExpandMore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useCustomerAuth } from "../../Customer/CustomerAuthContext";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
	backgroundColor: "var(--primary)",
	boxShadow: "none",
	[theme.breakpoints.up("md")]: {
		display: "none",
	},
}));

const DesktopNav = styled(Box)(({ theme }) => ({
	display: "none",
	width: "100%", // Ensure it takes full width
	[theme.breakpoints.up("md")]: {
		display: "flex",
	},
}));

const Header = () => {
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = useState(false);
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [isCalcDropdownVisible, setIsCalcDropdownVisible] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const isHomePage = location.pathname === "/";

	// Safely access customer auth context with fallback values
	let isLoggedIn = false;
	let user = null;
	let logout = () => {};
	let messages = [];
	let unreadMessages = 0;

	try {
		const customerAuth = useCustomerAuth();
		isLoggedIn = customerAuth?.isLoggedIn || false;
		user = customerAuth?.user || null;
		logout = customerAuth?.logout || (() => {});
		messages = customerAuth?.messages || [];
		// Count only unread messages that were not sent by the customer
		unreadMessages = messages
			? messages.filter(
					(msg) =>
						!msg.isRead &&
						(msg.senderRole !== "customer" || msg.sender !== user?.name)
			  ).length
			: 0;
	} catch (error) {
		console.log("Not in customer context");
	}

	const isCustomerDashboard = location.pathname.includes(
		"/customers/dashboard"
	);
	let dropdownTimeout;
	let calcDropdownTimeout;

	// User menu state
	const [anchorEl, setAnchorEl] = useState(null);
	const openUserMenu = Boolean(anchorEl);

	useEffect(() => {
		const handleScroll = () => {
			if (isHomePage) {
				setIsScrolled(window.scrollY > 50);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isHomePage]);

	const handleMouseEnter = () => {
		clearTimeout(dropdownTimeout);
		dropdownTimeout = setTimeout(() => setIsDropdownVisible(true), 200);
	};

	const handleMouseLeave = () => {
		clearTimeout(dropdownTimeout);
		dropdownTimeout = setTimeout(() => setIsDropdownVisible(false), 300);
	};

	const handleCalcMouseEnter = () => {
		clearTimeout(calcDropdownTimeout);
		calcDropdownTimeout = setTimeout(() => setIsCalcDropdownVisible(true), 200);
	};

	const handleCalcMouseLeave = () => {
		clearTimeout(calcDropdownTimeout);
		calcDropdownTimeout = setTimeout(
			() => setIsCalcDropdownVisible(false),
			300
		);
	};

	// User menu handlers
	const handleUserClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		logout();
		handleUserMenuClose();
		navigate("/");
	};

	const drawerContent = (
		<Box
			sx={{
				width: { xs: "100%", sm: "50vw", md: "400px" },
				bgcolor: "var(--primary)",
				height: "100%",
				color: "var(--secondary)",
				display: 'flex',
				flexDirection: 'column',
			}}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					padding: "16px",
					borderBottom: "1px solid rgba(255,255,255,0.1)",
				}}>
				<img
					src='/images/newlogofinshelter.png'
					alt='FinShelter Logo'
					style={{ width: "40px", marginRight: "10px" }}
				/>
				<Box sx={{ color: "white", fontFamily: "Agbalumo", fontSize: "23px" }}>
					FinShelter
				</Box>
			</Box>
			<List sx={{ overflow: 'auto', flexGrow: 1 }}>
				<ListItem
					component={NavLink}
					to='/'
					onClick={() => setMobileOpen(false)}
					sx={{
						color: 'white',
						'&.active': {
							backgroundColor: 'rgba(255,255,255,0.1)',
							borderLeft: '3px solid var(--accent)',
						}
					}}>
					<ListItemText primary='Home' style={{ color: "white" }} />
				</ListItem>
				
				<ListItem 
					onClick={() => setIsDropdownVisible(!isDropdownVisible)}
					sx={{ color: 'white' }}>
					<ListItemText primary='Services' style={{ color: "white" }} />
					<ExpandMore sx={{ 
						transform: isDropdownVisible ? 'rotate(180deg)' : 'rotate(0deg)', 
						transition: 'transform 0.3s ease'
					}} />
				</ListItem>
				<Collapse
					in={isDropdownVisible}
					sx={{ position: "relative", zIndex: isDropdownVisible ? 20 : 1 }}>
					<DropdownContext.Provider value={setIsDropdownVisible}>
						<ServicesMobileDrawerContext.Provider value={setMobileOpen}>
							<Box sx={{ py: 1 }}>
								<DropDownMenu />
							</Box>
						</ServicesMobileDrawerContext.Provider>
					</DropdownContext.Provider>
				</Collapse>
				
				<ListItem 
					onClick={() => setIsCalcDropdownVisible(!isCalcDropdownVisible)}
					sx={{ color: 'white' }}>
					<ListItemText primary='Resources' style={{ color: "white" }} />
					<ExpandMore sx={{ 
						transform: isCalcDropdownVisible ? 'rotate(180deg)' : 'rotate(0deg)', 
						transition: 'transform 0.3s ease'
					}} />
				</ListItem>
				<Collapse
					in={isCalcDropdownVisible}
					sx={{ position: "relative", zIndex: isCalcDropdownVisible ? 20 : 1 }}>
					<CalcDropdownContext.Provider value={setIsCalcDropdownVisible}>
						<ResourcesMobileDrawerContext.Provider value={setMobileOpen}>
							<Box sx={{ py: 1 }}>
								<ResourcesDropdown />
							</Box>
						</ResourcesMobileDrawerContext.Provider>
					</CalcDropdownContext.Provider>
				</Collapse>

				<ListItem
					component={NavLink}
					to='/contact'
					onClick={() => setMobileOpen(false)}
					sx={{
						color: 'white',
						'&.active': {
							backgroundColor: 'rgba(255,255,255,0.1)',
							borderLeft: '3px solid var(--accent)',
						}
					}}>
					<ListItemText primary='Contact Us' style={{ color: "white" }} />
				</ListItem>
			</List>
			
			<Box sx={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
				{isLoggedIn ? (
					<Box
						sx={{
							padding: "16px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								color: "white",
								mb: 1,
							}}>
							<Badge badgeContent={unreadMessages} color='error'>
								<Avatar sx={{ bgcolor: "white", color: "var(--primary)", mr: 1 }}>
									{user?.name ? user.name.charAt(0).toUpperCase() : "U"}
								</Avatar>
							</Badge>
							<Typography sx={{ color: "white" }}>
								{user?.name || "User"}
							</Typography>
						</Box>
						{unreadMessages > 0 && (
							<Typography
								variant='body2'
								sx={{
									color: "white",
									mb: 1,
									display: "flex",
									alignItems: "center",
								}}>
								<NotificationsIcon
									sx={{ mr: 1, color: "error.main" }}
									fontSize='small'
								/>
								{unreadMessages} new message{unreadMessages !== 1 ? "s" : ""}
							</Typography>
						)}
						<Button
							component={NavLink}
							to={
								user?.email
									? `/customers/dashboard/${user.email}`
									: "/customers/login"
							}
							variant='contained'
							color='primary'
							startIcon={<AccountCircleIcon />}
							onClick={() => setMobileOpen(false)}
							sx={{ width: "100%", mb: 1 }}>
							Dashboard
						</Button>
						<Button
							variant='contained'
							color='warning'
							startIcon={<LogoutIcon />}
							onClick={handleLogout}
							sx={{ width: "100%" }}>
							Logout
						</Button>
					</Box>
				) : (
					<NavLink to='/register' style={{ width: "100%", display: 'block' }}>
						<div className='tax-header-btn'>
							<button className='tax5-btn'>
								Login / SignUp <i className='fa-solid fa-arrow-right'></i>
							</button>
						</div>
					</NavLink>
				)}
			</Box>
		</Box>
	);

	return (
		<>
			{/* Mobile Header */}
			<StyledAppBar position='fixed'>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						p: { xs: 1.5, sm: 2 }, // Responsive padding
						width: "90%",
						maxWidth: "1200px", // Cap the width
						mx: "auto", // Center it
					}}>
					<Box
						component={NavLink}
						to='/'
						sx={{
							color: "var(--secondary)",
							textDecoration: "none",
							display: "flex",
							alignItems: "center",
							fontFamily: "Agbalumo",
						}}>
						<img
							src='/images/newlogofinshelter.png'
							alt='FinShelter Logo'
							style={{ width: "40px", marginRight: "10px" }}
						/>
						<span style={{ fontSize: "23px" }}>FinShelter</span>
						
					</Box>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='end'
						onClick={() => setMobileOpen(!mobileOpen)}>
						{mobileOpen ? <CloseIcon /> : <MenuIcon />}
					</IconButton>
				</Box>
			</StyledAppBar>

			{/* Mobile Drawer */}
			<Drawer
				variant='temporary'
				anchor='right'
				open={mobileOpen}
				onClose={() => setMobileOpen(false)}
				ModalProps={{ keepMounted: true }}
				PaperProps={{
					sx: {
						width: '100%',
						maxWidth: { sm: '50vw', md: '400px' }
					}
				}}>
				<ServicesMobileDrawerContext.Provider value={setMobileOpen}>
					<ResourcesMobileDrawerContext.Provider value={setMobileOpen}>
						{drawerContent}
					</ResourcesMobileDrawerContext.Provider>
				</ServicesMobileDrawerContext.Provider>
			</Drawer>

			{/* Desktop Header */}
			<DesktopNav>
				<header
					className={`tax-header ${isHomePage && isScrolled ? "scrolled" : ""}`}
					style={{
						backgroundColor: isHomePage
							? isScrolled
								? "white"
								: "transparent"
							: "white",
					}}>
					<div className='tax-header-wrap'>
						<NavLink to='/'>
							<div className='tax-logo'>
								<div
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
										fontFamily: "Agbalumo",
									}}>
									<img
										src='/images/newlogofinshelter.png'
										alt='FinShelter Logo'
										style={{ width: "80px" }}
									/>
									FinShelter
									<span
										style={{
											color: isHomePage
												? isScrolled
													? "var(--primary)"
													: "var(--secondary)"
												: "var(--primary)",
										}}></span>
								</div>
							</div>
						</NavLink>

						<div className='tax-nav-wrap'>
							<nav className='tax-top-nav'>
								<NavLink
									to='/'
									className={({ isActive }) =>
										`nav-link ${isActive ? "active" : ""}`
									}
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
									}}>
									Home
								</NavLink>
								<div
									className='nav-link dropdown-trigger'
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
										cursor: "pointer",
									}}
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}>
									Services
									<i className='fa-solid fa-caret-down'></i>
									{isDropdownVisible && (
										<div
											onMouseEnter={() => clearTimeout(dropdownTimeout)}
											onMouseLeave={handleMouseLeave}>
											<DropdownContext.Provider value={setIsDropdownVisible}>
												<ServicesMobileDrawerContext.Provider value={setMobileOpen}>
													<Box sx={{ py: 1 }}>
														<DropDownMenu />
													</Box>
												</ServicesMobileDrawerContext.Provider>
											</DropdownContext.Provider>
										</div>
									)}
								</div>
								<div
									className='nav-link dropdown-trigger'
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
										cursor: "pointer",
									}}
									onMouseEnter={handleCalcMouseEnter}
									onMouseLeave={handleCalcMouseLeave}>
									Resources
									<i className='fa-solid fa-caret-down'></i>
									{isCalcDropdownVisible && (
										<div
											onMouseEnter={() => clearTimeout(calcDropdownTimeout)}
											onMouseLeave={handleCalcMouseLeave}>
											<CalcDropdownContext.Provider
												value={setIsCalcDropdownVisible}>
												<ResourcesMobileDrawerContext.Provider value={setMobileOpen}>
													<Box sx={{ py: 1 }}>
														<ResourcesDropdown />
													</Box>
												</ResourcesMobileDrawerContext.Provider>
											</CalcDropdownContext.Provider>
										</div>
									)}
								</div>
								<NavLink
									to='/contact'
									className={({ isActive }) =>
										`nav-link ${isActive ? "active" : ""}`
									}
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
									}}>
									Contact Us
								</NavLink>
							</nav>
						</div>

						{isLoggedIn ? (
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<IconButton
									onClick={handleUserClick}
									sx={{
										border: "2px solid",
										borderColor:
											isHomePage && !isScrolled ? "white" : "var(--primary)",
										marginRight: "8px",
										padding: "8px",
									}}>
									<Badge badgeContent={unreadMessages} color='error'>
										<Avatar
											sx={{
												bgcolor:
													isHomePage && !isScrolled
														? "white"
														: "var(--primary)",
												color:
													isHomePage && !isScrolled
														? "var(--primary)"
														: "white",
												width: 32,
												height: 32,
											}}>
											{user?.name ? user.name.charAt(0).toUpperCase() : "U"}
										</Avatar>
									</Badge>
								</IconButton>
								<Popover
									open={openUserMenu}
									anchorEl={anchorEl}
									onClose={handleUserMenuClose}
									anchorOrigin={{
										vertical: "bottom",
										horizontal: "right",
									}}
									transformOrigin={{
										vertical: "top",
										horizontal: "right",
									}}>
									<Box sx={{ p: 2, width: 250 }}>
										<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
											<Avatar sx={{ bgcolor: "var(--primary)", mr: 1 }}>
												{user?.name ? user.name.charAt(0).toUpperCase() : "U"}
											</Avatar>
											<Typography variant='body1' fontWeight='bold'>
												{user?.name || "User"}
											</Typography>
										</Box>
										<Typography
											variant='body2'
											color='textSecondary'
											sx={{ mb: 2 }}>
											{user?.email || ""}
										</Typography>

										<Divider sx={{ my: 1 }} />

										{unreadMessages > 0 && (
											<Typography
												variant='body2'
												sx={{ mb: 1, display: "flex", alignItems: "center" }}>
												<NotificationsIcon
													sx={{ mr: 1, color: "error.main" }}
													fontSize='small'
												/>
												You have {unreadMessages} new message
												{unreadMessages !== 1 ? "s" : ""}
											</Typography>
										)}

										<Box
											sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
											<Button
												variant='outlined'
												component={NavLink}
												to={
													user?.email
														? `/customers/dashboard/${user.email}`
														: "/customers/login"
												}
												startIcon={<AccountCircleIcon />}
												sx={{ mb: 1 }}
												onClick={handleUserMenuClose}>
												Dashboard
											</Button>
											<Button
												variant='contained'
												color='error'
												startIcon={<LogoutIcon />}
												onClick={handleLogout}>
												Logout
											</Button>
										</Box>
									</Box>
								</Popover>
							</Box>
						) : (
							<NavLink to='/register'>
								<div className='tax-header-btn'>
									<button className='tax5-btn'>
										Login / SignUp <i className='fa-solid fa-arrow-right'></i>
									</button>
								</div>
							</NavLink>
						)}
					</div>
				</header>
			</DesktopNav>
		</>
	);
};

export default Header;
