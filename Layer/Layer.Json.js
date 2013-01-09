/**
 * NPMap.Layer.Json module.
 */
define([
  'Layer/Layer',
  'Util/Util.Json'
], function(Layer, UtilJson) {
  return NPMap.Layer.Json = {
    /**
     * Handles the click operation for Json layers.
     * @param {Object} e
     * @return null
     */
    _handleClick: function(e) {
      var target = NPMap.Map[NPMap.config.api].eventGetShape(e);

      if (target && target.npmap && target.npmap.layerType === 'Json') {
        var config = Layer.getLayerByName(target.npmap.layerName),
            data = target.npmap.data;

        NPMap.InfoBox.show(NPMap.InfoBox._build(config, data, 'content'), NPMap.InfoBox._build(config, data, 'title'), NPMap.InfoBox._build(config, data, 'footer'), [
          'zoomable'
        ], null, target);
      }
    },
    /**
     *
     */
    _handleHover: function(e) {

    },
    /**
     * Adds a Json layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     * @return null
     */
    add: function(config, callback) {
      var properties = config.properties;

      if (!properties) {
        throw new Error('The "properties" object is required for "Json" layers.');
      }

      if (!properties.lat) {
        throw new Error('The "lat" property must be set on the "properties" object for "Json" layers.');
      }

      if (!properties.lng) {
        throw new Error('The "lng" property must be set on the "properties" object for "Json" layers.');
      }

      if (!properties.root) {
        throw new Error('The "root" property must be set on the "properties" object for "Json" layers.');
      }

      UtilJson.load(config.url, function(response) {
        var lat = properties.lat,
            layerName = config.name,
            lng = properties.lng,
            shapes = [];

        _.each(response[config.properties.root], function(feature) {
          var npmap = {
                data: {},
                layerName: layerName,
                layerType: 'Json',
                shapeType: 'Marker'
              },
              shape = NPMap.Map._createMarker({
                lat: parseFloat(feature[lat]),
                lng: parseFloat(feature[lng])
              }, config.styleNpmap.marker);

          delete feature[lat];
          delete feature[lng];

          _.extend(npmap.data, feature);

          shape.npmap = npmap;

          shapes.push(shape);
        });

        config.shapes = shapes;

        NPMap.Map.addShapes(config.shapes);

        if (callback) {
          callback();
        }
      }, {
        callback: config.callback
      });
    }
  };
});