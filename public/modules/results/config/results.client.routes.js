'use strict';

//Setting up route
angular.module('results').config(['$stateProvider',
	function($stateProvider) {
		// Results state routing
		$stateProvider.
		state('view-courses', {
			url: '/view-courses',
			templateUrl: 'modules/results/views/view-courses.client.view.html'
		}).
		/*state('listResults', {
			url: '/results',
			templateUrl: 'modules/results/views/list-results.client.view.html'
		}).*/
		state('searchResults', {
			url: '/results/:city/:courseCategory',
			templateUrl: 'modules/results/views/list-results.client.view.html'
		}).
		state('createResult', {
			url: '/results/create',
			templateUrl: 'modules/results/views/create-result.client.view.html'
		}).
		state('viewResult', {
			url: '/results/:resultId',
			templateUrl: 'modules/results/views/view-result.client.view.html'
		}).
		state('editResult', {
			url: '/results/:resultId/edit/1',
			templateUrl: 'modules/results/views/edit-result.client.view.html'
		});
	}
]);
