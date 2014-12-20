;(function(){
'use strict';

angular
  .module('core', ['ui.router'])
  .config(main);

function main($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('Compose', {
    url: '/',
    templateUrl: 'app/core/views/compose.html',
    controller: 'ComposeController as vm'
  });

  $stateProvider
  .state('driver', {
    url: '/driver',
    templateUrl: 'app/core/views/driver.html',
    controller: 'DriverController as driver'
  });  
  
  $stateProvider
  .state('passenger', {
    url: '/passenger',
    templateUrl: 'app/core/views/passenger.html',
    controller: 'PassengerController as passenger'
  });

  }
}).call(this);

