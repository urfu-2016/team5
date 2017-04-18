'use strict';

const User = require('../../../models/user');

module.exports = {
    serialize: (user, done) => done(null, user.id),

    deserialize: async (id, done) => {
        try {
            done(null, await User.findById(id));
        } catch (err) {
            done(err);
        }
    }
};
