;(function () {
  'use strict';
  
  angular
    .module('core:ComposeController',[])
    .controller('ComposeController', ComposeController);

    function ComposeController($scope, $http, $q, $state){ // removed $state because of testing errors
      
      var vm = this;

      vm.user = {};

      vm.findCoordinates = findCoordinates;      
      vm.createUser = createUser;
      vm.getUser = getUser;

      // gets all form data from compose.html
      function createUser (user) {
        vm.user = angular.copy(user);
      }

      // once user has hit submit, its a chain of events that get user info and populates lat/long before posting data to server
      function getUser (user) {
        //start animation
        createUser(user);
        findCoordinates(user.origin, "originCoordinates", function() { 
          return findCoordinates(user.destination, "destinationCoordinates", function() {
            return postData(vm.user);
          });
        });
      }

      // returns an object with latitude and longitude
      function findCoordinates (place, waypoint, callback) {
        var baseURL = "http://nominatim.openstreetmap.org/search?format=json&limit=3&q=";
        return $http({
          method: "GET",
          url: baseURL+place,
        }).success(function(data) {
          var place = data[0];  // returns multiple places. first object is the most accurate
          vm.user[waypoint] = { 'lat': place.lat, 'lon': place.lon };

          callback();
        })
      }

      // create user, then get origin, then get destination, then save lat,lon to user
      function postData (user) {
        vm.user = angular.copy(user);
        var redirect = vm.user.title;

        $http({
          method: 'POST',
          url: 'localhost/' + redirect ,
          data: JSON.stringify({
            name: vm.user.name,
            origin: vm.user.originCoordinates,
            destination: vm.user.destinationCoordinates
          })
        }).success(function (data) {
          //stop animation
          $state.go(redirect); // redirect to either driver or passenger
        }).error(function(data, status){
          console.log(status);
          $state.go(redirect);
        });     
      };
  }
}).call(this);
    

