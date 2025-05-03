const express = require('express');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT
const LostItem = require('../models/LostItem'); // Assuming you have a LostItem model

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Add a timestamp to the file name
  },
});
const upload = multer({ storage });

// POST /api/lost-items
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { itemName, description, location, ownerName, ownerPhoneNumber, ownerEmail, ownerAddress } = req.body;

  try {
    // Validate required fields
    if (!itemName || !description || !location || !req.file || !ownerName || !ownerPhoneNumber || !ownerEmail || !ownerAddress) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create a new lost item
    const lostItem = new LostItem({
      itemName,
      description,
      location,
      image: req.file.path, // Save the file path
      ownerName,
      ownerPhoneNumber,
      ownerEmail,
      ownerAddress,
      user: req.user.id, // Attach the user ID from the token
    });

    // Save to the database
    await lostItem.save();
    res.status(201).json(lostItem);
  } catch (error) {
    console.error('Error saving lost item:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// GET /api/lost-items
router.get('/', async (req, res) => {
  try {
    const lostItems = await LostItem.find(); // Fetch all lost items
    res.json(lostItems);
  } catch (error) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// DELETE /api/lost-items/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    // Check if the logged-in user is the owner of the item
    if (lostItem.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this item' });
    }

    // Use deleteOne() to delete the item
    await LostItem.deleteOne({ _id: req.params.id });

    res.json({ message: 'Lost item deleted successfully' });
  } catch (error) {
    console.error('Error deleting lost item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/lost-items/:id
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    // Check if the logged-in user is the owner of the item
    if (lostItem.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to edit this item' });
    }

    const { itemName, description, location, ownerName, ownerPhoneNumber, ownerEmail, ownerAddress } = req.body;

    // Update the fields if provided
    if (itemName) lostItem.itemName = itemName;
    if (description) lostItem.description = description;
    if (location) lostItem.location = location;
    if (req.file) lostItem.image = req.file.path; // Update the image if a new one is uploaded
    if (ownerName) lostItem.ownerName = ownerName;
    if (ownerPhoneNumber) lostItem.ownerPhoneNumber = ownerPhoneNumber;
    if (ownerEmail) lostItem.ownerEmail = ownerEmail;
    if (ownerAddress) lostItem.ownerAddress = ownerAddress;

    const updatedItem = await lostItem.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating lost item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;