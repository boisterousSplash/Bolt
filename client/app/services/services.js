angular.module('bolt.services', [])

.factory('Geo', function () {

  var mainMap;
  var currentLocMarker;
  var destinationMarker;
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var route;

  var makeInitialMap = function($scope, destination) {
    navigator.geolocation.getCurrentPosition(function(position) {
      makeMap({lat: position.coords.latitude, lng: position.coords.longitude}, $scope);
    }, function(err) {
      console.error(err);
    });
    var makeMap = function(currentLatLngObj, $scope) {
      var destinationCoordinates = destination || randomCoordsAlongCircumference(currentLatLngObj, 0.2);
      mainMap = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(currentLatLngObj.lat, currentLatLngObj.lng),
        zoom: 13,
        disableDefaultUI: true
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
        $scope.totalDistance = totalDistance;
        var userMinPerMile = 10; ////////////// FIXXX MEEE!!!
        var minutes = userMinPerMile * totalDistance;
        var seconds = minutes * 60;
        $scope.goldTime = moment().second(seconds * 0.9).minute(minutes * 0.9);
        $scope.silverTime = moment().second(seconds * 1.0).minute(minutes * 1.0);
        $scope.bronzeTime = moment().second(seconds * 1.1).minute(minutes * 1.1);
        $scope.$digest();
      });
    };
  };

  var updateCurrentPosition = function($scope) {
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

.factory('Run', function($http){

  var pointsInTime = {
    'Gold': '',
    'Silver': '',
    'Bronze': ''
  };

  var updateTimeUntilMedal = function(secondsToMedal) {
    return moment().second(secondsToMedal).minute(secondsToMedal / 60);
  };

  var setPointsInTime = function($scope) {
    pointsInTime['Gold'] = moment().add($scope.goldTime.second(), 'seconds').add($scope.goldTime.minute(), 'minutes');
    pointsInTime['Silver'] = moment().add($scope.silverTime.second(), 'seconds').add($scope.silverTime.minute(), 'minutes');
    pointsInTime['Bronze'] = moment().add($scope.bronzeTime.second(), 'seconds').add($scope.bronzeTime.minute(), 'minutes');
  };

  var setInitialMedalGoal = function($scope) {
    $scope.currentMedal = 'Gold';
    var secondsToGold = pointsInTime['Gold'].diff(moment(), 'seconds');
    $scope.timeUntilCurrentMedal = updateTimeUntilMedal(secondsToGold);
  };

  var updateGoalTimes = function($scope) {
    if ($scope.currentMedal === 'Gold') {
      var secondsToGold = pointsInTime['Gold'].diff(moment(), 'seconds');
      if (secondsToGold === 0) {
        var secondsToSilver = pointsInTime['Silver'].diff(moment(), 'seconds');
        $scope.timeUntilCurrentMedal = updateTimeUntilMedal(secondsToSilver);
        $scope.currentMedal = 'Silver';
      } else {
        $scope.timeUntilCurrentMedal = updateTimeUntilMedal(secondsToGold);
      }
    } else if ($scope.currentMedal === 'Silver') {
      var secondsToSilver = pointsInTime['Silver'].diff(moment(), 'seconds');
      if (secondsToSilver === 0) {
        var secondsToBronze = pointsInTime['Bronze'].diff(moment(), 'seconds');
        $scope.timeUntilCurrentMedal = updateTimeUntilMedal(secondsToBronze);
        $scope.currentMedal = 'Bronze';
      } else {
        $scope.timeUntilCurrentMedal = updateTimeUntilMedal(secondsToSilver);
      }
    } else if ($scope.currentMedal === 'Bronze') {
      var secondsToBronze = pointsInTime['Bronze'].diff(moment(), 'seconds');
      if (secondsToBronze === 0) {
        $scope.currentMedal = 'High Five';
        $scope.timeUntilCurrentMedal = '';
      } else {
        $scope.timeUntilCurrentMedal = updateTimeUntilMedal(secondsToBronze);
      }
    }
  };

  return {
    setPointsInTime: setPointsInTime,
    setInitialMedalGoal: setInitialMedalGoal,
    updateGoalTimes: updateGoalTimes
  };

})


.factory('Profile', function ($http) {

  return {
    updateUser : function (newInfo, user) {
      return $http({
        method: 'PUT',
        url: '/api/users/profile',
        data: {
          newInfo: newInfo,
          //The above 'newInfo' object needs to contain the same keys as
          //the DB, or else it will fail to PUT. E.g. newInfo needs to have
          //a 'firstName' key in the incoming object in order to update the
          //'firstName' key in the User DB. If it's named something else
          //('first', 'firstname', 'firstN', etc.), it won't work
          user: user
        }
      }).then(function (res) {
        return res;
      });
    },

    getUser : function () {
      return $http({
        method: 'GET',
        url: '/api/users/profile',
      }).then(function(user) {
        return user.data;
      });
    },

  };
})


.factory('MultiGame', function ($http) {
  return {
    makeGame : function (id, user1, user2) {
      return $http({
        method: 'POST',
        url: '/api/games',
        data: {
          id: id
        }
      }).then(function (res) {
        return res;
      });
    },

    updateGame : function (id, field) {
      return $http({
        method: 'POST',
        url: '/api/games/update',
        data: {
          id: id,
          field: field
        }
      }).then(function (res) {
        return res;
      });
    },

    getGame : function (id) {
      return $http({
        method: 'GET',
        url: '/api/games/' + id,
      }).then(function (res) {
        return res.data;
      });
    },

    removeGame: function(id) {
      return $http({
        method: 'POST',
        url: '/api/games/remove',
        data: {
          id: id
        }
      }).then(function (res) {
        return res;
      });
    }
    // cancelGame : function (game_id) {
    //   return $http({
    //     method: 'POST',
    //     url: 'api/games/' + game_id,
    //   }).then(function(game) {
    //     return game;
    //   });
    // }
  };
})


.factory('Auth', function ($http, $location, $window) {
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
      return resp.data;
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
