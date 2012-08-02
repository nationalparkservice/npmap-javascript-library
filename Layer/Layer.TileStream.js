define([
  'Event',
  'InfoBox',
  'Layer/Layer',
  'Map/Map'
], function(Event, InfoBox, Layer, Map) {
  var
      //
      interaction,
      //
      tileJson,
      // The current TileStream tile layer. Only one of these can be added to the map at a time, although this one layer can contain multiple composited TileStream layers.
      tileLayer,
      // The base URI template for a TileStream tile.
      uriTemplate = 'http://{{subdomain}}.tiles.mapbox.com/v3/{{layers}}/{{z}}/{{x}}/{{y}}.png';

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
    InfoBox.hide();
  });

  return NPMap.Layer.TileStream = {
    /**
     * Gets the number of visible TileStream layers.
     * @return {Number}
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
     * @return {Number}
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
     * @return {Number}
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
     * @param {Function} callback
     */
    create: function(callback) {
      var baseLayer = this._getVisibleBaseLayers()[0],
          layers = this._getVisibleLayers(),
          layersString = '',
          url = 'http://api.tiles.mapbox.com/v3/';
      
      //Event.trigger('NPMap.Layer', 'beforeadd', config);

      if (layers.length > 0) {
        layers.sort(function(a, b) {
          if (a.zIndex && b.zIndex) {
            return a.zIndex > b.zIndex;
          } else {
            return null;
          }
        });
      }
      
      if (typeof baseLayer !== 'undefined') {
        layers.splice(0, 0, baseLayer);
      }
      
      for (var i = 0; i < layers.length; i++) {
        layersString += layers[i].id;

        if (i + 1 !== layers.length) {
          layersString += ',';
        }
      }

      url += layersString;

      reqwest({
        jsonpCallbackName: 'grid',
        success: function(response) {
          var api = NPMap.config.api,
              apiMap = Map[api],
              map = apiMap.map,
              waxShort = null;

          tileLayer = apiMap.createTileLayer(uriConstructor, {
            subdomains: [
              'a',
              'b',
              'c',
              'd'
            ],
            url: uriTemplate.replace('{{layers}}', layersString)
          });
          apiMap.addTileLayer(tileLayer);

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

          if (waxShort) {
            interaction = wax[waxShort].interaction().map(map).tilejson(response).on('on', function(o) {
              Map.setCursor('pointer');

              if (o.e.type !== 'mousemove') {
                NPMap.Event.trigger('NPMap.Map', 'shapeclick', o);
              }
            }).on('off', function(o) {
              Map.setCursor('default');
            });
          }

          tileJson = response;

          //Event.trigger('NPMap.Layer', 'afteradd', config);
        },
        type: 'jsonp',
        url: url + '.jsonp'
      });
    }
  };
});