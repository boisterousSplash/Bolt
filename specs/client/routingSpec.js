'use strict';

describe('Routing', function () {
  var $route;
  beforeEach(module('shortly'));

  beforeEach(inject(function ($injector) {
    $route = $injector.get('$route');
  }));

  it('Should test a test test in routing spec test', function () {
    expect('true').to.be.a('string');
  });

  it('Should have /signup route, template, and controller', function () {
    expect($route.routes['/signup']).to.be.defined;
    expect($route.routes['/signup'].controller).to.equal('AuthController');
    expect($route.routes['/signup'].templateUrl).to.equal('app/auth/signup.html');
  });

  it('Should have /signin route, template, and controller', function () {
    expect($route.routes['/signin']).to.be.defined;
    expect($route.routes['/signin'].controller).to.equal('AuthController');
    expect($route.routes['/signin'].templateUrl).to.equal('app/auth/signin.html');
  });

  // it('Should have /links route, template, and controller', function () {
  //   expect($route.routes['/links']).to.be.defined;
  //   expect($route.routes['/links'].controller).to.equal('LinksController');
  //   expect($route.routes['/links'].templateUrl).to.equal('app/links/links.html');
  // });
  //
  // it('Should have /shorten route, template, and controller', function () {
  //   expect($route.routes['/shorten']).to.be.defined;
  //   expect($route.routes['/shorten'].controller).to.equal('ShortenController');
  //   expect($route.routes['/shorten'].templateUrl).to.equal('app/shorten/shorten.html');
  // });
});
