var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_qb55r46q:5mhum2i8dqoqhp8k4h8nuulqfv@ds015690.mlab.com:15690/heroku_qb55r46q');

var Request = require('../app/models/request');

router.get('/api', function (req, res, next) {
    Request.find()
        .sort({
            'timestamp': -1
        })
        .exec(function (err, requests) {
            if (err)
                res.send(err);
            res.json(requests);
        });
});

router.post('/api', function (req, res, next) {

    var request = new Request();

    request.user = req.body.user_name;
    request.equipment = req.body.equipment_name;
    request.quantity = req.body.quantity;
    request.remarks = req.body.remarks;
    request.url = req.body.url;
    request.timestamp = Date.now();
    request.status = 1;

    request.save(function (err) {
        if (err)
            res.send(err);
        res.redirect('/');
    });

});

router.put('/api', function (req, res, next) {

    Request.findById(req.body.request_id, function (err, request) {
        if (err)
            res.send(err);
        request.status = req.body.status;

        request.save(function (err) {
            if (err)
                res.send(err);
            res.redirect('/');
        });
    });

});

module.exports = router;
