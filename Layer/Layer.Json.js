/**
 * NPMap.Layer.Json module.
 */
define([
  'Layer/Layer',
  'Util/Util.Json'
], function(Layer, UtilJson) {
  /**
   * "Walks" an object tree down to the desired property.
   * @param {String} str
   * @param {Object} obj
   * @return {Object}
   */
  function walkTheTree(str, obj) {
    var value;

    str = str.split('.');

    if (str.length === 1) {
      value = obj[str[0]];
    } else {
      for (var i = 0; i < str.length; i++) {
        var property = str[i];

        try {
          if (!value) {
            value = obj[property];
          } else {
            value = value[property];
          }
        } catch (e) {
          break;
        }
      }
    }

    return value;
  }

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
        var layerName = config.name,
            root = walkTheTree(properties.root, response),
            shapes = [],
            traverse = config.properties.root.split('.');

        _.each(root, function(feature) {
          var lat = walkTheTree(properties.lat, feature),
              lng = walkTheTree(properties.lng, feature),
              npmap = {
                data: {},
                layerName: layerName,
                layerType: 'Json',
                type: 'Marker'
              },
              shape = NPMap.Map._createMarker({
                lat: parseFloat(lat),
                lng: parseFloat(lng)
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