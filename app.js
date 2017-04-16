'use strict';

const hbs = require('hbs');
// Const handlebars = require('handlebars');
const express = require('express');
const path = require('path');
const config = require('config');
// Const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const layouts = require('handlebars-layouts');
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

// Uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession(config.sessionConfig));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/quests', express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', auth);
app.use('/api', api);
app.use('/quests', quests);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function (err, req, res) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
