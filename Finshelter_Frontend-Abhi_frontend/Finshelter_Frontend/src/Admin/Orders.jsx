import React from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [services, setServices] = useState([]);

	// Filter states
	const [searchTerm, setSearchTerm] = useState("");
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [filterOption, setFilterOption] = useState("newest");

	useEffect(() => {
		const fetchServicesAndOrders = async () => {
			try {
				setLoading(true);
				setError(null);
				const token = localStorage.getItem("adminToken");
				
				// Fetch services to get processing days
				const servicesResponse = await axios.get(
					"http://localhost:8000/api/admin/services",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setServices(servicesResponse.data.services || []);
				console.log("Fetched services:", servicesResponse.data);
				
				// Fetch orders
				const response = await axios.get(
					"http://localhost:8000/api/admin/orders",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				console.log("Received orders:", response.data);
				
				// Ensure orders is always an array
				const ordersData = Array.isArray(response.data.orders) 
					? response.data.orders 
					: (response.data.orders ? [response.data.orders] : []);
				
				console.log("Setting orders with data:", ordersData);
				setOrders(ordersData);
			
			// Debug: Check rating values
			if (ordersData && ordersData.length > 0) {
				console.log("First order rating debug:", {
					rating: ordersData[0]["Rating"],
					ratingType: typeof ordersData[0]["Rating"],
					rawFeedback: ordersData[0]["_rawFeedback"],
					feedbackRaw: ordersData[0]["Feedback Raw"]
				});
			}
				// const serviceIds = ordersData.map(order => order["Service ID"] || order.serviceId);
				// console.log("Service IDs from orders:", serviceIds);
				// console.log("Unique Service IDs:", [...new Set(serviceIds)]);
				// console.log("order",ordersData);
			} catch (error) {
				console.error("Error fetching orders:", error);
				console.error("Error details:", error.response?.data || error.message);
				setError(error.response?.data?.message || error.message || "Failed to fetch orders");
			} finally {
				setLoading(false);
			}
		};

		fetchServicesAndOrders();
	}, [setLoading]);

	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	const formatCurrency = (amount) => {
		if (!amount) return "₹0";
		return `₹${Number(amount).toLocaleString("en-IN")}`;
	};

	// Helper function to get processing days for a service
	const getProcessingDays = (serviceName) => {
		if (!serviceName) {
			console.log("he");
			return "N/A";
		}
		
		// Find the service by name (case insensitive match)
		const service = services.find(s => 
			s.name && s.name.toLowerCase().trim() === serviceName.toLowerCase().trim()
		);
		console.log("service", service.processingdays);
		if (service) {
			// If service has packages, return processing days from first package
			if (service.processingdays>0) {
				return service.processingdays || "N/A";
			}
			// Otherwise return service level processing days
			return service.processingdays || "N/A";
		}
		return "N/A";
	};

	// Helper function to calculate expected completion date
	const calculateExpectedDate = (orderDate, serviceName) => {
		const processingDays = getProcessingDays(serviceName);
		if (processingDays === "N/A" || !orderDate) return "N/A";
		
		const date = new Date(orderDate);
		date.setDate(date.getDate() + parseInt(processingDays));
		return formatDate(date);
	};

	// Helper function to calculate actual completion date
	// Actual = Order Date + Processing Days + Delay Days
	const calculateActualDate = (orderDate, serviceName, daysDelayed) => {
		const processingDays = getProcessingDays(serviceName);
		if (processingDays === "N/A" || !orderDate) return "N/A";
		
		const date = new Date(orderDate);
		const totalDays = parseInt(processingDays) + (parseInt(daysDelayed) || 0);
		date.setDate(date.getDate() + totalDays);
		return formatDate(date);
	};

	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);
		return date;
	};

	// Filtered orders based on search and date filters
	const filteredOrders = [...orders]
		.filter((order) => {
			const lowerSearchTerm = searchTerm.toLowerCase();
			console.log("order",order);
			return (
				order["Order ID"]?.toLowerCase().includes(lowerSearchTerm) ||
				order["Customer Name"]?.toLowerCase().includes(lowerSearchTerm) ||
				order["Customer Email"]?.toLowerCase().includes(lowerSearchTerm) ||
				order["Service Name"]?.toLowerCase().includes(lowerSearchTerm)
			);
		})
		.filter((order) => {
			const orderDate = new Date(order["Order Date"]);
			const fromDate = dateFilter.fromDate
				? normalizeDate(dateFilter.fromDate)
				: null;
			const toDate = dateFilter.toDate
				? normalizeDate(dateFilter.toDate)
				: null;

			return (
				(fromDate === null || orderDate >= fromDate) &&
				(toDate === null || orderDate <= toDate)
			);
		})
		.sort((a, b) => {
			if (filterOption === "newest") {
				return new Date(b["Order Date"]) - new Date(a["Order Date"]);
			} else if (filterOption === "oldest") {
				return new Date(a["Order Date"]) - new Date(b["Order Date"]);
			}
			return 0;
		});

	// Export functions
	const handleDownloadCSV = () => {
		const csvData = filteredOrders.map((order) => ({
			"Order ID": order["Order ID"],
			"Order Date": formatDate(order["Order Date"]),
			"Customer ID": order["Customer ID"],
			"Customer Name": order["Customer Name"],
			"Customer Email": order["Customer Email"],
			"Customer Mobile Number": order["Customer Mobile Number"],
			"Employee Code": order["Employee Code"],
			"Employee Assigned": order["Employee Assigned"],
			"L1 Employee Code": order["Employee Code"],
			"L1 Employee Name": order["Employee Assigned"],
			"Service Name": order["Service Name"],
			"Service Price": order["Service Price"],
			"Discount Amount": order["Discounts"],
			"IGST Amount": order["IGST Amount"],
			"CGST Amount": order["CGST Amount"],
			"SGST Amount": order["SGST Amount"],
			"Total Order Value": order["Total Order Value"],
			"Order Status": order["Order Status"],
			"Order Completion Date": formatDate(order["Order Date"]),
			"Days Delayed": order["Days Delayed"] || 0,
			"Payment Status": order["Payment Status"],
			"Rating": order["Rating"] || "N/A",
			"Payment Method": order["Payment Method"] || "N/A",
		}));

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "orders.csv");
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF("landscape", "pt", "a3"); // Use landscape for more columns

		// Define table columns matching CSV fields
		const tableColumn = [
			"Order ID",
			"Order Date",
			"Cust ID",
			"Cust Name",
			"Cust Email",
			"Cust Mobile",
			"Emp Code",
			"Emp Name",
			"L1 Code",
			"L1 Name",
			"Service",
			"Price",
			"Discounts",
			"IGST",
			"CGST",
			"SGST",
			"Total",
			"Status",
			"Exp Date",
			"Comp Date",
			"Days Delay",
			"Pay Status",
			"Rating",
			"Pay Method",
		];

		// Prepare table rows with matching CSV data
		const tableRows = filteredOrders.map((order) => [
			order["Order ID"],
			formatDate(order["Order Date"]),
			order["Customer ID"],
			order["Customer Name"],
			order["Customer Email"],
			order["Customer Mobile Number"],
			order["Employee Code"],
			order["Employee Assigned"],
			order["Employee Code"],
			order["Employee Assigned"],
			order["Service Name"],
			formatCurrency(order["Service Price"]),
			formatCurrency(order["Discounts"]),
			formatCurrency(order["IGST Amount"]),
			formatCurrency(order["CGST Amount"]),
			formatCurrency(order["SGST Amount"]),
			formatCurrency(order["Total Order Value"]),
			order["Order Status"],
			formatDate(order["Order Date"]),
			order["Days Delayed"] || 0,
			order["Payment Status"],
			order["Rating"] || "N/A",
			order["Payment Method"] || "N/A",
		]);

		// Add title
		doc.text("Orders Detailed Report", 14, 15);

		// Configure and generate the table
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
			styles: {
				fontSize: 6, // Reduce font size to fit more columns
				cellPadding: 1,
				overflow: "linebreak",
			},
			columnStyles: {
				0: { cellWidth: 15 }, // Order ID
				1: { cellWidth: 15 }, // Order Date
				2: { cellWidth: 15 }, // Customer ID
				3: { cellWidth: 20 }, // Customer Name
				4: { cellWidth: 25 }, // Customer Email
				// Add more specific widths if needed
			},
			margin: { top: 20, left: 5, right: 5 },
			theme: "grid",
			headStyles: {
				fillColor: [41, 128, 185],
				textColor: 255,
				fontSize: 7,
			},
		});

		doc.save("orders_detailed.pdf");
	};

	const clearAllFilters = () => {
		setSearchTerm("");
		setFilterOption("newest");
		setDateFilter({ fromDate: "", toDate: "" });
	};
	const addDays = (dateStr, days) => {
	const date = new Date(dateStr);
	date.setDate(date.getDate() + (days || 0));
	return date;
};

	

	return (
		<div className='tax-dashboard-services'>
			{loading && <div style={{padding: '20px', textAlign: 'center'}}>Loading orders...</div>}
			
			{error && (
				<div style={{padding: '20px', textAlign: 'center', color: 'red', backgroundColor: '#fee'}}>
					Error: {error}
				</div>
			)}
			
			<div className='filter-div'>
				<input
					type='text'
					placeholder='Search by Order ID, Customer Name, Email, or Service'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>

				<div>
					<input
						type='date'
						placeholder='From Date'
						value={dateFilter.fromDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, fromDate: e.target.value })
						}
					/>

					<input
						type='date'
						placeholder='To Date'
						value={dateFilter.toDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, toDate: e.target.value })
						}
					/>
				</div>

				<button
					onClick={clearAllFilters}
					style={{
						padding: '10px 20px',
						backgroundColor: '#dc3545',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
						fontWeight: 'bold',
						fontSize: '14px',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						transition: 'background-color 0.3s'
					}}
					onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
					onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
					title='Clear all filters including search, date range, and sorting'>
					<i className='fa-solid fa-filter-circle-xmark'></i>
					Clear All Filters
				</button>

				<div className='table-bottom-btns'>
					<button className='tax-service-btn' onClick={handleDownloadCSV}>
						<i className='fa-solid fa-file-csv fa-2xl'></i>
					</button>
					<button className='tax-service-btn' onClick={handleDownloadPDF}>
						<i className='fa-solid fa-file-pdf fa-2xl'></i>
					</button>
				</div>
			</div>

			<div style={{padding: '10px', fontWeight: 'bold'}}>
				Total Orders: {orders.length} | Filtered Orders: {filteredOrders.length}
			</div>

			{!loading && orders.length === 0 && (
				<div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
					No orders found. Orders will appear here once customers make purchases.
				</div>
			)}

			{!loading && filteredOrders.length === 0 && orders.length > 0 && (
				<div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
					No orders match the current filters. Try adjusting your search criteria.
				</div>
			)}

			<div className='tax-services-wrap-table'>
				<table>
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Order Date</th>
							<th>Customer ID</th>
							<th>Customer Name</th>
							<th>Customer Email</th>
							<th>Customer Mobile</th>
							<th>Employee Code</th>
							<th>Employee Assigned</th>
							<th>L1 Employee Code</th>
							<th>L1 Employee Name</th>
							<th>Service Name</th>
							<th>Processing Days</th>
							<th>Service Price</th>
							<th>Discounts</th>
							<th>IGST Amount</th>
							<th>CGST Amount</th>
							<th>SGST Amount</th>
							<th>Total Order Value</th>
							<th>Order Status</th>
							<th>Expected completion date</th>
							<th>Actual completion date</th>
							<th>Days Delayed</th>
							<th>Reason for Delay</th>
							<th>Feedback Status</th>
							<th>Feedback</th>
							<th>Rating</th>
							<th>Payment Method</th>
							<th>Payment Status</th>
							<th>Refund Status</th>
							<th>Razorpay Order ID</th>
							<th>Invoice Receipt</th>
						</tr>
					</thead>
					<tbody>
						{filteredOrders.map((order) => (
							<tr key={order["Order ID"]}>
								<td>{order["Order ID"]}</td>
								<td>{formatDate(order["Order Date"])}</td>
								<td>{order["Customer ID"]}</td>
								<td>{order["Customer Name"]}</td>
								<td>{order["Customer Email"]}</td>
								<td>{order["Customer Mobile Number"]}</td>
								<td>{order["Employee Code"]}</td>
								<td>{order["Employee Assigned"]}</td>
								<td>{order["Employee Code"]}</td>
								<td>{order["Employee Assigned"]}</td>
							<td>{order["Service Name"]}</td>
							<td>{getProcessingDays(order["Service Name"])}</td>
							<td>{formatCurrency(order["Service Price"])}</td>
								<td>{formatCurrency(order["Discounts"])}</td>
								<td>{formatCurrency(order["IGST Amount"])}</td>
								<td>{formatCurrency(order["CGST Amount"])}</td>
								<td>{formatCurrency(order["SGST Amount"])}</td>
								<td>{formatCurrency(order["Total Order Value"])}</td>
							<td>{order["Order Status"]}</td>
							<td>{calculateExpectedDate(order["Order Date"], order["Service Name"])}</td>
							<td>{calculateActualDate(order["Order Date"], order["Service Name"], order["Days Delayed"])}</td>
							<td>{order["Days Delayed"] || 0}</td>
								<td>{order["Reason for Delay"] || "N/A"}</td>
								<td>{order["Feedback Status"]}</td>
								<td>{order["Feedback"] || "N/A"}</td>
						<td>{order["Rating"] !== null && order["Rating"] !== undefined ? order["Rating"] : "N/A"}</td>

								<td>{order["Payment Method"] || "N/A"}</td>
								<td>{order["Payment Status"] || "N/A"}</td>
								<td>{order["Refund Status"] || "N/A"}</td>
								<td>{order["Razorpay Order ID"] || "N/A"}</td>
								<td>
									{order["Invoice Receipt"] ? (
										<a
											href={order["Invoice Receipt"]}
											target='blank'
											rel='noopener noreferrer'>
											Download
										</a>
									) : (
										"N/A"
									)}
								</td>
							</tr>
						)
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Orders;
