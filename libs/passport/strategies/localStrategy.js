'use strict';

const LocalStrategy = require('passport-local').Strategy;
const User = require('../../../models/user');

module.exports = new LocalStrategy(async (username, password, next) => {
    try {
        const user = await User.getUserOnCorrectPassword({username, password});
        next(null, user);
    } catch (err) {
        next(err);
    }
});
