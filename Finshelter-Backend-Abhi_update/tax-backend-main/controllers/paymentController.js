const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Service = require("../models/serviceModel");
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 },
});


const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

/* ======================================================
   GET NEXT SEQUENTIAL ORDER ID
====================================================== */
const getNextOrderId = async () => {
  // Format date as YYYYMMDD
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  const counterName = `order_${dateStr}`;

  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // Pad sequence to 4 digits → 0001
  const paddedSeq = String(counter.seq).padStart(4, "0");

  return `order_${dateStr}_${paddedSeq}`;
};


// Initialize Razorpay
const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("Razorpay initialized with key:", process.env.RAZORPAY_KEY_ID);

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
	try {
		console.log("Create order request body:", req.body);
		console.log("User from auth:", req.user);

		const {
			serviceId,
			serviceName,
			packageId,
			packageName,
			amount,
			totalAmount,
			servicePrice,
			discountAmount,
			cgstAmount,
			sgstAmount,
			igstAmount,
			CGST,
			SGST,
			IGST,
		} = req.body;

		// Use flexible field names (accept both totalAmount/amount and CGST/cgstAmount)
		const finalAmount = totalAmount || amount;
		const finalCGST = CGST || cgstAmount || 0;
		const finalSGST = SGST || sgstAmount || 0;
		const finalIGST = IGST || igstAmount || 0;

		// Validate only essential fields
		if (!serviceId || !serviceName || !finalAmount) {
			return res.status(400).json({ 
				success: false,
				message: "Missing required fields: serviceId, serviceName, and amount/totalAmount are required",
				received: { serviceId, serviceName, amount, totalAmount }
			});
		}

		const userId = req.user._id || req.user.userId;
		console.log("Looking for user with ID:", userId);

		// Get user details (User model uses _id as primary key, not userId)
		const user = await User.findById(userId);
		if (!user) {
			console.log("User not found for ID:", userId);
			return res.status(404).json({ 
				success: false,
				message: "User not found" 
			});
		}

		console.log("Found user:", user.name, user.email);

		// Create Razorpay order
		const customOrderId = await getNextOrderId();

		// Create Razorpay order
		const options = {
			amount: Math.round(finalAmount * 100),
			currency: "INR",
			receipt: customOrderId,
			notes: {
				customOrderId,
				userId,
				serviceId,
				serviceName,
			},
		};
		
		console.log("Creating Razorpay order with options:", options);
		console.log("Using Razorpay key:", process.env.RAZORPAY_KEY_ID?.substring(0, 8) + "...");
		
		const razorpayOrder = await razorpay.orders.create(options);
		console.log("Razorpay order created successfully:", razorpayOrder.id);

		// Create order in database
		const newOrder = new Order({
			orderId: customOrderId,
			customerId: userId,
			customerName: user.name,
			customerEmail: user.email,
			customerMobile: user.mobile || "",
			serviceId: serviceId,
			serviceName: serviceName,
			packageId: packageId || "",
			packageName: packageName || "",
			servicePrice: servicePrice || finalAmount,
			discountAmount: discountAmount || 0,
			cgstAmount: finalCGST,
			sgstAmount: finalSGST,
			igstAmount: finalIGST,
			totalAmount: finalAmount,
			orderStatus: "Pending",
			paymentStatus: "Pending",
			paymentMethod: "Razorpay",
			razorpayOrderId: razorpayOrder.id,
			orderDate: new Date(),
		});

		await newOrder.save();
		console.log("Order created successfully:", newOrder.orderId);

		res.json({
			success: true,
			orderId: razorpayOrder.id,
			order: {
				id: razorpayOrder.id,
				amount: razorpayOrder.amount,
				currency: razorpayOrder.currency,
			},
			amount: razorpayOrder.amount,
			currency: razorpayOrder.currency,
			keyId: process.env.RAZORPAY_KEY_ID,
		});
	} catch (error) {
		console.error("Error creating Razorpay order:", error);
		console.error("Error stack:", error.stack);
		res.status(500).json({
			success: false,
			message: "Failed to create order",
			error: error.message,
			details: error.errors || error.toString(),
		});
	}
};

