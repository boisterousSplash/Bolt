angular.module('multi.Controller', ['bolt.profile'])

.controller('MultiController', function($scope, $window, $location, Profile){
  $scope.session = $window.localStorage;
  $scope.currentUser;
  $scope.position;

  var firebaseRef = new Firebase("https://insane-bolt.firebaseio.com/");
  var geoFire = new GeoFire(firebaseRef);


  $scope.search = function() {
    console.log('searched');
  }

  $scope.generateQuery = function() {
    var geoQuery = geoFire.query({
      center: [$scope.position.coords.latitude, $scope.position.coords.longitude],
      radius: 1000
    });
    $scope.search();
  }

  $scope.addUserGeoFire = function(){
    navigator.geolocation.getCurrentPosition(function(position) {
      Profile.getUser().then(function(user) {
        $scope.currentUser = user.data;
        $scope.position = position;
        geoFire.set(user.data._id, [position.coords.latitude, position.coords.longitude]).then(function() {
          console.log("Provided key has been added to GeoFire");
          $scope.generateQuery();
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


  // var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
  //   console.log(key + " entered query at " + location + " (" + distance + " km from center)");
  // });


  $scope.addUserGeoFire();
})