'use strict';

const LocalStrategy = require('passport-local').Strategy;
const AccountModel = require('../../../models/account');
const mongoose = require('../../../libs/mongoose-connection');
const constants = require('../../../constants/constants').models.Account;

module.exports = new LocalStrategy((username, password, done) => {
    return AccountModel
        .verifyPassword({username, password})
        .then(result => {
            if (!result) {
                throw new Error(constants.wrongPasswordOrNameMessage);
            }
        })
        .then(() => mongoose.model('Account').findOne({username}).exec())
        .then(acc => done(null, acc))
        .catch(err => done(err));
});
