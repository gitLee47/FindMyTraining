'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location',
	function($scope, Authentication, $location) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


		// Create new Result
		$scope.search = function() {


			// Redirect after save

				$location.path('results/' + this.city+ '/' + this.trainingName);


		};
	}
]);
