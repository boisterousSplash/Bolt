'use strict';

describe('Services', function () {
  beforeEach(module('bolt.services'));

  afterEach(inject(function ($httpBackend) {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));


  describe('Links Factory', function () {
    var $httpBackend, Links;

    beforeEach(inject(function (_$httpBackend_, _Links_) {
      $httpBackend = _$httpBackend_;
      Links = _Links_;
    }));

    it('should exist', function () {
      expect(Links).to.exist;
    });

    it('should have a method `getAll`', function () {
      expect(Links.getAll).to.be.a('function');
    });

    it('should have a method `addOne`', function () {
      expect(Links.addOne).to.be.a('function');
    });

    it('should get all links with `getAll`', function () {
      var mockResponse = [
        { title: 'Twitter',
          url: 'https://twitter.com' },
        { title: 'Reddit',
          url: 'https://reddit.com/r/javascript' }
      ];

      $httpBackend.expect('GET', '/api/links').respond(mockResponse);

      Links.getAll().then(function (links) {
        expect(links).to.deep.equal(mockResponse);
      });

      $httpBackend.flush();
    });

    it('should add a new link with `addOne`', function () {
      var github = { url: 'https://github.com/hackreactor-labs' };

      $httpBackend
        .expect('POST', '/api/links', JSON.stringify(github))
        .respond(201, {
          url: 'https://github.com/hackreactor-labs',
          title: 'Hack Reactor Labs'
        });

      Links.addOne(github).then(function (resp) {
        expect(resp.status).to.equal(201);
        expect(resp.data.title).to.equal('Hack Reactor Labs');
      });

      $httpBackend.flush();
    });

  });

});


