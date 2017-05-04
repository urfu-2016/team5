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

QueriesDataSchema.statics.updatePasswordResetQuery = email => updateQuery(email, 'passwordReset');

QueriesDataSchema.statics.updateEmailVerificationQuery = email => updateQuery(email, 'emailVerification');

QueriesDataSchema.statics.verifyPasswordResetQuery = query => verifyQuery(query, 'passwordReset');

QueriesDataSchema.statics.verifyEmailVerificationQuery = query => verifyQuery(query, 'emailVerification');

QueriesDataSchema.statics.checkPasswordResetQuery = async query => {
    return (await checkQuery(query, 'passwordReset')).compareResult;
};

const QueriesDataModel = mongoose.model('QueriesData', QueriesDataSchema);

async function updateQuery(email, queryType) {
    let queriesData = await QueriesDataModel.findOne({email});
    const createdAt = new Date();
    const salt = await crypto.genHexSalt();
    const hash = await crypto.hash(createdAt.toString(), salt);

    if (queriesData) {
        queriesData[queryType] = {createdAt, salt};
        await queriesData.save();
    } else {
        const queryData = {createdAt, salt};
        await QueriesDataModel.create({email, [queryType]: queryData});
    }

    return `${email}${constants.models.query.delimiter}${hash}`;
}

async function verifyQuery(query, queryType) {
    const {compareResult, queriesData} = await checkQuery(query, queryType);

    if (compareResult) {
        queriesData[queryType] = undefined;
        await queriesData.save();
    }

    return compareResult;
}

async function checkQuery(query, queryType) {
    const [email, hash] = query.split(constants.models.query.delimiter);
    const queriesData = await QueriesDataModel.findOne({email});
    if (!queriesData || !queriesData[queryType]) {
        return false;
    }

    const compareResult = await crypto.compare(
        queriesData[queryType].createdAt.toString(),
        hash,
        queriesData[queryType].salt
    );

    return {compareResult, queriesData};
}

module.exports = QueriesDataModel;
