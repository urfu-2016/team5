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
                const filteredParams = users.map(user => {
                    return {author: user._id};
                });

                return {
                    field: filteredParams.map(() => '$or'),
                    value: filteredParams
                };
            });
    }
};
