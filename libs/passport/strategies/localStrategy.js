'use strict';

const LocalStrategy = require('passport-local').Strategy;
const AccountModel = require('../../../models/account');

module.exports = new LocalStrategy((username, password, done) => {
    return AccountModel
        .getAccountOnCorrectPassword({username, password})
        .then(acc => done(null, acc))
        .catch(err => done(err));
});
