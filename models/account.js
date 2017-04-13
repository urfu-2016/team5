'use strict';

const mongoose = require('../libs/mongoose-connection');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const constants = require('../constants/constants');

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        index: true,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const saltRounds = 10;

function setPasswordAndUser(user, accountData) {
    return bcrypt
        .hash(accountData.password, saltRounds)
        .then(hash => new this({
            username: accountData.username,
            password: hash,
            user: user._id
        }));
}

accountSchema.statics.create = function (accountData) {
    if (!accountData.password) {
        return Promise.reject(new Error(constants.models.Account.passwordRequiredMessage));
    }

    return User
        .create({username: accountData.username})
        .catch(err => {
            if (err.code === constants.mongoose.mongoDuplicateErrorCode) {
                err.message = constants.models.Account.alreadyExistsPattern(accountData.username);
            }

            throw err;
        })
        .then(user => setPasswordAndUser.call(this, user, accountData))
        .then(account => {
            return account
                .save()
                .catch(err => {
                    User.removeByUsername(accountData.username);

                    throw err;
                });
        });
};

accountSchema.statics.verifyPassword = function (account) {
    return this
        .findOne({username: account.username})
        .exec()
        .then(acc => acc ? bcrypt.compare(account.password, acc.password) : false);
};

accountSchema.statics.changePassword = function (account, newPassword) {
    return this
        .getAccountOnCorrectPassword(account)
        .then(acc => {
            return bcrypt
                .hash(newPassword, saltRounds)
                .then(hash => {
                    acc.password = hash;

                    return acc.save();
                });
        });
};

accountSchema.statics.getAccountOnCorrectPassword = function (account) {
    return this
        .verifyPassword(account)
        .then(verificationResult => {
            if (!verificationResult) {
                throw new Error(constants.models.Account.wrongPasswordOrNameMessage);
            }

            return this
                .findOne({username: account.username})
                .exec();
        });
};

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = AccountModel;
