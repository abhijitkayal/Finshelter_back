import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";

const AdminMessageCenter = () => {
	const [replyFiles, setReplyFiles] = useState({});
	const [replyContent, setReplyContent] = useState({});
	const [previews, setPreviews] = useState({});

	const [sendingReply, setSendingReply] = useState({});

	const [filterOptions, setFilterOptions] = useState({
		customers: [],
		services: [],
		orders: [],
	});
	const [selectedOrder, setSelectedOrder] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [allOrderMessages, setAllOrderMessages] = useState({});
	const {
		isAuthenticated,
		user,
		messages,
		setMessages,
		error,
		filters,
		setFilters,
		fetchMessages,
		reduceUnreadCount,
		setSelectedOrderPosition,
	} = useContext(AdminDashboardContext);

	const [loading, setLoading] = useState(false);
	// Group messages by orderId
	useEffect(() => {
		const groupedMessages = messages.reduce((acc, message) => {
			if (!acc[message.orderId]) {
				acc[message.orderId] = [];
			}
			acc[message.orderId].push(message);
			return acc;
		}, {});
		setAllOrderMessages(groupedMessages);
	}, [messages]);

	// Get messages for a specific order
	const getOrderMessages = (orderId) => {
		return allOrderMessages[orderId] || [];
	};

	// Get latest message for an order
	const getLatestMessage = (orderId) => {
		const orderMessages = allOrderMessages[orderId] || [];
		return orderMessages.length > 0 ? orderMessages[0] : null;
	};

	// Calculate unread messages
	const getUnreadCount = (orderId) => {
		const orderMessages = allOrderMessages[orderId] || [];
		// Count messages from customers that haven't been read by admin
		return orderMessages.filter((message) => !message.isRead).length;
	};

	// Mark messages as read when admin views them
	const markOrderMessagesAsRead = async (orderId) => {
		if (!orderId || !user?._id) return;

		try {
			const token = localStorage.getItem("adminToken");
			const response = await axios.post(
				"http://localhost:8000/api/messages/mark-read",
				{
					orderId: orderId,
					userId: user._id
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('Messages marked as read response:', response.data);
			
			// Wait a moment for DB to update, then refresh messages
			setTimeout(() => {
				fetchMessages();
			}, 300);
		} catch (err) {
			console.error("Error marking messages as read:", err);
		}
	};

	// Format date helper
	const formatDate = (date) => {
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return new Date(date)
			.toLocaleDateString("en-GB", options)
			.replace(/ /g, " ")
			.replace(",", "");
	};

	// Fetch filter options on mount
	useEffect(() => {
		const fetchFilterOptions = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/api/admin/filters",
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
						},
					}
				);
				setFilterOptions(response.data);
				console.log("Filter options:", response.data);
			} catch (error) {
				console.error("Error fetching filter options:", error);
			}
		};
		fetchFilterOptions();
	}, []);

	// Handle order selection
	const handleOrderSelect = (orderId) => {
		setSelectedOrder(orderId);
		// Find the position of this order in the filterOptions.orders array
		const orderPosition = filterOptions.orders.indexOf(orderId);
		const displayPosition = orderPosition !== -1 ? orderPosition + 1 : null;
		
		// Update the context with the position
		setSelectedOrderPosition(displayPosition);
		
		// Mark messages as read when admin views the order
		markOrderMessagesAsRead(orderId);
		
		console.log(`Order ID: ${orderId}`);
		console.log(`Position in Database: ${displayPosition}`);
		// setFilters((prev) => ({
		//   ...prev,
		//   orderId,
		// }));
	};

	// File handling
	// const handleFileChange = (messageId, event) => {
	// 	if (!event?.target?.files) return;

	// 	const files = Array.from(event.target.files);
	// 	setReplyFiles((prev) => ({ ...prev, [messageId]: files }));

	// 	const messagesPreviews = [];
	// 	files.forEach((file) => {
	// 		if (file.type.startsWith("image/")) {
	// 			const reader = new FileReader();
	// 			reader.onloadend = () => {
	// 				messagesPreviews.push(reader.result);
	// 				if (messagesPreviews.length === files.length) {
	// 					setPreviews((prev) => ({ ...prev, [messageId]: messagesPreviews }));
	// 				}
	// 			};
	// 			reader.readAsDataURL(file);
	// 		}
	// 	});
	// };
	const handleFileChange = (messageId, event) => {
		if (!event?.target?.files) return;

		const files = Array.from(event.target.files);
		setReplyFiles((prev) => ({ ...prev, [messageId]: files }));

		const messagesPreviews = [];
		files.forEach((file) => {
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onloadend = () => {
					messagesPreviews.push({
						type: "image",
						preview: reader.result,
						name: file.name,
					});
					if (messagesPreviews.length === files.length) {
						setPreviews((prev) => ({ ...prev, [messageId]: messagesPreviews }));
					}
				};
				reader.readAsDataURL(file);
			} else if (file.type === "application/pdf") {
				// For PDFs, we'll just store the name
				messagesPreviews.push({
					type: "pdf",
					name: file.name,
					size: (file.size / 1024).toFixed(2) + " KB",
				});
				if (messagesPreviews.length === files.length) {
					setPreviews((prev) => ({ ...prev, [messageId]: messagesPreviews }));
				}
			} else {
				// For other file types
				messagesPreviews.push({
					type: "file",
					name: file.name,
					size: (file.size / 1024).toFixed(2) + " KB",
				});
				if (messagesPreviews.length === files.length) {
					setPreviews((prev) => ({ ...prev, [messageId]: messagesPreviews }));
				}
			}
		});
	};

	// Remove a preview/file
	const removeFile = (messageId, fileIndex) => {
		setPreviews((prev) => {
			const updatedPreviews = [...prev[messageId]];
			updatedPreviews.splice(fileIndex, 1);
			return { ...prev, [messageId]: updatedPreviews };
		});

		setReplyFiles((prev) => {
			const updatedFiles = [...prev[messageId]];
			updatedFiles.splice(fileIndex, 1);
			return { ...prev, [messageId]: updatedFiles };
		});
	};

	// Handle reply submission
	const handleReply = async (messageId) => {
		if (!replyContent[messageId]?.trim()) {
			alert("Please enter a reply.");
			return;
		}

		setSendingReply((prev) => ({ ...prev, [messageId]: true }));

		const formData = new FormData();
		formData.append("replyContent", replyContent[messageId]);

		if (replyFiles[messageId]) {
			replyFiles[messageId].forEach((file) => {
				formData.append("files", file);
			});
		}

		try {
			const response = await axios.patch(
				`http://localhost:8000/api/messages/${messageId}/reply`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			const updatedMessage = response.data.updatedMessage;
			setMessages((prevMessages) =>
				prevMessages.map((msg) =>
					msg._id === messageId ? updatedMessage : msg
				)
			);

			// Clear form state
			setReplyContent((prev) => ({ ...prev, [messageId]: "" }));
			setReplyFiles((prev) => ({ ...prev, [messageId]: [] }));
			setPreviews((prev) => ({ ...prev, [messageId]: [] }));

			// Refresh messages
			await fetchMessages();
		} catch (err) {
			console.error("Failed to send reply:", err);
			alert("Failed to send reply. Please try again.");
		} finally {
			// Reset loading state
			setSendingReply((prev) => ({ ...prev, [messageId]: false }));
		}
	};

	// File URL helper
	const getFileUrl = (fileUrl) => {
		if (!fileUrl) return "";
		return fileUrl.startsWith("http")
			? fileUrl
			: `https://195-35-45-82.sslip.io:8000${fileUrl}`;
	};

	// Get file icon based on mime type
	const getFileIcon = (fileType) => {
		if (fileType?.startsWith("image/")) return "🖼️";
		if (fileType === "application/pdf") return "📄";
		return "📎";
	};
	const getFileName = (fileName, maxLength = 20) => {
		if (!fileName) return "Unknown file";
		if (fileName.length <= maxLength) return fileName;

		const extension = fileName.split(".").pop();
		const nameWithoutExtension = fileName.substring(
			0,
			fileName.lastIndexOf(".")
		);

		return `${nameWithoutExtension.substring(
			0,
			maxLength - extension.length - 3
		)}...${extension}`;
	};


	useEffect(() => {
  let totalUnread = 0;

  Object.keys(allOrderMessages).forEach((orderId) => {
    totalUnread += allOrderMessages[orderId].filter(
      (msg) => !msg.isRead
    ).length;
  });

  // 🔥 SEND VALUE TO OTHER FILE
  window.dispatchEvent(
    new CustomEvent("admin-unread-count", {
      detail: totalUnread,
    })
  );
}, [allOrderMessages]);


	return (
		<div className='admin-chat-container'>
			{/* Enhanced WhatsApp-style Sidebar */}
			<div className='chat-sidebar'>
				<div className='sidebar-header'>
					<h3>Orders {selectedOrder && `- Position: ${filterOptions.orders.indexOf(selectedOrder) + 1}`}</h3>
					<div className='search-box'>
						<input
							type='text'
							placeholder='Search orders...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
				<div className='order-list'>
					{filterOptions.orders
						.filter((orderId) =>
							orderId.toLowerCase().includes(searchTerm.toLowerCase())
						)
						.map((orderId, index) => {
							const latestMessage = getLatestMessage(orderId);
							const unreadCount = getUnreadCount(orderId);
							const orderPosition = index + 1;
							return (
								<div
									key={orderId}
									className={`order-item ${
										selectedOrder === orderId ? "selected" : ""
									}`}
									onClick={() => handleOrderSelect(orderId)}>
									<div className='order-avatar'>{orderPosition}</div>
									<div className='order-info'>
										<div className='order-header'>
											<span className='order-id'>Order #{orderId}</span>
											<span className='message-time'>
												{latestMessage && formatDate(latestMessage.createdAt)}
											</span>
										</div>
										<div className='message-preview'>
											<span>
												{latestMessage
													? latestMessage.content.slice(0, 30) +
													  (latestMessage.content.length > 30 ? "..." : "")
													: "No messages yet"}
											</span>
											{unreadCount > 0 && (
												<span className='unread-count' onClick={console.log(unreadCount)}>{unreadCount}</span>
											)}
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>

			<div className='main-chat-area'>
				{selectedOrder ? (
					<>
						<div className='chat-header'>
							<div className='order-info'>
								<div className='order-avatar'>
									{filterOptions.orders.indexOf(selectedOrder) + 1}
								</div>
								<div className='order-details'>
									<span className='order-id'>Order #{selectedOrder}</span>
									<span className='customer-info'>
										{filters.customerId && `Customer: ${filters.customerId}`}
									</span>
								</div>
							</div>
						</div>

						<ul className='message-list'>
							{getOrderMessages(selectedOrder).map((message) => (
								<li key={message._id} className='message-item'>
									<div className='initial-message'>
										<div className='message-info'>
											<span>
												<strong>
													{message.sender?._id || "Unknown Sender"}
												</strong>{" "}
												to{" "}
												<strong>
													{message.recipient?._id || "Unknown Recipient"}
												</strong>
											</span>
											<small className='message-timestamp'>
												{formatDate(message.createdAt)}
											</small>
										</div>
										<p className='message-content'>{message.content}</p>
										{message.files?.map((file, idx) => (
											<div key={idx} className='message-file'>
												{file.fileType?.startsWith("image/") ? (
													<img
														src={getFileUrl(file.fileUrl)}
														alt={file.fileName}
														className='message-image'
														onError={(e) => {
															e.target.src =
																"https://via.placeholder.com/150?text=Image+Error";
														}}
													/>
												) : (
													<a
														href={getFileUrl(file.fileUrl)}
														target='_blank'
														rel='noopener noreferrer'
														className='file-link'>
														{file.fileName}
													</a>
												)}
											</div>
										))}
									</div>

									<div className='replies-container'>
										{Array.isArray(message.replyContent) &&
											message.replyContent.map((reply, index) => (
												<div key={index} className='reply-item'>
													<p className='reply-info'>
														{reply.repliedBy === user?._id
															? "You"
															: "Support Team"}
													</p>
													{reply.files?.map((file, fileIdx) => (
														<div key={fileIdx} className='reply-file'>
															{file.fileType?.startsWith("image/") ? (
																<img
																	src={getFileUrl(file.fileUrl)}
																	alt={file.fileName}
																	className='reply-image'
																	onError={(e) => {
																		e.target.src =
																			"https://via.placeholder.com/150?text=Image+Error";
																	}}
																/>
															) : file.fileType === "application/pdf" ? (
																<div className='pdf-preview'>
																	<span className='pdf-icon'>📄</span>
																	<a
																		href={getFileUrl(file.fileUrl)}
																		target='_blank'
																		rel='noopener noreferrer'
																		className='file-link'>
																		{file.fileName}
																	</a>
																</div>
															) : (
																<a
																	href={getFileUrl(file.fileUrl)}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='reply-file-link'>
																	{getFileIcon(file.fileType)} {file.fileName}
																</a>
															)}
														</div>
													))}
													<p className='reply-content'>{reply.content}</p>
												</div>
											))}
									</div>

									<div className='reply-section'>
										<textarea
											placeholder='Type your reply here...'
											value={replyContent[message._id] || ""}
											onChange={(e) =>
												setReplyContent((prev) => ({
													...prev,
													[message._id]: e.target.value,
												}))
											}
											className='reply-textarea'
										/>

										{/* {previews[message._id]?.length > 0 && (
											<div className='preview-container'>
												{previews[message._id].map((preview, idx) => (
													<img
														key={idx}
														src={preview}
														alt={`Preview ${idx + 1}`}
														className='preview-image'
													/>
												))}
											</div>
										)} */}

										{previews[message._id]?.length > 0 && (
											<div className='preview-container'>
												{previews[message._id].map((previewItem, idx) => (
													<div key={idx} className='preview-item'>
														{previewItem.type === "image" ? (
															<>
																<img
																	src={previewItem.preview}
																	alt={`Preview ${idx + 1}`}
																	className='preview-image'
																/>
																<button
																	className='remove-preview-btn'
																	onClick={() => removeFile(message._id, idx)}
																	disabled={sendingReply[message._id]}>
																	×
																</button>
															</>
														) : previewItem.type === "pdf" ? (
															<div className='pdf-preview-item'>
																<span className='pdf-icon'>📄</span>
																<span className='pdf-name'>
																	{getFileName(previewItem.name)}
																</span>
																<span className='pdf-size'>
																	{previewItem.size}
																</span>
																<button
																	className='remove-preview-btn'
																	onClick={() => removeFile(message._id, idx)}
																	disabled={sendingReply[message._id]}>
																	×
																</button>
															</div>
														) : (
															<div className='file-preview-item'>
																<span className='file-icon'>📎</span>
																<span className='file-name'>
																	{getFileName(previewItem.name)}
																</span>
																<span className='file-size'>
																	{previewItem.size}
																</span>
																<button
																	className='remove-preview-btn'
																	onClick={() => removeFile(message._id, idx)}
																	disabled={sendingReply[message._id]}>
																	×
																</button>
															</div>
														)}
													</div>
												))}
											</div>
										)}

										<div className='attachment-container'>
											<label
												htmlFor={`file-upload-${message._id}`}
												className='attachment-icon'>
												📎
											</label>
											<input
												id={`file-upload-${message._id}`}
												type='file'
												multiple
												onChange={(e) => handleFileChange(message._id, e)}
												className='hidden-file-input'
												style={{ display: "none" }}
											/>
										</div>
										{/* <button
											className='reply-button'
											onClick={() => handleReply(message._id)}>
											➤
										</button> */}
										<button
											className='reply-button'
											onClick={() => handleReply(message._id)}
											disabled={sendingReply[message._id]}>
											{sendingReply[message._id] ? (
												<span className='loading-indicator'>⟳</span>
											) : (
												<span>➤</span>
											)}
										</button>
									</div>
								</li>
							))}
						</ul>
					</>
				) : (
					<div className='no-chat-selected'>
						<p>Select an order to view messages</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminMessageCenter;
