angular.module('multi.Controller', ['bolt.profile'])

.controller('MultiController', function($scope, $window, Profile){
  $scope.session = $window.localStorage;

	$scope.stopGeoUpdater = function() {
	  clearInterval($scope.geoUpdater);
	};

  $scope.addUserGeoFire = function() {
    var firebaseRef = new Firebase("https://insane-bolt.firebaseio.com/");
    var geoFire = new GeoFire(firebaseRef);

    Profile.getUser().then(function(user) {
      currUser = user;
      console.log('currUser', currUser);

    geoFire.set(user.data._id, [37.785326, -122.405696]).then(function() {
      console.log("Provided key has been added to GeoFire");
      }, function(error) {
        console.log("Error: " + error);
        });
      });
    };

  $scope.addUserGeoFire();
})