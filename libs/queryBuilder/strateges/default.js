const getMongoRegExp = require('../strategyBuilder').getMongoRegExp;

module.exports = {
    canApply: () => true,

    apply(data, key) {
        return Promise.resolve({
            field: [key],
            value: getMongoRegExp(data)
        });
    }
};
