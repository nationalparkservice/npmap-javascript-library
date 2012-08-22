define(function() {
  var queue = [];

  /**
   * Creates a marker.
   * @param {Object} layer
   * @param {String} lat
   * @param {String} lng
   * @param {Object} o
   * @param {Object} d
   */
  function createMarker(layer, lat, lng, o, d) {
    if (layer.overIcon) {
      if (typeof layer.overIcon === 'string') {
        d.overIcon = layer.overIcon;
      } else {
        d.overIcon = layer.overIcon(d);
      }
    }

    m = NPMap.Map.createMarker(lat + ',' + lng, o, d);
        
    layer.geometries.push(m);
    NPMap.Map.addShape(m);
  }

  NPMap.layers = NPMap.layers || {};
  
  return NPMap.layers.Xml = {
    addLayer: function(layer) {
      queue.push(layer);
      reqwest({
        success: function(js) {
          /*
          var $xml = $($.parseXML(js.d));
          
          layer.geometries = [];

          $xml.find(layer.element).each(function(i, v) {
            var $el = $(v),
                d = {
                  layerName: layer.name,
                  layerType: 'Xml'
                },
                lat = $el.find(layer.elementLatitude).text(),
                lng = $el.find(layer.elementLongitude).text(),
                o = {};

            $el.children().each(function() {
              d[this.nodeName] = $(this).text();
            });

            if (layer.icon) {
              if (typeof layer.icon === 'string') {
                o.icon = layer.icon;
              } else {
                o.icon = layer.icon(d);
              }

              // TODO: Should this apply to all APIs?
              if (NPMap.config.api === 'bing') {
                var image = new Image(),
                    interval;
                
                image.src = o.icon;

                interval = setInterval(function() {
                  if (image.height > 0 && image.width > 0) {
                    clearInterval(interval);

                    o.height = image.height;
                    o.width = image.width;

                    createMarker(layer, lat, lng, o, d);
                  }
                }, 10);
              } else {
                createMarker(layer, lat, lng, o, d);
              }
            } else {
              createMarker(layer, lat, lng, o, d);
            }
          });

          if (layer.geometries.length === 0) {
            NPMap.Map.notify('No geometries could be found in the XML.', null, 'error', 4000);
          }

          if (layer.events && layer.events.load) {
            layer.events.load(layer);
          }
          */
        },
        type: 'jsonp',
        url: 'http://maps.nps.gov/proxy/kml?url=' + layer.url + '&callback=?'
      });
    },
    hideLayer: function(layer) {

    },
    removeLayer: function(layer) {

    },
    showLayer: function(layer) {

    }
  };
});