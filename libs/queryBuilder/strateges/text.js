const strategyBuilder = require('../strategyBuilder');

module.exports = {
    canApply: strategyBuilder.getCanApply('search'),

    apply(data) {
        return Promise.resolve({
            field: data.field.length ? [data.field] : ['city', 'title', 'description', 'tags'],
            value: strategyBuilder.getMongoRegExp(data.text)
        });
    }
};
