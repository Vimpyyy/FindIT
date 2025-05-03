const express = require('express');
const User = require('../models/User'); // Assuming you have a User model
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT

const router = express.Router();

// GET /api/users/me - Get logged-in user's details
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Fetch the user from the database using the user ID from the token
    const user = await User.findById(req.user.id).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/users/me - Update user details
router.put('/me', authMiddleware, async (req, res) => {
  const { name, email, contactNumber, gender } = req.body;

  // Validation
  if (!name || !email || !contactNumber || !gender) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, contactNumber, gender },
      { new: true, runValidators: true } // Return the updated user and validate fields
    ).select('-password'); // Exclude the password field

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Backend: Delete user account
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;