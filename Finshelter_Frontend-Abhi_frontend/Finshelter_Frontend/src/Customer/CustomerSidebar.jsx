// import React, { useState } from "react";
// import { useCustomerAuth } from "./CustomerAuthContext";
// import "./customer.css";

// const Sidebar = ({ activeSection, setActiveSection }) => {
// 	const [isOpen, setIsOpen] = useState(true);

// 	const sections = [
// 		"Dashboard",
// 		"Order History",
// 		"Documents Upload",
// 		"Payment History",
// 		"Profile",
// 		"Message Center",
// 		"Wallet",
// 	];

// 	const toggleSidebar = () => {
// 		setIsOpen(!isOpen);
// 	};

// 	return (
// 		<>
// 			{/* Toggle Button */}
// 			<button className="sidebar-toggle" onClick={toggleSidebar}>
// 				{isOpen ? "✖" : "☰"}
// 			</button>

// 			{/* Sidebar */}
// 			<div className={`csidebar ${isOpen ? "open" : "closed"}`}>
// 				<ul>
// 					{sections.map((section) => (
// 						<li
// 							key={section}
// 							className={activeSection === section ? "li-active" : ""}
// 							onClick={() => setActiveSection(section)}
// 						>
// 							{section}
// 						</li>
// 					))}
// 				</ul>
// 			</div>
// 		</>
// 	);
// };

// export default Sidebar;


import React, { useState } from "react";
import "./customer.css";

const CustomerSidebar = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(true);

  const sections = [
    "Dashboard",
    "Order History",
    "Documents Upload",
    "Payment History",
    "Profile",
    "Message Center",
    "Wallet",
  ];

  return (
    <>
      {/* Toggle Button */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div className={`csidebar ${isOpen ? "open" : "closed"}`}>
        <ul>
          {sections.map((section) => (
            <li
              key={section}
              className={activeSection === section ? "li-active" : ""}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CustomerSidebar;
