'use strict';

// Coursecategories controller
angular.module('coursecategories').controller('CoursecategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Coursecategories',
	function($scope, $stateParams, $location, Authentication, Coursecategories) {
		$scope.authentication = Authentication;

		// Create new Coursecategory
		$scope.create = function() {
			// Create new Coursecategory object
			var coursecategory = new Coursecategories ({
				courseName: this.courseName,
				courseDescription: this.courseDescription,
				targetAudience: this.targetAudience,
				preRequisites: this.preRequisites
			});

			// Redirect after save
			coursecategory.$save(function(response) {
				//$location.path('coursecategories/' + response._id);
				$location.path('coursecategories');
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Coursecategory
		$scope.remove = function(coursecategory) {
			if ( coursecategory ) { 
				coursecategory.$remove();

				for (var i in $scope.coursecategories) {
					if ($scope.coursecategories [i] === coursecategory) {
						$scope.coursecategories.splice(i, 1);
					}
				}
			} else {
				$scope.coursecategory.$remove(function() {
					$location.path('coursecategories');
				});
			}
		};

		// Update existing Coursecategory
		$scope.update = function() {
			var coursecategory = $scope.coursecategory;

			coursecategory.$update(function() {
				//$location.path('coursecategories/' + coursecategory._id);
				$location.path('coursecategories');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Coursecategories
		$scope.find = function() {
			$scope.coursecategories = Coursecategories.query();
		};

		// Find existing Coursecategory
		$scope.findOne = function() {
			$scope.coursecategory = Coursecategories.get({ 
				coursecategoryId: $stateParams.coursecategoryId
			});
		};
	}
]);
