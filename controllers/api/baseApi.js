'use strict';

const HttpStatus = require('http-status-codes');

function changeStatusIfValidationError(err) {
    if (err.name && err.name === 'ValidationError') {
        err.status = HttpStatus.BAD_REQUEST;
    }
}

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
        changeStatusIfValidationError(err);
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

function resolveRequestPromise(promise, res, statusCodes = {}) {
    const successStatus = statusCodes.successCode || HttpStatus.OK;
    const failureStatus = statusCodes.failureCode || HttpStatus.NOT_FOUND;

    return promise
        .then(getSuccessCallback(res, successStatus))
        .catch(getErrorCallback(res, failureStatus));
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
    resolveRequestPromise
};
