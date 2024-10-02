const mongoose = require('mongoose');
const File = require('./file'); // Import the file schema

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return !this.grp;
        }
    },
    grp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: function () {
            return !this.recipient;
        }
    },
    content: {
        type: String,
        trim: true,
    },
    file: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the file schema
        ref: 'File',
        required: function () {
            return !!this.content; // Only required if there is no text content
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Pre-validation hook to ensure either recipient or group is provided
messageSchema.pre('validate', function (next) {
    if (!this.recipient && !this.grp) {
        next(new Error('Either recipient or grp must be specified'));
    } else {
        next();
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;