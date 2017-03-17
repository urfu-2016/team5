/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();

/* Возвращаем конкретный квест */
router.get('/quest/:id', function (req, res) {
    // Нужно брать квест по req.id и рендерить в шаблоне quest
    res.render('quest', {title: 'Квест'});
});

module.exports = router;
