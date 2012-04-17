define([
  '../../layers/tilestream.js'
], function(tilestream) {
  var // The default tiling scheme.
      tilingScheme = 'xyz';
  
  /**
   * Converts an x,y,z tile coordinate into OSM format.
   * @param {Object} tile
   * @return {Object}
   */
  function xyzToOsm(tile) {
    var mod = Math.pow(2, tile.levelOfDetail),
        y = (mod - 1) - tile.y,
        x = (tile.x % mod);

    x = (x < 0) ? (tile.x % mod) + mod : x;

    return {
      x: x,
      y: y,
      z: tile.levelOfDetail
    };
  }
  
  NPMap.bing.layers = NPMap.bing.layers || {};

  return NPMap.bing.layers.TileStream = {
    /*
     * Adds a TileStream layer to the map.
     * @param layer {Object} (Required) The layer config object of the layer that is to be added to the map.
     */
    addLayer: function(layer) {
      var tileLayer;
      
      /**
       * Builds the tile URL path.
       * @param {Object} tile The tile object, with x, y, and z properties.
       * @return {String}
       */
      function getTilePath(tile) {
        var url;

        if (tilingScheme === 'osm') {
          tile = xyzToOsm(tile);
        } else {
          tile.z = tile.levelOfDetail;
        }

        url = layer.urls[layer.currentUrlIndex].replace('{x}', tile.x).replace('{y}', tile.y).replace('{z}', tile.z);

        if ((layer.currentUrlIndex + 1) === layer.urls.length) {
          layer.currentUrlIndex = 0;
        } else {
          layer.currentUrlIndex++;
        }

        return url;
      }
      
      if (layer.urls[0].indexOf('/v1/') != -1) {
        tilingScheme = 'osm';
      }
      
      tileLayer = new Microsoft.Maps.TileLayer({
        mercator: new Microsoft.Maps.TileSource({
          uriConstructor: getTilePath
        }),
        opacity: 1,
        zIndex: layer.zIndex || null
      });
      
      tileLayer.id = layer.name;
      layer.active = true;
      layer.currentUrlIndex = 0;
      layer.entity = tileLayer;
      layer.visible = true;

      NPMap.bing.map.Map.entities.push(tileLayer);
    },
    /**
     * Hides the TileStream layer.
     * @param {Object} The layer config object of the layer to hide.
     */
    hideLayer: function(layer) {
      NPMap.bing.map.Map.entities.get(NPMap.bing.map.Map.entities.indexOf(layer.entity)).setOptions({
        visible: false
      });
      layer.visible = false;
    },
    /**
     * Shows the KML layer.
     * @param {Object} The layer config object of the layer to show.
     */
    showLayer: function(layer) {
      NPMap.bing.map.Map.entities.get(NPMap.bing.map.Map.entities.indexOf(layer.entity)).setOptions({
        visible: true
      });
      layer.visible = true;
    }
  };
});