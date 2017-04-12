'use strict';

const constants = require('../constants/mongoose');
const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;
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

questSchema.statics.create = function ({authorId, title = '', description = '', city = '', tags = [], images = []}) {
    const quest = new this({
        title,
        description,
        slug: slugify(title),
        author: authorId,
        city, tags, images
    });

    return quest
        .save()
        .catch(err => {
            const isMongoDuplicateKeyError = err.name === constants.mongoErrorName &&
                err.code === constants.mongoDuplicateErrorCode;
            if (!isMongoDuplicateKeyError) {
                throw err;
            }

            return false;
        })
        .then(data => {
            if (!data) {
                quest.slug += shortid.generate();

                return quest.save();
            }

            return data;
        });
};

questSchema.statics.update = function (slug, {title, description, city, tags}) {
    return this
        .findOne({slug})
        .exec()
        .then(quest => {
            quest.title = title ? title : quest.title;
            quest.description = description ? description : quest.description;
            quest.city = city ? city : quest.city;
            quest.slug = title ? slugify(title) + shortid.generate() : quest.slug;
            quest.tags = tags ? tags : quest.tags;

            return quest.save();
        });
};

questSchema.statics.getAll = function () {
    return this.find({}).exec();
};

questSchema.statics.getBySlug = function (slug) {
    return this.findOne({slug}).exec();
};

questSchema.statics.removeBySlug = function (slug) {
    return this.remove({slug}).exec();
};

// test

questSchema.statics.search = function (searchData) {
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

    return this
        .find(findObject)
        .exec();
};

module.exports = mongoose.model('Quest', questSchema);
