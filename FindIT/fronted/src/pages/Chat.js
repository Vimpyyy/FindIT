import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { io } from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

const socket = io('http://localhost:5000'); // Backend URL

const Chat = () => {
  const [searchParams] = useSearchParams();
  const room = searchParams.get('room'); // Extract room ID from URL
  const [userId, setUserId] = useState(null); // User ID from MongoDB
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    if (!room) {
      console.error('Room ID is missing!');
      return;
    }

    // Fetch user details from the backend
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });
        setUserId(response.data.user._id); // Set the user ID from the backend
        console.log('User details fetched from backend:', response.data.user);
      } catch (error) {
        console.error('Failed to fetch user details:', error.response ? error.response.data : error.message);
      }
    };

    fetchUserDetails();

    // Join the chat room
    socket.emit('joinRoom', room);

    // Fetch chat history
    socket.on('chatHistory', (history) => {
      console.log('Chat History:', history); // Debugging
      setMessages(history);
    });

    // Listen for incoming messages
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

    return () => {
      socket.disconnect();
    };
  }, [room]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    if (!userId) {
      console.error('User ID is not available!');
      return;
    }

    const messageData = {
      room,
      sender: userId, // Current user's ID from MongoDB
      message: newMessage,
    };

    console.log('Sending Message:', messageData);

    // Emit the message to the server
    socket.emit('sendMessage', messageData);

    // Clear the input field
    setNewMessage('');
  };

  const handleCloseChat = () => {
    // Navigate back to the matched items page
    navigate('/profile'); // Replace '/matched-items' with the actual route for your matched items page
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Room</h1>
        <button className="close-chat-button" onClick={handleCloseChat}>
          Close Chat
        </button>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === userId ? 'owner' : 'other'}`}
          >
            <p>
              <strong>{msg.username}:</strong> {msg.message}
            </p>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
