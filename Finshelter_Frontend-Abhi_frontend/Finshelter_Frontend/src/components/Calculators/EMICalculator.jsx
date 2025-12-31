import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Divider,
	Grid,
	Slider,
	TextField,
	Typography,
	Paper, 
	useTheme,
	useMediaQuery,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	ToggleButton,
	ToggleButtonGroup,
	IconButton,
	Tooltip,
} from "@mui/material";
import {
	CurrencyInr,
	Bank,
	CalendarMonth,
	ChartPie,
	ChevronDown,
	Information,
	Download,
	DownloadBox,
} from "mdi-material-ui";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { styled } from "@mui/material/styles";
import Chart from "react-apexcharts";
import CalculatorWrapper from "./CalculatorWrapper";
import PaymentsIcon from "@mui/icons-material/Payments";

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
	borderRadius: "16px",
	overflow: "hidden",
	boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
	background: "linear-gradient(135deg, #ffffff 0%, #f7f9fc 100%)",
	position: "relative",
	zIndex: 1,
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "6px",
		background: "linear-gradient(90deg, #1b321d 0%, #95b8a2 100%)",
		zIndex: 2,
	},
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
	"& .MuiOutlinedInput-root": {
		borderRadius: "8px",
		transition: "all 0.3s ease-in-out",
		"&:hover": {
			boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
		},
		"&.Mui-focused": {
			boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
		},
	},
}));

const ResultCard = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	borderRadius: "12px",
	boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
	background: "linear-gradient(135deg, #f7f9fc 0%, #ffffff 100%)",
	position: "relative",
	overflow: "hidden",
	"&::after": {
		content: '""',
		position: "absolute",
		bottom: 0,
		right: 0,
		width: "100px",
		height: "100px",
		background:
			"radial-gradient(circle, rgba(149,184,162,0.1) 0%, rgba(255,255,255,0) 70%)",
		borderRadius: "50%",
	},
}));

const LoanTypeButton = styled(ToggleButton)(({ theme }) => ({
	borderRadius: "8px",
	padding: theme.spacing(1, 2),
	border: "1px solid #e0e0e0",
	fontSize: "0.95rem",
	[theme.breakpoints.down("sm")]: {
		padding: theme.spacing(0.75, 1),
		fontSize: "0.8rem",
	},
	"&.Mui-selected": {
		backgroundColor: "rgba(149,184,162,0.15)",
		color: "#1b321d",
		fontWeight: 600,
		border: "1px solid rgba(149,184,162,0.5)",
		"&:hover": {
			backgroundColor: "rgba(149,184,162,0.25)",
		},
	},
}));

const InfoBox = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	backgroundColor: "rgba(149,184,162,0.08)",
	border: "1px solid rgba(149,184,162,0.2)",
	borderRadius: "8px",
	marginTop: theme.spacing(2),
}));

const GradientText = styled(Typography)(({ theme }) => ({
	background: "linear-gradient(90deg, #1b321d 0%, #3c6d47 100%)",
	WebkitBackgroundClip: "text",
	WebkitTextFillColor: "transparent",
	display: "inline-block",
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
	color: "#1b321d",
	height: 8,
	"& .MuiSlider-track": {
		border: "none",
		backgroundImage: "linear-gradient(90deg, #1b321d 0%, #95b8a2 100%)",
	},
	"& .MuiSlider-thumb": {
		height: 24,
		width: 24,
		backgroundColor: "#fff",
		border: "2px solid #1b321d",
		"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
			boxShadow: "0 0 0 8px rgba(27, 50, 29, 0.16)",
		},
		"&:before": {
			display: "none",
		},
	},
	"& .MuiSlider-valueLabel": {
		lineHeight: 1.2,
		fontSize: 12,
		background: "unset",
		padding: 0,
		width: 32,
		height: 32,
		borderRadius: "50% 50% 50% 0",
		backgroundColor: "#1b321d",
		transformOrigin: "bottom left",
		transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
		"&:before": { display: "none" },
		"&.MuiSlider-valueLabelOpen": {
			transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
		},
		"& > *": {
			transform: "rotate(45deg)",
		},
	},
}));

