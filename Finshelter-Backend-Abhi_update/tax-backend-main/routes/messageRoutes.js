const express = require("express");
const {
	sendMessage,
	getMessages,
	markMessageAsRead,
	replyToMessage,
} = require("../controllers/messageController");

const uploadMiddleware = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router(); 

// Send a message
router.post("/send", uploadMiddleware, sendMessage);

// Get all messages 
router.get("/", getMessages);

// Mark messages as read
router.post("/mark-as-read", markMessageAsRead);

// Reply to a message
router.patch( 
	"/:messageId/reply",
	uploadMiddleware,
	replyToMessage
);

module.exports = router;
