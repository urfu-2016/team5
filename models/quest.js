'use strict';

const constants = require('../constants/mongoose');
const accuracy = require('../constants/models').quest.accuracy;
const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.ObjectId;
const Comment = require('./comment');
const Stage = require('./stage');
const slugify = require('slug');
const geolib = require('geolib');
const shortid = require('shortid');

const questSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    stages: [String],
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: [{type: ObjectId, ref: 'User'}]
    },
    comments: [String],
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
    },
    userCount: {
        type: Number,
        default: 0
    }
});

questSchema.statics.create = async function ({authorId, title = '', description = '', city = '', tags = [], stages = [], likes = []}) {
    let quest = new this({
        title,
        description,
        slug: slugify(title),
        author: authorId,
        city, tags, likes
    });
    await quest.addManyStages(stages);

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
        this.comments.map(async id => await Comment.findOne({shortid: id}))
    );
};

questSchema.methods.addComment = async function (user, message) {
    const comment = await Comment.create(user, message);
    this.comments.push(comment.shortid);
    await this.save();

    return comment;
};

questSchema.methods.removeComment = async function (id) {
    const removedCommentIndex = this.comments.findIndex(comment => comment === id);
    if (removedCommentIndex !== -1) {
        const removedComment = await Comment.findOne({shortid: id});
        await removedComment.remove();
        this.comments.splice(removedCommentIndex, 1);
        await this.save();

        return removedComment;
    }
};

questSchema.statics.update = async function (slug, {title, description, city, tags, stages}) {
    let quest = await this.findOne({slug});
    quest.title = title || quest.title;
    quest.description = description || quest.description;
    quest.city = city || quest.city;
    quest.slug = title ? slugify(title) + shortid.generate() : quest.slug;
    quest.tags = tags || quest.tags;
    quest.stages = stages || quest.stages;

    return quest.save();
};

questSchema.statics.getAll = function () {
    return this.find({});
};

questSchema.statics.getBySlug = function (slug) {
    return this.findOne({slug});
};

questSchema.methods.getAuthor = async function () {
    const quest = await this.model('Quest')
        .findOne({slug: this.slug})
        .populate({
            path: 'author',
            select: '-_id -password'
        });

    return quest.author;
};

questSchema.statics.removeBySlug = async function (slug) {
    const quest = await this.getBySlug(slug);

    if (quest) {
        await Promise.all(
            quest.stages.map(stageId => quest.removeStage(stageId))
        );
        await quest.remove();

        return true;
    }

    return false;
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

questSchema.methods.like = async function (user) {
    if (await this.likedBy(user)) {
        const index = this.likes.indexOf(user.id);
        this.likes.splice(index, 1);
    } else {
        this.likes.push(user.id);
    }
    await this.save();
};

questSchema.methods.checkPhoto = async function (user, position, location) {
    const id = this.stages[position];
    const stage = await Stage.findById(id);
    const latitude = stage.location.lat;
    const longitude = stage.location.lon;
    const distance = geolib.getDistance(
        {latitude, longitude},
        {latitude: location.lat, longitude: location.lon},
        10
    );

    await user.setStatus(this.slug, position, distance < accuracy ? 'ok' : 'wrong');
    return await user.getStatus(this.slug, position);
};

questSchema.methods.likedBy = function (user) {
    return user ? this.likes.some(x => x.equals(user.id)) : false;
};

questSchema.methods.isMyQuest = function (user) {
    return user ? user._id.equals(this.author) : false;
};

questSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});

questSchema.methods.addStage = async function (stageData) {
    const stage = await Stage.create(stageData);
    this.stages.push(stage._id);
    await this.save();

    return stage;
};

questSchema.methods.addManyStages = async function (stages) {
    for (let stage of stages) {
        await this.addStage(stage);
    }
};

questSchema.methods.removeStage = async function (stageId) {
    const stage = await Stage.getByShortId(stageId);
    const removedStageIndex = this.stages.findIndex(id => stage._id.equals(id));

    if (removedStageIndex !== -1) {
        await stage.remove();
        this.stages.splice(removedStageIndex, 1);
        await this.save();

        return true;
    }

    return false;
};

questSchema.methods.getStages = async function () {
    // Fixme: какой-то костыль, но по непонятной причине populate('stages') не работает7
    return await Promise.all(
        this.stages.map(id => Stage.findById(id))
    );
};

questSchema.methods.getStageByShortId = async function (id) {
    if (this.stages.includes(id)) {
        return await Stage.getByShortId(id);
    }
};

questSchema.statics.addPlayingUser = async function (slug) {
    let quest = await this.findOne({slug});
    quest.userCount++;
    await quest.save();
};

questSchema.methods.getAuthor = async function () {
    const quest = await this.model('Quest')
        .findOne({slug: this.slug})
        .populate('author');

    return quest.author;
};

module.exports = mongoose.model('Quest', questSchema);
