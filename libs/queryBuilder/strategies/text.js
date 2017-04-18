const strategyBuilder = require('../strategyBuilder');
const internalProperties = require('../../../constants/controllers').questSearch.internalProperties;

module.exports = {
    canApply: key => (key === 'search'),

    apply(data) {
        return Promise.resolve({
            fields: data.field.length ? [data.field] : internalProperties,
            values: strategyBuilder.getMongoRegExp(data.text)
        });
    }
};
