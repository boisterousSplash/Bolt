'use strict';

describe('LinksController', function () {
  var $scope, $rootScope, createController, Links, $httpBackend;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('bolt'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    Links = $injector.get('Links');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('LinksController', {
        $scope: $scope,
        Links: Links
      });
    };

  }));

  it('should have a data property on the $scope', function () {
    createController();
    expect($scope.data).to.be.an('object');
  });

  it('should call `Links.getAll()` when controller is loaded', function () {
    sinon.spy(Links, 'getAll');
    $httpBackend.expectGET('/api/links').respond(200);

    createController();
    $httpBackend.flush();

    expect(Links.getAll.called).to.equal(true);
    Links.getAll.restore();
  });

  it('should populate the data property after the call to `Links.getAll()`', function () {
    var mockLinks = [{},{},{}];
    $httpBackend.expectGET('/api/links').respond(mockLinks);

    createController();
    $httpBackend.flush();

    expect($scope.data.links).to.deep.equal(mockLinks);
  });
});
