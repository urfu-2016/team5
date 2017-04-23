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

module.exports = router;
