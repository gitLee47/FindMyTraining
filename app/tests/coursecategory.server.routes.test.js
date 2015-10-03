'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Coursecategory = mongoose.model('Coursecategory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, coursecategory;

/**
 * Coursecategory routes tests
 */
describe('Coursecategory CRUD tests', function() {
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

		// Save a user to the test db and create new Coursecategory
		user.save(function() {
			coursecategory = {
				name: 'Coursecategory Name'
			};

			done();
		});
	});

	it('should be able to save Coursecategory instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Coursecategory
				agent.post('/coursecategories')
					.send(coursecategory)
					.expect(200)
					.end(function(coursecategorySaveErr, coursecategorySaveRes) {
						// Handle Coursecategory save error
						if (coursecategorySaveErr) done(coursecategorySaveErr);

						// Get a list of Coursecategories
						agent.get('/coursecategories')
							.end(function(coursecategoriesGetErr, coursecategoriesGetRes) {
								// Handle Coursecategory save error
								if (coursecategoriesGetErr) done(coursecategoriesGetErr);

								// Get Coursecategories list
								var coursecategories = coursecategoriesGetRes.body;

								// Set assertions
								(coursecategories[0].user._id).should.equal(userId);
								(coursecategories[0].name).should.match('Coursecategory Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Coursecategory instance if not logged in', function(done) {
		agent.post('/coursecategories')
			.send(coursecategory)
			.expect(401)
			.end(function(coursecategorySaveErr, coursecategorySaveRes) {
				// Call the assertion callback
				done(coursecategorySaveErr);
			});
	});

	it('should not be able to save Coursecategory instance if no name is provided', function(done) {
		// Invalidate name field
		coursecategory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Coursecategory
				agent.post('/coursecategories')
					.send(coursecategory)
					.expect(400)
					.end(function(coursecategorySaveErr, coursecategorySaveRes) {
						// Set message assertion
						(coursecategorySaveRes.body.message).should.match('Please fill Coursecategory name');
						
						// Handle Coursecategory save error
						done(coursecategorySaveErr);
					});
			});
	});

	it('should be able to update Coursecategory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Coursecategory
				agent.post('/coursecategories')
					.send(coursecategory)
					.expect(200)
					.end(function(coursecategorySaveErr, coursecategorySaveRes) {
						// Handle Coursecategory save error
						if (coursecategorySaveErr) done(coursecategorySaveErr);

						// Update Coursecategory name
						coursecategory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Coursecategory
						agent.put('/coursecategories/' + coursecategorySaveRes.body._id)
							.send(coursecategory)
							.expect(200)
							.end(function(coursecategoryUpdateErr, coursecategoryUpdateRes) {
								// Handle Coursecategory update error
								if (coursecategoryUpdateErr) done(coursecategoryUpdateErr);

								// Set assertions
								(coursecategoryUpdateRes.body._id).should.equal(coursecategorySaveRes.body._id);
								(coursecategoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Coursecategories if not signed in', function(done) {
		// Create new Coursecategory model instance
		var coursecategoryObj = new Coursecategory(coursecategory);

		// Save the Coursecategory
		coursecategoryObj.save(function() {
			// Request Coursecategories
			request(app).get('/coursecategories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Coursecategory if not signed in', function(done) {
		// Create new Coursecategory model instance
		var coursecategoryObj = new Coursecategory(coursecategory);

		// Save the Coursecategory
		coursecategoryObj.save(function() {
			request(app).get('/coursecategories/' + coursecategoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', coursecategory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Coursecategory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Coursecategory
				agent.post('/coursecategories')
					.send(coursecategory)
					.expect(200)
					.end(function(coursecategorySaveErr, coursecategorySaveRes) {
						// Handle Coursecategory save error
						if (coursecategorySaveErr) done(coursecategorySaveErr);

						// Delete existing Coursecategory
						agent.delete('/coursecategories/' + coursecategorySaveRes.body._id)
							.send(coursecategory)
							.expect(200)
							.end(function(coursecategoryDeleteErr, coursecategoryDeleteRes) {
								// Handle Coursecategory error error
								if (coursecategoryDeleteErr) done(coursecategoryDeleteErr);

								// Set assertions
								(coursecategoryDeleteRes.body._id).should.equal(coursecategorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Coursecategory instance if not signed in', function(done) {
		// Set Coursecategory user 
		coursecategory.user = user;

		// Create new Coursecategory model instance
		var coursecategoryObj = new Coursecategory(coursecategory);

		// Save the Coursecategory
		coursecategoryObj.save(function() {
			// Try deleting Coursecategory
			request(app).delete('/coursecategories/' + coursecategoryObj._id)
			.expect(401)
			.end(function(coursecategoryDeleteErr, coursecategoryDeleteRes) {
				// Set message assertion
				(coursecategoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Coursecategory error error
				done(coursecategoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Coursecategory.remove().exec();
		done();
	});
});