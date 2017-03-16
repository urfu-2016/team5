'use strict';

const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;
const questSchema = new mongoose.Schema({
    slug: {
        type: String,
        index: {unique: true},
        required: true
    },
    title: {type: String, required: true},
    description: String,
    images: [{type: ObjectId, ref: 'Image'}],
    author: {type: ObjectId, ref: 'User'},
    likesCount: Number,
    tags: [String],
    dateOfCreation: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Quest', questSchema);
