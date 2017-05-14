'use strict';

const mongoose = require('../../libs/mongoose-connection');

module.exports = new mongoose.Schema({
    src: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, default: ''},
    location: {
        lat: String,
        lon: String
    }
});
