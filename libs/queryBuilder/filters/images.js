module.exports = {
    canApply: key => (key === 'images'),

    getFilter(data) {
        return Promise.resolve([
            {
                fields: ['$where'],
                values: `this.images.length >= ${data.from}`
            },

            {
                fields: ['$where'],
                values: `this.images.length <= ${data.to}`
            }
        ]);
    }
};
