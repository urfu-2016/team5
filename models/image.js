'use strict';

const mongoose = require('../libs/mongoose-connection');

const imageSchema = new mongoose.Schema({
    src: {type: String, required: true},
    title: String,
    description: String,
    location: String
});

// class Image {
//     constructor(params) {
//         this.src = params.src;
//         this.title = params.title;
//         this.description = params.description;
//         this.location = params.location;
//     }
// }

module.exports = mongoose.model('Image', imageSchema);
