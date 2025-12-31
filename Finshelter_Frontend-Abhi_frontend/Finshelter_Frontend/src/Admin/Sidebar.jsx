import React, { useState,useEffect } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ activeSection, setActiveSection }) => {
	const [isCollapsed, setIsCollapsed] = useState(false);


	 const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handler = (event) => {
      setUnreadCount(event.detail);
    };
	console.log("unread",unreadCount);
    window.addEventListener("admin-unread-count", handler);

    return () => {
      window.removeEventListener("admin-unread-count", handler);
    };
  }, []);

	
	const sections = [
		"Dashboard",
		"Services",
		"Customers",
		
		"Employees",
		"Orders",
		"Leads",     
		"Message Center",
		"Withdrawal Requests", 
	];
	const { logout, isAuthenticated, selectedOrderPosition } = useContext(AdminDashboardContext);
	const navigate = useNavigate();
	const handleLogout = () => {
		logout(); // Clear authentication state
		navigate("/admin/login"); // Redirect to login page
	};

	return (
		<div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
			<button 
				className="sidebar-toggle"
				onClick={() => setIsCollapsed(!isCollapsed)}
				title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
			>
				{isCollapsed ? '☰' : '✕'}
			</button>
			
			{!isCollapsed && (
				<>
					<center>
						<Link to='/' id='side-home'>
							<div>Go to Home</div>
						</Link>
					</center>

					<ul>
						{sections.map((section) => (
							<li
								key={section}
								className={activeSection === section ? "li-active" : ""}
								onClick={() => setActiveSection(section)}>
								{section}
								{section === "Message Center" && unreadCount > 0 && (
									<span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.8 }}>
										({unreadCount})
									</span>
								)}
							</li>
						))}
						{/* {isAuthenticated && <button onClick={handleLogout}>Logout</button>} */}
					</ul>
				</>
			)}
		</div>
	);
};
export default Sidebar;
