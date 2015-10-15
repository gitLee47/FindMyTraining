'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', 'Locations', 'Coursecategories',
	function($scope, Authentication, $location, Locations, Coursecategories) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		//setting twitter widget
		twttr.widgets.load();

		// Search Result
		$scope.search = function() {
				$location.path('results/' + this.city+ '/' + this.courseCategory);
		};

		// Find a list of Cities and Course Type and TPs
		$scope.getDropDowns = function() {
			$scope.locations = Locations.query();
			$scope.coursecategories = Coursecategories.query();
		}
	}
]);