const EMICalculator = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	// States
	const [loanAmount, setLoanAmount] = useState(2000000);
	const [interestRate, setInterestRate] = useState(8.5);
	const [loanTenure, setLoanTenure] = useState(240);
	const [emi, setEmi] = useState(0);
	const [totalInterest, setTotalInterest] = useState(0);
	const [totalPayment, setTotalPayment] = useState(0);
	const [loanType, setLoanType] = useState("home");
	const [showAmortization, setShowAmortization] = useState(false);
	const [amortizationSchedule, setAmortizationSchedule] = useState([]);

	// Constants for min/max values based on loan type
	const loanLimits = {
		home: { min: 0, max: 10000000, default: 2000000 },
		car: { min: 0, max: 2000000, default: 600000 },
		personal: { min:0, max: 1500000, default: 500000 },
		education: { min: 0, max: 5000000, default: 1000000 },
		business: { min: 0, max: 20000000, default: 5000000 },
	};

	const interestRateLimits = {
		home: { min: 6.5, max: 12, default: 8.5 },
		car: { min: 7, max: 15, default: 9.5 },
		personal: { min: 10, max: 18, default: 12 },
		education: { min: 8, max: 15, default: 10 },
		business: { min: 9, max: 16, default: 12 },
	};

	const tenureLimits = {
		home: { min: 60, max: 360, default: 240 },
		car: { min: 12, max: 84, default: 60 },
		personal: { min: 12, max: 60, default: 36 },
		education: { min: 12, max: 120, default: 84 },
		business: { min: 12, max: 180, default: 84 },
	};

	// Handle loan type change
	const handleLoanTypeChange = (event, newLoanType) => {
		if (newLoanType !== null) {
			setLoanType(newLoanType);
			setLoanAmount(loanLimits[newLoanType].default);
			setInterestRate(interestRateLimits[newLoanType].default);
			setLoanTenure(tenureLimits[newLoanType].default);
		}
	};

	// Calculate EMI and related values
	useEffect(() => {
		// P x R x (1+R)^N / [(1+R)^N-1]
		const p = loanAmount;
		const r = interestRate / (12 * 100); // monthly interest rate
		const n = loanTenure; // tenure in months

		const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
		const totalPaymentValue = emiValue * n;
		const totalInterestValue = totalPaymentValue - p;

		setEmi(emiValue);
		setTotalInterest(totalInterestValue);
		setTotalPayment(totalPaymentValue);

		// Generate amortization schedule
		generateAmortizationSchedule(p, r, n, emiValue);
	}, [loanAmount, interestRate, loanTenure, loanType]);

	// Generate amortization schedule
	const generateAmortizationSchedule = (
		principal,
		monthlyRate,
		months,
		monthlyPayment
	) => {
		let balance = principal;
		let schedule = [];

		for (let month = 1; month <= months; month++) {
			const interestPayment = balance * monthlyRate;
			const principalPayment = monthlyPayment - interestPayment;

			balance -= principalPayment;

			if (balance < 0) balance = 0;

			// Add monthly record
			schedule.push({
				month,
				principalPayment,
				interestPayment,
				balance,
			});
		}

		setAmortizationSchedule(schedule);
	};

	// Download amortization schedule as Excel
	const downloadScheduleAsExcel = () => {
		// Prepare data for Excel
		const excelData = [];
		
		// Add summary information
		excelData.push(['EMI Calculation Summary']);
		excelData.push(['Loan Amount', `₹${loanAmount.toLocaleString('en-IN')}`]);
		excelData.push(['Interest Rate', `${interestRate}% per annum`]);
		excelData.push(['Loan Tenure', `${loanTenure} months`]);
		excelData.push(['Monthly EMI', `₹${emi.toLocaleString('en-IN')}`]);
		excelData.push(['Total Interest', `₹${totalInterest.toLocaleString('en-IN')}`]);
		excelData.push(['Total Amount', `₹${totalPayment.toLocaleString('en-IN')}`]);
		excelData.push([]);
		
		// Add monthly schedule header
		excelData.push(['Monthly Payment Schedule']);
		excelData.push(['Month', 'Principal Paid', 'Interest Paid', 'Remaining Balance']);
		
		// Add monthly schedule data
		amortizationSchedule.forEach((monthData) => {
			excelData.push([
				`Month ${monthData.month}`,
				`₹${monthData.principalPayment.toFixed(2)}`,
				`₹${monthData.interestPayment.toFixed(2)}`,
				`₹${monthData.balance.toFixed(2)}`
			]);
		});
		
		// Create worksheet
		const worksheet = XLSX.utils.aoa_to_sheet(excelData);
		
		// Set column widths
		worksheet['!cols'] = [
			{ wch: 25 },
			{ wch: 20 },
			{ wch: 20 },
			{ wch: 20 }
		];
		
		// Create workbook
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'EMI Schedule');
		
		// Generate file name with current date
		const fileName = `EMI_Schedule_${new Date().toISOString().split('T')[0]}.xlsx`;
		
		// Download file
		XLSX.writeFile(workbook, fileName);
	};

	// Download amortization schedule as PDF
	const downloadScheduleAsPDF = () => {
		const doc = new jsPDF();
		
		// Add title
		doc.setFontSize(18);
		doc.setTextColor(27, 50, 29);
		doc.text('EMI Calculation Summary', 14, 20);
		
		// Add summary information
		doc.setFontSize(11);
		doc.setTextColor(0, 0, 0);
		
		const summaryData = [
			['Loan Amount', `₹${loanAmount.toLocaleString('en-IN')}`],
			['Interest Rate', `${interestRate}% per annum`],
			['Loan Tenure', `${loanTenure} months`],
			['Monthly EMI', `₹${Math.round(emi).toLocaleString('en-IN')}`],
			['Total Interest', `₹${Math.round(totalInterest).toLocaleString('en-IN')}`],
			['Total Amount', `₹${Math.round(totalPayment).toLocaleString('en-IN')}`]
		];
		
		doc.autoTable({
			startY: 30,
			head: [['Parameter', 'Value']],
			body: summaryData,
			theme: 'grid',
			headStyles: {
				fillColor: [27, 50, 29],
				textColor: [255, 255, 255],
				fontStyle: 'bold'
			},
			styles: {
				fontSize: 10,
				cellPadding: 5
			},
			columnStyles: {
				0: { fontStyle: 'bold', cellWidth: 60 },
				1: { cellWidth: 80 }
			}
		});
		
		// Add monthly payment schedule
		const finalY = doc.lastAutoTable.finalY + 10;
		doc.setFontSize(14);
		doc.setTextColor(27, 50, 29);
		doc.text('Monthly Payment Schedule', 14, finalY);
		
		// Prepare schedule data for table
		const scheduleData = amortizationSchedule.map((monthData) => [
			`Month ${monthData.month}`,
			`₹${monthData.principalPayment.toFixed(2)}`,
			`₹${monthData.interestPayment.toFixed(2)}`,
			`₹${monthData.balance.toFixed(2)}`
		]);
		
		doc.autoTable({
			startY: finalY + 5,
			head: [['Month', 'Principal Paid', 'Interest Paid', 'Remaining Balance']],
			body: scheduleData,
			theme: 'striped',
			headStyles: {
				fillColor: [27, 50, 29],
				textColor: [255, 255, 255],
				fontStyle: 'bold'
			},
			styles: {
				fontSize: 9,
				cellPadding: 4
			},
			columnStyles: {
				0: { cellWidth: 30 },
				1: { cellWidth: 50 },
				2: { cellWidth: 50 },
				3: { cellWidth: 50 }
			}
		});
		
		// Add footer
		const pageCount = doc.internal.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(8);
			doc.setTextColor(128, 128, 128);
			doc.text(
				`Generated on ${new Date().toLocaleDateString('en-IN')} | Page ${i} of ${pageCount}`,
				14,
				doc.internal.pageSize.height - 10
			);
		}
		
		// Generate file name with current date
		const fileName = `EMI_Schedule_${new Date().toISOString().split('T')[0]}.pdf`;
		
		// Download file
		doc.save(fileName);
	};

	// Format currency
	const formatCurrency = (value) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(value);
	};

	// Chart options - now updates with totalPayment
	const chartOptions = {
		labels: ["Principal Amount", "Total Interest"],
		colors: ["#1b321d", "#95b8a2"],
		plotOptions: {
			pie: {
				donut: {
					size: "65%",
					labels: {
						show: true,
						name: {
							show: true,
						},
						value: {
							show: true,
							formatter: (val) => {
								return new Intl.NumberFormat("en-IN", {
									style: "currency",
									currency: "INR",
									maximumFractionDigits: 0,
								}).format(val);
							},
						},
						total: {
							show: true,
							label: "Total Payment",
							formatter: (w) => {
								const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
								return new Intl.NumberFormat("en-IN", {
									style: "currency",
									currency: "INR",
									maximumFractionDigits: 0,
								}).format(total);
							},
						},
					},
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			position: "bottom",
			fontFamily: "Poppins, sans-serif",
			markers: {
				fillColors: ["#1b321d", "#95b8a2"],
			},
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						height: 230,
					},
				},
			},
		],
		tooltip: {
			y: {
				formatter: (val) => {
					return new Intl.NumberFormat("en-IN", {
						style: "currency",
						currency: "INR",
						maximumFractionDigits: 0,
					}).format(val);
				},
			},
		},
	};

	const chartSeries = [loanAmount, totalInterest];

	// Loan type labels
	const loanTypeLabels = {
		home: "Home Loan",
		car: "Car Loan",
		personal: "Personal Loan",
		education: "Education Loan",
		business: "Business Loan",
	};

	return (
		<CalculatorWrapper
			title="EMI Calculator"
			description="Calculate your monthly EMI, total interest payable, and amortization schedule for various types of loans. Plan your finances better with our easy-to-use EMI calculator."
			backgroundIcon={<PaymentsIcon sx={{ fontSize: 180 }} />}
		>
			<StyledCard>
				<CardContent sx={{ padding: { xs: 5, md: 6 } }}>
					<Grid container spacing={{ xs: 5, md: 6 }}>
						<Grid item xs={12} md={6}>
							<Box sx={{ mb: 4 }}>
								<Typography 
									variant="h5" 
									gutterBottom 
									sx={{ 
										fontWeight: 600, 
										color: "#1b321d",
										fontSize: { xs: "1.25rem", md: "1.5rem" }
									}}>
									Loan Details
								</Typography>
								<Divider sx={{ mb: 3 }} />

								<Box sx={{ mb: 3 }}>
									<Typography 
										sx={{ 
											mb: 1, 
											fontWeight: 500,
											fontSize: { xs: "0.95rem", md: "1rem" }
										}}>
										Loan Type
									</Typography>
									{isMobile ? (
										<Grid container spacing={1} sx={{ mb: 1 }}>
											{Object.entries(loanTypeLabels).map(([key, label]) => (
												<Grid item xs={6} key={key} sx={{ mb: 1 }}>
													<LoanTypeButton
														fullWidth
														value={key}
														selected={loanType === key}
														onClick={(e) => handleLoanTypeChange(e, key)}
														aria-label={label}
													>
														{key === "personal" ? "Personal" : key === "business" ? "Business" : label}
													</LoanTypeButton>
												</Grid>
											))}
										</Grid>
									) : (
										<ToggleButtonGroup
											value={loanType}
											exclusive
											onChange={handleLoanTypeChange}
											aria-label="loan type"
											sx={{ mb: 1, width: "100%" }}
										>
											<LoanTypeButton value="home" aria-label="home loan">
												Home Loan
											</LoanTypeButton>
											<LoanTypeButton value="car" aria-label="car loan">
												Car Loan
											</LoanTypeButton>
											<LoanTypeButton value="personal" aria-label="personal loan">
												Personal
											</LoanTypeButton>
											<LoanTypeButton value="education" aria-label="education loan">
												Education
											</LoanTypeButton>
											<LoanTypeButton value="business" aria-label="business loan">
												Business
											</LoanTypeButton>
										</ToggleButtonGroup>
									)}
								</Box>

								<Grid container spacing={{ xs: 2, md: 3 }}>
									<Grid item xs={12}>
										<Typography
											variant='subtitle1'
											sx={{ 
												mb: 1, 
												display: "flex", 
												alignItems: "center",
												fontSize: { xs: "0.95rem", md: "1rem" }
											}}>
											<CurrencyInr fontSize='small' sx={{ mr: 1 }} />
											Loan Amount
										</Typography>
										<StyledTextField
											fullWidth
											variant='outlined'
											type='number'
											value={loanAmount}
											onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
											InputProps={{
												startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
											}}
											inputProps={{
												min: loanLimits[loanType].min,
												max: loanLimits[loanType].max,
											}}
											sx={{ 
												"& .MuiInputBase-input": {
													fontSize: { xs: "0.95rem", md: "1rem" }
												}
											}}
										/>
										<Box sx={{ px: 1 }}>
											<StyledSlider
												value={loanAmount}
												onChange={(e, newValue) => setLoanAmount(newValue)}
												min={loanLimits[loanType].min}
												max={loanLimits[loanType].max}
												step={10000}
												sx={{ mt: 2 }}
											/>
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mt: 1,
												}}>
												<Typography variant='caption' color='text.secondary'>
													{formatCurrency(loanLimits[loanType].min)}
												</Typography>
												<Typography variant='caption' color='text.secondary'>
													{formatCurrency(loanLimits[loanType].max)}
												</Typography>
											</Box>
										</Box>
									</Grid>

									<Grid item xs={12}>
										<Typography
											variant='subtitle1'
											sx={{ 
												mb: 1, 
												display: "flex", 
												alignItems: "center",
												fontSize: { xs: "0.95rem", md: "1rem" }
											}}>
											<Bank fontSize='small' sx={{ mr: 1 }} />
											Interest Rate (% p.a.)
										</Typography>
										<StyledTextField
											fullWidth
											variant='outlined'
											type='number'
											value={interestRate}
											onChange={(e) =>
												setInterestRate(Number(e.target.value) || 0)
											}
											InputProps={{
												endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
											}}
											inputProps={{
												min: interestRateLimits[loanType].min,
												max: interestRateLimits[loanType].max,
												step: 0.1,
											}}
											sx={{ 
												"& .MuiInputBase-input": {
													fontSize: { xs: "0.95rem", md: "1rem" }
												}
											}}
										/>
										<Box sx={{ px: 1 }}>
											<StyledSlider
												value={interestRate}
												onChange={(e, newValue) => setInterestRate(newValue)}
												min={interestRateLimits[loanType].min}
												max={interestRateLimits[loanType].max}
												step={0.1}
												sx={{ mt: 2 }}
											/>
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mt: 1,
												}}>
												<Typography variant='caption' color='text.secondary'>
													{interestRateLimits[loanType].min}%
												</Typography>
												<Typography variant='caption' color='text.secondary'>
													{interestRateLimits[loanType].max}%
												</Typography>
											</Box>
										</Box>
									</Grid>

									<Grid item xs={12}>
										<Typography
											variant='subtitle1'
											sx={{ 
												mb: 1, 
												display: "flex", 
												alignItems: "center",
												fontSize: { xs: "0.95rem", md: "1rem" }
											}}>
											<CalendarMonth fontSize='small' sx={{ mr: 1 }} />
											Loan Tenure (Months)
										</Typography>
										<StyledTextField
											fullWidth
											variant='outlined'
											type='number'
											value={loanTenure}
											onChange={(e) => setLoanTenure(Number(e.target.value) || 0)}
											InputProps={{
												endAdornment: (
													<Typography sx={{ ml: 1 }}>Months</Typography>
												),
											}}
											inputProps={{
												min: tenureLimits[loanType].min,
												max: tenureLimits[loanType].max,
												step: 1,
											}}
											sx={{ 
												"& .MuiInputBase-input": {
													fontSize: { xs: "0.95rem", md: "1rem" }
												}
											}}
										/>
										<Box sx={{ px: 1 }}>
											<StyledSlider
												value={loanTenure}
												onChange={(e, newValue) => setLoanTenure(newValue)}
												min={tenureLimits[loanType].min}
												max={tenureLimits[loanType].max}
												step={1}
												sx={{ mt: 2 }}
											/>
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mt: 1,
												}}>
												<Typography variant='caption' color='text.secondary'>
													{tenureLimits[loanType].min} month
												</Typography>
												<Typography variant='caption' color='text.secondary'>
													{tenureLimits[loanType].max} month
												</Typography>
											</Box>
										</Box>
									</Grid>
								</Grid>
							</Box>
						</Grid>

						<Grid item xs={12} md={6}>
							<ResultCard elevation={3} sx={{ padding: { xs: 2, md: 3 } }}>
								<Box sx={{ mb: 3 }}>
									<Typography
										variant='h5'
										gutterBottom
										sx={{ 
											fontWeight: 600, 
											color: "#1b321d",
											fontSize: { xs: "1.25rem", md: "1.5rem" }
										}}>
										{loanTypeLabels[loanType]} EMI Details
									</Typography>
									<Typography 
										variant='body2' 
										color='text.secondary' 
										gutterBottom
										sx={{ 
											fontSize: { xs: "0.8rem", md: "0.875rem" },
											display: "flex",
											flexDirection: { xs: "column", sm: "row" },
											"& > span": {
												mr: { xs: 0, sm: 1 },
												mb: { xs: 0.5, sm: 0 }
											}
										}}>
										<span>Loan Amount: {formatCurrency(loanAmount)}</span> 
										<span>Interest: {interestRate}%</span> 
										<span>Tenure: {loanTenure} Months</span>
									</Typography>
								</Box>

								<Grid container spacing={{ xs: 2, md: 3 }}>
									<Grid item xs={12} sm={6}>
										<Paper
											elevation={0}
											sx={{
												p: { xs: 1.5, md: 2 },
												borderRadius: 2,
												border: "1px solid rgba(149,184,162,0.3)",
												backgroundColor: "rgba(149,184,162,0.05)",
											}}>
											<Typography
												variant='subtitle2'
												color='text.secondary'
												gutterBottom
												sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
												Monthly EMI
											</Typography>
											<Typography
												variant='h4'
												sx={{ 
													fontWeight: 700, 
													color: "#1b321d",
													fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" } 
												}}>
												{formatCurrency(Math.round(emi))}
											</Typography>
										</Paper>
									</Grid>

									<Grid item xs={12} sm={6}>
										<Paper
											elevation={0}
											sx={{
												p: { xs: 1.5, md: 2 },
												borderRadius: 2,
												border: "1px solid rgba(149,184,162,0.3)",
												backgroundColor: "rgba(149,184,162,0.05)",
											}}>
											<Typography
												variant='subtitle2'
												color='text.secondary'
												gutterBottom
												sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
												Total Interest
											</Typography>
											<Typography
												variant='h4'
												sx={{ 
													fontWeight: 700, 
													color: "#1b321d",
													fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" } 
												}}>
												{formatCurrency(Math.round(totalInterest))}
											</Typography>
										</Paper>
									</Grid>

									<Grid item xs={12}>
										<Paper
											elevation={0}
											sx={{
												p: { xs: 1.5, md: 2 },
												borderRadius: 2,
												border: "1px solid rgba(27,50,29,0.2)",
												backgroundColor: "rgba(27,50,29,0.05)",
											}}>
											<Typography
												variant='subtitle2'
												color='text.secondary'
												gutterBottom
												sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
												Total Payment (Principal + Interest)
											</Typography>
											<Typography
												variant='h4'
												sx={{ 
													fontWeight: 700, 
													color: "#1b321d",
													fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" } 
												}}>
												{formatCurrency(Math.round(totalPayment))}
											</Typography>
										</Paper>
									</Grid>

									<Grid item xs={12}>
										<Box sx={{ height: { xs: 220, sm: 250 } }}>
											<Chart
												options={chartOptions}
												series={chartSeries}
												type='donut'
												height='100%'
											/>
										</Box>
									</Grid>

									<Grid item xs={12}>
										<Accordion
											expanded={showAmortization}
											onChange={() => setShowAmortization(!showAmortization)}
											sx={{
												boxShadow: "none",
												border: "1px solid #e0e0e0",
												borderRadius: "8px",
												"&::before": {
													display: "none",
												},
												"&.Mui-expanded": {
													margin: 0,
												},
											}}>
											<AccordionSummary
												expandIcon={<ChevronDown />}
												sx={{
													borderRadius: "8px",
													padding: { xs: 1, md: 1.5 },
													"&.Mui-expanded": {
														borderBottomLeftRadius: 0,
														borderBottomRightRadius: 0,
													},
												}}>
													<Typography 
														variant='subtitle1' 
														sx={{ 
															fontWeight: 600,
															fontSize: { xs: "0.9rem", md: "1rem" }
														}}>
															View Monthly Payment Schedule
													</Typography>
											</AccordionSummary>
											<AccordionDetails sx={{ p: 0 }}>
												<TableContainer 
													sx={{ 
														maxHeight: { xs: 300, md: 400 },
														"& .MuiTableCell-root": {
															padding: { xs: "8px 6px", md: "16px" },
															fontSize: { xs: "0.75rem", md: "0.875rem" }
														}
													}} 
													component={Box}>
													<Table stickyHeader size='small'>
														<TableHead>
															<TableRow>
																<TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
																<TableCell sx={{ fontWeight: 600 }}>
																	Principal
																</TableCell>
																<TableCell sx={{ fontWeight: 600 }}>
																	Interest
																</TableCell>
																<TableCell sx={{ fontWeight: 600 }}>
																	Balance
																</TableCell>
															</TableRow>
														</TableHead>
														<TableBody>
															{amortizationSchedule.map((monthData) => (
																<TableRow key={monthData.month} hover>
																	<TableCell>{monthData.month}</TableCell>
																	<TableCell>
																		{formatCurrency(
																		Math.round(monthData.principalPayment)
																		)}
																	</TableCell>
																	<TableCell>
																		{formatCurrency(Math.round(monthData.interestPayment))}
																	</TableCell>
																	<TableCell>
																		{formatCurrency(Math.round(monthData.balance))}
																	</TableCell>
																</TableRow>
															))}
														</TableBody>
													</Table>
												</TableContainer>
												<Box sx={{ p: 2, textAlign: "center", display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
													<Button
														variant='outlined'
														startIcon={<DownloadBox />}
														onClick={downloadScheduleAsExcel}
														sx={{
															color: "#1b321d",
															borderColor: "#1b321d",
															fontSize: { xs: "0.8rem", md: "0.875rem" },
															"&:hover": {
																borderColor: "#1b321d",
																backgroundColor: "rgba(27,50,29,0.05)",
															},
														}}>
														Download Excel
													</Button>
													<Button
														variant='contained'
														startIcon={<PictureAsPdfIcon />}
														onClick={downloadScheduleAsPDF}
														sx={{
															backgroundColor: "#1b321d",
															color: "#ffffff",
															fontSize: { xs: "0.8rem", md: "0.875rem" },
															"&:hover": {
																backgroundColor: "#95b8a2",
																color: "#1b321d",
															},
														}}>
														Download PDF
													</Button>
												</Box>
											</AccordionDetails>
										</Accordion>
									</Grid>

									<Grid item xs={12}>
										<Box
											sx={{
												mt: 2,
												display: "flex",
												flexDirection: { xs: "column", sm: "row" },
												justifyContent: "space-between",
												alignItems: { xs: "flex-start", sm: "center" },
												gap: { xs: 2, sm: 0 }
											}}>
											<Typography 
												variant='body2' 
												color='text.secondary'
												sx={{ 
													fontSize: { xs: "0.75rem", md: "0.875rem" },
													maxWidth: { xs: "100%", sm: "60%" }
												}}>
												<Information
													fontSize='small'
													sx={{ verticalAlign: "middle", mr: 0.5 }}
												/>
												Interest rates and loan terms are subject to change based on
												market conditions.
											</Typography>
											<Button
												variant='contained'
												disableElevation
												sx={{
													backgroundColor: "#1b321d",
													fontSize: { xs: "0.85rem", md: "0.875rem" },
													width: { xs: "100%", sm: "auto" },
													"&:hover": {
														backgroundColor: "#2c4c38",
													},
												}}>
												Apply Now
											</Button>
										</Box>
									</Grid>
								</Grid>
							</ResultCard>
						</Grid>
					</Grid>
				</CardContent>
			</StyledCard>
		</CalculatorWrapper>
	);
};

export default EMICalculator;
