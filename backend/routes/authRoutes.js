const express = require('express');
const router = express.Router();
const { loginUser, verifyToken, registerUser } = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

// Registration route
router.post('/register', validateRegister, registerUser);

// Login route
router.post('/login', validateLogin, loginUser);

// Protected route to verify token
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;