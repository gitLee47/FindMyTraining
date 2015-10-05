'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Trainingprovider = mongoose.model('Trainingprovider'),
	_ = require('lodash');

/**
 * Create a Trainingprovider
 */
exports.create = function(req, res) {
	var trainingprovider = new Trainingprovider(req.body);
	trainingprovider.user = req.user;

	trainingprovider.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trainingprovider);
		}
	});
};

/**
 * Show the current Trainingprovider
 */
exports.read = function(req, res) {
	res.jsonp(req.trainingprovider);
};

/**
 * Update a Trainingprovider
 */
exports.update = function(req, res) {
	var trainingprovider = req.trainingprovider ;

	trainingprovider = _.extend(trainingprovider , req.body);

	trainingprovider.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trainingprovider);
		}
	});
};

/**
 * Delete an Trainingprovider
 */
exports.delete = function(req, res) {
	var trainingprovider = req.trainingprovider ;

	trainingprovider.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trainingprovider);
		}
	});
};

/**
 * List of Trainingproviders
 */
exports.list = function(req, res) { 
	Trainingprovider.find().sort('-created').populate('user', 'displayName').exec(function(err, trainingproviders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trainingproviders);
		}
	});
};

/**
 * Trainingprovider middleware
 */
exports.trainingproviderByID = function(req, res, next, id) { 
	Trainingprovider.findById(id).populate('user', 'displayName').exec(function(err, trainingprovider) {
		if (err) return next(err);
		if (! trainingprovider) return next(new Error('Failed to load Trainingprovider ' + id));
		req.trainingprovider = trainingprovider ;
		next();
	});
};

/**
 * Trainingprovider authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.trainingprovider.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
