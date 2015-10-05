'use strict';

// Configuring the Articles module
angular.module('trainingproviders').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Trainingproviders', 'trainingproviders', 'dropdown', '/trainingproviders(/create)?');
		Menus.addSubMenuItem('topbar', 'trainingproviders', 'List Trainingproviders', 'trainingproviders');
		Menus.addSubMenuItem('topbar', 'trainingproviders', 'New Trainingprovider', 'trainingproviders/create');
	}
]);