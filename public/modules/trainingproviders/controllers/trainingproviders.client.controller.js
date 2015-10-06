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
                $location.path('trainingproviders/' + response._id);

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
