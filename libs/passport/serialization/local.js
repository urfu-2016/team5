'use strict';

const Account = require('../../../models/account');

module.exports = {
    serialize: (user, done) => done(null, user.id),

    deserialize: (id, done) => {
        return Account
            .findById(id)
            .exec()
            .then(user => done(null, user))
            .catch(err => done(err));
    }
};
