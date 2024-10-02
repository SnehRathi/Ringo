const jwt = require('jsonwebtoken');

// MongoDB JWT Auth Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract JWT token
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify MongoDB JWT token
        req.user = decoded; // Attach the decoded user information to the request
        next(); // Proceed
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authMiddleware };
