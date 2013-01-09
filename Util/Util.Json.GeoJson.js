/**
 * NPMap.Util.Json.GeoJSON module. Significant portions taken from Leaflet: https://github.com/CloudMade/Leaflet/blob/master/src/layer/GeoJSON.js.
 */
define([
  'Util/Util.Json'
], function(UtilJson) {
  /**
   * Converts a GeoJSON coordinate object to an NPMap latLng object.
   * @param {Object} coordinate
   * @return {Object}
   */
  function coordinateToLatLng(coordinate) {
    return {
      lat: coordinate[1],
      lng: coordinate[0]
    };
  }
  /**
   * Converts a GeoJSON coordinates object to an NPMap latLng object.
   * @param {Array} coordinates
   * @return {Array}
   */
  function coordinatesToLatLngs(coordinates, levelsDeep) {
    var latLng,
        latLngs = [];

    _.each(coordinates, function(coordinate) {
      latLng = levelsDeep ? coordinatesToLatLngs(coordinate, levelsDeep - 1) : coordinateToLatLng(coordinate);

      latLngs.push(latLng);
    });

    return latLngs;
  }

  return NPMap.Util.Json.GeoJson = {
    /**
     * Converts a single GeoJSON object to a shape.
     * @param {Object} geoJSON
     * @param {Object} data (Optional)
     * @param {Object} style (Optional)
     * @return {Object}
     */
    toShape: function(geoJson, data, style) {
      var geometry = geoJson.type === 'Feature' ? geoJson.geometry : geoJson,
          coordinates = geometry.coordinates,
          shape,
          type;

      switch (geometry.type) {
        case 'GeometryCollection':
            break;
          case 'LineString':
            shape = NPMap.Map._createLine(coordinatesToLatLngs(coordinates), style ? style['line'] : null);
            type = 'Line';
            break;
          case 'MultiLineString':
            break;
          case 'MultiPoint':
            break;
          case 'MultiPolygon':
            break;
          case 'Point':
            shape = NPMap.Map._createMarker(coordinateToLatLng(coordinates), style ? style['marker'] : null);
            type = 'Marker';
            break;
          case 'Polygon':
            shape = NPMap.Map._createPolygon(coordinatesToLatLngs(coordinates, 1)[0], style ? style['polygon'] : null);
            type = 'Polygon';
            break;
          default:
            throw new Error('The GeoJSON object is invalid.');
      }

      if (shape) {
        shape.npmap = data ? _.extend({}, data) : {};
        shape.npmap.data = shape.npmap.data ? _.extend(shape.npmap.data, geoJson.properties) : geoJson.properties;
        shape.npmap.type = type;

        return shape;
      } else {
        return null;
      }
    },
    /**
     * Converts a GeoJSON object to an array of shapes.
     * @param {Object|Array} geoJson
     * @param {Object} data (Optional)
     * @param {Object} style (Optional)
     * @return {Array}
     */
    toShapes: function(geoJson, data, style) {
      var features = _.isArray(geoJson) ? geoJson : geoJson.features,
          shapes = [];

      for (var i = 0; i < features.length; i++) {
        var shape = this.toShape(features[i], data, style);

        if (shape) {
          shapes.push(shape);
        }
      }

      return shapes;
    }
  };
});