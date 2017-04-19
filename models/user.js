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

userSchema.statics.create = async function ({username, password}) {
    if (!password) {
        throw new Error(constants.models.User.passwordRequiredMessage);
    }

    try {
        const user = new this({
            username,
            password: await bcrypt.hash(password, saltRounds)
        });

        return await user.save();
    } catch (err) {
        if (err.code === constants.mongoose.mongoDuplicateErrorCode) {
            err.message = constants.models.User.alreadyExistsPattern(username);
        }

        throw err;
    }
};

userSchema.statics.verifyPassword = async function (account) {
    const user = await this.findOne({username: account.username});

    return user ? bcrypt.compare(account.password, user.password) : false;
};

userSchema.statics.changePassword = async function (account, newPassword) {
    const user = await this.getAccountOnCorrectPassword(account);
    user.password = await bcrypt.hash(newPassword, saltRounds);

    return user.save();
};

userSchema.statics.getAccountOnCorrectPassword = async function (account) {
    if (await this.verifyPassword(account)) {
        return await this.findOne({username: account.username});
    }

    throw new Error(constants.models.User.wrongPasswordOrNameMessage);
};

userSchema.statics.update = async function (username, {firstname, surname}) {
    const user = await this.findOne({username});
    user.firstname = firstname ? firstname : user.firstname;
    user.surname = surname ? surname : user.surname;

    return await user.save();
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

userSchema.statics.removeByUsername = async function (username) {
    const user = await this.findOne({username});

    return user.remove();
};

module.exports = mongoose.model('User', userSchema);
