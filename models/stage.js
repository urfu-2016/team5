'use strict';

const mongoose = require('../libs/mongoose-connection');
const shortid = require('shortid');

const stageSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true
    },

    cloudinaryId: {
        type: String
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    location: {
        type: {
            lat: String,
            lon: String
        },
        required: true
    },

    shortid: {
        type: String,
        default: shortid.generate
    }
});

stageSchema.statics.create = async function ({src, title, location = '', description = '', cloudinaryId}) {
    const stage = new this({src, title, location, description, cloudinaryId});

    return stage.save();
};

stageSchema.statics.update = async function (shortid, stageData) {
    let stage = await this.findOne({shortid});
    stage = Object.assign(stage, stageData);

    return stage.save();
};

stageSchema.statics.getByShortId = function (shortid) {
    return this.findOne({shortid});
};
module.exports = mongoose.model('Stage', stageSchema);
