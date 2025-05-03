const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const lostItemsRoutes = require('./routes/lostItemsRoutes');
const foundItemsRoutes = require('./routes/foundItemsRoutes');
const feedbackRoutes = require('./routes/feedback'); // Import feedback routes
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const Chat = require('./models/Chat'); // Import the Chat model
const User = require('./models/User'); // Import the User model

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lost-items', lostItemsRoutes);
app.use('/api/found-items', foundItemsRoutes);
app.use('/api/feedback', feedbackRoutes); // Add feedback routes

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle joining a room
  socket.on('joinRoom', async (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    try {
      const chat = await Chat.findOne({ room });
      if (chat) {
        console.log('Chat History:', chat.messages); // Debugging
        socket.emit('chatHistory', chat.messages);
      } else {
        console.log('No chat history found for room:', room);
      }
    } catch (error) {
      console.error('Error retrieving chat history:', error);
    }
  });

  // Handle sending a message
  socket.on('sendMessage', async (data) => {
    const { room, sender, message } = data;

    console.log('Message Data Received:', { room, sender, message });

    if (!room || !room.includes('-')) {
      console.error('Invalid room format:', room);
      return;
    }

    if (!sender) {
      console.error('Sender is missing!');
      return;
    }

    const [lostItemId, foundItemId] = room.split('-');
    console.log('Extracted IDs:', { lostItemId, foundItemId });

    let username = 'Unknown User';

    try {
      // Retrieve lost and found items
      const lostItem = await LostItem.findById(lostItemId);
      const foundItem = await FoundItem.findById(foundItemId);

      console.log('Sender ID:', sender);

      // Ensure IDs are properly compared
      if (lostItem && lostItem.user.toString() === sender) {
        username = lostItem.ownerName || 'Unknown Owner';
      } else if (foundItem && foundItem.user.toString() === sender) {
        username = foundItem.founderName || 'Unknown Founder';
      } else {
        // If sender is not associated with lost or found items, retrieve username from User collection
        const user = await User.findById(sender);
        if (user) {
          username = user.username || 'Unknown User';
        }
      }
    } catch (error) {
      console.error('Error retrieving username:', error);
    }

    console.log('Resolved Username:', username);

    try {
      // Save message to database
      let chat = await Chat.findOne({ room });
      if (!chat) {
        chat = new Chat({ room, messages: [] });
      }
      chat.messages.push({ sender, username, message, timestamp: new Date() });
      await chat.save();

      // Emit message to all users in the room
      io.to(room).emit('receiveMessage', { sender, username, message, timestamp: new Date() });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle receiving a message
  socket.on('receiveMessage', (data) => {
    console.log('New Message Received:', data); // Debugging
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        ...data,
        username: data.username || 'Unknown User', // Ensure username is always displayed
      },
    ]);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
