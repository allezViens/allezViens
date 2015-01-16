(function () {
  'use strict';
  
  angular
    .module('app.route')
    .controller('RouteCtrl', RouteCtrl);

    /* ngInject */

    function RouteCtrl(GoogleFactory,RouteFactory,RouterboxFactory, $scope, $rootScope, $stateParams, $q, $timeout, $http){
      var vm = this;
      vm.route = [];
      vm.matches = RouteFactory.possibleMatches.matches;
      vm.waypoints = GoogleFactory.routeWaypoints;

      initialize();
      $rootScope.$on('tripUpdated',function(event,email){
        pickUser(email);
      });

      // waypoint alias: "pass1"date: "2015-01-13T08:00:00.000Z"destination: Array[2]email: "pass1@gmail.com"origin: Array[2]

      function createRoute (tripData,waypoints,waypointOrder) {
        vm.route = [];
        var alphabetCode = 65; // start at B

        function addToRoute (route, object, index) {
          return $timeout(function () { 
            object.waypointLabel = String.fromCharCode(++alphabetCode);
            route.push(object); 
          }, index * 75);
        }             

        RouterboxFactory.reverseGeocode(tripData.origin)
        .success(function (data) {
          // add Start
          vm.route.push({type: 'origin', alias: tripData.alias, waypointLabel: 'A', address: data.results[0].formatted_address});             
          
          angular.forEach(waypointOrder,function(tuple,index){
            angular.forEach(waypoints,function(user){              
              if (RouterboxFactory.compare(tuple,user.origin)) {
                RouterboxFactory.reverseGeocode(user.origin).
                  success(function (data) {
                    var origin = {type: 'origin', alias: user.alias, address: data.results[0].formatted_address}
                    addToRoute(vm.route, origin, index);
                  }).
                  error(function (data, status) {
                    console.log('reverseGeocode error!', data, status);
                  });                
              }

              if (RouterboxFactory.compare(tuple,user.destination)) {
                RouterboxFactory.reverseGeocode(user.destination).
                  success(function (data) {
                    var destination = {type: 'destination', alias: user.alias, address: data.results[0].formatted_address}
                    addToRoute(vm.route, destination, index);
                  }).
                  error(function (data, status) {
                    console.log('reverseGeocode error!', data, status);
                  });
              }
            });
          });
          
          RouterboxFactory.reverseGeocode(tripData.destination).
            success(function (data) {
              $timeout(function() {
                vm.route.push({type: 'destination', waypointLabel: String.fromCharCode(++alphabetCode), alias: tripData.alias, address: data.results[0].formatted_address});              
              }, waypointOrder.length * 75);
            });
        });
      }

      function initialize(){
        RouteFactory.getTrip($stateParams.id)
        .then(function(){
          vm.trip = RouteFactory.tripData.driver || RouteFactory.tripData.passenger;
          vm.type = RouteFactory.tripData.driver ? 'driver' : 'passenger';
          RouteFactory.getMatches(vm.trip.origin,vm.trip.destination,vm.trip.date,'driver')
          .then(function(){
            vm.possibleMatches = RouteFactory.possibleMatches.matches;
            regenerateRoute();
          });
        });
      }

      function regenerateRoute() {
        GoogleFactory.setOrigin(vm.trip.origin);
        GoogleFactory.setDestin(vm.trip.destination);

        var mapWaypoints = [], routeBox = [];
        // for each object in the vm.trip.picks
        angular.forEach(vm.trip.picks,function(match){
          // if object.status === 'CONFIRMED' get request to object.id 
            angular.forEach(vm.possibleMatches,function(possible,index){
              if (possible.email === match.id){
                
                //add to map
                mapWaypoints.push({ location: GoogleFactory.convertToLocation(possible.origin), stopover:true });
                mapWaypoints.push({ location: GoogleFactory.convertToLocation(possible.destination), stopover:true });
                vm.possibleMatches.splice(index,1);
                routeBox.push(possible);
              }
            });
        });
        
        GoogleFactory.drawRoute(vm.trip.origin,vm.trip.destination,mapWaypoints,function(data) {
          createRoute(vm.trip,routeBox,data);
        });

        angular.forEach(vm.possibleMatches,function(user){
          GoogleFactory.addUserMarker(user.origin,user.alias, user.email,true);
          GoogleFactory.addUserMarker(user.destination,user.alias, user.email,false);
        });
      }

      function pickUser(email){
        $http({
          method: 'POST',
          url: 'api/trip/picks',
          data: {
            token: $stateParams.id,
            email: email,
            pickType: 'add'
          }
        })
        .success(function(){
          initialize();
        });
      }
  }
})();
    

