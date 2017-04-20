module.exports = {
    canApply: key => (key === 'likesCount'),

    getFilter(data) {
        return Promise.resolve({
            fields: ['$where'],
            values: `this.likes.length >= ${Number(data)}`
        });
    }
};
