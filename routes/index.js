/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();

/* Список квестов */
router.get('/', function (req, res) {
    // Брать из базы
    res.render('questsAll/quests-all', {
        title: 'Список квестов',
        quests: [
            {
                id: 1,
                img: '02.jpg',
                name: 'Графити',
                author: 'Wiewruouroeuro',
                city: 'Екатеринбург',
                likesCount: 4,
                description: 'Лааааа',
                tags: ['Тег2', 'Тег3', 'Тег3']
            },
            {
                id: 2,
                img: '03.jpg',
                name: 'Графити',
                likesCount: 4,
                description: 'Лааааа',
                tags: ['Тег2', 'Тег3', 'Тег3']
            },
            {
                id: 1,
                img: '02.jpg',
                name: 'Графити',
                author: 'Wiewruouroeuro',
                city: 'Екатеринбург',
                likesCount: 4,
                description: 'Лааааа',
                tags: ['Тег2', 'Тег3', 'Тег3']
            }
        ]});
});

module.exports = router;
