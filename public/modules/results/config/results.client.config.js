'use strict';

// Configuring the Articles module
angular.module('results').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Results', 'results', 'dropdown', '/results(/create)?');
		Menus.addSubMenuItem('topbar', 'results', 'List Results', 'results');
		Menus.addSubMenuItem('topbar', 'results', 'New Result', 'results/create');
	}
]);