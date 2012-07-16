define([
  'Layer/Layer',
  'Util/Util.Xml',
  'Util/Util.Xml.Kml'
], function(Layer, utilXml, utilKml) {
  return NPMap.Layer.Kml = {
    /**
     * Handles the click operation for ArcGisServerRest layers.
     * @param {Object} e
     */
    _handleClick: function(e) {
      var target = NPMap.Map[NPMap.config.api].eventGetShape(e);

      if (target && target.npmap && target.npmap.layerType === 'Kml') {
        var config = NPMap.Map.getLayerByName(target.npmap.layerName),
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
      Layer.hasRequiredProperties(config);

      var layerName = config.name,
          layerType = config.type;

      config.shapes = [];

      utilXml.load(config.url, function(response) {
        var features = utilKml.parse(response);

        for (var i = 0; i < features.length; i++) {
          var feature = features[i],
              shape;
        
          switch (feature.shapeType) {
            case 'Line':
              //shape = NPMap.Map.createLine();
              break;
            case 'Marker':
              shape = NPMap.Map.createMarker(feature.ll.y + ',' + feature.ll.x);
              break;
            case 'Polygon':
              shape = NPMap.Map.createPolygon(feature.ll);
              break;
          }

          shape.npmap = {
            data: feature.data,
            layerName: layerName,
            layerType: layerType,
            shapeType: feature.shapeType
          };

          config.shapes.push(shape);
          NPMap.Map.addShape(shape);
        }
      });
    },
    /**
     * Hides the layer.
     * @param {Object} config
     */
    hide: function(config) {

    },
    /**
     * Reloads the layer. Can be used after an edit operation or after a subLayer has been toggled on or off.
     * @param {Object} config
     */
    reload: function(config) {
      
    },
    /**
     *
     */
    remove: function(config) {
      
    },
    /**
     * Shows the layer.
     * @param {Object} config
     */
    show: function(config) {
      
    }
  };
});