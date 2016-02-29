'use strict';

describe('CreateProfileController', function () {
  var $scope, $rootScope, $location, $window, createController, Profile, Auth;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('bolt'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    Auth = $injector.get('Auth');
    Profile = $injector.get('Profile');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our CreateProfileController for testing
    createController = function () {
      return $controller('CreateProfileController', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        Profile: Profile,
        Auth: Auth
      });
    };

    createController();
  }));

  it('$scope.inputData should be defined', function() {
    expect($scope.inputData).to.exist;
  });

  it('$scope.inputData should be a function', function() {
    expect($scope.inputData).to.be.an('object');
  });

  it('$scope.createProfile should be defined', function() {
    expect($scope.createProfile).to.exist;
  });

  it('$scope.createProfile should be a function', function() {
    expect($scope.createProfile).to.be.a('function');
  });

});
