// TODO: This should be migrated upwards.
// TODO: You need to re-add support for full screen maps.

define([
  NPMap.config.server + '/map.js'
], function(core) {
  var
      // The map div.
      $mapDiv = $('#' + NPMap.config.div).parent(),
      // The attribution string.
      attribution,
      // The bandwidth detection object.
      bw,
      // Default center of the map.
      center = {
        lat: 39,
        lng: -98
      },
      // The fullscreen object.
      fullscreen = null,
      // An array of grid URLs.
      grids,
      // The initial center of the map.
      initialCenter,
      // The initial zoom level of the map.
      initialZoom,
      // The Wax interaction control.
      interaction = null,
      // Tracks the fullscreen status of the map.
      isFullScreen = false,
      // The {com.modestmaps} map object.
      map,
      // Max zoom level of the map.
      maxZoom = 22,
      // Min zoom level of the map.
      minZoom = 0,
      // The last zoom level.
      oldZoom,
      // The TileJSON object.
      tileJson,
      // An array of tile URLs.
      tiles,
      // The current zoom level.
      zoom = 2;

  /**
   * Builds out an array of URLs for either grids or tiles. Filters out layers that aren't visible.
   * @param {String} resource Build URLs for either 'grids' or 'tiles'.
   */
  function getVisibleLayersUrls(resource) {
    var layers = '',
        subs = [
          'a',
          'b',
          'c',
          'd'
        ],
        urls = [],
        urlTemplate = 'http://{sub}.tiles.mapbox.com/v3/{layers}/{z}/{x}/{y}.';

    $.each(NPMap.config.layers, function(i, v) {
      if (v.visible) {
        layers += v.id + ',';
      }
    });
    
    if (layers.length > 0) {
      layers = layers.slice(0, layers.length - 1);

      $.each(subs, function(i, v) {
        var url = urlTemplate.replace('{sub}', v).replace('{layers}', layers);

        if (resource === 'grids') {
          url += 'grid.json';
        } else {
          url += 'png';
        }

        urls.push(url);
      });
    }
    
    return urls;
  }
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
      .to(map.locationCoordinate(latLng)
        .zoomTo(zoom))
        .run(time);
  
    // TODO: I'm manually calling panned and zoomed events because easey seems to break these.
    
    if (panned) {
       map.dispatchCallback('panned');
    }

    if (zoomed) {
       map.dispatchCallback('zoomed');
    }

    if (callback) {
      setTimeout(callback, time);
    }
  }
  /**
   * Sets up interaction on the map.
   * @param {Object} tileJson The json config object to use to setup interaction.
   * @return {Object}
   */
  function setupInteraction(tileJson) {
    return wax.mm.interaction().map(map).tilejson(tileJson).on({
      on: function(args) {
        var data = args.data,
            e = args.e,
            eo = wax.u.eventoffset(e),
            offset = NPMap.utils.getMapDivOffset(),
            position = {
              x: eo.x - offset.left,
              y: eo.y - offset.top
            };
        
        switch (e.type) {
          case 'mouseup':
            var content,
                title = 'Results';

            NPMap.InfoBox.hide();
            NPMap.modestmaps.map.positionClickDot(position);

            // TODO: This should be used in conjunction with "clustering".
            // TODO: Need to support if content and title configs are strings.
            if (typeof data === 'object' && _.size(data) === 1) {
              var layer = NPMap.map.getLayerByName(NPMap.utils.getFirstPropertyOfObject(data));

              content = layer.identify.content(data);
              title = layer.identify.title(data);
            } else if (NPMap.config.identify && NPMap.config.identify.content) {
              content = NPMap.config.identify.content(data);
              title = NPMap.config.identify.title(data);
            }

            NPMap.InfoBox.show(content, title);
            
            break;
          case 'mousemove':
            var content;

            document.body.style.cursor = 'pointer';
            
            if (typeof NPMap.config.hover !== 'undefined') {
              content = NPMap.config.hover(data);
            }
            
            if (content) {
              NPMap.Map.showTip(content, position);
            }

            break;
        };
      },
      off: function() {
        document.body.style.cursor = 'auto';

        NPMap.Map.hideTip();
      }
    });
  }
  /**
   * Sets up a TileStream layer.
   * @param {Object} layer
   * @param {Object} properties
   */
  function setupLayer(layer, properties) {
    if (properties.grids) {
      layer.grids = properties.grids;
    }

    if (properties.tiles) {
      layer.tiles = properties.tiles;
    }

    if (!layer.attribution && properties.attribution) {
      layer.attribution = properties.attribution;
    }
        
    layer.bounds = properties.bounds;
    layer.center = properties.center;
    layer.download = properties.download;
    layer.maxzoom = properties.maxzoom;
    layer.minzoom = properties.minzoom;
    layer.version = properties.version;
  }

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

  attribution = NPMap.Map.buildAttributionStringForVisibleLayers();
  center = NPMap.config.center || center;
  grids = getVisibleLayersUrls('grids');
  tileJson = {
    scheme: 'xyz'
  };
  tiles = getVisibleLayersUrls('tiles');
  zoom = NPMap.config.zoom || zoom;

  if (attribution) {
    NPMap.Map.setAttribution(attribution);
  }

  if (grids.length > 0) {
    tileJson.grids = grids;
  }

  if (tiles.length > 0) {
    tileJson.tiles = tiles;
  }

  map = new com.modestmaps.Map(NPMap.config.div, new wax.mm.connector(tileJson), null, [
    new easey.DragHandler(),
    new easey.DoubleClickHandler(),
    new easey.MouseWheelHandler()
  ]);
  bw = wax.mm.bwdetect(map, {
      auto: true,
      png: '.png64?'
  });

  if (NPMap.config.restrictZoom) {
    if (NPMap.config.restrictZoom.max) {
      maxZoom = NPMap.config.restrictZoom.max;
    }

    if (NPMap.config.restrictZoom.min) {
      minZoom = NPMap.config.restrictZoom.min;
    }
  }

  map.setZoomRange(minZoom, maxZoom);

  /*
  if (NPMap.config.fullScreen) {
    wax.mm.fullscreen(map, tileJson).appendTo(map.parent);
  }
  */

  if (tileJson.grids) {
    var url = 'http://api.tiles.mapbox.com/v3/';

    $.each(NPMap.config.layers, function(i, v) {
      if (v.visible) {
        url += v.id + ',';
      }
    });

    url = url.slice(0, url.length - 1);
    url += '.jsonp';

    reqwest({
      jsonpCallbackName: 'grid',
      success: function(data) {
        NPMap.config.formatter = data.formatter;
        tileJson.formatter = data.formatter;
        interaction = setupInteraction(data);
      },
      type: 'jsonp',
      url: url
    });
  }
  
  initialCenter = new com.modestmaps.Location(center.lat, center.lng);
  initialZoom = oldZoom = zoom;
    
  wax.mm.zoombox(map, tileJson);
  map.setCenterZoom(initialCenter, initialZoom);
  map.addCallback('centered', function(m) {
    if (NPMap.InfoBox.visible) {
      if (m.getZoom() === oldZoom) {
        NPMap.InfoBox.reposition();
      } else {
        NPMap.InfoBox.hide();
      }
    }
  });
  map.addCallback('extentset', function(m) {
    if (NPMap.InfoBox.visible) {
      if (m.getZoom() === oldZoom) {
        NPMap.InfoBox.reposition();
      } else {
        NPMap.InfoBox.hide();
      }
    }
  });
  map.addCallback('panned', function(m) {
    if (NPMap.InfoBox.visible) {
      NPMap.InfoBox.reposition();
    }
  });
  map.addCallback('zoomed', function(m) {
    // TODO: The zoom change check is failing now because of easey. Fix it.
    var z = m.getZoom();

    //if (oldZoom != z) {
      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.hide();
      }
        
      oldZoom = z;

      NPMap.Event.trigger('NPMap.Map', 'zoomchanged');
    //}
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
     * Gets the center of the map.
     * @return {Float}
     */
    getCenter: function() {
      return map.getCenter();
    },
    /**
     * Returns the current com.modestmaps.Location object of the #npmap-clickdot div.
     */
    getClickDotLatLng: function() {
      var position = $('#npmap-clickdot').position();

      return map.pointLocation(new com.modestmaps.Point(position.left, position.top));
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

      map.dimensions = new com.modestmaps.Point(width, height);
      
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

      if (NPMap.utils.isBetween(extent[0].lat, extent[1].lat, latLng.lat) === true && NPMap.utils.isBetween(extent[0].lon, extent[1].lon, latLng.lon) === true) {
        isWithinExtent = true;
      }

      return isWithinExtent;
    },
    /**
     * Is the map loaded and ready to be interacted with programatically?
     */
    isReady: true,
    /**
     * Converts a com.modestmaps.Location object to the NPMap representation of a latitude/longitude string.
     * @param latLng {com.modestmaps.Location} The Location object to convert to a string.
     * @return {String} A latitude/longitude string in "latitude,longitude" format.
     */
    latLngToString: function(latLng) {
      return latLng.lat + ',' + latLng.lon;
    },
    /**
     * The com.modestmaps.Map object. This reference should be used to access any of the Modest Maps JS functionality that can't be done through NPMap's API.
     */
    Map: map,
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     */
    panByPixels: function(pixels) {
      var center = map.locationPoint(map.getCenter());

      runEasey(map.locationCoordinate(map.pointLocation(new MM.Point(center.x - pixels.x, center.y - pixels.y))), zoom);
    },
    /**
     * Positions the npmap-clickdot div on top of the div that is passed in.
     * @param to {HTML div} (Required) The div to position the npmap-clickdot div onto.
     */
    positionClickDot: function(to) {
      if (typeof(to) === 'string') {
        to = to.split(',');
        to = map.locationPoint(new com.modestmaps.Location(parseFloat(to[0]), parseFloat(to[1])));
      }

      $('#npmap-clickdot').show().css({
        left: to.x + 'px',
        top: to.y + 'px'
      });
    },
    /**
     * Sets the center and zoom level of the map.
     * @param {Object} center
     * @param {Number} zoom
     * @param {Function} callback (Optional);
     */
    setCenterAndZoom: function(center, zoom, callback) {
      runEasey(center, zoom, 200, callback);
    },
    /**
     * Converts an NPMap lat/lng string ("latitude,longitude") to a com.modestmaps.Location object.
     * @param latLng {String} (Required) The NPMap lat/lng string to convert.
     * @return {com.modestmaps.Location}
     */
    stringToLatLng: function(latLng) {
      latLng = latLng.split(',');
      
      return new com.modestmaps.Location(parseFloat(latLng[0]), parseFloat(latLng[1]));
    },
    /**
     * Switches to a new set of layers.
     * @param {String} url The URL of the TileStream layer or layers to switch to.
     */
    switchLayers: function(url) {
      attribution = NPMap.Map.buildAttributionStringForVisibleLayers();
      grids = getVisibleLayersUrls('grids');
      tileJson = {
        maxzoom: maxZoom,
        minzoom: minZoom,
        scheme: 'xyz'
      };
      tiles = getVisibleLayersUrls('tiles');
      
      NPMap.InfoBox.hide();
      
      if (attribution) {
        NPMap.Map.setAttribution(attribution);
      }

      if (interaction) {
        interaction.off();
        interaction = null;
      }

      if (grids.length > 0) {
        var url = 'http://api.tiles.mapbox.com/v3/';

        $.each(NPMap.config.layers, function(i, v) {
          if (v.visible) {
            url += v.id + ',';
          }
        });

        url = url.slice(0, url.length - 1);
        url += '.jsonp';

        reqwest({
          jsonpCallbackName: 'grid',
          success: function(data) {
            NPMap.config.formatter = data.formatter;
            tileJson.formatter = data.formatter;
            tileJson.grids = grids;

            if (tiles.length > 0) {
              tileJson.tiles = tiles;
            }

            map.setLayerAt(0, new wax.mm.connector(tileJson));

            interaction = setupInteraction(data);
          },
          type: 'jsonp',
          url: url
        });
      } else {
        if (tiles.length > 0) {
          tileJson.tiles = tiles;
        }

        map.setLayerAt(0, new wax.mm.connector(tileJson));
      }
    },
    /**
     * Toggles fullscreen mode.
     */
    toggleFullScreen: function() {
      if (isFullScreen) {
        fullscreen.original();
        isFullScreen = false;
      } else {
        if (!fullscreen) {
          fullscreen = wax.mm.fullscreen(map, tileJson);
        }

        fullscreen.full();
        isFullScreen = true;
      }
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
        
        latLng = map.locationCoordinate(map.pointLocation(new com.modestmaps.Point(position.left, position.top)));
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