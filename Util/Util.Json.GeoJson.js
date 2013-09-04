/**
 * NPMap.Util.Json.GeoJSON module. Significant portions taken from Leaflet: https://github.com/CloudMade/Leaflet/blob/master/src/layer/GeoJSON.js and https://raw.github.com/DanElliottPalmer/GeoJSON-Parser/master/GeoJSON.js.
 */
define([
  'Util/Util.Json'
], function(UtilJson) {
  function parseFeature(geoJson, style) {
    var out = {
      properties: geoJson.properties || {}
    };

    if (geoJson.hasOwnProperty('geometry')) {
      out.shapes = parseGeometry(geoJson.geometry, style);
      return out;
    } else {
      return null;
    }
  }
  function parseFeatureType(geoJson, style) {
    if (geoJson.hasOwnProperty('type')) {
      var type = geoJson.type.toLowerCase();

      if (type === 'featurecollection') {
        if (geoJson.hasOwnProperty('features')) {
          var features = [];

          for (var i = 0; i < geoJson.features.length; i++) {
            features.push(parseFeatureType(geoJson.features[i], style));
          }

          return features;
        } else {
          return null;
        }
      } else if (type === 'feature') {
        return parseFeature(geoJson, style);
      }
    } else {
      return null;
    }
  }
  function parseGeometry(geoJson, style) {
    var out = [];

    if (geoJson.hasOwnProperty('type')) {
      var i = 0;

      switch (geoJson.type.toLowerCase()) {
        case 'geometrycollection':
          var geomArr = [];

          for (i; i < geoJson.geometries.length; i++) {
            geomArr = geomArr.concat(parseGeometry(geoJson.geometries[i], style));
          }

          out = out.concat(geomArr);
          break;
        case 'linestring':
          out.push(parseLineString(geoJson.coordinates, style));
          break;
        case 'multilinestring':
          for (i; i < geoJson.coordinates.length; i++) {
            out.push(parseLineString(geoJson.coordinates[i], style));
          }

          break;
        case 'multipoint':
          for (i; i < geoJson.coordinates.length; i++) {
            out.push(parsePoint(geoJson.coordinates[i], style));
          }

          break;
        case 'multipolygon':
          for (i; i < geoJson.coordinates.length; i++) {
            var j = 0;

            for (j; j < geoJson.coordinates[i].length; j++) {
              out.push(parsePolygon(geoJson.coordinates[i][j], style));
            }
          }

          break;
        case 'point':
          out.push(parsePoint(geoJson.coordinates, style));
          break;
        case 'polygon':
          for (i; i < geoJson.coordinates.length; i++) {
            out.push(parsePolygon(geoJson.coordinates[i], style));
          }

          break;
      }
    }

    return out;
  }
  function parseLineString(geoJson, style) {
    var latLngs = [];

    for (var i = 0; i < geoJson.length; i++) {
      latLngs.push({
        lat: geoJson[i][1],
        lng: geoJson[i][0]
      });
    }

    return NPMap.Map._createLine(latLngs, style ? style['line'] : null);
  }
  function parsePoint(geoJson, style) {
    return NPMap.Map._createMarker({
      lat: geoJson[1],
      lng: geoJson[0]
    }, style ? style['marker'] : null);
  }
  function parsePolygon(geoJson, style) {
    var latLngs = [];

    for (var i = 0; i < geoJson.length; i++) {
      latLngs.push({
        lat: geoJson[i][1],
        lng: geoJson[i][0]
      });
    }

    return NPMap.Map._createPolygon(latLngs, style ? style['polygon'] : null);
  }

  return NPMap.Util.Json.GeoJson = {
    /**
     * Converts a GeoJSON object to an array of shapes.
     * @param {Object|Array} geoJson
     * @param {Object} meta (Optional)
     * @param {Object} style (Optional)
     * @return {Array}
     */
    toShapes: function(geoJson, meta, style) {
      var features = typeof geoJson.features !== 'undefined' ? geoJson.features : [
            geoJson
          ],
          shapes = [];

      for (var i = 0; i < features.length; i++) {
        var feature = parseFeatureType(features[i], style);

        if (feature) {
          for (var j = 0; j < feature.shapes.length; j++) {
            var shape = feature.shapes[j];
            shape.npmap = _.extend(shape.npmap, meta);
            shape.npmap.data = feature.properties || {};
            shapes.push(feature.shapes[j]);
          }
        }
      }

      return shapes;
    }
  };
});