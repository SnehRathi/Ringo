const express = require('express');
const router = express.Router();
const {sendMessage } = require('../controllers/messageController');
// const auth = require('../middleware/authMiddleware'); // Assuming you have an authentication middleware

// Route to send a message
router.post('/sendMessage/:recipientId', sendMessage);

module.exports = router;
