'use strict';

const express = require('express');
const router = new express.Router();

const authController = require('../controllers/api/auth');

router.route('/signup')
    .post(authController.signUp);

router.route('/signin')
    .post(authController.signIn);

router.route('/changepassword')
    .post(authController.authorizedOnly, authController.changePassword);

router.route('/logout')
    .post(authController.logout);

module.exports = router;
