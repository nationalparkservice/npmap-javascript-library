// TODO: Add support for "extent" to layer.
// TODO: Add support for all types: http://www.nps.gov/npmap/support/examples/data/kml-samples.kml
define([
  'Layer/Layer',
  'Util/Util.Xml.Kml',
  'Util/Util.Xml'
], function(Layer, UtilKml, UtilXml) {
  return NPMap.Layer.Kml = {
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
     * Creates a Kml layer.
     * @param {Object} config
     */
    create: function(config) {
      var layerName = config.name,
          layerType = config.type;

      NPMap.Event.trigger('NPMap.Layer', 'beforeadd', config);

      config.shapes = [];

      UtilXml.load(config.url, function(response) {
        var features = UtilKml.parse(response);

        for (var i = 0; i < features.length; i++) {
          var feature = features[i],
              shape,
              shapeType = feature.shapeType,
              style = null;

          if (typeof config.style !== 'undefined' && config.style[shapeType.toLowerCase()] !== 'undefined') {
            style = config.style[shapeType.toLowerCase()];
          }

          switch (shapeType) {
            case 'Line':
              //shape = NPMap.Map.createLine(feature.ll, style);
              break;
            case 'Marker':
              shape = NPMap.Map._createMarker({
                lat: feature.ll.lat,
                lng: feature.ll.lng
              }, style);
              break;
            case 'Polygon':
              shape = NPMap.Map._createPolygon(feature.ll, style);
              break;
          }

          if (shape) {
            shape.npmap = {
              data: feature.data,
              layerName: layerName,
              layerType: layerType,
              shapeType: feature.shapeType
            };

            config.shapes.push(shape);
            NPMap.Map.addShape(shape);
          }
        }

        NPMap.Event.trigger('NPMap.Layer', 'added', config);
      });
    },
    /**
     * Hides the layer.
     * @param {Object} config
     */
    hide: function(config) {

    },
    /**
     *
     */
    remove: function(config) {
      NPMap.Event.trigger('NPMap.Layer', 'beforeremove', config);
      // TODO: Not yet implemented.
      NPMap.Event.trigger('NPMap.Layer', 'removed', config);
    },
    /**
     * Shows the layer.
     * @param {Object} config
     */
    show: function(config) {
      
    }
  };
});