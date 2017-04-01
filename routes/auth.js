/* eslint-disable new-cap */

const router = require('express').Router();
const authController = require('../controllers/auth');

router.route('/login')
    .post(authController.authenticate);

module.exports = router;
