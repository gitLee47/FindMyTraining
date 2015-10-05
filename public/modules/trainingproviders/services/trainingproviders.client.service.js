'use strict';

//Trainingproviders service used to communicate Trainingproviders REST endpoints
angular.module('trainingproviders').factory('Trainingproviders', ['$resource',
	function($resource) {
		return $resource('trainingproviders/:trainingproviderId', { trainingproviderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);