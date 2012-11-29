define([
  'Event',
  'Layer/Layer',
  'Map/Map'
], function(Event, Layer, Map) {
  /**
   * Constructs a URI for a tile.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {String} url
   * @param {String} subdomain (Optional)
   * @return {String}
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

  return NPMap.Layer.Tiled = {
    /**
     * Handles the click operation for Tiled layers.
     * @param {Object} e
     * @return null
     */
    _handleClick: function(e) {
      
    },
    /**
     * Creates a Tiled layer and adds it to the map.
     * @param {Object} config
     * @return null
     */
    create: function(config) {
      var constructor;

      if (typeof config.url === 'function') {
        constructor = config.url;
      } else {
        constructor = uriConstructor;
      }

      NPMap.Map[NPMap.config.api].addTileLayer(NPMap.Map[NPMap.config.api].createTileLayer(constructor, {
        subdomains: [
          'a',
          'b',
          'c',
          'd'
        ],
        url: config.url,
        zIndex: config.zIndex
      }));
    }
  };
});