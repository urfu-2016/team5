'use strict';

const LocalStrategy = require('passport-local').Strategy;
const User = require('../../../models/user');

module.exports = new LocalStrategy({usernameField: 'login'}, async (login, password, next) => {
    try {
        let userData = login.includes('@') ? {email: login} : {username: login};
        userData.password = password;

        const user = await User.getUserOnCorrectPassword(userData);
        next(null, user);
    } catch (err) {
        next(err);
    }
});
