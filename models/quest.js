'use strict';

const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Image = require('./schemas/image');
const slug = require('slug');
const HttpStatus = require('http-status-codes');
const shortid = require('shortid');
const baseApi = require('../controllers/api/baseApi');

const questSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
<<<<<<< HEAD
    images: [Image],
    author: {type: ObjectId, ref: 'User'},
    likes: [{type: ObjectId, ref: 'User'}],
=======
    images: [{type: ObjectId, ref: 'Image'}],
    author: {type: ObjectId, ref: 'User'},
    likesCount: Number,
>>>>>>> Backup
    tags: [String],
    dateOfCreation: {type: Date, default: Date.now},
    slug: {
        type: String,
        index: {unique: true},
        required: true
    },
});

questSchema.statics.create = function (questData) {
    const quest = new this({
        title: questData.title,
        description: questData.description,
        slug: slug(questData.slug)
    });

    return quest
        .save()
        .catch(err => {
            const isMongoDuplicateKeyError = err.name === 'MongoError' &&
                err.code === 11000;
            baseApi.throwErrorOnFalseValue(isMongoDuplicateKeyError,
                HttpStatus.BAD_REQUEST);

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

questSchema.statics.getBySlug = function (slug) {
    return this.findOne({slug})
        .exec()
        .then(quest => {
            baseApi.throwErrorOnFalseValue(quest, HttpStatus.NOT_FOUND);

            return quest;
        });
};

questSchema.statics.update = function (questData) {
    return this.findOne({slug: questData.slug})
        .exec()
        .then(quest => {
            baseApi.throwErrorOnFalseValue(quest, HttpStatus.NOT_FOUND);

            return quest;
        })
        .then(quest => {
            quest.title = questData.title;
            quest.description = questData.description;
            quest.slug = questData.slug;

            return quest.save();
        });
};

questSchema.statics.removeBySlug = function (slug) {
    return this.findOne({slug})
        .then(quest => {
            baseApi.throwErrorOnFalseValue(quest, HttpStatus.NOT_FOUND);

            return quest.remove();
        });
};

module.exports = mongoose.model('Quest', questSchema);
