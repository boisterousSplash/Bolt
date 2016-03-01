// This controller is tied to multiLoad.html
angular.module('multiload.controller', ['bolt.profile'])

.controller('MultiLoadController', function ($window, $scope, Multi) {
  $scope.session = $window.localStorage;
  Multi.addUserGeoFire();

  $scope.cancelSearch = function () {
    Multi.cancelSearch();
  };
})

.factory('Multi', function ($window, $location, $interval, Profile, MultiGame) {
  var session = $window.localStorage;
  // Connect your own firebase account in this line
  var firebaseRef = new Firebase("https://glowing-fire-8101.firebaseio.com/");
  var geoFire = new GeoFire(firebaseRef);
  var currentUser;
  var userPosition;
  var stop;

  // Find runners in an area given by the geoQuery object
  var search = function (geoQuery) {
    console.log('searching');
    var onKeyEnteredRegistration = geoQuery.on("key_entered", function (key, location, distance) {
      // create a session out of the two users' usernames
      if (key !== session.username) {
        var id = [session.username, key].sort().join('');
        var user1 = {
          name: session.username,
          ready: false,
          canceled: false,
          finished: false
        };
        var user2 = {
          name: key,
          ready: false,
          canceled: false,
          finished: false
        };

        // This calculation should be placed in a factory
        var destinationLat = (userPosition.coords.latitude + location[0]) / 2;
        var destinationLng = (userPosition.coords.longitude + location[1]) / 2;

        geoFire.remove(key).then(function () {});
        $interval.cancel(stop);
        geoQuery.cancel();
        MultiGame.makeGame(id, user1, user2);
        session.gameId = id;
        session.competitor = key;
        session.multiLat = destinationLat;
        session.multiLng = destinationLng;
        $location.path('multiGame');
        return;
      }
    });
  };

  // Create an area in which to search for other users
  var generateQuery = function () {
    console.log('generate query');
    var geoQuery = geoFire.query({
      center: [userPosition.coords.latitude, userPosition.coords.longitude],
      // radius should be reduced to within the users desired distance
      radius: 1000 // miles
    });

    stop = $interval(function () {
      search(geoQuery);
    }, 2000);
  };

  // Make user findable in the database
  var addUserGeoFire = function () {
    navigator.geolocation.getCurrentPosition(function (position) {
      userPosition = position;
      geoFire.set(session.username, [position.coords.latitude, position.coords.longitude]).then(function () {
        console.log("Provided key has been added to GeoFire");
        generateQuery();
        }, function (error) {
          console.log("Error: " + error);
        });
    }, function (err) {
      console.error(err);
    });
  };

  var cancelSearch = function () {
    geoFire.remove(session.username).then(function () {});
    $interval.cancel(stop);
    $location.path('/bolt');
  };

  return {
    search: search,
    generateQuery: generateQuery,
    addUserGeoFire: addUserGeoFire,
    cancelSearch: cancelSearch
  };
});
