define([
  'Layer/Layer'
], function(Layer) {
  return NPMap.Layer.Zoomify = {
    /**
     * Creates a Zoomify layer.
     ** @param {Object} config.
     */
    create: function(layerConfig) {
      NPMap.Event.trigger('NPMap.Layer', 'beforeadd', config);

      if (!layerConfig.height) {
        throw new Error('"height" is required.');
      }
      
      if (!layerConfig.width) {
        throw new Error('"width" is required.');
      }
      
      NPMap.Map.addZoomifyLayer(NPMap.Map.createZoomifyLayer(config));
      NPMap.Event.trigger('NPMap.Layer', 'added', config);
    }
  };
});