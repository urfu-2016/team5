const filters = [
    require('./filters/author'),
    require('./filters/text'),
    require('./filters/stages'),
    require('./filters/likes'),
    require('./filters/default')
];

module.exports = {
    createFilter(key, value) {
        const foundFilter = filters.find(filter => filter.canApply(key, value));
        if (foundFilter) {
            return foundFilter.getFilter(value, key);
        }
    }
};
