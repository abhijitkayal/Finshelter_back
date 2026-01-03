const express = require("express");
const router = express.Router();
// const roleCheck = require("../middleware/roleCheck");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const User = require("../models/userModel");
const { sendEmail } = require("../utils/emailUtils");

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/temp');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
 
const upload = multer({ 
	storage, 
	limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Create the temp directory if it doesn't exist
const tempDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

router.post("/login", employeeLogin);
router.post("/update-service-status", authMiddleware, updateServiceStatus);
counter.put("/queries/reply", authMiddleware, replyToQuery);

router.put("/update-employee-profile", authMiddleware, updateEmployeeProfile);
router.get("/emdashboard", authMiddleware, getEmployeeDash);

// New routes for lead management

router.post("/update-delay-reason", authMiddleware, updateServiceDelayReason);

// L1 Review routes
router.get("/pending-l1-reviews", async (req, res) => {
	try {
		const employeeId = req.body.employeeId || req.query.employeeId;
		
		// Find all customers with services that have status 'pending-l1-review'
		const customers = await User.find({
			role: "customer",
			"services.status": "pending-l1-review"
		}); 
		
		// Filter services that should be reviewed by this employee
		const pendingReviews = [];
		
		for (const customer of customers) {
			for (const service of customer.services) {
				if (service.status === 'pending-l1-review' && service.employeeId) {
					// Find the employee who sent this for review
					const serviceEmployee = await User.findById(service.employeeId);
					
					// Check if the current employee is the L1 for this employee
					if (serviceEmployee && serviceEmployee.L1EmpCode === employeeId.toString()) {
						pendingReviews.push({
							orderId: service.orderId,
							serviceName: service.packageName || service.serviceId,
							customerId: customer._id,
							serviceId: service._id,
							employeeId: service.employeeId,
							employeeName: serviceEmployee.name || "Unknown",
							sentForReviewAt: service.sentForReviewAt || new Date(),
							documents: service.documents || []
						});
					}
				}
			}
		}

		res.json({ success: true, pendingReviews });
	} catch (error) {
		console.error("Error fetching pending L1 reviews:", error);
		res.status(500).json({ success: false, message: "Error fetching pending reviews" });
	}
});

const sendZeptoMail = require("../utils/sendZeptoMail");

router.post("/complete-l1-review", async (req, res) => {
	try {
		const { orderId, decision, customerId, serviceId, l1EmployeeId } = req.body;

		// Find the customer and service
		const customer = await User.findOne({
			_id: customerId,
			"services.orderId": orderId
		});

		if (!customer) {
			return res.status(404).json({
				success: false,
				message: "Order not found"
			});
		}

		const serviceIndex = customer.services.findIndex(s => s.orderId === orderId);
		if (serviceIndex === -1) {
			return res.status(404).json({
				success: false,
				message: "Service not found"
			});
		}

		// Get the employee who sent this for review
		const employeeId = customer.services[serviceIndex].employeeId;
		const employee = await User.findById(employeeId);
		
		// Verify this L1 employee is actually the supervisor for this employee
		if (!employee || employee.L1EmpCode !== l1EmployeeId.toString()) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to review this order"
			});
		}

		// Update the service based on decision
		if (decision === 'approved') {
			customer.services[serviceIndex].status = "completed";
			customer.services[serviceIndex].completedAt = new Date();
		} else {
			customer.services[serviceIndex].status = "in-process";
			customer.services[serviceIndex].l1ReviewNotes = "Sent back for revision";
		}

		await customer.save();
	}
	catch (error) {
		res.status(500).json({ success: false, message: "Error completing L1 review" });
	}
});


router.post("/send-for-l1-review", sendOrderForL1Review);

router.get("/profile", async (req, res) => {
	try {
		const employeeId = req.query.employeeId || req.body.employeeId;
		const employee = await User.findById(employeeId);
		if (!employee) {
			return res.status(404).json({
				success: false,
				message: "Employee not found"
			});
		}

		res.json({
			success: true,
			isL1Employee: Boolean(employee.isL1Employee),
			name: employee.name,
			email: employee.email
		});
	} catch (error) {
		console.error("Error fetching employee profile:", error);
		res.status(500).json({
			success: false,
			message: "Error fetching profile"
		});
	}
});

// Add these routes to your employeeRoutes.js file
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password", resetPassword);


module.exports = router;
