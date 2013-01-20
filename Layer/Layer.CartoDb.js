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
  function _click(feature, latLng, pos, data, options) {
    _.extend(options.npmap, {
      data: data
    });

    feature.npmap = options.npmap;

    NPMap.Layer.CartoDb._handleClick(feature);
    //NPMap.Event.trigger('NPMap.Map', 'shapeclick', feature);
  }
  /**
   * Handles the CartoDb out events.
   * @return null
   */
  function _out() {
    /*
    if (point) {
      NPMap.Map.removeShape(point);
      point = null;
    }
    */

    NPMap.Layer.CartoDb._interactivityActive = false;

    if (NPMap.Layer.TileStream) {
      if (NPMap.Layer.TileStream._interactivityActive === false) {
        Map.setCursor('');
      }
    } else {
      Map.setCursor('');
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
  function _over(feature, latLng, pos, data) {
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
     * Adds a CartoDb layer.
     * @param {Object} config Required properties: 'table' and 'user'. Optional properties: 'query' and 'style'.
     * @param {Function} callback
     * @return null
     */
    _add: function(config, callback) {
      var options = {
            npmap: {
              layerName: config.name,
              layerType: config.type
            },
            opacity: typeof config.opacity !== 'number' ? 1 : config.opacity,
            zIndex: typeof config.zIndex === 'number' ? config.zIndex : null,
            zoomRange: config.zoomRange
          },
          table = config.table,
          user = config.user;

      if (!table) {
        throw new Error('The "table" config is required for CartoDb layers.');
      }

      if (!user) {
        throw new Error('The "user" config is required for CartoDb layers.');
      }

      if (typeof Map[NPMap.config.api]._addCartoDbLayer === 'function') {
        reqwest({
          success: function(response) {
            var interactivity = '',
                query,
                row = response.rows[0];

            options.query = config.query || 'SELECT * FROM {{table_name}}';
            options.table_name = table;
            options.tile_style = config.style || null;
            options.user_name = user;

            for (var prop in row) {
              interactivity += prop + ',';
            }

            if (interactivity.length > 0) {
              interactivity = interactivity.slice(0, interactivity.length - 1);
              options.interactivity = interactivity + ',geometry';
              options.query = 'SELECT ' + interactivity + ',ST_ASGEOJSON(the_geom) as geometry FROM {{table_name}}';
              options.featureClick = function(feature, latLng, pos, data) {
                _click(feature, latLng, pos, data, options);
              };
              options.featureOut = _out;
              options.featureOver = _over;
            } else {
              interactivity = null;
            }

            config.api = Map[NPMap.config.api]._addCartoDbLayer(options);
            config.api.npmap = {
              layerName: config.name,
              layerType: 'CartoDb'
            };

            if (callback) {
              callback();
            }
          },
          type: 'jsonp',
          url: 'https://' + user + '.cartodb.com/api/v2/sql?q=SELECT * FROM ' + table + ' LIMIT 1&callback=?'
        });
      } else {
        options.constructor = 'https://' + user + '.cartodb.com/tiles/' + table + '/{{z}}/{{x}}/{{y}}.png';
        options.name = config.name;
        config.api = Map._addTileLayer(options);
        config.api.npmap = {
          layerName: config.name,
          layerType: 'CartoDb'
        };

        if (callback) {
          callback();
        }
      }
    },
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
     * Hides the layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     * @return null
     */
    _hide: function(config, callback) {
      if (typeof Map[NPMap.config.api]._removeCartoDbLayer === 'function') {
        Map[NPMap.config.api]._hideCartoDbLayer(config.api);
      } else {
        Map[NPMap.config.api]._hideTileLayer(config.api);
      }

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
      if (typeof Map[NPMap.config.api]._removeCartoDbLayer === 'function') {
        Map[NPMap.config.api]._removeCartoDbLayer(config.api);
      } else {
        Map[NPMap.config.api]._removeTileLayer(config.api);
      }

      if (config.identifiable === true) {
        identifyLayers--;
      }

      delete config.identifiable;

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
      if (typeof Map[NPMap.config.api]._removeCartoDbLayer === 'function') {
        Map[NPMap.config.api]._showCartoDbLayer(config.api);
      } else {
        Map[NPMap.config.api]._showTileLayer(config.api);
      }

      if (callback) {
        callback();
      }
    }
  };
});