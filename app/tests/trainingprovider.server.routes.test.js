'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Trainingprovider = mongoose.model('Trainingprovider'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, trainingprovider;

/**
 * Trainingprovider routes tests
 */
describe('Trainingprovider CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Trainingprovider
		user.save(function() {
			trainingprovider = {
				name: 'Trainingprovider Name'
			};

			done();
		});
	});

	it('should be able to save Trainingprovider instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trainingprovider
				agent.post('/trainingproviders')
					.send(trainingprovider)
					.expect(200)
					.end(function(trainingproviderSaveErr, trainingproviderSaveRes) {
						// Handle Trainingprovider save error
						if (trainingproviderSaveErr) done(trainingproviderSaveErr);

						// Get a list of Trainingproviders
						agent.get('/trainingproviders')
							.end(function(trainingprovidersGetErr, trainingprovidersGetRes) {
								// Handle Trainingprovider save error
								if (trainingprovidersGetErr) done(trainingprovidersGetErr);

								// Get Trainingproviders list
								var trainingproviders = trainingprovidersGetRes.body;

								// Set assertions
								(trainingproviders[0].user._id).should.equal(userId);
								(trainingproviders[0].name).should.match('Trainingprovider Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Trainingprovider instance if not logged in', function(done) {
		agent.post('/trainingproviders')
			.send(trainingprovider)
			.expect(401)
			.end(function(trainingproviderSaveErr, trainingproviderSaveRes) {
				// Call the assertion callback
				done(trainingproviderSaveErr);
			});
	});

	it('should not be able to save Trainingprovider instance if no name is provided', function(done) {
		// Invalidate name field
		trainingprovider.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trainingprovider
				agent.post('/trainingproviders')
					.send(trainingprovider)
					.expect(400)
					.end(function(trainingproviderSaveErr, trainingproviderSaveRes) {
						// Set message assertion
						(trainingproviderSaveRes.body.message).should.match('Please fill Trainingprovider name');
						
						// Handle Trainingprovider save error
						done(trainingproviderSaveErr);
					});
			});
	});

	it('should be able to update Trainingprovider instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trainingprovider
				agent.post('/trainingproviders')
					.send(trainingprovider)
					.expect(200)
					.end(function(trainingproviderSaveErr, trainingproviderSaveRes) {
						// Handle Trainingprovider save error
						if (trainingproviderSaveErr) done(trainingproviderSaveErr);

						// Update Trainingprovider name
						trainingprovider.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Trainingprovider
						agent.put('/trainingproviders/' + trainingproviderSaveRes.body._id)
							.send(trainingprovider)
							.expect(200)
							.end(function(trainingproviderUpdateErr, trainingproviderUpdateRes) {
								// Handle Trainingprovider update error
								if (trainingproviderUpdateErr) done(trainingproviderUpdateErr);

								// Set assertions
								(trainingproviderUpdateRes.body._id).should.equal(trainingproviderSaveRes.body._id);
								(trainingproviderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Trainingproviders if not signed in', function(done) {
		// Create new Trainingprovider model instance
		var trainingproviderObj = new Trainingprovider(trainingprovider);

		// Save the Trainingprovider
		trainingproviderObj.save(function() {
			// Request Trainingproviders
			request(app).get('/trainingproviders')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Trainingprovider if not signed in', function(done) {
		// Create new Trainingprovider model instance
		var trainingproviderObj = new Trainingprovider(trainingprovider);

		// Save the Trainingprovider
		trainingproviderObj.save(function() {
			request(app).get('/trainingproviders/' + trainingproviderObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', trainingprovider.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Trainingprovider instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trainingprovider
				agent.post('/trainingproviders')
					.send(trainingprovider)
					.expect(200)
					.end(function(trainingproviderSaveErr, trainingproviderSaveRes) {
						// Handle Trainingprovider save error
						if (trainingproviderSaveErr) done(trainingproviderSaveErr);

						// Delete existing Trainingprovider
						agent.delete('/trainingproviders/' + trainingproviderSaveRes.body._id)
							.send(trainingprovider)
							.expect(200)
							.end(function(trainingproviderDeleteErr, trainingproviderDeleteRes) {
								// Handle Trainingprovider error error
								if (trainingproviderDeleteErr) done(trainingproviderDeleteErr);

								// Set assertions
								(trainingproviderDeleteRes.body._id).should.equal(trainingproviderSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Trainingprovider instance if not signed in', function(done) {
		// Set Trainingprovider user 
		trainingprovider.user = user;

		// Create new Trainingprovider model instance
		var trainingproviderObj = new Trainingprovider(trainingprovider);

		// Save the Trainingprovider
		trainingproviderObj.save(function() {
			// Try deleting Trainingprovider
			request(app).delete('/trainingproviders/' + trainingproviderObj._id)
			.expect(401)
			.end(function(trainingproviderDeleteErr, trainingproviderDeleteRes) {
				// Set message assertion
				(trainingproviderDeleteRes.body.message).should.match('User is not logged in');

				// Handle Trainingprovider error error
				done(trainingproviderDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Trainingprovider.remove().exec();
		done();
	});
});