define([
  '../../layers/xml.js'
], function(json) {
  // Holds all of the data, including arrays and nested objects, that have already been loaded by this layer handler.
  var loaded = [];
  
  NPMap.Event.add('NPMap.Map', 'layerclick', function(e) {
    var target = e.target;

    if (target && target.data && target.data.layerType === 'Xml') {
      var content = null,
          footer = null,
          layer = NPMap.Map.getLayerByName(target.data.layerName),
          title = null,
          to;
          
      function showInfoBox() {
        NPMap.InfoBox.show(content, title, footer, [
          'zoomable'
        ], null, to);
      }
      
      NPMap.InfoBox.hide();

      switch (e.targetType) {
        case 'pushpin':
          to = target;
          break;
      };
      
      NPMap.InfoBox.marker = to;
      
      if (typeof(layer.identify) === 'function') {
        layer.identify(target.data, function(result) {
          content = result.content;
          footer = result.footer;
          title = result.title;
          
          showInfoBox();
        });
      } else {
        content = NPMap.Map.buildInfoBoxHtmlString(layer, target.data, 'content');
        footer = NPMap.Map.buildInfoBoxHtmlString(layer, target.data, 'footer');
        title = NPMap.Map.buildInfoBoxHtmlString(layer, target.data, 'title');
        
        showInfoBox();
      }
    }
  });
  
  NPMap.bing.layers = NPMap.bing.layers || {};
  
  return NPMap.bing.layers.Xml = {
    addLayer: function(config) {
      var layerIndex = -1,
          preloaded = false;
      
      function callback(xml) {
        console.log(xml);
        
        /*
        config.geometries = [];
        
        if (config.root) {
          json = json[config.root];
        }
        
        $.each(json, function(i, v) {
          var d = {
                layerName: config.name,
                layerType: 'Json'
              },
              o = {},
              m;
          
          $.each(v, function(i2, v2) {
            if (i2 !== config.lat && i2 !== config.lng) {
              d[i2] = v2;
            }
          });
          
          if (config.icon) {
            o.icon = config.icon;
          }
          
          m = NPMap.Map.createMarker(v[config.lat] + ',' + v[config.lng], o, d);
          
          config.geometries.push(m);
          NPMap.Map.addShape(m);
        });
        */
      }
      
      for (var i = 0; i < NPMap.config.layers.length; i++) {
        if (config.name === NPMap.config.layers[i].name) {
          layerIndex = i;
          break;
        }
      }
      
      while (layerIndex--) {
        var layer = NPMap.config.layers[layerIndex];
        
        if (layer.type === 'Xml' && (layer.url === config.url)) {
          preloaded = true;
        }
      }
      
      if (preloaded) {
        var int = setInterval(function() {
          var data = null;
          
          for (var i = 0; i < loaded.length; i++) {
            if (loaded[i].u === config.url) {
              data = loaded[i].d;
              break;
            }
          }
          
          if (data) {
            clearInterval(int);
            callback(data);
          }
        }, 10);
      } else {
        if (config.url.indexOf('http://') !== -1 && config.url.indexOf(location.host) === -1) {
          $.getJSON('http://maps.nps.gov/proxy/kml?url=' + config.url + '&callback=?', function(js) {
            //callback($.parseXML(js.d));
            
            console.log(js);
          });
        } else {
          $.ajax({
            dataType: 'xml',
            success: function(xml) {
              console.log(xml);
              
              //callback(xml);
            },
            type: 'GET',
            url: config.url
          });
        }
        
        
        /*
        $.ajax({
          //dataType: 'json',
          success: function(xml) {
            loaded.push({
              d: xml,
              u: config.url
            });
            callback(xml);
          },
          url: config.url
        });
        */
      }
    }
  };
});