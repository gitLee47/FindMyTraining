'use strict';

// Configuring the Articles module
angular.module('results').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Courses', 'results', 'dropdown', '/results(/create)?');
		Menus.addSubMenuItem('topbar', 'results', 'List Courses', 'view-courses');
		Menus.addSubMenuItem('topbar', 'results', 'New Course', 'results/create');
	}
]);
