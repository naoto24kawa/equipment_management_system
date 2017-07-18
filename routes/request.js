var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/equipment_management_system');

var Request = require('../app/models/request');
var User = require('../app/models/user');
var Equipment = require('../app/models/equipment');

router.get('/api/request', function (req, res, next) {
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

router.post('/api/request', function (req, res, next) {
    var user;
    var equipment;

    User.findOne({
        name: req.user_name
    }).exec(function (err, existUser) {
        if (err)
            res.send(err);
        if (existUser !== "" || existUser === null) {
            user = new User();
            user.name = req.user_name;
        } else
            user = existUser;
    });

    Equipment.findOne({
        name: req.equipment_name
    }).exec(function (err, existEquip) {
        if (err)
            res.send(err);
        if (existEquip !== "" || existEquip === null) {
            equipment = new Equipment();
            user.name = req.equipment_name;
        } else
            equipment = existEquipment;
    });

    var request = new Request();
    var d = new Date();

    request.user = user;
    request.equipment = equipment;
    request.quantity = req.quantity;
    request.remarks = req.remarks;
    request.url = req.url;
    request.timestamp = ISODate(d.toISOString + 'T00+09:00');;
    request.status = 1;

    request.save(function (err) {
        if (err)
            res.send(err);
        res.json({
            message: 'New Request created!'
        });
    });
});

module.exports = router;
