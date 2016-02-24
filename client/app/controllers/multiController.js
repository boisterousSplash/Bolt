angular.module('multi.Controller', ['bolt.profile'])

.controller('MultiController', function($window, $scope, Multi){
  $scope.session = $window.localStorage;
  
  console.log('window local storage', $scope.session)
  Multi.addUserGeoFire();

  $scope.cancelSearch = function() {
    Multi.cancelSearch();
  }

})

.factory('Multi', function($window, $location, $interval, Profile) {
  var session = $window.localStorage;
  var firebaseRef = new Firebase("https://glowing-fire-8101.firebaseio.com/");
  var geoFire = new GeoFire(firebaseRef);
  var currentUser;
  var userPosition;
  var stop;

  var search = function(geoQuery) {
    console.log('searching');
    var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
      if (key !== currentUser._id) {
        console.log("found match, stop search")
        console.log("user id of new user", key);
        console.log("id of current user", currentUser._id);
        $interval.cancel(stop);
        return;
      }
    });
  }

  var generateQuery = function() {
    console.log('generate query');
    var geoQuery = geoFire.query({
      center: [userPosition.coords.latitude, userPosition.coords.longitude],
      // radius should eventually be reduced
      radius: 1000
    });

    stop = $interval(function() {
      search(geoQuery)}
      , 2000);
  }

  var addUserGeoFire = function(){
    navigator.geolocation.getCurrentPosition(function(position) {
      geoFire.set(session.username, [position.coords.latitude, position.coords.longitude]).then(function() {
        console.log("Provided key has been added to GeoFire");
        generateQuery();
        }, function(error) {
          console.log("Error: " + error);
        });
    }, function(err) {
      console.error(err);
    });
  };

  var cancelSearch = function(){
    geoFire.remove(currentUser._id).then(function() {
    });
    $interval.cancel(stop);
    $location.path('/bolt');
  }

  return {
    search: search,
    generateQuery: generateQuery,
    addUserGeoFire: addUserGeoFire,
    cancelSearch: cancelSearch
  }
});