'use strict';

const hbs = require('hbs');
const express = require('express');
const path = require('path');
const config = require('config');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const layouts = require('handlebars-layouts');
const {NotFoundError} = require('./libs/customErrors/errors');
const constants = require('./constants/constants');
const cdn = require('express-simple-cdn');

const index = require('./routes/index');
const quests = require('./routes/quests');
const auth = require('./routes/auth');
const api = require('./routes/api');

const passport = require('./libs/passport');

const app = express();

hbs.localsAsTemplateData(app);
app.locals.CDN = path => cdn(path, config.staticPath);

// View engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, '/views/blocks'));
hbs.registerHelper(layouts(hbs.handlebars));
hbs.registerHelper('equal', require('handlebars-helper-equal'));

app.use(favicon('./favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(config.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/quests', express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', auth);
app.use('/api', api);
app.use('/quests', quests);

app.use('*', function (req, res, next) {
    next(new NotFoundError(constants.controllers.index.pageNotExistsMessage));
});

// Error handler
app.use(function (err, req, res, next) {
    /* eslint no-unused-vars: "off" */

    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('infoPage/infoPage', {infoMessage: err.message, isAuth: req.user});
});

module.exports = app;
