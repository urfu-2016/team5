const strategies = [
    require('./strategies/author'),
    require('./strategies/text'),
    require('./strategies/images'),
    require('./strategies/likes'),
    require('./strategies/default')
];

function build(data) {
    const keys = Object.keys(data);

    const promises = keys.reduce((promises, key) => {
        const foundStrategy = strategies.find(strategy => strategy.canApply(key, data[key]));
        if (foundStrategy) {
            promises.push(foundStrategy.apply(data[key], key));
        }

        return promises;
    }, []);

    return Promise.all(promises)
        .then(promiseResults => {
            return promiseResults.reduce((acc, data) => acc.concat(data), []);
        });
}

module.exports = {build};
