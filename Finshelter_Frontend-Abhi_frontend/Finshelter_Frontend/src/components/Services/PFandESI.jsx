import React from "react";
import StaticServiceTemplate from "./StaticServiceTemplate";
import {
	Description,
	VerifiedUser,
	QueryBuilder,
	LocalAtm,
	AssignmentTurnedIn,
	SupportAgent,
	BusinessCenter,
	Update,
	Assignment,
	AccountBalance,
	HealthAndSafety,
	EventNote,
	Receipt,
	Ballot,
} from "@mui/icons-material";

const PFandESIPage = () => {
	const customStyles = {
		primaryColor: "#1b321d",
		secondaryColor: "#ffffff",
		backgroundColor: "#F5F5F5",
		heroTextColor: "#ffffff",
		opacity: 0.9,

		whyChooseSection: {
			padding: "80px 0",
			backgroundColor: "#c6dbce", // --background
			textAlign: "center",
		},
		whyChooseHeading: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 700,
			fontSize: "3.5rem",
			color: "#1b321d", // --primary
			position: "relative",
			marginBottom: "20px",
		},
		whyChooseInitial: {
			fontSize: "5rem",
			color: "#95b8a2", // --accent for large initial
			marginRight: "10px",
		},
		whyChooseText: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 400,
			color: "#1b321d", // --primary
			maxWidth: "600px",
			margin: "0 auto 30px",
		},
		whyChooseButton: {
			backgroundColor: "#95b8a2", // --accent
			color: "#1b321d", // --primary
			borderRadius: "5px",
			padding: "12px 30px",
			textTransform: "none",
			fontWeight: 600,
			border: "none",
			"&:hover": {
				backgroundColor: "#1b321d", // --primary
				color: "#ffffff", // --secondary
			},
		},
		whyChooseCardContainer: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
			gap: "20px",
			maxWidth: "900px",
			margin: "0 auto",
		},
		whyChooseCard: {
			backgroundColor: "#ffffff", // --secondary
			border: "1px solid #e0e0e0",
			borderRadius: "8px",
			padding: "20px",
			textAlign: "center",
			transition: "all 0.3s ease",
			"&:hover": {
				boxShadow: "0 10px 20px rgba(27,50,29,0.1)",
				transform: "scale(1.05)",
			},
		},
		whyChooseCardIcon: {
			fontSize: "2rem",
			color: "#1b321d", // --primary
			marginBottom: "10px",
		},
		whyChooseCardTitle: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 600,
			color: "#1b321d", // --primary
		},

		// Existing card hover effect (for features, if needed)
		cardHoverEffect: {
			transition: "all 0.3s ease-in-out",
			"&:hover": {
				transform: "scale(1.03)",
				boxShadow: "0 15px 30px rgba(27,50,29,0.15)",
			},
		},
	};

	// Service configuration with new content provided by the user
	const serviceConfig = {
		serviceId: "SER025",
		serviceName: "PF and ESI",
		serviceDescription:
			"Managing Provident Fund (PF) and Employee State Insurance (ESI) obligations can be challenging for businesses. At FinShelter, we provide end-to-end solutions for registration, contribution tracking, return filing, and withdrawal assistance. We help businesses ensure compliance while fostering trust and satisfaction among their employees.",
		serviceHero: "/images/hero6.jpg",
		isLeadService: false,
		leadButtonText: "Get Started",
		packageButtonText: "Choose Package",
		customStyles: customStyles,

		benefits: [
			{
				title: "Expert Assistance",
				description:
					"Our team of experts ensures accurate registration and filing of PF and ESI documents to maintain full compliance.",
				icon: <VerifiedUser color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Time-Saving",
				description:
					"Save hours of administrative work with our streamlined process that handles all PF and ESI requirements for you.",
				icon: <QueryBuilder color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Employee Satisfaction",
				description:
					"Ensure your employees have seamless access to their benefits, fostering trust and loyalty in your organization.",
				icon: <HealthAndSafety color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Error-Free Filing",
				description:
					"Avoid mistakes that could trigger penalties or legal issues with our comprehensive review process.",
				icon: <AssignmentTurnedIn color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Proper Documentation",
				description:
					"We help you organize and maintain all necessary PF and ESI documents for future reference or verification.",
				icon: <Description color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Year-Round Support",
				description:
					"Get assistance for any PF or ESI-related queries throughout the year, ensuring continuous compliance.",
				icon: <SupportAgent color='inherit' sx={{ fontSize: 48 }} />,
			},
		],

		features: [
			{
				title: "Hassle-Free Registration",
				description:
					"Efficient setup for PF and ESI accounts to meet statutory requirements.",
			},
			{
				title: "Timely Return Filing",
				description:
					"Accurate filing of monthly and annual returns to avoid penalties.",
			},
			{
				title: "Contribution Management",
				description:
					"Streamlined tracking of employee and employer contributions to ensure accuracy.",
			},
			{
				title: "Withdrawal Assistance",
				description:
					"Simplified process for employees withdrawing funds for personal or professional needs.",
			},
			{
				title: "Compliance Monitoring",
				description:
					"Regular audits and reminders to ensure businesses meet all regulatory obligations.",
			},
			{
				title: "Claims Processing",
				description:
					"Assistance with processing ESI medical reimbursement claims for employees.",
			},
			{
				title: "Withdrawal Guidance",
				description:
					"Expert advice on PF withdrawals for retirement, medical emergencies, or home purchases.",
			},
			{
				title: "Regulatory Updates",
				description:
					"Regular updates on changes in PF & ESI regulations to keep your business compliant.",
			},
		],

		faqs: [
			{
				question: "What is PF and who needs to register for it?",
				answer:
					"Provident Fund (PF) is a mandatory savings scheme for employees. Businesses with 20 or more employees must register under the Employees' Provident Fund Organization (EPFO).",
			},
			{
				question: "What is ESI and who is eligible for it?",
				answer:
					"Employee State Insurance (ESI) provides health insurance to employees earning up to ₹21,000 per month. Employers with 10 or more eligible employees must register for ESI.",
			},
			{
				question: "How does FinShelter assist with PF and ESI registration?",
				answer:
					"We handle end-to-end registration, ensuring accurate documentation and setup for both PF and ESI accounts.",
			},
			{
				question: "Can employees withdraw their PF contributions?",
				answer:
					"Yes, employees can withdraw PF for retirement, home purchase, medical emergencies, or other specific needs as per EPFO guidelines.",
			},
			{
				question: "What happens if businesses fail to comply with PF & ESI regulations?",
				answer:
					"Non-compliance can lead to penalties, interest on unpaid contributions, and potential legal actions.",
			},
			{
				question: "What are PF and ESI return filings?",
				answer:
					"Employers must file regular returns detailing contributions, employee details, and updates, ensuring compliance with regulations.",
			},
			{
				question: "How does FinShelter ensure timely filings?",
				answer:
					"We maintain accurate records and send reminders to ensure all PF & ESI returns are filed before deadlines.",
			},
			{
				question: "How do employees claim ESI benefits?",
				answer:
					"Employees can claim benefits for medical expenses, maternity leave, or disability through their registered ESI accounts. FinShelter helps employers guide their workforce effectively.",
			},
		],
	};

	// Load AOS animation library for scroll animations (unchanged)
	React.useEffect(() => {
		if (typeof AOS !== "undefined") {
			AOS.init({
				duration: 800,
				once: true,
				mirror: true,
			});
		}
	}, []);

	return <StaticServiceTemplate {...serviceConfig} />;
};

export default PFandESIPage;
