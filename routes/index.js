var express = require('express');
var config = require('config');
var router = express.Router();

/* Список квестов */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Список квестов',
        mode: config.get('mode'),
        quests: [
            {
                questId: 1,
                guestImg: "1.img",
                questName: "Графити",
                questLikesCount: 4,
                questDescription: "Лааааа",
                questTags: ["Тег2", "Тег3", "Тег3"]
            },
            {
                questId: 2,
                guestImg: "1.img",
                questName: "Графити",
                questLikesCount: 4,
                questDescription: "Лааааа",
                questTags: ["Тег2", "Тег3", "Тег3"]
            }
        ]});
});

module.exports = router;
