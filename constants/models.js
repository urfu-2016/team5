'use strict';

module.exports = {
    dateFormat: 'D MMMM YYYY',
    user: {
        wrongPasswordOrNameMessage: 'Неверное имя пользователя или пароль.',
        passwordRequiredMessage: 'Введите пароль.',
        alreadyExistsPattern: username => `${username} уже зарегистрирован`,
        incorrectEmail: 'Некорректный email',
        emailRegEx: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}/im,
        emptySignUpField: 'Для регистрации необходимо ввести email, username, password',
        saltRounds: 10
    },

    comment: {
        maxLength: 300
    },

    query: {
        delimiter: '___'
    },

    email: {
        fromTitle: 'Team5Quest <team5quest@gmail.com>'
    }
};
