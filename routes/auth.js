'use strict';

const express = require('express');
const router = new express.Router();
const authController = require('../controllers/auth');
const clientErrorHandler = require('./clientErrorHandler');
const getAction = require('../libs/getAction');

router.route('/signup')
    .post(getAction(authController, 'signUp'), clientErrorHandler);

router.route('/signin')
    .post(getAction(authController, 'signIn'), clientErrorHandler);

router.route('/logout')
    .post(getAction(authController, 'authorizedOnly'), getAction(authController, 'logout'));

router
    .route('/register-verification/:email/:queryHash')
    .get(getAction(authController, 'verifyUserEmail'));

router
    .route('/password-reset')
    .post(getAction(authController, 'resetPasswordRequest'), clientErrorHandler);

router
    .route('/password-reset/:email/:queryHash')
    .get(getAction(authController, 'getResetPassPage'))
    .post(getAction(authController, 'resetPassword'));

module.exports = router;
