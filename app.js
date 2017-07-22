var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var request = require('./routes/request');
var toilet = require('./routes/toilet');

var User = require('./app/models/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(passport.initialize());
passport.use(new LocalStrategy(function (username, password, done) {
    User.findOne({
        username: username
    }).exec(function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user || !user.validPassword(password)) {
            return done(null, false, {
                message: 'ユーザー情報が正しくありません。'
            });
        }
        return done(null, user);
    });
}));

app.use('/', index);
app.use('/request', request);
app.use('/toilet', toilet);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        request_link: '/',
        status_link: '/',
        log_link: '/'
    });
});

module.exports = app;
