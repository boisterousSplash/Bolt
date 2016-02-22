angular.module('run.controller', [])

.controller('RunController', function($scope, $rootScope, $timeout, $interval, $location, $route, Geo){

  $scope.userLocation;
  $scope.destination;
  $scope.pointsInTime = {}; // gold, silver, bronze
  $scope.goldPointInTime;
  $scope.silverPointInTime;
  $scope.bronzePointInTime;
  $scope.timeUntilGold;
  $scope.timeUntilSilver;
  $scope.timeUntilBronze;

  var goldPointInTime;
  var silverPointInTime;
  var bronzePointInTime;
  var startTime;
  var runTime;
  var statusUpdateLoop;

  function updateTotalRunTime() {
    var minutesRan = moment().diff(startTime, 'minutes');
    var secondsRan = moment().diff(startTime, 'seconds');
    runTime = moment().minute(0).second(secondsRan);
  }

  $scope.startRun = function() {
    // setTimeout(finishRun, 4000); // simulate finishing run for manual testing
    startTime = moment();
    $scope.raceStarted = true;
    statusUpdateLoop = $interval(updateStatus, 100);
    goldPointInTime = moment().add($scope.goldTime.second(), 'seconds').add($scope.goldTime.minute(), 'minutes');
    silverPointInTime = moment().add($scope.silverTime.second(), 'seconds').add($scope.silverTime.minute(), 'minutes');
    bronzePointInTime = moment().add($scope.bronzeTime.second(), 'seconds').add($scope.bronzeTime.minute(), 'minutes');
    $scope.currentMedal = 'Gold';
    var secondsToGold = goldPointInTime.diff(moment(), 'seconds');
    $scope.timeUntilCurrentMedal = moment().second(secondsToGold).minute(secondsToGold / 60);
    document.getElementById('map').style.height = "125%"
  }

  $scope.regenRace =  function() {
    $route.reload();
  };

  function makeInitialMap($scope) {
    Geo.makeInitialMap($scope);
  }

  makeInitialMap($scope);

  function updateStatus() {
    Geo.updateCurrentPosition($scope);
    updateTotalRunTime();
    updateGoalTimes();
    checkIfFinished();
  }

  function updateGoalTimes() {
    if ($scope.currentMedal === 'Gold') {
      var secondsToGold = goldPointInTime.diff(moment(), 'seconds');
      if (secondsToGold === 0) {
        var secondsToSilver = silverPointInTime.diff(moment(), 'seconds');
        $scope.timeUntilCurrentMedal = moment().second(secondsToSilver).minute(secondsToSilver / 60);
        $scope.currentMedal = 'Silver';
      } else {
        $scope.timeUntilCurrentMedal = moment().second(secondsToGold).minute(secondsToGold / 60);
      }
    } else if ($scope.currentMedal === 'Silver') {
      var secondsToSilver = silverPointInTime.diff(moment(), 'seconds');
      if (secondsToSilver === 0) {
        var secondsToBronze = bronzePointInTime.diff(moment(), 'seconds');
        $scope.timeUntilCurrentMedal = moment().second(secondsToBronze).minute(secondsToBronze / 60);
        $scope.currentMedal = 'Bronze';
      } else {
        $scope.timeUntilCurrentMedal = moment().second(secondsToSilver).minute(secondsToSilver / 60);
      }
    } else if ($scope.currentMedal === 'Bronze') {
      var secondsToBronze = bronzePointInTime.diff(moment(), 'seconds');
      if (secondsToBronze === 0) {
        $scope.currentMedal = 'High Five';
        $scope.timeUntilCurrentMedal = '';
      } else {
        $scope.timeUntilCurrentMedal = moment().second(secondsToBronze).minute(secondsToBronze / 60);
      }
    }
  }

  function checkIfFinished() {
    if ($scope.destination && $scope.userLocation) {
      var currLat = $scope.userLocation.lat;
      var currLng = $scope.userLocation.lng;
      var destLat = $scope.destination.lat;
      var destLng = $scope.destination.lng;
      var distRemaining = Math.sqrt(Math.pow((currLat - destLat), 2) + Math.pow((currLng - destLng) , 2));
      if (distRemaining < 0.0002) {
        finishRun();
      }
    }
  }

  function finishRun() {
    $rootScope.runTime = runTime.format('mm:ss');
    $rootScope.achievement = $scope.currentMedal;
    $interval.cancel(statusUpdateLoop);
    $location.path('/finish');
  }

  // Stop geotracker upon canceling run
  $scope.$on('$destroy', function() {
    $interval.cancel(statusUpdateLoop);
  });
})
