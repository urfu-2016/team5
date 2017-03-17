'use strict';

const mongoose = require('../../libs/mongoose-connection');

const imageSchema = new mongoose.Schema({
    src: {type: String, required: true},
    title: String,
    description: String,
    location: String
});

module.exports = imageSchema;
