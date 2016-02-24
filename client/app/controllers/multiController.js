angular.module('multi.Controller', ['bolt.profile'])

.controller('MultiController', function($window, $scope, Multi){
  $scope.session = $window.localStorage;
  Multi.addUserGeoFire();

  $scope.cancelSearch = function() {
    Multi.cancelSearch();
  }
  // console.log('current session....', $scope.session);
  // $scope.currentUser;
  // $scope.position;
})

.factory('Multi', function($location, $interval, Profile) {
  var firebaseRef = new Firebase("https://insane-bolt.firebaseio.com/");
  var geoFire = new GeoFire(firebaseRef);
  var currentUser;
  var userPosition;
  var stop;

  var search = function(geoQuery) {
    console.log('searching');
    var users = [];
    var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
      if (key !== currentUser._id) {
        console.log("found match, stop search")
        console.log("user id of new user", key);
        console.log("id of current user", currentUser._id);
        $interval.cancel(stop);
        return key;
      }
    });
  }

  var generateQuery = function() {
    console.log('generate query');
    var geoQuery = geoFire.query({
      center: [userPosition.coords.latitude, userPosition.coords.longitude],
      radius: 1000
    });

    stop = $interval(function() {
      search(geoQuery)}
      , 1000);
  }

  var addUserGeoFire = function(){
    navigator.geolocation.getCurrentPosition(function(position) {
      Profile.getUser().then(function(user) {
        currentUser = user.data;
        userPosition = position;
        geoFire.set(user.data._id, [position.coords.latitude, position.coords.longitude]).then(function() {
          console.log("Provided key has been added to GeoFire");
          generateQuery();
          }, function(error) {
            console.log("Error: " + error);
          });
        });
      }, function(err) {
        console.error(err);
    });
  };

  var cancelSearch = function(){
    geoFire.remove(currentUser._id).then(function() {
    });
    $location.path('/bolt');
  }

  return {
    search: search,
    generateQuery: generateQuery,
    addUserGeoFire: addUserGeoFire,
    cancelSearch: cancelSearch
  }
});