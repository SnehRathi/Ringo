const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Adjust the path as needed

// Generate and Send OTP for Password Reset
const generateAndSendOtp = async (req, res) => {
    const { email } = req.body;
    // console.log("Generate and Send OTP controller");

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        // Update user document with the OTP and expiration time
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        // Send OTP via email (example using Nodemailer)
        // creating an SMTP server for sending the mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.APP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify OTP for Password Reset
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP matches and is not expired
        if (user.otp !== otp || new Date() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP after successful verification
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        // console.log("OTP verified")
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password after OTP Verification
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const passwordHash = await bcrypt.hash(newPassword, 12);

        // Update the user's password
        user.passwordHash = passwordHash;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { generateAndSendOtp, verifyOtp, resetPassword };
