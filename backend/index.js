const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToMongoDB = require('./db');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors()); // Use cors middleware correctly
app.use('/api', userRoutes);


connectToMongoDB().then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
