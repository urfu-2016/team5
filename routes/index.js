var express = require('express');
var config = require('config');
var router = express.Router();

/* Список квестов */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'Список квестов',
      mode: config.get('mode')
  });
});

module.exports = router;
