var express = require('express');
var router = express.Router();

/* Возвращаем конкретный квест */
router.get('/quest/:id', function(req, res, next) {
  const quests = [
      {
          questName: "Графити1",
          questImages: []
      },
      {
          questName: "Графити2",
          questImages: []
      }
  ];
  res.render('quest', { title: 'Список квестов' });
});

module.exports = router;
