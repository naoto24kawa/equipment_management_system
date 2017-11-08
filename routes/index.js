var express = require('express');
var passport = require('passport');
var router = express.Router();

// DBへの接続
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_qb55r46q:5mhum2i8dqoqhp8k4h8nuulqfv@ds015690.mlab.com:15690/heroku_qb55r46q');

// モデルの宣言
var Request = require('../app/models/request');
var User = require('../app/models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    Request.find()
        .sort({
            'timestamp': -1
        })
        .limit(20)
        .exec(function (err, requests) {
            if (err)
                res.send(err);
            res.render('index', {
                request_link: '#request',
                status_link: '#status',
                log_link: '#log',
                requests: requests
            });
        });
});

router.get('/signin', function (req, res, next) {
    res.render('sign', {
        request_link: '#request',
        status_link: '#status',
        log_link: '#log',
        method: 'in'
    });
});

router.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin', // 失敗したときの遷移先
//    successRedirect: '/dashboard', // 成功したときの遷移先
}), function (req, res, next) {
    res.redirect('/');
});

router.get('/signup', function (req, res, next) {
    res.render('sign', {
        request_link: '#request',
        status_link: '#status',
        log_link: '#log',
        method: 'up'
    });
});

router.post('/signup', function (req, res, next) {
    var user = new User();

    user.name = req.body.name;
    user.password = req.body.password;

    user.save(function (err) {
        if (err)
            res.send(err);
        res.redirect('/');
    });
});

module.exports = router;
