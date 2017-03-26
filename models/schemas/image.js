'use strict';

const mongoose = require('../../libs/mongoose-connection');

module.exports = new mongoose.Schema({
    src: {type: String, required: true},
    title: String,
    description: String,
    location: String
});
