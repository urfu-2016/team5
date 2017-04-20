const filterCreater = require('./filterCreater');

class QueryBuilder {
    constructor() {
        this.filtersPromises = [];
    }

    applyFilter(key, value) {
        const promise = filterCreater.createFilter(key, value);

        if (promise) {
            this.filtersPromises.push(promise);
        }

        return this;
    }

    applyFilters(data) {
        const keys = Object.keys(data);

        keys.forEach(key => {
            this.applyFilter(key, data[key]);
        });

        return this;
    }

    build() {
        return Promise.all(this.filtersPromises)
            .then(results => {
                return results.reduce((acc, data) => acc.concat(data), []);
            });
    }
}

module.exports = QueryBuilder;
