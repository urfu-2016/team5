'use strict';

const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Image = require('./schemas/image');
const slugify = require('slug');
const shortid = require('shortid');

const questSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
<<<<<<< 33c7909f15bc0c9fface7675db0ee0ba1350c1c3
    images: {
        type: [Image],
        default: []
    },
    authorId: {type: ObjectId, ref: 'User'},
    likes: {
        type: [{type: ObjectId, ref: 'User'}],
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    city: String,
=======
    images: [Image],
    author: {
        type: ObjectId,
        ref: 'User',
        require: true
    },
    likes: [{type: ObjectId, ref: 'User'}],
    tags: [String],
>>>>>>> Исправил замечания и хочу запулить
    dateOfCreation: {type: Date, default: Date.now},
    slug: {
        type: String,
        index: {unique: true},
        required: true
    }
});

const QuestModel = mongoose.model('Quest', questSchema);

module.exports = {
    create: ({author, title, description = '', slug}) => {
        const quest = new QuestModel({
            title,
            description,
            slug: slug ? slugify(slug) : shortid.generate(),
            authorId: author ? author._id : undefined
        });

        return quest.save();
    },

    update: (slug, {title, description, city}) => {
        return QuestModel
            .findOne({slug})
            .then(quest => {
                quest.title = title ? title : quest.title;
                quest.description = description ? description : quest.description;
                quest.city = city ? city : quest.city;

                return quest.save();
            });
    },

    getAll: () => QuestModel.find({}).exec(),

    getBySlug: slug => QuestModel.findOne({slug}).exec(),

    removeBySlug: slug => {
        return QuestModel
            .findOne({slug})
            .then(quest => quest.remove());
    },

    getFilteredQuests(searchProperties, searchString) => {
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
