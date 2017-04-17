require('../models/user');
require('../models/quest');
require('../models/user');

const mongoose = require('mongoose');

module.exports = {
    removeAllQuests: () => removeAllItems('Quest'),

    removeAllUsers: () => removeAllItems('User'),

    removeAllAccounts: () => removeAllItems('User'),

    removeAll() {
        return Promise.all([
            removeAllItems('Quest'),
            removeAllItems('User'),
            removeAllItems('User')
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

