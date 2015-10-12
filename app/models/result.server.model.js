'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Result Schema

var ResultSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Result name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});
 */


var CoursesSchema = new Schema({
	trainingProvider: {
		type: Schema.ObjectId,
		required: 'Please fill Company name',
		ref: 'Trainingprovider'
	},
	courseCategory: {
		type: Schema.ObjectId,
		required: 'Please fill training name',
		ref: 'Coursecategory'
	},
	city: {
		type: Schema.ObjectId,
		required: 'Please city name',
		ref: 'Location'
	},
	deliveryType: {
		type: String,
		default: '',
		required: 'Please fill Delivery type',
		trim: true
	},
	timing: {
		type: String,
		default: '',
		required: 'Please fill Timing',
		trim: true
	},
	duration: {
		type: Number,
		default: '',
		trim: true
	},
	durationType: {
		type: String,
		default: '',
		trim: true
	},
	dateFrom: {
		type: Date,
		trim: true
	},
	dateTo: {
		type: Date,
		trim: true
	},
	price: {
		type: Number,
		trim: true
	},
	currency: {
		type: String,
		trim: true
	},
	addedDate: {
		type: Date,
		default: Date.now
	},
	addedBy: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'Please login to add course!'
	}
});

mongoose.model('Result', CoursesSchema);
