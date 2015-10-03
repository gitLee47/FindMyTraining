'use strict';

//Coursecategories service used to communicate Coursecategories REST endpoints
angular.module('coursecategories').factory('Coursecategories', ['$resource',
	function($resource) {
		return $resource('coursecategories/:coursecategoryId', { coursecategoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);