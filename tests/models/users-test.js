/* global it, describe, beforeEach */

const assert = require('assert');
const User = require('../../models/user');

describe('models:user', () => {
    beforeEach(() => {
        return User
            .remove({})
            .exec();
    });

    it('should save', () => {
        const user = new User({
            firstname: 'Иван',
            surname: 'Иванов',
            nickname: 'vano',
            createdQ: [],
            quests: []
        });

        return user
            .save()
            .then(() => {
                return User
                    .find({})
                    .exec();
            })
            .then(users => {
                assert.equal(users.length, 1);
            });
    });

    it('should be unique nickname', () => {
        const first = new User({
            firstname: 'Иван',
            surname: 'Иванов',
            nickname: 'vano',
            createdQ: [],
            quests: []
        });

        const second = new User({
            firstname: 'Петр',
            surname: 'Петров',
            nickname: 'petro',
            createdQ: [],
            quests: []
        });

        first.save();
        second.save()
            .then(() => assert.fail());
    });
    // TODO: Дописать тесты по спецификации
    // TODO: после добавления модели Quest
});
