'use strict';

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
    authorId: {
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
    create: ({author, title = '', description = '', city = '', tags}) => {
        const quest = new QuestModel({
            title,
            description,
            slug: title && title.length ? slugify(title) : shortid.generate(),
            authorId: author ? author._id : undefined,
            city: city,
            tags: tags ? tags : undefined
        });

        return quest
            .save()
            .catch(err => {
                const isMongoDuplicateKeyError = err.name === 'MongoError' &&
                    err.code === 11000;
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

    update: (slug, {title, description, city, tags}) => {
        return QuestModel
            .findOne({slug})
            .then(quest => {
                quest.title = title ? title : quest.title;
                quest.description = description ? description : quest.description;
                quest.city = city ? city : quest.city;
                quest.city = city ? city : quest.city;
                quest.slug = title ? slugify(title) + shortid.generate() : quest.slug;
                quest.tags = tags ? tags : quest.tags;

                return quest.save();
            });
    },

    getAll() { return QuestModel.find({}).exec(); },

    getBySlug: slug => QuestModel.findOne({slug}).exec(),

    removeBySlug: slug => QuestModel.remove({slug}).exec(),

    getFilteredQuests(searchProperties, searchString) {
        const findParams = [];
        searchProperties.forEach(property => {
            let searchObject = {};
            searchObject[property] = {$regex: searchString, $options: 'i'};
            findParams.push(searchObject);
        });

        return QuestModel
            .find({$or: findParams})
            .sort({dateOfCreation: -1})
            .exec()
            .then(quests => {
                return quests;
            });
    }
};
