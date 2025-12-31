// import React, { useState, useEffect } from "react";
// import { useCustomerAuth } from "./CustomerAuthContext";
// import CustomerSidebar from "./CustomerSidebar";
// import CustomerTopbar from "./CustomerTopbar";
// import CDashSection from "./CDashSection";
// import PaymentHistory from "./PaymentHistory";
// import CProfileSection from "./CProfileSection";
// import { Navigate, useParams } from "react-router-dom";
// import CServiceStatus from "./CServiceStatus";
// import CMessageCenter from "./CMessageCenter";
// import CDocumentUpload from "./CDocumentUpload";
// import ClipLoader from "react-spinners/ClipLoader"; // Make sure to install react-spinners
// import { useNotification } from "../NotificationContext";
// import ServiceProgress from "./ServiceProgress";
// import WalletDash from "./WalletDash";

// const CustomerDashboard = () => {
// 	const { isLoggedIn, error, loading, user, fetchCustomerDashboard } =
// 		useCustomerAuth();

// 	const [activeSection, setActiveSection] = useState("Dashboard");
// 	const { email } = useParams(); // Get email from the URL

// 	console.log("Email from URL params:", email);
// 	console.log("Is user logged in:", isLoggedIn);

// 	const { showNotification, setCurrentPage } = useNotification();

// 	useEffect(() => {
// 		setCurrentPage("customer");
// 	}, [setCurrentPage]);

// 	if (loading) {
// 		return (
// 			<div
// 				style={{
// 					position: "fixed",
// 					top: 0,
// 					left: 0,
// 					width: "100%",
// 					height: "100%",
// 					background: "rgba(0,0,0,0.5)",
// 					display: "flex",
// 					justifyContent: "center",
// 					alignItems: "center",
// 				}}>
// 				<ClipLoader size={50} color='#ffffff' />
// 			</div>
// 		);
// 	}

// 	// Check token instead of isLoggedIn to prevent redirect loop
// 	const token = localStorage.getItem("customerToken");
// 	if (!token) return <Navigate to='/customers/login' replace />;
	
// 	if (error) {
// 		return (
// 			<div className='error-message'>
// 				<p>{error}</p>
// 				<button onClick={() => <Navigate to='/customers/login' replace />}>
// 					Login Again
// 				</button>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className='customer-dashboard'>
// 			<CustomerSidebar
// 				activeSection={activeSection}
// 				setActiveSection={setActiveSection}
// 			/>
// 			<div className='content1'>
// 				{/* <CustomerTopbar activeSection={activeSection} /> */}
// 				<div className='content'>
// 					{activeSection === "Dashboard" && <CDashSection />}
// 					{activeSection === "Order History" && <CServiceStatus />}
// 					{activeSection === "Documents Upload" && <CDocumentUpload />}
// 					{activeSection === "Payment History" && <PaymentHistory />}
// 					{activeSection === "Profile" && <CProfileSection />}
// 					{activeSection === "Message Center" && <CMessageCenter />}
// 					{activeSection === "Wallet" && <WalletDash />}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default CustomerDashboard;


import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import CustomerSidebar from "./CustomerSidebar";
import CDashSection from "./CDashSection";
import PaymentHistory from "./PaymentHistory";
import CProfileSection from "./CProfileSection";
import { Navigate, useParams, useLocation } from "react-router-dom";
import CServiceStatus from "./CServiceStatus";
import CMessageCenter from "./CMessageCenter";
import CDocumentUpload from "./CDocumentUpload";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";
import WalletDash from "./WalletDash";
import "./customer.css";

const CustomerDashboard = () => {
  const { isLoggedIn, error, loading } = useCustomerAuth();
  const { email } = useParams();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("Dashboard");

  const { setCurrentPage } = useNotification();

  useEffect(() => {
    setCurrentPage("customer");
  }, [setCurrentPage]);

  // Handle initial section from navigation state (e.g., after payment)
  useEffect(() => {
    if (location.state?.initialSection) {
      setActiveSection(location.state.initialSection);
    }
  }, [location.state]);

  /* ================= Loading ================= */
  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 5000,
        }}
      >
        <ClipLoader size={50} color="#ffffff" />
      </div>
    );
  }

  /* ================= Auth Guard ================= */
  const token = localStorage.getItem("customerToken");
  if (!token) return <Navigate to="/customers/login" replace />;

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.replace("/customers/login")}>
          Login Again
        </button>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      {/* Sidebar */}
      <CustomerSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="content1">
        <div className="content">
          {activeSection === "Dashboard" && <CDashSection />}
          {activeSection === "Order History" && <CServiceStatus />}
          {activeSection === "Documents Upload" && <CDocumentUpload />}
          {activeSection === "Payment History" && <PaymentHistory />}
          {activeSection === "Profile" && <CProfileSection />}
          {activeSection === "Message Center" && (
            <CMessageCenter 
              initialOrderId={location.state?.orderId}
              initialServiceName={location.state?.serviceName}
            />
          )}
          {activeSection === "Wallet" && <WalletDash />}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
