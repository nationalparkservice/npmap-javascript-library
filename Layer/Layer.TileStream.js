/**
 * NPMap.Layer.TileStream module.
 */
define([
  'Event',
  'InfoBox',
  'Layer/Layer',
  'Map/Map'
], function(Event, InfoBox, Layer, Map) {
  var
      // The base URI template for a TileStream tile.
      _uriTemplate = 'http://{{s}}.tiles.mapbox.com/v3/{{layers}}/{{z}}/{{x}}/{{y}}.png',
      //
      _WAX_SHORT = {
        Esri: 'esri',
        Google: 'g',
        Leaflet: 'leaf',
        ModestMaps: 'mm'
      };

  /**
   * Constructs a URL string for a composited layer.
   * @param {Array} composited
   * @return {String}
   */
  function _constructCompositedString(composited) {
    var layerString = '';

    _.each(composited, function(composite, i) {
      var visible = composite.visible;

      if (typeof visible === 'undefined' || visible === true) {
        layerString += composite.id;

        if (i + 1 !== composited.length) {
          layerString += ',';
        }
      }
    });

    return layerString;
  }
  /**
   * Checks to see if a layer is visible and is of type 'TileStream'.
   * @param {Object} layer
   * @return {Boolean}
   */
  function _isVisibleAndTileStream(layer) {
    return (layer.type === 'TileStream' && (typeof layer.visible === 'undefined' || layer.visible));
  }
  /**
   * Toggles interaction on or off.
   * @param {Object} config
   * @param {Boolean} on
   * @return null
   */
  function _toggleInteraction(config, on) {
    if (on) {
      config.interaction = wax[_WAX_SHORT[NPMap.config.api]].interaction().map(Map[NPMap.config.api].map).tilejson(config.tileJson).on('on', function(o) {
        NPMap.Layer.TileStream._interactivityActive = true;

        Map.setCursor('pointer');

        if (o.e.type === 'click') {
          NPMap.Layer.TileStream._handleClick(o);
        }
      }).on('off', function(o) {
        NPMap.Layer.TileStream._interactivityActive = false;

        if (NPMap.Layer.CartoDb) {
          if (NPMap.Layer.CartoDb._interactivityActive === false) {
            Map.setCursor('');
          }
        } else {
          Map.setCursor('');
        }
      });
    } else {
      config.interaction.off('on');
      config.interaction.off('off');

      try {
        config.interaction.remove();
      } catch (error) {

      }
    }
  }
  /**
   * Constructs a URI for a tile.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {String} url
   * @param {String} subdomain
   * Return {String}
   */
  function _uriConstructor(x, y, z, url, subdomain) {
    return _.template(url)({
      s: subdomain,
      x: x,
      y: y,
      z: z
    });
  }

  return NPMap.Layer.TileStream = {
    /**
     * Adds a TileStream layer to the map.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _add: function(config, callback) {
      var composited = config.composited,
          layerString = config.id,
          url = config.url || 'http://api.tiles.mapbox.com/v3/';

      if (composited) {
        var currentIndex,
            visible = 0,
            zIndexes = [],
            zIndexesCreate = [];

        _.each(composited, function(composite) {
          if (typeof composite.visible !== 'boolean') {
            composite.visible = true;
          }

          if (composite.visible) {
            visible++;
          }

          if (typeof composite.zIndex === 'number') {
            zIndexes.push(composite);
          } else {
            zIndexesCreate.push(composite);
          }
        });

        if (zIndexes.length > 0) {
          zIndexes.sort();

          currentIndex = zIndexes[zIndexes.length - 1];
        } else {
          currentIndex = -1;
        }

        _.each(zIndexesCreate, function(composite) {
          currentIndex++;

          composite.zIndex = currentIndex;

          zIndexes.push(composite);
        });

        layerString = _constructCompositedString(config.composited);

        if (visible > 15) {
          throw new Error('TileStream only supports up to 15 composited layer per tileset. Your layer has ' + visible + ' composited layers.');
        }
      }

      url += layerString;

      reqwest({
        jsonpCallbackName: 'grid',
        success: function(response) {
          var MapApi = Map[NPMap.config.api],
              tileLayer,
              zIndex = config.zIndex;

          if (typeof response.id === 'undefined' || response.id === null) {
            response.id = config.id || config.name;
          }

          if (typeof MapApi._addTileStreamLayer === 'function') {
            tileLayer = MapApi._addTileStreamLayer({
              tileJson: response,
              zIndex: zIndex
            });
          } else {
            tileLayer = MapApi._addTileLayer({
              constructor: _uriConstructor,
              subdomains: [
                'a',
                'b',
                'c',
                'd'
              ],
              url: _uriTemplate.replace('{{layers}}', layerString),
              zIndex: zIndex
            });
          }

          tileLayer.npmap = {
            layerName: config.name,
            layerType: config.type
          };
          config.api = tileLayer;
          config.tileJson = response;
          
          if (response.grids && _WAX_SHORT[NPMap.config.api]) {
            _toggleInteraction(config, true);
          }

          if (callback) {
            callback();
          }
        },
        type: 'jsonp',
        url: url + '.jsonp'
      });
    },
    // True if mouseover or click interactivity is currently active.
    _interactivityActive: false,
    /**
     * Builds an attribution string for a layer config, including all composited layers.
     * @param {Object} config
     * @param {String}
     */
    _buildAttribution: function(config) {
      var attribution = [];

      if (config.composited) {
        for (var i = 0; i < config.composited.length; i++) {
          var a = config.composited[i].attribution;

          if (a && _.indexOf(attribution, a) === -1) {
            attribution.push(a);
          }
        }
      } else if (config.attribution) {
        attribution.push(config.attribution);
      }

      return attribution;
    },
    /**
     * Gets the number of visible TileStream layers.
     * @return {Array}
     */
    _getAllVisibleLayers: function() {
      var baseLayer = this._getVisibleBaseLayer(),
          layers = this._getVisibleLayers(),
          visible = [];
      
      if (baseLayer) {
        visible.push(baseLayer);
      }
      
      if (layers.length > 0) {
        visible.push(layers);
      }
      
      return _.flatten(visible);
    },
    /**
     * Gets the first visible TileStream baseLayer.
     * @return {Array}
     */
    _getVisibleBaseLayer: function() {
      for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
        var baseLayer = NPMap.config.baseLayers[i];

        if (_isVisibleAndTileStream(baseLayer)) {
          return baseLayer;
        }
      }

      return null;
    },
    /**
     * Gets the number of visible TileStream layers.
     * @return {Array}
     */
    _getVisibleLayers: function() {
      var visible = [];
      
      if (NPMap.config.layers) {
        for (var i = 0; i < NPMap.config.layers.length; i++) {
          var layer = NPMap.config.layers[i];
          
          if (_isVisibleAndTileStream(layer)) {
            visible.push(layer);
          }
        }
      }
      
      return visible;
    },
    /**
     * Handles the click operation for TileStream layers.
     * @param {Object} e
     * @return null
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
     * Hides the layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     */
    _hide: function(config, callback) {
      var MapApi = Map[NPMap.config.api];

      if (typeof MapApi._hideTileStreamLayer === 'function') {
        MapApi._hideTileStreamLayer(config.api);

        if (config.interaction) {
          _toggleInteraction(config, false);
        }
      } else {
        MapApi._hideTileLayer(config.api);
      }

      if (callback) {
        callback();
      }
    },
    /**
     * Removes a layer from the map.
     * @param {Object} config
     * @param {Function} callback (Optional)
     * @return null
     */
    _remove: function(config, callback) {
      var MapApi = Map[NPMap.config.api];

      if (typeof MapApi._removeTileStreamLayer === 'function') {
        MapApi._removeTileStreamLayer(config.api);

        if (config.interaction) {
          _toggleInteraction(config, false);

          delete config.interaction;
        }
        
        delete config.tileJson;
      } else {
        MapApi._removeTileLayer(config.api);
      }

      if (callback) {
        callback();
      }
    },
    /**
     * Shows the layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     */
    _show: function(config, callback) {
      var MapApi = Map[NPMap.config.api];

      if (typeof MapApi._showTileStreamLayer === 'function') {
        MapApi._showTileStreamLayer(config.api);
        
        if (config.interaction) {
          _toggleInteraction(config, true);
        }
      } else {
        MapApi._showTileLayer(config.api);
      }

      if (callback) {
        callback();
      }
    },
    /**
     * Refreshes the layer.
     * @param {Object} config
     * @return null
     */
    refresh: function(config) {
      if (config.api) {
        Layer.remove(config, true);
      }
      
      Layer.add(config, true);
    }
  };
});