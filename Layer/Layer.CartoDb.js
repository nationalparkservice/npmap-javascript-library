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
      


      if (e.e) {
        var latLng = Map[NPMap.config.api].eventGetLatLng(e.e);
        
        InfoBox.hide();
        InfoBox.latLng = latLng;
        Map[NPMap.config.api].positionClickDot(latLng);
        InfoBox.show(NPMap.InfoBox._build(null, e.data, 'content'), NPMap.InfoBox._build(null, e.data, 'title'));
      }
    },
    /**
     * Creates a CartoDb layer.
     * @param {Object} config
     */
    create: function(config) {
      /**
          So we need user and table as required configs and query, _____, _____ as optional configs?
       */

      if (!config.table) {
        throw new Error('The "table" config is required for CartoDb layers.');
      }

      if (!config.user) {
        throw new Error('The "user" config is required for CartoDb layers.');
      }

      var options = {
            opacity: typeof config.opacity === 'undefined' ? 1 : config.opacity,
            table: config.table,
            user: config.user,
            zIndex: typeof config.zIndex === 'undefined' ? null : config.zIndex
          },
          tileLayer;

      function loaded() {
        config.api = tileLayer;
        tileLayer.npmap = {
          layerName: config.name,
          layerType: config.type
        };

        Event.trigger('NPMap.Layer', 'added', config);
      }

      if (typeof NPMap.Map[NPMap.config.api].createCartoDbLayer === 'function') {
        /*
        reqwest({
          success: function(response) {
            console.log(response);

            tileLayer = Map[NPMap.config.api].createCartoDbLayer(options);
            loaded();
          },
          type: 'jsonp',
          url: 'http://nps.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20national_parks&callback=?'
        });
        */

        tileLayer = Map[NPMap.config.api].createCartoDbLayer(options);
        loaded();
      } else {
        tileLayer = Map[NPMap.config.api].createTileLayer('https://' + config.user + '.cartodb.com/tiles/' + config.table + '/{{z}}/{{x}}/{{y}}.png', options);

        Map.addTileLayer(tileLayer);
        loaded();
      }
    }
  };
});