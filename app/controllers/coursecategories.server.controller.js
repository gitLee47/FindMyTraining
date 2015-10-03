'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Coursecategory = mongoose.model('Coursecategory'),
	_ = require('lodash');

/**
 * Create a Coursecategory
 */
exports.create = function(req, res) {
	var coursecategory = new Coursecategory(req.body);
	coursecategory.addedBy = req.user;

	coursecategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(coursecategory);
		}
	});
};

/**
 * Show the current Coursecategory
 */
exports.read = function(req, res) {
	res.jsonp(req.coursecategory);
};

/**
 * Update a Coursecategory
 */
exports.update = function(req, res) {
	var coursecategory = req.coursecategory ;

	coursecategory = _.extend(coursecategory , req.body);

	coursecategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(coursecategory);
		}
	});
};

/**
 * Delete an Coursecategory
 */
exports.delete = function(req, res) {
	var coursecategory = req.coursecategory ;

	coursecategory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(coursecategory);
		}
	});
};

/**
 * List of Coursecategories
 */
exports.list = function(req, res) { 
	Coursecategory.find().sort('-addedDate').populate('addedBy', 'displayName').exec(function(err, coursecategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(coursecategories);
		}
	});
};

/**
 * Coursecategory middleware
 */
exports.coursecategoryByID = function(req, res, next, id) { 
	Coursecategory.findById(id).populate('addedBy', 'displayName').exec(function(err, coursecategory) {
		if (err) return next(err);
		if (! coursecategory) return next(new Error('Failed to load Coursecategory ' + id));
		req.coursecategory = coursecategory ;
		next();
	});
};

/**
 * Coursecategory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.coursecategory.addedBy.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
