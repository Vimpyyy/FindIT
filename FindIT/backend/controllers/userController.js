const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    // Fetch the user from the database, excluding the password field
    const user = await User.findById(req.user.id).select('-password');
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the user details
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};