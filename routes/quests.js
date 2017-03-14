/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();

/* Возвращаем конкретный квест */
router.get('/quest/:id', function (req, res) {
    res.render('quest', {title: 'Список квестов'});
});

module.exports = router;
