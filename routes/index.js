/* eslint-disable new-cap */

const express = require('express');
const config = require('config');
const router = express.Router();

/* Список квестов */
router.get('/', function (req, res) {
    res.render('index', {title: 'Список квестов', mode: config.get('mode')});
});

module.exports = router;
