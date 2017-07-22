var express = require('express');
var router = express.Router();

// DBへの接続
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/equipment_management_system');

// モデルの宣言
var Request = require('../app/models/request');

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
    if (err)
        res.send(err);
    res.render('sign', {
        request_link: '#request',
        status_link: '#status',
        log_link: '#log',
        method: 'in'
    });
});

router.post('/signin', passport.authenticate('local', {
    failureRedirect: '/◆◆', // 失敗したときの遷移先
    successRedirect: '/◇◇', // 成功したときの遷移先
}), function (req, res, next) {
    //成功時の処理
});

router.get('/signup', function (req, res, next) {
    if (err)
        res.send(err);
    res.render('sign', {
        request_link: '#request',
        status_link: '#status',
        log_link: '#log',
        method: 'up'
    });
});

router.post('/signup', function (req, res, next) {
    //成功時の処理
});

module.exports = router;
