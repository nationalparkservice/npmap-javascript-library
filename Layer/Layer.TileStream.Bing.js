define([
  '../../layers/tilestream.js'
], function(tilestream) {
  var 
      // The number of visible TileStream layers in the NPMap.config.layers array.
      count = tilestream.getVisibleLayers().length,
      // The number of TileStream layers that have been added to teh map.
      countAdded = 0,
      // The current index for the tile URLs array.
      currentUrlIndex = 0,
      // The TileStream layer. Currently, the map can only have one TileStream layer at a time.
      layer,
      // The TileJson object returned from TileStream.
      tileJson;
  
  /**
    * Builds the tile URL path.
    * @param {Object} tile The tile object, with x, y, and z properties.
    * @return {String}
    */
  function getTilePath(tile) {
    var url;
    
    if (typeof tilingScheme !== 'undefined' && tilingScheme === 'osm') {
      tile = xyzToOsm(tile);
    } else {
      tile.z = tile.levelOfDetail;
    };
    
    url = tileJson.tiles[currentUrlIndex].replace('{x}', tile.x).replace('{y}', tile.y).replace('{z}', tile.z);
    
    if ((currentUrlIndex + 1) === tileJson.tiles.length) {
      currentUrlIndex = 0;
    } else {
      currentUrlIndex++;
    }

    return url;
  }
  /**
   *
   */
  function load() {
    tilestream.load(function(data) {
      layer = new Microsoft.Maps.TileLayer({
        mercator: new Microsoft.Maps.TileSource({
          uriConstructor: getTilePath
        }),
        // TODO: This should come from config.
        opacity: 1,
        // TODO: This index can come from the layer config too.
        zIndex: 0
      });
      tileJson = data;
      
      NPMap.bing.map.Map.entities.push(layer);
    });
  }
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
     * Add a TileStream layer to the map. No layerConfig parameter is passed in here, as TileStream layers are "aware" of each other, and must be processed together.
     */
    addLayer: function(layerConfig) {
      countAdded++;
      
      if (count === countAdded) {
        load();
      }
    },
    /**
     * Hides the TileStream layer.
     * @param {Object} The layer config object of the layer to hide.
     */
    hideLayer: function(layerConfig) {
      NPMap.bing.map.Map.entities.get(NPMap.bing.map.Map.entities.indexOf(layer)).setOptions({
        visible: false
      });
    },
    /**
     * Shows the TileStream layer.
     * @param {Object} The layer config object of the layer to show.
     */
    showLayer: function(layerConfig) {
      NPMap.bing.map.Map.entities.get(NPMap.bing.map.Map.entities.indexOf(layer)).setOptions({
        visible: true
      });
    }
  };
});