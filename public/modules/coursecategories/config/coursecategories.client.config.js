'use strict';

// Configuring the Articles module
angular.module('coursecategories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Course Categories', 'coursecategories', 'dropdown', '/coursecategories(/create)?');
		Menus.addSubMenuItem('topbar', 'coursecategories', 'List Categories', 'coursecategories');
		Menus.addSubMenuItem('topbar', 'coursecategories', 'New Category', 'coursecategories/create');
	}
]);
