const mongoose = require('mongoose');

const FoundItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  founderName: { type: String, required: true },
  founderPhoneNumber: { type: String, required: true },
  founderEmail: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', FoundItemSchema);