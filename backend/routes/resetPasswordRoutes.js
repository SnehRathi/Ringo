const express = require('express');
const router = express.Router();
const {
    generateAndSendOtp,
    verifyOtp,
    resetPassword,
} = require('../controllers/resetPasswordController');

// Route to generate and send OTP
router.post('/generate-otp', generateAndSendOtp);

// Route to verify OTP
router.post('/verify-otp', verifyOtp);

// Route to reset password
router.post('/new-password', resetPassword);

module.exports = router;