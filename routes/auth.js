'use strict';

const express = require('express');
const router = new express.Router();

const authController = require('../controllers/auth');

router.route('/signup')
    .post(authController.signUp);

router.route('/signin')
    .post(authController.signIn);

router.route('/logout')
    .post(authController.authorizedOnly, authController.logout);

router
    .route('/reg_verification/:query')
    .get(authController.verifyUserEmail);

router
    .route('/pass_reset')
    .post(authController.resetPasswordRequest);

router
    .route('/pass_reset/:query')
    .get(authController.getResetPassPage)
    .post(authController.resetPassword);

module.exports = router;
