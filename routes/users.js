/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();

const usersController = require('../controllers/api/users');

router.route('/api/users')
    .get(usersController.getUsers);

router.route('/api/users/:username')
    .get(usersController.getUserByUsername);

module.exports = router;
