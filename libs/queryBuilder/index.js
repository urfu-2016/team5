const filterCreater = require('./filterCreater');

class QueryBuilder {
    constructor() {
        this.filters = [];
    }

    applyFilter(key, value) {
        const filter = filterCreater.createFilter(key, value);

        if (filter) {
            this.filters.push(filter);
        }

        return this;
    }

    applyFilters(data) {
        const keys = Object.keys(data);
        keys.forEach(key => this.applyFilter(key, data[key]));

        return this;
    }

    async build() {
        const buildData = await Promise.all(this.filters);

        return buildData.reduce((acc, data) => acc.concat(data), []);
    }
}

module.exports = QueryBuilder;
