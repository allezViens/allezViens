;(function () {
  'use strict'

  angular
    .module('core:PassengerController',['ngFx'])
    .controller('PassengerController', PassengerController);

    function PassengerController ($scope, $http, $state, $q, $timeout) {
      var passenger = this;
      passenger.drivers = [];

      //set some timeout to push to passenger.drivers array
      var push = function (data, array) {
        return function () {
          array.push(data);
        }
      }

      // dummy data
      var drivers = [
        { name: 'Thomas ', start: 'Berkeley, CA', end: 'Palo Alto, CA', deviation: '10 min', img: 'https://avatars1.githubusercontent.com/u/1794233?v=3&s=100'},
        { name: 'Jimmy ', start: 'Oakland, CA', end: 'San Jose, CA', deviation: '8 min', img: 'https://avatars2.githubusercontent.com/u/7923322?v=3&s=100'},
        { name: 'Beth ', start: 'Richmond, CA', end: 'Fremon, CA', deviation: '12 min', img: 'https://avatars1.githubusercontent.com/u/7968370?v=3&s=100'},
        { name: 'Thomas ', start: 'Berkeley, CA', end: 'Palo Alto, CA', deviation: '10 min', img: 'https://avatars1.githubusercontent.com/u/1794233?v=3&s=100'},
        { name: 'Jimmy ', start: 'Oakland, CA', end: 'San Jose, CA', deviation: '8 min', img: 'https://avatars2.githubusercontent.com/u/7923322?v=3&s=100'},
        { name: 'Beth ', start: 'Richmond, CA', end: 'Fremon, CA', deviation: '12 min', img: 'https://avatars1.githubusercontent.com/u/7968370?v=3&s=100'},
        { name: 'Thomas ', start: 'Berkeley, CA', end: 'Palo Alto, CA', deviation: '10 min', img: 'https://avatars1.githubusercontent.com/u/1794233?v=3&s=100'},
        { name: 'Jimmy ', start: 'Oakland, CA', end: 'San Jose, CA', deviation: '8 min', img: 'https://avatars2.githubusercontent.com/u/7923322?v=3&s=100'},
        { name: 'Beth ', start: 'Richmond, CA', end: 'Fremon, CA', deviation: '12 min', img: 'https://avatars1.githubusercontent.com/u/7968370?v=3&s=100'},
        { name: 'Thomas ', start: 'Berkeley, CA', end: 'Palo Alto, CA', deviation: '10 min', img: 'https://avatars1.githubusercontent.com/u/1794233?v=3&s=100'},
        { name: 'Jimmy ', start: 'Oakland, CA', end: 'San Jose, CA', deviation: '8 min', img: 'https://avatars2.githubusercontent.com/u/7923322?v=3&s=100'},
        { name: 'Beth ', start: 'Richmond, CA', end: 'Fremon, CA', deviation: '12 min', img: 'https://avatars1.githubusercontent.com/u/7968370?v=3&s=100'},
        { name: 'Thomas ', start: 'Berkeley, CA', end: 'Palo Alto, CA', deviation: '10 min', img: 'https://avatars1.githubusercontent.com/u/1794233?v=3&s=100'},
        { name: 'Jimmy ', start: 'Oakland, CA', end: 'San Jose, CA', deviation: '8 min', img: 'https://avatars2.githubusercontent.com/u/7923322?v=3&s=100'},
        { name: 'Beth ', start: 'Richmond, CA', end: 'Fremon, CA', deviation: '12 min', img: 'https://avatars1.githubusercontent.com/u/7968370?v=3&s=100'},
        

      ];

      (passenger.getDrivers = function (array) {
        array.forEach(function (item, index) {
          $timeout(push(item,passenger.drivers), index * 50);
        })
        return passenger.drivers;
      })(drivers);

    }
}).call(this);