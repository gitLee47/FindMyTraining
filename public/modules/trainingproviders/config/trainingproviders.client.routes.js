'use strict';

//Setting up route
angular.module('trainingproviders').config(['$stateProvider',
	function($stateProvider) {
		// Trainingproviders state routing
		$stateProvider.
		state('listTrainingproviders', {
			url: '/trainingproviders',
			templateUrl: 'modules/trainingproviders/views/list-trainingproviders.client.view.html'
		}).
		state('createTrainingprovider', {
			url: '/trainingproviders/create',
			templateUrl: 'modules/trainingproviders/views/create-trainingprovider.client.view.html'
		}).
		state('viewTrainingprovider', {
			url: '/trainingproviders/:trainingproviderId',
			templateUrl: 'modules/trainingproviders/views/view-trainingprovider.client.view.html'
		}).
		state('editTrainingprovider', {
			url: '/trainingproviders/:trainingproviderId/edit',
			templateUrl: 'modules/trainingproviders/views/edit-trainingprovider.client.view.html'
		});
	}
]);