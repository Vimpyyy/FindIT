const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, password, email, contactNumber, name, gender } = req.body;
  console.log('Register request received:', { username, email, contactNumber, name, gender });

  // Validation
  if (!username || !password || !email || !contactNumber || !name || !gender) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      console.log('User already exists:', username);
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Check if email is already registered
    user = await User.findOne({ email });
    if (user) {
      console.log('Email already registered:', email);
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
    console.log('User registered successfully:', username);
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body; // Use email instead of username
  console.log('Login request received:', { email });

  // Validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User logged in successfully:', email);
    res.status(200).json({ success: true, token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};