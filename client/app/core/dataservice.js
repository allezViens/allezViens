(function() {

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  function dataservice($http, RouterboxFactory, GoogleFactory) {
    var passengers = [];
    var drivers = [];

    return {
      passengers: passengers,
      getPassengers: getPassengers,
      getClientLoc: getClientLoc,
    };

    // expects origin and destination to be googlemap objects
    function getPassengers(origin,destination, cb) {
      return $http({
            url: '/driver',
            method: "GET",
            params: {
              oLat: origin.k,
              oLon: origin.D,
              dLat: destination.k,
              dLon: destination.D,
              date: new Date()
           }
        })
        .success(function (data) {
          passengers = data.matches;        
          cb(passengers);
        })
        .error(function() {
          console.log('get passengers error');
        });
    }

    function getDrivers(origin,destination, cb) {
      return $http({
            url: '/passenger',
            method: "GET",
            params: {
              oLat: origin.k,
              oLon: origin.D,
              dLat: destination.k,
              dLon: destination.D,
              date: new Date()
           }
        })
        .success(function (data) {
          drivers = data.matches;        
          cb(passengers);
        })
        .error(function() {
          console.log('get drivers error');
        });
    }    

    // This should get users local coordinates somehow...
    function getClientLoc(){      
      $http.get('http://www.telize.com/geoip').success(function (data) {
        GoogleFactory.initialize(data.latitude, data.longitude);
      });
    }
  }
})();
