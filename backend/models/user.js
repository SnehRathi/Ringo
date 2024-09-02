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
    type: String,  // Add this field for the contact number
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // contacts: [
  //   {
  //     userId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'User'
  //     },
  //     username: String,
  //     profilePicture: String
  //   }
  // ],
  chats: [
    {
      chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
      },
      lastMessage: String,
      lastMessageDate: Date,
      unreadCount: {
        type: Number,
        default: 0
      }
    }
  ],
  // ,
  // settings: {
  //   theme: {
  //     type: String,
  //     enum: ['light', 'dark'],
  //     default: 'light'
  //   },
  //   notifications: {
  //     type: Boolean,
  //     default: true
  //   },
  //   privacy: {
  //     profileVisibility: {
  //       type: String,
  //       enum: ['public', 'contacts', 'private'],
  //       default: 'public'
  //     }
  //   }
  // }
  isLoggedIn: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
