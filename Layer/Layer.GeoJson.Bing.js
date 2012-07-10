define([
  '../../layers/geojson.js'
], function(geojson) {
  var geometries = [],
      parseGeometry = function(obj) {
        var properties = obj.properties;

        switch (obj.geometry.type) {
          case 'Polygon':
            
            break;
        }
      },
      parseType = function(obj) {
        switch (obj.type) {
          case 'Feature':
            parseGeometry(obj);
            break;
          case 'FeatureCollection':
            $.each(obj.features, function(i, v) {
              parseType(v);
            });
            break;
        }
      };
  
  NPMap.bing.layers = NPMap.bing.layers || {};
  
  return NPMap.bing.layers.GeoJson = {
    addLayer: function(layerConfig) {
      $.ajax({
        dataType: 'json',
        success: function(geojson) {
          //console.log(geojson);

          parseType(geojson);
        },
        url: layerConfig.url
      });
    }
  };
});