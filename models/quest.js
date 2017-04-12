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

const QuestModel = mongoose.model('Quest', questSchema);

module.exports = {
    create({authorId, title = '', description = '', city = '', tags = [], images = []}) {
        const quest = new QuestModel({
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
    },

    update(slug, {title, description, city, tags}) {
        return QuestModel
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
    },

    getAll: () => QuestModel.find({}).exec(),

    getBySlug: slug => QuestModel.findOne({slug}).exec(),

    removeBySlug: slug => QuestModel.remove({slug}).exec(),

    searchByInternalProps(searchProperties, searchString) {
        const findParams = [];
        searchProperties.forEach(property => {
            let searchObject = {};
            searchObject[property] = {$regex: searchString, $options: 'i'};
            findParams.push(searchObject);
        });

        const findObject = findParams.length ? {$or: findParams} : {};

        return QuestModel
            .find(findObject)
            .exec();
    },

    searchByAuthor(searchString) {
        return QuestModel
            .find({})
            .populate('author')
            .exec()
            .then(quests => {
                searchString = searchString.toLowerCase();

                return quests.filter(quest => {
                    return quest.author.username.indexOf(searchString) === 0;
                });
            });
    }
};
