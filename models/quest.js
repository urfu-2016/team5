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
    }
};

// test
