/* eslint-disable new-cap */
'use strict';

const express = require('express');
const router = express.Router();
const questsController = require('../controllers/quests');
const getAction = require('../libs/getAction');

router.get('/', getAction(questsController, 'renderAllQuests'));

router.post('/search', getAction(questsController, 'findQuests'));

module.exports = router;
