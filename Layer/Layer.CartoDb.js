/**
 * NPMap.Layer.CartoDb module.
 */
define([
  'Event',
  'InfoBox',
  'Layer/Layer',
  'Map/Map',
  'Util/Util'
], function(Event, InfoBox, Layer, Map, Util) {
  //point = null,
  //hoverStyle = {radius:8, color:"#333", weight:3, opacity:1, fillColor: "#FFCC00", fillOpacity:1, clickable:false};

  /** 
   *
   */
  function _buildInteractivity(meta) {
    var interactivity = '';

    for (var prop in meta) {
      interactivity += prop + ',';
    }

    return interactivity + 'geometry';
  }
  /**
   *
   */
  function _buildSelect(interactivity) {
    return 'SELECT ' + interactivity.replace('geometry,', '').replace(',geometry,', '').replace(',geometry', '') + ',ST_ASGEOJSON(the_geom) as geometry '
  }
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
   * Loads a CartoDB layer from its metadata.
   * @param {Object} config
   * @param {Object} meta
   * @param {Object} options
   * @param {String} table
   * @param {String} user
   * @param {Function} callback (Optional)
   */
  function _loadFromMeta(config, meta, options, table, user, callback) {
    var interactivity = _buildInteractivity(meta),
        query;
    
    options.table_name = table;
    options.tile_style = config.style || null;
    options.user_name = user;

    if (interactivity.length) {
      var select;

      options.featureClick = function(feature, latLng, pos, data) {
        _click(feature, latLng, pos, data, options);
      };
      options.featureOut = _out;
      options.featureOver = _over;
      options.interactivity = interactivity;
      select = _buildSelect(interactivity);

      if (config.query) {
        options.query = config.query.replace('SELECT * ', select);
      } else {
        options.query = select + 'FROM {{table_name}}';
      }
    } else {
      options.query = 'SELECT * FROM {{table_name}}';
    }

    config._api = Map[NPMap.config.api]._addCartoDbLayer(options);
    config._api.npmap = {
      layerName: config.name,
      layerType: 'CartoDb'
    };

    if (callback) {
      callback();
    }
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
        if (config._meta) {
          _loadFromMeta(config, config._meta, options, table, user, callback);
        } else {
          reqwest({
            success: function(response) {
              config._meta = response.rows[0];
              _loadFromMeta(config, config._meta, options, table, user, callback);
            },
            type: 'jsonp',
            url: 'https://' + user + '.cartodb.com/api/v2/sql?q=SELECT * FROM ' + table + ' LIMIT 1&callback=?'
          });
        }
      } else {
        options.constructor = 'https://' + user + '.cartodb.com/tiles/' + table + '/{{z}}/{{x}}/{{y}}.png' + (options.query ? '?q=' + options.query : '');
        options.name = config.name;
        config._api = Map._addTileLayer(options);
        config._api.npmap = {
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
        Map[NPMap.config.api]._hideCartoDbLayer(config._api);
      } else {
        Map[NPMap.config.api]._hideTileLayer(config._api);
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
        Map[NPMap.config.api]._removeCartoDbLayer(config._api);
      } else {
        Map[NPMap.config.api]._removeTileLayer(config._api);
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
        Map[NPMap.config.api]._showCartoDbLayer(config._api);
      } else {
        Map[NPMap.config.api]._showTileLayer(config._api);
      }

      if (callback) {
        callback();
      }
    },
    /**
     * UNDOCUMENTED
     */
    updateQuery: function(config, query, callback) {
      query = Util.stringGlobalReplace(query, '"', '\'');

      if (typeof Map[NPMap.config.api]._updateCartoDbQuery === 'function') {
        config.query = query.replace('SELECT * ', _buildSelect(_buildInteractivity(config._meta)));

        Map[NPMap.config.api]._updateCartoDbQuery(config._api, config.query);
      } else {
        console.info('The updateQuery method is not yet supported for this base API.');
      }

      if (callback) {
        callback();
      }
    }
  };
});