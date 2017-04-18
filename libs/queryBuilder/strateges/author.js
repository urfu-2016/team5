const User = require('../../../models/user');

module.exports = {
    canApply(key, data) {
        if (key === 'search' && data.field === 'author') {
            return true;
        }

        return false;
    },

    apply(data) {
        return User.find({username: {$regex: data.text, $options: 'i'}})
            .then(users => {
                let filteredParams = users.map(user => {
                    return {author: user._id};
                });
                filteredParams = filteredParams.length ? filteredParams : [{author: null}];

                return {
                    field: filteredParams.map(() => '$or'),
                    value: filteredParams
                };
            });
    }
};
