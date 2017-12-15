var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_qb55r46q:5mhum2i8dqoqhp8k4h8nuulqfv@ds015690.mlab.com:15690/heroku_qb55r46q');

var Toilet = require('../app/models/toilet');

/* GET home page. */
var returnRouter = function(io) {
	router.get('/', function (req, res, next) {
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

		if (req.body.status != null) {
			toilet.status = req.body.status;
			toilet.timestamp = Date.now();

			toilet.save(function (err) {
				if (err)
					res.send(err);
				res.json({
					message: 'success create toilet status.'
				});
			});
			// これやりたいけど難しそう
			 io.emit(`toilet`, toilet.status);
		} else {
			res.json({
				message: 'not found toilet status.'
			});
		}
	});
}

module.exports = returnRouter;