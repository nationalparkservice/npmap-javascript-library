define([
  NPMap.config.server + '/Map/Map.js'
], function(core) {
  var
      // The activeBaseLayer object.
      activeBaseLayer,
      // The bounds to initialize the map with.
      bounds = [
        '29.713 -111',
        '46.82 -79'
      ],
      // Is there at least one clustered layer in the map?
      clustered = NPMap.Map.hasClusteredLayer(),
      // An array of the default base layers for the Bing baseAPI.
      defaultBaseLayers = [{
        code: 'aerial',
        type: 'Aerial'
      },{
        code: 'auto',
        type: 'Generic'
      },{
        code: 'birdseye',
        type: 'Generic'
      },{
        code: 'mercator',
        type: 'Generic'
      },{
        code: 'road',
        type: 'Street'
      }],
      // Has the map been double-clicked?
      doubleClicked = false,
      // The initial center lat/lng of the map.
      initialCenter,
      // The initial zoom of the map.
      initialZoom,
      // The map object.
      map,
      // The mapTypeId to initialize the map with.
      mapTypeId,
      // The max zoom level to initialize the map with.
      max = 20,
      // The min zoom level to initialize the map with.
      min = 0,
      // The old center latLng of the map.
      oldCenter,
      // The old cursor.
      oldCursor,
      // The old icon used for the last marker that the mouse moved over.
      oldIcon = null,
      // The old "target" that the mouse moved over.
      oldTarget = null,
      // The old zoom level of the map.
      oldZoom,
      // Is there at least one tiled layer in the map?
      tiled = NPMap.Map.hasTiledLayer(),
      // The type of bounds config to initialize the map with.
      use = 'bbox',
      // Has the map view changed?
      viewChanged = false;

  /**
   * Changes the cursor style on the map.
   * @param {String} cursor
   */
  function changeMapCursor(cursor) {
    var $el = $(map.getRootElement());
    
    $el.attr('style', $el.attr('style').replace(/cursor:[^;]+/g, ''));
    
    document.getElementById(NPMap.config.div).childNodes[0].style.cursor = cursor;
  }
  /**
   * Checks to see if the map is currently zoomed in further out/in than it is supposed to and repositions it, if needed.
   */
  function checkMaxMinZoom() {
    var range = map.getZoomRange(),
        max = range.max,
        min = range.min;
    
    if (map.getZoom() < min) {
      map.setView({
        animate: false,
        center: oldCenter,
        zoom: min
      });
    } else if (map.getZoom() > max && map.getMapTypeId() != 'be') {
      map.setView({
        animate: false,
        center: oldCenter,
        zoom: max
      });
    }
  }
  
  if (NPMap.config.center && NPMap.config.zoom) {
    use = 'centerAndZoom';
  }
  
  if (NPMap.config.baseLayers) {
    for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
      if (NPMap.config.baseLayers[i].visible) {
        activeBaseLayer = NPMap.config.baseLayers[i];
        break;
      }
    }
  }

  if (!activeBaseLayer) {
    activeBaseLayer = {
      code: 'auto',
      visible: true
    };
    
    NPMap.config.baseLayers = [
      activeBaseLayer
    ];
  }

  if (activeBaseLayer.code === 'aerial' || activeBaseLayer.code === 'auto' || activeBaseLayer.code === 'birdseye' || activeBaseLayer.code === 'mercator' || activeBaseLayer.code === 'road') {
    mapTypeId = Microsoft.Maps.MapTypeId[activeBaseLayer.code];
  } else {
    if (!activeBaseLayer.zIndex) {
      activeBaseLayer.zIndex = 0;
    }

    NPMap.utils.safeLoad('NPMap.bing.layers.' + activeBaseLayer.type, function() {
      NPMap.bing.layers[activeBaseLayer.type].addLayer(activeBaseLayer);
    });

    mapTypeId = Microsoft.Maps.MapTypeId.mercator;
  }
  
  map = new Microsoft.Maps.Map(document.getElementById(NPMap.config.div), {
    bounds: use === 'bbox' ? Microsoft.Maps.LocationRect.fromCorners(new Microsoft.Maps.Location(parseFloat(bounds[0].split(' ')[0]), parseFloat(bounds[0].split(' ')[1])), new Microsoft.Maps.Location(parseFloat(bounds[1].split(' ')[0]), parseFloat(bounds[1].split(' ')[1]))) : null,
    center: use === 'centerAndZoom' ? new Microsoft.Maps.Location(NPMap.config.center.lat, NPMap.config.center.lng) : null,
    credentials: NPMap.config.credentials ? NPMap.config.credentials : 'AqZQwVLETcXEgQET2dUEQIFcN0kDsUrbY8sRKXQE6dTkhCDw9v8H_CY8XRfZddZm',
    disableKeyboardInput: NPMap.config.tools && !NPMap.config.tools.keyboard ? true : false,
    mapTypeId: mapTypeId,
    showCopyright: false,
    showDashboard: false,
    showLogo: false,
    showScalebar: false,
    zoom: use === 'centerAndZoom' ? NPMap.config.zoom : null
  });
  initialCenter = map.getCenter();
  initialZoom = map.getZoom();
  
  if (NPMap.config.restrictZoom) {
    if (NPMap.config.restrictZoom.max) {
      if (NPMap.config.restrictZoom.max === 'auto') {
        max = map.getZoom();
      } else {
        max = NPMap.config.restrictZoom.max;
      }
    }

    if (NPMap.config.restrictZoom.min) {
      if (NPMap.config.restrictZoom.min === 'auto') {
        min = map.getZoom();
      } else {
        min = NPMap.config.restrictZoom.min;
      }

      if (min < 3) {
        min = 3;
      }
    }
  }

  map.getZoomRange = function() {
    return {
      max: max,
      min: min
    };
  };
  
  Microsoft.Maps.Events.addHandler(map, 'click', function(e) {
    changeMapCursor(oldCursor);
    
    doubleClicked = false;
    
    setTimeout(function() {
      if (!doubleClicked && !viewChanged && e.isPrimary === true) {
        if (e.targetType === 'map' || e.target.allowClickThrough === true) {
          NPMap.Event.trigger('NPMap.Map', 'click', e);
        } else {
          if (e.target.clickHandler) {
            e.target.clickHandler(e.target);
          }
          
          NPMap.Event.trigger('NPMap.Map', 'layerclick', e);
        }
      }
    }, 350);
  });
  Microsoft.Maps.Events.addHandler(map, 'dblclick', function(e) {
    changeMapCursor(oldCursor);
    
    doubleClicked = true;
  });
  Microsoft.Maps.Events.addHandler(map, 'mousedown', function(e) {
    changeMapCursor(oldCursor);
    
    viewChanged = false;
  });
  Microsoft.Maps.Events.addHandler(map, 'mousemove', function(e) {
    changeMapCursor('move');
    
    if (oldIcon && oldTarget) {
      oldTarget.setOptions({
        icon: oldIcon
      });
      
      oldIcon = null;
      oldTarget = null;
    }

    if (e.targetType !== 'map' && e.target && !e.target.allowClickThrough) {
      changeMapCursor('pointer');
      
      if (e.target.data && e.target.data.overIcon) {
        oldIcon = e.target.getIcon();
        oldTarget = e.target;

        if (oldIcon !== e.target.data.overIcon) {
          e.target.setOptions({
            icon: e.target.data.overIcon
          });
        }
      }
    }

    oldCursor = map.getRootElement().style.cursor;

    return false;
  });
  Microsoft.Maps.Events.addHandler(map, 'mouseup', function(e) {
    changeMapCursor(oldCursor);
  });
  Microsoft.Maps.Events.addHandler(map, 'viewchange', function() {
    var bounds = NPMap.bing.map.Map.getBounds(),
        inEasternOrWesternHemisphere = function(lng) {
          if (lng < 0) {
            return 'western';
          } else {
            return 'eastern';
          }
        },
        nw = bounds.getNorthwest(),
        nwHemisphere = inEasternOrWesternHemisphere(nw.longitude),
        se = bounds.getSoutheast(),
        seHemisphere = inEasternOrWesternHemisphere(se.longitude);

    viewChanged = true;
    
    if (NPMap.InfoBox.visible) {
      if (clustered === true || tiled === true) {
        var zoom = map.getZoom(),
            zoomRange = map.getZoomRange();
          
        if (zoom > zoomRange.min && zoom < zoomRange.max && zoom != oldZoom) {
          NPMap.InfoBox.hide();
        } else if (NPMap.Map.latLngsAreEqual(NPMap.bing.map.latLngToString(map.getCenter()), NPMap.bing.map.latLngToString(oldCenter)) === false) {
          if (tiled) {
            NPMap.InfoBox.reposition();
          } else {
            NPMap.InfoBox.hide();
          }
        }
      } else {
        NPMap.InfoBox.reposition();
      }
    }
    
    checkMaxMinZoom();
  });
  Microsoft.Maps.Events.addHandler(map, 'viewchangeend', function(e) {
    if (map.getZoom() != oldZoom) {
      NPMap.Event.trigger('NPMap.Map', 'zoomchanged', e);
    }
    
    oldCenter = map.getCenter();
    oldZoom = map.getZoom();
    
    map.getCopyrights(function(a) {
      var attribution = '';
      
      $.each(a, function(i, v) {
        if ($.isArray(v) === false) {
          attribution += v + '|';
        } else {
          $.each(v, function(i2, v2) {
            attribution += v2 + '|';
          });
        }
      });
      NPMap.Map.setAttribution(NPMap.Map.buildAttributionStringForVisibleLayers(attribution.slice(0, attribution.length - 1)));
    });
    
    NPMap.Event.trigger('NPMap.Map', 'viewchangeend', e);
  });
  Microsoft.Maps.Events.addHandler(map, 'viewchangestart', function() {
    viewChanged = true;
    
    checkMaxMinZoom();
  });
  
  core.init();
  changeMapCursor('move');

  NPMap.bing = NPMap.bing || {};

  return NPMap.bing.map = {
    /**
     * Adds a base layer to the map.
     * @param baseLayer An object with code, name, and visible properties.
     */
    addBaseLayer: function(baseLayer) {
      
    },
    /**
     * Adds an HTML element to the map div.
     * @param {Object} el
     */
    addElementToMapDiv: function(el) {
      this.getMapDiv().appendChild(el);
    },
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map. This can be a Microsoft.Maps.Pushpin, Polygon, or Polyline object.
     */
    addShape: function(shape) {
      map.entities.push(shape);
    },
    /**
     * Centers the map.
     * @param {Object} latLng
     */
    center: function(latLng) {
      map.setView({
        center: latLng
      });
    },
    /**
     * Centers then zooms the map.
     * @param {Microsoft.Maps.Location} latLng The latLng to center the map on.
     * @param {Integer} zoom The zoom level to zoom the map to.
     * @param {Function} callback (Optional) A callback function to call after the map has been centered and zoomed.
     */
    centerAndZoom: function(latLng, zoom, callback) {
      var currentLatLng = this.latLngToString(map.getCenter()),
          currentZoom = map.getZoom();

      if (NPMap.Map.latLngsAreEqual(currentLatLng, this.latLngToString(latLng)) === true && currentZoom === zoom) {
        if (callback) {
          callback();
        }
      } else {
        var handlerId = Microsoft.Maps.Events.addThrottledHandler(map, 'viewchangeend', function() {
              Microsoft.Maps.Events.removeHandler(handlerId);
          
              if (callback) {
                callback();
              }
            }, 200),
            o = {
              center: latLng,
              zoom: parseInt(zoom, 0)
            };
            
        if (NPMap.InfoBox && NPMap.InfoBox.visible) {
          var infoBoxLatLng = (function() {
                if (NPMap.InfoBox.marker) {
                  return NPMap.InfoBox.marker.getLocation();
                } else if (NPMap.InfoBox.latLng) {
                  return NPMap.bing.map.stringToLatLng(NPMap.InfoBox.latLng);
                } else {
                  return null;
                }
              })(),
              pixel;

          if (infoBoxLatLng) {
            pixel = map.tryLocationToPixel(infoBoxLatLng);
            o.centerOffset = new Microsoft.Maps.Point(pixel.x, pixel.y);
          }
        }
        
        map.setView(o);
      }
    },
    /**
     * Creates a Microsoft.Maps.Polyline object.
     * @param {Array} latLngs An array of {Microsoft.Maps.Location} objects.
     * @param {Microsoft.Maps.PolylineOptions} options (Optional) Any additional options to apply to the line.
     * @param {Object} data (Optional) An object with key/value pairs of information that need to be stored with the marker. This object will be added to the line.data property.
     * @param {Function} clickHandler (Optional) A function to call when the marker is clicked.
     * @return {Microsoft.Maps.Polyline}
     */
    createLine: function(latLngs, options, data, clickHandler) {
      var line;
      
      options = options || {};
      
      line = new Microsoft.Maps.Polyline(latLngs, options);
      
      line.data = data || {};
      
      if (clickHandler) {
        line.clickHandler = clickHandler;
      }
      
      return line;
    },
    /**
     * Creates a Microsoft.Maps.Pushpin object.
     * @param latLng {Microsoft.Maps.Location} (Required) Where to place the marker.
     * @param options {Microsoft.Maps.PushpinOptions} (Optional) Any additional options to apply to the marker.
     * @param data {Object} (Optional) An object with key/value pairs of information that need to be stored with the marker. This object will be added to the marker.data property.
     * @param {Function} clickHandler (Optional) A function to call when the marker is clicked.
     * @return {Microsoft.Maps.Pushpin}
     */
    createMarker: function(latLng, options, data, clickHandler) {
      var marker = null;

      options = options || {};

      if (!options.anchor || !options.height || !options.width) {
        if (options.height && options.width) {
          options.anchor = options.anchor = new Microsoft.Maps.Point(options.width / 2, options.height / 2);
        } else if (options.icon) {
          var image = new Image(),
              interval;

          image.src = options.icon;
          interval = setInterval(function() {
            if (image.height > 0 && image.width > 0) {
              var height = image.height,
                  width = image.width,
                  anchor = options.anchor || new Microsoft.Maps.Point(width / 2, height / 2);
              
              clearInterval(interval);
                  
              if (!marker) {
                options.anchor = anchor;
                options.height = height;
                options.width = width;
              } else {
                marker.setOptions({
                  anchor: anchor,
                  height: height,
                  width: width
                });
              }
            }
          }, 10);
        }
      }

      marker = new Microsoft.Maps.Pushpin(latLng, options);

      marker.data = data || {};
      
      if (clickHandler) {
        marker.clickHandler = clickHandler;
      }

      return marker;
    },
    /**
     * Creates a Microsoft.Maps.Polygon object.
     * @param latLngs {Array} (Required) An array of Microsoft.Maps.Location objects.
     * @param options {Microsoft.Maps.PolygonOptions} (Optional) Any additional options to apply to the polygon.
     * @param data {Object} (Optional) An object with key/value pairs of information that need to be stored with the polygon. This object will be added to the polygon.data property.
     * @return {Microsoft.Maps.Polygon}
     */
    createPolygon: function(latLngs, options, data) {
      var polygon = new Microsoft.Maps.Polygon(latLngs, options);
      
      data = data || {};

      polygon.data = data;

      return polygon;
    },
    /**
     * Gets the center {Microsoft.Maps.Location} of the map.
     * @return {Microsoft.Maps.Location}
     */
    getCenter: function() {
      return map.getCenter();
    },
    /**
     * Gets the latLng (Microsoft.Maps.Location) of the #npmap-clickdot div element.
     * @return {Microsoft.Maps.Location}
     */
    getClickDotLatLng: function() {
      var position = $('#npmap-clickdot').position();
      
      return map.tryPixelToLocation(new Microsoft.Maps.Point(position.left, position.top), Microsoft.Maps.PixelReference.control);
    },
    /**
     * Gets the container div.
     */
    getContainerDiv: function() {
      return map.getRootElement();
    },
    /**
     * Gets a {Microsoft.Maps.Location} from a {Microsoft.Maps.Point}.
     * @param {Microsoft.Maps.Point} point
     * @return {Microsoft.Maps.Location}
     */
    getLatLngFromPixel: function(point) {
      
    },
    /**
     * Gets the anchor of a marker.
     * @param {Microsoft.Maps.Pushpin} (Required) The Pushpin to get the anchor for.
     * @return {Object} An object with x and y properties.
     */
    getMarkerAnchor: function(marker) {
      var anchor = marker.getAnchor();

      return {
        x: anchor.x,
        y: anchor.y
      };
    },
    /**
     * Gets the icon for a marker.
     */
    getMarkerIcon: function(marker) {
      return marker.getIcon();
    },
    /**
     * Gets the latLng (Microsoft.Maps.Location) of the marker.
     * @param {Object} marker The marker to get the latLng for.
     * @return {Object}
     */
    getMarkerLatLng: function(marker) {
      return marker.getLocation();
    },
    /**
     * Gets a marker option.
     * @param {Object} marker The marker object.
     * @param {String} option The option to get. Currently the valid options are: 'icon'.
     */
    getMarkerOption: function(marker, option) {
      if (option === 'icon') {
        return marker.getIcon();
      } else {
        return null;
      }
    },
    /**
     * Gets the visibility property of a marker.
     * @param {Object} marker The marker to check the visibility for.
     */
    getMarkerVisibility: function(marker) {
      return marker.getVisible();
    },
    /**
     * Gets the maximum zoom level for this map.
     * @return {Number}
     */
    getMaxZoom: function() {
      return max;
    },
    /**
     * Gets the minimum zoom level for this map.
     * @return {Number}
     */
    getMinZoom: function() {
      return min;
    },
    /**
     * Returns a {Microsoft.Maps.Point} object for a given latLng.
     * @param latLng {Microsoft.Maps.Location} (Required)
     */
    getPixelFromLatLng: function(latLng) {
      
    },
    /**
     * Gets the zoom level of the map.
     * @return {Float}
     */
    getZoom: function() {
      return Math.round(map.getZoom());
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     */
    handleResize: function() {
      var div = $('#' + NPMap.config.div);
            
      map.setOptions({
        height: div.outerHeight(),
        width: div.outerWidth()
      });
    },
    /**
     * Hides a shape.
     * @param {Microsoft.Maps.Pushpin} or {Microsoft.Maps.Polygon} or {Microsoft.Maps.Polyline} shape The shape to hide.
     */
    hideShape: function(shape) {
      if (shape.getVisible() === true) {
        shape.setOptions({
          visible: false
        });
      }
    },
    /**
     * Tests to see if a marker is within the map's current bounds.
     * @param latLng {Object/String} {Required} The latitude/longitude, either a Microsoft.Maps.Location object or a string in "latitude,longitude" format, to test.
     * @return {Boolean}
     */
    isLatLngWithinMapBounds: function(latLng) {
      if (typeof(latLng) === 'string') {
        latLng = NPMap.bing.map.stringToLatLng(latLng);
      }
      
      return map.getBounds().contains(latLng);
    },
    // Is the map loaded and ready to be interacted with programatically.
    isReady: true,
    /**
     * Converts a Bing Maps Location object to the NPMap representation of a latitude/longitude string.
     * @param latLng {Microsoft.Maps.Location} The Location object to convert to a string.
     * @return {String} A latitude/longitude string in "latitude,longitude" format.
     */
    latLngToString: function(latLng) {
      return latLng.latitude + ',' + latLng.longitude;
    },
    // The Microsoft.Maps.Map object. This reference should be used to access any of the Bing Maps v7 functionality that can't be done through NPMap's methods.
    Map: map,
    /**
     * Iterates through the default base layers and returns a match if it exists.
     * @param {Object} baseLayer The baseLayer object.
     * @return {Object}
     */
    matchBaseLayer: function(baseLayer) {
      for (var i = 0; i < defaultBaseLayers.length; i++) {
        if (defaultBaseLayers[i].code === baseLayer.code) {
          return defaultBaseLayers[i];
        }
      }
      
      return null;
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     */
    panByPixels: function(pixels) {
      map.setView({
        center: map.getCenter(),
        centerOffset: new Microsoft.Maps.Point(pixels.x, pixels.y)
      });
    },
    /**
     * Positions the #npmap-clickdot div on top of the pushpin, lat/lng object, or lat/lng string that is passed in.
     * @param {Microsoft.Maps.Pushpin} OR {Microsoft.Maps.Location} OR {String} to The Pushpin, Location, or latitude/longitude string to position the div onto.
     */
    positionClickDot: function(to) {
      var anchorY = 0,
          me = this,
          offset = NPMap.utils.getMapDivOffset(),
          pixel = NPMap.bing.map.Map.tryLocationToPixel((function() {
            var latLng = null;
            
            if (typeof(to) === 'string') {
              to = to.split(',');
              latLng = new Microsoft.Maps.Location(parseFloat(to[0]), parseFloat(to[1]));
            } else {
              if (to.latitude) {
                latLng = to;
              } else {
                anchorY = me.getMarkerAnchor(to).y;
                latLng = to.getLocation();
              }
            }

            return latLng;
          })(), Microsoft.Maps.PixelReference.page);
      
      $('#npmap-clickdot').hide().css({
        left: pixel.x - offset.left,
        top: pixel.y - offset.top - anchorY
      }).show();
    },
    /**
     * Removes a shape from the map.
     * @param {Object} shape
     */
    removeShape: function(shape) {
      map.entities.removeAt(map.entities.indexOf(shape));
    },
    /**
     * DEPRECATED: Sets the marker's icon.
     * @param {Object} marker
     * @param {String} The url of the marker icon.
     */
    setMarkerIcon: function(marker, url) {
      if (typeof(url) === 'function') {
        url = url(marker);
      }

      marker.setOptions({
        icon: url
      });
    },
    /**
     * Sets a marker's options.
     * @param {Microsoft.Maps.Pushpin} marker
     * @param {Object} options The options to set. Currently the valid options are: 'class', 'icon', 'label', 'visible', and 'zIndex'.
     */
    setMarkerOptions: function(marker, options) {
      var valid = {};

      $.each(options, function(i, v) {
        switch (i) {
          case 'class':
            valid.typeName = v;
            break;
          case 'icon':
            valid.icon = v;
            break;
          case 'label':
            valid.text = v;
            break;
          case 'visible':
            valid.visible = v;
            break;
          case 'zIndex':
            valid.zIndex = v;
            break;
        }
      });

      marker.setOptions(valid);
    },
    /**
     * Shows a shape.
     * @param {Microsoft.Maps.Pushpin} or {Microsoft.Maps.Polygon} or {Microsoft.Maps.Polyline} shape The shape to show.
     */
    showShape: function(shape) {
      if (shape.getVisible() === false) {
        shape.setOptions({
          visible: true
        });
      }
    },
    /**
     * Converts a lat/lng string ("latitude/longitude") to a {Microsoft.Maps.Location} object.
     * @param {String} latLng The lat/lng string.
     * @return {Object}
     */
    stringToLatLng: function(latLng) {
      latLng = latLng.split(',');
      return new Microsoft.Maps.Location(parseFloat(latLng[0]), parseFloat(latLng[1]));
    },
    /**
     * Switches the base map.
     * @param {Object} type The base layer to switch to. Currently only the default Bing Maps base maps are supported here.
     */
    switchBaseLayer: function(baseLayer) {
      var mapTypeId = null;
      
      switch (baseLayer.code) {
        case 'aerial':
          mapTypeId = Microsoft.Maps.MapTypeId.birdseye;
          break;
        case 'auto':
          mapTypeId = Microsoft.Maps.MapTypeId.auto;
          break;
        case 'birdseye':
          mapTypeId = Microsoft.Maps.MapTypeId.birdseye;
          break;
        case 'mercator':
          mapTypeId = Microsoft.Maps.MapTypeId.mercator;
          break;
        case 'road':
          mapTypeId = Microsoft.Maps.MapTypeId.road;
          break;
        default:
          mapTypeId = Microsoft.Maps.MapTypeId.mercator;
          // TODO: Now need to load tiled layer.
          break;
      }
      
      map.setMapType(mapTypeId);
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     */
    toInitialExtent: function() {
      NPMap.InfoBox.hide();
      map.setView({
        center: initialCenter,
        zoom: initialZoom
      });
    },
    /**
     * DEPRECATED: Updates a marker's icon.
     * @param {Microsoft.Maps.Pushpin} marker
     * @param {String} icon The url of the new icon.
     */
    updateMarkerIcon: function(marker, icon) {
      marker.setOptions({
        icon: icon
      });
    },
    /**
     * DEPRECATED: Updates a marker's label.
     * @param {Microsoft.Maps.Pushpin} marker
     * @param {String} label The new label string.
     */
    updateMarkerLabel: function(marker, label) {
      marker.setOptions({
        text: label
      });
    },
    /**
     * Zooms the map to a zoom level.
     * @param {Number} zoom
     */
    zoom: function(zoom) {
      map.setView({
        zoom: zoom
      });
    },
    /**
     * Zooms the map in by one zoom level.
     * @param toDot {Boolean} (Optional) If true, center and zoom will be called. Center is based on the location of the #npmap-clickdot div.
     */
    zoomIn: function(toDot) {
      var zoom = map.getZoom();
      
      if (toDot) {
        var position = $('#npmap-clickdot').position(),
            latLng = NPMap.bing.map.Map.tryPixelToLocation(new Microsoft.Maps.Point(position.left, position.top, Microsoft.Maps.PixelReference.control), Microsoft.Maps.PixelReference.control);
            
        map.setView({
          center: latLng,
          zoom: zoom + 1
        });
      } else {
        map.setView({
          zoom: zoom + 1
        });
      }
    },
    /**
     * Zooms the map out by one zoom level.
     */
    zoomOut: function() {
      map.setView({
        zoom: map.getZoom() - 1
      });
    },
    /**
     * Zooms the map to a bounding box.
     * @param {Object} bbox A bbox object with nw and se {Microsoft.Maps.Location} objects.
     */
    zoomToBoundingBox: function(bbox) {
      map.setView({
        bounds: Microsoft.Maps.LocationRect.fromCorners(bbox.nw, bbox.se),
        padding: 30
      });
    },
    /**
     * Zooms the map to a lat/lng.
     * @param {Object} latLng The {Microsoft.Maps.Location} object to zoom the map to.
     */
    zoomToLatLng: function(latLng) {
      this.centerAndZoom(latLng, 16);
    },
    /**
     * Zooms the map to the extent of an array of {Microsoft.Maps.Location} objects.
     * @param {Array} latLngs The array of lat/lng objects.
     */
    zoomToLatLngs: function(latLngs) {
      map.setView({
        bounds: Microsoft.Maps.LocationRect.fromLocations(latLngs),
        padding: 30
      });
    },
    /**
     * Zooms the map to the extent of an array of {Microsoft.Map.Pushpin} objects.
     * @param {Array} markers The array of marker objects.
     */
    zoomToMarkers: function(markers) {
      var latLngs = [],
          me = this;

      for (var i = 0; i < markers.length; i++) {
        latLngs.push(me.getMarkerLatLng(markers[i]));
      }

      this.zoomToLatLngs(latLngs);
    }
  };
});