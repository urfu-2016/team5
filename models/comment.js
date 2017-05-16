'use strict';

const moment = require('moment');
const shortid = require('shortid');
const constants = require('../constants/models');
const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.ObjectId;

const commentSchema = new mongoose.Schema({
    shortid: {
        type: String,
        default: shortid.generate
    },
    message: {
        type: String,
        maxlength: constants.comment.maxLength,
        required: true
    },
    author: {type: ObjectId, ref: 'User'},
    likes: {
        type: [{type: ObjectId, ref: 'User'}]
    },
    dateOfCreation: {type: Date, default: Date.now}
});

commentSchema.statics.create = async function (user, message) {
    const comment = new this({
        author: user._id,
        message
    });

    return await comment.save();
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

    return user && this.likes.some(x => x.equals(user.id));
};

commentSchema.methods.createdBy = async function (username) {
    const user = await mongoose.model('User').findOne({username});

    return this.author.equals(user._id);
};

commentSchema.methods.getAuthor = async function () {
    const comment = await this.model('Comment')
        .findOne({shortid: this.shortid})
        .populate({
            path: 'author',
            select: '-_id -password'
        });

    return comment.author;
};

commentSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});

commentSchema.virtual('formattedDate').get(function () {
    return moment(this.dateOfCreation).format(constants.dateFormat);
});

module.exports = mongoose.model('Comment', commentSchema);
