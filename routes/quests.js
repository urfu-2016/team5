/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();
const questsController = require('../controllers/quests');

/* Возвращаем конкретный квест */

router.route('/quest/:id')
    .get(function (req, res) {
    // Нужно брать квест по req.id и рендерить в шаблоне quest
        res.render('quest', {title: 'Квест'});
    });

router.route('/api/quests')
    .get(questsController.getQuests)
    .post(questsController.createQuest);

router.route('/api/quests/:slug')
    .get(questsController.getQuestBySlug)
    .put(questsController.updateQuest)
    .delete(questsController.removeQuest);

router.get('/quests/:id', function (req, res) {
    // TODO: Нужно брать квест по req.id и рендерить в шаблоне quest
    res.render('questsId/quests-id', {
        title: 'Квест',
        comments: [
            {
                author: 'Weoiorperio',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            }],
        card: {
            title: 'Графити города',
            city: 'Екатеринбург',
            author: 'Weoiorperio',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        isAuth: false,
        isCreator: true
    });
});

module.exports = router;
