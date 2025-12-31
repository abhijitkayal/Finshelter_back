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
	EventNote,
	Receipt,
	Ballot,
} from "@mui/icons-material";

const GSTPage = () => {
	// Custom styles for this specific service page - matching FinWiz "Financial Advice" for Why Choose
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
		serviceId: "SER024",
		serviceName: "GST",
		serviceDescription:
			"Navigating GST compliance can be daunting, but FinShelter simplifies the process with expert-led solutions that ensure accuracy and transparency. From registration to filing returns and audits, we manage every step with precision, empowering businesses to focus on their growth. With FinShelter, you can avoid penalties, optimize input tax credits and stay updated on evolving GST laws.",
		serviceHero: "/images/hero6.jpg",
		isLeadService: false,
		leadButtonText: "Get Started",
		packageButtonText: "Choose Package",
		customStyles: customStyles,

		benefits: [
			{
				title: "Expert Assistance",
				description:
					"Our team of tax experts ensures accurate filing and maximum eligible deductions to optimize your tax savings.",
				icon: <VerifiedUser color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Time-Saving",
				description:
					"Save hours of research and paperwork with our streamlined process that handles everything for you.",
				icon: <QueryBuilder color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Maximum Tax Credits",
				description:
					"Our experts help you maximize Input Tax Credit (ITC) claims, reducing your overall tax liability legally.",
				icon: <LocalAtm color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Error-Free Filing",
				description:
					"Avoid mistakes that could trigger notices or audits with our comprehensive review process.",
				icon: <AssignmentTurnedIn color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Proper Documentation",
				description:
					"We help you organize and maintain the necessary documents for future reference or verification.",
				icon: <Description color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Year-Round Support",
				description:
					"Get assistance for any GST-related queries throughout the year, not just during filing season.",
				icon: <SupportAgent color='inherit' sx={{ fontSize: 48 }} />,
			},
		],

		features: [
			{
				title: "Efficient GST Registration",
				description:
					"Seamless setup for businesses and traders, enabling compliance with GST regulations.",
			},
			{
				title: "Comprehensive GST Filing",
				description:
					"Accurate preparation and submission of monthly, quarterly, and annual GST returns.",
			},
			{
				title: "Input Tax Credit (ITC) Assistance",
				description:
					"Expert guidance to maximize ITC claims, reducing tax liability.",
			},
			{
				title: "GST Audits and Reconciliation",
				description:
					"Thorough audits to ensure compliance, accuracy in filings, and correction of discrepancies.",
			},
			{
				title: "Advisory and Updates",
				description:
					"Tailored advice on GST structure and real-time updates on policy changes.",
			},
			{
				title: "Small Business Transition",
				description:
					"Assistance for small businesses in transitioning to GST effectively and efficiently.",
			},
			{
				title: "Export Business Consultation",
				description:
					"Specialized guidance for export-oriented businesses on GST exemptions and benefits.",
			},
			{
				title: "Multi-State Registration",
				description:
					"Strategic planning and management for businesses with multiple GST registrations across states.",
			},
		],

		faqs: [
			{
				question: "What is GST registration, and who needs it?",
				answer:
					"GST registration is mandatory for businesses with an annual turnover exceeding ₹20 lakhs (₹10 lakhs in special category states) or those engaged in inter-state commerce.",
			},
			{
				question: "What are the different types of GST returns?",
				answer:
					"Returns include GSTR-1 (sales details), GSTR-3B (summary of liabilities), and GSTR-9 (annual returns), among others, depending on your business type.",
			},
			{
				question: "What is Input Tax Credit (ITC)?",
				answer:
					"ITC allows businesses to reduce their GST liability by claiming a credit for the tax already paid on inputs or purchases.",
			},
			{
				question: "Can I revise my GST returns after filing?",
				answer:
					"No, once filed, GST returns cannot be revised. However, any errors can be rectified in subsequent filings.",
			},
			{
				question: "How does FinShelter ensure GST compliance?",
				answer:
					"We provide end-to-end GST support, including registration, filing, reconciliation, and audits, ensuring complete compliance and accuracy.",
			},
			{
				question: "What are the consequences of late GST filing?",
				answer:
					"Late filing attracts penalties, interest on unpaid taxes, and potential legal action. FinShelter ensures timely submissions to avoid penalties.",
			},
			{
				question: "Can I deregister from GST?",
				answer:
					"Yes, if your turnover falls below the threshold limit or your business ceases operations, deregistration is possible under GST rules.",
			},
			{
				question: "What if my business operates across multiple states?",
				answer:
					"You'll need a separate GST registration for each state. FinShelter simplifies this process and manages compliance for multi-state businesses.",
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

export default GSTPage;
