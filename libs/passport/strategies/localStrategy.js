'use strict';

const LocalStrategy = require('passport-local').Strategy;
const Account = require('../../../models/account');

module.exports = new LocalStrategy((username, password, done) => {
    return Account
        .getAccountOnCorrectPassword({username, password})
        .then(acc => done(null, acc))
        .catch(err => done(err));
});
