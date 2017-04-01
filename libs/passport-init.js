'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AccountModel = require('../models/account');
const User = require('../models/user');

const strategy = new LocalStrategy((nickname, password, done) => {
    return AccountModel
        .create({nickname, password})
        .then(() => {
            return AccountModel
                .findOne({nickname});
        })
        .then(account => {
            if (!account) {
                return done(null, false, {message: 'Неверное имя пользователя.'});
            }

            if (!AccountModel.verifyPassword({nickname, password})) {
                return done(null, false, {message: 'Неверный пароль.'});
            }

            // return User
            //     .findOne({nickname})
            //     .exec();

            return User
                .find({nickname})
                .exec();
        })
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
});

passport.use(strategy);

module.exports = passport;
