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
                city: 'Екатеринбуруг',
                likesCount: 1,
                commentsCount: 2,
                imagesCount: 3,
                description: 'Лааааа',
                tags: ['Тег2', 'Тег3', 'Тег3']
            },
            {
                id: 2,
                img: '03.jpg',
                name: 'Графити',
                author: 'Ufjkjslfjdslkfj',
                city: 'Ревда',
                likesCount: 4,
                commentsCount: 5,
                imagesCount: 6,
                description: 'Лааааа',
                tags: ['Тег2', 'Тег3', 'Тег3']
            },
            {
                id: 1,
                img: '02.jpg',
                name: 'Графити',
                author: 'Wiewruouroeuro',
                city: 'Ивдель',
                likesCount: 7,
                commentsCount: 8,
                imagesCount: 9,
                description: 'Лааааа',
                tags: ['Тег2', 'Тег3', 'Тег3']
            }
        ]});
});

module.exports = router;
