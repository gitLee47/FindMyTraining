'use strict';

(function() {
	// Trainingproviders Controller Spec
	describe('Trainingproviders Controller Tests', function() {
		// Initialize global variables
		var TrainingprovidersController,
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

			// Initialize the Trainingproviders controller.
			TrainingprovidersController = $controller('TrainingprovidersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Trainingprovider object fetched from XHR', inject(function(Trainingproviders) {
			// Create sample Trainingprovider using the Trainingproviders service
			var sampleTrainingprovider = new Trainingproviders({
				name: 'New Trainingprovider'
			});

			// Create a sample Trainingproviders array that includes the new Trainingprovider
			var sampleTrainingproviders = [sampleTrainingprovider];

			// Set GET response
			$httpBackend.expectGET('trainingproviders').respond(sampleTrainingproviders);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trainingproviders).toEqualData(sampleTrainingproviders);
		}));

		it('$scope.findOne() should create an array with one Trainingprovider object fetched from XHR using a trainingproviderId URL parameter', inject(function(Trainingproviders) {
			// Define a sample Trainingprovider object
			var sampleTrainingprovider = new Trainingproviders({
				name: 'New Trainingprovider'
			});

			// Set the URL parameter
			$stateParams.trainingproviderId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/trainingproviders\/([0-9a-fA-F]{24})$/).respond(sampleTrainingprovider);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trainingprovider).toEqualData(sampleTrainingprovider);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trainingproviders) {
			// Create a sample Trainingprovider object
			var sampleTrainingproviderPostData = new Trainingproviders({
				name: 'New Trainingprovider'
			});

			// Create a sample Trainingprovider response
			var sampleTrainingproviderResponse = new Trainingproviders({
				_id: '525cf20451979dea2c000001',
				name: 'New Trainingprovider'
			});

			// Fixture mock form input values
			scope.name = 'New Trainingprovider';

			// Set POST response
			$httpBackend.expectPOST('trainingproviders', sampleTrainingproviderPostData).respond(sampleTrainingproviderResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Trainingprovider was created
			expect($location.path()).toBe('/trainingproviders/' + sampleTrainingproviderResponse._id);
		}));

		it('$scope.update() should update a valid Trainingprovider', inject(function(Trainingproviders) {
			// Define a sample Trainingprovider put data
			var sampleTrainingproviderPutData = new Trainingproviders({
				_id: '525cf20451979dea2c000001',
				name: 'New Trainingprovider'
			});

			// Mock Trainingprovider in scope
			scope.trainingprovider = sampleTrainingproviderPutData;

			// Set PUT response
			$httpBackend.expectPUT(/trainingproviders\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/trainingproviders/' + sampleTrainingproviderPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid trainingproviderId and remove the Trainingprovider from the scope', inject(function(Trainingproviders) {
			// Create new Trainingprovider object
			var sampleTrainingprovider = new Trainingproviders({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Trainingproviders array and include the Trainingprovider
			scope.trainingproviders = [sampleTrainingprovider];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/trainingproviders\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTrainingprovider);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.trainingproviders.length).toBe(0);
		}));
	});
}());