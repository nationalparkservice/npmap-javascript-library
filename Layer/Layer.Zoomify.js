/**
 * NPMap.Layer.Zoomify module.
 */
define([
  'Layer/Layer',
  'Map/Map'
], function(Layer, Map) {
  return NPMap.Layer.Zoomify = {
    /**
     * Adds a Zoomify layer.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _add: function(config, callback) {
      if (!config.height) {
        throw new Error('"height" is required.');
      }
      
      if (!config.width) {
        throw new Error('"width" is required.');
      }
      
      Map[NPMap.config.api]._addZoomifyLayer(config);
      
      if (callback) {
        callback();
      }
    }
  };
});