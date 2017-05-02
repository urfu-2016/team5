'use strict';

const email = require('emailjs/email');
const User = require('../models/user');
const config = require('config');
const errors = require('../libs/customErrors/errors');
const queriesStorage = require('../models/queriesStorage');
const httpStatus = require('http-status-codes');
const server = email.server.connect({
    user: config.appEmailLogin,
    password: config.appEmailPass,
    host: config.appEmailHost,
    ssl: true,
    port: 465
});

async function sendRegistrationMail(toEmail) {
    const query = await queriesStorage.updateQuery(toEmail);
    const link = `${config.appUrl}/reg_verification/${query}`;

    server.send(
        getRegistrationMail(link, toEmail),
        err => {
            if (err) {
                console.log(err);
            }
        }
    );

    return link;
}

function getRegistrationMail(link, toEmail) {
    return {
        text: `Подтвердите вашу регистрацию. Для этого перейдите по следующей ссылке: ${link}`,
        from: 'Team5Quest <team5quest@gmail.com>',
        to: `<${toEmail}>`,
        subject: 'Подтверждение регистрации'
    };
}

async function verifyUserEmail(req, res, next) {
    const query = req.params.query;
    const email = query.split(queriesStorage.DELIMITER)[0];

    if (await queriesStorage.verifyQuery(query)) {
        const user = await User.findOne({email});

        if (user) {
            user.emailVerified = true;
            await user.save();
            await queriesStorage.remove({email});
            req.email = email;

            return next();
        }
    }

    next(new errors.NotFoundError('Такой страницы не существует'));
}

function renderSuccessVerification(req, res) {
    res.status(httpStatus.OK).send(`${req.email} подтвержден`);
}

module.exports = {
    sendRegistrationMail,
    verifyUserEmail,
    renderSuccessVerification
};
