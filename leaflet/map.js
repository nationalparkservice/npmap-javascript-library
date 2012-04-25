define([
  NPMap.config.server + '/map.js'
], function(core) {
  var
      // The base layer to initialize the map with.
      baseLayer,
      // The center {L.LatLng} to initialize the map with.
      center = new L.LatLng(40.78054143186031, -99.931640625),
      // The {L.Map} object.
      map,
      // The zoom level to initialize the map with.
      zoom = 4;

  map = new L.Map(NPMap.config.div, {
    attributionControl: false,
    center: center,
    zoom: zoom,
    zoomControl: false
  });

  baseLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png', {
    attribution: '<a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>',
    maxZoom: 17
  });

  map.addLayer(baseLayer);
  core.init();
  NPMap.Map.setAttribution('<a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>');

  NPMap.leaflet = NPMap.leaflet || {};
  
  return NPMap.leaflet.map = {
    /**
     *
     * @return {L.LatLng}
     */
    getCenter: function() {
      return map.getCenter();
    },
    /**
     *
     * @return {Number}
     */
    getZoom: function() {
      return map.getZoom();
    },
    /**
     * Is the map loaded and ready to be interacted with programatically?
     */
    isReady: true,
    /**
     * Converts a {L.LatLng} to the NPMap representation of a latitude/longitude string.
     * @param latLng {L.LatLng} The object to convert to a string.
     * @return {String} A latitude/longitude string in "latitude,longitude" format.
     */
    latLngToString: function(latLng) {
      return latLng.lat + ',' + latLng.lng;
    },
    /**
     * The {L.Map} object. This reference should be used to access any of the Leaflet functionality that can't be done through NPMap's API.
     */
    Map: map,
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     */
    panByPixels: function(pixels) {
      map.panBy(new L.Point(-pixels.x, -pixels.y));
    },
    /**
     * Zooms the map in by one zoom level.
     */
    zoomIn: function() {
      map.zoomIn();
    },
    /**
     * Zooms the map out by one zoom level.
     */
    zoomOut: function() {
      map.zoomOut();
    },
    /**
     * Zooms the map to its initial extent.
     */
    // TODO: Renamed to "toInitialExtent".
    zoomToInitialExtent: function() {
      map.setView(center, zoom);
    }
  };
});