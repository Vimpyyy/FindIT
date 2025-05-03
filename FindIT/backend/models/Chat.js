const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room: String,
  messages: [
    {
      sender: String, // User ID of the sender
      username: String,   // OwnerName or FounderName
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;