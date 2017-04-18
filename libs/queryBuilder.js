const User = require('../models/user');

function getMongoRegExp(searchString) {
    return {$regex: searchString, $options: 'i'};
}

function getCanApply(property) {
    return key => {
        if (key === property) {
            return true;
        }

        return false;
    };
}

const textStrategy = {
    canApply: getCanApply('search'),

    apply(data) {
        return {
            field: data.field || ['city', 'title', 'description', 'tags'],
            value: getMongoRegExp(data.text)
        };
    }
};

const imagesStrategy = {
    canApply: getCanApply('images'),

    apply(data) {
        return [
            {
                field: ['images'],
                value: {$gte: data.from}
            },

            {
                field: ['images'],
                value: {$lte: data.to}
            }
        ];
    }
};

const authorStrategy = {
    canApply(key, data) {
        if (key === 'search' && data.field === 'author') {
            return true;
        }

        return false;
    },

    apply(data) {
        return User.find({username: {$regex: data.text, $options: 'i'}})
            .then(users => {
                 return {
                    field: ['author'],
                    value: getMongoRegExp()
                    // users.map(user => user._id)
                };
            });
    }
};

const defaultStrategy = {
    canApply: () => true,

    apply(data, key) {
        return {
            field: [key],
            value: getMongoRegExp(data)
        };
    }
};

async function build(data) {
    const strateges = [textStrategy, imagesStrategy, defaultStrategy];
    const keys = Object.keys(data);

    const result = [];
    for (let i = 0; i < keys.length; i++) {
        const findStrategy = strateges.find(strategy => {
            return strategy.canApply(key, data[key]);
        });

        const resultObject = await findStrategy.apply(data[key], key);
        result = result.concat(resultObject);
    }

    return result;
}

module.exports = {build};
