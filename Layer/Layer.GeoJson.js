/**
 * NPMap.Layer.GeoJson module.
 */
define([
  'Layer/Layer',
  'Util/Util.Json',
  'Util/Util.Json.GeoJson'
], function(Layer, UtilJson, UtilGeoJson) {
  return NPMap.Layer.GeoJson = {
    /**
     * Handles the click operation for GeoJson layers.
     * @param {Object} e
     */
    _handleClick: function(e) {
      var target = NPMap.Map[NPMap.config.api].eventGetShape(e);

      if (target && target.npmap && target.npmap.layerType === 'GeoJson') {
        var config = Layer.getLayerByName(target.npmap.layerName),
            content,
            data = target.npmap.data,
            title,
            to;

        if (target.npmap.type === 'Marker') {
          to = target;
        } else {
          to = NPMap.Map[NPMap.config.api].latLngFromApi(NPMap.Map[NPMap.config.api].eventGetLatLng(e));
        }

        // TODO: If identify.content exists, you should use it first. Next you should check for data.description and use it if it exists.
        if (data.description) {
          content = data.description;
        } else {
          content = NPMap.InfoBox._build(config, data, 'content');
        }

        // TODO: If identify.name || identify.title exists, you should use it first. Next you should check for data.name and use it if it exists.
        if (data.name) {
          title = data.name;
        } else {
          title = NPMap.InfoBox._build(config, data, 'title');
        }

        NPMap.InfoBox.show(content, title, NPMap.InfoBox._build(config, data, 'footer'), [
          'zoomable'
        ], null, to);
      }
    },
    /**
     *
     */
    _handleHover: function(e) {

    },
    /**
     * Adds a GeoJson layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     */
    add: function(config, callback) {
      UtilJson.load(config.url, function(response) {
        config.shapes = UtilGeoJson.toShapes(response, {
          layerName: config.name,
          layerType: 'GeoJson'
        }, config.styleNpmap);
        
        NPMap.Map.addShapes(config.shapes);

        if (callback) {
          callback();
        }
      });
    }
  };
});