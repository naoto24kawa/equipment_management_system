var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require("connect-flash");
var session = require("express-session");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var request = require('./routes/request');
//var toilet = require('./routes/toilet');

// ==============================

var Toilet = require('./app/models/toilet')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/equipment_management_system');

var toilet_router = express.Router();

toilet_router.get('/', function (req, res, next) {
    Toilet.find()
        .sort({
            'timestamp': -1
        })
        .exec(function (err, toilets) {
            if (err)
                res.send(err);
            res.render('toilet', {
                status: toilets[0].status
            });
        });
});

toilet_router.get('/api', function (req, res, next) {
    Toilet.find()
        .sort({
            'timestamp': -1
        })
        .exec(function (err, toilets) {
            if (err)
                res.send(err);
            res.json(toilets);
        });
});

toilet_router.post('/api', function (req, res, next) {

    var toilet_model = new Toilet();

    if (req.body.status != null) {
        toilet_model.status = req.body.status;
        toilet_model.timestamp = Date.now();

        toilet_model.save(function (err) {
            if (err)
                res.send(err);
            res.json({
                message: 'success create toilet status.'
            });
        });
        // これやりたいけど難しそう
        socketio.emit(`toilet`, toilet_model.status);
    } else {
        res.json({
            message: 'not found toilet status.'
        });
    }
});

// ==============================

var User = require('./app/models/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

// passport が ユーザー情報をシリアライズすると呼び出されます
passport.serializeUser(function (id, done) {
    done(null, id);
});

// passport が ユーザー情報をデシリアライズすると呼び出されます
passport.deserializeUser(function (id, done) {
    User.findById(id, (error, user) => {
        if (error) {
            return done(error);
        }
        done(null, user);
    });
});

// passport における具体的な認証処理を設定します。
passport.use(
    "local",
    new LocalStrategy({
        usernameField: "name",
        passwordField: "password",
        passReqToCallback: true
    }, function (request, name, password, done) {
        process.nextTick(() => {
            User.findOne({
                'name': name
            }, function (error, user) {
                if (error) {
                    return done(error);
                }
                if (!user || user.password != password) {
                    return done(null, false, request.flash("message", "Invalid username or password."));
                }
                // 保存するデータは必要最低限にする
                return done(null, user._id);
            });
        });
    })
);

// passport設定
app.use(session({
    secret: "some salt",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/request', request);
app.use('/toilet', toilet_router);

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

// ==============================

var http = require('http');
var debug = require('debug')('equipment-management-system:server');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Atouch socket.io.
 */
var socketio = require('socket.io')(server);

socketio.on('connection', (socket) => {
    console.log('a user connected');
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}

//module.exports = app;

// ==============================
