angular.module('multi.controller', ['bolt.profile'])

.controller('MultiController', function($window, $scope, Multi){
  $scope.session = $window.localStorage;
  Multi.addUserGeoFire();

  $scope.cancelSearch = function() {
    Multi.cancelSearch();
  }

})

.factory('Multi', function($window, $location, $interval, Profile, MultiGame) {
  var session = $window.localStorage;
  var firebaseRef = new Firebase("https://glowing-fire-8101.firebaseio.com/");
  var geoFire = new GeoFire(firebaseRef);
  var currentUser;
  var userPosition;
  var stop;

  var search = function(geoQuery) {
    console.log('searching');
    var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
      if (key !== session.username) {
        var id = [session.username, key].sort().join('');
        var user1 = {name: session.username, ready: false, canceled: false, finished: false};
        var user2 = {name: key, ready: false, canceled: false, finished: false};
        console.log("found match, stop search")
        console.log("user id of new user", key);
        console.log("id of current user", session.username);
        geoFire.remove(key).then(function() {});
        $interval.cancel(stop);
        geoQuery.cancel();
        MultiGame.makeGame(id, user1, user2);
        session.gameId = id;
        session.competitor = key;
        $location.path('multiGame');
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
      userPosition = position;
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
    geoFire.remove(session.username).then(function() {});
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