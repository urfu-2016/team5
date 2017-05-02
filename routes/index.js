/* eslint-disable new-cap */
'use strict';

const express = require('express');
const router = express.Router();
const questsController = require('../controllers/quests');
const emailClient = require('../controllers/email-client');

router.get('/', questsController.renderAllQuests);

router.post('/search', questsController.findQuests);

router
    .route('/reg_verification/:query')
    .get(emailClient.verifyUserEmail, emailClient.renderSuccessVerification);

module.exports = router;
