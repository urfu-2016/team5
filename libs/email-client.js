'use strict';

const email = require('emailjs/email');
const config = require('config');
const queriesStorage = require('../models/queriesStorage');
const server = email.server.connect({
    user: config.appEmailLogin,
    password: config.appEmailPass,
    host: config.appEmailHost,
    ssl: true,
    port: 465
});

function emailSendCallback(err) {
    if (err) {
        console.log(err);
    }
}

async function sendRegistrationMail(email) {
    const query = await queriesStorage.updateQuery(email, 'emailVerification');
    const link = `${config.appUrl}/reg_verification/${query}`;

    server.send(getRegistrationMail(link, email), emailSendCallback);
}

async function sendPasswordResetMail(email) {
    const query = await queriesStorage.updateQuery(email, 'passwordReset');
    const link = `${config.appUrl}/pass_reset/${query}`;

    server.send(getPasswordResetMail(link, email), emailSendCallback);
}

function getRegistrationMail(link, toEmail) {
    return {
        text: `Подтвердите вашу регистрацию. Для этого перейдите по следующей ссылке: ${link}`,
        from: 'Team5Quest <team5quest@gmail.com>',
        to: `<${toEmail}>`,
        subject: 'Подтверждение регистрации'
    };
}

function getPasswordResetMail(link, toEmail) {
    return {
        text: `Для смены пароля перейдите по следующей ссылке: ${link}`,
        from: 'Team5Quest <team5quest@gmail.com>',
        to: `<${toEmail}>`,
        subject: 'Смена пароля'
    };
}

module.exports = {
    sendRegistrationMail,
    sendPasswordResetMail
};
