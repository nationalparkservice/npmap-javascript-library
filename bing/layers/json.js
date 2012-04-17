define([
  '../../layers/json.js'
], function(json) {
  function showInfoBox(content, title, footer, to) {
    NPMap.InfoBox.show(content, title, footer, [
      'zoomable'
    ], null, to);
  }
  
  NPMap.Event.add('NPMap.Map', 'layerclick', function(e) {
    var target = e.target;

    if (target && target.data && target.data.layerType === 'Json') {
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
        showInfoBox(NPMap.Map.buildInfoBoxHtmlString(layer, target.data, 'content'), NPMap.Map.buildInfoBoxHtmlString(layer, target.data, 'title'), NPMap.Map.buildInfoBoxHtmlString(layer, target.data, 'footer'), to);
      }
    }
  });
  
  NPMap.bing.layers = NPMap.bing.layers || {};
  
  return NPMap.bing.layers.Json = {
    addLayer: function(layer) {
      json.addLayer(layer);
    }
  };
});