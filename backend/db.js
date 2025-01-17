// connectToMongoDB.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Connection URI
dotenv.config({ path: './.env' });

const uri = process.env.MONGO_URI;
async function connectToMongoDB() {
    try {
        console.log("connection called");
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        
        // Load existing models
        require('./models/user'); // Assuming you have userModel.js
        
        // Load new models
        require('./models/msg');
        require('./models/chat');
        require('./models/group');
        require('./models/file');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = connectToMongoDB;
