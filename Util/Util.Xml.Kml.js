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
        if (prop === 'extendeddata') {
          var simpleData = placemark.extendeddata.schemadata.simpledata;

          // TODO: This shouldn't be necessary. Something funky is going on here.
          try {
            for (var i = 0; simpleData.length; i++) {
              var sd = simpleData[i];

              data[sd.keyAttributes.name] = sd.keyValue;
            }
          } catch (e) {

          }
        } else {
          data[prop] = placemark[prop].keyValue;
        }
      }
    }

    return data;
  }

  return NPMap.Util.Xml.Kml = {
    parse: function(xml) {
      var root = typeof xml.folder === 'undefined' ? xml : xml.folder,
          features = [];

      for (var i = 0; i < root.placemark.length; i++) {
        var coordinates,
            placemark = root.placemark[i],
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
            lat: parseFloat(coordinates[1]),
            lng: parseFloat(coordinates[0])
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
              lat: parseFloat(coordinate[1]),
              lng: parseFloat(coordinate[0])
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