define(function() {
  /**
   * Checks to see if a layer is visible and is of type 'TileStream'.
   * @param {Object} layer
   * @return {Boolean}
   */
  function isVisibleAndTileStream(layer) {
    return (layer.type === 'TileStream' && (typeof layer.visible === 'undefined' || layer.visible));
  }
  
  NPMap.layers = NPMap.layers || {};
  
  return NPMap.layers.TileStream = {
    /**
     * Gets the number of visible TileStream layers.
     * @return {Number}
     */
    getAllVisibleLayers: function() {
      var baseLayers = NPMap.layers.TileStream.getVisibleBaseLayers(),
          layers = NPMap.layers.TileStream.getVisibleLayers(),
          visible = [];
      
      if (baseLayers.length > 0) {
        visible.push(baseLayers);
      }
      
      if (layers.length > 0) {
        visible.push(layers);
      }
      
      return _.flatten(visible);
    },
    /**
     * Gets the first visible TileStream baseLayer.
     * @return {Number}
     */
    getVisibleBaseLayers: function() {
      var visible = [];
      
      if (NPMap.config.baseLayers) {
        for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
          var baseLayer = NPMap.config.baseLayers[i];
          
          if (isVisibleAndTileStream(baseLayer)) {
            visible.push(baseLayer);
            break;
          }
        }
      }
      
      return visible;
    },
    /**
     * Gets the number of visible TileStream layers.
     * @return {Number}
     */
    getVisibleLayers: function() {
      var visible = [];
      
      if (NPMap.config.layers) {
        for (var i = 0; i < NPMap.config.layers.length; i++) {
          var layer = NPMap.config.layers[i];
          
          if (isVisibleAndTileStream(layer)) {
            visible.push(layer);
          }
        }
      }
      
      return visible;
    },
    /**
     * Loads all of the TileStream layers that have been added to the map and are visible.
     * @param {Function} callback
     */
    load: function(callback) {
      var baseLayer = NPMap.layers.TileStream.getVisibleBaseLayers()[0],
          layers = NPMap.layers.TileStream.getVisibleLayers(),
          url = 'http://api.tiles.mapbox.com/v3/';
      
      if (layers.length > 0) {
        layers.sort(function(a, b) {
          if (a.zIndex && b.zIndex) {
            return a.zIndex > b.zIndex;
          } else {
            return null;
          }
        });
      }
      
      if (typeof baseLayer !== 'undefined') {
        layers.splice(0, 0, baseLayer);
      }
      
      for (var i = 0; i < layers.length; i++) {
        url += layers[i].id + ',';
      }
      
      reqwest({
        jsonpCallbackName: 'grid',
        success: callback,
        type: 'jsonp',
        url: (url.slice(0, url.length - 1) + '.jsonp')
      });
    },
    /**
     * Refreshes all TileStream layers from the baseLayers and layers configs.
     */
    refreshLayers: function() {
      NPMap[NPMap.config.api].layers.TileStream.refreshLayers();
    }
  };
});