//customer routes
const express = require("express");
const uploadMiddleware = require("../middlewares/upload");
const uploadMiddleware2 = require("../middlewares/upload2");
const {
	getWalletDetails,
	requestWithdrawal,
	getTransactions,
	getReferralStats,
} = require("../controllers/walletController");

const {
	registerCustomer,
	loginUser,
	verifyLoginOTP,
	resendLoginOTP,
	getServiceById,
	initiatePayment,
	getUserServices,
	getCustomerDashboard,
	handlePaymentSuccess,
	updateCustomerProfile,
	uploadDocuments,
	sendQuery,
	getCustomerQueriesWithReplies,
	submitFeedback,
	updateBankDetails,
	registerFlexiCustomer,
	processFlexiFunnelRedirect,
	googleRegister,
	// Add the new controller functions for password reset
	forgotPassword,
	resetPassword,
	verifyResetToken,
	checkEmailAvailability,
} = require("../controllers/customerController");

const authMiddleware = require('../middlewares/authMiddleware');
const { createLead } = require('../controllers/leadController');

const router = express.Router();

router.get("/cdashboard", authMiddleware, getCustomerDashboard);
// Service details
router.get("/user-services/:serviceId", getServiceById);

// Customer registration
router.post("/user-register", registerCustomer);
router.post("/flexi-register", registerFlexiCustomer);
router.post("/google-register", googleRegister);
// Customer login
router.post("/user-login", loginUser);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/resend-login-otp", resendLoginOTP);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

// Initiate payment
router.post("/user-payment", initiatePayment);
router.get("/user-services", getUserServices);
router.post("/payment-success", handlePaymentSuccess);
router.post("/update-profile", authMiddleware, updateCustomerProfile);
router.post(
	"/upload-documents",
	(req, res, next) => {
		console.log("\n=== UPLOAD ROUTE HIT ===");
		console.log("Time:", new Date().toISOString());
		console.log("Method:", req.method);
		console.log("URL:", req.url);
		console.log("Original URL:", req.originalUrl);
		next();
	},
	authMiddleware,
	uploadMiddleware2,
	uploadDocuments
);
router.post("/sendQuery", uploadMiddleware2, sendQuery);
router.get("/queries", authMiddleware, getCustomerQueriesWithReplies);
// Route to fetch customer queries by user ID
router.post("/feedback", authMiddleware, submitFeedback);



//wallet
router.get("/wallet", authMiddleware, getWalletDetails);
router.post("/wallet/withdraw", authMiddleware, requestWithdrawal);
router.get("/wallet/transactions", authMiddleware, getTransactions);
router.get("/wallet/referral/stats", authMiddleware, getReferralStats);

router.post("/update-bank-details", authMiddleware, updateBankDetails);
// In customerRoutes.js, add a test route
router.get("/wallet/test", (req, res) => {
	res.json({ message: "Wallet routes are working", user: req.user });
});

// Lead creation route (supports both guests and logged-in users)
router.post('/lead', createLead);

// Email validation route (no auth required)
router.get("/check-email", checkEmailAvailability);

module.exports = router;
