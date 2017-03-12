var express = require('express');
var router = express.Router();

/* Список квестов */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Список квестов' });
});

module.exports = router;
