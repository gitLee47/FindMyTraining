'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'findmytrainingcom';
	var applicationModuleVendorDependencies = ['ngResource','ngRoute', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'ui.bootstrap.datetimepicker'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('coursecategories');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('locations');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('results');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('trainingproviders');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', 'Locations', 'Coursecategories',
	function($scope, Authentication, $location, Locations, Coursecategories) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


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

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('coursecategories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Course Categories', 'coursecategories', 'dropdown', '/coursecategories(/create)?');
		Menus.addSubMenuItem('topbar', 'coursecategories', 'List Categories', 'coursecategories');
		Menus.addSubMenuItem('topbar', 'coursecategories', 'New Category', 'coursecategories/create');
	}
]);

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
'use strict';

// Configuring the Articles module
angular.module('locations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Locations', 'locations', 'dropdown', '/locations(/create)?');
		Menus.addSubMenuItem('topbar', 'locations', 'List Locations', 'locations');
		Menus.addSubMenuItem('topbar', 'locations', 'New Location', 'locations/create');
	}
]);
'use strict';

//Setting up route
angular.module('locations').config(['$stateProvider',
	function($stateProvider) {
		// Locations state routing
		$stateProvider.
		state('listLocations', {
			url: '/locations',
			templateUrl: 'modules/locations/views/list-locations.client.view.html'
		}).
		state('createLocation', {
			url: '/locations/create',
			templateUrl: 'modules/locations/views/create-location.client.view.html'
		}).
		state('viewLocation', {
			url: '/locations/:locationId',
			templateUrl: 'modules/locations/views/view-location.client.view.html'
		}).
		state('editLocation', {
			url: '/locations/:locationId/edit',
			templateUrl: 'modules/locations/views/edit-location.client.view.html'
		});
	}
]);
'use strict';

// Locations controller
angular.module('locations').controller('LocationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Locations',
	function($scope, $stateParams, $location, Authentication, Locations) {
		$scope.authentication = Authentication;

		// Create new Location
		$scope.create = function() {
			// Create new Location object
			var location = new Locations ({
				city: this.city,
				state: this.state,
				country: this.country
			});

			// Redirect after save
			location.$save(function(response) {
				//$location.path('locations/' + response._id);

				$location.path('locations');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Location
		$scope.remove = function(location) {
			if ( location ) { 
				location.$remove();

				for (var i in $scope.locations) {
					if ($scope.locations [i] === location) {
						$scope.locations.splice(i, 1);
					}
				}
			} else {
				$scope.location.$remove(function() {
					$location.path('locations');
				});
			}
		};

		// Update existing Location
		$scope.update = function() {
			var location = $scope.location;

			location.$update(function() {
				//$location.path('locations/' + location._id);
				$location.path('locations');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Locations
		$scope.find = function() {
			$scope.locations = Locations.query();
		};

		// Find existing Location
		$scope.findOne = function() {
			$scope.location = Locations.get({ 
				locationId: $stateParams.locationId
			});
		};
	}
]);

'use strict';

//Locations service used to communicate Locations REST endpoints
angular.module('locations').factory('Locations', ['$resource',
	function($resource) {
		return $resource('locations/:locationId', { locationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('results').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Courses', 'results', 'dropdown', '/results(/create)?');
		Menus.addSubMenuItem('topbar', 'results', 'List Courses', 'view-courses');
		Menus.addSubMenuItem('topbar', 'results', 'New Course', 'results/create');
	}
]);

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
					$location.path('view-courses');
				});
			}
		};

		// Update existing Result
		$scope.update = function() {
			var result = $scope.result;

			result.$update(function() {
				//$location.path('results/' + result._id);
				$location.path('view-courses');
				// Clear form fields
				$scope.trainingProvider = '';
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

'use strict';

//Results service used to communicate Results REST endpoints
angular.module('results').factory('Results', ['$resource',
	function($resource) {
		return $resource('results/:resultId', { resultId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('trainingproviders').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Trainingproviders', 'trainingproviders', 'dropdown', '/trainingproviders(/create)?');
		Menus.addSubMenuItem('topbar', 'trainingproviders', 'List Trainingproviders', 'trainingproviders');
		Menus.addSubMenuItem('topbar', 'trainingproviders', 'New Trainingprovider', 'trainingproviders/create');
	}
]);
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
'use strict';

// Trainingproviders controller
angular.module('trainingproviders').controller('TrainingprovidersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trainingproviders',
    function($scope, $stateParams, $location, Authentication, Trainingproviders) {
        $scope.authentication = Authentication;

        // Create new Trainingprovider
        $scope.create = function() {

            // Create new Trainingprovider object
            var trainingprovider = new Trainingproviders ({
                companyName: this.companyName,
                url: this.url,
                description: this.description,
                address: this.address,
                city: this.city,
                country: this.country,
                contactNo: this.contactNo,
                email: this.email,
                contact1: [],
                contact2: [],
                trainer1: [],
                trainer2: [],
                trainer3: [],
                trainer4: [],
                trainer5: []
            });

            trainingprovider.contact1.push({cName: this.contact1.cName,  cEmail: this.contact1.cEmail, cPhone: this.contact1.cPhone});
            trainingprovider.contact2.push({cName: this.contact2.cName,  cEmail: this.contact2.cEmail, cPhone: this.contact2.cPhone});

            trainingprovider.trainer1.push({trainerName: this.trainer1.trainerName,  profile: this.trainer1.profile, photo: this.trainer1.photo});
            trainingprovider.trainer2.push({trainerName: this.trainer2.trainerName,  profile: this.trainer2.profile, photo: this.trainer2.photo});
            trainingprovider.trainer3.push({trainerName: this.trainer3.trainerName,  profile: this.trainer3.profile, photo: this.trainer3.photo});
            trainingprovider.trainer4.push({trainerName: this.trainer4.trainerName,  profile: this.trainer4.profile, photo: this.trainer4.photo});
            trainingprovider.trainer5.push({trainerName: this.trainer5.trainerName,  profile: this.trainer5.profile, photo: this.trainer5.photo});

           // console.log("Reached here1");

            // Redirect after save
            trainingprovider.$save(function(response) {
               /// $location.path('trainingproviders/' + response._id);
                $location.path('trainingproviders');
                // Clear form fields
                $scope.companyName = '';
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
               // $location.path('trainingproviders/' + trainingprovider._id);
                $location.path('trainingproviders');
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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		//if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);