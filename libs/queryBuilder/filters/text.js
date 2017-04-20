const internalProperties = require('../../../constants/controllers').questSearch.internalProperties;

module.exports = {
    canApply: key => (key === 'search'),

    getFilter(data) {
        return Promise.resolve({
            fields: data.field.length ? [data.field] : internalProperties,
            values: {$regex: data.text, $options: 'i'}
        });
    }
};
