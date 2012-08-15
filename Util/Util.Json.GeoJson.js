define([
  'Util/Util.Json'
], function(utilJson) {
  return NPMap.Util.Json.GeoJson = {
    parse: function(geoJson) {
      var features = [];

      for (var i = 0; i < geoJson.features.length; i++) {
        var feature = geoJson.features[i],
            coordinates = feature.geometry.coordinates,
            shape = {
              data: feature.properties
            };
            
        switch (feature.geometry.type) {
          case 'LineString':
            type = 'Line';
            break;
          case 'MultiLineString':
            break;
          case 'MultiPolygon':
            for (var j = 0; j < coordinates.length; j++) {
              for (var k = 0; k < coordinates[j].length; k++) {
                var path = [];
                
                for (var l = 0; l < coordinates[j][k].length; l++) {
                  path.push({
                    lat: coordinates[j][k][l][1],
                    lng: coordinates[j][k][l][0]
                  });
                }
                
                paths.push(path);
              }
            }

            shape.ll = paths;
            break;
          case 'Point':
            shape.ll = {
              lat: coordinates[1],
              lng: coordinates[0]
            };
            shape.shapeType = 'Marker';
            break;
          case 'Polygon':
            type = 'Polygon';

            for (var j = 0; j < geojson.coordinates.length; j++) {
              var path = [];
              
              for (var k = 0; k < geojson.coordinates[j].length; j++) {
                path.push(new Microsoft.Maps.Location(geojson.coordinates[j][k][1], geojson.coordinates[j][k][0]));
              }
              
              paths.push(path);
            }
            
            shape.ll = paths;
            break;
        }

        features.push(shape);
      }

      return features;
    }
  };
});