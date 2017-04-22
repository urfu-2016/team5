'use strict';

module.exports = {
    dateFormat: 'D MMMM YYYY',
    user: {
        wrongPasswordOrNameMessage: 'Неверное имя пользователя или пароль.',
        passwordRequiredMessage: 'Введите пароль.',
        alreadyExistsPattern: username => `${username} уже зарегистрирован`,
        saltRounds: 10
    },
    comment: {
        maxLength: 300
    }
};
