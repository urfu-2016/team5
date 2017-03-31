require('../models/user');
require('../models/quest');
require('../models/account');

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
    }
};

function removeAllItems(modelName) {
    const Model = require('mongoose').model(modelName);
    return Model.remove({}).exec()
        .then(() => Model.collection.dropIndexes());
}

