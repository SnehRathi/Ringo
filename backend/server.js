const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectToMongoDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/msgRoutes');
const { sendMessage } = require('./controllers/messageController');

// Configuring the Env file 
dotenv.config({ path: '../.env' });
const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server for Express and Socket.IO
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', authRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/messages', messageRoutes);

// Connect to MongoDB
connectToMongoDB().then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User with ID: ${userId} joined room: ${userId}`);
  });

  // Handle sendMessage event from client (for both text and file messages)
  socket.on('sendMessage', async (message) => {
    try {
      const savedMessage = await sendMessage({ ...message, io });
      console.log('Message saved and emitted:', savedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Middleware to attach the io instance to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log(`URI ${process.env.MONGO_URI}`)
});