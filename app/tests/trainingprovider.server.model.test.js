'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Trainingprovider = mongoose.model('Trainingprovider');

/**
 * Globals
 */
var user, trainingprovider;

/**
 * Unit tests
 */
describe('Trainingprovider Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			trainingprovider = new Trainingprovider({
				name: 'Trainingprovider Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return trainingprovider.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			trainingprovider.name = '';

			return trainingprovider.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Trainingprovider.remove().exec();
		User.remove().exec();

		done();
	});
});