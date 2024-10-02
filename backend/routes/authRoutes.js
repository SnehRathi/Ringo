const express = require('express');
const router = express.Router();
const { loginUser, registerUser, verifyToken } = require('../controllers/authControllers');
const { authMiddleware } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');


// MongoDB Registration route
router.post('/register', validateRegister, registerUser);

// MongoDB + Firebase Login route
router.post('/login', validateLogin, loginUser);

// Protected route to verify MongoDB JWT token
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;
