/* eslint-disable new-cap */
'use strict';

const express = require('express');
const router = express.Router();
const questsController = require('../controllers/quests');

router.get('/', questsController.renderAllQuests);

router.post('/search', questsController.findQuests);

module.exports = router;
