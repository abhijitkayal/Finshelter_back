const User = require("../models/userModel");
const Message = require("../models/messageModel");

// Send to a message

const replyToMessage = async (req, res) => {
	const { messageId } = req.params;
	const { replyContent, repliedBy } = req.body;

	if (!replyContent) {
		return res.status(400).json({ message: "Reply content is missing" });
	}

	try {
		const message = await Message.findById(messageId);
		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}

		// Construct the base URL properly
		const baseUrl = `${req.protocol}://${req.get("host")}`;

		const files =
			req.files?.map((file) => ({
				// fileUrl: `${baseUrl}/uploads/${repliedBy}/${file.filename}`,
				fileUrl: `/uploads/${repliedBy}/${file.filename}`,
				fileName: file.originalname,
				fileType: file.mimetype,
			})) || [];

		const replyData = {
			repliedBy,
			content: replyContent,
			files,
			isRead: false, // Initially set to false, will be marked as read when customer views it
			createdAt: new Date(),
		};

		message.replyContent.push(replyData);
		message.isReplied = true;
		message.isRead = true; // Mark the original message as read by admin

		await message.save();
		res
			.status(200)
			.json({ message: "Reply sent successfully", updatedMessage: message });
	} catch (err) {
		console.error("Error replying to message:", err);
		res
			.status(500)
			.json({ message: "Error replying to message", error: err.message });
	}
};

// messageController.js
const sendMessage = async (req, res) => {
	console.log("Request body:", req.body);
	console.log("Files received:", req.files);

	const { recipientId, content, service, orderId, sender } = req.body;

	if (!sender || sender === "undefined") {
		return res.status(400).json({ message: "Sender is invalid or missing" });
	}

	if (!recipientId || !content || !service) {
		return res.status(400).json({
			message: "Missing required fields: recipientId, content, or service",
		});
	}

	try {
		const messageData = {
			sender,
			recipient: recipientId,
			content,
			service,
			orderId, // Include orderId in message data
			files:
				req.files?.map((file) => ({
					fileUrl: `/uploads/${sender}/${file.filename}`,
					fileName: file.originalname,
					fileType: file.mimetype,
				})) || [],
		};

		const newMessage = new Message(messageData);
		console.log("Creating message with data:", messageData);

		await newMessage.save();
		// message.isread = true; // New message is unread by default
		res.status(201).json({
			message: "Message sent successfully",
			newMessage,
		});
	} catch (err) {
		console.error("Error sending message:", err);
		res.status(500).json({
			message: "Error sending message",
			error: err.message,
		});
	}
};

const getMessages = async (req, res) => {
	const { serviceId, orderId, customerId } = req.query;

	try {
		console.log('Fetching messages with filters:', { serviceId, orderId, customerId });
		
		let query = {};

		// Since authentication is removed, return all messages
		// You can add filters based on query parameters

		// Apply service filter
		if (serviceId) {
			query.service = serviceId;
		}

		// Apply order filter
		if (orderId) {
			query.orderId = orderId;
		}

		// Apply customer filter
		if (customerId) {
			// If query already has $or from role filter
			if (query.$or) {
				query = {
					$and: [
						{ $or: query.$or },
						{ $or: [{ sender: customerId }, { recipient: customerId }] },
					],
				};
			} else {
				query.$or = [{ sender: customerId }, { recipient: customerId }];
			}
		}

		console.log("Query for messages:", JSON.stringify(query, null, 2));

		const messages = await Message.find(query).sort({ createdAt: -1 }).lean();
		
		console.log(`Found ${messages.length} messages`);

		const populatedMessages = await Promise.all(
			messages.map(async (msg) => {
				const [senderUser, recipientUser] = await Promise.all([
					User.findById(msg.sender).select("_id name").lean(),
					User.findById(msg.recipient).select("_id name").lean(),
				]);

				return {
					...msg,
					sender: {
						_id: msg.sender,
						name: senderUser?.name || "Unknown",
					},
					recipient: {
						_id: msg.recipient,
						name: recipientUser?.name || "Unknown",
					},
				};
			})
		);

		res.status(200).json({ messages: populatedMessages });
	} catch (err) {
		console.error("Error fetching messages:", err);
		res.status(500).json({
			message: "Error fetching messages",
			error: err.message,
		});
	}
};
const markMessageAsRead = async (req, res) => {
	const { orderId, serviceId, userId } = req.body;

	try {
		console.log(`Marking messages as read: orderId=${orderId}, serviceId=${serviceId}, userId=${userId}`);
		
		let query = {};
		if (orderId) {
			query.orderId = orderId;
		}
		if (serviceId) {
			query.service = serviceId;
		}
		
		// Find all messages for this order/service
		const messages = await Message.find(query);
		console.log(`Found ${messages.length} messages to mark as read`);
		
		// Mark messages as read
		for (let message of messages) {
			let isModified = true;
			
			// If admin is viewing customer messages
			if (message.sender !== userId) {
				message.isRead = true;
				isModified = true;
				console.log(`Marked message ${message._id} as read (sender: ${message.sender}, viewer: ${userId})`);
			}
			
			// If customer is viewing admin replies
			if (message.replyContent && message.replyContent.length > 0) {
				console.log(`Processing ${message.replyContent.length} replies for message ${message._id}`);
				// Process each reply
				for (let i = 0; i < message.replyContent.length; i++) {
					console.log(`Reply ${i}: repliedBy=${message.replyContent[i].repliedBy}, viewer=${userId}, isRead before=${message.replyContent[i].isRead}`);
					if (message.replyContent[i].repliedBy === userId) {
						// Only mark replies from others as read
						message.replyContent[i].isRead = true;
						isModified = true;
						console.log(`✓ Marked reply ${i} in message ${message._id} as read (isRead after=${message.replyContent[i].isRead})`);
					}
				}
			}
			
			// Only save if modifications were made
			if (isModified) {
				await message.save();
				console.log(`✓ Saved changes to message ${message._id}`);
			} else {
				console.log(`No changes needed for message ${message._id}`);
			}
		}

		res.json({ 
			message: "Messages marked as read",
			updatedMessages: messages 
		});
	} catch (err) {
		console.error("Error marking messages as read:", err);
		res.status(500).json({ 
			message: "Error marking messages as read", 
			error: err.message 
		});
	}
};

module.exports = {
	sendMessage,
	getMessages,
	markMessageAsRead,
	replyToMessage,
};
