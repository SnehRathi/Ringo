const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: function () {
            return !this.grp; // recipient is required if grp is not present
        }
    },
    grp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group', // Reference to the ChatRoom model
        required: function () {
            return !this.recipient; // grp is required if recipient is not present
        }
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file'], // Example of message types
        default: 'text'
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Ensure that either recipient or grp is present, but not both
messageSchema.pre('validate', function (next) {
    if (!this.recipient && !this.grp) {
        next(new Error('Either recipient or grp must be specified'));
    } else {
        next();
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
