(function() {

  angular
    .module('app.core')
    .factory('RouterboxFactory', RouterboxFactory);

  function RouterboxFactory($http, $q,$timeout){

    var RouterboxFactory = {
      compare: compare,
      addUserToRoute: addUserToRoute,
      reverseGeocode: reverseGeocode,
      route: route,
      geocode: geocode
    }

    return RouterboxFactory;

      function compare (tupleA, tupleB) {
        return (tupleA[0] === tupleB[0] && tupleA[1] === tupleB[1]);
      }
    
      // takes an array of waypoints and returns a new array of objects
      // used to generate data for route graphic display
      // { type: origin/destination tuple, alias: name}
      function addUserToRoute(user,index){
        RouterboxFactory.reverseGeocode(user.origin)
          .success(function (data) {
            $timeout(function () {
              route.push({type: 'origin', alias: user.alias, address: data.results[0].formatted_address});
            }, index * 75);
          })
          .error(function () {
            console.log('reverseGeocode error!');
          });

        RouterboxFactory.reverseGeocode(user.destination)
          .success(function (data) {
            $timeout(function () {
              route.push({type: 'destination', alias: user.alias, address: data.results[0].formatted_address});
            }, index * 75);
          })
          .error(function () {
            console.log('reverseGeocode error!');
          });
      }


      function route (waypoints, matches, route) {
        // convert origin to address
        var deferred = $q.defer();

        angular.forEach(waypoints,function (waypoint, index, cb) {
          angular.forEach(matches.matches,function (user) {
            if (compare(waypoint, user.origin)) {
              RouterboxFactory.reverseGeocode(user.origin)
                .success(function (data) {
                  $timeout(function () {
                    route.push({type: 'origin', alias: user.alias, address: data.results[0].formatted_address});
                  }, index * 75);
                })
                .error(function () {
                  console.log('reverseGeocode error!');
                });
            } else if (compare(waypoint, user.destination)) {
              RouterboxFactory.reverseGeocode(user.destination)
                .success(function (data) {
                  $timeout(function () {
                    route.push({type: 'destination', alias: user.alias, address: data.results[0].formatted_address});
                  }, index * 75);
                })
                .error(function () {
                  console.log('reverseGeocode error!');
                });
            }
          });
        });

        deferred.resolve();
        return deferred.promise;
      }

    // returns an object with latitude and longitude
    function reverseGeocode(coordinates) {
      var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
      var key = "AIzaSyCGv1yOax6sOABKLyT6r9Fu5khXoTPlDfs";
      var url = baseURL + coordinates[0] + ',' + coordinates[1] + '&key=' + key;
      return $http({
        method: 'GET',
        url: url
      });
    }   

    function geocode (address) {
      var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
      var key = "AIzaSyCGv1yOax6sOABKLyT6r9Fu5khXoTPlDfs";
      var url = baseURL + address + '&key=' + key;
      return $http({
        method: 'GET',
        url: url
      });      
    } 

  }
})();



