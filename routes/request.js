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
        name: req.body.user_name
    }).exec(function (err, existUser) {
        if (err)
            res.send(err);
        if (existUser !== "" || existUser === null) {
            user = new User();
            user.name = req.body.user_name;
            user.save(function (err) {
                if (err)
                    res.send(err);
            });
        } else
            user = existUser;
    });

    Equipment.findOne({
        name: req.body.equipment_name
    }).exec(function (err, existEquip) {
        if (err)
            res.send(err);
        if (existEquip !== "" || existEquip === null) {
            equipment = new Equipment();
            equipment.name = req.body.equipment_name;
            equipment.save(function (err) {
                if (err)
                    res.send(err);
            });
        } else
            equipment = existEquipment;
    });

    var request = new Request();

    request.user = user;
    request.equipment = equipment;
    request.quantity = req.body.quantity;
    request.remarks = req.body.remarks;
    request.url = req.body.url;
    request.timestamp = Date.now();
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
