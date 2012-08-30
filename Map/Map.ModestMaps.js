// TODO: You need to re-add support for full screen maps.
// TODO: Hook up attribution.
define([
  'Event',
  'Map/Map',
  'Util/Util'
], function(Event, Map, Util) {
  wax.mm=wax.mm||{};wax.mm.interaction=function(){function e(){h=!0}var h=!1,f,a,c="zoomed panned centered extentset resized drawn".split(" ");return wax.interaction().attach(function(d){if(!arguments.length)return a;a=d;for(var b=0;b<c.length;b++)a.addCallback(c[b],e)}).detach(function(){for(var d=0;d<c.length;d++)a.removeCallback(c[d],e)}).parent(function(){return a.parent}).grid(function(){var d=a.getLayerAt(0).levels[Math.round(a.getZoom())];if(h||!(void 0!==f&&f.length)){var b=a.getLayerAt(0).tiles,c=[],g;for(g in b)if(b[g].parentNode===d){var e=wax.u.offset(b[g]);c.push([e.top,e.left,b[g]])}f=c}return f})};

  var
      // The base layer to initialize the map with.
      baseLayer,
      // The current center.
      center,
      // The map div.
      divMap = document.getElementById(NPMap.config.div).parentNode,
      // The initial center of the map.
      initialCenter,
      // The initial zoom level of the map.
      initialZoom,
      // The {MM.Map} object.
      map,
      // Max zoom level of the map.
      max = 17,
      // Min zoom level of the map.
      min = 0,
      //
      numberZIndexLayers = (function() {
        var c = 0;
        
        if (NPMap.config.layers) {
          for (var i = 0; i < NPMap.config.layers.length; i++) {
            if (typeof NPMap.config.layers[i].zIndex !== 'undefined') {
              c++;
            }
          }
        }
        
        return c;
      })(),
      // The last zoom level.
      oldZoom,
      // Has the view changed since the last mousedown?
      viewChanged = false,
      // The current zoom level.
      zoom;
      
  /**
   * Helper function for running easey.
   * @param {Object} latLng
   * @param {Number} zoom
   * @param {Number} time (Optional)
   * @param {Function} callback (Optional)
   */
  function runEasey(latLng, zoom, time, callback) {
    var panned = !NPMap.Map.latLngsAreEqual(NPMap.Map.ModestMaps.latLngFromApi(map.getCenter()), NPMap.Map.ModestMaps.latLngFromApi(latLng)),
        zoomed = map.getZoom() !== zoom;
        
    time = time || 200;

    easey().map(map)
      .to(map.locationCoordinate(latLng).zoomTo(zoom))
      .run(time);

    if (callback) {
      setTimeout(callback, time);
    }
  }
  
  center = initialCenter = NPMap.config.center ? new MM.Location(NPMap.config.center.lat, NPMap.config.center.lng) : new MM.Location(39, -96);
  map = new MM.Map(NPMap.config.div, [], null, [
    easey.DragHandler(),
    easey.TouchHandler(),
    easey.MouseWheelHandler(),
    easey.DoubleClickHandler()
  ]);
  zoom = initialZoom = oldZoom = NPMap.config.zoom || 4;
  
  if (!NPMap.config.baseLayers) {
    NPMap.config.baseLayers = [{
      attribution: '<a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>',
      id: 'mapbox.mapbox-light',
      name: 'MapBox Light',
      type: 'TileStream',
      visible: true
    }];
  }

  if (NPMap.config.layers && (NPMap.config.layers.length === numberZIndexLayers)) {
    NPMap.config.layers.sort(function(a, b) {
      return a.zIndex - b.zIndex;
    });
  }

  if (NPMap.config.restrictZoom) {
    if (NPMap.config.restrictZoom.max) {
      max = NPMap.config.restrictZoom.max;
    }
    
    if (NPMap.config.restrictZoom.min) {
      min = NPMap.config.restrictZoom.min;
    }
  }

  map.addCallback('drawn', function(m) {
    var z = Math.round(m.getZoom());

    viewChanged = true;
    
    if (oldZoom !== z) {
      oldZoom = z;

      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.hide();
      }

      Event.trigger('NPMap.Map', 'zoomchanged');
    }
    
    if (NPMap.InfoBox.visible) {
      NPMap.InfoBox.reposition();
    }
  });
  MM.addEvent(map.parent, 'mousedown', function(e) {
    viewChanged = false;
  });
  MM.addEvent(map.parent, 'mouseup', function(e) {
    if (e.which === 3) {
      return;
    }

    setTimeout(function() {
      if (!viewChanged ) {
        Event.trigger('NPMap.Map', 'click', e);
      }

      viewChanged = false;
    }, 200);
  });
  map.setCenterZoom(center, zoom);
  map.setZoomRange(min, max);
  Map._init();
  
  return NPMap.Map.ModestMaps = {
    // Is the map loaded and ready to be interacted with programatically?
    _isReady: true,
    // The MM.Map object. This reference should be used to access any of the Modest Maps JS functionality that can't be done through NPMap's API.
    map: map,
    /**
     * Adds a tile layer to the map.
     * @param {Object} layer
     */
    addTileLayer: function(layer) {
      map.insertLayerAt(0, layer);
    },
    /**
     * Sets the bounds of the map.
     * @param {L.LatLngBounds} bounds
     */
    bounds: function(bounds) {
      
    },
    /**
     * Converts an API bounds to a NPMap bounds.
     * @param {Object} bounds
     * @return {Object}
     */
    boundsFromApi: function(bounds) {
      return {
        e: bounds.east,
        n: bounds.north,
        s: bounds.south,
        w: bounds.west
      };
    },
    /**
     * Converts a NPMap bounds to an API bounds.
     * @param {Object}
     * @return {Object}
     */
    boundsToApi: function(bounds) {
      return new MM.extent(bound.n, bounds.w, bounds.s, bounds.e);
    },
    /**
     * Sets the center and zoom level of the map.
     * @param {Object} center
     * @param {Number} zoom
     * @param {Function} callback (Optional);
     */
    centerAndZoom: function(center, zoom, callback) {
      runEasey(center, zoom, 200, callback);
    },
    /**
     * Creates a tile layer.
     * @param {String/Function} constructor
     * @param {Object} options (Optional)
     */
    createTileLayer: function(constructor, options) {
      var getSubdomain = null,
          uriConstructor;

      options = options || {};

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

      if (typeof constructor === 'string') {
        uriConstructor = function(coord) {
          var template = _.template(constructor),
              uri = template({
                x: coord.column,
                y: coord.row,
                z: coord.zoom
              });

          if (getSubdomain) {
            uri = uri.replace('{{s}}', getSubdomain());
          }
          
          return uri;
        };
      } else {
        uriConstructor = function(coord) {
          var subdomain = null;

          if (getSubdomain) {
            subdomain = getSubdomain();
          }

          return constructor(coord.column, coord.row, coord.zoom, options.url ? options.url : null, subdomain);
        };
      }

      return new MM.Layer(new MM.MapProvider(uriConstructor));
    },
    /**
     * Gets a latLng from a click event object.
     * @param {Object} e
     * @return {Object}
     */
    eventGetLatLng: function(e) {
      return map.pointLocation(new MM.Point(e.layerX, e.layerY));
    },
    /**
     * Gets a shape from a click event object.
     * @param {Object} e
     * @return {Object}
     */
    eventGetShape: function(e) {
      
    },
    /**
     * Gets the current bounds of the map.
     * @return {Object}
     */
    getBounds: function() {
      return map.getExtent();
    },
    /**
     * Gets the center of the map.
     * @return {Float}
     */
    getCenter: function() {
      return map.getCenter();
    },
    /**
     * Returns the current MM.Location object of the #npmap-clickdot div. This MM.Location is relative to the upper-lefthand corner of the map.
     */
    getClickDotLatLng: function() {
      var pixel = this.getClickDotPixel();

      return map.pointLocation(new MM.Point(pixel.x, pixel.y));
    },
    /**
     * Returns the {L.Point} for the #npmap-clickdot div. This pixel is relative to the upper-lefthand corner of the map.
     */
    getClickDotPixel: function() {
      var offset = NPMap.Util.getOffset(document.getElementById('npmap-map')),
          position = Util.getOffset(document.getElementById('npmap-clickdot'));

      return new MM.Point(position.left - offset.left, position.top - offset.top);
    },
    /**
     * Gets the map element.
     * @return {Object}
     */
    getContainerDiv: function() {
      return map.parent;
    },
    /**
     * Returns the maximum zoom level for this map.
     * @return {Number}
     */
    getMaxZoom: function() {
      return max;
    },
    /**
     * Returns the minimum zoom level for this map.
     * @return {Number}
     */
    getMinZoom: function() {
      return min;
    },
    /**
     * Gets the zoom level of the map.
     * @return {Float}
     */
    getZoom: function() {
      return map.getZoom();
    },
    /**
     * Is called when the map div is resized.
     * @param {Function} callback (Optional)
     */
    handleResize: function(callback) {
      var dimensionsNpmap = Util.getOuterDimensions(document.getElementById('npmap')),
          divModules = document.getElementById('npmap-modules'),
          divTools = document.getElementById('npmap-tools');

      if (divModules) {
         dimensionsNpmap.width = dimensionsNpmap.width - Util.getOuterDimensions(document.getElementById('npmap-modules')).width;
      }

      if (divTools) {
        dimensionsNpmap.height = dimensionsNpmap.height - Util.getOuterDimensions(divTools).height;
      }

      map.setSize(new MM.Point(dimensionsNpmap.width, dimensionsNpmap.height));

      if (callback) {
        callback();
      }
    },
    /**
     * Returns true if the input latLng is contained within the current map bounds.
     * @param latLng {Object} or {String} The latLng to check for.
     * @return {Boolean} True if the latLng is within the map bounds. False otherwise.
     */
    isLatLngWithinMapBounds: function(latLng) {
      var extent = this.getBounds(),
          isWithinExtent = false;

      if (NPMap.Util.isBetween(extent.north, extent.south, latLng.lat) === true && NPMap.Util.isBetween(extent.east, extent.west, latLng.lon) === true) {
        isWithinExtent = true;
      }

      return isWithinExtent;
    },
    /**
     * Converts a MM.Location object to the NPMap representation of a latitude/longitude string.
     * @param latLng {MM.Location} The Location object to convert to a string.
     * @return {String} A latitude/longitude string in "latitude,longitude" format.
     */
    latLngFromApi: function(latLng) {
      return {
        lat: latLng.lat,
        lng: latLng.lon
      };
    },
    /**
     * Converts an NPMap lat/lng string ("latitude,longitude") to a MM.Location object.
     * @param latLng {Object} (Required) The NPMap lat/lng object to convert.
     * @return {MM.Location}
     */
    latLngToApi: function(latLng) {
      return new MM.Location(latLng.lat, latLng.lng);
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     * @param {Function} callback (Optional)
     */
    panByPixels: function(pixels, callback) {
      var center = map.locationPoint(map.getCenter());

      runEasey(map.pointLocation(new MM.Point(center.x - pixels.x, center.y - pixels.y)), map.getZoom(), null, callback);
    },
    /**
     * Converts a {MM.Point} to an NPMap point.
     * @param {MM.Point} pixel
     * @return {Object}
     */
    pixelFromApi: function(pixel) {
      return {
        x: pixel.x,
        y: pixel.y
      };
    },
    /**
     * Converts a NPMap pixel object to a {MM.Point}.
     * @param {Object} pixel
     * @return {Object}
     */
    pixelToApi: function(pixel) {
      return new MM.Point(pixel.x, pixel.y);
    },
    /**
     * Converts a {MM.Point} to a {MM.Location}.
     * @param {MM.Point} pixel
     * @return {MM.Location}
     */
    pixelToLatLng: function(pixel) {
      return map.pointLocation(pixel);
    },
    /**
     * Positions the npmap-clickdot div on top of the div that is passed in.
     * @param to {HTML div} (Required) The div to position the npmap-clickdot div onto.
     */
    positionClickDot: function(to) {
      var clickDot = document.getElementById('npmap-clickdot'),
          offset = NPMap.Util.getOffset(document.getElementById('npmap-map'));

      if (typeof to === 'string') {
        to = to.split(',');
        to = map.locationPoint(new MM.Location(parseFloat(to[0]), parseFloat(to[1])));
      } else {
        if (to.lon) {
          to = map.locationPoint(to);
        } else {
          to = map.locationPoint(new MM.Location(to.lat, to.lng));
        }
      }

      clickDot.style.left = offset.left + to.x + 'px';
      clickDot.style.top = offset.top + to.y + 'px';
    },
    /**
     * Switches to a new set of layers.
     * @param {String} url The URL of the TileStream layer or layers to switch to.
     */
    refreshLayers: function(url) {
      var layerTypes = NPMap.Map.getActiveLayerTypes();

      NPMap.InfoBox.hide();

      for (var i = 0; i < layerTypes.length; i++) {
        var layerType = layerTypes[i];
        
        if (layerType === 'TileStream') {
          NPMap.layers.TileStream.refreshLayers();
        } else {
          // TODO: Support other layer refreshes here.
        }
      }
    },
    /**
     * Sets zoom restrictions on the map.
     * @param {Object} restrictions
     */
    setZoomRestrictions: function(restrictions) {
      NPMap.config.restrictZoom = NPMap.config.restrictZoom || {};
      
      if (restrictions.max) {
        NPMap.config.restrictZoom.max = max;
      }
      
      if (restrictions.min) {
        NPMap.config.restrictZoom.min = min;
      }
      
      map.setZoomRange(min, max);
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     */
    toInitialExtent: function() {
      runEasey(initialCenter, initialZoom, 400);
    },
    /**
     * Zooms the map in by one zoom level.
     * @param toDot {Boolean} (Optional) If true, center and zoom will be called. Center is based on the location of the #npmap-clickdot div.
     */
    zoomIn: function(toDot) {
      var latLng,
          zoom = map.getZoom();
      
      if (toDot) {
        var position = Util.getOffset(document.getElementById('npmap-clickdot'));
        
        latLng = map.locationCoordinate(map.pointLocation(new MM.Point(position.left, position.top)));
      } else {
        latLng = map.getCenter();
      }

      runEasey(latLng, zoom + 1, 200);
    },
    /**
     * Zooms the map out by one zoom level.
     */
    zoomOut: function() {
      runEasey(map.getCenter(), map.getZoom() - 1, 200);
    }
  };
});