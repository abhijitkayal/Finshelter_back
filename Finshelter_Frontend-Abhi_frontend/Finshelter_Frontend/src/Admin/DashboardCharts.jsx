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

const DashboardCharts = ({
	servicesCount,
	usersCount,

	employeesCount,
	customersCount,
	services,
	users,
	userGrowthData,
}) => {
	// Theme colors
	const colors = {
		primary: "#1b321d",
		secondary: "#ffffff",
		tertiary: "#000000",
		background: "#c6dbce",
		accent: "#95b8a2",
	};

	// Prepare data for user distribution pie chart
	const userDistributionData = [
		{ name: "Employees", value: employeesCount },
		{ name: "Customers", value: customersCount },
	];

	// Prepare data for services by category
	const servicesByCategory = useMemo(() => {
		const categories = {};
		services.forEach((service) => {
			categories[service.category] = (categories[service.category] || 0) + 1;
		});
		return Object.entries(categories).map(([category, count]) => ({
			category,
			count,
		}));
	}, [services]);

	// Prepare monthly user growth data - use the dynamic data passed in props
	const monthlyGrowthData =
		userGrowthData ||
		useMemo(() => {
			const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
			let currentUsers = usersCount - 20;

			return months.map((month) => ({
				month,
				users: (currentUsers += Math.floor(Math.random() * 8) + 2),
			}));
		}, [usersCount]);

	return (
		<Box sx={{ p: 3 }}>
			<Grid container spacing={3}>
				{/* User Distribution Pie Chart */}
				<Grid item xs={12} md={6}>
					<ChartContainer>
						<ChartTitle variant='h6'>User Distribution</ChartTitle>
						<Box sx={{ height: 300 }}>
							<ResponsiveContainer>
								<PieChart>
									<Pie
										data={userDistributionData}
										cx='50%'
										cy='50%'
										outerRadius={80}
										fill={colors.primary}
										dataKey='value'
										label={({ name, percent }) =>
											`${name} ${(percent * 100).toFixed(0)}%`
										}>
										{userDistributionData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={
													[colors.primary, colors.accent, colors.background][
														index
													]
												}
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

				{/* Services by Category Bar Chart */}
				<Grid item xs={12} md={6}>
					<ChartContainer>
						<ChartTitle variant='h6'>Services by Category</ChartTitle>
						<Box sx={{ height: 300 }}>
							<ResponsiveContainer>
								<BarChart data={servicesByCategory}>
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

				{/* User Growth Line Chart */}
				<Grid item xs={12}>
					<ChartContainer>
						<ChartTitle variant='h6'>User Growth Trend</ChartTitle>
						<Box sx={{ height: 300 }}>
							<ResponsiveContainer>
								<LineChart data={monthlyGrowthData}>
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
										dataKey='users'
										stroke={colors.primary}
										strokeWidth={2}
										dot={{ fill: colors.primary }}
										name='Total Users'
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

export default DashboardCharts;
