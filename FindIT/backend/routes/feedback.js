const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { verifyToken } = require('../middleware/auth'); // Middleware to verify JWT
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('userId', 'name');
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
});

// Get feedback for a specific user
router.get('/user', verifyToken, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.id });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user feedback.' });
  }
});

// Get a specific feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found.' });
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
});

// Add new feedback
router.post('/', verifyToken, async (req, res) => {
  console.log('Request body:', req.body); // Debugging
  console.log('User ID:', req.user.id); // Debugging

  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ error: 'Feedback content is required.' });
  }

  try {
    const newFeedback = new Feedback({
      feedback,
      userId: req.user.id,
      authorName: req.user.name || 'Anonymous',
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    console.error('Error saving feedback:', err); // Debugging
    res.status(500).json({ error: 'Failed to add feedback.' });
  }
});

// Update feedback
router.put('/:id', verifyToken, async (req, res) => {
  const { feedback } = req.body;

  console.log('Request body:', req.body); // Debugging
  console.log('Feedback ID:', req.params.id); // Debugging
  console.log('User ID:', req.user.id); // Debugging

  if (!feedback) {
    return res.status(400).json({ error: 'Feedback content is required.' });
  }

  try {
    const existingFeedback = await Feedback.findById(req.params.id);

    if (!existingFeedback) {
      console.error('Feedback not found for ID:', req.params.id); // Debugging
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    if (existingFeedback.userId.toString() !== req.user.id) {
      console.error('Unauthorized access by user:', req.user.id); // Debugging
      return res.status(403).json({ error: 'You can only edit your own feedback.' });
    }

    existingFeedback.feedback = feedback;
    const updatedFeedback = await existingFeedback.save();
    console.log('Feedback updated successfully:', updatedFeedback); // Debugging
    res.status(200).json(updatedFeedback);
  } catch (err) {
    console.error('Error updating feedback:', err); // Debugging
    res.status(500).json({ error: 'Failed to update feedback.' });
  }
});

// Delete feedback
router.delete('/:id', verifyToken, async (req, res) => {
  console.log('Feedback ID:', req.params.id); // Debugging
  console.log('User ID:', req.user.id); // Debugging

  // Validate the feedback ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error('Invalid feedback ID:', req.params.id); // Debugging
    return res.status(400).json({ error: 'Invalid feedback ID.' });
  }

  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      console.error('Feedback not found for ID:', req.params.id); // Debugging
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    if (feedback.userId.toString() !== req.user.id) {
      console.error('Unauthorized access by user:', req.user.id); // Debugging
      return res.status(403).json({ error: 'You can only delete your own feedback.' });
    }

    // Use findByIdAndDelete to delete the feedback
    await Feedback.findByIdAndDelete(req.params.id);
    console.log('Feedback deleted successfully:', req.params.id); // Debugging
    res.status(200).json({ message: 'Feedback deleted successfully.' });
  } catch (err) {
    console.error('Error deleting feedback:', err); // Debugging
    res.status(500).json({ error: 'Failed to delete feedback.' });
  }
});

module.exports = router;