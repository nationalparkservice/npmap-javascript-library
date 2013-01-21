/**
 * NPMap.Layer.Xml module.
 */
define([
  'Event',
  'InfoBox',
  'Layer/Layer',
  'Map/Map',
  'Util/Util.Xml'
], function(Event, InfoBox, Layer, Map, UtilXml) {
  var queue = [];

  /**
   * Creates a marker.
   * @param {Object} config
   * @param {String} lat
   * @param {String} lng
   * @param {Object} o
   * @param {Object} d
   * @return null
   */
  function createMarker(config, lat, lng, o, d) {
    if (layer.overIcon) {
      if (typeof layer.overIcon === 'string') {
        d.overIcon = layer.overIcon;
      } else {
        d.overIcon = layer.overIcon(d);
      }
    }

    m = NPMap.Map.createMarker(lat + ',' + lng, o, d);
        
    config.shapes.push(m);
    NPMap.Map.addShape(m);
  }
  /**
   *
   */
  function displayError() {
    Map.notify('The XML did not load correctly. Please verify that the URL is correct and the layer is configured properly.', null, 'error', 4000);
  }

  return NPMap.Layer.Xml = {
    /**
     * Adds a Xml layer.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _add: function(config, callback) {
      queue.push(config);
      UtilXml.load(config.url, function(xml) {
        console.log(xml);







        if (xml) {
          var root = config.root || 'Document',
              jxon = UtilXml.toJxon(xml);

          console.log(jxon);

          if (jxon.success) {
            var elements = jxon[config.element];

            for (var i = 0; i < elements.length; i++) {
              var element = elements[i];

              //console.log(element);


            }


            /*
            for (var i = 0; i < elements.length; i++) {
              var element = elements[i],
                  currentLatRoot = element,
                  elementLat = config.lat.split('.'),
                  elementLng = config.lng.split('.'),
                  lat,
                  lng,
                  shape,
                  style = null;
                  
              console.log(element);

              for (var j = 0; j < elementLat.length; j++) {
                currentLatRoot = currentLatRoot[elementLat[j]];

                console.log(currentLatRoot);
              }

              if (typeof config.style !== 'undefined' && config.style.marker !== 'undefined') {
                style = config.style.marker;
              }

              shape = NPMap.Map._createMarker({
                lat: lat,
                lng: feature.ll.lng
              }, style);

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
            */
          } else {
            displayError();
          }
        } else {
          displayError();
        }
      });


      /*
      reqwest({
        success: function(js) {
          console.log(js);

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
          
        },
        type: 'jsonp',
        url: 'http://maps.nps.gov/proxy/kml?url=' + config.url + '&callback=?'
      });
*/
    }
  };
});