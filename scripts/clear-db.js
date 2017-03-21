module.exports = {
    removeAllQuests: () => {
        removeAllItems('../models/quest');
    },

    removeAllUsers: () => {
        removeAllItems('../models/user');
    }
};

function removeAllItems(modelName) {
    return require(modelName)
        .remove({})
        .exec();
}
