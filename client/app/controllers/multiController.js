angular.module('multi.Controller', ['bolt.profile'])

.controller('MultiController', function($scope, $window, $location, Profile){
  $scope.session = $window.localStorage;
  $scope.currentUser;

  var firebaseRef = new Firebase("https://insane-bolt.firebaseio.com/");
  var geoFire = new GeoFire(firebaseRef);

	$scope.stopGeoUpdater = function() {
	  clearInterval($scope.geoUpdater);
	};

  $scope.addUserGeoFire = function(){
    navigator.geolocation.getCurrentPosition(function(position) {
      Profile.getUser().then(function(user) {
        $scope.currentUser = user.data;
        geoFire.set(user.data._id, [position.coords.latitude, position.coords.longitude]).then(function() {
          console.log("Provided key has been added to GeoFire");
          }, function(error) {
            console.log("Error: " + error);
          });
        });
      }, function(err) {
        console.error(err);
    });
  };

  $scope.cancelSearch = function(){
    console.log('current user', $scope.currentUser);
    geoFire.remove($scope.currentUser._id).then(function() {
    });
    $location.path('/bolt');
  }


  $scope.addUserGeoFire();
})