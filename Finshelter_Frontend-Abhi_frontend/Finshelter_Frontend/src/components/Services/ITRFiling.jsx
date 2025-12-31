import React from "react";
import StaticServiceTemplate from "./StaticServiceTemplate";
import {
	Description,
	VerifiedUser,
	QueryBuilder,
	LocalAtm,
	AssignmentTurnedIn,
	SupportAgent,
	AccountBalanceWallet,
	DesignServices,
	Security,
	FactCheck,
	EventNote,
	Assignment,
	HowToReg,
	Receipt,
	AttachMoney,
	Calculate,
	ShowChart,
} from "@mui/icons-material";

const ITRFilingPage = () => {
	// Enhanced custom styles for a more professional look
	const customStyles = {
		primaryColor: "#1b321d",
		secondaryColor: "#ffffff",
		backgroundColor: "#F5F5F5",
		heroTextColor: "#ffffff",
		opacity: 0.9,
		heroGradient: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(27,50,29,0.85) 100%)`,

		// Improved Why Choose section
		whyChooseSection: {
			padding: "80px 0",
			backgroundColor: "#e8f0ea", // Lighter, more professional background
			textAlign: "center",
			position: "relative",
			"&::before": {
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundImage: "url('/images/pattern-light.png')",
				backgroundRepeat: "repeat",
				opacity: 0.1,
				zIndex: 0,
			},
		},
		whyChooseHeading: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 700,
			fontSize: { xs: "2.5rem", md: "3.5rem" },
			color: "#1b321d", // --primary
			position: "relative",
			marginBottom: "20px",
			"&::after": {
				content: '""',
				position: "absolute",
				bottom: -10,
				left: "50%",
				transform: "translateX(-50%)",
				width: "80px",
				height: "4px",
				backgroundColor: "#95b8a2", // --accent
				borderRadius: "2px",
			},
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
			maxWidth: "800px",
			margin: "0 auto 40px",
			fontSize: "1.1rem",
			lineHeight: 1.6,
		},
		whyChooseButton: {
			backgroundColor: "#1b321d", // --primary
			color: "#ffffff", // --secondary
			borderRadius: "30px",
			padding: "14px 36px",
			textTransform: "none",
			fontWeight: 600,
			border: "none",
			boxShadow: "0 6px 15px rgba(27,50,29,0.15)",
			"&:hover": {
				backgroundColor: "#95b8a2", // --accent
				color: "#1b321d", // --primary
				transform: "translateY(-3px)",
				boxShadow: "0 8px 20px rgba(27,50,29,0.2)",
			},
			transition: "all 0.3s ease",
		},
		whyChooseCardContainer: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
			gap: "30px",
			maxWidth: "1200px",
			margin: "0 auto",
		},
		whyChooseCard: {
			backgroundColor: "#ffffff", // --secondary
			border: "none",
			borderRadius: "12px",
			padding: "30px 25px",
			textAlign: "center",
			transition: "all 0.4s ease",
			boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
			position: "relative",
			zIndex: 1,
			overflow: "hidden",
			"&::before": {
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				height: "5px",
				background: "linear-gradient(to right, #1b321d, #95b8a2)",
				zIndex: 1,
				opacity: 0.8,
				transition: "height 0.3s ease",
			},
			"&:hover": {
				transform: "translateY(-10px)",
				boxShadow: "0 15px 30px rgba(27,50,29,0.12)",
				"&::before": {
					height: "10px",
				},
			},
		},
		whyChooseCardIcon: {
			fontSize: "3rem",
			color: "#1b321d", // --primary
			marginBottom: "20px",
			backgroundColor: "#f5f9f6",
			width: "80px",
			height: "80px",
			borderRadius: "50%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			margin: "0 auto 20px",
			transition: "all 0.3s ease",
		},
		whyChooseCardTitle: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 600,
			color: "#1b321d", // --primary
			fontSize: "1.3rem",
			marginBottom: "15px",
		},
		whyChooseCardDescription: {
			color: "#4a6350", // Darker green for better readability
			lineHeight: 1.7,
			fontSize: "1rem",
		},

		// Process Flow Section
		processSection: {
			padding: "60px 0 80px",
			backgroundColor: "#ffffff",
			position: "relative",
		},
		processHeading: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 700,
			fontSize: { xs: "2.5rem", md: "3.2rem" },
			color: "#1b321d",
			textAlign: "center",
			marginBottom: "20px",
			position: "relative",
		},
		processStep: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			textAlign: "center",
			position: "relative",
			zIndex: 2,
			padding: "0 10px",
		},
		processStepNumber: {
			width: "60px",
			height: "60px",
			borderRadius: "50%",
			backgroundColor: "#1b321d",
			color: "#ffffff",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontSize: "1.5rem",
			fontWeight: 700,
			marginBottom: "20px",
			boxShadow: "0 4px 8px rgba(27,50,29,0.15)",
			position: "relative",
			zIndex: 3,
		},
		processStepIcon: {
			fontSize: "2rem",
			color: "#95b8a2",
			marginBottom: "10px",
		},
		processStepTitle: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 600,
			fontSize: "1.2rem",
			color: "#1b321d",
			marginBottom: "8px",
		},
		processStepDescription: {
			fontSize: "0.9rem",
			color: "#4a6350",
			lineHeight: 1.5,
			maxWidth: "250px",
			margin: "0 auto",
		},
		processConnector: {
			position: "absolute",
			top: "30px",
			left: "calc(50% + 30px)",
			right: "calc(50% - 30px)",
			height: "2px",
			backgroundColor: "#c6dbce",
			zIndex: 1,
		},

		// Eligibility Section
		eligibilitySection: {
			padding: "80px 0",
			backgroundColor: "#f9fbf9",
			borderTop: "1px solid rgba(149, 184, 162, 0.2)",
			borderBottom: "1px solid rgba(149, 184, 162, 0.2)",
		},
		eligibilityHeading: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 700,
			fontSize: { xs: "2.2rem", md: "2.8rem" },
			color: "#1b321d",
			textAlign: "center",
			marginBottom: "40px",
		},
		eligibilityCard: {
			backgroundColor: "#ffffff",
			borderRadius: "12px",
			boxShadow: "0 8px 24px rgba(149, 184, 162, 0.12)",
			padding: "30px",
			height: "100%",
			transition: "transform 0.3s ease",
			"&:hover": {
				transform: "translateY(-8px)",
			},
		},
		eligibilityCardTitle: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 600,
			fontSize: "1.2rem",
			color: "#1b321d",
			marginBottom: "15px",
			display: "flex",
			alignItems: "center",
		},
		eligibilityCardIcon: {
			color: "#95b8a2",
			marginRight: "10px",
			fontSize: "1.5rem",
		},
		eligibilityList: {
			paddingLeft: "10px",
		},
		eligibilityListItem: {
			marginBottom: "10px",
			paddingLeft: "15px",
			position: "relative",
			"&::before": {
				content: '""',
				position: "absolute",
				left: 0,
				top: "10px",
				width: "6px",
				height: "6px",
				borderRadius: "50%",
				backgroundColor: "#95b8a2",
			},
		},

		// Tax Savings Tips Section
		taxTipsSection: {
			padding: "90px 0",
			backgroundColor: "#e8f0ea",
			backgroundImage: "linear-gradient(135deg, #e8f0ea 0%, #f5f9f6 100%)",
		},
		taxTipsHeading: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 700,
			fontSize: { xs: "2.2rem", md: "2.8rem" },
			color: "#1b321d",
			textAlign: "center",
			marginBottom: "50px",
		},
		taxTipCard: {
			backgroundColor: "#ffffff",
			borderRadius: "12px",
			overflow: "hidden",
			boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
			height: "100%",
			transition: "all 0.3s ease",
			"&:hover": {
				transform: "translateY(-8px)",
				boxShadow: "0 15px 30px rgba(27,50,29,0.1)",
			},
		},
		taxTipCardHeader: {
			backgroundColor: "#1b321d",
			color: "#ffffff",
			padding: "15px 20px",
		},
		taxTipCardContent: {
			padding: "25px",
		},
		taxTipCardTitle: {
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 600,
			fontSize: "1.2rem",
			color: "#ffffff",
			display: "flex",
			alignItems: "center",
		},
		taxTipCardIcon: {
			marginRight: "10px",
		},
		taxTipCardDescription: {
			fontSize: "1rem",
			color: "#4a6350",
			lineHeight: 1.6,
		},

		// Enhanced card hover effect
		cardHoverEffect: {
			transition: "all 0.4s ease-in-out",
			"&:hover": {
				transform: "translateY(-10px)",
				boxShadow: "0 20px 40px rgba(27,50,29,0.15)",
			},
		},
	};

	// Enhanced service configuration with additional sections
	const serviceConfig = {
		serviceId: "SER009",
		serviceName: "Income Tax Return Filing",
		serviceDescription:
			"Comprehensive Tax Filing with a Focus on Compliance and Optimization",
		serviceHero: "/images/hero6.jpg",
		isLeadService: false,
		leadButtonText: "Get Expert Assistance",
		packageButtonText: "Select This Package",
		customStyles: customStyles,

		// Enhanced benefits with improved descriptions
		benefits: [
			{
				title: "Expert Tax Advisors",
				description:
					"Our certified tax professionals ensure accurate filing while identifying every legitimate deduction to minimize your tax liability.",
				icon: <VerifiedUser color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Save Valuable Time",
				description:
					"Eliminate hours of paperwork and research. Our streamlined process handles everything, letting you focus on what matters most to you.",
				icon: <QueryBuilder color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Maximize Tax Savings",
				description:
					"We identify all applicable deductions, exemptions, and rebates to ensure you never pay more tax than legally required.",
				icon: <LocalAtm color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "100% Accuracy Guarantee",
				description:
					"Our comprehensive review process prevents errors that could trigger notices or audits, giving you complete peace of mind.",
				icon: <AssignmentTurnedIn color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "Secure Documentation",
				description:
					"We help organize and maintain all necessary records using state-of-the-art security for future reference or verification needs.",
				icon: <Description color='inherit' sx={{ fontSize: 48 }} />,
			},
			{
				title: "365-Day Support",
				description:
					"Access our tax experts throughout the year for any tax-related questions, not just during filing season.",
				icon: <SupportAgent color='inherit' sx={{ fontSize: 48 }} />,
			},
		],

		// Categorized features for better organization
		features: [
			{
				title: "Comprehensive Income Assessment",
				description:
					"We meticulously analyze all sources including salary, business income, capital gains, property rental, and foreign income for accurate reporting.",
			},
			{
				title: "Strategic Deduction Planning",
				description:
					"Expert guidance on optimizing deductions under sections 80C, 80D, 80G, 80TTA, and more to legally reduce your tax liability.",
			},
			{
				title: "Secure Digital Document System",
				description:
					"Upload documents through our encrypted platform with bank-level security, ensuring your sensitive financial information stays protected.",
			},
			{
				title: "Personalized Tax Strategy",
				description:
					"Receive tailored recommendations to optimize your tax structure for both short-term savings and long-term financial goals.",
			},
			{
				title: "Historical Return Analysis",
				description:
					"We review your previous filings to identify missed opportunities and ensure consistency with your current financial situation.",
			},
			{
				title: "Advanced TDS Reconciliation",
				description:
					"Detailed matching of your TDS records with Form 26AS to ensure all tax credits are properly claimed and accounted for.",
			},
			{
				title: "Proactive Notice Management",
				description:
					"Expert assistance with any income tax notices, from drafting responses to representing your case with tax authorities when needed.",
			},
			{
				title: "End-to-End Refund Processing",
				description:
					"We monitor your tax refund status through every stage of processing until it's successfully credited to your account.",
			},
		],

		// Additional custom sections
		customSections: [
			// Process Flow Section
			{
				id: "process-flow",
				component: "ProcessFlow",
				title: "Our Simplified ITR Filing Process",
				subtitle: "Experience our streamlined approach to tax filing that maximizes savings while ensuring full compliance",
				steps: [
					{
						number: "01",
						title: "Document Collection",
						description: "Upload your financial documents through our secure portal or provide them to your assigned tax advisor.",
						icon: <Assignment fontSize='large' sx={{ color: "#95b8a2" }} />,
					},
					{
						number: "02",
						title: "Expert Analysis",
						description: "Our tax professionals review your documents to identify all possible deductions and tax-saving opportunities.",
						icon: <FactCheck fontSize='large' sx={{ color: "#95b8a2" }} />,
					},
					{
						number: "03",
						title: "Return Preparation",
						description: "We prepare your return with meticulous attention to detail, ensuring accuracy and maximum tax benefits.",
						icon: <DesignServices fontSize='large' sx={{ color: "#95b8a2" }} />,
					},
					{
						number: "04",
						title: "Verification & Filing",
						description: "After your review and approval, we electronically file your return with the Income Tax Department.",
						icon: <Security fontSize='large' sx={{ color: "#95b8a2" }} />,
					},
					{
						number: "05",
						title: "Confirmation & Follow-up",
						description: "Receive filing confirmation and track your refund status through our client portal.",
						icon: <Receipt fontSize='large' sx={{ color: "#95b8a2" }} />,
					},
				],
			},

			// Eligibility Criteria Section
			{
				id: "eligibility-criteria",
				component: "EligibilityCriteria",
				title: "Who Should File Income Tax Returns?",
				subtitle:
					"Even if your income is below taxable limits, filing ITR can provide numerous benefits",
				criteria: [
					{
						title: "Income-based Filing Requirements",
						icon: <AccountBalanceWallet />,
						items: [
							"Individuals with gross income exceeding ₹2.5 lakhs per annum",
							"Senior citizens (60-80 years) with income above ₹3 lakhs",
							"Super senior citizens (80+ years) with income above ₹5 lakhs",
							"Businesses with turnover above ₹1 crore or ₹2 crores for professionals",
						],
					},
					{
						title: "Mandatory Filing Scenarios",
						icon: <HowToReg />,
						items: [
							"Foreign income earners, regardless of amount",
							"Individuals who have assets or financial interest outside India",
							"Those who wish to claim tax refunds on TDS deducted",
							"Persons with foreign travel expenses exceeding ₹2 lakhs in a financial year",
						],
					},
					{
						title: "Benefits of Voluntary Filing",
						icon: <FactCheck />,
						items: [
							"Establishes proof of income for loan applications or visa processing",
							"Helps avoid interest penalties if income later exceeds thresholds",
							"Carries forward losses that can be set off against future income",
							"Creates an official financial record for property transactions",
						],
					},
				],
			},

			// Tax Saving Tips Section
			{
				id: "tax-saving-tips",
				component: "TaxTips",
				title: "Strategic Tax Savings Guide",
				subtitle:
					"Maximize your tax benefits with these professional recommendations",
				tips: [
					{
						title: "Investment Planning",
						icon: <ShowChart />,
						description:
							"Utilize Section 80C investments like ELSS funds, PPF, and insurance premiums to claim deductions up to ₹1.5 lakhs annually. Strategic investments not only save tax but also help build long-term wealth.",
					},
					{
						title: "Healthcare Savings",
						icon: <Security />,
						description:
							"Claim deductions up to ₹25,000 for health insurance premiums under Section 80D. This limit increases to ₹50,000 for senior citizens, providing significant tax relief while ensuring medical security.",
					},
					{
						title: "Home Loan Benefits",
						icon: <Calculate />,
						description:
							"Deduct up to ₹2 lakhs on home loan interest under Section 24 and principal repayment under Section 80C. First-time homebuyers can claim an additional deduction of ₹50,000 under Section 80EEA.",
					},
					{
						title: "Donations & Charity",
						icon: <AttachMoney />,
						description:
							"Contributions to approved charities and relief funds qualify for deductions under Section 80G, with deduction percentages ranging from 50% to 100% depending on the organization.",
					},
					{
						title: "New Tax Regime Option",
						icon: <EventNote />,
						description:
							"Evaluate whether the new tax regime with lower rates but fewer exemptions works better for your financial situation compared to the traditional regime with higher rates but more deductions.",
					},
				],
			},
		],

		// Enhanced FAQs with more detailed answers
		faqs: [
			{
				question: "Which ITR form is applicable for me?",
				answer:
					"The applicable ITR form depends on your income sources:\n\n• ITR-1 (Sahaj): For residents with income up to ₹50 lakhs from salary, one house property, and other sources (excluding lottery/gambling)\n\n• ITR-2: For individuals with income from salary, more than one house property, capital gains, and foreign income\n\n• ITR-3: For individuals and HUFs having income from business or profession\n\n• ITR-4 (Sugam): For presumptive income from business or profession\n\nOur experts will determine the correct form based on your specific financial situation and ensure all income sources are properly reported.",
			},
			{
				question: "What documents do I need to provide for ITR filing?",
				answer:
					"Essential documents for ITR filing include:\n\n• Form 16 from your employer(s)\n• Form 26AS (tax credit statement)\n• Bank statements for all accounts\n• Investment proof for tax-saving deductions (80C, 80D, etc.)\n• Home loan interest certificate (if applicable)\n• Rent receipts and rent agreement if claiming HRA\n• Capital gains statements for investments (if applicable)\n\nFor business income, you'll also need:\n• Profit and loss statement\n• Balance sheet\n• Bank statements for business accounts\n• GST returns (if registered)\n\nOur document checklist tool can help you organize everything needed for your specific situation.",
			},
			{
				question: "Is it mandatory to file an income tax return?",
				answer:
					"ITR filing is mandatory if your gross total income exceeds the basic exemption limit (₹2.5 lakhs for individuals under 60 years, ₹3 lakhs for seniors 60-80 years, and ₹5 lakhs for super seniors above 80).\n\nHowever, filing returns is highly advisable even if your income is below the threshold for several reasons:\n\n• It creates an official income record\n• Helps in loan applications and visa processing\n• Allows claiming tax refunds\n• Prevents potential penalties if your income is reassessed\n• Enables carrying forward losses to future years\n\nRegular filing also establishes a good financial discipline and tax compliance history.",
			},
			{
				question: "What is the deadline for filing ITR?",
				answer:
					"The standard deadlines for ITR filing are:\n\n• July 31st: For individuals and entities not requiring audit\n• October 31st: For businesses and professionals requiring tax audit\n\nThese dates may be extended by the government in special circumstances. If you miss the regular deadline, you can still file a belated return with penalties:\n\n• By December 31st: Late fee ranging from ₹1,000 to ₹10,000 based on income level\n• By March 31st: Higher penalties may apply\n\nImportant: Belated returns have disadvantages including inability to carry forward certain losses (except house property losses), potential interest on unpaid taxes, and limitations on revising the return later.",
			},
			{
				question: "How long does it take to process my tax return?",
				answer:
					"Our service timeline for processing your tax return:\n\n1. Initial Assessment: 1-2 business days after document submission\n2. Query Resolution: Depends on complexity of your case\n3. ITR Preparation: 2-3 business days\n4. Your Review & Approval: Depends on your response time\n5. E-filing: 1 business day after your approval\n\nAfter filing, the Income Tax Department typically processes returns within:\n• 20-45 days for e-verified returns\n• 60-90 days for physically verified returns\n\nRefunds (if applicable) are usually issued within 20-30 days after processing is complete. Our client portal provides real-time updates on your return status throughout this process.",
			},
			{
				question: "What happens if I miss the ITR filing deadline?",
				answer:
					"If you miss the July 31st deadline:\n\n1. You can file a belated return until December 31st of the assessment year with penalties:\n   • Income up to ₹5 lakhs: ₹1,000 late fee\n   • Income above ₹5 lakhs: ₹5,000 late fee\n\n2. Filing after December 31st but before March 31st involves:\n   • Higher late fees (up to ₹10,000)\n   • Interest on unpaid tax @ 1% per month under Section 234A\n   • Potential notice from tax department\n\n3. Key disadvantages of belated filing:\n   • Cannot carry forward most losses (except house property loss)\n   • Limited ability to revise return later\n   • May trigger scrutiny in some cases\n   • Delays in refund processing\n\nWe recommend setting up advance reminders through our system to avoid missing deadlines in the future.",
			},
			{
				question: "Can I revise my ITR if I discover a mistake after filing?",
				answer:
					"Yes, you can file a revised return to correct errors or omissions if your original return was filed before the due date. Key points about ITR revision:\n\n• Revision Window: You can revise until the end of the assessment year or before completion of assessment, whichever is earlier (typically up to March 31st)\n\n• Number of Revisions: Multiple revisions are allowed within the timeframe\n\n• Process: Similar to original filing but select 'Revised Return' and provide original acknowledgment number\n\n• Belated Returns: If you filed after the due date (belated return), revision options are more limited\n\n• Common Revisions: Income omissions, incorrect deductions, calculation errors\n\nOur post-filing review service can help identify potential errors before they become issues with tax authorities.",
			},
			{
				question:
					"What are the different modes of verification after filing ITR?",
				answer:
					"After filing your ITR, you must verify it within 120 days. Available verification methods include:\n\n• Aadhaar OTP: Instant verification using Aadhaar-linked mobile number\n• Net Banking: Verify through your bank's online portal\n• Bank ATM: Generate EVC through selected bank ATMs\n• Digital Signature: Using valid Digital Signature Certificate (DSC)\n• Demat Account: Through EVC generated via your demat account\n• Physical Form ITR-V: Print, sign and mail to CPC Bengaluru (if electronic methods not feasible)\n\nWe recommend Aadhaar OTP verification for fastest processing and refunds. Our system guides you through the most appropriate verification method based on your situation.",
			},
		],
	};

	// Load AOS animation library for scroll animations
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

export default ITRFilingPage;
