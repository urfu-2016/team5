'use strict';

const mongoose = require('../libs/mongoose-connection');
const crypto = require('../libs/crypto');

const expiresTime = '24h';
const DELIMITER = '___';

const QueryData = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    createdAt: {type: Date, default: Date.now, expires: expiresTime},
    salt: {
        type: String,
        required: true
    }
});

const QueriesDataModel = mongoose.model('QueriesData', QueryData);

async function updateQuery(email) {
    let queryData = await QueriesDataModel.findOne({email});
    const createdAt = new Date();
    const salt = await crypto.genHexSalt();
    const hash = await crypto.hash(createdAt.toString(), salt);

    if (queryData) {
        queryData.createdAt = createdAt;
        queryData.salt = salt;

        await queryData.save();
    } else {
        await QueriesDataModel.create({
            email: email,
            createdAt: createdAt,
            salt: salt
        });
    }

    return `${email}${DELIMITER}${hash}`;
}

async function verifyQuery(query) {
    const queryParts = query.split(DELIMITER);
    const email = queryParts[0];
    const hash = queryParts[1];
    const queryData = await QueriesDataModel.findOne({email});

    if (!queryData) {
        return false;
    }

    return await crypto.compare(queryData.createdAt.toString(), hash, queryData.salt);
}

module.exports = {
    updateQuery,
    verifyQuery,
    DELIMITER,
    remove: params => QueriesDataModel.remove(params)
};
