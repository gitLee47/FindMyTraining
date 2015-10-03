'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Coursecategory Schema
 */
var CoursecategorySchema = new Schema({
	courseName: {
		type: String,
		default: '',
		required: 'Please fill Course Category name',
		trim: true
	},
	courseDescription: {
		type: String,
		default: '',
		trim: true
	},
	targetAudience: {
		type: String,
		default: '',
		trim: true
	},
	preRequisites: {
		type: String,
		default: '',
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

mongoose.model('Coursecategory', CoursecategorySchema);
