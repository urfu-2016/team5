/* eslint-disable new-cap */

var express = require('express');
var config = require('config');
var router = new express.Router();

/* Список квестов */
router.get('/', function (req, res) {
    res.render('index', {title: 'Список квестов', mode: config.get('mode')});
});

module.exports = router;
