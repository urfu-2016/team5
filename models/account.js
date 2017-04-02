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

const AccountModel = mongoose.model('Account', accountSchema);

const saltRounds = 10;

module.exports = {
    create: accountData => {
        if (!accountData.password) {
            return Promise.reject(new Error(constants.accountModel.passwordRequiredMessage));
        }

        return User
            .create({username: accountData.username})
            .then(user => {
                return bcrypt
                    .hash(accountData.password, saltRounds)
                    .then(hash => new AccountModel({
                        username: accountData.username,
                        password: hash,
                        user: user._id
                    }))
                    .then(account => account.save())
                    .catch(err => {
                        User.removeByUsername(accountData.username);
                        throw err;
                    });
            });
    },

    verifyPassword: account => {
        return AccountModel
            .findOne({username: account.username})
            .exec()
            .then(acc => bcrypt.compare(account.password, acc.password));
    },

    changePassword: function (account, newPassword) {
        return this
            .verifyPassword(account)
            .then(verificationResult => {
                if (!verificationResult) {
                    throw new Error(constants.accountModel.wrongPasswordMessage);
                }
            })
            .then(() => AccountModel.findOne({username: account.username}).exec())
            .then(acc => {
                return bcrypt
                    .hash(newPassword, saltRounds)
                    .then(hash => {
                        acc.password = hash;

                        return acc.save();
                    });
            });
    }
};
