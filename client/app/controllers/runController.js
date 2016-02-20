angular.module('run.controller', [])

.controller('RunController', function($scope, $timeout, $location, Geo){
  $scope.raceStarted = 0;
  $scope.startTime;
  $scope.userLocation;
  $scope.destination;
  $scope.goldPointInTime;
  $scope.silverPointInTime;
  $scope.bronzePointInTime;
  $scope.timeUntilGold;
  $scope.timeUntilSilver;
  $scope.timeUntilBronze;

  var tick = function() {
    $scope.time = Math.floor((Date.now() - $scope.startTime)/1000);
    $timeout(tick, 100)
  }

  $scope.startRun = function() {
    $scope.startTime = Date.now();
    $scope.raceStarted = true;
    $scope.geoUpdater = setInterval(function() {$scope.updateCurrentPosition($scope, $location)}, 500);
    $scope.goldPointInTime = moment().add($scope.goldTime.second(), 'seconds').add($scope.goldTime.minute(), 'minutes');
    $scope.silverPointInTime = moment().add($scope.silverTime.second(), 'seconds').add($scope.silverTime.minute(), 'minutes');
    $scope.bronzePointInTime = moment().add($scope.bronzeTime.second(), 'seconds').add($scope.bronzeTime.minute(), 'minutes');
    tick();
  }

  // $scope.getCurrentCoords = function() {
  //   console.log('ran');
  //   Geo.getCurrentCoords(function(coordsObj) {
  //     $scope.currentCoords = coordsObj;
  //     console.log('$scope.currentCoords.lat: ', $scope.currentCoords.lat);
  //     console.log('$scope.currentCoords.lng: ', $scope.currentCoords.lng);
  //   });
  // };

  $scope.makeInitialMap = function($scope) {
    Geo.makeInitialMap($scope);
  };

  $scope.makeInitialMap($scope);

  $scope.updateCurrentPosition = function($scope, $location) {
    Geo.updateCurrentPosition($scope);
    var secondsToGold = $scope.goldPointInTime.diff(moment(), 'seconds');
    var secondsToSilver = $scope.silverPointInTime.diff(moment(), 'seconds');
    var secondsToBronze = $scope.bronzePointInTime.diff(moment(), 'seconds');
    $scope.timeUntilGold = moment().second(secondsToGold).minute(secondsToGold / 60);
    $scope.timeUntilSilver = moment().second(secondsToSilver).minute(secondsToSilver / 60);
    $scope.timeUntilBronze = moment().second(secondsToBronze).minute(secondsToBronze / 60);
    console.log('$scope.timeUntilGold: ', $scope.timeUntilGold.format('mm:ss'));
    $scope.checkIfFinished($location);
    // console.log('$scope.goldPointInTime: ', $scope.goldPointInTime.format('hh:mm'));
    // console.log('$scope.timeUntilGold: ', $scope.timeUntilGold.format('mm:ss'));
  };

  $scope.checkIfFinished = function($location) {
    if ($scope.destination && $scope.userLocation) {
      var currLat = $scope.userLocation.lat;
      var currLng = $scope.userLocation.lng;
      var destLat = $scope.destination.lat;
      var destLng = $scope.destination.lng;
      var distRemaining = Math.sqrt(Math.pow((currLat - destLat), 2) + Math.pow((currLng - destLng) , 2));

      if (distRemaining < 0.0004) {
        $location.path('/finish');
        clearInterval($scope.geoUpdater);
      }
    }
  }

  // Determine user location and update map each second


  // Stop geotracker upon canceling run
  $scope.stopGeoUpdater = function() {
    clearInterval($scope.geoUpdater);
  };
})
