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
        .populate('user')
        .populate('equipment')
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

module.exports = router;
