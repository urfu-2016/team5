module.exports = {
    canApply: key => (key === 'stages'),

    getFilter(data) {
        return Promise.resolve([
            {
                fields: ['$where'],
                values: `this.stages.length >= ${data.from}`
            },

            {
                fields: ['$where'],
                values: `this.stages.length <= ${data.to}`
            }
        ]);
    }
};
