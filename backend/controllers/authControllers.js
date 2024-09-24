const User = require('../models/user'); // Import your User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Login controller
const loginUser = async (req, res) => {
    const { password, username } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ username });

        if (!user) {
            // If user doesn't exist, throw an error
            return res.status(400).json({ message: 'User does not exist' });
        } else {
            // Compare the provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }
        }

        // Create a JWT token
        const token = jwt.sign(
            { _id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
            // {expiresIn: '30d'}  Token expires in 30 days
        );

        // Convert the Mongoose document to a plain JavaScript object
        let userData = user.toObject();

        // Remove the password hash field
        delete userData.passwordHash;

        // Respond with user data and token
        res.status(200).json({
            user: userData,
            token: token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Registration controller
const registerUser = async (req, res) => {
    const { email, contactNumber, username, password } = req.body;
    try {
        // Check if email, username, or phone number already exists in the database
        let existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username },
                { contactNumber: contactNumber }
            ]
        });        
        if (existingUser) {
            let errorMessage = '';
            if (existingUser.email === email) errorMessage += 'Email already exists. ';
            else if (existingUser.username === username) errorMessage += 'Username already exists. ';
            else if (existingUser.contactNumber === contactNumber) errorMessage += 'Phone number already exists. ';
            return res.status(400).json({ message: errorMessage.trim() });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({
            email,
            contactNumber,
            username,
            passwordHash: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        let userData = newUser.toObject();

        // Remove the password hash field
        delete userData.passwordHash;

        // Generate a JWT token
        const token = jwt.sign(
            { _id: newUser._id, username: userData.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log(userData);
        // Respond with the user data and token
        res.status(201).json({
            user: userData,
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify token controller
const verifyToken = async (req, res) => {
    // console.log("Verify Route Called");
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // bring the data of user other than the password
        const user = await User.findById(decoded._id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.status(200).json({
            user: user
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = {
    loginUser,
    verifyToken,
    registerUser
};
