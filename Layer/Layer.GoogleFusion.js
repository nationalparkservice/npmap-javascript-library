// TODO: This is Google Maps-specific.
define([
  'Event',
  'Layer/Layer'
], function(Event, Layer) {
  return NPMap.Layer.GoogleFusion = {
    /**
     * Handles the click operation for GoogleFusion layers.
     * @param {Object} e
     */
    _handleClick: function(e) {
      if (e.npmap && e.npmap.layerType === 'GoogleFusion') {
        var config = NPMap.Map.getLayerByName(e.npmap.layerName),
            data = e.npmap.data;
            
        NPMap.InfoBox.show(NPMap.InfoBox._build(config, data, 'content'), NPMap.InfoBox._build(config, data, 'title'), NPMap.InfoBox._build(config, data, 'footer'), null, null, NPMap.Map[NPMap.config.api].latLngFromApi(e.latLng));
      }
    },
    /**
     * Creates a GoogleFusion layer.
     * @param {Object} config
     */
    create: function(config) {
      Event.trigger('NPMap.Layer', 'beforeadd', config);

      if (!config.query) {
        throw new Error('The "query" config is required for GoogleFusion layers.');
      }

      if (typeof config.query.from !== 'string') {
        throw new Error('The "query.from" config is required for GoogleFusion layers, and it must be a string.');
      }

      var layer = new google.maps.FusionTablesLayer({
        map: NPMap.Map[NPMap.config.api].map,
        query: config.query,
        suppressInfoWindows: true
      });

      config.api = layer;

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

        Event.trigger('NPMap.Map', 'shapeclick', e);
      });
    }

    /*
    buildInfoBox: function(data, layer) {
      var content,
          title;

      if (!data) {
        content = 'No information is available for this resource.';
        title = 'Sorry!';
      } else {
        title = '<h2>';

        if (typeof(layer.identify.content) === 'function') {
          content = layer.identify.content(data);
        } else {
          content = layer.identify.content;
        }

        if (typeof(layer.identify.title) === 'function') {
          title = layer.identify.title(data);
        } else {
          title = layer.identify.title;
        }

        title += '</h2>';

        _.each(data, function(v, i) {
          // TODO: These should be regular expressions that replace multiple instances if they exist.
          content = content.replace('{' + v.columnName + '}', v.value);
          title = title.replace('{' + v.columnName + '}', v.value);
        });
      }

      NPMap.InfoBox.show(content, title);
    }
    */
  };
});


