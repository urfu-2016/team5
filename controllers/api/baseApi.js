'use strict';

const httpStatus = require('http-status-codes');

function sendResponse(res, status, data) {
    res.status(status).send(data);
}

function getSuccessCallback(res, status) {
    return data => sendResponse(res, status, {data, message: httpStatus.getStatusText(status)});
}

function getErrorCallback(res, status) {
    return err => {
        status = err.name === 'ValidationError' ? httpStatus.BAD_REQUEST : status;
        sendResponse(res, status, {error: httpStatus.getStatusText(status), message: err.message});
    };
}

function getStatusCodes(statusCodes) {
    return {
        successCode: statusCodes.successCode || httpStatus.OK,
        failureCode: statusCodes.failureCode || httpStatus.NOT_FOUND
    };
}

function resolveRequestPromise(promise, res, statusCodes = {}) {
    return getCallbackWithPromise(promise, res, statusCodes)();
}

function getCallbackWithPromise(promise, res, statusCodes = {}) {
    statusCodes = getStatusCodes(statusCodes);

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
    resolveRequestPromise,
    getCallbackWithPromise
};
