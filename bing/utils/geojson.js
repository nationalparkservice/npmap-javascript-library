 var GeoJSON = function(geojson, options) {
  var obj;

  switch (geojson.type) {
    case 'LineString':
      break;
    case 'MultiLineString':
      break;
    case 'MultiPolygon':
      var opts = options || {},
          paths = [];
      
      for (var i = 0; i < geojson.coordinates.length; i++) {
        for (var j = 0; j < geojson.coordinates[i].length; j++) {
          var path = [];
          
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
      var opts = options || {},
          paths = [];
          
      for (var i = 0; i < geojson.coordinates.length; i++){
        var path = [];
        
        for (var j = 0; j < geojson.coordinates[i].length; j++) {
          path.push(new Microsoft.Maps.Location(geojson.coordinates[i][j][1], geojson.coordinates[i][j][0]));
        }
        
        paths.push(path);
      }
      
      obj = new Microsoft.Maps.Polygon(paths, opts);
      break;
  };

  return obj;
};