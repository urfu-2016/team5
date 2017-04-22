'use strict';

const moment = require('moment');
const autoIncrement = require('mongoose-auto-increment');
const dateFormat = require('../constants/models').dateFormat;
const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    message: {
        type: String,
        maxlength: 300
    },
    author: {type: ObjectId, ref: 'User'},
    likes: {
        type: [{type: ObjectId, ref: 'User'}],
        default: []
    },
    dateOfCreation: {type: Date, default: Date.now}
});

commentSchema.statics.getAll = function () {
    return this.find({}).exec();
};

commentSchema.statics.create = async function (author, message) {
    const comment = new this({
        author: author._id,
        message
    });

    return await comment.save();
};

commentSchema.statics.delete = async function (id) {
    await this.findById(id).remove().exec();
};

commentSchema.methods.like = async function (username) {
    const user = await mongoose.model('User').findOne({username});
    if (this.likedBy(username)) {
        const ind = this.likes.indexOf(user._id);
        this.likes.splice(ind, 1);
    } else {
        this.likes.push(user._id);
    }
};

commentSchema.methods.likedBy = async function (username) {
    const user = await mongoose.model('User').findOne({username});
    return this.likes.indexOf(user._id) !== -1;
};

commentSchema.methods.checkAuthor = function (username) {
    return this.author.username === username;
};

commentSchema.virtual('likesCount')
    .get(() => this.likes.length);

commentSchema.virtual('formattedDate')
    .get(() => moment(this.dateOfCreation).format(dateFormat));

commentSchema.plugin(autoIncrement.plugin, 'Comment');
module.exports = mongoose.model('Comment', commentSchema);
