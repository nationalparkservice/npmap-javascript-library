define([
  '../../layers/kml.js'
], function(kml) {
  /**
   * Builds out the data object for a geometry.
   * @param {Object} layerConfig The layer config object for the geometry.
   * @param {Object} record The KML "record" for the geometry object.
   * @param {Object} extendedData (Optional) The "ExtendedData" element of the KML "record", if it exists.
   */
  function buildDataObject(layerConfig, record, extendedData) {
    var data = {
      description: $(record).find('description').text(),
      layerName: layerConfig.name,
      layerType: 'Kml',
      title: $(record).find('name').text()
    };

    if (extendedData && extendedData.length === 1) {
      $(extendedData[0]).find('Data').each(function() {
        var me = $(this);
        
        data[me.attr('name')] = $.trim(me.text());
      });
      $($(extendedData[0]).find('SchemaData')[0]).find('SimpleData').each(function() {
        var me = $(this);

        data[me.attr('name')] = $.trim(me.text());
      });
    }
    
    return data;
  }
  /**
   * Builds the HTML string for an InfoBox element.
   * @param {Object} obj The layer.identify object.
   * @return {String}
   */
  function buildHtml(obj, target) {
    var str = null;

    switch (typeof(obj)) {
      case 'function':
        str = obj(target.data);
        break;
      case 'string':
        $.each(target.data, function(i, v) {
          // Do a global replace.
        });
        break;
    }

    return str;
  }
  /**
   * Converts a HEX color to RGB.
   * @param {String} hex The HEX string to convert.
   * @returns {String}
   */
  function hexToRgb(hex) {
    var i = 3,
        rgb = hex.replace('#', '').match(/(.{2})/g);
        
    while (i--) {
      rgb[i] = parseInt(rgb[i], 16);
    }
    
    return rgb;
  }
  /**
   * Processes a line.
   * @param {Object} obj The KML object.
   * @return {Object} {Microsoft.Maps.Polyline}
   */
  function processLine(obj) {
  
  }
  /**
   * Processes a point.
   * @param {Object} obj The KML object.
   * @return {Object} {Microsoft.Maps.Pushpin}
   */
  function processPoint(obj) {
  
  }
  /**
   * Processes a polygon.
   * @param {Object} obj The KML object.
   * @return {Object} {Microsoft.Maps.Polygon}
   */
  function processPolygon(obj) {
  
  }
  
  NPMap.Event.add('NPMap.Map', 'layerclick', function(e) {
    var target = e.target;
    
    if (target && target.data && target.data.layerType === 'Kml') {
      var content,
          layer = NPMap.Map.getLayerByName(target.data.layerName),
          title,
          to;
      
      NPMap.InfoBox.hide();
      
      if (e.targetType === 'pushpin') {
        to = target;
      } else {
        to = NPMap.bing.map.latLngToString(NPMap.bing.map.Map.tryPixelToLocation(new Microsoft.Maps.Point(e.pageX, e.pageY), Microsoft.Maps.PixelReference.page));
      }
      
      if (target.data.description) {
        content = target.data.description;
      } else {
        content = NPMap.Map.buildInfoBoxHtmlString(layer, target.data, 'content');
      }
      
      if (target.data.title) {
        title = target.data.title;
      } else {
        title = NPMap.Map.buildInfoBoxHtmlString(layer, target.data, 'title');
      }
      
      // TODO: If identify.title exists, you should use it first. Next you should check for target.data.title and use it if it exists.
      
      NPMap.InfoBox.show(content, title, NPMap.Map.buildInfoBoxHtmlString(layer, target.data, 'footer'), [
        'zoomable'
      ], null, to);
    }
  });
  
  NPMap.bing.layers = NPMap.bing.layers || {};
  
  return NPMap.bing.layers.Kml = {
    /**
     * Add a Kml layer to the map.
     ** @param {Object} layerConfig The layer config object from the web map config file.
     */
    addLayer: function(layerConfig) {
      var callback = function(xml) {
        var styles = [];

        $(xml).find('Style').each(function(i, v) {
          var icon = $(this).find('IconStyle'),
              line = $(this).find('LineStyle'),
              poly = $(this).find('PolyStyle'),
              style = {
                id: $(this).attr('id')
              };

          if (icon.length > 0) {
            style.icon = $(icon).find('href').text();
          } else {
            style.icon = NPMap.config.server + '/resources/markers/nps_round_13.png';
          }
          
          if (line.length > 0) {
            style.line = {
              color: $(line).find('color').text(),
              width: parseInt($(line).find('width').text())
            };
          }
          
          if (poly.length > 0) {
            style.poly = {
              color: $(poly).find('color').text(),
              fill: parseInt($(poly).find('fill').text()),
              outline: parseInt($(poly).find('outline').text())
            };
          }
          
          styles.push(style);
        });
        $(xml).find('Placemark').each(function(i, v) {
          var extendedData = $(this).find('ExtendedData'),
              style = $(this).find('styleUrl').text().replace('#', '');

          for (var i = 0; i < styles.length; i++) {
            if (styles[i].id === style) {
              style = styles[i];
              break;
            }
          }
            
          if ($(this).find('Point').length > 0) {
            var me = this,
                coordinate = $(me).find('Point').find('coordinates').text().split(','),
                data = buildDataObject(layerConfig, me, extendedData),
                icon = NPMap.config.server + '/resources/markers/nps_round_13.png',
                iconHeight = 13,
                iconWidth = 13;
                  
            function callback() {
              var marker = NPMap.Map.createMarker(coordinate[1] + ',' + coordinate[0], {
                anchor: (function() {
                  if (iconHeight > iconWidth) {
                    return new Microsoft.Maps.Point(iconWidth / 2, 0);
                  } else {
                    return new Microsoft.Maps.Point(iconWidth / 2, iconHeight / 2);
                  }
                })(),
                height: iconHeight,
                icon: icon,
                width: iconWidth
              }, data);
              
              layerConfig.geometries.push(marker);
              NPMap.Map.addShape(marker);
            }
            
            if (layerConfig.icon) {
              if (layerConfig.icon === 'default') {
                callback();
              } else {
                var image = document.createElement('img');
                
                if (typeof layerConfig.icon === 'string') {
                  icon = layerConfig.icon;
                } else {
                  icon = layerConfig.icon(data);
                }
                
                image.onload = function() {
                  iconHeight = image.height;
                  iconWidth = image.width;
                  callback();
                };
                image.src = icon;
              }
            } else if (style && style.icon) {
              var image = document.createElement('img');
              
              image.onload = function() {
                icon = style.icon;
                iconHeight = image.height;
                iconWidth = image.width;
                
                callback();
              };
              image.src = style.icon;
            } else {
              callback();
            }
          } else if ($(this).find('LineString').length > 0) {
            var callback = function() {
                  var line,
                      objStyle = {};
                  
                  if (strokeColor) {
                    var colors = hexToRgb(strokeColor);
                      
                    objStyle.strokeColor = new Microsoft.Maps.Color(parseInt(strokeOpacity), colors[0], colors[1], colors[2]);
                  }

                  if (strokeThickness) {
                    objStyle.strokeThickness = strokeThickness;
                  }
                  
                  line = NPMap.bing.map.createLine(locations, objStyle, buildDataObject(layerConfig, me, extendedData));
                  
                  layerConfig.geometries.push(line);
                  NPMap.Map.addShape(line);
                },
                coordinates = $(this).find('LineString').find('coordinates').text(),
                locations = [],
                me = this,
                split = ' ',
                strokeColor = '#000000',
                strokeOpacity = 255,
                strokeThickness = 3;

            if (coordinates.indexOf('\n') >= 0) {
              split = '\n';
            }
            
            $.each(coordinates.split(split), function(i, v) {
              var coordinate = v.split(',');

              if (coordinate.length > 1) {
                locations.push(new Microsoft.Maps.Location(parseFloat(coordinate[1].replace(/ /g,'')), parseFloat(coordinate[0].replace(/ /g,''))));
              }
            });
            
            if (layerConfig.line) {
              if (layerConfig.line === 'default') {
                callback();
              } else {
                var line;
                
                if (typeof(layerConfig.polygon) === 'function') {
                  line = layerConfig.line(); // TODO: Pass data in here.
                } else {
                  line = layerConfig.line;
                }
                
                strokeColor = line.color || '#000000';
                strokeOpacity = line.opacity || 255;
                strokeThickness = line.width || 2;
                
                callback();
              }
            } else if (style && style.line) {
              // TODO: Test this.
              if (style.line.color) {
                strokeColor = style.line.color;
              }

              if (style.line.width) {
                strokeThickness = style.line.width;
              }

              callback();
            } else {
              callback();
            }
          } else if ($(this).find('MultiGeometry').length > 0) {
            
          } else if ($(this).find('Polygon').length > 0) {
            var callback = function() {
                  var objStyle = {},
                      polygon;
                    
                  if (fillColor) {
                    var colors = hexToRgb(fillColor);

                    objStyle.fillColor = new Microsoft.Maps.Color(parseInt(fillOpacity), colors[0], colors[1], colors[2]);
                  }

                  if (strokeColor) {
                    var colors = hexToRgb(strokeColor);
                      
                    objStyle.strokeColor = new Microsoft.Maps.Color(parseInt(strokeOpacity), colors[0], colors[1], colors[2]);
                  }

                  if (strokeThickness) {
                    objStyle.strokeThickness = strokeThickness;
                  }

                  polygon = NPMap.bing.map.createPolygon(locations, objStyle, buildDataObject(layerConfig, me, extendedData));
                    
                  layerConfig.geometries.push(polygon);
                  NPMap.Map.addShape(polygon);
                },
                coordinates = $(this).find('Polygon').find('coordinates').text(),
                fillColor = null,
                fillOpacity = 255,
                locations = [],
                me = this,
                split = ' ',
                strokeColor = null,
                strokeOpacity = 255,
                strokeThickness = null;

            if (coordinates.indexOf('\n') >= 0) {
              split = '\n';
            }

            $.each(coordinates.split(split), function(i, v) {
              var coordinate = v.split(',');

              if (coordinate.length > 1) {
                locations.push(new Microsoft.Maps.Location(parseFloat(coordinate[1].replace(/ /g,'')), parseFloat(coordinate[0].replace(/ /g,''))));
              }
            });

            if (layerConfig.polygon) {
              if (layerConfig.polygon === 'default') {
                callback();
              } else {
                var polygon;
                
                if (typeof(layerConfig.polygon) === 'function') {
                  polygon = layerConfig.polygon(); // TODO: Pass data in here.
                } else {
                  polygon = layerConfig.polygon;
                }

                fillColor = polygon.fill;
                strokeColor = polygon.line;

                if (fillOpacity) {
                  fillOpacity = polygon.fillOpacity;
                }

                if (strokeOpacity) {
                  strokeOpacity = polygon.lineOpacity;
                }

                if (strokeThickness) {
                  strokeThickness = polygon.lineWidth;
                }

                callback();
              }
            } else if (style && style.poly) {
              if (style.line.color) {
                strokeColor = style.line.color;
              }

              if (style.line.width) {
                strokeThickness = style.line.width;
              }
                
              if (style.poly.color) {
                fillColor = style.poly.color;
              }

              callback();
            } else {
              callback();
            }
          }
        });
      };

      layerConfig.geometries = [];

      if (layerConfig.url.indexOf('http://') != -1 && layerConfig.url.indexOf(location.host) === -1) {
        $.getJSON('http://maps.nps.gov/proxy/kml?url=' + layerConfig.url + '&callback=?', function(js) {
          callback($.parseXML(js.d));
        });
      } else {
        $.ajax({
          dataType: 'xml',
          success: function(xml) {
            callback(xml);
          },
          type: 'GET',
          url: layerConfig.url
        });
      }
    },
    /**
     * Hides the KML layer.
     * @param {Object} The layer config object of the layer to hide.
     */
    hideLayer: function(layer) {
      $.each(layer.geometries, function(i, v) {
        v.setOptions({
          visible: false
        });
      });

      layer.visible = false;
    },
    // TODO: Implement this.
    removeLayer: function(layer) {
    
    },
    /**
     * Shows the KML layer.
     * @param {Object} The layer config object of the layer to hide.
     */
    showLayer: function(layer) {
      $.each(layer.geometries, function(i, v) {
        v.setOptions({
          visible: true
        });
      });

      layer.visible = true;
    }
  };
});