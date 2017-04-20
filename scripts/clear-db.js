require('../models/user');
require('../models/quest');
require('../models/account');

const mongoose = require('mongoose');

module.exports = {
    removeAllQuests: () => removeAllItems('Quest'),

    removeAllUsers: () => removeAllItems('User'),

    removeAllAccounts: () => removeAllItems('Account'),

    removeAll() {
        return Promise.all([
            removeAllItems('Quest'),
            removeAllItems('User'),
            removeAllItems('Account')
        ]);
    },

    dropAll() {
        return mongoose.connection.once('connected', () => {
            mongoose.connection.db.dropDatabase();
        });
    }
};

function removeAllItems(modelName) {
    return mongoose.model(modelName)
        .remove({})
        .exec();
}

