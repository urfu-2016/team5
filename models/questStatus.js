'use strict';

const shortid = require('shortid');
const mongoose = require('../libs/mongoose-connection');

const questStatusSchema = new mongoose.Schema({
    id: {
        type: String,
        default: shortid.generate
    },
    questSlug: String,
    statuses: [{
        type: String,
        default: null
    }]
});

module.exports = mongoose.model('QuestStatus', questStatusSchema);
