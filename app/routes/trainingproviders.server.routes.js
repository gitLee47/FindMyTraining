'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var trainingproviders = require('../../app/controllers/trainingproviders.server.controller');

	// Trainingproviders Routes
	app.route('/trainingproviders')
		.get(trainingproviders.list)
		.post(users.requiresLogin, trainingproviders.create);

	app.route('/trainingproviders/:trainingproviderId')
		.get(trainingproviders.read)
		.put(users.requiresLogin, trainingproviders.hasAuthorization, trainingproviders.update)
		.delete(users.requiresLogin, trainingproviders.hasAuthorization, trainingproviders.delete);

	// Finish by binding the Trainingprovider middleware
	app.param('trainingproviderId', trainingproviders.trainingproviderByID);
};
