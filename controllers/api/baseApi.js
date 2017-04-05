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
        err.status = err.name === 'ValidationError' ? HttpStatus.BAD_REQUEST : httpStatus;

        res
            .status(err.status)
            .send({error: HttpStatus.getStatusText(err.status), message: err.message});
    };
}

function resolveRequestPromise(promise, res, statusCodes = {}) {
    statusCodes = getStatusCodes(statusCodes);

    return promise
        .then(getSuccessCallback(res, statusCodes.successCode))
        .catch(getErrorCallback(res, statusCodes.failureCode));
}

function resolvePostPromise(promise, res, statusCodes = {}, responseMessages = {}) {
    statusCodes = getStatusCodes(statusCodes);

    return promise
        .then(() => getSuccessCallback(res, statusCodes.successCode)(responseMessages.onResolve))
        .catch(() => getErrorCallback(res, statusCodes.failureCode)(new Error(responseMessages.onError)));
}

function getStatusCodes(statusCodes) {
    return {
        successCode: statusCodes.successCode || HttpStatus.OK,
        failureCode: statusCodes.failureCode || HttpStatus.NOT_FOUND
    };
}

module.exports = {
    getSuccessCallback,
    getErrorCallback,
    resolveRequestPromise,
    resolvePostPromise
};
