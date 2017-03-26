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
    return require('mongoose').model(modelName)
        .remove({})
        .exec();
}
