'use strict';

module.exports = {
    user: {
        wrongPasswordOrNameMessage: 'Неверное имя пользователя или пароль.',
        passwordRequiredMessage: 'Введите пароль.',
        alreadyExistsPattern: username => `${username} уже зарегистрирован`,
        saltRounds: 10
    }
};
