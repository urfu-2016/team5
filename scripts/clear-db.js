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
        return mongoose.connection.db.dropDatabase(err => {
            if (err) {
                console.log(err);
            }
        });
    }
};

function removeAllItems(modelName) {
    return mongoose.model(modelName)
        .remove({})
        .exec();
}

