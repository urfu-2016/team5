'use strict';

const HttpStatus = require('http-status-codes');

function getSuccessCallback(res, status) {
    return data => {
        res
            .status(status)
            .send({data, message: HttpStatus.getStatusText(status)});
    };
}

function getErrorCallback(res, httpStatus) {
    return err => {
        err.status = httpStatus || err.status;
        res
            .status(err.status)
            .send({error: HttpStatus.getStatusText(err.status)});
    };
}

function throwErrorOnFalseValue(objectToCheck, httpStatus) {
    if (!objectToCheck) {
        throw createError(httpStatus);
    }
}

function isMongoDuplicateError(err) {
    const isMongoDuplicateKeyError = err.name === 'MongoError' &&
        err.code === 11000;
    throwErrorOnFalseValue(isMongoDuplicateKeyError, HttpStatus.BAD_REQUEST);

    return false;
}

function createError(status, message) {
    const err = new Error(message);
    err.status = status;

    return err;
}

module.exports = {
    getSuccessCallback,
    getErrorCallback,
    throwErrorOnFalseValue,
    isMongoDuplicateError
};
