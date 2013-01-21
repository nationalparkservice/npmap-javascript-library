/**
 * NPMap.Layer.Tiled module.
 */
define([
  'Event',
  'Layer/Layer',
  'Map/Map'
], function(Event, Layer, Map) {
  var MapApi = Map[NPMap.config.api];

  /**
   * Constructs a URI for a tile.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {String} url
   * @param {String} subdomain (Optional)
   * @return {String}
   */
  function _uriConstructor(x, y, z, url, subdomain) {
    return _.template(url)({
      s: subdomain !== 'undefined' ? subdomain : null,
      x: x,
      y: y,
      z: z
    });
  }

  return NPMap.Layer.Tiled = {
    /**
     * Creates a Tiled layer and adds it to the map.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _add: function(config, callback) {
      var constructor,
          tileLayer;

      if (typeof config.url === 'string') {
        constructor = config.url;
      } else {
        constructor = _uriConstructor;
      }

      tileLayer = config.api = Map._addTileLayer({
        constructor: constructor,
        name: config.name,
        opacity: config.opacity,
        subdomains: config.subdomains,
        zIndex: config.zIndex,
        zoomRange: config.zoomRange
      });
      tileLayer.npmap = {
        layerName: config.name,
        layerType: config.type
      };

      if (callback) {
        callback();
      }
    },
    /**
     * Hides a layer.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _hide: function(config, callback) {
      MapApi._hideTileLayer(config.api);

      if (callback) {
        callback();
      }
    },
    /**
     * Removes a layer from the map.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _remove: function(config, callback) {
      MapApi._removeTileLayer(config.api);

      if (callback) {
        callback();
      }
    },
    /**
     * Shows a layer.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _show: function(config, callback) {
      MapApi._showTileLayer(config.api);

      if (callback) {
        callback();
      }
    }
  };
});