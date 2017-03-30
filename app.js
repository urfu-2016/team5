const hbs = require('hbs');
// Const handlebars = require('handlebars');
const express = require('express');
const path = require('path');
// Const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const layouts = require('handlebars-layouts');

const index = require('./routes/index');
const quests = require('./routes/quests');
const users = require('./routes/users');
// const auth = require('./routes/auth');

// const passport = require('./libs/passport-init');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/blocks'));
hbs.registerHelper(layouts(hbs.handlebars));

// Uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/quests', express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', quests);
app.use('/', users);
// app.use('/', auth);

// app.use(passport.initialize());
// app.use(passport.session());

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
