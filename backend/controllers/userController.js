const User = require('../models/user'); // Import your User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define a secret key for JWT (use an environment variable in production)
const JWT_SECRET = 'your_jwt_secret_key';

// Login controller
const loginUser = async (req, res) => {
    console.log("Call to Login")
    const { email, password, username } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, create a new user
            const hashedPassword = await bcrypt.hash(password, 12);

            user = new User({
                username,
                email,
                passwordHash: hashedPassword
            });

            await user.save();
        } else {
            // Compare the provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            else{
                console.log("Password Matched")
            }
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
        
        // Respond with user data and token
        res.status(200).json({
            user: user,
            token
        });
        console.log("Token Set")
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify token controller
const verifyToken = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

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
    verifyToken
};
