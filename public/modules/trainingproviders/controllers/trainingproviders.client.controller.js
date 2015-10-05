'use strict';

// Trainingproviders controller
angular.module('trainingproviders').controller('TrainingprovidersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trainingproviders',
	function($scope, $stateParams, $location, Authentication, Trainingproviders) {
		$scope.authentication = Authentication;

		// Create new Trainingprovider
		$scope.create = function() {
			// Create new Trainingprovider object
			var trainingprovider = new Trainingproviders ({
				name: this.name
			});

			// Redirect after save
			trainingprovider.$save(function(response) {
				$location.path('trainingproviders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Trainingprovider
		$scope.remove = function(trainingprovider) {
			if ( trainingprovider ) { 
				trainingprovider.$remove();

				for (var i in $scope.trainingproviders) {
					if ($scope.trainingproviders [i] === trainingprovider) {
						$scope.trainingproviders.splice(i, 1);
					}
				}
			} else {
				$scope.trainingprovider.$remove(function() {
					$location.path('trainingproviders');
				});
			}
		};

		// Update existing Trainingprovider
		$scope.update = function() {
			var trainingprovider = $scope.trainingprovider;

			trainingprovider.$update(function() {
				$location.path('trainingproviders/' + trainingprovider._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Trainingproviders
		$scope.find = function() {
			$scope.trainingproviders = Trainingproviders.query();
		};

		// Find existing Trainingprovider
		$scope.findOne = function() {
			$scope.trainingprovider = Trainingproviders.get({ 
				trainingproviderId: $stateParams.trainingproviderId
			});
		};
	}
]);