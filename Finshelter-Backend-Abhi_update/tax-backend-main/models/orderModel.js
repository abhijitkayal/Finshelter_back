const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	orderId: {
		type: String,
		required: true,
		unique: true,
	},
	customerId: {
		type: String,
		required: true,
	},
	customerName: {
		type: String,
		required: true,
	},
	customerEmail: {
		type: String,
		required: true,
	},
	customerMobile: {
		type: String,
		required: true,
	},
	serviceId: {
		type: String,
		required: true,
	},
	serviceName: {
		type: String,
		required: true,
	},
	packageName: {
		type: String,
	},
	servicePrice: {
		type: Number,
		required: true,
	},
	discountAmount: {
		type: Number,
		default: 0,
	},
	cgstAmount: {
		type: Number,
		default: 0,
	},
	sgstAmount: {
		type: Number,
		default: 0,
	},
	igstAmount: {
		type: Number,
		default: 0,
	},
	totalAmount: {
		type: Number,
		required: true,
	},
	orderStatus: {
		type: String,
		enum: ["Pending", "In Process", "Completed", "Cancelled"],
		default: "Pending",
	},
	paymentMethod: {
		type: String,
		enum: ["Razorpay", "Wallet", "Cash"],
	},
	paymentStatus: {
		type: String,
		enum: ["Pending", "Paid", "Failed", "Refunded"],
		default: "Pending",
	},
	razorpayOrderId: {
		type: String,
	},
	razorpayPaymentId: {
		type: String,
	},
	orderDate: {
		type: Date,
		default: Date.now,
	},
	expectedCompletionDate: {
		type: Date,
	},
	actualCompletionDate: {
		type: Date,
	},
	dueDate: {
		type: Date,
	},
	daysDelayed: {
		type: Number,
		default: 0,
	},
	employeeAssigned: {
		type: String,
	},
	employeeCode: {
		type: String,
	},
	feedback: {
		type: String,
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
	},
	feedbackStatus: {
		type: String,
		enum: ["Pending", "Received"],
		default: "Pending",
	},
	reasonForDelay: {
		type: String,
	},
	invoiceReceipt: {
		type: String,
	},
	refundStatus: {
		type: String,
		enum: ["None", "Requested", "Approved", "Rejected", "Completed"],
		default: "None",
	},
}, {
	timestamps: true,
});

module.exports = mongoose.model("Order", orderSchema);
