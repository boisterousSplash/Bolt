angular.module('run.controller', [])

.controller('RunController', function($scope, $timeout, $location, Geo){
  $scope.raceStarted = 0;
  $scope.startTime;
  $scope.userLocation;
  $scope.destination;

  var tick = function() {
    $scope.time = Math.floor((Date.now() - $scope.startTime)/1000);
    $timeout(tick, 100)
  }

  $scope.startRun = function() {
    $scope.startTime = Date.now();
    $scope.raceStarted = true;
    tick();
  }

  $scope.currentCoords = {
    lat: null,
    lng: null
  };
  // $scope.getCurrentCoords = function() {
  //   console.log('ran');
  //   Geo.getCurrentCoords(function(coordsObj) {
  //     $scope.currentCoords = coordsObj;
  //     console.log('$scope.currentCoords.lat: ', $scope.currentCoords.lat);
  //     console.log('$scope.currentCoords.lng: ', $scope.currentCoords.lng);
  //   });
  // };

  $scope.makeInitialMap = function($scope) {
    console.log('in controller');
    Geo.makeInitialMap($scope);
  };

  $scope.makeInitialMap($scope);

  $scope.updateCurrentPosition = function($scope, $location) {
    Geo.updateCurrentPosition($scope);
    $scope.checkIfFinished($location);
  };

  $scope.checkIfFinished = function($location) {
    console.log('check if finished');
    if ($scope.destination && $scope.userLocation) {
      var conv = 110.574;
      var currLat = $scope.destination.lat;
      var currLng = $scope.destination.lng;
      var destLat = $scope.userLocation.lat;
      var destLng = $scope.userLocation.lng;
      var distRemaining = Math.sqrt(Math.pow((currLat - destLat), 2) + Math.pow((currLng - destLng) , 2));

      if (distRemaining < 0.0008) {
        $location.path('/finish');
        clearInterval($scope.geoUpdater);
      }
    }
  }

  // Determine user location and update map each second
  $scope.geoUpdater = setInterval(function() {$scope.updateCurrentPosition($scope, $location)}, 1000);

  // Stop geotracker upon canceling run
  $scope.stopGeoUpdater = function() {
    clearInterval($scope.geoUpdater);
  };
})
