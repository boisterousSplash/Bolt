angular.module('run.controller', [])

.controller('RunController', function($scope, $rootScope, $timeout, $interval, $location, $route, Geo, Run, Profile){

  /*
    SM - There's a lot of business logic in this controller. We should consider taking it out and putting
    it inside it's own factory, just so it's consistent with our code structure so far (and keeps things a
    bit more tidy). Thoughts?
    
  */


  $scope.userLocation;
  $scope.destination;

  /////////////////////////////////////
  // None of these variables get used. Do we need them?
  $scope.pointsInTime = {}; // gold, silver, bronze
  $scope.goldPointInTime;
  $scope.silverPointInTime;
  $scope.bronzePointInTime;
  $scope.timeUntilGold;
  $scope.timeUntilSilver;
  $scope.timeUntilBronze;
  /////////////////////////////////////

  // These variables seem similar. do you think we can put them together in an object?
  var goldPointInTime;
  var silverPointInTime;
  var bronzePointInTime;
  var startTime;
  var runTime;
  var statusUpdateLoop;
  var startLat;
  var startLong;

  function updateTotalRunTime() {
    var minutesRan = moment().diff(startTime, 'minutes');
    var secondsRan = moment().diff(startTime, 'seconds');
    runTime = moment().minute(0).second(secondsRan);
  }

  $scope.startRun = function() {
    console.log("starting run!");
    setTimeout(finishRun, 400); // simulate finishing run for manual testing
    startTime = moment();
    $scope.raceStarted = true;
    statusUpdateLoop = $interval(updateStatus, 100);
    // $scope.goldTime is not declared in this controller. Where do we define it?
    // same goes for silver, bronze Times
    goldPointInTime = moment().add($scope.goldTime.second(), 'seconds').add($scope.goldTime.minute(), 'minutes');
    silverPointInTime = moment().add($scope.silverTime.second(), 'seconds').add($scope.silverTime.minute(), 'minutes');
    bronzePointInTime = moment().add($scope.bronzeTime.second(), 'seconds').add($scope.bronzeTime.minute(), 'minutes');
    $scope.currentMedal = 'Gold';
    var secondsToGold = goldPointInTime.diff(moment(), 'seconds');
    // Does this function make sure to go from gold -> silver -> bronze?
    // I'm just curious to make sure we've tested it
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

  // It looks like we're repeating ourselves a bit here.
  // Could we refactor to cover all three medals with one medalTime object?
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
    var medal = $rootScope.achievement = $scope.currentMedal;
    
    var date = new Date();

    var endLocation = {
      latitude: $scope.destination.lat,
      longitude: $scope.destination.long
    };
    var googleExpectedTime = null;
    var actualTime = runTime;

    var currentRunObject = {
      date: date,
      startLocation: {
        longitude: null,
        latitude: null
      },
      endLocation: {
        longitude: $scope.destination.long,
        latitude: $scope.destination.lat
      },
      googleExpectedTime: null,
      actualTime: runTime,
      medalReceived: medal,
      racedAgainst: null,
    };

    Profile.getUser()
    .then(function(user) {
      var achievements = user.data.achievements;
      var previousRuns = user.data.runs;

      //update achievments object
      achievements[medal] = achievements[medal] + 1;
      //update runs object
      previousRuns.push(currentRunObject);

      updatedAchievementsData = {
        achievements: achievements,
        runs: previousRuns
      };

      Profile.updateUser(updatedAchievementsData, user)
      .then(function (updatedProfile) {
        return updatedProfile;
      })
      .catch(function (err) {
        console.error(err);
      });
    });

    $interval.cancel(statusUpdateLoop);
    $location.path('/finish');
  }

  // Stop geotracker upon canceling run
  // Does this make sure to stop tracking if they close the window?
  $scope.$on('$destroy', function() {
    $interval.cancel(statusUpdateLoop);
  });
})
