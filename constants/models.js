'use strict';

module.exports = {
    dateFormat: 'D MMMM YYYY',
    user: {
        wrongPasswordOrNameMessage: 'Неверное имя пользователя или пароль.',
        passwordRequiredMessage: 'Введите пароль.',
        alreadyExistsPattern: username => `${username} уже зарегистрирован`,
        incorrectEmail: 'Некорректный email',
        emailRegEx: /.*@.*/im,
        emptySignUpField: 'Для регистрации необходимо ввести email, username, password',
        saltRounds: 10
    },

    quest: {
        accuracy: 100 // В метрах
    },

    comment: {
        maxLength: 300
    },

    email: {
        fromTitle: 'Team5Quest <team5quest@gmail.com>'
    }
};
