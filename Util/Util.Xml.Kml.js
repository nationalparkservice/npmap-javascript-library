// TODO: Implement "Line" and "MultiGeometry".
define([
  'Util/Util.Xml'
], function(Util) {
  /**
   *
   */
  function buildData(placemark) {
    var data = {};

    for (var prop in placemark) {
      if (placemark.hasOwnProperty(prop) && (prop !== 'linestring' && prop !== 'multigeometry' && prop !== 'point' && prop !== 'polygon') && (prop !== 'keyValue')) {
        data[prop] = placemark[prop].keyValue;
      }
    }

    return data;
  }

  return NPMap.Util.Xml.Kml = {
    parse: function(xml) {
      var features = [];

      for (var i = 0; i < xml.placemark.length; i++) {
        var coordinates,
            placemark = xml.placemark[i],
            shape = {
              data: buildData(placemark)
            };

        if (placemark.hasOwnProperty('linestring')) {
          shape.shapeType = 'Line';
        } else if (placemark.hasOwnProperty('multigeometry')) {
          // TODO: Not yet implemented.
        } else if (placemark.hasOwnProperty('point')) {
          coordinates = placemark.point.coordinates.keyValue.split(',');
          shape.ll = {
            x: parseFloat(coordinates[0]),
            y: parseFloat(coordinates[1])
          };
          shape.shapeType = 'Marker';
        } else if (placemark.hasOwnProperty('polygon')) {
          // TODO: Figure out what the best way to parse KML coordinate strings. http://code.google.com/p/geoxml-v3/
          coordinates = placemark.polygon.outerboundaryis.linearring.coordinates.keyValue.split('\n');
          shape.ll = [];
          shape.shapeType = 'Polygon';

          for (var j = 0; j < coordinates.length; j++) {
            var coordinate = coordinates[j].split(',');

            shape.ll.push({
              x: parseFloat(coordinate[0]),
              y: parseFloat(coordinate[1])
            });
          }
        }

        if (shape.ll) {
          features.push(shape);
        }
      }

      return features;
    }
  };
});