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
  Tab,
  Tabs,
  TextField,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CurrencyInr,
  ChartLine,
  CalendarMonthOutline,
  PercentOutline,
  ChartTimelineVariant,
  Information,
} from "mdi-material-ui";
import { styled } from "@mui/material/styles";
import Chart from "react-apexcharts";
import CalculatorWrapper from "./CalculatorWrapper";
import SavingsIcon from "@mui/icons-material/Savings";

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
    background: "radial-gradient(circle, rgba(149,184,162,0.1) 0%, rgba(255,255,255,0) 70%)",
    borderRadius: "50%",
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#1b321d',
    height: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: 'rgba(0, 0, 0, 0.6)',
    '&.Mui-selected': {
      color: '#1b321d',
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

const StyledRadio = styled(Radio)(({ theme }) => ({
  '&.Mui-checked': {
    color: '#1b321d',
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: '#1b321d',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    backgroundImage: 'linear-gradient(90deg, #1b321d 0%, #95b8a2 100%)',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid #1b321d',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(27, 50, 29, 0.16)',
    },
    '&:before': {
      display: 'none',
    },
  },
}));

const InvestmentCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // States
  const [calculatorType, setCalculatorType] = useState(0); // 0: Lump Sum, 1: SIP
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [sipAmount, setSipAmount] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState("annually");
  const [investmentResults, setInvestmentResults] = useState({
    futureValue: 0,
    totalInvestment: 0,
    totalReturns: 0,
    yearlyBreakdown: []
  });
  
  // Calculate investment returns
  useEffect(() => {
    if (calculatorType === 0) { // Lump Sum
      calculateLumpSumReturns();
    } else { // SIP
      calculateSIPReturns();
    }
  }, [investmentAmount, sipAmount, returnRate, timePeriod, compoundFrequency, calculatorType]);
  
  // Calculate lump sum returns
  const calculateLumpSumReturns = () => {
    let compoundMultiplier = 1;
    if (compoundFrequency === "monthly") compoundMultiplier = 12;
    if (compoundFrequency === "quarterly") compoundMultiplier = 4;
    if (compoundFrequency === "semi-annually") compoundMultiplier = 2;
    
    const ratePerPeriod = returnRate / (100 * compoundMultiplier);
    const totalPeriods = timePeriod * compoundMultiplier;
    
    const futureValue = investmentAmount * Math.pow(1 + ratePerPeriod, totalPeriods);
    const totalInvestment = investmentAmount;
    const totalReturns = futureValue - totalInvestment;
    
    // Generate yearly breakdown
    const yearlyBreakdown = [];
    for (let year = 1; year <= timePeriod; year++) {
      const periodsCompleted = year * compoundMultiplier;
      const valueAtYearEnd = investmentAmount * Math.pow(1 + ratePerPeriod, periodsCompleted);
      yearlyBreakdown.push({
        year,
        investmentValue: valueAtYearEnd,
        investmentAmount: totalInvestment,
        returns: valueAtYearEnd - totalInvestment
      });
    }
    
    setInvestmentResults({
      futureValue,
      totalInvestment,
      totalReturns,
      yearlyBreakdown
    });
  };
  
  // Calculate SIP returns
  const calculateSIPReturns = () => {
    const monthlyRate = returnRate / (12 * 100);
    const months = timePeriod * 12;
    
    // Future value formula for SIP: P * ((1 + r)^n - 1) / r * (1 + r)
    const futureValue = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = sipAmount * months;
    const totalReturns = futureValue - totalInvestment;
    
    // Generate yearly breakdown
    const yearlyBreakdown = [];
    for (let year = 1; year <= timePeriod; year++) {
      const monthsCompleted = year * 12;
      const investedAmount = sipAmount * monthsCompleted;
      const valueAtYearEnd = sipAmount * ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * (1 + monthlyRate);
      
      yearlyBreakdown.push({
        year,
        investmentValue: valueAtYearEnd,
        investmentAmount: investedAmount,
        returns: valueAtYearEnd - investedAmount
      });
    }
    
    setInvestmentResults({
      futureValue,
      totalInvestment,
      totalReturns,
      yearlyBreakdown
    });
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format large numbers in a readable format (e.g., 1.5L, 10Cr)
  const formatReadable = (value) => {
    if (value >= 10000000) { // ≥ 1Cr
      return `${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) { // ≥ 1L
      return `${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) { // ≥ 1K
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(0);
  };
  
  // Chart options for growth trajectory
  const chartOptions = {
    chart: {
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#1b321d', '#95b8a2'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [3, 3]
    },
    title: {
      text: 'Investment Growth Trajectory',
      align: 'left',
      style: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        color: '#333'
      }
    },
    grid: {
      borderColor: '#e0e0e0',
      row: {
        opacity: 0.5
      }
    },
    markers: {
      size: 4
    },
    xaxis: {
      categories: investmentResults.yearlyBreakdown.map(item => `Year ${item.year}`),
      title: {
        text: 'Investment Timeline'
      }
    },
    yaxis: {
      title: {
        text: 'Value (₹)'
      },
      labels: {
        formatter: (value) => formatReadable(value)
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value)
      }
    }
  };
  
  const chartSeries = [
    {
      name: "Investment Value",
      data: investmentResults.yearlyBreakdown.map(item => Math.round(item.investmentValue))
    },
    {
      name: "Amount Invested",
      data: investmentResults.yearlyBreakdown.map(item => Math.round(item.investmentAmount))
    }
  ];
  
  // Donut chart options
  const donutOptions = {
    labels: ['Principal Invested', 'Estimated Returns'],
    colors: ['#1b321d', '#95b8a2'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
              formatter: (val) => formatCurrency(Math.round(val)),
            },
            total: {
              show: true,
              label: 'Total Value',
              formatter: () => formatCurrency(Math.round(investmentResults.futureValue)),
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      fontFamily: 'Poppins, sans-serif'
    },
  };
  
  const donutSeries = [
    Math.round(investmentResults.totalInvestment),
    Math.round(investmentResults.totalReturns)
  ];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCalculatorType(newValue);
  };
  
  return (
    <CalculatorWrapper
      title="Investment Calculator"
      description="Plan your investments better with our comprehensive investment calculator. Calculate lump sum and SIP returns with customizable parameters."
      backgroundIcon={<SavingsIcon sx={{ fontSize: 180 }} />}
    >
      <StyledCard>
        <CardContent sx={{ padding: { xs: 2, md: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <StyledTabs
              value={calculatorType}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="investment calculator tabs"
            >
              <Tab label="Lump Sum Investment" />
              <Tab label="SIP / Recurring Investment" />
            </StyledTabs>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: "#1b321d" }}>
                  {calculatorType === 0 ? "Lump Sum" : "SIP"} Investment Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Form fields */}
                {calculatorType === 0 ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography sx={{ mb: 1, fontWeight: 500, display: "flex", alignItems: "center" }}>
                        <CurrencyInr fontSize="small" sx={{ mr: 1 }} />
                        Investment Amount
                      </Typography>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                        }}
                      />
                      <Box sx={{ px: 1 }}>
                        <StyledSlider
                          value={investmentAmount}
                          onChange={(e, newValue) => setInvestmentAmount(newValue)}
                          min={1000}
                          max={10000000}
                          step={1000}
                          sx={{ mt: 2 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">₹1,000</Typography>
                          <Typography variant="caption" color="text.secondary">₹1 Cr</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                        <PercentOutline fontSize="small" sx={{ mr: 1 }} />
                        Expected Annual Returns (%)
                      </Typography>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={returnRate}
                        onChange={(e) => setReturnRate(Number(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                        }}
                        inputProps={{
                          min: 1,
                          max: 30,
                          step: 0.1
                        }}
                      />
                      <StyledSlider
                        value={returnRate}
                        onChange={(e, newValue) => setReturnRate(newValue)}
                        min={1}
                        max={30}
                        step={0.5}
                        sx={{ mt: 2 }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">1%</Typography>
                        <Typography variant="caption" color="text.secondary">30%</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                        <CalendarMonthOutline fontSize="small" sx={{ mr: 1 }} />
                        Time Period (Years)
                      </Typography>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(Number(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1 }}>Years</Typography>,
                        }}
                        inputProps={{
                          min: 1,
                          max: 40,
                          step: 1
                        }}
                      />
                      <StyledSlider
                        value={timePeriod}
                        onChange={(e, newValue) => setTimePeriod(newValue)}
                        min={1}
                        max={40}
                        step={1}
                        sx={{ mt: 2 }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">1 yr</Typography>
                        <Typography variant="caption" color="text.secondary">40 yrs</Typography>
                      </Box>
                    </Grid>

                    {calculatorType === 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                          <ChartTimelineVariant fontSize="small" sx={{ mr: 1 }} />
                          Compounding Frequency
                        </Typography>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            value={compoundFrequency}
                            onChange={(e) => setCompoundFrequency(e.target.value)}
                          >
                            <FormControlLabel 
                              value="annually" 
                              control={<StyledRadio />} 
                              label="Annually" 
                            />
                            <FormControlLabel 
                              value="semi-annually" 
                              control={<StyledRadio />} 
                              label="Semi-Annually" 
                            />
                            <FormControlLabel 
                              value="quarterly" 
                              control={<StyledRadio />} 
                              label="Quarterly" 
                            />
                            <FormControlLabel 
                              value="monthly" 
                              control={<StyledRadio />} 
                              label="Monthly" 
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography sx={{ mb: 1, fontWeight: 500, display: "flex", alignItems: "center" }}>
                        <CurrencyInr fontSize="small" sx={{ mr: 1 }} />
                        Monthly SIP Amount
                      </Typography>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={sipAmount}
                        onChange={(e) => setSipAmount(Number(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                        }}
                      />
                      <Box sx={{ px: 1 }}>
                        <StyledSlider
                          value={sipAmount}
                          onChange={(e, newValue) => setSipAmount(newValue)}
                          min={500}
                          max={500000}
                          step={500}
                          sx={{ mt: 2 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">₹500</Typography>
                          <Typography variant="caption" color="text.secondary">₹5 Lac</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                        <PercentOutline fontSize="small" sx={{ mr: 1 }} />
                        Expected Annual Returns (%)
                      </Typography>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={returnRate}
                        onChange={(e) => setReturnRate(Number(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                        }}
                        inputProps={{
                          min: 1,
                          max: 30,
                          step: 0.1
                        }}
                      />
                      <StyledSlider
                        value={returnRate}
                        onChange={(e, newValue) => setReturnRate(newValue)}
                        min={1}
                        max={30}
                        step={0.5}
                        sx={{ mt: 2 }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">1%</Typography>
                        <Typography variant="caption" color="text.secondary">30%</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                        <CalendarMonthOutline fontSize="small" sx={{ mr: 1 }} />
                        Time Period (Years)
                      </Typography>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(Number(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1 }}>Years</Typography>,
                        }}
                        inputProps={{
                          min: 1,
                          max: 40,
                          step: 1
                        }}
                      />
                      <StyledSlider
                        value={timePeriod}
                        onChange={(e, newValue) => setTimePeriod(newValue)}
                        min={1}
                        max={40}
                        step={1}
                        sx={{ mt: 2 }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">1 yr</Typography>
                        <Typography variant="caption" color="text.secondary">40 yrs</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <ResultCard elevation={3}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: "#1b321d" }}>
                    Your Investment Growth Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {calculatorType === 0 
                      ? `₹${investmentAmount.toLocaleString()} invested for ${timePeriod} years at ${returnRate}% return`
                      : `₹${sipAmount.toLocaleString()} invested monthly for ${timePeriod} years at ${returnRate}% return`
                    }
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(27,50,29,0.05)",
                        border: "1px solid rgba(27,50,29,0.2)",
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Estimated Future Value
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: "#1b321d" }}>
                        {formatCurrency(Math.round(investmentResults.futureValue))}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Total Amount Invested
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatCurrency(Math.round(investmentResults.totalInvestment))}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Estimated Returns
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1b321d" }}>
                          {formatCurrency(Math.round(investmentResults.totalReturns))}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: 250 }}>
                      <Chart
                        options={donutOptions}
                        series={donutSeries}
                        type="donut"
                        height="100%"
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "rgba(149,184,162,0.1)" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Financial Growth Snapshot
                      </Typography>
                      
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Wealth Gain:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {(investmentResults.totalReturns / investmentResults.totalInvestment * 100).toFixed(2)}%
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Annual Growth:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {returnRate}%
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            {calculatorType === 0 ? "Final Multiplier:" : "SIP Multiplier:"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {(investmentResults.futureValue / investmentResults.totalInvestment).toFixed(2)}x
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Investment Period:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {timePeriod} years
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ height: 300 }}>
                      <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="line"
                        height="100%"
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Information fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {calculatorType === 0 
                          ? "Power of compounding: The longer you stay invested, the more your money grows."
                          : "Regular investing through SIP helps reduce impact of market volatility through rupee cost averaging."
                        }
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        disableElevation
                        sx={{
                          backgroundColor: "#1b321d",
                          "&:hover": {
                            backgroundColor: "#2c4c38",
                          },
                        }}
                      >
                        Start Investing
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

export default InvestmentCalculator; 