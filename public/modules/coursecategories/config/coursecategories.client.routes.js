'use strict';

//Setting up route
angular.module('coursecategories').config(['$stateProvider',
	function($stateProvider) {
		// Coursecategories state routing
		$stateProvider.
		state('listCoursecategories', {
			url: '/coursecategories',
			templateUrl: 'modules/coursecategories/views/list-coursecategories.client.view.html'
		}).
		state('createCoursecategory', {
			url: '/coursecategories/create',
			templateUrl: 'modules/coursecategories/views/create-coursecategory.client.view.html'
		}).
		state('viewCoursecategory', {
			url: '/coursecategories/:coursecategoryId',
			templateUrl: 'modules/coursecategories/views/view-coursecategory.client.view.html'
		}).
		state('editCoursecategory', {
			url: '/coursecategories/:coursecategoryId/edit',
			templateUrl: 'modules/coursecategories/views/edit-coursecategory.client.view.html'
		});
	}
]);