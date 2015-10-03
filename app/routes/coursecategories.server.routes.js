'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var coursecategories = require('../../app/controllers/coursecategories.server.controller');

	// Coursecategories Routes
	app.route('/coursecategories')
		.get(coursecategories.list)
		.post(users.requiresLogin, coursecategories.create);

	app.route('/coursecategories/:coursecategoryId')
		.get(coursecategories.read)
		.put(users.requiresLogin, coursecategories.hasAuthorization, coursecategories.update)
		.delete(users.requiresLogin, coursecategories.hasAuthorization, coursecategories.delete);

	// Finish by binding the Coursecategory middleware
	app.param('coursecategoryId', coursecategories.coursecategoryByID);
};
