/**
 * NPMap.Layer.GoogleFusion module.
 */
define([
  'Event',
  'Layer/Layer'
], function(Event, Layer) {
  return NPMap.Layer.GoogleFusion = {
    /**
     * Handles the click operation for GoogleFusion layers.
     * @param {Object} e
     * @return null
     */
    _handleClick: function(e) {
      if (e.npmap && e.npmap.layerType === 'GoogleFusion') {
        var config = Layer.getLayerByName(e.npmap.layerName),
            data = e.npmap.data;
            
        NPMap.InfoBox.show(NPMap.InfoBox._build(config, data, 'content'), NPMap.InfoBox._build(config, data, 'title'), NPMap.InfoBox._build(config, data, 'footer'), null, null, NPMap.Map[NPMap.config.api].latLngFromApi(e.latLng));
      }
    },
    /**
     * Adds a GoogleFusion layer.
     * @param {Object} config
     * @return null
     */
    add: function(config) {
      var layer,
          me = this;

      //Event.trigger('NPMap.Layer', 'beforeadd', config);

      if (!config.query) {
        throw new Error('The "query" config is required for GoogleFusion layers.');
      }

      if (typeof config.query.from !== 'string') {
        throw new Error('The "query.from" config is required for GoogleFusion layers, and it must be a string.');
      }

      layer = config.api = new google.maps.FusionTablesLayer({
        map: NPMap.Map[NPMap.config.api].map,
        query: config.query,
        suppressInfoWindows: true
      });

      google.maps.event.addListener(layer, 'click', function(e) {
        var data = {},
            row = e.row;

        for (var p in row) {
          data[p] = row[p].value;
        }

        e.npmap = {
          data: data,
          layerName: config.name,
          layerType: 'GoogleFusion'
        };

        NPMap.Layer.GoogleFusion._handleClick(e);
        //Event.trigger('NPMap.Map', 'shapeclick', e);
      });
    }
  };
});