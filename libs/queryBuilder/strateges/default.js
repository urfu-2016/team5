const getMongoRegExp = require('../strategyBuilder').getMongoRegExp;
const canApplyKeys = ['city'];

module.exports = {
    canApply: key => {
        if (canApplyKeys.indexOf(key) >= 0) {
            return true;
        }

        return false;
    },

    apply(data, key) {
        return Promise.resolve({
            field: [key],
            value: getMongoRegExp(data)
        });
    }
};
