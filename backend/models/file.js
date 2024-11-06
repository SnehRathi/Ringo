const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileUrl: {
        type: String, // URL of the uploaded file in Firebase
        trim: true,
        required: true
    },
    fileType: {
        type: String, // e.g., 'image', 'video', 'file'
        enum: ['image', 'video', 'file'], // Broad categories
        required: true
    },
    fileMimeType: {
        type: String, // e.g., 'image/jpeg', 'video/mp4'
        trim: true,
        required: true
    },
    isDownloaded: {
        type: Boolean, // Track whether the file is downloaded or not
        default: false
    },
    timestamp: {
        type: Date, // When the file was uploaded
        default: Date.now
    }
}, {
    timestamps: true // This will add createdAt and updatedAt timestamps
});

const File = mongoose.model('File', fileSchema);

module.exports = File;