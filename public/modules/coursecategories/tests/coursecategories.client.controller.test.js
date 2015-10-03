'use strict';

(function() {
	// Coursecategories Controller Spec
	describe('Coursecategories Controller Tests', function() {
		// Initialize global variables
		var CoursecategoriesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Coursecategories controller.
			CoursecategoriesController = $controller('CoursecategoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Coursecategory object fetched from XHR', inject(function(Coursecategories) {
			// Create sample Coursecategory using the Coursecategories service
			var sampleCoursecategory = new Coursecategories({
				name: 'New Coursecategory'
			});

			// Create a sample Coursecategories array that includes the new Coursecategory
			var sampleCoursecategories = [sampleCoursecategory];

			// Set GET response
			$httpBackend.expectGET('coursecategories').respond(sampleCoursecategories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.coursecategories).toEqualData(sampleCoursecategories);
		}));

		it('$scope.findOne() should create an array with one Coursecategory object fetched from XHR using a coursecategoryId URL parameter', inject(function(Coursecategories) {
			// Define a sample Coursecategory object
			var sampleCoursecategory = new Coursecategories({
				name: 'New Coursecategory'
			});

			// Set the URL parameter
			$stateParams.coursecategoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/coursecategories\/([0-9a-fA-F]{24})$/).respond(sampleCoursecategory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.coursecategory).toEqualData(sampleCoursecategory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Coursecategories) {
			// Create a sample Coursecategory object
			var sampleCoursecategoryPostData = new Coursecategories({
				name: 'New Coursecategory'
			});

			// Create a sample Coursecategory response
			var sampleCoursecategoryResponse = new Coursecategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Coursecategory'
			});

			// Fixture mock form input values
			scope.name = 'New Coursecategory';

			// Set POST response
			$httpBackend.expectPOST('coursecategories', sampleCoursecategoryPostData).respond(sampleCoursecategoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Coursecategory was created
			expect($location.path()).toBe('/coursecategories/' + sampleCoursecategoryResponse._id);
		}));

		it('$scope.update() should update a valid Coursecategory', inject(function(Coursecategories) {
			// Define a sample Coursecategory put data
			var sampleCoursecategoryPutData = new Coursecategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Coursecategory'
			});

			// Mock Coursecategory in scope
			scope.coursecategory = sampleCoursecategoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/coursecategories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/coursecategories/' + sampleCoursecategoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid coursecategoryId and remove the Coursecategory from the scope', inject(function(Coursecategories) {
			// Create new Coursecategory object
			var sampleCoursecategory = new Coursecategories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Coursecategories array and include the Coursecategory
			scope.coursecategories = [sampleCoursecategory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/coursecategories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCoursecategory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.coursecategories.length).toBe(0);
		}));
	});
}());