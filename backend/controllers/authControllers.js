const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Your User model
const admin = require('../config/firebaseAdmin')

// Login controller
const loginUser = async (req, res) => {
    const { password, credential } = req.body;
    try {
        // Find user by either username or email
        let user = await User.findOne({
            $or: [{ username: credential }, { email: credential }]
        });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Compare provided password with stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token for MongoDB authentication
        const token = jwt.sign(
            { _id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Generate Firebase custom token
        const firebaseToken = await admin.auth().createCustomToken(user._id.toString());

        // Prepare user data excluding password hash
        let userData = user.toObject();
        delete userData.passwordHash;

        // Send tokens to client
        res.status(200).json({
            user: userData,
            token: token,
            firebaseToken: firebaseToken
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



// Registration Controller (MongoDB)
const registerUser = async (req, res) => {
    const { email, contactNumber, username, password } = req.body;

    try {
        // Check if email, username, or phone number already exists in MongoDB
        let existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username },
                { contactNumber: contactNumber },
            ],
        });

        if (existingUser) {
            let errorMessage = '';
            if (existingUser.email === email) errorMessage += 'Email already exists. ';
            if (existingUser.username === username) errorMessage += 'Username already exists. ';
            if (existingUser.contactNumber === contactNumber) errorMessage += 'Phone number already exists. ';
            return res.status(400).json({ message: errorMessage.trim() });
        }

        // Hash the password and create a new MongoDB user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            email,
            contactNumber,
            username,
            passwordHash: hashedPassword,
        });

        await newUser.save();

        // Generate a Firebase custom token
        const firebaseToken = await admin.auth().createCustomToken(newUser._id.toString());

        const userData = newUser.toObject();
        delete userData.passwordHash;

        // Generate a JWT token for MongoDB
        const token = jwt.sign(
            { _id: newUser._id, username: userData.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Send both MongoDB JWT and Firebase custom token to the client
        res.status(201).json({
            user: userData,
            token,
            firebaseToken
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify MongoDB JWT token
const verifyToken = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // console.log("User in verifyToken controller ",user)
        res.status(200).json({ user });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { loginUser, registerUser, verifyToken };
