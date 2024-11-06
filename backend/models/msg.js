const mongoose = require('mongoose');
const File = require('./file'); // Import the file schema

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true,
    },
    file: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the file schema
        ref: 'File',
        required: function () {
            return !this.content; // File is only required if there is no text content
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Track users who have seen the message
        }
    ],
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat', // Reference to the Chat model
        required: true
    }
}, {
    timestamps: true
});

messageSchema.methods.markAsSeen = function (userId) {
    if (!this.seenBy.includes(userId)) {
        this.seenBy.push(userId); // Add user to seenBy array if not already present
    }
    return this.save();
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;