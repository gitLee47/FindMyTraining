'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Result = mongoose.model('Result'),
	_ = require('lodash');

/**
 * Create a Result
 */
exports.create = function(req, res) {
	var result = new Result(req.body);
	result.user = req.user;

	result.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(result);
		}
	});
};

/**
 * Show the current Result
 */
exports.read = function(req, res) {
	res.jsonp(req.result);
};

/**
 * Update a Result
 */
exports.update = function(req, res) {
	var result = req.result ;

	result = _.extend(result , req.body);

	result.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(result);
		}
	});
};

/**
 * Delete an Result
 */
exports.delete = function(req, res) {
	var result = req.result ;

	result.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(result);
		}
	});
};

/**
 * List of Results
 */
exports.list = function(req, res) { 
	Result.find().sort('-created').populate('user', 'displayName').exec(function(err, results) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(results);
		}
	});
};

/**
 * Search Results
 */
exports.listBySearch = function(req, res) {
	if((req.query['city'] != 'undefined') && (req.query['trainingName'] != 'undefined')) {
		console.log('in all');
		Result.find().where('city', new RegExp(req.query['city'], 'i')).where('trainingName', new RegExp(req.query['trainingName'], 'i'))
			.sort('-created').populate('user', 'displayName')
			.exec(function (err, results) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(results);
				}
			});
	}
	else if ((req.query['city'] != 'undefined') && (req.query['trainingName'] == 'undefined')) {
		Result.find().where('city', new RegExp(req.query['city'], 'i'))
			.sort('-created').populate('user', 'displayName')
			.exec(function (err, results) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(results);
				}
			});
	}
	else if ((req.query['city'] == 'undefined' ) && (req.query['trainingName'] != 'undefined')) {
		Result.find().where('trainingName', new RegExp(req.query['trainingName'], 'i'))
			.sort('-created').populate('user', 'displayName')
			.exec(function (err, results) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(results);
				}
			});
	}
	else {
		return res.status(400).send({
			message: 'Please enter valid parameters!'
		});
	}
};

/**
 * Result middleware
 */
exports.resultByID = function(req, res, next, id) { 
	Result.findById(id).populate('user', 'displayName').exec(function(err, result) {
		if (err) return next(err);
		if (! result) return next(new Error('Failed to load Result ' + id));
		req.result = result ;
		next();
	});
};

/**
 * Result authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.result.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
