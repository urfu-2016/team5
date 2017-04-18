const authorStrategy = require('./strateges/author');
const likesStrategy = require('./strateges/likes');
const defaultStrategy = require('./strateges/default');
const imagesStrategy = require('./strateges/images');
const textStrategy = require('./strateges/text');

function build(data) {
    const strateges = [
        authorStrategy,
        textStrategy,
        imagesStrategy,
        likesStrategy,
        defaultStrategy
    ];
    const keys = Object.keys(data);
    const promises = [];

    keys.forEach(key => {
        const foundStrategy = strateges.find(strategy => strategy.canApply(key, data[key]));
        if (foundStrategy) {
            promises.push(foundStrategy.apply(data[key], key));
        }
    });

    return Promise.all(promises)
        .then(promiseResults => {
            return promiseResults.reduce((acc, data) => acc.concat(data), []);
        });
}

module.exports = {build};
