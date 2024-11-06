const express = require('express');
const router = express.Router();
const { createTemporaryChat, getUserChats,discardTemporaryChat } = require('../controllers/chatControllers');
const {authMiddleware} = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// Route to fetch all chats for a user

// Define the route with send_id as a URL parameter and recipient_id in the body
router.post("/createTemporaryChat/:send_id", createTemporaryChat);
router.delete('/chat/discard/:chatId/:senderId', discardTemporaryChat);
router.get('/getUserChats', authMiddleware, getUserChats);

module.exports = router;
