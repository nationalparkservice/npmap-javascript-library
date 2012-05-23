define(function() {
  NPMap.layers = NPMap.layers || {};
  
  return NPMap.layers.TileStream = {
    /**
     * Refreshes all TileStream layers from the baseLayers and layers configs.
     */
    refreshLayers: function() {
      NPMap[NPMap.config.api].layers.TileStream.refreshLayers();
    }
  };
});