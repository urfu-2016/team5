'use strict';

const httpStatus = require('http-status-codes');
const baseApi = require('./api/baseApi');
const passport = require('../libs/passport-init');

module.exports = {
    authenticate(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            console.log(info);
            return user
                .then(baseApi.getSuccessCallback(res, httpStatus.OK))
                .catch(baseApi.getErrorCallback(res));
        })(req, res, next);
    }
};
