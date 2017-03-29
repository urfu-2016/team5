'use strict';

const mongoose = require('../libs/mongoose-connection');
// const baseApi = require('../controllers/api/baseApi');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const wrongPasswordMessage = 'Wrong password';

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        index: true,
        unique: true,
        required: true,
        ref: 'User'
    },

    hash: {
        type: String,
        required: true
    }
});

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = {
    create: accountData => {
        if (!accountData.password) {
            return Promise.reject(new Error('Password required'));
        }

        const hash = bcrypt.hashSync(accountData.password, bcrypt.genSaltSync(10));
        const account = new AccountModel({
            username: accountData.username,
            hash: hash
        });

        return account
            .save()
            .then(() => User.create({username: accountData.username}));
    },

    findOne: data => AccountModel.findOne({username: data.username}).exec(),

    verifyPassword: account => {
        return AccountModel
            .find({username: account.username})
            .exec()
            .then(acc => bcrypt.compareSync(account.password, acc[0].hash))
            .then(verificationResult => {
                if (verificationResult) {
                    return verificationResult;
                }

                throw new Error(wrongPasswordMessage);
            })
            .catch(err => {
                if (err.message === wrongPasswordMessage) {
                    // TODO: отображать ошибку пользователю
                }

                throw err;
            });
    },

    changePassword: function (account, newPassword) {
        return this
            .verifyPassword(account)
            .then(() => AccountModel.findOne({username: account.username}).exec())
            .then(acc => {
                acc.hash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));

                return acc.save();
            })
            .catch(err => {
                if (err.message === wrongPasswordMessage) {
                    // TODO: отображать ошибку пользователю
                }
            });
    }
};
