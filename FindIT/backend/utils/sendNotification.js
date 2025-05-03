const sendEmail = require('../config/emailConfig');

const notifyUser = async (email, itemName) => {
    await sendEmail(email, 'Item Found!', `Your lost item "${itemName}" has been found!`);
};

module.exports = notifyUser;