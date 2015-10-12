'use strict';

// Results controller
angular.module('results').controller('ResultsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Results', 'Locations', 'Coursecategories', 'Trainingproviders',
	function($scope, $stateParams, $location, Authentication, Results, Locations, Coursecategories, Trainingproviders) {
		$scope.authentication = Authentication;
		// Create new Result
		$scope.create = function() {
			// Create new Result object
			var result = new Results ({
				trainingProvider: this.trainingProvider,
				courseCategory: this.courseCategory,
				city: this.city,
				deliveryType: this.deliveryType,
				timing: this.timing,
				duration: this.duration,
				durationType: this.durationType,
				dateFrom: this.dateFrom,
				dateTo: this.dateTo,
				price: this.price,
				currency: this.currency
			});
			// Redirect after save
			result.$save(function(response) {
				//$location.path('results/' + response._id);
                $location.path('view-courses');
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Result
		$scope.remove = function(result) {
			if ( result ) { 
				result.$remove();

				for (var i in $scope.results) {
					if ($scope.results [i] === result) {
						$scope.results.splice(i, 1);
					}
				}
			} else {
				$scope.result.$remove(function() {
					$location.path('results');
				});
			}
		};

		// Update existing Result
		$scope.update = function() {
			var result = $scope.result;

			result.$update(function() {
				$location.path('results/' + result._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Courses
		$scope.find = function() {
			$scope.results = Results.query({city:'viewer', courseCategory:'viewer'});

		};

		// Find a list of Cities and Course Type and TPs
		$scope.getDropDowns = function() {
			$scope.locations = Locations.query();
			$scope.coursecategories = Coursecategories.query();
			$scope.trainingproviders = Trainingproviders.query();
		};

		//Find list of Results using Search
		$scope.searchResults = function() {
			$scope.results = Results.query({city:$stateParams.city, courseCategory:$stateParams.courseCategory});
		};

		// Find existing Result
		$scope.findOne = function() {
			$scope.result = Results.get({ 
				resultId: $stateParams.resultId
			});
		};
	}
]);
