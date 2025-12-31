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
	TrendingUp,
	Update,
	AccountBalance,
	EventNote,
} from "@mui/icons-material";

const TaxPlanningPage = () => {
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

	// Service configuration (updated with new content)
	const serviceConfig = {
		serviceId: "SER013",
		serviceName: "Tax Planning",
		serviceDescription:
			"FinShelter's Tax Planning Services are crafted to help individuals and businesses achieve optimal tax efficiency. Our expert team is well-versed in ever-changing tax laws, ensuring that you not only remain compliant but also maximize your savings and financial stability. We act as your trusted partner, simplifying the complexities of taxation and providing tailored strategies suited to your unique financial needs.",
		serviceHero: "/images/hero6.jpg",
		isLeadService: false,
		leadButtonText: "Get Started",
		packageButtonText: "Choose Package",
		customStyles: customStyles,

		benefits: [
			{
				title: "Expert Tax Guidance",
				description:
					"Our specialists provide recommendations on investments like ELSS funds, PPF, NPS, and other tax-saving instruments to optimize your financial strategy.",
				icon: <VerifiedUser color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Custom Tax-Saving Strategies",
				description:
					"Personalized planning to minimize liabilities through exemptions, deductions, and rebates tailored to your specific situation.",
				icon: <LocalAtm color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Business Tax Optimization",
				description:
					"Strategic structuring of expenses and claiming deductions to maximize operational efficiency for business owners.",
				icon: <BusinessCenter color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Real-Time Updates",
				description:
					"Continuous monitoring of tax laws to incorporate the latest benefits and adjustments into your financial planning.",
				icon: <Update color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Long-Term Financial Planning",
				description:
					"Incorporating effective tax strategies into your overall wealth and retirement plans for sustained financial growth.",
				icon: <TrendingUp color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Year-Round Support",
				description:
					"Ongoing assistance with tax-related queries, ensuring you have expert guidance whenever you need it.",
				icon: <SupportAgent color='inherit' sx={{ fontSize: 48 }} />,
			},
		],

		features: [
			{
				title: "Individual Tax Planning",
				description:
					"Optimizing deductions for salaried professionals, homeowners, and investors to minimize tax liability legally.",
			},
			{
				title: "Business Tax Strategies",
				description:
					"Leveraging tax benefits like depreciation claims, expense deductions, and government incentives for businesses of all sizes.",
			},
			{
				title: "Investment Advisory",
				description:
					"Recommendations on tax-efficient investment vehicles that align with your financial goals and risk tolerance.",
			},
			{
				title: "Tax-Saving Instruments",
				description:
					"Guidance on utilizing ELSS funds, PPF, NPS, and other tax-saving instruments to reduce taxable income under Section 80C.",
			},
			{
				title: "Comprehensive Assessment",
				description:
					"Thorough evaluation of your financial situation to identify all possible tax-saving opportunities and strategies.",
			},
			{
				title: "Strategic Timing",
				description:
					"Planning that begins at the start of the financial year to maximize opportunities for savings and investments.",
			},
			{
				title: "Wealth Building Integration",
				description:
					"Incorporating tax planning with long-term wealth creation strategies for optimal financial outcomes.",
			},
			{
				title: "Compliance Assurance",
				description:
					"Ensuring all tax planning strategies remain fully compliant with current laws and regulations.",
			},
		],

		faqs: [
			{
				question: "What is tax planning and why is it important?",
				answer:
					"Tax planning involves structuring your finances to minimize tax liabilities while remaining compliant with laws. It helps save money and improve financial efficiency by ensuring you don't pay more taxes than legally required.",
			},
			{
				question: "Who can benefit from tax planning?",
				answer:
					"Individuals, salaried professionals, and businesses of all sizes can benefit by reducing taxes legally and achieving financial goals more effectively. Anyone who pays taxes can realize advantages from proper tax planning.",
			},
			{
				question: "What types of investments help with tax saving?",
				answer:
					"Investments like ELSS (Equity Linked Savings Scheme), Public Provident Fund (PPF), National Pension System (NPS), and tax-saving fixed deposits can help reduce taxable income under Section 80C and other provisions of the Income Tax Act.",
			},
			{
				question: "How can businesses reduce their tax liability?",
				answer:
					"Businesses can lower taxes by claiming deductions for expenses, utilizing depreciation benefits, properly structuring operations, and complying with government tax incentives designed for specific industries or activities.",
			},
			{
				question: "When should I start tax planning?",
				answer:
					"Ideally, tax planning should be done at the beginning of the financial year to maximize opportunities for savings and investments. This proactive approach gives you more time to implement strategies effectively.",
			},
			{
				question: "Can tax planning help me save on long-term wealth building?",
				answer:
					"Yes, strategic tax planning incorporates investment options that generate wealth, such as mutual funds, retirement plans, and other long-term savings instruments. This approach helps your money grow more efficiently over time.",
			},
			{
				question: "What happens if I miss the tax filing deadline?",
				answer:
					"Missing deadlines may result in penalties or late fees. FinShelter ensures timely tax planning and filing, minimizing risks of additional costs or complications with tax authorities.",
			},
			{
				question: "How does FinShelter help with tax planning?",
				answer:
					"We provide customized tax-saving strategies, optimize deductions, and offer guidance on effective tax management to meet both individual and business needs. Our expert team stays current with tax laws to ensure you receive maximum benefits.",
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

export default TaxPlanningPage;
