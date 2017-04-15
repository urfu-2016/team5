'use strict';

const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    firstname: String,
    surname: String,
    username: {
        type: String,
        lowercase: true,
        unique: true,
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

userSchema.statics.create = function ({firstname = '', surname = '', username}) {
    const user = new this({firstname, surname, username});

    return user.save();
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
