'use strict';

const passport = require('passport');
const mongoose = require('../mongoose-connection');
require('../../models/account');

passport.use(require('./strategies/localStrategy'));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    return mongoose
        .model('Account')
        .findById(id)
        .exec()
        .then(user => done(null, user))
        .catch(err => done(err));
});

module.exports = passport;
