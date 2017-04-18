const getCanApply = require('../strategyBuilder').getCanApply;

module.exports = {
    canApply: getCanApply('images'),

    apply(data) {
        return Promise.resolve([
            {
                field: ['$where'],
                value: `this.images.length >= ${data.from}`
            },

            {
                field: ['$where'],
                value: `this.images.length <= ${data.to}`
            }
        ]);
    }
};
