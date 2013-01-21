/**
 * NPMap.Layer.Kml module.
 */
define([
  'Layer/Layer',
  'Util/Util.Xml.Kml',
  'Util/Util.Xml',
  'Util/Util.Json.GeoJson'
], function(Layer, UtilKml, UtilXml, UtilGeoJson) {
  return NPMap.Layer.Kml = {
    /**
     * Adds a Kml layer.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _add: function(config, callback) {
      UtilXml.load(config.url, function(response) {
        config.shapes = UtilGeoJson.toShapes(UtilKml.toGeoJson(response), {
          layerName: config.name,
          layerType: 'Kml'
        }, config.styleNpmap);
        
        NPMap.Map.addShapes(config.shapes);
        
        if (callback) {
          callback();
        }
      });
    },
    /**
     * Handles the click operation for ArcGisServerRest layers.
     * @param {Object} eventOrTarget The click event object OR the target itself.
     * @return null
     */
    _handleClick: function(eventOrTarget) {
      var target;

      if (typeof eventOrTarget.npmap === 'undefined') {
        target = NPMap.Map[NPMap.config.api].eventGetShape(eventOrTarget);
      } else {
        target = eventOrTarget;
      }

      if (target && target.npmap && target.npmap.layerType === 'Kml') {
        var config = Layer.getLayerByName(target.npmap.layerName),
            content,
            data = target.npmap.data,
            title,
            to;

        NPMap.InfoBox.hide();
        
        if (target.npmap.shapeType === 'Marker') {
          to = target;
        } else {
          to = NPMap.Map[NPMap.config.api].latLngFromApi(NPMap.Map[NPMap.config.api].eventGetLatLng(eventOrTarget));
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

    }
  };
});