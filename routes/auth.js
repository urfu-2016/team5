/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/api/auth');

router.route('/signup')
    .post(authController.signUp);

router.route('/signin')
    .post(authController.signIn);

router.route('/logout')
    .post(authController.logout);

module.exports = router;
