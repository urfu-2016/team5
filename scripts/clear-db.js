module.exports = {
    removeAllQuests: () => {
        require('../models/quest');
        removeAllItems('Quest');
    },

    removeAllUsers: () => {
        require('../models/user');
        removeAllItems('User');
    }
};

function removeAllItems(modelName) {
    return require('mongoose').model(modelName)
        .remove({})
        .exec();
}
