'use strict';

const mongoose = require('../libs/mongoose-connection');
const crypto = require('../libs/crypto');

const expiresTime = '24h';

const LinkData = new mongoose.Schema({
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
    passwordReset: {type: LinkData},
    emailVerification: {type: LinkData},
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

QueriesDataSchema.statics.verifyPasswordResetQuery = (email, queryHash) => verifyQuery(email, queryHash, 'passwordReset');

QueriesDataSchema.statics.verifyEmailVerificationQuery = (email, queryHash) => verifyQuery(email, queryHash, 'emailVerification');

QueriesDataSchema.statics.checkPasswordResetQuery = async (email, queryHash) => {
    return (await checkQuery(email, queryHash, 'passwordReset')).compareResult;
};

const QueriesDataModel = mongoose.model('QueriesData', QueriesDataSchema);

async function updateQuery(email, queryType) {
    const createdAt = new Date();
    const salt = await crypto.genHexSalt();
    const hash = await crypto.hash(createdAt.toString(), salt);

    await QueriesDataModel.updateOne(
        {email},
        {[queryType]: {createdAt, salt}},
        {upsert: true}
    );

    return hash;
}

async function verifyQuery(email, queryHash, queryType) {
    const {compareResult, queriesData} = await checkQuery(email, queryHash, queryType);

    if (compareResult) {
        queriesData[queryType] = undefined;
        await queriesData.save();
    }

    return compareResult;
}

async function checkQuery(email, queryHash, queryType) {
    const queriesData = await QueriesDataModel.findOne({email});
    if (!queriesData || !queriesData[queryType]) {
        return false;
    }

    const compareResult = await crypto.compare(
        queriesData[queryType].createdAt.toString(),
        queryHash,
        queriesData[queryType].salt
    );

    return {compareResult, queriesData};
}

module.exports = QueriesDataModel;
