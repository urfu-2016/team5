'use strict';

const email = require('emailjs/email');
const config = require('config');
const fs = require('fs');
const handlebars = require('handlebars');
const server = email.server.connect(config.email);

const pattern = fs.readFileSync('./views/blocks/email/email-content.hbs', 'utf8');
const template = handlebars.compile(pattern);

function emailSendCallback(err) {
    if (err) {
        console.log(err);
    }
}

function sendRegistrationMail(email, queryHash) {
    const escapedEmail = encodeURIComponent(email);
    const link = `${config.appUrl}/register-verification/${escapedEmail}/${queryHash}`;
    const textParts = {
        actionDescription: 'Для подтверждения регистрации',
        link: link
    };

    const mail = getMail(email, 'Подтверждение регистрации', textParts);

    server.send(mail, emailSendCallback);
}

function sendPasswordResetMail(email, queryHash) {
    const escapedEmail = encodeURIComponent(email);
    const link = `${config.appUrl}/password-reset/${escapedEmail}/${queryHash}`;
    const textParts = {
        actionDescription: 'Для смены пароля',
        link: link
    };

    const mail = getMail(email, 'Смена пароля', textParts);

    server.send(mail, emailSendCallback);
}

function getMail(toEmail, subject, textParts) {
    const html = template(textParts);
    const plainText = `${textParts.actionDescription} нажмите сюда: ${textParts.link}`;

    return {
        text: plainText,
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
