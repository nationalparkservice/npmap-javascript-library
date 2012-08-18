define([
  '../../layers/xml.js'
], function(xml) {
  NPMap.bing.layers = NPMap.bing.layers || {};
  
  function showInfoBox(content, title, footer, to) {
    NPMap.InfoBox.show(content, title, footer, [
      'zoomable'
    ], null, to);
  }
  
  NPMap.Event.add('NPMap.Map', 'layerclick', function(e) {
    var target = e.target;

    if (target && target.data && target.data.layerType === 'Xml') {
      var layer = NPMap.Map.getLayerByName(target.data.layerName),
          to;

      NPMap.InfoBox.hide();
      
      switch (e.targetType) {
        case 'pushpin':
          to = target;
          break;
      };
      
      NPMap.InfoBox.marker = to;
      
      if (typeof(layer.identify) === 'function') {
        layer.identify(target.data, function(result) {
          showInfoBox(result.content, result.title, result.footer, to);
        });
      } else {
        showInfoBox(NPMap.InfoBox._build(layer, target.data, 'content'), NPMap.InfoBox._build(layer, target.data, 'title'), NPMap.InfoBox._build(layer, target.data, 'footer'), to);
      }
    }
  });

  return NPMap.bing.layers.Xml = {
    addLayer: function(layer) {
      xml.addLayer(layer);
    }
  };
});