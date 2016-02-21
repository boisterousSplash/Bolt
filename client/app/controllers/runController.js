angular.module('run.controller', [])

.controller('RunController', function($scope, $timeout, $location, $route, Geo){
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
    $scope.currentMedal = 'Gold';
    var secondsToGold = $scope.goldPointInTime.diff(moment(), 'seconds');
    $scope.timeUntilCurrentMedal = moment().second(secondsToGold).minute(secondsToGold / 60);
    document.getElementById('map').style.height = "125%"
    tick();
  }


  $scope.regenRace =  function() {
    $route.reload();
  }

  $scope.makeInitialMap = function($scope) {
    Geo.makeInitialMap($scope);
  };

  $scope.makeInitialMap($scope);

  $scope.updateCurrentPosition = function($scope, $location) {
    Geo.updateCurrentPosition($scope);
    updateTimes();
    $scope.checkIfFinished($location);
  };

  function updateTimes() {
    if ($scope.currentMedal === 'Gold') {
      var secondsToGold = $scope.goldPointInTime.diff(moment(), 'seconds');
      if (secondsToGold === 0) {
        var secondsToSilver = $scope.silverPointInTime.diff(moment(), 'seconds');
        $scope.timeUntilCurrentMedal = moment().second(secondsToSilver).minute(secondsToSilver / 60);
        $scope.currentMedal = 'Silver';
      } else {
        $scope.timeUntilCurrentMedal = moment().second(secondsToGold).minute(secondsToGold / 60);
      }
    } else if ($scope.currentMedal === 'Silver') {
      var secondsToSilver = $scope.silverPointInTime.diff(moment(), 'seconds');
      if (secondsToSilver === 0) {
        var secondsToBronze = $scope.bronzePointInTime.diff(moment(), 'seconds');
        $scope.timeUntilCurrentMedal = moment().second(secondsToBronze).minute(secondsToBronze / 60);
        $scope.currentMedal = 'Bronze';
      } else {
        $scope.timeUntilCurrentMedal = moment().second(secondsToSilver).minute(secondsToSilver / 60);
      }
    } else if ($scope.currentMedal === 'Bronze') {
      var secondsToBronze = $scope.bronzePointInTime.diff(moment(), 'seconds');
      if (secondsToBronze === 0) {
        $scope.currentMedal = 'High Five';
        $scope.timeUntilCurrentMedal = '';
      } else {
        $scope.timeUntilCurrentMedal = moment().second(secondsToBronze).minute(secondsToBronze / 60);
      }
    }
  };

  $scope.checkIfFinished = function($location) {
    if ($scope.destination && $scope.userLocation) {
      var currLat = $scope.userLocation.lat;
      var currLng = $scope.userLocation.lng;
      var destLat = $scope.destination.lat;
      var destLng = $scope.destination.lng;
      var distRemaining = Math.sqrt(Math.pow((currLat - destLat), 2) + Math.pow((currLng - destLng) , 2));

      if (distRemaining < 0.0002) {
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
