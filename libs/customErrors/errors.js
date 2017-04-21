
const httpStatus = require('http-status-codes');

class RequestError extends Error {
    constructor(errorMessage, status) {
        super(errorMessage);
        this.status = status;
    }
}

class BadRequestError extends RequestError {
    constructor(errorMessage) {
        super(errorMessage, httpStatus.BAD_REQUEST);
    }
}

class NotFoundError extends RequestError {
    constructor(errorMessage) {
        super(errorMessage, httpStatus.NOT_FOUND);
    }
}

module.exports = {
    BadRequestError,
    NotFoundError
};
