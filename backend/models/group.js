const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String, // URL or path to the group's avatar image
        default: '/favicon.png'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
