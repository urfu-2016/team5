'use strict';

const mongoose = require('../libs/mongoose-connection');
const crypto = require('../libs/crypto');
const constants = require('../constants/constants');

const expiresTime = '24h';

const QueryData = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
        expires: expiresTime
    },

    salt: {
        type: String,
        required: true
    }
});

const QueriesDataSchema = new mongoose.Schema({
    passwordReset: {type: QueryData},
    emailVerification: {type: QueryData},
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        index: true
    }
});

QueriesDataSchema.statics.updateQuery = async function (email, queryType) {
    let queriesData = await this.findOne({email});
    const createdAt = new Date();
    const salt = await crypto.genHexSalt();
    const hash = await crypto.hash(createdAt.toString(), salt);

    if (queriesData) {
        queriesData[queryType] = {createdAt, salt};
        await queriesData.save();
    } else {
        const queryData = {createdAt, salt};
        await this.create({email, [queryType]: queryData});
    }

    return `${email}${constants.models.query.delimiter}${hash}`;
};

QueriesDataSchema.statics.verifyQuery = async function (query, queryType) {
    const [email, hash] = query.split(constants.models.query.delimiter);
    const queriesData = await this.findOne({email});
    if (!queriesData) {
        return false;
    }

    const result = await crypto.compare(
        queriesData[queryType].createdAt.toString(),
        hash,
        queriesData[queryType].salt
    );

    if (result) {
        queriesData[queryType] = undefined;
        await queriesData.save();
    }

    return result;
};

module.exports = mongoose.model('QueriesData', QueriesDataSchema);
