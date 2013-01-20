/**
 * NPMap.Layer.GoogleFusion module.
 */
define([
  'Event',
  'Layer/Layer'
], function(Event, Layer) {
  return NPMap.Layer.GoogleFusion = {
    /**
     * Adds a GoogleFusion layer to the map.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _add: function(config, callback) {
      var me = this;

      if (!config.query) {
        throw new Error('The "query" config is required for GoogleFusion layers.');
      }

      if (typeof config.query.from !== 'string') {
        throw new Error('The "query.from" config is required for GoogleFusion layers, and it must be a string.');
      }

      config.api = new google.maps.FusionTablesLayer({
        map: NPMap.Map[NPMap.config.api].map,
        query: config.query,
        suppressInfoWindows: true
      });

      google.maps.event.addListener(config.api, 'click', function(e) {
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
      });

      if (callback) {
        callback();
      }
    },
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
     * Hides the layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     * @return null
     */
    _hide: function(config, callback) {
      config.api.setMap(null);

      if (callback) {
        callback();
      }
    },
    /**
     * Removes the layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     * @return null
     */
    _remove: function(config, callback) {
      config.api.setMap(null);

      delete config.api;

      if (callback) {
        callback();
      }
    },
    /**
     * Shows the layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     * @return null
     */
    _show: function(config, callback) {
      config.api.setMap(NPMap.Map[NPMap.config.api].map);

      if (callback) {
        callback();
      }
    }
  };
});