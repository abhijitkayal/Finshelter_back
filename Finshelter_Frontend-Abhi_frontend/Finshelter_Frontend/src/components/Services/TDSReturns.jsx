import React from "react";
import StaticServiceTemplate from "./StaticServiceTemplate";
import {
	Description,
	VerifiedUser,
	QueryBuilder,
	LocalAtm,
	AssignmentTurnedIn,
	SupportAgent,
} from "@mui/icons-material";

const TDSReturnsPage = () => {
	// Custom styles for this specific service page - matching FinWiz "Financial Advice" for Why Choose
	const customStyles = {
		primaryColor: "#1b321d", // --primary: Dark green for text, borders
		secondaryColor: "#ffffff", // --secondary: White for card backgrounds
		accentColor: "#95b8a2", // --accent: Light green for initial, button
		backgroundColor: "#c6dbce", // --background: Light green for section backgrounds
		heroGradient:
			"linear-gradient(135deg, rgba(27,50,29,0.95) 0%, rgba(149,184,162,0.85) 100%)", // Hero gradient
		heroTextColor: "#ffffff", // White for hero text

		// Why Choose section styles (mapped to benefits, mimicking "Financial Advice")
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

	// Service configuration (unchanged, benefits will use Why Choose styling)
	const serviceConfig = {
		serviceId: "SER023",
		serviceName: "TDS Returns",
		serviceDescription:
			"Professional and hassle-free income tax return filing services for individuals and businesses",
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
				title: "Maximum Tax Savings",
				description:
					"Our experts identify all possible deductions and exemptions to minimize your tax liability legally.",
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
					"Get assistance for any tax-related queries throughout the year, not just during filing season.",
				icon: <SupportAgent color='inherit' sx={{ fontSize: 48 }} />,
			},
		],

		features: [
			{
				title: "Comprehensive Income Reporting",
				description:
					"We handle all income sources including salary, business, capital gains, property, and foreign income.",
			},
			{
				title: "Deduction Optimization",
				description:
					"Expert analysis to identify all eligible deductions under sections 80C, 80D, 80G, and more.",
			},
			{
				title: "Digital Document Upload",
				description:
					"Easy and secure upload system for all your tax-related documents.",
			},
			{
				title: "Tax Planning Advice",
				description:
					"Personalized recommendations to optimize your tax structure for the upcoming financial year.",
			},
			{
				title: "Previous Returns Review",
				description:
					"Verification of past returns to identify any missed deductions or errors that can be rectified.",
			},
			{
				title: "TDS Reconciliation",
				description:
					"Matching your TDS records with Form 26AS to ensure all tax credits are properly accounted for.",
			},
			{
				title: "Notice Assistance",
				description:
					"Help with responding to any tax notices or inquiries from the Income Tax Department.",
			},
			{
				title: "Refund Tracking",
				description:
					"Monitoring the status of your tax refund until it's successfully processed and received.",
			},
		],

		faqs: [
			{
				question: "Which ITR form is applicable for me?",
				answer:
					"The applicable ITR form depends on your sources of income. For salaried individuals with one house property, ITR-1 (Sahaj) is typically used. For individuals with business income or multiple properties, ITR-3 or ITR-4 may be applicable. Our experts will determine the correct form based on your specific situation.",
			},
			{
				question: "What documents do I need to provide for ITR filing?",
				answer:
					"Basic documents include Form 16 from your employer, Form 26AS (tax credit statement), bank statements, investment proofs for tax-saving deductions (such as 80C, 80D investments), home loan interest certificate (if applicable), and rent receipts if you claim HRA. For business income, profit and loss statements and balance sheets are also required.",
			},
			{
				question: "Is it mandatory to file an income tax return?",
				answer:
					"ITR filing is mandatory if your gross total income exceeds the basic exemption limit (currently ₹2.5 lakhs for individuals under 60 years). However, filing returns is advisable even if your income is below the threshold, as it creates an official income record, helps in loan applications, visa processing, and claiming tax refunds.",
			},
			{
				question: "What is the deadline for filing ITR?",
				answer:
					"The general deadline for filing ITR is July 31st each year for individuals. For businesses requiring audit, it's usually October 31st. These dates may be extended by the government in certain circumstances. Late filing is still possible with penalties until December 31st of the assessment year.",
			},
			{
				question: "How long does it take to process my tax return?",
				answer:
					"Once we receive all your documents, we typically process and file your return within 3-5 working days. After filing, the Income Tax Department usually processes returns within 20-45 days, after which any applicable refund is issued.",
			},
			{
				question: "What happens if I miss the ITR filing deadline?",
				answer:
					"If you miss the July 31st deadline, you can still file a belated return until December 31st of the assessment year with a late fee ranging from ₹1,000 to ₹10,000 depending on your income level. However, certain benefits like carrying forward losses (except house property loss) may not be available with belated returns.",
			},
			{
				question: "Can I revise my ITR if I discover a mistake after filing?",
				answer:
					"Yes, if you have filed your return within the due date, you can file a revised return to correct any omission or mistake until the end of the assessment year or before completion of assessment, whichever is earlier.",
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

export default TDSReturnsPage;
