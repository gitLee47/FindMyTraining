'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var TrainerSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	profile: {
		type: String,
		default: '',
		trim: true
	},
	photo: {
		type: String,
		default: '',
		trim: true
	}
});

/**
 * Trainingprovider Schema
 */
var TrainingproviderSchema = new Schema({
	companyName: {
		type: String,
		default: '',
		required: 'Please fill Training Provider name',
		trim: true
	},
	url: {
		type: String,
		default: '',
		required: 'Please fill Training Provider URl',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	address: {
		type: String,
		default: '',
		trim: true
	},
	city: {
		type: String,
		default: '',
		required: 'Please fill Training Provider City',
		trim: true
	},
	country: {
		type: String,
		default: '',
		required: 'Please fill Training Provider Country',
		trim: true
	},
	contactNo: {
		type: Number,
		default: '',
		required: 'Please fill Training Provider Ph No',
		trim: true
	},
	email: {
		type: String,
		default: '',
		required: 'Please fill Training Provider email',
		trim: true
	},
	cName: {
		type: String,
		default: '',
		required: 'Please fill Training Provider Contact Name',
		trim: true
	},
	cEmail: {
		type: String,
		default: '',
		required: 'Please fill Training Provider Contact Email',
		trim: true
	},
	cPhone: {
		type: Number,
		default: '',
		required: 'Please fill Training Provider Contact phone',
		trim: true
	},
	trainer1: [TrainerSchema],
	trainer2: [TrainerSchema],
	trainer3: [TrainerSchema],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Trainingprovider', TrainingproviderSchema);
