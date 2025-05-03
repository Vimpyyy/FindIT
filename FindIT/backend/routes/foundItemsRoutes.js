const express = require('express');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT
const FoundItem = require('../models/FoundItem'); // Assuming you have a FoundItem model

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

// POST /api/found-items
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { itemName, description, location, founderName, founderPhoneNumber, founderEmail } = req.body;

  try {
    // Validate required fields
    if (!itemName || !description || !location || !req.file || !founderName || !founderPhoneNumber || !founderEmail) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create a new found item
    const foundItem = new FoundItem({
      itemName,
      description,
      location,
      image: req.file.path, // Save the file path
      founderName,
      founderPhoneNumber,
      founderEmail,
      user: req.user.id, // Attach the user ID from the token
    });

    // Save to the database
    await foundItem.save();
    res.status(201).json(foundItem);
  } catch (error) {
    console.error('Error saving found item:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/found-items
router.get('/', async (req, res) => {
  try {
    const foundItems = await FoundItem.find(); // Fetch all found items
    res.json(foundItems);
  } catch (error) {
    console.error('Error fetching found items:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/found-items/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);
    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    // Check if the logged-in user is the owner of the item
    if (foundItem.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this item' });
    }

    // Use deleteOne() to delete the item
    await FoundItem.deleteOne({ _id: req.params.id });

    res.json({ message: 'Found item deleted successfully' });
  } catch (error) {
    console.error('Error deleting found item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/found-items/:id
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);
    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    // Check if the logged-in user is the owner of the item
    if (foundItem.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to edit this item' });
    }

    const { itemName, description, location, founderName, founderPhoneNumber, founderEmail } = req.body;

    // Update the fields if provided
    if (itemName) foundItem.itemName = itemName;
    if (description) foundItem.description = description;
    if (location) foundItem.location = location;
    if (req.file) foundItem.image = req.file.path; // Update the image if a new one is uploaded
    if (founderName) foundItem.founderName = founderName;
    if (founderPhoneNumber) foundItem.founderPhoneNumber = founderPhoneNumber;
    if (founderEmail) foundItem.founderEmail = founderEmail;

    const updatedItem = await foundItem.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating found item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;