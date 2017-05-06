'use strict';

const email = require('emailjs/email');
const config = require('config');
const fs = require('fs');
const handlebars = require('handlebars');
const queriesStorage = require('../models/queriesStorage');
const server = email.server.connect({
    user: config.email.login,
    password: config.email.pass,
    host: config.email.host,
    ssl: true,
    port: 465
});

const pattern = fs.readFileSync('./views/blocks/email/email-content.hbs', 'utf8');
const template = handlebars.compile(pattern);

function emailSendCallback(err) {
    if (err) {
        console.log(err);
    }
}

async function sendRegistrationMail(email) {
    const query = await queriesStorage.updateEmailVerificationQuery(email);
    const link = `${config.appUrl}/reg_verification/${query}`;

    server.send(getRegistrationMail(link, email), emailSendCallback);
}

async function sendPasswordResetMail(email) {
    const query = await queriesStorage.updatePasswordResetQuery(email);
    const link = `${config.appUrl}/pass_reset/${query}`;

    server.send(getPasswordResetMail(link, email), emailSendCallback);
}

function getRegistrationMail(link, toEmail) {
    const html = template({
        text: 'Для подтверждения регистрации',
        link: link
    });

    return getMail(toEmail, 'Подтверждение регистрации', html);
}

function getPasswordResetMail(link, toEmail) {
    const html = template({
        text: 'Для смены пароля',
        link: link
    });

    return getMail(toEmail, 'Смена пароля', html);
}

function getMail(toEmail, subject, html) {
    return {
        from: 'Team5Quest <team5quest@gmail.com>',
        to: `<${toEmail}>`,
        subject,
        attachment: [
            {data: html, alternative: true}
        ]
    };
}

module.exports = {
    sendRegistrationMail,
    sendPasswordResetMail
};
