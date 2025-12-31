import React, { useContext } from "react";
import { EmployeeContext } from "./EmployeeContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const EmTopbar = ({ activeSection, onSectionChange }) => {
	const getTitle = () => {
		switch (activeSection) {
			case "Dashboard":
				return "Employee Dashboard";
			case "Orders":
				return "Assigned Orders";
			case "Leads":
				return "Assigned Leads";
			case "Customer Queries":
				return "Customer Queries";
			case "Profile":
				return "Profile";
			default:
				return "Employee Dashboard";
		}
	};
	
	const navigate = useNavigate();
	const { queries, employeeInfo, logout, user } = useContext(EmployeeContext);
	const [unreadCount, setUnreadCount] = useState(0);
	
	// User menu state
	const [anchorEl, setAnchorEl] = useState(null);
	const openUserMenu = Boolean(anchorEl);
	
	// Get employee name - from context if available
	const employeeName = employeeInfo?.name || user?.email?.split('@')[0] || "Employee";

	useEffect(() => {
		if (queries && employeeInfo) {
			// Only count queries that:
			// 1. Are not from the current employee
			// 2. Are not read and not replied
			const count = queries.filter(
				(qry) => !qry.isRead && 
				!qry.isReplied && 
				qry.senderRole !== 'employee' &&
				qry.sender !== employeeInfo.name
			).length;
			setUnreadCount(count);
		}
	}, [queries, employeeInfo]);
	
	// User menu handlers
	const handleUserClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setAnchorEl(null);
	};
	
	const handleMenuLogout = () => {
		handleUserMenuClose();
		logout();
		navigate('/employees/login');
	};
	
	const handleQueriesClick = () => {
		if (onSectionChange) {
			onSectionChange("Customer Queries");
		}
		handleUserMenuClose();
	};

	return (
		<div className='topbar'>
			<div></div>
			<div>
				<h1>{getTitle()}</h1>
			</div>
			
			<div id="n-cont2">
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
							{employeeName.charAt(0).toUpperCase()}
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
								{employeeName.charAt(0).toUpperCase()}
							</Avatar>
							<Typography variant="body1" fontWeight="bold">
								{employeeName}
							</Typography>
						</Box>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							{employeeInfo?.designation || "Staff Member"}
						</Typography>
						
						<Divider sx={{ my: 1 }} />
						
						{unreadCount > 0 && (
							<Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
								<NotificationsIcon sx={{ mr: 1, color: 'error.main' }} fontSize="small" />
								You have {unreadCount} new customer quer{unreadCount !== 1 ? 'ies' : 'y'}
							</Typography>
						)}
						
						<Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
							{onSectionChange && (
								<Button 
									variant="outlined" 
									startIcon={<MessageIcon />}
									sx={{ mb: 1 }}
									onClick={handleQueriesClick}
								>
									Customer Queries
								</Button>
							)}
							{onSectionChange && (
								<Button 
									variant="outlined" 
									startIcon={<AccountCircleIcon />}
									sx={{ mb: 1 }}
									onClick={() => {
										onSectionChange("Profile");
										handleUserMenuClose();
									}}
								>
									My Profile
								</Button>
							)}
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

export default EmTopbar;
