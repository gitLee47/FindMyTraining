'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var results = require('../../app/controllers/results.server.controller');

	// Results Routes
	app.route('/results')
		.get(results.list)
		.post(results.create);

	app.route('/results/:resultId')
		.get(results.read)
		.put(users.requiresLogin, results.hasAuthorization, results.update)
		.delete(users.requiresLogin, results.hasAuthorization, results.delete);

	// Finish by binding the Result middleware
	app.param('resultId', results.resultByID);
};
