module.exports = {
    canApply: key => (key === 'likesCount'),

    apply(data) {
        return Promise.resolve({
            fields: ['$where'],
            values: `this.likes.length >= ${Number(data)}`
        });
    }
};
