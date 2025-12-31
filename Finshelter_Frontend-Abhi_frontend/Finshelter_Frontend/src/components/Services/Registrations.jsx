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
	Gavel,
	Security,
	EmojiEvents,
	PeopleAlt,
	AccountBalance,
	EventNote,
	Receipt,
	Ballot,
} from "@mui/icons-material";

const RegistartionsPage = () => {
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
		serviceId: "SER026",
		serviceName: "Registrations",
		serviceDescription:
			"Starting a business or formalizing existing operations can feel overwhelming when legal requirements and compliance are involved. At FinShelter, we aim to make this process stress-free and seamless. Whether it's registering a company, opening an NPS account, obtaining shop or labor licenses, or applying for a drug license, our expertise ensures accuracy, timely execution, and peace of mind. Trust us as your partner in building the foundation of your enterprise or initiative.",
		serviceHero: "/images/hero6.jpg",
		isLeadService: false,
		leadButtonText: "Get Started",
		packageButtonText: "Choose Package",
		customStyles: customStyles,

		benefits: [
			{
				title: "Comprehensive Expertise",
				description:
					"From startups and SMEs to large corporations and non-profits, we handle diverse registrations with precision and industry know-how.",
				icon: <VerifiedUser color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Streamlined Processes",
				description:
					"We cut through bureaucratic hurdles to make registration hassle-free and time-efficient for you.",
				icon: <QueryBuilder color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Tailored Solutions",
				description:
					"Every client has unique requirements—our solutions are customized to suit your business type, size, and goals.",
				icon: <BusinessCenter color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Compliance Guaranteed",
				description:
					"Avoid penalties, delays, and errors with our compliance-focused approach.",
				icon: <AssignmentTurnedIn color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Transparent Fee Structure",
				description:
					"No hidden charges—our costs are fair and competitive, ensuring value for your investment.",
				icon: <LocalAtm color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Dedicated Support",
				description:
					"Our team of professionals is available every step of the way to address your questions, provide updates, and guide you.",
				icon: <SupportAgent color='inherit' sx={{ fontSize: 48 }} />,
			},
		],

		features: [
			{
				title: "National Pension System (NPS)",
				description:
					"Simplify your retirement planning with NPS account setup and compliance.",
			},
			{
				title: "Private & Public Company Registration",
				description:
					"Ensure smooth incorporation with full legal documentation and compliance.",
			},
			{
				title: "Limited Liability Partnership (LLP)",
				description:
					"Benefit from expert guidance on setting up LLPs for small and medium enterprises.",
			},
			{
				title: "Section 8 Company Registration",
				description: 
					"Establish a non-profit or social enterprise with proper approvals.",
			},
			{
				title: "One Person Company (OPC)",
				description:
					"Set up a corporate structure ideal for single entrepreneurs with limited liability protection.",
			},
			{
				title: "Nidhi Company Registration",
				description:
					"Build mutual benefit societies with proper legal framework.",
			},
			{
				title: "Shop and Establishment Registration",
				description:
					"Formalize your business under the Shops and Establishments Act with ease.",
			},
			{
				title: "Labor License Registration",
				description:
					"Ensure compliance with labor laws to protect employer and employee interests.",
			},
			{
				title: "Drug License Registration",
				description:
					"Get approvals for pharmaceuticals and medical business operations.",
			},
		],

		faqs: [
			{
				question: "Why do I need to register my business or entity?",
				answer:
					"Registration is crucial for establishing legal compliance, protecting your assets, earning customer trust, and avoiding penalties.",
			},
			{
				question: "What types of registrations does FinShelter assist with?",
				answer:
					"We assist with NPS, company registration (private, public, LLP, OPC), Section 8 registration, Nidhi company registration, shop and labor licenses, and drug licenses, among others.",
			},
			{
				question: "What documents are required for company registration?",
				answer:
					"Key documents include identity proof, address proof, PAN card, Memorandum of Association (MOA), Articles of Association (AOA), DIN for directors, and other statutory papers.",
			},
			{
				question: "How long does the registration process take?",
				answer:
					"The duration depends on the type of registration. Typically, it ranges from 7 to 21 days for company registrations or NPS setups.",
			},
			{
				question: "What happens if I don't register my shop or business?",
				answer:
					"Failure to register may result in penalties, legal notices, or restrictions on your business operations.",
			},
			{
				question: "Is NPS registration mandatory for employers?",
				answer:
					"NPS registration is not mandatory, but it's a great way to provide retirement benefits to employees or secure individual retirement savings.",
			},
			{
				question: "What is the eligibility for labor license registration?",
				answer:
					"Employers hiring laborers for construction, manufacturing, or trade must register under applicable labor laws.",
			},
			{
				question: "Can I upgrade my business structure after registration?",
				answer:
					"Yes, FinShelter can help with transitions such as converting an LLP to a private limited company or restructuring partnerships.",
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

export default RegistartionsPage;
