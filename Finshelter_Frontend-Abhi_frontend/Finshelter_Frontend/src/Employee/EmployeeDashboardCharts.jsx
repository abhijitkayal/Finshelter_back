import React, { useMemo } from "react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { Box, Paper, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

// Create styled components
const ChartContainer = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[3],
	backgroundColor: "#ffffff",
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	textAlign: "center",
	fontWeight: 600,
}));

const EmployeeDashboardCharts = ({ employeeInfo, metrics, status }) => {
	// Theme colors
	const colors = {
		primary: "#1b321d",
		secondary: "#ffffff",
		tertiary: "#000000",
		background: "#c6dbce",
		accent: "#95b8a2",
	};

	// Prepare data for customer distribution pie chart
	const customerDistributionData = useMemo(
		() => [
			{ name: "Active Customers", value: metrics?.activeCustomers || 0 },
			{
				name: "Inactive Customers",
				value: (metrics?.totalCustomers || 0) - (metrics?.activeCustomers || 0),
			},
		],
		[metrics]
	);

	// Prepare data for service completion statistics
	const serviceCompletionData = useMemo(() => {
		if (!metrics) return [];

		const completedServices = metrics.completedServices || 0;
		const totalServices = metrics.totalCustomers || 0; // Using total customers as a proxy for total services
		const pendingServices = totalServices - completedServices;

		return [
			{ category: "Completed", count: completedServices },
			{ category: "Pending", count: pendingServices > 0 ? pendingServices : 0 },
		];
	}, [metrics]);

	// Prepare monthly growth data
	// In a real implementation, this would come from the API with actual monthly data
	const monthlyCustomerData = useMemo(() => {
		if (!metrics) return [];

		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
		// Create synthetic historical data based on the current total
		let baseCustomers = Math.max(0, metrics.totalCustomers - 15);

		return months.map((month, index) => {
			// For demo purposes, create a growth pattern that ends with the current total
			if (index === months.length - 1) {
				return { month, customers: metrics.totalCustomers };
			}
			const customers = Math.round(
				baseCustomers +
					(index * (metrics.totalCustomers - baseCustomers)) /
						(months.length - 1)
			);
			return { month, customers };
		});
	}, [metrics]);

	if (!metrics) {
		return <div>Loading chart data...</div>;
	}

	return (
		<Box sx={{ p: 3 }}>
			<Grid container spacing={3}>
				{/* Customer Status Pie Chart */}
				<Grid item xs={12} md={6}>
					<ChartContainer>
						<ChartTitle variant='h6'>Customer Status Distribution</ChartTitle>
						<Box sx={{ height: 300 }}>
							<ResponsiveContainer>
								<PieChart>
									<Pie
										data={customerDistributionData}
										cx='50%'
										cy='50%'
										outerRadius={80}
										fill={colors.primary}
										dataKey='value'
										label={({ name, percent }) =>
											`${name} ${(percent * 100).toFixed(0)}%`
										}>
										{customerDistributionData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={[colors.primary, colors.accent][index]}
											/>
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</Box>
					</ChartContainer>
				</Grid>

				{/* Service Completion Bar Chart */}
				<Grid item xs={12} md={6}>
					<ChartContainer>
						<ChartTitle variant='h6'>Service Completion Status</ChartTitle>
						<Box sx={{ height: 300 }}>
							<ResponsiveContainer>
								<BarChart data={serviceCompletionData}>
									<CartesianGrid strokeDasharray='3 3' stroke={colors.accent} />
									<XAxis dataKey='category' stroke={colors.tertiary} />
									<YAxis stroke={colors.tertiary} />
									<Tooltip
										contentStyle={{
											backgroundColor: colors.secondary,
											borderColor: colors.accent,
										}}
									/>
									<Bar dataKey='count' fill={colors.primary} />
								</BarChart>
							</ResponsiveContainer>
						</Box>
					</ChartContainer>
				</Grid>

				{/* Customer Growth Line Chart */}
				<Grid item xs={12}>
					<ChartContainer>
						<ChartTitle variant='h6'>Customer Growth Trend</ChartTitle>
						<Box sx={{ height: 300 }}>
							<ResponsiveContainer>
								<LineChart data={monthlyCustomerData}>
									<CartesianGrid strokeDasharray='3 3' stroke={colors.accent} />
									<XAxis dataKey='month' stroke={colors.tertiary} />
									<YAxis stroke={colors.tertiary} />
									<Tooltip
										contentStyle={{
											backgroundColor: colors.secondary,
											borderColor: colors.accent,
										}}
									/>
									<Line
										type='monotone'
										dataKey='customers'
										stroke={colors.primary}
										strokeWidth={2}
										dot={{ fill: colors.primary }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</Box>
					</ChartContainer>
				</Grid>
			</Grid>
		</Box>
	);
};

export default EmployeeDashboardCharts;
