const canApplyKeys = require('../../../constants/controllers').questSearch.searchFields;

module.exports = {
    canApply: key => canApplyKeys.indexOf(key) >= 0,

    getFilter(data, key) {
        return Promise.resolve({
            fields: [key],
            values: {$regex: data, $options: 'i'}
        });
    }
};
