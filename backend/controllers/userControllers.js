// controllers/userController.js
const User = require('../models/user'); // Import the User model

// Controller to fetch all users
const getAllUsers = async (req, res) => {
    
    try {
        const users = await User.find({}, 'username profilePicture'); // Fetch all users, only select username and profilePicture fields
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllUsers,
};
