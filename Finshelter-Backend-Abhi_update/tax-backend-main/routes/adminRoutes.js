const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Service = require("../models/serviceModel");

const {
	adminLogin,
	getAllUsers,
	getAllServices,
	getDashboardData,
	createService,
	activateUser,
	deactivateUser,
	createEmployee,
	deleteUser,
	// assignServiceToEmployee,
	createUser,
	updateService,
	deleteService,
	createManager,
	assignEmployeeToManager,
	updateServiceStatusByAdmin,
	getFilterOptions,
	updateDownloadAccess,
	getAllCustomerOrders,

	handleWithdrawalRequest,
	approveWithdrawal,
	assignServiceToFlexiCustomer,
	updateCustomerInfo,
	promoteToManager,
	assignOrderToEmployee,
	toggleServiceActivation,

	// Add new lead management functions
	getAllLeads,
	assignLeadToEmployee,
	acceptLead,
	declineLead,
	convertLeadToOrder,
	sendLeadBackToEmployee,
} = require("../controllers/adminController");

// Admin login
router.post("/login", adminLogin);

// Dashboard data
router.get("/dashboard", getDashboardData);

// User and Service management routes
router.get("/users", getAllUsers);
router.get("/services", getAllServices);
// router.get("/services", getAllServices);
router.post("/services", createService);
router.put("/user/activate/:userId", activateUser);
router.put("/user/deactivate/:userId", deactivateUser);
router.delete("/user/:userId", deleteUser);
// Employee management
router.post("/employee", createEmployee);

router.post("/createUser", createUser);

router.put("/services/:serviceId", updateService);

router.delete("/services/:serviceId", deleteService);
router.put("/services/:serviceId/toggle-activation", toggleServiceActivation);
router.post("/manager", createManager);
router.post("/assign-employee", assignEmployeeToManager);
router.post("/update-download-access", updateDownloadAccess);

// In your Express routes
router.patch("/users/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const updates = req.body;
		const user = await User.findByIdAndUpdate(userId, updates, { new: true });
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Error updating user" });
	}
});

router.put(
	"/update-service-status/:userId",
	updateServiceStatusByAdmin
);
router.get("/filters", getFilterOptions);

router.get("/orders", getAllCustomerOrders);

router.get("/withdrawal-requests", handleWithdrawalRequest);
router.post("/approve-withdrawal", approveWithdrawal);

router.post("/assign-service", assignServiceToFlexiCustomer);

router.post("/promote-to-manager", promoteToManager);
router.post("/assign-order", assignOrderToEmployee);

// router.post("/users/:userId/assign-service", async (req, res) => {
// 	const { userId } = req.params;
// 	const { serviceId } = req.body;

// 	try {
// 		const user = await User.findById(userId);
// 		if (!user) return res.status(404).json({ message: "User not found" });

// 		const service = await Service.findById(serviceId); // Assuming a Service model exists
// 		if (!service) return res.status(404).json({ message: "Service not found" });

// 		user.services.push({
// 			serviceId,
// 			name: service.name,
// 			status: "In Process",
// 			activated: true,
// 			purchasedAt: new Date(),
// 		});

// 		await user.save();
// 		res.status(200).json({ message: "Service assigned successfully" });
// 	} catch (error) {
// 		res
// 			.status(500)
// 			.json({ message: "Error assigning service", error: error.message });
// 	}
// });

router.post("/users/:userId/assign-service", async (req, res) => {
	const { userId } = req.params;
	const { serviceId } = req.body;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		const service = await Service.findById(serviceId);
		if (!service) return res.status(404).json({ message: "Service not found" });

		// Generate a unique orderId
		const orderId = generateOrderId(userId);

		user.services.push({
			serviceId,
			orderId, // Add the generated orderId
			name: service.name,
			status: "In Process",
			activated: true,
			purchasedAt: new Date(),
			dueDate: service.dueDate, // Include dueDate from service
			requiredDocuments: service.requiredDocuments || [], // Include required documents
			documents: [], // Initialize empty documents array
		});

		await user.save();
		res.status(200).json({
			message: "Service assigned successfully",
			orderId, // Return the orderId for confirmation
		});
	} catch (error) {
		res.status(500).json({
			message: "Error assigning service",
			error: error.message,
		});
	}
});

// Add generateOrderId function to the file (or import it from customerController)
const generateOrderId = (userId) => {
	const timestamp = Date.now();
	const shortTimestamp = timestamp.toString().slice(-4);
	const randomDigits = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, "0");
	return `ORDER${userId}-${shortTimestamp}${randomDigits}`;
};

// Lead management routes
router.get("/leads", getAllLeads);
router.post("/leads/assign", assignLeadToEmployee);
router.put("/leads/:leadId/accept", acceptLead);
router.put("/leads/:leadId/decline", declineLead);
router.post("/leads/convert", convertLeadToOrder);
router.post("/leads/send-back", sendLeadBackToEmployee);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const adminAuth = require("../middleware/adminAuth");

// // Protected admin endpoints
// router.get("/dashboard", adminAuth, getDashboard);
// router.get("/orders", adminAuth, getOrders);
// router.get("/withdrawal-requests", adminAuth, getWithdrawals);
// router.post("/approve-withdrawal", adminAuth, approveWithdrawal);

// // Public admin login
// router.post("/login", adminLogin);

// module.exports = router;
