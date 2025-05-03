const FoundItem = require('../models/FoundItem');

exports.addFoundItem = async (req, res) => {
    const foundItem = new FoundItem({ ...req.body, userId: req.user.id });
    await foundItem.save();
    res.json(foundItem);
};