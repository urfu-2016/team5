module.exports = () => {
    return require('../models/quest')
        .remove({})
        .exec();
};