// Verify Payment
const verifyPayment = async (req, res) => {
	try {
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
		} = req.body;

		// Verify signature
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			// Update order status
			const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
			
			if (!order) {
				return res.status(404).json({
					success: false,
					message: "Order not found",
				});
			}

			order.paymentStatus = "Paid";
			order.orderStatus = "In Process";
			order.razorpayPaymentId = razorpay_payment_id;

			// Calculate expected completion date based on service processing days
			const service = await Service.findOne({ _id: order.serviceId });
			if (service && service.processingdays) {
				const processingDays = parseInt(service.processingdays);
				const expectedDate = new Date();
				expectedDate.setDate(expectedDate.getDate() + processingDays);
				order.expectedCompletionDate = expectedDate;
				order.dueDate = expectedDate;
			}

			await order.save();

			// Sync order to User.services array
			try {
				const User = require('../models/userModel');
				const user = await User.findById(order.customerId);
				
				if (user) {
					// Check if service already exists in user.services
					const serviceExists = user.services.some(s => s.orderId === order.orderId);
					
					if (!serviceExists) {
						// Add service to user's services array
						user.services.push({
							orderId: order.orderId,
							serviceId: order.serviceId,
							packageName: order.packageName,
							activated: true,
							purchasedAt: order.orderDate,
							status: "In Process",
							dueDate: order.dueDate,
							price: order.servicePrice,
							paymentAmount: order.totalAmount,
							paymentMethod: order.paymentMethod,
							paymentReference: order.razorpayPaymentId,
							igst: order.igstAmount || 0,
							cgst: order.cgstAmount || 0,
							sgst: order.sgstAmount || 0,
							discount: order.discountAmount || 0,
							documents: []
						});
						
						await user.save();
						console.log(`Service added to user ${order.customerId} services array`);
					}
				}
			} catch (syncError) {
				console.error('Error syncing order to user services:', syncError);
				// Continue even if sync fails - order is still saved
			}

			// Create initial message thread for customer-employee communication
			try {
				const Message = require('../models/messageModel');
				
				// Create welcome message from system
				const welcomeMessage = new Message({
					content: `Thank you for purchasing ${order.serviceName}! ${order.packageName ? `Package: ${order.packageName}. ` : ''}Your service is now in process. ${order.dueDate ? `Expected completion: ${order.dueDate.toLocaleDateString()}. ` : ''}An employee will be assigned shortly to assist you.`,
					sender: 'system',
					recipient: order.customerId,
					service: order.serviceId,
					orderId: order.orderId,
					isRead: false,
					createdAt: new Date()
				});
				
				await welcomeMessage.save();
				console.log(`Welcome message created for order ${order.orderId}`);
			} catch (messageError) {
				console.error('Error creating welcome message:', messageError);
				// Continue even if message creation fails
			}

			res.json({
				success: true,
				message: "Payment verified successfully",
				orderId: order.orderId,
			});
		} else {
			// Update order as failed
			await Order.findOneAndUpdate(
				{ razorpayOrderId: razorpay_order_id },
				{ paymentStatus: "Failed" }
			);

			res.status(400).json({
				success: false,
				message: "Invalid payment signature",
			});
		}
	} catch (error) {
		console.error("Error verifying payment:", error);
		res.status(500).json({
			success: false,
			message: "Payment verification failed",
			error: error.message,
		});
	}
};

// Get Order Details
const getOrderDetails = async (req, res) => {
	try {
		const { orderId } = req.params;
		const order = await Order.findOne({ orderId: orderId });

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found",
			});
		}

		res.json({
			success: true,
			order: order,
		});
	} catch (error) {
		console.error("Error fetching order:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch order",
			error: error.message,
		});
	}
};

// Get Customer Orders
const getCustomerOrders = async (req, res) => {
	try {
		const userId = req.user._id || req.user.userId;
		console.log('Fetching orders for userId:', userId);
		
		const orders = await Order.find({ customerId: userId.toString() }).sort({ orderDate: -1 });
		
		console.log('Found orders count:', orders.length);
		console.log('Order customerIds:', orders.map(o => ({ orderId: o.orderId, customerId: o.customerId })));

		res.json({
			success: true,
			orders: orders,
		});
	} catch (error) {
		console.error("Error fetching customer orders:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch orders",
			error: error.message,
		});
	}
};

// Update Order Rating
const updateOrderRating = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { rating } = req.body;
		const userId = req.user._id || req.user.userId;

		// Validate rating
		if (!rating || rating < 1 || rating > 5) {
			return res.status(400).json({
				success: false,
				message: "Rating must be between 1 and 5",
			});
		}

		// Find order and verify ownership
		const order = await Order.findOne({ orderId: orderId });

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found",
			});
		}

		// Verify that the user owns this order
		if (order.customerId !== userId.toString()) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to rate this order",
			});
		}

		// Update rating in Order model
		order.rating = rating;
		await order.save();

		// Also update rating in User model's services array
		try {
			const user = await User.findById(userId);
			if (user) {
				// Find the service in user's services array by orderId
				const serviceIndex = user.services.findIndex(
					(service) => service.orderId === orderId
				);

				if (serviceIndex !== -1) {
					// Initialize feedback array if it doesn't exist
					if (!user.services[serviceIndex].feedback) {
						user.services[serviceIndex].feedback = [];
					}

					// Check if there's already a feedback entry
					if (user.services[serviceIndex].feedback.length > 0) {
						// Update existing feedback rating
						user.services[serviceIndex].feedback[0].rating = rating;
					} else {
						// Create new feedback entry with rating
						user.services[serviceIndex].feedback.push({
							rating: rating,
							feedback: "",
							createdAt: new Date(),
						});
					}

					await user.save();
					console.log(`Updated rating in User model for service ${orderId}`);
				}
			}
		} catch (userUpdateError) {
			console.error("Error updating user's service rating:", userUpdateError);
			// Continue even if user update fails - order rating is still saved
		}

		console.log(`Order ${orderId} rated ${rating} stars by user ${userId}`);

		res.json({
			success: true,
			message: "Rating updated successfully",
			order: {
				orderId: order.orderId,
				rating: order.rating,
			},
		});
	} catch (error) {
		console.error("Error updating order rating:", error);
		res.status(500).json({
			success: false,
			message: "Failed to update rating",
			error: error.message,
		});
	}
};

module.exports = {
	createRazorpayOrder,
	verifyPayment,
	getOrderDetails,
	getCustomerOrders,
	updateOrderRating,
};





