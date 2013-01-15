/**
 * NPMap.Layer.CartoDb module.
 */
define([
  'Event',
  'InfoBox',
  'Layer/Layer',
  'Map/Map'
], function(Event, InfoBox, Layer, Map) {
  //point = null,
  //hoverStyle = {radius:8, color:"#333", weight:3, opacity:1, fillColor: "#FFCC00", fillOpacity:1, clickable:false};

  /**
   * Handles CartoDb click events.
   * @param {Object} feature
   * @param {Object} latLng
   * @param {Object} pos
   * @param {Object} data
   * @return null
   */
  function click(feature, latLng, pos, data, options) {
    _.extend(options.npmap, {
      data: data
    });

    feature.npmap = options.npmap;

    console.log(feature);

    NPMap.Layer.CartoDb._handleClick(feature);
    //NPMap.Event.trigger('NPMap.Map', 'shapeclick', feature);
  }
  /**
   * Handles the CartoDb out events.
   * @return null
   */
  function out() {
    /*
    if (point) {
      NPMap.Map.removeShape(point);
      point = null;
    }
    */

    NPMap.Layer.CartoDb._interactivityActive = false;

    if (NPMap.Layer.TileStream) {
      if (NPMap.Layer.TileStream._interactivityActive === false) {
        Map.setCursor('default');
      }
    } else {
      Map.setCursor('default');
    }
  }
  /**
   * Handles the CartoDb over events.
   * @param {Object} feature
   * @param {Object} latLng
   * @param {Object} pos
   * @param {Object} data
   * @return null
   */
  function over (feature, latLng, pos, data) {
    NPMap.Layer.CartoDb._interactivityActive = true;

    Map.setCursor('pointer');

    /*
    if (point) {
      NPMap.Map.removeShape(point);
      point = null;
    }
    
    if (data.geometry) {
      var geometry = JSON.parse(data.geometry);

      if (geometry.type === 'Point') {
        var coordinates = geometry.coordinates;

        point = NPMap.Map.createMarker({
          lat: coordinates[1],
          lng: coordinates[0]
        });

        NPMap.Map.addShape(point);
      }
    }
    */
  }

  return NPMap.Layer.CartoDb = {
    // True if mouseover or click interactivity is currently active.
    _interactivityActive: false,
    /**
     * Handles the click operation for CartoDb layers.
     * @param {Object} e
     * @return null
     */
    _handleClick: function(e) {
      var npmap = e.npmap;

      if (npmap && npmap.layerType === 'CartoDb') {
        var config = Layer.getLayerByName(npmap.layerName),
            latLng = Map[NPMap.config.api].eventGetLatLng(e);

        InfoBox.hide();
        InfoBox.latLng = latLng;
        Map[NPMap.config.api].positionClickDot(latLng);
        InfoBox.show(NPMap.InfoBox._build(config, npmap.data, 'content'), NPMap.InfoBox._build(config, npmap.data, 'title'));
      }
    },
    /**
     * Adds a CartoDb layer.
     * @param {Object} config Required properties: 'table' and 'user'. Optional properties: 'query' and 'style'.
     * @param {Function} callback
     * @return null
     */
    add: function(config, callback) {
      var table = config.table,
          user = config.user,
          options = {
            npmap: {
              layerName: config.name,
              layerType: config.type
            },
            opacity: typeof config.opacity !== 'number' ? 1 : config.opacity,
            query: config.query || 'SELECT * FROM {{table_name}}',
            table_name: table,
            tile_style: config.style || null,
            user_name: user,
            zIndex: typeof config.zIndex === 'undefined' ? null : config.zIndex
          };

      if (!table) {
        throw new Error('The "table" config is required for CartoDb layers.');
      }

      if (!user) {
        throw new Error('The "user" config is required for CartoDb layers.');
      }

      if (typeof NPMap.Map[NPMap.config.api].createCartoDbLayer === 'function') {
        reqwest({
          success: function(response) {
            var interactivity = '',
                query,
                row = response.rows[0];

            for (var prop in row) {
              interactivity += prop + ',';
            }

            if (interactivity.length > 0) {
              interactivity = interactivity.slice(0, interactivity.length - 1);
              options.interactivity = interactivity + ',geometry';
              options.query = 'SELECT ' + interactivity + ',ST_ASGEOJSON(the_geom) as geometry FROM {{table_name}}';
              options.featureClick = function(feature, latLng, pos, data) {
                click(feature, latLng, pos, data, options);
              };
              options.featureOut = out;
              options.featureOver = over;
            } else {
              interactivity = null;
            }

            config.api = Map[NPMap.config.api].createCartoDbLayer(options);
            
            if (callback) {
              callback();
            }
          },
          type: 'jsonp',
          url: 'https://' + user + '.cartodb.com/api/v2/sql?q=SELECT * FROM ' + table + ' LIMIT 1&callback=?'
        });
      } else {
        config.api = Map[NPMap.config.api].createTileLayer('https://' + user + '.cartodb.com/tiles/' + table + '/{{z}}/{{x}}/{{y}}.png', options);

        Map.addTileLayer(config.api);
        
        if (callback) {
          callback();
        }
      }
    }
  };
});