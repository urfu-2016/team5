require('../models/user');
require('../models/quest');
// require('../models/account');

module.exports = {
    removeAllQuests: () => removeAllItems('Quest'),

    removeAllUsers: () => removeAllItems('User'),

    removeAllAccounts: () => removeAllItems('Account'),

    clearWholeDB() {
        ['User', 'Quest', 'Account'].forEach(removeAllItems);
    }
};

function removeAllItems(modelName) {
    return require('mongoose').model(modelName)
        .remove({})
        .exec();
}
