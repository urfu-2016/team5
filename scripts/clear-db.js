module.exports = {
    removeAllQuests() {
        require('../models/quest');
        removeAllItems('Quest');
    },

    removeAllUsers() {
        require('../models/user');
        removeAllItems('User');
    },

    removeAllAccounts() {
        require('../models/account');
        removeAllItems('Account');
    },

    clearWholeDB() {
        ['User', 'Quest', 'Account'].forEach(removeAllItems);
    }
};

function removeAllItems(modelName) {
    return require('mongoose').model(modelName)
        .remove({})
        .exec();
}
