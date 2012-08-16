define([
  'Event',
  'Layer/Layer',
  'Map/Map'
], function(Event, Layer, Map) {
  return NPMap.Layer.CartoDb = {
    /**
     * Handles the click operation for CartoDb layers.
     * @param {Object} e
     */
    _handleClick: function(e) {
      
    },
    /**
     * Creates a CartoDb layer.
     * @param {Object} config
     */
    create: function(config) {
      if (!config.table) {
        throw new Error('The "table" config is required for CartoDb layers.');
      }

      if (!config.user) {
        throw new Error('The "user" config is required for CartoDb layers.');
      }

      var tileLayer,
          uriConstructor = 'https://' + config.user + '.cartodb.com/tiles/' + config.table + '/{{z}}/{{x}}/{{y}}.png';

      tileLayer = Map[NPMap.config.api].createTileLayer(uriConstructor, {
        opacity: config.opacity || 1,
        zIndex: config.zIndex
      });
      tileLayer.npmap = {
        layerName: config.name,
        layerType: config.type
      };
      config.api = tileLayer;

      Map.addTileLayer(tileLayer);
      Event.trigger('NPMap.Layer', 'added', config);
    }
  };
});