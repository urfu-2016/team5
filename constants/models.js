'use strict';

module.exports = {
    User: {
        wrongPasswordOrNameMessage: 'Неверное имя пользователя или пароль.',
        passwordRequiredMessage: 'Введите пароль.',
        alreadyExistsPattern: username => `${username} already exists`
    }
};
