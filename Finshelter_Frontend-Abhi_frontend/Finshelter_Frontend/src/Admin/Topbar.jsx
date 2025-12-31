import React from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	IconButton,
	Popover,
	Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MessageIcon from "@mui/icons-material/Message";

const Topbar = ({ activeSection, setActiveSection }) => {
	const [unreadCount, setUnreadCount] = useState(0);
	const { logout, isAuthenticated, messages } = useContext(
		AdminDashboardContext
	);
	const navigate = useNavigate();

	// User menu state
	const [anchorEl, setAnchorEl] = useState(null);
	const openUserMenu = Boolean(anchorEl);
	
	// User details - In a real app, fetch from context
	const adminName = "Admin"; // Replace with actual admin name if available

	const handleLogout = () => {
		logout(); // Clear authentication state
		navigate("/admin/login"); // Redirect to login page
	};

	useEffect(() => {
		if (messages) {
			// Only count messages that are:
			// 1. From customers or employees (incoming)
			// 2. Not sent by admin
			// 3. Not read
			const count = messages.filter(
				(msg) => !msg.isRead && 
				msg.senderRole !== 'admin' && 
				(msg.senderRole === "customer" || msg.senderRole === "employee")
			).length;
			setUnreadCount(count);
		}
	}, [messages]);

	// User menu handlers
	const handleUserClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setAnchorEl(null);
	};

	const handleMenuLogout = () => {
		handleUserMenuClose();
		handleLogout();
	};

	// Dynamically change the title based on activeSection
	const getTitle = () => {
		switch (activeSection) {
			case "Dashboard":
				return "Admin Dashboard";
			case "Services":
				return "Service Master";
			case "Managers":
				return "Manager Master";
			case "Customers":
				return "Customer Master";
			case "Orders":
				return "Order History";
			case "Employees":
				return "Employee Master";
			case "Message Center":
				return "Message Center";
			case "Withdrawal Requests":
				return "Withdrawal Requests";
			case "Leads":
				return "Lead Management";
			default:
				return "Admin Dashboard";
		}
	};

	const handleNotificationClick = () => {
		setActiveSection("Message Center"); // Update active section to Message Center
		handleUserMenuClose();
	};

	return (
		<div className='topbar'>
			<div></div>
			<div>
				<h1>{getTitle()}</h1>
			</div>

			<div id="n-cont">
				<IconButton 
					onClick={handleUserClick}
					sx={{ 
						padding: '5px',
						color: 'var(--accent)',
						border: '2px solid var(--accent)',
						borderRadius: '50%',
						marginRight: '8px'
					}}
				>
					<Badge 
						badgeContent={unreadCount > 99 ? "99+" : unreadCount} 
						color="error"
						sx={{
							"& .MuiBadge-badge": {
								fontSize: "12px",
								height: "22px",
								minWidth: "22px",
								padding: "0 6px"
							}
						}}
					>
						<Avatar 
							sx={{ 
								bgcolor: 'var(--accent)',
								color: 'white',
								width: 38, 
								height: 38
							}}
						>
							{adminName.charAt(0).toUpperCase()}
						</Avatar>
					</Badge>
				</IconButton>
				
				<Popover
					open={openUserMenu}
					anchorEl={anchorEl}
					onClose={handleUserMenuClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
				>
					<Box sx={{ p: 2, width: 250 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
							<Avatar sx={{ bgcolor: 'var(--accent)', mr: 1 }}>
								{adminName.charAt(0).toUpperCase()}
							</Avatar>
							<Typography variant="body1" fontWeight="bold">
								{adminName}
							</Typography>
						</Box>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Administrator
						</Typography>
						
						<Divider sx={{ my: 1 }} />
						
						{unreadCount > 0 && (
							<Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
								<NotificationsIcon sx={{ mr: 1, color: 'error.main' }} fontSize="small" />
								You have {unreadCount} new message{unreadCount !== 1 ? 's' : ''}
							</Typography>
						)}
						
						<Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
							<Button 
								variant="outlined" 
								startIcon={<MessageIcon />}
								sx={{ mb: 1 }}
								onClick={handleNotificationClick}
							>
								Message Center
							</Button>
							<Button 
								variant="contained" 
								color="error"
								startIcon={<LogoutIcon />}
								onClick={handleMenuLogout}
							>
								Logout
							</Button>
						</Box>
					</Box>
				</Popover>
			</div>
		</div>
	);
};

export default Topbar;
