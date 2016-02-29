'use strict';

describe('BoltController', function () {
  var $scope, $rootScope, $location, $window, createController;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('bolt'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our AuthController for testing
    createController = function () {
      return $controller('BoltController', {
        $scope: $scope,
        $window: $window,
        $location: $location
      });
    };

    createController();
  }));

  it('$scope.session should be defined', function() {
    expect($scope.session).to.exists;
  });

  it('$scope.startRun should exist', function() {
    expect($scope.startRun).to.exist;
  });

  it('$scope.startRun should be a function', function() {
    expect($scope.startRun).to.be.a('function');
  });

});
