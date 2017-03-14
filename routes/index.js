/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();

/* Список квестов */
router.get('/', function (req, res) {
    // TODO: Брать из базы
    res.render('index', {
        title: 'Список квестов',
        quests: [
            {
                id: 1,
                img: '1.img',
                name: 'Графити',
                likesCount: 4,
                description: 'Лааааа',
                tags: ['Тег2', 'Тег3', 'Тег3']
            },
            {
                id: 2,
                img: '1.img',
                name: 'Графити',
                likesCount: 4,
                description: 'Лааааа',
                tags: ['Тег2', 'Тег3', 'Тег3']
            }
        ]});
});

module.exports = router;
