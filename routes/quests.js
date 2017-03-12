var express = require('express');
var router = express.Router();

/* Возвращаем конкретный квест */
router.get('/quest/:id', function(req, res, next) {
  res.render('quest', { title: 'Список квестов' });
});

module.exports = router;
