const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const bcrypt = require('bcryptjs');
const { login } = require('../controllers/authController'); // Import the login function
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT

// Registration endpoint
router.post('/register', async (req, res) => {
  const { username, password, email, contactNumber, name, gender } = req.body;

  // Validation
  if (!username || !password || !email || !contactNumber || !name || !gender) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Check if email is already registered
    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create new user
    user = new User({
      username,
      password,
      email,
      contactNumber,
      name,
      gender,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error); // Log the error for debugging
    res.status(500).json({ success: false, message: 'An unexpected error occurred', error });
  }
});

// Login endpoint
router.post('/login', login); // Add the login route

// GET /api/auth/user - Fetch logged-in user's details
router.get('/user', authMiddleware, async (req, res) => {
  try {
    // Find the user by ID (from the JWT token)
    const user = await User.findById(req.user.id).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: { _id: user._id, username: user.username } }); // Return ID and username
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;