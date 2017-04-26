'use strict';

const moment = require('moment');
const autoIncrement = require('mongoose-auto-increment');
const constants = require('../constants/models');
const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    message: {
        type: String,
        maxlength: constants.comment.maxLength,
        required: true
    },
    author: {type: ObjectId, ref: 'User'},
    likes: {
        type: [{type: ObjectId, ref: 'User'}],
        default: []
    },
    dateOfCreation: {type: Date, default: Date.now}
});

commentSchema.statics.getAll = function () {
    return this.find({});
};

commentSchema.statics.create = async function (user, message) {
    const comment = new this({
        author: user._id,
        message
    });

    return await comment.save();
};

commentSchema.statics.delete = async function (id) {
    return await this.findByIdAndRemove(id);
};

commentSchema.methods.like = async function (user) {
    if (await this.likedBy(user.username)) {
        const index = this.likes.indexOf(user.id);
        this.likes.splice(index, 1);
    } else {
        this.likes.push(user.id);
    }
    await this.save();
};

commentSchema.methods.likedBy = async function (username) {
    const user = await mongoose.model('User').findOne({username});
    return this.likes.some(x => x.equals(user.id));
};

commentSchema.methods.createdBy = async function (username) {
    const user = await mongoose.model('User').findOne({username});
    return this.author.equals(user._id);
};

commentSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});

commentSchema.virtual('formattedDate').get(function () {
    return moment(this.dateOfCreation).format(constants.dateFormat);
});

autoIncrement.initialize(mongoose.connection);
commentSchema.plugin(autoIncrement.plugin, 'Comment');
module.exports = mongoose.model('Comment', commentSchema);
