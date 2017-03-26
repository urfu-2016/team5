'use strict';

const mongoose = require('../../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = new mongoose.Schema({
    message: String,
    author: {type: ObjectId, ref: 'User'},
    dateOfCreation: {type: Date, default: Date.now}
});
