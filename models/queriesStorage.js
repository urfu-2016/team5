'use strict';

const mongoose = require('../libs/mongoose-connection');
const crypto = require('../libs/crypto');

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
    emailConfirmation: {type: QueryData},
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        index: true
    }
});

QueriesDataSchema.statics.updatePasswordResetQuery = email => updateQuery(email, 'passwordReset');

QueriesDataSchema.statics.updateEmailConfirmationQuery = email => updateQuery(email, 'emailConfirmation');

QueriesDataSchema.statics.verifyPasswordResetQuery = (email, queryHash) => verifyQuery(email, queryHash, 'passwordReset');

QueriesDataSchema.statics.verifyEmailConfirmationQuery = (email, queryHash) => verifyQuery(email, queryHash, 'emailConfirmation');

QueriesDataSchema.statics.checkPasswordResetQuery = async (email, queryHash) => {
    return (await isQueryExistsAndCorrect(email, queryHash, 'passwordReset')).compareResult;
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
    const {compareResult, queriesData} = await isQueryExistsAndCorrect(email, queryHash, queryType);
    if (compareResult) {
        queriesData[queryType] = undefined;
        await queriesData.save();
    }

    return compareResult;
}

async function isQueryExistsAndCorrect(email, queryHash, queryType) {
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
