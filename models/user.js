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

    email: {
        type: String,
        lowercase: true,
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

userSchema.statics.create = async function ({username, email, password}) {
    if (!password) {
        throw new Error(constants.models.user.passwordRequiredMessage);
    }

    try {
        const user = new this({
            username,
            email,
            password: await bcrypt.hash(password, constants.models.user.saltRounds)
        });

        return await user.save();
    } catch (err) {
        if (err.code === constants.mongoose.mongoDuplicateErrorCode) {
            err.message = constants.models.user.alreadyExistsPattern(username);
        }

        throw err;
    }
};

userSchema.statics.changePassword = async function (account, newPassword) {
    const user = await this.getUserOnCorrectPassword(account);
    user.password = await bcrypt.hash(newPassword, constants.models.user.saltRounds);

    return user.save();
};

userSchema.statics.getUserOnCorrectPassword = async function (account) {
    const user = await this.findOne({username: account.username});
    if (user && await bcrypt.compare(account.password, user.password)) {
        return user;
    }

    throw new Error(constants.models.user.wrongPasswordOrNameMessage);
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

userSchema.statics.removeByUsername = function (username) {
    return this.remove({username});
};

module.exports = mongoose.model('User', userSchema);
