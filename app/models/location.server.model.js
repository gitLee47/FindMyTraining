'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Location Schema
 */
var LocationSchema = new Schema({
	city: {
		type: String,
		default: '',
		required: 'Please fill Location name',
		trim: true
	},
	state: {
		type: String,
		default: '',
		trim: true
	},
	country: {
		type: String,
		default: '',
		required: 'Please fill Country name',
		trim: true
	},
	addedDate: {
		type: Date,
		default: Date.now
	},
	addedBy: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Location', LocationSchema);
