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


var ResultTestSchema = new Schema({
	companyName: {
		type: String,
		default: '',
		required: 'Please fill Company name',
		trim: true
	},
	trainingName: {
		type: String,
		default: '',
		required: 'Please fill training name',
		trim: true
	},
	city: {
		type: String,
		default: '',
		required: 'Please city name',
		trim: true
	},
	trainingType1: {
		type: String,
		default: '',
		required: 'Please fill type1',
		trim: true
	},
	trainingType2: {
		type: String,
		default: '',
		required: 'Please fill type2',
		trim: true
	},
	duration: {
		type: Number,
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
	rating: {
		type: Number,
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

mongoose.model('Result', ResultTestSchema);
