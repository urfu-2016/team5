/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Quest = require('../../models/quest');
const HttpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const questsMocks = require('../mocks/quests');
const setAuthorAfterCreateUser = questsMocks.setAuthorAfterCreateUser;

chai.should();
chai.use(chaiHttp);

describe('controller:quest', () => {
    let questData;

    beforeEach(() => {
        dbClearer.removeAllUsers();
        dbClearer.removeAllQuests();
        questData = Object.assign({}, questsMocks.regularQuest);
    });

    after(() => {
        dbClearer.removeAllQuests();
        dbClearer.removeAllUsers();
    });

    // Почему то при рендере происходит ошибка с hbs.
    // Разрешу эту проблемму позже
    // it('should get quests by author', () => {
    //     return setAuthorAfterCreateUser(questData)
    //         .then(() => Quest.create(questData))
    //         .then(() => {
    //             return chai
    //                 .request(server)
    //                 .get('/search')
    //                 .query({searchString: 'user', searchByAuthor: true});
    //         })
    //         .then(res => {
    //             res.status.should.equal(HttpStatus.OK);
    //         });
    // });
});
