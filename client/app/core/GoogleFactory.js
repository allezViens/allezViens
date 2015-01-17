(function() {

  angular
    .module('app.core')
    .factory('GoogleFactory', GoogleFactory);

  function GoogleFactory($http, $q, $stateParams, RouterboxFactory, RouteFactory, $rootScope) {
    var map, directionsDisplay, overlayMap;
    var userMarkers = [];
    var tripMarkers = [undefined, undefined];

    services = {
      addUserMarker: addUserMarker,
      convertToLocation: convertToLocation,
      drawRoute: drawRoute,
      initialize: initialize,
      removeDestination: removeDestination,
      removeOrigin: removeOrigin,
      setOrigin: setOrigin,
      setDestin: setDestin
    };

    return services;

    function addUserMarker(coordinate, alias, email, origin) {

      iconOrigin = 'iconOrigin.png';
      iconDestination = 'iconDestination.png';
      icon = 'icon.png';

      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        position: convertToLocation(coordinate),
        draggable: false,
        customEmail: email,
        customOrigin: origin
      });

      userMarkers.push(marker);
      var contentString = '<div><h1>' + alias + '</h1></div>';

      alias = new InfoBubble({
        map: map,
        content: contentString,
        position: convertToLocation(coordinate),
        shadowStyle: 1,
        padding: 0,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.9)',
        minWidth: 100,
        maxWidth: 200,
        minHeight: 50,
        arrowSize: 1,
        borderWidth: 1,
        disableAutoPan: true,
        hideCloseButton: true,
        arrowPosition: -5,
        backgroundClassName: 'bubble',
        arrowStyle: 1
      });

      google.maps.event.addListener(marker, 'click', function() {
        $rootScope.$broadcast('tripUpdated',marker.customEmail);
      });

      google.maps.event.addListener(marker, 'mouseover', function(){
        var markers = findMatchingMarker(marker.customEmail);
        markers.origin.setIcon(iconOrigin);
        markers.destination.setIcon(iconDestination);
      });

      google.maps.event.addListener(marker, 'mouseout', function() {
          var markers = findMatchingMarker(marker.customEmail);
          markers.origin.setIcon(icon);
          markers.destination.setIcon(icon);
      });
    }

    function boundMap() {
      var bounds = new google.maps.LatLngBounds();
      angular.forEach(tripMarkers, function(marker){
        if(marker && marker.position){
          bounds.extend(marker.position);
        }
      });

      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.05, bounds.getNorthEast().lng() + 0.05);
        var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.05, bounds.getNorthEast().lng() - 0.05);
        bounds.extend(extendPoint1);
        bounds.extend(extendPoint2);
      }

      map.fitBounds(bounds);
    }

    function convertToLocation(coordinate) {
      return new google.maps.LatLng(coordinate[0], coordinate[1]);
    }

    function drawRoute(origin, destination, waypoints, callback) {
      var directionsService = new google.maps.DirectionsService();
      directionsDisplay.setMap(map);

      var request = {
        origin: convertToLocation(origin),
        destination: convertToLocation(destination),
        travelMode: google.maps.TravelMode.DRIVING,
        transitOptions: {
          departureTime: new Date() // need date here
        },
        waypoints: waypoints,
        optimizeWaypoints: true
      };
      
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
          GoogleFactory.routeWaypoints = result.kc.waypoints;
          GoogleFactory.routeOrder = result.routes[0].waypoint_order;
          
          var waypoints = [];
          for(var i=0; i < GoogleFactory.routeWaypoints.length; i++){
            var waypoint = GoogleFactory.routeWaypoints[GoogleFactory.routeOrder[i]];
            waypoints.push([waypoint.location.k, waypoint.location.D]);
          }

          GoogleFactory.routeWaypoints = waypoints;
          callback(GoogleFactory.routeWaypoints);
        }
      });
    }

    function findMatchingMarker(email) {
      var markers = {};
      for (var i=0; i < userMarkers.length; i++) {
        if (userMarkers[i].customEmail === email) {
          if (userMarkers[i].customOrigin){
            markers.origin = userMarkers[i];
          } else {
            markers.destination = userMarkers[i];
          }
        }
      }
      return markers;
    }

    function getMatchesArray(originCoords, destinationCoords) {
      return $http({
        method: 'GET',
        url: '/api/' + vm.type,
        params: {
          oLat: originCoords[0],
          oLon: originCoords[1]
        }
      });
    }

    function initialize(lat, lon) {
      var center = new google.maps.LatLng(lat, lon);
      var mapStyles = [{"featureType":"landscape.natural", "elementType":"geometry.fill", "stylers":[{"visibility":"on"}, {"color":"#e0efef"}]}, {"featureType":"poi", "elementType":"geometry.fill", "stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"landscape.man_made", "elementType":"geometry.fill"},{"featureType":"road", "elementType":"geometry", "stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road", "elementType":"labels", "stylers":[{"visibility":"off"}]},{"featureType":"water", "stylers":[{"color":"#7dcdcd"}]},{"featureType":"transit.line", "elementType":"geometry", "stylers":[{"visibility":"on"}, {"lightness":700}]}];
      var mapOptions = {zoom: 10, center: center, mapTypeControl: false, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']}, streetViewControl: false, panControl: false, zoomControl: true, zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL, position: google.maps.ControlPosition.RIGHT_BOTTOM}, scaleControl: true};
      // Instantiate map with styles
      document.getElementById('map-canvas').style.height = window.innerHeight + "px";
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);   
      map.mapTypes.set('map_style', new google.maps.StyledMapType(mapStyles, {name: "Styled Map"}));
      map.setMapTypeId('map_style');  

      // Create bounds
      overlayMap = new google.maps.OverlayView();
      overlayMap.draw = function () {};
      overlayMap.setMap(map);
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);
    }

    function removeDestination() {
      tripMarkers[1].setMap(null);
      tripMarkers[1] = undefined;   
      directionsDisplay.setMap(null);
    }

    function removeOrigin() {
      tripMarkers[0].setMap(null);
      tripMarkers[0] = undefined;
      directionsDisplay.setMap(null);
    }

    function setDestin(coordinate) {
      setTripMarker(coordinate, 1); 
    }

    function setTripMarker(coordinate, position) {
      if (tripMarkers[position]){
        tripMarkers[position].setMap(null);
      }

      tripMarkers[position] = new google.maps.Marker({
        position: convertToLocation(coordinate),
        map: map
      });
      
      tripMarkers[position].setMap(map);
      boundMap();
    }

    function setOrigin(coordinate) {
      setTripMarker(coordinate, 0);
    }
    
  }
})();