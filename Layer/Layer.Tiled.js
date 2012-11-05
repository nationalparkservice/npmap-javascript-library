define([
  'Event',
  'Layer/Layer',
  'Map/Map'
], function(Event, InfoBox, Map) {
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
     * Creates a Tiled layer and adds it to the map.
     * @param {Object} config
     * @return null
     */
    create: function(config) {
      var tileLayer = NPMap.Map[NPMap.config.api].createTileLayer(uriConstructor, {
        subdomains: [
          'a',
          'b',
          'c',
          'd'
        ],
        url: config.url,
        zIndex: config.zIndex
      });

      NPMap.Map[NPMap.config.api].addTileLayer(tileLayer);
    }
  };
});