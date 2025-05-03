const LostItem = require('../models/LostItem');

exports.addLostItem = async (req, res) => {
    const lostItem = new LostItem({ ...req.body, userId: req.user.id });
    await lostItem.save();
    res.json(lostItem);
};