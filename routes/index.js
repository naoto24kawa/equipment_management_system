var express = require('express');
var router = express.Router();

// DBへの接続
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/equipment_management_system');

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

//router.post('/signin', passport.authenticate('local', {
//    failureRedirect: '/◆◆', // 失敗したときの遷移先
//    successRedirect: '/◇◇', // 成功したときの遷移先
//}), function (req, res, next) {
//    //成功時の処理
//});

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
        res.json({
            message: 'success create user.'
        });
        res.redirect('/');
    });
});

module.exports = router;
