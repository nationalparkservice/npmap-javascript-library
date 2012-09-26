// TODO: Change the way you handle TileStream layers. Composited layers should be added as a single layer object to NPMap.config.layers.

define([
  'Event',
  'InfoBox',
  'Layer/Layer',
  'Map/Map'
], function(Event, InfoBox, Layer, Map) {
  var
      // The interaction object.
      interaction = null,
      // The base URI template for a TileStream tile.
      uriTemplate = 'http://{{subdomain}}.tiles.mapbox.com/v3/{{layers}}/{{z}}/{{x}}/{{y}}.png';

  /**
   * Constructs a URL string for a composited layer.
   * @param {Array} composited
   * @return {String}
   */
  function constructCompositedString(composited) {
    var layerString = '';

    _.each(composited, function(composite, i) {
      layerString += composite.id;

      if (i + 1 !== composited.length) {
        layerString += ',';
      }
    });

    return layerString;
  }
  /**
   * Checks to see if a layer is visible and is of type 'TileStream'.
   * @param {Object} layer
   * @return {Boolean}
   */
  function isVisibleAndTileStream(layer) {
    return (layer.type === 'TileStream' && (typeof layer.visible === 'undefined' || layer.visible));
  }
  /**
   * Constructs a URI for a tile.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {String} url
   * @param {String} subdomain
   */
  function uriConstructor(x, y, z, url, subdomain) {
    var template = _.template(url);

    return template({
      subdomain: subdomain,
      x: x,
      y: y,
      z: z
    });
  }

  Event.add('NPMap.Map', 'zoomstart', function() {
    if (NPMap.Layer.TileStream._getAllVisibleLayers().length > 0) {
      InfoBox.hide();
    }
  });

  return NPMap.Layer.TileStream = {
    /**
     * Gets the number of visible TileStream layers.
     * @return {Array}
     */
    _getAllVisibleLayers: function() {
      var baseLayers = this._getVisibleBaseLayers(),
          layers = this._getVisibleLayers(),
          visible = [];
      
      if (baseLayers.length > 0) {
        visible.push(baseLayers);
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
    _getVisibleBaseLayers: function() {
      var visible = [];
      
      if (NPMap.config.baseLayers) {
        for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
          var baseLayer = NPMap.config.baseLayers[i];
          
          if (isVisibleAndTileStream(baseLayer)) {
            visible.push(baseLayer);
            break;
          }
        }
      }
      
      return visible;
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
          
          if (isVisibleAndTileStream(layer)) {
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
      var latLng = Map[NPMap.config.api].eventGetLatLng(e.e);

      InfoBox.hide();
      InfoBox.latLng = latLng;
      Map[NPMap.config.api].positionClickDot(latLng);
      InfoBox.show(NPMap.InfoBox._build(null, e.data, 'content'), NPMap.InfoBox._build(null, e.data, 'title'));
    },
    /**
     * Loads all of the TileStream layers that have been added to the map and are visible.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    create: function(config, callback) {
      var baseLayer = this._getVisibleBaseLayers()[0],
          layerString = config.id,
          url = config.url || 'http://api.tiles.mapbox.com/v3/';

      Event.trigger('NPMap.Layer', 'beforeadd', config);

      if (config.composited) {
        layerString = constructCompositedString(config.composited);
      }

      url += layerString;

      reqwest({
        jsonpCallbackName: 'grid',
        success: function(response) {
          var api = NPMap.config.api,
              apiMap = Map[api],
              map = apiMap.map,
              tileLayer,
              waxShort = null,
              zIndex = config.zIndex;

          if (typeof apiMap.createTileStreamLayer === 'function') {
            tileLayer = apiMap.createTileStreamLayer(response, {
              zIndex: zIndex
            });

            if (typeof apiMap.addTileStreamLayer === 'function') {
              apiMap.addTileStreamLayer(response);
            } else {
              apiMap.addTileLayer(tileLayer);
            }
          } else {
            tileLayer = apiMap.createTileLayer(uriConstructor, {
              subdomains: [
                'a',
                'b',
                'c',
                'd'
              ],
              url: uriTemplate.replace('{{layers}}', layerString),
              zIndex: config.zIndex
            });

            apiMap.addTileLayer(tileLayer);
          }

          config.api = tileLayer;

          switch (api) {
            case 'Esri':
              waxShort = 'esri';
              break;
            case 'Google':
              waxShort = 'g';
              break;
            case 'Leaflet':
              waxShort = 'leaf';
              break;
            case 'ModestMaps':
              waxShort = 'mm';
              break;
            default:
              break;
          }

          if (!interaction && response.grids && waxShort) {
            interaction = wax[waxShort].interaction().map(map).tilejson(response).on('on', function(o) {
              Map.setCursor('pointer');

              if (o.e.type !== 'mousemove') {
                NPMap.Event.trigger('NPMap.Map', 'shapeclick', o);
              }
            }).on('off', function(o) {
              Map.setCursor('default');
            });
          }

          Event.trigger('NPMap.Layer', 'afteradd', config);

          if (callback) {
            callback();
          }
        },
        type: 'jsonp',
        url: url + '.jsonp'
      });
    },
    /**
     * Refreshes the TileStream layer.
     * @param {Object} config
     * @return null
     */
    refresh: function(config) {







      //this.remove();
      //this.create();
    },
    /**
     * Removes a TileStream layer from the map.
     * @param {Object} config
     * @return null
     */
    remove: function(config) {
      var apiMap = Map[NPMap.config.api];

      if (typeof apiMap.removeTileStreamLayer === 'function') {
        apiMap.removeTileStreamLayer(config.api);
      } else {
        apiMap.removeTileLayer(config.api);
      }

      config.api = null;
    }
  };
});