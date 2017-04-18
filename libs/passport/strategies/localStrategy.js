'use strict';

const LocalStrategy = require('passport-local').Strategy;
const User = require('../../../models/user');

module.exports = new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.getAccountOnCorrectPassword({username, password});
        done(null, user);
    } catch (err) {
        done(err);
    }
});
