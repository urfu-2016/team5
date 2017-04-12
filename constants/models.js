'use strict';

module.exports = {
    Account: {
        wrongPasswordOrNameMessage: 'Неверное имя пользователя или пароль.',
        passwordRequiredMessage: 'Для авторизации необходимо ввести пароль.',
        alreadyExistsPattern: username => `${username} already exists`
    }
};
