'use strict';

const mongoose = require('../../mongoose-connection');
require('../../../models/account');

module.exports = {
    serialize: (user, done) => done(null, user.id),

    deserialize: (id, done) => {
        return mongoose
            .model('Account')
            .findById(id)
            .exec()
            .then(user => done(null, user))
            .catch(err => done(err));
    }
};
