import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Divider,
	FormControl,
	FormControlLabel,
	Grid,
	Radio,
	RadioGroup,
	Slider,
	TextField,
	Typography,
	Paper,
	Switch,
	useTheme,
	useMediaQuery,
	Tooltip,
} from "@mui/material";
import {
	Calculator,
	InformationVariant,
	ChevronDown,
	ChevronUp,
	Percent,
	CurrencyInr,
} from "mdi-material-ui";
import { styled } from "@mui/material/styles";
import Chart from "react-apexcharts";
import CalculatorWrapper from "./CalculatorWrapper";
import CalculateIcon from "@mui/icons-material/Calculate";

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
	borderRadius: "16px",
	overflow: "hidden",
	boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
	background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
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
	background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
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

const TaxInfoCard = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(2),
	marginTop: theme.spacing(2),
	borderRadius: "8px",
	backgroundColor: "rgba(149,184,162,0.08)",
	border: "1px solid rgba(149,184,162,0.2)",
}));

const TaxCalculator = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	// States
	const [income, setIncome] = useState(1000000);
	const [deductions, setDeductions] = useState(150000);
	const [regime, setRegime] = useState("new");
	const [showDeductionDetails, setShowDeductionDetails] = useState(false);
	const [section80C, setSection80C] = useState(50000);
	const [section80D, setSection80D] = useState(25000);
	const [housingLoanInterest, setHousingLoanInterest] = useState(75000);
	const [taxDetails, setTaxDetails] = useState({
		oldRegime: { tax: 0, slabBreakup: [] },
		newRegime: { tax: 0, slabBreakup: [] },
	});

	// Tax slab rates
	const oldRegimeSlabs = [
		{ limit: 250000, rate: 0, maxTax: 0 },
		{ limit: 500000, rate: 5, maxTax: 12500 },
		{ limit: 1000000, rate: 20, maxTax: 100000 },
		{ limit: Infinity, rate: 30, maxTax: Infinity },
	];

	const newRegimeSlabs = [
		{ limit: 300000, rate: 0, maxTax: 0 },
		{ limit: 600000, rate: 5, maxTax: 15000 },
		{ limit: 900000, rate: 10, maxTax: 45000 },
		{ limit: 1200000, rate: 15, maxTax: 90000 },
		{ limit: 1500000, rate: 20, maxTax: 150000 },
		{ limit: Infinity, rate: 30, maxTax: Infinity },
	];

	// Calculate taxes
	useEffect(() => {
		// Calculate deductions sum
		const totalDeductions =
			regime === "old"
				? Math.min(section80C + section80D + housingLoanInterest, 250000)
				: 0;

		// Calculate taxable income
		const taxableIncomeOld = Math.max(income - totalDeductions, 0);
		const taxableIncomeNew = income;

		// Calculate tax for old regime
		const oldRegimeTax = calculateTax(taxableIncomeOld, oldRegimeSlabs);

		// Calculate tax for new regime
		const newRegimeTax = calculateTax(taxableIncomeNew, newRegimeSlabs);

		setTaxDetails({
			oldRegime: oldRegimeTax,
			newRegime: newRegimeTax,
		});
	}, [income, section80C, section80D, housingLoanInterest, regime]);

	// Calculate tax based on income and slabs
	const calculateTax = (taxableIncome, slabs) => {
		let remainingIncome = taxableIncome;
		let totalTax = 0;
		const slabBreakup = [];

		let previousLimit = 0;

		for (const slab of slabs) {
			const slabAmount = Math.min(remainingIncome, slab.limit - previousLimit);
			const taxForSlab = (slabAmount * slab.rate) / 100;

			if (slabAmount > 0) {
				slabBreakup.push({
					from: previousLimit,
					to: previousLimit + slabAmount,
					rate: slab.rate,
					tax: taxForSlab,
				});

				totalTax += taxForSlab;
				remainingIncome -= slabAmount;
			}

			if (remainingIncome <= 0) break;
			previousLimit = slab.limit;
		}

		// Add cess (4%)
		const cess = totalTax * 0.04;
		const totalWithCess = totalTax + cess;

		slabBreakup.push({
			from: "Cess",
			to: "4% of total tax",
			rate: 4,
			tax: cess,
		});

		return {
			tax: totalWithCess,
			taxWithoutCess: totalTax,
			cess: cess,
			slabBreakup: slabBreakup,
		};
	};

	// Chart options
	const chartOptions = {
		labels: ["Tax Amount", "Take Home"],
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
							formatter: (val) => `₹${val.toLocaleString("en-IN")}`,
						},
						total: {
							show: true,
							label: "Total Income",
							formatter: () => `₹${income.toLocaleString("en-IN")}`,
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
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						height: 250,
					},
				},
			},
		],
		tooltip: {
			y: {
				formatter: (val) => `₹${val.toLocaleString("en-IN")}`,
			},
		},
	};

	const selectedTax =
		regime === "new" ? taxDetails.newRegime : taxDetails.oldRegime;
	const chartSeries = [
		Math.round(selectedTax.tax || 0),
		Math.round(income - (selectedTax.tax || 0)),
	];

	// Income tax formatter
	const formatAmount = (value) => {
		if (!value) return "₹0";
		return `₹${value.toLocaleString("en-IN")}`;
	};

	return (
		<CalculatorWrapper
			title="Income Tax Calculator"
			description="Compare your tax liability under the old and new tax regimes. Plan your taxes better with our comprehensive tax calculator."
			backgroundIcon={<CalculateIcon sx={{ fontSize: 180 }} />}
		>
			<StyledCard>
				<CardContent sx={{ padding: { xs: 2, md: 4 } }}>
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Box sx={{ mb: 4 }}>
								<Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: "#1b321d" }}>
									Income Details
								</Typography>
								<Divider sx={{ mb: 3 }} />

								<Box sx={{ mb: 4 }}>
									<Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
										Select Tax Regime
									</Typography>
									<RadioGroup
										row
										name="regime"
										value={regime}
										onChange={(e) => setRegime(e.target.value)}
										sx={{ mb: 1 }}
									>
										<FormControlLabel
											value="new"
											control={<Radio sx={{ color: "#1b321d", '&.Mui-checked': { color: "#1b321d" } }} />}
											label="New Regime"
										/>
										<FormControlLabel
											value="old"
											control={<Radio sx={{ color: "#1b321d", '&.Mui-checked': { color: "#1b321d" } }} />}
											label="Old Regime"
										/>
									</RadioGroup>
									<Typography variant="body2" color="text.secondary">
										{regime === "new"
											? "New regime has lower tax rates but no deductions."
											: "Old regime has higher tax rates but allows various deductions."}
									</Typography>
								</Box>

								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Typography
											variant='subtitle1'
											sx={{ mb: 1, display: "flex", alignItems: "center" }}>
											<CurrencyInr fontSize='small' sx={{ mr: 1 }} />
											Annual Income
										</Typography>
										<StyledTextField
											fullWidth
											variant='outlined'
											type='number'
											value={income}
											onChange={(e) => setIncome(Number(e.target.value) || 0)}
											InputProps={{
												startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
											}}
										/>
										<Slider
											value={income}
											onChange={(e, newValue) => setIncome(newValue)}
											min={0}
											max={5000000}
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
												₹0
											</Typography>
											<Typography variant='caption' color='text.secondary'>
												₹50L
											</Typography>
										</Box>
									</Grid>

									<Grid item xs={12}>
										<Typography
											variant='subtitle1'
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
											}}>
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<Percent fontSize='small' sx={{ mr: 1 }} />
												Deductions
											</Box>
											<Button
												size='small'
												startIcon={
													showDeductionDetails ? <ChevronUp /> : <ChevronDown />
												}
												onClick={() =>
													setShowDeductionDetails(!showDeductionDetails)
												}
												sx={{ color: "#1b321d" }}>
												{showDeductionDetails ? "Hide Details" : "Show Details"}
											</Button>
										</Typography>

										{showDeductionDetails ? (
											<Grid container spacing={2} sx={{ mt: 1 }}>
												<Grid item xs={12}>
													<StyledTextField
														fullWidth
														label='Section 80C (EPF, ELSS, LIC, etc.)'
														variant='outlined'
														type='number'
														value={section80C}
														onChange={(e) =>
															setSection80C(Number(e.target.value) || 0)
														}
														InputProps={{
															startAdornment: (
																<Typography sx={{ mr: 1 }}>₹</Typography>
															),
														}}
														disabled={regime === "new"}
													/>
													<Tooltip
														title='Maximum deduction allowed: ₹1,50,000'
														placement='top'>
														<Box
															sx={{
																display: "flex",
																justifyContent: "flex-end",
																mt: 0.5,
															}}>
															<Typography
																variant='caption'
																color='text.secondary'
																sx={{ display: "flex", alignItems: "center" }}>
																<InformationVariant
																	fontSize='small'
																	sx={{ mr: 0.5, fontSize: 16 }}
																/>
																Max: ₹1,50,000
															</Typography>
														</Box>
													</Tooltip>
												</Grid>
												<Grid item xs={12}>
													<StyledTextField
														fullWidth
														label='Section 80D (Health Insurance)'
														variant='outlined'
														type='number'
														value={section80D}
														onChange={(e) =>
															setSection80D(Number(e.target.value) || 0)
														}
														InputProps={{
															startAdornment: (
																<Typography sx={{ mr: 1 }}>₹</Typography>
															),
														}}
														disabled={regime === "new"}
													/>
													<Tooltip
														title='Maximum deduction allowed: ₹25,000 (₹50,000 for senior citizens)'
														placement='top'>
														<Box
															sx={{
																display: "flex",
																justifyContent: "flex-end",
																mt: 0.5,
															}}>
															<Typography
																variant='caption'
																color='text.secondary'
																sx={{ display: "flex", alignItems: "center" }}>
																<InformationVariant
																	fontSize='small'
																	sx={{ mr: 0.5, fontSize: 16 }}
																/>
																Max: ₹25,000-₹50,000
															</Typography>
														</Box>
													</Tooltip>
												</Grid>
												<Grid item xs={12}>
													<StyledTextField
														fullWidth
														label='Housing Loan Interest'
														variant='outlined'
														type='number'
														value={housingLoanInterest}
														onChange={(e) =>
															setHousingLoanInterest(Number(e.target.value) || 0)
														}
														InputProps={{
															startAdornment: (
																<Typography sx={{ mr: 1 }}>₹</Typography>
															),
														}}
														disabled={regime === "new"}
													/>
													<Tooltip
														title='Maximum deduction allowed: ₹2,00,000'
														placement='top'>
														<Box
															sx={{
																display: "flex",
																justifyContent: "flex-end",
																mt: 0.5,
															}}>
															<Typography
																variant='caption'
																color='text.secondary'
																sx={{ display: "flex", alignItems: "center" }}>
																<InformationVariant
																	fontSize='small'
																	sx={{ mr: 0.5, fontSize: 16 }}
																/>
																Max: ₹2,00,000
															</Typography>
														</Box>
													</Tooltip>
												</Grid>
											</Grid>
										) : (
											<StyledTextField
												fullWidth
												label='Total Deductions (80C, 80D, etc.)'
												variant='outlined'
												type='number'
												value={section80C + section80D + housingLoanInterest}
												disabled
												InputProps={{
													startAdornment: (
														<Typography sx={{ mr: 1 }}>₹</Typography>
													),
												}}
											/>
										)}
									</Grid>
								</Grid>
							</Box>
						</Grid>

						<Grid item xs={12} md={6}>
							<ResultCard elevation={3}>
								<Box sx={{ mb: 2 }}>
									<Typography
										variant='h5'
										gutterBottom
										sx={{ fontWeight: 600, color: "#1b321d" }}>
										Your Tax Calculation Summary
									</Typography>
									<Typography variant='body2' color='text.secondary' gutterBottom>
										Based on {regime === "new" ? "New" : "Old"} Tax Regime
									</Typography>
								</Box>

								<Grid container spacing={2}>
									<Grid item xs={12} md={7}>
										<Box>
											<Grid container spacing={2}>
												<Grid item xs={6}>
													<Typography variant='subtitle2' color='text.secondary'>
														Annual Income
													</Typography>
													<Typography variant='h6' sx={{ fontWeight: 600 }}>
														{formatAmount(income)}
													</Typography>
												</Grid>
												<Grid item xs={6}>
													<Typography variant='subtitle2' color='text.secondary'>
														Taxable Income
													</Typography>
													<Typography variant='h6' sx={{ fontWeight: 600 }}>
														{formatAmount(
															regime === "old"
																? Math.max(
																		income -
																			(section80C +
																				section80D +
																				housingLoanInterest),
																	0
																  )
																: income
														)}
													</Typography>
												</Grid>
												<Grid item xs={12}>
													<Divider sx={{ my: 2 }} />
												</Grid>
												<Grid item xs={6}>
													<Typography variant='subtitle2' color='text.secondary'>
														Income Tax
													</Typography>
													<Typography variant='h6' sx={{ fontWeight: 600 }}>
														{formatAmount(selectedTax.taxWithoutCess || 0)}
													</Typography>
												</Grid>
												<Grid item xs={6}>
													<Typography variant='subtitle2' color='text.secondary'>
														Cess (4%)
													</Typography>
													<Typography variant='h6' sx={{ fontWeight: 600 }}>
														{formatAmount(selectedTax.cess || 0)}
													</Typography>
												</Grid>
											</Grid>

											<Box
												sx={{
													mt: 3,
													p: 2,
													borderRadius: 2,
													backgroundColor: "rgba(27,50,29,0.08)",
													border: "1px dashed rgba(27,50,29,0.2)",
												}}>
												<Typography
													variant='subtitle1'
													sx={{ fontWeight: 500, mb: 1 }}>
													Total Tax Liability
												</Typography>
												<Typography
													variant='h4'
													sx={{ fontWeight: 700, color: "#1b321d" }}>
													{formatAmount(selectedTax.tax || 0)}
												</Typography>
											</Box>
										</Box>
									</Grid>

									<Grid item xs={12} md={5}>
										<Box sx={{ height: 200 }}>
											<Chart
												options={chartOptions}
												series={chartSeries}
												type='donut'
												height='100%'
											/>
										</Box>
									</Grid>

									<Grid item xs={12}>
										<Divider sx={{ my: 2 }} />
										<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
											Tax Breakup
										</Typography>

										<Box sx={{ maxHeight: 200, overflowY: "auto", pr: 1 }}>
											{selectedTax.slabBreakup &&
												selectedTax.slabBreakup.map((slab, index) => (
													<Box
														key={index}
														sx={{
															display: "flex",
															justifyContent: "space-between",
															py: 1,
															borderBottom:
																index < selectedTax.slabBreakup.length - 1
																	? "1px solid rgba(0,0,0,0.07)"
																	: "none",
														}}>
														<Typography variant='body2'>
															{typeof slab.from === "string"
																? slab.from
																: `${formatAmount(slab.from)} to ${formatAmount(
																		slab.to
																  )}`}
															{typeof slab.rate === "number" &&
																slab.from !== "Cess" && (
																	<Typography
																		component='span'
																		variant='caption'
																		color='text.secondary'
																		sx={{ ml: 1 }}>
																		@{slab.rate}%
																	</Typography>
																)}
														</Typography>
														<Typography variant='body2' sx={{ fontWeight: 500 }}>
															{formatAmount(slab.tax)}
														</Typography>
													</Box>
												))}
										</Box>
									</Grid>

									<Grid item xs={12}>
										<Typography
											variant='body2'
											color='text.secondary'
											sx={{ mt: 2 }}>
											{regime === "old" ? (
												<>
													Your tax calculated using the Old Tax Regime (with
													deductions).{" "}
												</>
											) : (
												<>
													Your tax calculated using the New Tax Regime (simplified,
													no deductions).{" "}
												</>
											)}
											{taxDetails.oldRegime.tax < taxDetails.newRegime.tax ? (
												<Box
													component='span'
													sx={{ color: "#1b321d", fontWeight: 500 }}>
													Old Regime is better for you by{" "}
													{formatAmount(
														taxDetails.newRegime.tax - taxDetails.oldRegime.tax
													)}
													.
												</Box>
											) : taxDetails.newRegime.tax < taxDetails.oldRegime.tax ? (
												<Box
													component='span'
													sx={{ color: "#1b321d", fontWeight: 500 }}>
													New Regime is better for you by{" "}
													{formatAmount(
														taxDetails.oldRegime.tax - taxDetails.newRegime.tax
													)}
													.
												</Box>
											) : (
												<Box
													component='span'
													sx={{ color: "#1b321d", fontWeight: 500 }}>
													Both regimes result in the same tax amount.
												</Box>
											)}
										</Typography>
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

export default TaxCalculator;
