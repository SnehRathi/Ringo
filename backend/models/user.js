const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '/profile.png'
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  chats: [
    {
      _id: { // Use _id instead of chatId
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
      },
      unreadCount: {
        type: Number,
        default: 0
      }
    }
  ],
  isLoggedIn: {
    type: Boolean,
    default: true
  },
  otp: {
    type: String, // Store the OTP
    default: null
  },
  otpExpires: {
    type: Date, // Store OTP expiration time
    default: null
  }
}, { 
  timestamps: true 
});

// Prevent automatic `_id` generation for the `chats` subdocuments
UserSchema.path('chats').schema.options._id = false;

const User = mongoose.model('User', UserSchema);

module.exports = User;
