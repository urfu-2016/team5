'use strict';

const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcrypt');
const Quest = require('./quest');
const constants = require('../constants/constants');

const userSchema = new mongoose.Schema({
    firstname: String,
    surname: String,
    registrationDate: {type: Date, default: Date.now},
    emailVerified: {type: Boolean, default: false},
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

    quests: [{
        slug: String,
        stagesStatuses: [String]
    }]
});

userSchema.statics.create = async function ({username, email, password}) {
    if (!password) {
        throw new Error(constants.models.user.passwordRequiredMessage);
    }

    if (!constants.models.user.emailRegEx.test(email)) {
        throw new Error(constants.models.user.incorrectEmail);
    }

    try {
        const user = new this({
            username,
            email: email.toLowerCase(),
            password: await bcrypt.hash(password, constants.models.user.saltRounds)
        });

        return await user.save();
    } catch (err) {
        if (err.code === constants.mongoose.mongoDuplicateErrorCode) {
            if (err.errmsg.includes('email')) {
                err.message = constants.models.user.alreadyExistsPattern(email);
            } else if (err.errmsg.includes('username')) {
                err.message = constants.models.user.alreadyExistsPattern(username);
            }
        } else if (err.name === constants.mongoose.validationErrorName) {
            err.message = constants.models.user.emptySignUpField;
        }

        throw err;
    }
};

userSchema.statics.changePassword = async function (userData, newPassword) {
    const user = await this.getUserOnCorrectPassword(userData);
    user.password = await bcrypt.hash(newPassword, constants.models.user.saltRounds);

    return user.save();
};

userSchema.statics.resetPassword = async function (userData, newPassword) {
    const user = await this.findOne(
        userData.email ? {email: userData.email} : {username: userData.username}
    );
    user.password = await bcrypt.hash(newPassword, constants.models.user.saltRounds);

    return user.save();
};

userSchema.statics.getUserOnCorrectPassword = async function (userData) {
    const user = await this.findOne(
        userData.email ?
            {email: userData.email.toLowerCase()} :
            {username: userData.username.toLowerCase()}
    );

    if (user && await bcrypt.compare(userData.password, user.password)) {
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

userSchema.methods.getQuestStatus = function (slug) {
    return this.quests.find(quest => quest.slug === slug);
};

userSchema.methods.getPhotoStatuses = async function (quest) {
    const questStatus = this.getQuestStatus(quest.slug);
    const stages = await quest.getStages();

    return questStatus.stagesStatuses.map((status, index) => ({
        src: stages[index].src,
        status: status === 'undef' ? null : status === 'ok',
        description: stages[index].description,
        title: stages[index].title
    }));
};

userSchema.methods.startQuest = async function (quest) {
    if (this.getQuestStatus(quest.slug)) {
        return false;
    }

    quest.userCount++;
    quest.save();

    this.quests.push({
        slug: quest.slug,
        stagesStatuses: new Array(quest.stages.length).fill('undef')
    });
    await this.save();

    return true;
};

userSchema.methods.setStatus = async function (slug, position, status) {
    const questStatus = this.getQuestStatus(slug);
    questStatus.stagesStatuses[position] = status;
    this.markModified('quests');
    return await this.save();
};

userSchema.methods.getStatus = async function (slug, position) {
    const questStatus = this.getQuestStatus(slug);
    const quest = await Quest.getBySlug(slug);
    const stages = await quest.getStages();
    const finished = questStatus.stagesStatuses.every(status => status === 'ok');
    const status = questStatus.stagesStatuses[position] === 'ok';
    return {
        status, finished,
        title: stages[position].title,
        description: stages[position].description
    };
};

module.exports = mongoose.model('User', userSchema);
