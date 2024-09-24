const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message' // Reference to the Message model
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', // Reference to the Message model for the last message
        required: false
    },
    isGroupChat: {
        type: Boolean,
        default: false // Indicates if the chat is a group chat or a direct message
    },
    groupName: {
        type: String,
        trim: true,
        required: function () { return this.isGroupChat; } // Required if the chat is a group chat
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for group admin
        required: function () { return this.isGroupChat; } // Required if the chat is a group chat
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;