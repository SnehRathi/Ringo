const express = require('express');
const router = express.Router();
const { loginUser, verifyToken } = require('../controllers/userController');

// Route for user login
router.post('/login', loginUser);

// Route for verifying token
router.get('/verify', verifyToken);

module.exports = router;
