import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import axios from "axios";

const PaymentHistory = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useCustomerAuth();

	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('customerToken');
			
			if (!token) {
				setLoading(false);
				return;
			}
			
			const response = await axios.get('http://localhost:8000/api/payment/my-orders', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			
			if (response.data.success) {
				setOrders(response.data.orders);
			}
		} catch (error) {
			console.error('Error fetching orders:', error);
		} finally {
			setLoading(false);
		}
	};

	// Calculate total payments from orders
	const totalPayments = orders.reduce((total, order) => {
		if (order.paymentStatus === 'Paid') {
			return total + (order.totalAmount || 0);
		}
		return total;
	}, 0);

	// Check if there's order data
	const hasOrders = orders && orders.length > 0;

	return (
		<div className='tax-dashboard-services'>
			<div>
				<div style={{ paddingTop: "50px" }}>
					<h2>Payment History</h2>
					<p>Total Payments: ₹{totalPayments.toFixed(2)}</p>

					{loading ? (
						<p>Loading payment data...</p>
					) : orders.length > 0 ? (
						<table className='payment-history-table'>
							<thead>
								<tr>
									<th>Date</th>
									<th>Order ID</th>
									<th>Service</th>
									<th>Package</th>
									<th>Amount</th>
									<th>Payment Method</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order, index) => (
									<tr key={order._id || index}>
										<td>{formatDate(order.orderDate)}</td>
										<td>{order.orderId || 'N/A'}</td>
										<td>{order.serviceName || 'N/A'}</td>
										<td>{order.packageName || 'N/A'}</td>
										<td>₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
										<td>{order.paymentMethod || 'N/A'}</td>
										<td>
											<span style={{
												color: order.paymentStatus === 'Paid' ? 'green' : 
													   order.paymentStatus === 'Pending' ? 'orange' : 'red',
												fontWeight: 'bold'
											}}>
												{order.paymentStatus || 'N/A'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>No payment history available</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default PaymentHistory;
