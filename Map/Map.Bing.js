/**
 * @module NPMap.Map.Bing
 *
 * The module for the Bing base API.
 */
define([
  'Event',
  'Map/Map',
  'Util/Util'
], function(Event, Map, Util) {
  var
      // The currently active baseLayer config.
      activeBaseLayer,
      // The default base layers for Bing.
      DEFAULT_BASE_LAYERS = {
        aerial: {
          cls: 'aerial',
          icon: 'aerial',
          mapTypeId: Microsoft.Maps.MapTypeId.birdseye,
          name: 'Aerial View',
          type: 'Api'
        },
        blank: {
          cls: 'blank',
          icon: 'blank',
          mapTypeId: Microsoft.Maps.MapTypeId.mercator,
          name: 'Blank View',
          type: 'Api'
        },
        hybrid: {
          cls: 'hybrid',
          icon: 'aerial',
          mapTypeId: Microsoft.Maps.MapTypeId.birdseye,
          name: 'Hybrid View',
          type: 'Api'
        },
        streets: {
          cls: 'streets',
          icon: 'street',
          mapTypeId: Microsoft.Maps.MapTypeId.road,
          name: 'Street View',
          type: 'Api'
        },
        terrain: {
          attribution: 'Esri',
          icon: 'topo',
          name: 'Terrain View',
          tiled: true,
          type: 'ArcGisServerRest',
          url: 'http://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer'
        }
      },
      // Has the map been double-clicked?
      doubleClicked = false,
      // Is there at least one clustered layer in the map?
      hasClustered = NPMap.Map.hasClusteredLayer(),
      // Is there at least one tiled layer in the map?
      hasTiled = NPMap.Map.hasTiledLayer(),
      // The initial center lat/lng of the map.
      initialCenter,
      // The initial zoom of the map.
      initialZoom,
      //
      labelOverlay = Microsoft.Maps.LabelOverlay.visible,
      // The last baseLayer of the map.
      lastBaseLayer,
      // The last center latLng of the map.
      lastCenter,
      // The last zoom level of the map.
      lastZoom,
      // The map object.
      map,
      // The mapTypeId to initialize the map with.
      mapTypeId,
      // The max zoom level to initialize the map with.
      max = 20,
      // The min zoom level to initialize the map with.
      min = 0,
      // Is the left mouse button currently being pressed?
      mouseDown = false,
      // The old cursor.
      oldCursor,
      // The old icon used for the last marker that the mouse moved over.
      oldIcon = null,
      // The old "target" that the mouse moved over.
      oldTarget = null,
      //
      panStartReported = false,
      // Has the map view changed?
      viewChanged = false,
      //
      zoomStartReported = false;

  /**
   * Checks to see if the map is currently zoomed in further out/in than it is supposed to and repositions it, if needed.
   * @return null
   */
  function checkMaxMinZoom() {
    var range = map.getZoomRange(),
        max = range.max,
        min = range.min;
    
    if (map.getZoom() < min) {
      map.setView({
        animate: false,
        center: lastCenter,
        zoom: min
      });
    } else if (map.getZoom() > max && map.getMapTypeId() != 'be') {
      map.setView({
        animate: false,
        center: lastCenter,
        zoom: max
      });
    }
  }
  /**
   * Gets an entity for a layer.
   * @param {Object} layer
   * @return {Object}
   */
  function _getEntity(layer) {
    return map.entities.get(map.entities.indexOf(layer));
  }
  /**
   * Updates the Bing copyright text.
   * @return null
   */
  function _updateBingCopyright() {
    map.getCopyrights(function(a) {
      var attribution = [];
      
      _.each(a, function(v, i) {
        if (!_.isArray(v)) {
          attribution.push(v);
        } else {
          _.each(v, function(v2, i2) {
            attribution.push(v2);
          });
        }
      });

      activeBaseLayer.attribution = attribution;

      Map.updateAttribution();
    });
  }

  if (NPMap.config.baseLayers) {
    Map._matchBaseLayers(DEFAULT_BASE_LAYERS);

    for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
      var baseLayer = NPMap.config.baseLayers[i];

      if (baseLayer.visible) {
        activeBaseLayer = baseLayer;

        if (baseLayer.type === 'Api') {
          if (baseLayer.cls === 'aerial') {
            labelOverlay = Microsoft.Maps.LabelOverlay.hidden;
          }

          mapTypeId = baseLayer.mapTypeId;
        } else {
          mapTypeId = Microsoft.Maps.MapTypeId.mercator;
        }

        break;
      }
    }
  } else if (typeof NPMap.config.baseLayers === 'undefined') {
    mapTypeId = Microsoft.Maps.MapTypeId.road;
    NPMap.config.baseLayers = [
      DEFAULT_BASE_LAYERS['streets']
    ];
    NPMap.config.baseLayers[0].visible = true;
    activeBaseLayer = NPMap.config.baseLayers[0];
  } else {
    mapTypeId = Microsoft.Maps.MapTypeId.mercator;
    NPMap.config.baseLayers = [
      DEFAULT_BASE_LAYERS['blank']
    ];
    NPMap.config.baseLayers[0].visible = true;
    activeBaseLayer = NPMap.config.baseLayers[0];
  }
  
  map = new Microsoft.Maps.Map(document.getElementById(NPMap.config.div), {
    center: NPMap.config.center ? new Microsoft.Maps.Location(NPMap.config.center.lat, NPMap.config.center.lng) : new Microsoft.Maps.Location(39, -96),
    credentials: NPMap.config.credentials ? NPMap.config.credentials : 'Ag4-2f0g7bcmcVgKeNYvH_byJpiPQSx4F9l0aQaz9pDYMORbeBFZ0N3C3A5LSf65',
    disableKeyboardInput: NPMap.config.tools && !NPMap.config.tools.keyboard ? true : false,
    labelOverlay: labelOverlay,
    mapTypeId: mapTypeId,
    showCopyright: false,
    showDashboard: false,
    showLogo: false,
    showScalebar: false,
    zoom: NPMap.config.zoom || 4
  });
  initialCenter = lastCenter = map.getCenter();
  initialZoom = lastZoom = map.getZoom();

  NPMap.Event.trigger('NPMap.Map', 'baselayerchanged');

  if (NPMap.config.zoomRange) {
    if (NPMap.config.zoomRange.max) {
      if (NPMap.config.zoomRange.max === 'auto') {
        max = map.getZoom();
      } else {
        max = NPMap.config.zoomRange.max;
      }
    }

    if (NPMap.config.zoomRange.min) {
      if (NPMap.config.zoomRange.min === 'auto') {
        min = map.getZoom();
      } else {
        min = NPMap.config.zoomRange.min;
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
    var cloned = _.clone(e.originalEvent);

    cloned.pageX = e.pageX;
    cloned.pageY = e.pageY;
    doubleClicked = false;

    setTimeout(function() {
      if (!doubleClicked && !viewChanged && e.isPrimary === true) {
        if (e.targetType === 'map' || e.target.allowClickThrow === true) {
          Event.trigger('NPMap.Map', 'click', cloned);
        } else {
          if (e.target.clickHandler) {
            e.target.clickHandler(e.target);
          }

          Event.trigger('NPMap.Map', 'shapeclick', e);
        }
      }
    }, 350);
  });
  Microsoft.Maps.Events.addHandler(map, 'dblclick', function(e) {
    doubleClicked = true;

    Event.trigger('NPMap.Map', 'dblclick', e.originalEvent);
  });
  Microsoft.Maps.Events.addHandler(map, 'mousedown', function(e) {
    mouseDown = true;
    viewChanged = false;

    Event.trigger('NPMap.Map', 'mousedown', e.originalEvent);

    if (e.originalEvent.shiftKey) {
      e.handled = true;
    }

    if (e.targetType !== 'map' && e.target && !e.target.allowClickThrough) {
      Map.setCursor('pointer');
    }
  });
  Microsoft.Maps.Events.addHandler(map, 'mousemove', function(e) {
    if (!mouseDown) {
      Map.setCursor('url(http://ecn.dev.virtualearth.net/mapcontrol/v7.0/7.0.20121119165209.01/cursors/grab.cur) 10 9, move');

      if (oldIcon && oldTarget) {
        oldTarget.setOptions({
          icon: oldIcon
        });
        
        oldIcon = null;
        oldTarget = null;
      }

      if (e.targetType !== 'map' && e.target && !e.target.allowClickThrough) {
        Map.setCursor('pointer');
        
        /*
        // TODO: Trigger hover.
        // TODO: Migrate this into e.target.npmap object.
        if (e.target.data && e.target.data.overIcon) {
          oldIcon = e.target.getIcon();
          oldTarget = e.target;

          if (oldIcon !== e.target.data.overIcon) {
            e.target.setOptions({
              icon: e.target.data.overIcon
            });
          }
        }
        */
      }
    }

    Event.trigger('NPMap.Map', 'mousemove', e.originalEvent);

    return false;
  });
  Microsoft.Maps.Events.addHandler(map, 'mouseout', function(e) {
    Event.trigger('NPMap.Map', 'mouseout', e.originalEvent);
  });
  Microsoft.Maps.Events.addHandler(map, 'mouseover', function(e) {
    Event.trigger('NPMap.Map', 'mouseover', e.originalEvent);
  });
  Microsoft.Maps.Events.addHandler(map, 'mouseup', function(e) {
    mouseDown = false;

    if (e.targetType !== 'map' && e.target && !e.target.allowClickThrough) {
      Map.setCursor('pointer');
    }

    Event.trigger('NPMap.Map', 'mouseup', e.originalEvent);
  });
  Microsoft.Maps.Events.addHandler(map, 'rightclick', function(e) {
    Event.trigger('NPMap.Map', 'rightclick', e.originalEvent);

    e.handled = true;
  });
  Microsoft.Maps.Events.addHandler(map, 'viewchange', function() {
    var bounds =  map.getBounds(),
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

    if ((map.getZoom() === lastZoom) && !NPMap.Map.latLngsAreEqual(NPMap.Map.latLngFromApi(lastCenter), NPMap.Map.latLngFromApi(map.getCenter()))) {
      if (!panStartReported) {
        Event.trigger('NPMap.Map', 'panstart');

        panStartReported = true;
      }

      Event.trigger('NPMap.Map', 'panning');
    }

    if (map.getZoom() !== lastZoom) {
      if (!zoomStartReported) {
        Event.trigger('NPMap.Map', 'zoomstart');

        zoomStartReported = true;
      }
      
      Event.trigger('NPMap.Map', 'zooming');
    }

    viewChanged = true;
    
    checkMaxMinZoom();
    Event.trigger('NPMap.Map', 'viewchanging');
  });
  Microsoft.Maps.Events.addHandler(map, 'viewchangeend', function() {
    if (map.getZoom() !== lastZoom) {
      Event.trigger('NPMap.Map', 'zoomend');
    } else if (!NPMap.Map.latLngsAreEqual(NPMap.Map.latLngFromApi(lastCenter), NPMap.Map.latLngFromApi(map.getCenter()))) {
      Event.trigger('NPMap.Map', 'panend');
    }

    lastCenter = map.getCenter();
    lastZoom = map.getZoom();
    panStartReported = false;
    zoomStartReported = false;

    if (activeBaseLayer.type === 'Api') {
      _updateBingCopyright();
    }
    
    Event.trigger('NPMap.Map', 'viewchangeend');
  });
  Microsoft.Maps.Events.addHandler(map, 'viewchangestart', function() {
    lastCenter = map.getCenter();
    lastZoom = map.getZoom();
    viewChanged = true;
    
    checkMaxMinZoom();
    Event.trigger('NPMap.Map', 'viewchangestart');
  });
  Map._init();

  return NPMap.Map.Bing = {
    // The current attribution for the map {Array}.
    _attribution: null,
    // Is the map loaded and ready to be interacted with programatically.
    _isReady: true,
    /**
     * Adds a tile layer to the map.
     * @param {Object} options
     * @return {Object}
     */
    _addTileLayer: function(options) {
      var getSubdomain,
          tileLayer,
          uriConstructor;

      if (options.subdomains) {
        var currentSubdomain = 0;

        getSubdomain = function() {
          if (currentSubdomain + 1 === options.subdomains.length) {
            currentSubdomain = 0;
          } else {
            currentSubdomain++;
          }

          return options.subdomains[currentSubdomain];
        };
      }

      if (typeof options.constructor === 'string') {
        uriConstructor = function(tile) {
          return _.template(options.constructor)({
            s: typeof getSubdomain == 'function' ? getSubdomain() : null,
            x: tile.x,
            y: tile.y,
            z: tile.levelOfDetail
          });
        };
      } else {
        uriConstructor = function(tile) {
          var subdomain = null;

          if (getSubdomain) {
            subdomain = getSubdomain();
          }

          return options.constructor(tile.x, tile.y, tile.levelOfDetail, options.url ? options.url : null, subdomain);
        };
      }

      tileLayer = new Microsoft.Maps.TileLayer({
        mercator: new Microsoft.Maps.TileSource({
          uriConstructor: uriConstructor
        }),
        opacity: typeof options.opacity === 'number' ? options.opacity : 1,
        zIndex: typeof options.zIndex === 'number' ? options.zIndex : null
      });

      map.entities.push(tileLayer);

      return tileLayer;
    },
    /**
     * Hides a tile layer.
     * @param {Object} layer
     * @return null
     */
    _hideTileLayer: function(layer) {
      _getEntity(layer).setOptions({
        visible: false
      });
    },
    /**
     * Removes a tile layer from the map.
     * @param {Object} layer
     * @return null
     */
    _removeTileLayer: function(layer) {
      map.entities.removeAt(map.entities.indexOf(layer));
    },
    /**
     * Sets the base layer.
     * @param {Object} baseLayer
     * @return null
     */
    _setBaseLayer: function(baseLayer) {
      var api,
          cls = baseLayer.cls,
          mapTypeId;

      for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
        var bl = NPMap.config.baseLayers[i];

        if (bl.visible) {
          activeBaseLayer = bl;
        }

        bl.visible = false;
      }

      if (activeBaseLayer.type !== 'Api') {
        NPMap.Layer[activeBaseLayer.type]._remove(activeBaseLayer);
      }

      activeBaseLayer = baseLayer;

      if (cls) {
        cls = cls.toLowerCase();
      }

      api = DEFAULT_BASE_LAYERS[cls];

      if (api) {
        if (cls === 'aerial') {
          labelOverlay = Microsoft.Maps.LabelOverlay.hidden;
        } else {
          labelOverlay = Microsoft.Maps.LabelOverlay.visible;
        }

        if (api.mapTypeId) {
          mapTypeId = api.mapTypeId;
        } else {
          mapTypeId = Microsoft.Maps.MapTypeId.mercator;

          NPMap.Layer[baseLayer.type]._add(baseLayer);
        }
      } else {
        NPMap.Layer[baseLayer.type]._add(baseLayer);

        mapTypeId = Microsoft.Maps.MapTypeId.mercator;
      }

      map.setView({
        labelOverlay: labelOverlay,
        mapTypeId: mapTypeId
      });

      baseLayer.visible = true;

      NPMap.Event.trigger('NPMap.Map', 'baselayerchanged');

      if (api && api.mapTypeId) {
        _updateBingCopyright();
      }
    },
    /**
     * Shows a tile layer.
     * @param {Object} layer
     * @return null
     */
    _showTileLayer: function(layer) {
      _getEntity(layer).setOptions({
        visible: true
      });
    },
    
    // The {Microsoft.Maps.Map} object. This reference should be used to access any of the Bing Maps v7 functionality that can't be done through the NPMap.Map methods.
    map: map,
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map. This can be a Microsoft.Maps.Pushpin, Polygon, or Polyline object.
     * @return null
     */
    addShape: function(shape) {
      map.entities.push(shape);
    },
    /**
     * Converts an API bounds to a NPMap bounds.
     * @param {Object} bounds
     * @return {Object}
     */
    boundsFromApi: function(bounds) {
      return {
        e: bounds.getEast(),
        n: bounds.getNorth(),
        s: bounds.getSouth(),
        w: bounds.getWest()
      };
    },
    /**
     * Converts a NPMap bounds to an API bounds.
     * @param {Object}
     * @return {Object}
     */
    boundsToApi: function(bounds) {
      return Microsoft.Maps.LocationRect.fromEdges(bounds.n, bounds.w, bounds.s, bounds.e);
    },
    /**
     * Centers the map.
     * @param {Object} latLng
     * @return null
     */
    center: function(latLng) {
      map.setView({
        center: latLng
      });
    },
    /**
     * Centers then zooms the map.
     * @param {Object} latLng The {Microsoft.Maps.Location} to center the map on.
     * @param {Number} zoom The zoom level to zoom the map to.
     * @param {Function} callback (Optional) A callback function to call after the map has been centered and zoomed.
     * @return null
     */
    centerAndZoom: function(latLng, zoom, callback) {
      var currentLatLng = this.latLngFromApi(map.getCenter()),
          currentZoom = this.getZoom(),
          me = this;

      if (NPMap.Map.latLngsAreEqual(currentLatLng, this.latLngFromApi(latLng)) === true && (currentZoom === zoom)) {
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

        if (NPMap.InfoBox.visible) {
          var infoBoxLatLng = (function() {
                if (NPMap.InfoBox.marker) {
                  return NPMap.InfoBox.marker.getLocation();
                } else if (NPMap.InfoBox.latLng) {
                  return me.latLngToApi(NPMap.InfoBox.latLng);
                } else {
                  return null;
                }
              })(),
              pixel;

          if (infoBoxLatLng) {
            pixel = this.latLngToPixel(infoBoxLatLng);
            o.centerOffset = new Microsoft.Maps.Point(pixel.x, pixel.y);
          }
        }

        map.setView(o);
      }
    },
    /**
     * Converts NPMap line options to Bing Maps line options.
     * @param {Object} options
     * @return {Object}
     * Notes: Valid Bing Maps options: strokeColor (a (opacity), r, g, b), strokeDashArray, strokeThickness, visible
     */
    convertLineOptions: function(options) {
      var o = {};

      if (options.strokeColor) {
        var strokeColor = Util.hexToRgb(options.strokeColor),
            strokeOpacity = options.strokeOpacity || 255;

        o.strokeColor = new Microsoft.Maps.Color(strokeOpacity, strokeColor[0], strokeColor[1], strokeColor[2]);
      }
      
      if (options.strokeWidth) {
        o.strokeThickness = options.strokeWidth;
      }
      
      return o;
    },
    /**
     * Converts NPMap marker options to Bing Maps marker options.
     * @param {Object} options
     * @return {Object}
     * Notes: Valid Bing Maps options: anchor, draggable, height, icon, infobox, text, textOffset, typeName, visible, width, zIndex
     */
    convertMarkerOptions: function(options) {
      var o = {};

      if (options.height) {
        o.height = options.height;
      }

      if (options.url) {
        o.icon = options.url;
      }

      if (options.width) {
        o.width = options.width;
      }

      return o;
    },
    /**
     * Converts NPMap polygon options to Bing Maps polygon options.
     * @param {Object} options
     * @return {Object}
     * Notes: Valid Bing Maps options: fillColor (a (opacity), r, g, b), infobox, strokeColor (a (opacity), r, g, b), strokeDashArray, strokeThickness, visible
     */
    convertPolygonOptions: function(options) {
      var o = {};

      if (options.fillColor) {
        var fillColor = Util.hexToRgb(options.fillColor),
            fillOpacity = options.fillOpacity || 255;

        o.fillColor = new Microsoft.Maps.Color(fillOpacity, fillColor[0], fillColor[1], fillColor[2]);
      }

      if (options.strokeColor) {
        var strokeColor = Util.hexToRgb(options.strokeColor),
            strokeOpacity = options.strokeOpacity || 255;

        o.strokeColor = new Microsoft.Maps.Color(strokeOpacity, strokeColor[0], strokeColor[1], strokeColor[2]);
      }
      
      if (options.strokeWidth) {
        o.strokeThickness = options.strokeWidth;
      }
      
      return o;
    },
    /**
     * Creates a Microsoft.Maps.Polyline object.
     * @param {Array} latLngs An array of {Microsoft.Maps.Location} objects.
     * @param {Microsoft.Maps.PolylineOptions} options (Optional) Any additional options to apply to the line.
     * @return {Microsoft.Maps.Polyline}
     */
    createLine: function(latLngs, options) {
      options = options || {};

      return new Microsoft.Maps.Polyline(latLngs, options);
    },
    /**
     * Creates a Microsoft.Maps.Pushpin object.
     * @param latLng {Microsoft.Maps.Location} (Required) Where to place the marker.
     * @param options {Microsoft.Maps.PushpinOptions} (Optional) Any additional options to apply to the marker.
     * @return {Object}
     */
    createMarker: function(latLng, options) {
      options = options || {};
      
      if (!options.anchor || !options.height || !options.width) {
        if (options.height && options.width) {
          options.anchor = new Microsoft.Maps.Point(options.width / 2, options.height / 2);
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

      return new Microsoft.Maps.Pushpin(latLng, options);
    },
    /**
     * Creates a Microsoft.Maps.Polygon object.
     * @param latLngs {Array} (Required) An array of Microsoft.Maps.Location objects.
     * @param options {Microsoft.Maps.PolygonOptions} (Optional) Any additional options to apply to the polygon.
     * @return {Object}
     */
    createPolygon: function(latLngs, options) {
      options = options || {};

      return new Microsoft.Maps.Polygon(latLngs, options);
    },
    /**
     * DEPRECATED
     */
    createTileLayer: function(constructor, options) {
      
    },
    /**
     * Gets a latLng from a click event object.
     * @param {Object} e
     * @return {Object}
     */
    eventGetLatLng: function(e) {
      var pixel = Util.getMousePositionPage(e);

      return this.pixelToLatLng(new Microsoft.Maps.Point(pixel.x, pixel.y), Microsoft.Maps.PixelReference.page);
    },
    /**
     * Gets a shape from a click event object.
     * @param {Object} e
     * @return {Object}
     */
    eventGetShape: function(e) {
      return e.target;
    },
    /**
     * Gets a default base layer, per type, for this base API.
     * @param {Object} baseLayer
     * @return {Object}
     */
    getBaseLayer: function(baseLayer) {
      var obj = DEFAULT_BASE_LAYERS[baseLayer.type.toLowerCase()];

      if (obj) {
        _.extend(obj, baseLayer);

        return obj;
      } else {
        return null;
      }
    },
    /**
     * Gets the current bounds of the map.
     * @return {Object}
     */
    getBounds: function() {
      return map.getBounds();
    },
    /**
     * Gets the center {Microsoft.Maps.Location} of the map.
     * @return {Object}
     */
    getCenter: function() {
      return map.getCenter();
    },
    /**
     * Gets the latLng (Microsoft.Maps.Location) of the npmap-clickdot div element.
     * @return {Object}
     */
    getClickDotLatLng: function() {
      return this.pixelToLatLng(this.getClickDotPixel());
    },
    /**
     * Returns the {Microsoft.Mas.Point} for the npmap-clickdot div.
     * @return {Object}
     */
    getClickDotPixel: function() {
      var offset = Util.getOffset(document.getElementById('npmap-map')),
          position = Util.getOffset(document.getElementById('npmap-clickdot'));

      return new Microsoft.Maps.Point(position.left - offset.left, position.top - offset.top);
    },
    /**
     * Gets the latLngs {Microsoft.Maps.Location} of the line.
     * @param {Object} line The line to get the latLngs for.
     * @return {Array}
     */
    getLineLatLngs: function(line) {
      return line.getLocations();
    },
    /**
     * Gets the map element.
     * @return {Object}
     */
    getMapElement: function() {
      return map.getRootElement();
    },
    /**
     * Gets the anchor of a marker.
     * @param {Object} The Pushpin to get the anchor for.
     * @return {Object}
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
     * @param {Object} marker
     * @return {Object}
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
     * @return {Object}
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
     * @return {Boolean}
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
     * Gets the latLngs {Microsoft.Maps.Location} of the polygon.
     * @param {Object} polygon The polygon to get the latLngs for.
     * @return {Array}
     */
    getPolygonLatLngs: function(polygon) {
      return polygon.getLocations();
    },
    /**
     * Gets the zoom level of the map.
     * @return {Number}
     */
    getZoom: function() {
      return Math.round(map.getZoom());
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     * @return null
     */
    handleResize: function() {
      var dimensions = Util.getOuterDimensions(document.getElementById(NPMap.config.div));

      map.setOptions({
        height: dimensions.height,
        width: dimensions.width
      });
    },
    /**
     * Hides a shape.
     * @param {Microsoft.Maps.Pushpin} or {Microsoft.Maps.Polygon} or {Microsoft.Maps.Polyline} shape The shape to hide.
     * @return null
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
      return this.getBounds().contains(latLng);
    },
    /**
     * Converts a {Microsoft.Maps.Location} object to an NPMap latLng object.
     * @param {Object} latLng
     * @return {Object}
     */
    latLngFromApi: function(latLng) {
      return {
        lat: latLng.latitude,
        lng: latLng.longitude
      };
    },
    /**
     * Converts a NPMap latLng object to a {Microsoft.Maps.Location} object.
     * @param {Object} latLng
     * @return {Object}
     */
    latLngToApi: function(latLng) {
      return new Microsoft.Maps.Location(parseFloat(latLng.lat), parseFloat(latLng.lng));
    },
    /**
     * Converts a {Microsoft.Maps.Location} to a {Microsoft.Maps.Point}.
     * @param {Microsoft.Maps.Location} pixel
     * @param {Microsoft.Maps.PixelReference} reference (Optional)
     * @return {Microsoft.Maps.Point}
     */
    latLngToPixel: function(latLng, reference) {
      reference = reference || Microsoft.Maps.PixelReference.viewport;

      return map.tryLocationToPixel(latLng, reference);
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     * @param {Function} callback (Optional)
     */
    panByPixels: function(pixels, callback) {
      map.setView({
        center: map.getCenter(),
        centerOffset: new Microsoft.Maps.Point(pixels.x, pixels.y)
      });
      
      if (callback) {
        var handlerId = Microsoft.Maps.Events.addHandler(map, 'viewchangeend', function() {
          Microsoft.Maps.Events.removeHandler(handlerId);
          callback();
        });
      }
    },
    /**
     * Turns an API pixel object to a NPMap pixel object.
     * @param {Object} pixel
     * @return {Object}
     */
    pixelFromApi: function(pixel) {
      return {
        x: pixel.x,
        y: pixel.y
      };
    },
    /**
     * Turns a NPMap pixel object to an API pixel object.
     * @param {Object} pixel
     * @return {Object}
     */
    pixelToApi: function(pixel) {
      return new Microsoft.Maps.Point(pixel.x, pixel.y);
    },
    /**
     * Converts a {Microsoft.Maps.Point} to a {Microsoft.Maps.Location}.
     * @param {Object} pixel
     * @param {Object} reference (Optional) The {Microsoft.Maps.PixelReference} to use.
     * @return {Microsoft.Maps.Location}
     */
    pixelToLatLng: function(pixel, reference) {
      reference = reference || Microsoft.Maps.PixelReference.control;

      return map.tryPixelToLocation(pixel, reference);
    },
    /**
     * Positions the npmap-clickdot div on top of the pushpin, lat/lng object, or lat/lng string that is passed in.
     * @param {Microsoft.Maps.Pushpin} OR {Microsoft.Maps.Location} OR {String} to The Pushpin, Location, or latitude/longitude string to position the div onto.
     * @return null
     */
    positionClickDot: function(to) {
      var anchorY = 0,
          divClickDot = document.getElementById('npmap-clickdot'),
          me = this,
          pixel = this.latLngToPixel((function() {
            var latLng = null;

            if (to.lat) {
              latLng = new Microsoft.Maps.Location(to.lat, to.lng);
            } else if (to.latitude) {
              latLng = to;
            } else {
              anchorY = me.getMarkerAnchor(to).y;
              latLng = to.getLocation();
            }

            return latLng;
          })(), Microsoft.Maps.PixelReference.control);

      divClickDot.style.left = pixel.x + 'px';
      divClickDot.style.top = pixel.y - anchorY + 'px';
    },
    /**
     * Removes a shape from the map.
     * @param {Object} shape
     * @return null
     */
    removeShape: function(shape) {
      map.entities.removeAt(map.entities.indexOf(shape));
    },
    /**
     * DEPRECATED: Sets the marker's icon.
     * @param {Object} marker
     * @param {String} The url of the marker icon.
     * @return null
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
     * @return null
     */
    setMarkerOptions: function(marker, options) {
      var valid = {};

      _.each(options, function(v, i) {
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
     * @return null
     */
    showShape: function(shape) {
      if (shape.getVisible() === false) {
        shape.setOptions({
          visible: true
        });
      }
    },
    /**
     * Zooms the map to a bounding box.
     * @param {Object} bbox A bbox object with nw and se {Microsoft.Maps.Location} objects.
     * @return null
     */
    toBounds: function(bounds) {
      map.setView({
        bounds: bounds,
        padding: 30
      });
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     * @return null
     */
    toInitialExtent: function() {
      NPMap.InfoBox.hide();
      map.setView({
        center: initialCenter,
        zoom: initialZoom
      });
    },
    /**
     * Zooms the map to the extent of an array of lat/lng objects.
     * @param {Array} latLngs The array of lat/lng objects.
     * @return null
     */
    toLatLngs: function(latLngs) {
      this.toBounds(Microsoft.Maps.LocationRect.fromLocations(latLngs));
    },
    /**
     * Zooms the map to the extent of an array of {Microsoft.Map.Pushpin} objects.
     * @param {Array} markers The array of marker objects.
     * @return null
     */
    toMarkers: function(markers) {
      var latLngs = [],
          me = this;

      for (var i = 0; i < markers.length; i++) {
        latLngs.push(me.getMarkerLatLng(markers[i]));
      }

      this.toLatLngs(latLngs);
    },
    /**
     * Triggers an event using the Microsoft.Maps.Events class.
     * @param {String} target Currently the only valid target is 'map'.
     * @return null
     */
    triggerEvent: function(target, name, e) {
      if (target === 'map') {
        e.targetType = 'map';
        target = map;
      }
      
      Microsoft.Maps.Events.invoke(target, name, e);
    },
    /**
     * Zooms the map to a zoom level.
     * @param {Number} zoom
     * @return null
     */
    zoom: function(zoom) {
      map.setView({
        zoom: zoom
      });
    },
    /**
     * Zooms the map in by one zoom level.
     * @param toDot {Boolean} (Optional) If true, center and zoom will be called. Center is based on the location of the npmap-clickdot div.
     * @return null
     */
    zoomIn: function(toDot) {
      var zoom = map.getZoom();
      
      if (toDot) {
        var position = Util.getOffset(document.getElementById('npmap-clickdot')),
            latLng = this.pixelToLatLng(new Microsoft.Maps.Point(position.left, position.top), Microsoft.Maps.PixelReference.viewport);

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
     * @return null
     */
    zoomOut: function() {
      map.setView({
        zoom: map.getZoom() - 1
      });
    }
  };
});