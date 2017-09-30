var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/equipment_management_system');

var Toilet = require('../app/models/toilet');

router.get('/', function (req, res, next) {
    res.render('toilet');
});

router.get('/api', function (req, res, next) {
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

router.post('/api', function (req, res, next) {

    var toilet = new Toilet();

    toilet.status = req.body.status;
    toilet.timestamp = Date.now();

    toilet.save(function (err) {
        if (err)
            res.send(err);
        res.json({message: 'success create toilet status.'});
    });

});

module.exports = router;
