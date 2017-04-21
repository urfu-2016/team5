const User = require('../../../models/user');

module.exports = {
    canApply: (key, data) => key === 'search' && data.field === 'author',

    getFilter(data) {
        return User.find({username: {$regex: data.text, $options: 'i'}})
            .then(users => {
                let authorIds = users.map(user => ({author: user._id}));
                authorIds = authorIds.length ? authorIds : [{author: null}];

                return {
                    fields: authorIds.map(() => '$or'),
                    values: authorIds
                };
            });
    }
};
