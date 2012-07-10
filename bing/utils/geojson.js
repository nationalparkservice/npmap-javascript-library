var GeoJSON = function(geojson, options) {
  var i = 0,
      j = 0,
      obj,
      opts = options || {},
      path,
      paths = [];

  switch (geojson.type) {
    case 'LineString':
      break;
    case 'MultiLineString':
      break;
    case 'MultiPolygon':
      for (i; i < geojson.coordinates.length; i++) {
        for (j; j < geojson.coordinates[i].length; j++) {
          path = [];
          
          for (var k = 0; k < geojson.coordinates[i][j].length; k++) {
            path.push(new Microsoft.Maps.Location(geojson.coordinates[i][j][k][1], geojson.coordinates[i][j][k][0]));
          }
          
          paths.push(path);
        }
      }

      obj = new Microsoft.Maps.Polygon(paths, opts);
      break;
    case 'Point':
      break;
    case 'Polygon':
      for (i = 0; i < geojson.coordinates.length; i++){
        path = [];
        
        for (j = 0; j < geojson.coordinates[i].length; j++) {
          path.push(new Microsoft.Maps.Location(geojson.coordinates[i][j][1], geojson.coordinates[i][j][0]));
        }
        
        paths.push(path);
      }
      
      obj = new Microsoft.Maps.Polygon(paths, opts);
      break;
  }

  return obj;
};