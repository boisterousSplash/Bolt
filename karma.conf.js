// Karma configuration

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // testing frameworks to use
    // frameworks: ['jasmine'],
    frameworks: ['mocha', 'chai', 'sinon'],

    // list of files / patterns to load in the browser. order matters!
    files: [
      // angular source
      'client/lib/angular/angular.js',
      'client/lib/angular-route/angular-route.js',
      'client/lib/angular-mocks/angular-mocks.js',

      // google maps api
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyBIOAllvDFbkAixfnuS9TaC4Cep3rCpRAk',

      // our app code
      'client/app/**/*.js',

      // our spec files - in order of the README
      'specs/client/authControllerSpec.js',
      'specs/client/routingSpec.js',
      'specs/client/runControllerSpec.js',
      'specs/client/boltControllerSpec.js',
      'specs/client/createProfileControllerSpec.js',
      'specs/client/finishControllerSpec.js'
    ],

    // test results reporter to use
    reporters: ['nyan','unicorn'],

    // start these browsers. PhantomJS will load up in the background
    browsers: ['Chrome'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // if true, Karma exits after running the tests.
    singleRun: false

  });
};
