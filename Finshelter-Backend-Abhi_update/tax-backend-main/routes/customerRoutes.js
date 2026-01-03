//customer routes

const {
	uploadDocuments,
	sendQuery,
	getCustomerQueriesWithReplies,
	submitFeedback,
	updateBankDetails,
	registerFlexiCustomer,
	checkEmailAvailability,
} = require("../controllers/customerController");

const authMiddleware = require('../middlewares/authMiddleware');
const { createLead } = require('../controllers/leadController');

const router = express.Router();

router.get("/cdashboard", authMiddleware, getCustomerDashboard);
// Service details
router.get("/user-services/:serviceId", getServiceById);



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





module.exports = router;
