angular.module('multi.Controller', ['bolt.profile'])

.controller('MultiController', function($window, $scope, Multi){
  $scope.session = $window.localStorage;
  
  Multi.addUserGeoFire();

  $scope.cancelSearch = function() {
    Multi.cancelSearch();
  }

})

.factory('Multi', function($location, $interval, Profile) {
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
    // This line obtains the user's location, can get rid of this if this info is stored
    navigator.geolocation.getCurrentPosition(function(position) {
      // Retrieves the user, should be able to access this from session
      Profile.getUser().then(function(user) {
        currentUser = user.data;
        userPosition = position;
        // addUserGeoFire (this entire function) should start here if the user id and position are accessible
        // from session
        geoFire.set(user.data._id, [userPosition.coords.latitude, userPosition.coords.longitude]).then(function() {
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