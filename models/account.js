'use strict';

const mongoose = require('../libs/mongoose-connection');
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

    password: {
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
            password: hash
        });

        return account
            .save()
            .then(() => {
                return User
                    .create({username: accountData.username})
                    .catch(err => AccountModel
                            .remove({username: accountData.username})
                            .then(() => {
                                throw err;
                            })
                    );
            });
    },

    findOne: data => AccountModel.findOne({username: data.username}).exec(),

    verifyPassword: account => {
        return AccountModel
            .find({username: account.username})
            .exec()
            .then(acc => bcrypt.compareSync(account.password, acc[0].password))
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
                acc.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));

                return acc.save();
            })
            .catch(err => {
                if (err.message === wrongPasswordMessage) {
                    // TODO: отображать ошибку пользователю
                }
            });
    }
};
