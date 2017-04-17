'use strict';

const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcrypt');
const constants = require('../constants/constants');

const userSchema = new mongoose.Schema({
    firstname: String,
    surname: String,
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

    createdQuests: {
        type: [{type: ObjectId, ref: 'Quest'}],
        default: []
    },

    quests: {
        type: [{
            questId: {type: ObjectId, ref: 'Quest'},
            statuses: [Boolean]
        }],
        default: []
    }
});

const saltRounds = 10;

userSchema.statics.create = function ({username, password}) {
    if (!password) {
        return Promise.reject(new Error(constants.models.User.passwordRequiredMessage));
    }

    return bcrypt
        .hash(password, saltRounds)
        .then(hash => new this({
            username,
            password: hash
        }))
        .then(user => user.save())
        .catch(err => {
            if (err.code === constants.mongoose.mongoDuplicateErrorCode) {
                err.message = constants.models.User.alreadyExistsPattern(username);
            }

            throw err;
        });
};

userSchema.statics.verifyPassword = function (account) {
    return this
        .findOne({username: account.username})
        .exec()
        .then(acc => acc ? bcrypt.compare(account.password, acc.password) : false);
};

userSchema.statics.changePassword = function (account, newPassword) {
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

userSchema.statics.getAccountOnCorrectPassword = function (account) {
    return this
        .verifyPassword(account)
        .then(verificationResult => {
            if (!verificationResult) {
                throw new Error(constants.models.User.wrongPasswordOrNameMessage);
            }

            return this
                .findOne({username: account.username})
                .exec();
        });
};

userSchema.statics.update = function (username, {firstname, surname}) {
    return this
        .findOne({username})
        .then(user => {
            user.firstname = firstname ? firstname : user.firstname;
            user.surname = surname ? surname : user.surname;

            return user.save();
        });
};

userSchema.statics.getAll = function () {
    return this.find({});
};

userSchema.statics.getByUsername = function (username) {
    return this.findOne({username});
};

userSchema.statics.getById = function (id) {
    return this.findById(id);
};

userSchema.statics.removeByUsername = function (username) {
    return this
        .findOne({username})
        .then(user => user.remove());
};

module.exports = mongoose.model('User', userSchema);
