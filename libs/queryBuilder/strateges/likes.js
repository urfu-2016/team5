const getCanApply = require('../strategyBuilder').getCanApply;

module.exports = {
    canApply: getCanApply('likesCount'),

    apply(data) {
        return Promise.resolve({
            field: ['$where'],
            value: `this.likes.length >= ${Number(data)}`
        });
    }
};
