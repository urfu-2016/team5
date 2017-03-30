<<<<<<< HEAD
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
            slug: slugify(title),
            authorId: author ? author._id : undefined,
            city: city,
            tags: tags ? tags : []
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
            .populate('authorId')
            .exec()
            .then(quests => {
                searchString = searchString.toLowerCase();

                return quests.filter(quest => {
                    return quest.authorId.username.indexOf(searchString) === 0;
                });
            });
    }
};
=======
'use strict';

const slugify = require('slug');
const shortid = require('shortid');
const mongoose = require('../libs/mongoose-connection');
const Comment = require('./schemas/comment');
const Image = require('./schemas/image');
const ObjectId = mongoose.Schema.Types.ObjectId;

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
    comments: {type: [Comment], default: []},
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
        return QuestModel.findOne({slug}).then(quest => {
            quest.title = title ? title : quest.title;
            quest.description = description ? description : quest.description;
            quest.city = city ? city : quest.city;

            return quest.save();
        });
    },

    getAll: () => QuestModel.find({}).exec(),

    getBySlug: slug => {
        return QuestModel.findOne({slug})
            .exec();
    },

    removeBySlug: slug => {
        return QuestModel.findOne({slug}).exec()
            .then(quest => quest.remove());
    }
};
>>>>>>> Сделал ребейз + мелкие правки
