'use strict';

const constants = require('../constants/mongoose');
const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.ObjectId;
const Comment = require('./comment');
const Image = require('./schemas/image');
const slugify = require('slug');
const shortid = require('shortid');

const questSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    images: {
        type: [Image],
        default: []
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: [{type: ObjectId, ref: 'User'}],
        default: []
    },
    comments: [{type: ObjectId, ref: 'Comment'}],
    tags: {
        type: [String],
        default: []
    },
    city: String,
    dateOfCreation: {type: Date, default: Date.now},
    slug: {
        type: String,
        index: {unique: true},
        required: true
    }
});

questSchema.statics.create = async function ({authorId, title = '', description = '', city = '', tags = [], images = []}) {
    let quest = new this({
        title,
        description,
        slug: slugify(title),
        author: authorId,
        city, tags, images
    });

    try {
        quest = await quest.save();
    } catch (err) {
        const isMongoDuplicateKeyError = err.name === constants.mongoErrorName &&
            err.code === constants.mongoDuplicateErrorCode;
        if (!isMongoDuplicateKeyError) {
            throw err;
        }
        quest.slug += shortid.generate();
        quest = await quest.save();
    }

    return quest;
};

questSchema.methods.getComments = async function () {
    // Fixme: какой-то костыль, но по непонятной причине populate('comments') не работает
    return await Promise.all(
        this.comments.map(async id => await Comment.findById(id))
    );
};

questSchema.methods.addComment = async function (user, message) {
    const comment = await Comment.create(user, message);
    this.comments.push(comment);
    await this.save();
    return comment;
};

questSchema.methods.removeComment = async function (position) {
    const removedCommentId = this.comments.splice(position, 1)[0];
    const removedComment = await Comment.findById(removedCommentId);
    await removedComment.remove();
    await this.save();
    return removedComment;
};

questSchema.statics.update = async function (slug, {title, description, city, tags}) {
    let quest = await this.findOne({slug});
    quest.title = title || quest.title;
    quest.description = description || quest.description;
    quest.city = city || quest.city;
    quest.slug = title ? slugify(title) + shortid.generate() : quest.slug;
    quest.tags = tags || quest.tags;

    return quest.save();
};

questSchema.statics.getAll = function () {
    return this.find({});
};

questSchema.statics.getBySlug = function (slug) {
    return this.findOne({slug});
};

questSchema.statics.removeBySlug = function (slug) {
    return this.remove({slug});
};

questSchema.statics.search = async function (searchData) {
    const andList = searchData.reduce((acc, searchObject) => {
        const orList = searchObject.fields.map(property => {
            return {[property]: searchObject.values};
        });
        if (orList.length) {
            acc.push({$or: orList});
        }

        return acc;
    }, []);

    const findObject = andList.length ? {$and: andList} : {};
    return await this
        .find(findObject)
        .populate('author');
};

module.exports = mongoose.model('Quest', questSchema);
