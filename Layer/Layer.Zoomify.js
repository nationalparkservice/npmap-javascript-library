/**
 * NPMap.Layer.Zoomify module.
 */
define([
  'Layer/Layer'
], function(Layer) {
  return NPMap.Layer.Zoomify = {
    /**
     * Adds a Zoomify layer.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    add: function(config, callback) {
      if (!config.height) {
        throw new Error('"height" is required.');
      }
      
      if (!config.width) {
        throw new Error('"width" is required.');
      }
      
      NPMap.Map.addTileLayer(NPMap.Map.createZoomifyLayer(config));
      
      if (callback) {
        callback();
      }
    }
  };
});