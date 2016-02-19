angular.module('bolt.services', [])

.factory('Geo', function () {

  var mainMap;
  var currentLocMarker;
  var destinationMarker;
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var route;

  var makeInitialMap = function($scope) {
    navigator.geolocation.getCurrentPosition(function(position) {
      makeMap({lat: position.coords.latitude, lng: position.coords.longitude}, $scope);
    }, function(err) {
      console.error(err);
    });
    var makeMap = function(currentLatLngObj, $scope) {
      var destinationCoordinates = randomCoordsAlongCircumference(currentLatLngObj, 0.1);

      mainMap = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(currentLatLngObj.lat, currentLatLngObj.lng),
        zoom: 13
      });
      directionsRenderer.setMap(mainMap);
      currentLocMarker = new google.maps.Marker({
        position: new google.maps.LatLng(currentLatLngObj.lat, currentLatLngObj.lng),
        map: mainMap,
        animation: google.maps.Animation.DROP,
        icon: '/assets/bolt.png'
      });
      var startOfRoute = new google.maps.LatLng(currentLocMarker.position.lat(), currentLocMarker.position.lng());
      var endOfRoute = new google.maps.LatLng(destinationCoordinates.lat, destinationCoordinates.lng);
      $scope.destination = {lat: endOfRoute.lat(), lng: endOfRoute.lng()};
      route = directionsService.route({
        origin: startOfRoute,
        destination: endOfRoute,
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        provideRouteAlternatives: false
      }, function(response, status) {
        directionsRenderer.setDirections(response);
        var totalDistance = 0;
        for (var i = 0; i < response.routes[0].legs.length; i++) {
          totalDistance += response.routes[0].legs[i].distance.text;
        }
        totalDistance = parseFloat(totalDistance);
        console.log('total distance: ', totalDistance);
        var userMinPerMile = 10; ////////////// FIXXX MEEE!!!
        $scope.goldTime = moment().minute(totalDistance * userMinPerMile * 0.9);
        $scope.silverTime = moment().minute(totalDistance * userMinPerMile * 1.0);
        $scope.bronzeTime = moment().minute(totalDistance * userMinPerMile * 1.1);
      });
    };
  };

  var updateCurrentPosition = function($scope) {
    console.log($scope);
    navigator.geolocation.getCurrentPosition(function(position) {
      currentLocMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      if ($scope) {
        $scope.userLocation= {lat: currentLocMarker.position.lat(), lng: currentLocMarker.position.lng()};
      }
    }, function(err) {
      console.error(err);
    });
  };

  function randomCoordsAlongCircumference (originObj, radius) {
    var randomTheta = Math.random() * 2 * Math.PI;
    return {
      lat: originObj.lat + (radius / 69 * Math.cos(randomTheta)),
      lng: originObj.lng + (radius / 69 * Math.sin(randomTheta))
    };
  };

  return {
    makeInitialMap: makeInitialMap,
    updateCurrentPosition: updateCurrentPosition
  };

})
.factory('Run', function(){
  // Kyle's code here
  // Kyle's code here
  // Kyle's code here
  // Kyle's code here

})
.factory('Profile', function ($http) {

  return {

    updateUser : function (newInfo, previousUsername) {
      return $http({
        method: 'PUT',
        url: '/api/users/profile',
        data: {
          newInfo: newInfo,
          user: {
            username: previousUsername
          }
        }
      }).then(function (user) {
        console.log(user);
        return user;
      });
    },

    getUser : function () {
      return $http({
        method: 'GET',
        url: '/api/users/profile',
      }).then(function(user) {
        return user;
      });
    }

  };
})
.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.bolt'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.bolt');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.bolt');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
