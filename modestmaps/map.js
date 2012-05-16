// TODO: This should be migrated upwards.
// TODO: You need to re-add support for full screen maps.

define([
  NPMap.config.server + '/map.js'
], function(core) {
  var
      // The map div.
      $mapDiv = $('#' + NPMap.config.div).parent(),
      // The base layer to initialize the map with.
      baseLayer,
      // Default center of the map.
      center = new MM.Location(39, -98),
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
      // The last zoom level.
      oldZoom,
      // The current zoom level.
      zoom = 2;
      
  /**
   * Helper function for running easey.
   * @param {Object} latLng
   * @param {Number} zoom
   * @param {Number} time (Optional)
   * @param {Function} callback (Optional)
   */
  function runEasey(latLng, zoom, time, callback) {
    var panned = !NPMap.Map.latLngsAreEqual(NPMap.modestmaps.map.latLngToString(map.getCenter()), NPMap.modestmaps.map.latLngToString(latLng)),
        zoomed = map.getZoom() !== zoom;
        
    time = time || 200;
    
    easey().map(map)
      .to(map.locationCoordinate(latLng).zoomTo(zoom))
      .run(time);

    if (callback) {
      setTimeout(callback, time);
    }
  }
  
  if (NPMap.config.baseLayers) {
    for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
      var layer = NPMap.config.baseLayers[i];
      
      if (typeof layer.visible === 'undefined' || layer.visible === true) {
        NPMap.utils.safeLoad('NPMap.modestmaps.layers.' + layer.type, function() {
          NPMap.modestmaps.layers[layer.type].addLayer(layer);
        });
        
        baseLayer = true;
        
        break;
      }
    }
  }
  
  // TODO: Hook up attribution.
  map = new MM.Map(NPMap.config.div, [], null, [
    easey.DragHandler(),
    easey.TouchHandler(),
    easey.MouseWheelHandler(),
    easey.DoubleClickHandler()
  ]);
  center = initialCenter = NPMap.config.center ? new MM.Location(NPMap.config.center.lat, NPMap.config.center.lng) : center;
  zoom = initialZoom = oldZoom = NPMap.config.zoom || zoom;
  
  map.setCenterZoom(center, zoom);
  
  if (NPMap.config.restrictZoom) {
    if (NPMap.config.restrictZoom.max) {
      max = NPMap.config.restrictZoom.max;
    }
    
    if (NPMap.config.restrictZoom.min) {
      min = NPMap.config.restrictZoom.min;
    }
  }
  
  map.setZoomRange(min, max);
  
  if (!baseLayer) {
    baseLayer = {
      attribution: '<a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>',
      id: 'mapbox.mapbox-streets',
      name: 'MapBox Streets',
      type: 'TileStream',
      visible: true
    };
    NPMap.config.baseLayers = NPMap.config.baseLayers || [];
    
    NPMap.config.baseLayers.push(baseLayer);
    NPMap.utils.safeLoad('NPMap.modestmaps.layers.TileStream', function() {
      NPMap.modestmaps.layers.TileStream.addLayer(baseLayer);
    });
  }
  
  /*
  NPMap.config.layers.sort(function(a, b) {
    return a.zIndex - b.zIndex;
  });
  $.each(NPMap.config.layers, function(i, v) {
    if ($.isArray(NPMap.config.tileJson)) {
      for (var i = 0; i < NPMap.config.tileJson.length; i++) {
        if (v.id.indexOf(NPMap.config.tileJson[i].id) != -1) {
          setupLayer(v, NPMap.config.tileJson[i]);
          break;
        }
      }
    } else {
      if (v.id.indexOf(NPMap.config.tileJson.id) != -1) {
        setupLayer(v, NPMap.config.tileJson);
      }
    }
  });
  */
  
  /*
  bw = wax.mm.bwdetect(map, {
    auto: true,
    png: '.png64?'
  });
  */

  /*
  MM.ZoomBox = function(map) {
    this.map = map;

    var theBox = this;

    this.getMousePoint = function(e) {
      // start with just the mouse (x, y)
      var point = new com.modestmaps.Point(e.clientX, e.clientY);
      
      // correct for scrolled document
      point.x += document.body.scrollLeft + document.documentElement.scrollLeft;
      point.y += document.body.scrollTop + document.documentElement.scrollTop;

      // correct for nested offsets in DOM
      for(var node = this.map.parent; node; node = node.offsetParent) {
        point.x -= node.offsetLeft;
        point.y -= node.offsetTop;
      }
      
      return point;
    };

    var boxDiv = document.createElement('div');
    boxDiv.id = map.parent.id+'-zoombox';
    boxDiv.style.cssText = 'margin:0; padding:0; position:absolute; top:0; left:0;'
    boxDiv.style.width = map.dimensions.x+'px';
    boxDiv.style.height = map.dimensions.y+'px';        
    map.parent.appendChild(boxDiv);    

    var box = document.createElement('div');
    box.id = map.parent.id+'-zoombox-box';
    box.style.cssText = 'margin:0; padding:0; border:1px dashed #888; background: rgba(255,255,255,0.25); position: absolute; top: 0; left: 0; width: 0; height: 0; display: none;';
    boxDiv.appendChild(box);    

    // TODO: respond to resize

    var mouseDownPoint = null;
    
    this.mouseDown = function(e) {
      if (e.shiftKey) {
        mouseDownPoint = theBox.getMousePoint(e);
        
        box.style.left = mouseDownPoint.x + 'px';
        box.style.top = mouseDownPoint.y + 'px';

        com.modestmaps.addEvent(map.parent, 'mousemove', theBox.mouseMove);
        com.modestmaps.addEvent(map.parent, 'mouseup', theBox.mouseUp);
        
        map.parent.style.cursor = 'crosshair';
        
        return com.modestmaps.cancelEvent(e);
      }
    };

    this.mouseMove = function(e) {
      var point = theBox.getMousePoint(e);
      box.style.display = 'block';
      if (point.x < mouseDownPoint.x) {
          box.style.left = point.x + 'px';
      }
      else {
          box.style.left = mouseDownPoint.x + 'px';
      }
      box.style.width = Math.abs(point.x - mouseDownPoint.x) + 'px';
      if (point.y < mouseDownPoint.y) {
          box.style.top = point.y + 'px';
      }
      else {
          box.style.top = mouseDownPoint.y + 'px';
      }
      box.style.height = Math.abs(point.y - mouseDownPoint.y) + 'px';
      return com.modestmaps.cancelEvent(e);
    };    

    this.mouseUp = function(e) {
      var point = theBox.getMousePoint(e);
      
      var l1 = map.pointLocation(point);
      var l2 = map.pointLocation(mouseDownPoint);
      map.setExtent([l1,l2]);
  
      box.style.display = 'none';        
      com.modestmaps.removeEvent(map.parent, 'mousemove', theBox.mouseMove);
      com.modestmaps.removeEvent(map.parent, 'mouseup', theBox.mouseUp);        

      map.parent.style.cursor = 'auto';
      
      return com.modestmaps.cancelEvent(e);
    };
    
    com.modestmaps.addEvent(boxDiv, 'mousedown', this.mouseDown);
  }
  */
  
  map.setCenterZoom(initialCenter, initialZoom);
  map.addCallback('drawn', function(m) {
    var z = Math.round(m.getZoom());
    
    if (oldZoom !== z) {
      oldZoom = z;

      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.hide();
      }

      NPMap.Event.trigger('NPMap.Map', 'zoomchanged');
    }
    
    if (NPMap.InfoBox.visible) {
      NPMap.InfoBox.reposition();
    }
  });
  $.each($('#npmap-infobox').children(), function(i, v) {
    if (v.id != 'npmap-infobox-bottom') {
      $('#' + v.id).dblclick(function(e) {
        e.stopPropagation();
      }).mousedown(function(e) {
        e.stopPropagation();
      });
    }
  });
  core.init();

  NPMap.modestmaps = NPMap.modestmaps || {};
  
  return NPMap.modestmaps.map = {
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
     * Gets the center of the map.
     * @return {Float}
     */
    getCenter: function() {
      return map.getCenter();
    },
    /**
     * Returns the current MM.Location object of the #npmap-clickdot div.
     */
    getClickDotLatLng: function() {
      var position = $('#npmap-clickdot').position();
      
      return map.pointLocation(new MM.Point(position.left, position.top));
    },
    /**
     * Gets the parent div of the map.
     */
    getParentDiv: function() {
      return map.parent;
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
      var $parent = $(map.parent),
          height = $parent.actual('height'),
          width = $parent.actual('width');
      
      // TODO: Can't you handle this in NPMap.Map?
      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.reposition();
      }

      map.setSize(width, height);

      map.dimensions = new MM.Point(width, height);
      
      $parent.css({
        height: height + 'px',
        width: width + 'px'
      });

      map.dispatchCallback('resized', map.dimensions);

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
      var extent = map.getExtent(),
          isWithinExtent = false
          latLng = (function() {
            if (typeof(latLng) === 'string') {
              return this.stringToLatLng(latLng);
            } else {
              return latLng;
            }
          })();
          
      if (NPMap.utils.isBetween(extent.north, extent.south, latLng.lat) === true && NPMap.utils.isBetween(extent.east, extent.west, latLng.lon) === true) {
        isWithinExtent = true;
      }

      return isWithinExtent;
    },
    /**
     * Is the map loaded and ready to be interacted with programatically?
     */
    isReady: true,
    /**
     * Converts a MM.Location object to the NPMap representation of a latitude/longitude string.
     * @param latLng {MM.Location} The Location object to convert to a string.
     * @return {String} A latitude/longitude string in "latitude,longitude" format.
     */
    latLngToString: function(latLng) {
      return latLng.lat + ',' + latLng.lon;
    },
    /**
     * The MM.Map object. This reference should be used to access any of the Modest Maps JS functionality that can't be done through NPMap's API.
     */
    Map: map,
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     */
    panByPixels: function(pixels) {
      var center = map.locationPoint(map.getCenter());

      runEasey(map.pointLocation(new MM.Point(center.x - pixels.x, center.y - pixels.y)), map.getZoom());
    },
    /**
     * Positions the npmap-clickdot div on top of the div that is passed in.
     * @param to {HTML div} (Required) The div to position the npmap-clickdot div onto.
     */
    positionClickDot: function(to) {
      if (typeof(to) === 'string') {
        to = to.split(',');
        to = map.locationPoint(new MM.Location(parseFloat(to[0]), parseFloat(to[1])));
      }
      
      $('#npmap-clickdot').show().css({
        left: to.x + 'px',
        top: to.y + 'px'
      });
    },
    /**
     * Converts an NPMap lat/lng string ("latitude,longitude") to a MM.Location object.
     * @param latLng {String} (Required) The NPMap lat/lng string to convert.
     * @return {MM.Location}
     */
    stringToLatLng: function(latLng) {
      latLng = latLng.split(',');
      
      return new MM.Location(parseFloat(latLng[0]), parseFloat(latLng[1]));
    },
    /**
     * Switches to a new set of layers.
     * @param {String} url The URL of the TileStream layer or layers to switch to.
     */
    switchLayers: function(url) {
      NPMap.InfoBox.hide();
      
      // Now call TileStream resetLayers()
    },
    /**
     * Zooms the map in by one zoom level.
     * @param toDot {Boolean} (Optional) If true, center and zoom will be called. Center is based on the location of the #npmap-clickdot div.
     */
    zoomIn: function(toDot) {
      var latLng,
          zoom = map.getZoom();
      
      if (toDot) {
        var position = $('#npmap-clickdot').position();
        
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
    },
    /**
     * Zooms the map to its initial extent.
     */
    zoomToInitialExtent: function() {
      runEasey(initialCenter, initialZoom, 400);
    }
  };
});