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
    let result = [];

    const promises = keys.map(key => {
        return strateges
            .find(strategy => strategy.canApply(key, data[key]))
            .apply(data[key], key)
            .then(buildData => {
                result = result.concat(buildData);
            });
    });

    return Promise.all(promises)
        .then(() => {
            return result;
        });
}

module.exports = {build};
