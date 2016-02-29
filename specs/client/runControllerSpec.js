'use strict';

describe('RunController', function () {
  var $scope, $rootScope, $route, $interval, $timeout, $location, createController, Geo, Run, Profile;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('bolt'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $route = $injector.get('$route');
    $interval = $injector.get('$interval');
    $timeout = $injector.get('$timeout');
    Run = $injector.get('Run');
    Geo = $injector.get('Geo');
    Profile = $injector.get('Profile');

    var $controller = $injector.get('$controller');

    $scope = $rootScope.$new();

    // used to create our AuthController for testing
    createController = function () {
      return $controller('RunController', {
        $scope: $scope,
        $location: $location,
        $route: $route,
        $interval: $interval,
        $timeout: $timeout,
        Run: Run,
        Geo: Geo,        
        Profile: Profile
      });
    };

    createController();
  }));

  it('$scope.startRun should exist and be a function', function() {
    expect($scope.startRun).to.exist;
    expect($scope.startRun).to.be.a('function');
  });

  it('$scope.regenRace should exist and be a function', function() {
    expect($scope.regenRace).to.exist;
    expect($scope.regenRace).to.be.a('function');
  });
 
});
