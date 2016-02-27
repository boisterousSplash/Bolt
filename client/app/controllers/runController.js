angular.module('run.controller', [])

.controller('RunController',
  function ($scope, $timeout, $interval, $window,
            $location, $route, Geo, Run, Profile) {

  $scope.userLocation;
  $scope.destination;

  var startTime;
  var runTime;
  var statusUpdateLoop;
  var startLat;
  var startLong;
  var FINISH_RADIUS = 0.0002; // miles?

  // Math functions
  var sqrt = Math.sqrt;
  var floor = Math.floor;
  var random = Math.random;
  var pow2 = function (num) {
    return Math.pow(num, 2);
  };


  var updateTotalRunTime = function () {
    var secondsRan = moment().diff(startTime, 'seconds');
    runTime = moment().minute(0).second(secondsRan);
  };

  //set a waiting message for the user while Google maps loads...

  var messages = [
    "Finding the best route for you",
    "Scanning the streets",
    "Charging runtime engine",
    "Looking into the eye of the tiger"
  ];

  var setRunMessage = function () {
    $scope.runMessage = messages[floor(random() * messages.length)] + "...";
  };

  //rinse and repeat...
  $interval(setRunMessage, random() * 1000, messages.length);

  $scope.startRun = function () {
    // setTimeout(finishRun, 4000); // simulate finishing run for manual testing
    startTime = moment();
    $scope.raceStarted = true;
    statusUpdateLoop = $interval(updateStatus, 100);
    // $scope.goldTime is not declared in this controller. Where do we define it?
    // same goes for silver, bronze Times --> these get defined in services.js when we initialize the map
    Run.setPointsInTime($scope);
    Run.setInitialMedalGoal($scope);
    document.getElementById('map').style.height = "93vh";
    document.getElementById('botNav').style.height = "7vh";
  };

  $scope.regenRace = function () {
    $route.reload();
  };

  var makeInitialMap = function () {
    Geo.makeInitialMap($scope);
  };

  makeInitialMap();

  // It looks like we're repeating ourselves a bit here.
  // Could we refactor to cover all three medals with one medalTime object?

  var finishRun = function () {
    $scope.$parent.runTime = runTime.format('mm:ss');
    var medal = $scope.$parent.achievement = $scope.currentMedal;

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
      racedAgainst: null
    };

    Profile.getUser()
    .then(function (user) {
      var achievements = user.achievements;
      var previousRuns = user.runs;

      //update achievments object
      achievements[medal] = achievements[medal] + 1;
      $window.localStorage.setItem('achievements', JSON.stringify(achievements));
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
  };

  var checkIfFinished = function () {
    if ($scope.destination && $scope.userLocation) {
      var distRemaining = distBetween($scope.userLocation, $scope.destination);
      if (distRemaining < 0.0002) {
        finishRun();
      }
    }
  };

  var distBetween = function (loc1, loc2) {
    return sqrt(pow2(loc1.lat - loc2.lat) + pow2(loc1.lng - loc2.lng));
  };

  var updateStatus = function () {
    Geo.updateCurrentPosition($scope);
    updateTotalRunTime();
    Run.updateGoalTimes($scope);
    checkIfFinished();
  };

  // Stop geotracker upon canceling run
  // Does this make sure to stop tracking if they close the window? --> all scripts die when the browser is no longer interpreting them
  $scope.$on('$destroy', function () {
    $interval.cancel(statusUpdateLoop);
  });
});
