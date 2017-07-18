var express = require('express');
var router = express.Router();

// DBへの接続
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/equipment_management_system');

// モデルの宣言
var Request = require('../app/models/request');
var User = require('../app/models/user');
var Equipment = require('../app/models/equipment');

router.get('/api/request', function(req, res, next) {
    Request.find()
        .sort({
            'timestamp': -1
        })
        .populate('user')
        .populate('equipment')
        .exec(function (err, requests) {
            if (err)
                res.send(err);
            res.json(requests);
        });
});

router.post('/api/request', function(req, res, next) {
    Request.find()
        .sort({
            'timestamp': -1
        })
        .populate('user')
        .populate('equipment')
        .exec(function (err, requests) {
            if (err)
                res.send(err);
            res.json(requests);
        });
});

module.exports = router;