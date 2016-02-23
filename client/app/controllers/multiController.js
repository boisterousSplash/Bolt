angular.module('multi.Controller', ['bolt.profile'])

.controller('MultiController', function($scope, $window, Profile){
  $scope.session = $window.localStorage;

	$scope.stopGeoUpdater = function() {
	  clearInterval($scope.geoUpdater);
	};

  $scope.addUserGeoFire = function() {
    var firebaseRef = new Firebase("https://insane-bolt.firebaseio.com/");
    var geoFire = new GeoFire(firebaseRef);
    var userPosition;

    navigator.geolocation.getCurrentPosition(function(position) {
      userPosition = position;
      

      Profile.getUser().then(function(user) {
        currUser = user;
        console.log('currUser', currUser);

      geoFire.set(user.data._id, [userPosition.coords.latitude, userPosition.coords.longitude]).then(function() {
        console.log("Provided key has been added to GeoFire");
        }, function(error) {
          console.log("Error: " + error);
          });
      });
    
    }, function(err) {
      console.error(err);
    });
  };


  $scope.addUserGeoFire();
})