'use strict';

const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Image = require('./schemas/image');

const questSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    images: [Image],
    author: {type: ObjectId, ref: 'User'},
    likesCount: Number,
    tags: [String],
    dateOfCreation: {type: Date, default: Date.now},
    slug: {
        type: String,
        index: {unique: true},
        required: true
    }
});

module.exports = mongoose.model('Quest', questSchema);
