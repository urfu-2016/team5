const getMongoRegExp = require('../strategyBuilder').getMongoRegExp;
const canApplyKeys = require('../../../constants/controllers').questSearch.searchFields;

module.exports = {
    canApply: key => canApplyKeys.indexOf(key) >= 0,

    apply(data, key) {
        return Promise.resolve({
            fields: [key],
            values: getMongoRegExp(data)
        });
    }
};
