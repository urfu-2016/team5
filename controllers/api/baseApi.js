'use strict';

const HttpStatus = require('http-status-codes');

function sendResponse(res, status, data) {
    res.status(status).send(data);
}

function getSuccessCallback(res, status) {
    return data => sendResponse(res, status, {data, message: HttpStatus.getStatusText(status)});
}

function getErrorCallback(res, status) {
    return err => {
        status = err.name === 'ValidationError' ? HttpStatus.BAD_REQUEST : status;
        sendResponse(res, status, {error: HttpStatus.getStatusText(status), message: err.message});
    };
}

function resolveRequestPromise(promise, res, statusCodes = {}) {
    statusCodes.successCode = statusCodes.successCode || HttpStatus.OK;
    statusCodes.failureCode = statusCodes.failureCode || HttpStatus.NOT_FOUND;

    return responseMessages => {
        if (responseMessages) {
            return promise
                .then(() => getSuccessCallback(res, statusCodes.successCode)(responseMessages.onSuccess))
                .catch(() => getErrorCallback(res, statusCodes.failureCode)(new Error(responseMessages.onError)));
        }

        return promise
            .then(getSuccessCallback(res, statusCodes.successCode))
            .catch(getErrorCallback(res, statusCodes.failureCode));
    };
}

module.exports = {
    getSuccessCallback,
    getErrorCallback,
    resolveRequestPromise
};
