// TODO: Add support for "extent" to layer.
// TODO: Add support for all types: http://www.nps.gov/npmap/support/examples/data/kml-samples.kml
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
      NPMap.Event.trigger('NPMap.Layer', 'beforeadd', config);

      var layerName = config.name,
          layerType = config.type;

      config.shapes = [];

      utilXml.load(config.url, function(response) {
        var features = utilKml.parse(response);
        
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

          shape.npmap = {
            data: feature.data,
            layerName: layerName,
            layerType: layerType,
            shapeType: feature.shapeType
          };

          config.shapes.push(shape);
          NPMap.Map.addShape(shape);
        }

        console.log(config.shapes);

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