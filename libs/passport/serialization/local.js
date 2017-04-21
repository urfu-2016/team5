'use strict';

const User = require('../../../models/user');

module.exports = {
    serialize: (user, next) => next(null, user.id),

    deserialize: async (id, next) => {
        try {
            next(null, await User.findById(id));
        } catch (err) {
            next(err);
        }
    }
};
