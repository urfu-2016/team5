'use strict';

const mongoose = require('../libs/mongoose-connection');
const baseApi = require('../controllers/api/baseApi');
const httpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');

const wrongPasswordMessage = 'Wrong password';

const accountSchema = new mongoose.Schema({
    nickname: {
        type: String,
        lowercase: true,
        index: true,
        unique: true,
        required: true
    },

    hash: {
        type: String,
        required: true
    }
});

const AccountModel = mongoose.model('Account', accountSchema);
module.exports = {
    create: accountData => {
        const hash = bcrypt.hashSync(accountData.password, bcrypt.genSaltSync(10));
        const account = new AccountModel({
            nickname: accountData.nickname,
            hash: hash
        });

        return account
            .save()
            .then(() => {
                return AccountModel;
            })
            .catch(err => {
                const isMongoDuplicateKeyError = err.name === 'MongoError' && err.code === 11000;
                baseApi.throwErrorOnFalseValue(isMongoDuplicateKeyError, httpStatus.BAD_REQUEST);

                return false;
            });
    },

    verifyPassword: account => {
        return AccountModel
            .find({nickname: account.nickname})
            .exec()
            .then(acc => {
                return bcrypt.compareSync(account.password, acc[0].hash);
            })
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
            .then(() => {
                return AccountModel
                        .findOne({nickname: account.nickname})
                        .exec();
            })
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
