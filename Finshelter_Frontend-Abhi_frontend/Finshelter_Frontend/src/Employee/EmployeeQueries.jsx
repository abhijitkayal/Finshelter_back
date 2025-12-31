import React, { useContext, useState, useEffect } from "react";
import { EmployeeContext } from "./EmployeeContext";
import axios from "../Admin/utils/axiosConfig";

const EmployeeQueries = () => {
	const {
		queries,
		setQueries,
		fetchQueries,
		loading,
		error,
		reduceUnreadCount,
	} = useContext(EmployeeContext);
	const [response, setResponse] = useState("");
	const [selectedQuery, setSelectedQuery] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		// fetchQueries();
	}, []);

	// Group queries by customer
	const customerQueries = queries.reduce((acc, query) => {
		if (!acc[query.customerId]) {
			acc[query.customerId] = [];
		}
		acc[query.customerId].push(query);
		return acc;
	}, {});

	const handleResponseChange = (event) => {
		setResponse(event.target.value);
	};

	const handleReply = async (queryId) => {
		if (!response.trim()) {
			setErrorMessage("Response cannot be empty.");
			return;
		}

		const employeeId = localStorage.getItem("employeeId");

		try {
			await axios.put(
				"http://localhost:8000/api/employees/queries/reply",
				{
					queryId,
					response,
					employeeId,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
					},
				}
			);

			reduceUnreadCount(queryId);
			setResponse("");
			fetchQueries();
		} catch (err) {
			const errorMsg =
				err.response?.data?.message ||
				"Failed to send the response. Please try again.";
			setErrorMessage(errorMsg);
		}
	};

	const formatTime = (dateString) => {
		return new Date(dateString).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getLatestMessage = (customerQueries) => {
		if (!customerQueries || customerQueries.length === 0) return null;
		return customerQueries[0];
	};

	const getUnreadCount = (customerQueries) => {
		return customerQueries.filter((q) => q.status === "pending").length;
	};

	// Add this function to handle file URLs
	const getFileUrl = (fileUrl) => {
		if (!fileUrl) return "";
		return fileUrl.startsWith("http")
			? fileUrl
			: `http://localhost:8000${fileUrl}`;
	};

	return (
		<div className='echat-container'>
			{/* Sidebar */}
			<div className='echat-sidebar'>
				<div className='esidebar-header'>
					<h3>Customer Chats</h3>
					<div className='esearch-box'>
						<input
							type='text'
							placeholder='Search customers...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				<div className='ecustomer-list'>
					{Object.entries(customerQueries)
						.filter(([customerId]) =>
							customerId.toLowerCase().includes(searchTerm.toLowerCase())
						)
						.map(([customerId, customerMsgs]) => {
							const latestMsg = getLatestMessage(customerMsgs);
							const unreadCount = getUnreadCount(customerMsgs);

							return (
								<div
									key={customerId}
									className={`customer-item ${
										selectedCustomer === customerId ? "selected" : ""
									}`}
									onClick={() => setSelectedCustomer(customerId)}>
									<div className='customer-avatar'>
										{customerId.slice(0, 2).toUpperCase()}
									</div>
									<div className='customer-info'>
										<div className='customer-header'>
											<span className='customer-name'>{customerId}</span>
											<span className='message-time'>
												{latestMsg && formatTime(latestMsg.createdAt)}
											</span>
										</div>
										<div className='message-preview'>
											<span>
												{latestMsg?.query
													? latestMsg.query.slice(0, 30) +
													  (latestMsg.query.length > 30 ? "..." : "")
													: "No messages"}
											</span>
											{unreadCount > 0 && (
												<span className='unread-count'>{unreadCount}</span>
											)}
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>

			{/* Main Chat Area */}
			<div className='main-chat-area'>
				{selectedCustomer ? (
					<>
						<div className='chat-header'>
							<div className='customer-info'>
								<div className='customer-avatar'>
									{selectedCustomer.slice(0, 2).toUpperCase()}
								</div>
								<span className='customer-name'>{selectedCustomer}</span>
							</div>
						</div>

						<div className='messages-container'>
							{customerQueries[selectedCustomer]?.map((query, index) => (
								<div key={query._id} className='message-group'>
									<div className='customer-message'>
										<div className='message-content'>
											<p>{query.query}</p>
											{query.attachments?.map((attachment, idx) => (
												<div key={idx} className='attachment'>
													{attachment.fileType?.startsWith("image/") ? (
														<img
															src={getFileUrl(attachment.filePath)}
															alt={attachment.originalName}
															className='message-image'
															onError={(e) => {
																e.target.src =
																	"https://via.placeholder.com/150?text=Image+Error";
															}}
														/>
													) : (
														<a
															href={getFileUrl(attachment.filePath)}
															target='_blank'
															rel='noopener noreferrer'
															className='attachment-link'>
															{attachment.originalName}
														</a>
													)}
												</div>
											))}
											<span className='message-time'>
												{formatTime(query.createdAt)}
											</span>
										</div>
									</div>

									{query.replies?.map((reply, idx) => (
										<div key={idx} className='employee-message'>
											<div className='message-content'>
												<p>{reply.response}</p>
												<span className='message-time'>
													{formatTime(reply.createdAt)}
												</span>
											</div>
										</div>
									))}

									{query.status === "pending" && (
										<div className='reply-box'>
											<div className='message-input-container'>
												<textarea
													value={
														selectedQuery?._id === query._id ? response : ""
													}
													onChange={handleResponseChange}
													onClick={() => setSelectedQuery(query)}
													placeholder='Type a message'
													className='message-input'
												/>
												<button
													onClick={() => handleReply(query._id)}
													className='send-button'
													disabled={
														!response.trim() || selectedQuery?._id !== query._id
													}>
													Send
												</button>
											</div>
											{errorMessage && (
												<div className='error-message'>{errorMessage}</div>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					</>
				) : (
					<div className='no-chat-selected'>
						<p>Select a customer to view messages</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default EmployeeQueries;
