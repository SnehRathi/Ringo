// controllers/userController.js
const User = require('../models/user'); // Import the User model

// Controller to fetch all users
const getAllUsers = async (req, res) => {
    const userId = req.params.userId;

    try {
        const users = await User.find(
            { _id: { $ne: userId } }, // Exclude the current user
            'username profilePicture'
        ); // Fetch all users except the current user, only selecting required fields
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllUsers,
};
