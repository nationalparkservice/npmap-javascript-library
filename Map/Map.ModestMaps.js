/**
 * @module NPMap.Map.ModestMaps
 *
 * The module for the ModestMaps base API.
 */
define([
  'Event',
  'Map/Map',
  'Util/Util'
], function(Event, Map, Util) {
  /**
   * wax - 7.0.0dev11 - v6.0.4-113-g6b1c56c
   */
  wax.mm=wax.mm||{};wax.mm.interaction=function(){function f(){h=!0}var h=!1,g,c,d="zoomed panned centered extentset resized drawn".split(" ");return wax.interaction().attach(function(a){if(!arguments.length)return c;c=a;for(var b=0;b<d.length;b++)c.addCallback(d[b],f)}).detach(function(){for(var a=0;a<d.length;a++)c.removeCallback(d[a],f)}).parent(function(){return c.parent}).grid(function(){if(h||!(void 0!==g&&g.length)){for(var a,b=0;b<c.getLayers().length;b++){var e=c.getLayerAt(b).levels,e=e&&e[Math.round(c.zoom())];if(void 0!==e&&(a=c.getLayerAt(b).tileElementsInLevel(e),a.length))break}var b=[],d;for(d in a)if(a[d].parentNode===e){var f=wax.u.offset(a[d]);b.push([f.top,f.left,a[d]])}g=b}return g})};
  /**
   * mapbox.markers.js
   */
  var mapbox={markers:{}};mapbox.markers.layer=function(){function g(b){b.coord||(b.coord=a.map.locationCoordinate(b.location));var c=a.map.coordinatePoint(b.coord),e,d;0>c.x?(e=new MM.Location(b.location.lat,b.location.lon),e.lon+=360*Math.ceil((o.lon-b.location.lon)/360),d=a.map.locationPoint(e),d.x<a.map.dimensions.x&&(c=d,b.coord=a.map.locationCoordinate(e))):c.x>a.map.dimensions.x&&(e=new MM.Location(b.location.lat,b.location.lon),e.lon-=360*Math.ceil((b.location.lon-p.lon)/360),d=a.map.locationPoint(e),0<d.x&&(c=d,b.coord=a.map.locationCoordinate(e)));c.scale=1;c.width=c.height=0;MM.moveElement(b.element,c)}var a={},d=[],f=[],i=new MM.CallbackManager(a,["drawn","markeradded"]),h=mapbox.markers.simplestyle_factory,l=function(a,c){return c.geometry.coordinates[1]-a.geometry.coordinates[1]},k,o=null,p=null,m=function(){return!0},q=0,n=function(){return++q},j={};a.parent=document.createElement("div");a.parent.style.cssText="position: absolute; top: 0px;left:0px; width:100%; height:100%; margin:0; padding:0; z-index:0;pointer-events:none;";a.name="markers";a.addCallback=function(b,c){i.addCallback(b,c);return a};a.removeCallback=function(b,c){i.removeCallback(b,c);return a};a.draw=function(){if(a.map){o=a.map.pointLocation(new MM.Point(0,0));p=a.map.pointLocation(new MM.Point(a.map.dimensions.x,0));i.dispatchCallback("drawn",a);for(var b=0;b<f.length;b++)g(f[b])}};a.add=function(b){if(!b||!b.element)return null;a.parent.appendChild(b.element);f.push(b);i.dispatchCallback("markeradded",b);return b};a.remove=function(b){if(!b)return null;a.parent.removeChild(b.element);for(var c=0;c<f.length;c++)if(f[c]===b){f.splice(c,1);break}return b};a.markers=function(a){if(!arguments.length)return f};a.add_feature=function(b){return a.features(a.features().concat([b]))};a.sort=function(b){if(!arguments.length)return l;l=b;return a};a.features=function(b){if(!arguments.length)return d;b||(b=[]);d=b.slice();d.sort(l);for(var c=0;c<f.length;c++)f[c].touch=!1;for(c=0;c<d.length;c++)if(m(d[c])){var e=n(d[c]);j[e]?(j[e].location=new MM.Location(d[c].geometry.coordinates[1],d[c].geometry.coordinates[0]),j[e].coord=null,g(j[e])):j[e]=a.add({element:h(d[c]),location:new MM.Location(d[c].geometry.coordinates[1],d[c].geometry.coordinates[0]),data:d[c]});j[e]&&(j[e].touch=!0)}for(c=f.length-1;0<=c;c--)!1===f[c].touch&&a.remove(f[c]);a.map&&a.map.coordinate&&a.map.draw();return a};a.url=function(b,c){function d(b,e){if(b&&c)return c(b);e&&e.features&&a.features(e.features);c&&c(b,e.features,a)}if(!arguments.length)return k;if("undefined"===typeof reqwest)throw"reqwest is required for url loading";"string"===typeof b&&(b=[b]);k=b;reqwest(k[0].match(/geojsonp$/)?{url:k[0]+(~k[0].indexOf("?")?"&":"?")+"callback=grid",type:"jsonp",jsonpCallback:"callback",success:function(a){d(null,a)},error:d}:{url:k[0],type:"json",success:function(a){d(null,a)},error:d});return a};a.id=function(b,c){return a.url("http://a.tiles.mapbox.com/v3/"+b+"/markers.geojsonp",c)};a.csv=function(b){return a.features(mapbox.markers.csv_to_geojson(b))};a.extent=function(){for(var b=[{lat:Infinity,lon:Infinity},{lat:-Infinity,lon:-Infinity}],c=a.features(),d=0;d<c.length;d++){var f=c[d].geometry.coordinates;f[0]<b[0].lon&&(b[0].lon=f[0]);f[1]<b[0].lat&&(b[0].lat=f[1]);f[0]>b[1].lon&&(b[1].lon=f[0]);f[1]>b[1].lat&&(b[1].lat=f[1])}return b};a.key=function(b){if(!arguments.length)return n;n=null===b?function(){return++q}:b;return a};a.factory=function(b){if(!arguments.length)return h;h=b;a.features(a.features());return a};a.filter=function(b){if(!arguments.length)return m;m=b;a.features(a.features());return a};a.destroy=function(){a.parent.parentNode&&a.parent.parentNode.removeChild(a.parent)};a.named=function(b){if(!arguments.length)return a.name;a.name=b;return a};a.enabled=!0;a.enable=function(){this.enabled=!0;this.parent.style.display="";return a};a.disable=function(){this.enabled=!1;this.parent.style.display="none";return a};return a};mmg=mapbox.markers.layer;mapbox.markers.simplestyle_factory=function(g){var a={small:[20,50],medium:[30,70],large:[35,90]},d=g.properties||{},g=d["marker-size"]||"medium",f=d["marker-symbol"]?"-"+d["marker-symbol"]:"",i=d["marker-color"]||"7e7e7e",i=i.replace("#",""),h=document.createElement("img");h.width=a[g][0];h.height=a[g][1];h.className="simplestyle-marker";h.alt=d.title||"";h.src=(mapbox.markers.marker_baseurl||"http://a.tiles.mapbox.com/v3/marker/")+"pin-"+g.charAt(0)+f+"+"+i+(2===window.devicePixelRatio?"@2x":"")+".png";d=h.style;d.position="absolute";d.clip="rect(auto auto "+0.75*a[g][1]+"px auto)";d.marginTop=-(a[g][1]/2)+"px";d.marginLeft=-(a[g][0]/2)+"px";d.cursor="pointer";d.pointerEvents="all";return h};

  var
      // The base layer to initialize the map with.
      baseLayer,
      // The current center.
      center,
      //
      clicks = 0,
      // The map div.
      divMap = document.getElementById(NPMap.config.div).parentNode,
      // The initial center of the map.
      initialCenter,
      // The initial zoom level of the map.
      initialZoom,
      // The {MM.Map} object.
      map,
      //
      markerLayer = mapbox.markers.layer(),
      // Max zoom level of the map.
      max = 17,
      // Min zoom level of the map.
      min = 0,
      // The last zoom level.
      oldZoom,
      //
      panning = false,
      // Has the view changed since the last mousedown?
      viewChanged = false,
      // The current zoom level.
      zoom,
      //
      zooming = false;
      
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

    easey().map(map).to(map.locationCoordinate(latLng).zoomTo(zoom)).run(time);

    if (callback) {
      setTimeout(callback, time);
    }
  }
  
  center = initialCenter = NPMap.config.center ? new MM.Location(NPMap.config.center.lat, NPMap.config.center.lng) : new MM.Location(39, -96);
  map = new MM.Map(NPMap.config.div, [], null, [
    easey_handlers.DragHandler(),
    easey_handlers.TouchHandler(),
    easey_handlers.MouseWheelHandler(),
    easey_handlers.DoubleClickHandler()
  ]);
  zoom = initialZoom = oldZoom = NPMap.config.zoom || 4;

  if (typeof NPMap.config.baseLayers === 'undefined' && NPMap.config.baseLayers !== false) {
    NPMap.config.baseLayers = [{
      id: 'nps.map-sligp1fr',
      name: 'Light Gray',
      type: 'TileStream',
      visible: true
    }];
  }

  if (NPMap.config.zoomRange) {
    if (NPMap.config.zoomRange.max) {
      max = NPMap.config.zoomRange.max;
    }
    
    if (NPMap.config.zoomRange.min) {
      min = NPMap.config.zoomRange.min;
    }
  }

  map.addCallback('drawn', function() {
    var z = Math.round(map.getZoom());

    viewChanged = true;

    Event.trigger('NPMap.Map', 'viewchanging');
    
    if (oldZoom !== z) {
      if (!zooming) {
        Event.trigger('NPMap.Map', 'viewchangestart');
        Event.trigger('NPMap.Map', 'zoomstart');
      }

      Event.trigger('NPMap.Map', 'zooming');

      oldZoom = z;
      zooming = true;

      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.hide();
      }

      setTimeout(function() {
        if (Math.round(map.getZoom()) === oldZoom) {
          zooming = false;

          Event.trigger('NPMap.Map', 'viewchangeend');
          Event.trigger('NPMap.Map', 'zoomend');
        }
      }, 50);
    }
    
    if (NPMap.InfoBox.visible) {
      NPMap.InfoBox.reposition();
    }
  });
  map.addCallback('panned', function() {
    var center = map.getCenter();

    if (!panning) {
      Event.trigger('NPMap.Map', 'panstart');
      Event.trigger('NPMap.Map', 'viewchangestart');
    }

    Event.trigger('NPMap.Map', 'panning');
    setTimeout(function() {
      if (Map.latLngsAreEqual(Map.latLngFromApi(center), Map.latLngFromApi(map.getCenter()))) {
        Event.trigger('NPMap.Map', 'panend');
        Event.trigger('NPMap.Map', 'viewchangeend');

        panning = false;
      }
    }, 50);

    panning = true;
  });
  MM.addEvent(map.parent, 'mousedown', function(e) {
    viewChanged = false;

    Event.trigger('NPMap.Map', 'mousedown', e);

    if (Util.isRightClick(e)) {
      Event.trigger('NPMap.Map', 'rightclick', e);
    }
  });
  MM.addEvent(map.parent, 'mousemove', function(e) {
    Event.trigger('NPMap.Map', 'mousemove', e);
  });
  MM.addEvent(map.parent, 'mouseover', function(e) {
    Event.trigger('NPMap.Map', 'mouseover', e);
  });
  MM.addEvent(map.parent, 'mouseout', function(e) {
    Event.trigger('NPMap.Map', 'mouseout', e);
  });
  MM.addEvent(map.parent, 'mouseup', function(e) {
    clicks++;

    if (e.which === 3) {
      return;
    }

    Event.trigger('NPMap.Map', 'mouseup', e);
    setTimeout(function() {
      if (!viewChanged) {
        if (clicks === 1) {
          Event.trigger('NPMap.Map', 'click', e);
        } else {
          Event.trigger('NPMap.Map', 'dblclick', e);
        }
      }

      clicks = 0;
      viewChanged = false;
    }, 350);
  });
  MM.addEvent(map.parent, 'rightclick', function(e) {
    Event.trigger('NPMap.Map', 'rightclick', e);
  });
  map.addLayer(markerLayer);
  map.setCenterZoom(center, zoom);
  map.setZoomRange(min, max);
  Map._init();
  
  return NPMap.Map.ModestMaps = {
    // Is the map loaded and ready to be interacted with programatically?
    _isReady: true,
    // The MM.Map object. This reference should be used to access any of the Modest Maps JS functionality that can't be done through NPMap's API.
    map: map,
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map.
     * @return null
     */
    addShape: function(shape) {
      markerLayer.add_feature(shape);
    },
    /**
     * Adds a tile layer to the map.
     * @param {Object} layer
     */
    addTileLayer: function(layer) {
      if (layer.zIndex === null) {
        map.addLayer(layer);
      } else {
        map.insertLayerAt(layer.zIndex, layer);
      }
    },
    /**
     * Removes a tile layer from the map.
     * @param {Object} layer
     */
    removeTileLayer: function(layer) {
      //map.removeLayerAt(layer.zIndex);
      map.removeLayer(layer);
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
      return new MM.Extent(bounds.n, bounds.w, bounds.s, bounds.e);
    },
    /**
     * Centers the map.
     * @param {Object} latLng
     */
    center: function(latLng) {
      this.centerAndZoom(latLng, this.getZoom());
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
     *
     */
    convertLineOptions: function(options) {

    },
    /**
     *
     */
    convertMarkerOptions: function(options) {

    },
    /**
     *
     */
    convertPolygonOptions: function(options) {

    },
    /**
     * Creates a line shape.
     * @param {Array} latLngs An array of {MM.Location} objects.
     * @param {Object} options (Optional) Any additional options to apply to the line.
     * @return {Object}
     */
    createLine: function(latLngs, options) {
      return 'Not yet implemented.';
    },
    /**
     * Creates a marker shape.
     * @param latLng {MM.Location} Where to place the marker.
     * @param options {Object} (Optional) Any additional options to apply to the marker.
     * @return {Object}
     */
    createMarker: function(latLng, options) {
      return {
        geometry: {
          coordinates: [
            latLng.lon,
            latLng.lat
          ]
        },
        properties: {}
      };
    },
    /**
     * Creates a polygon shape.
     * @param latLngs {Array} (Required) An array of {MM.Location} objects.
     * @param options {Object} (Optional) Any additional options to apply to the polygon.
     * @return {Object}
     */
    createPolygon: function(latLngs, options) {
      return 'Not yet implemented.';
    },
    /**
     * Creates a tile layer.
     * @param {String/Function} constructor
     * @param {Object} options (Optional)
     */
    createTileLayer: function(constructor, options) {
      var getSubdomain = null,
          tileLayer,
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

      tileLayer = new MM.Layer(new MM.MapProvider(uriConstructor));
      tileLayer.zIndex = (typeof options.zIndex === 'number' ? options.zIndex : null);

      return tileLayer;
    },
    /**
     * Gets a latLng from a click event object.
     * @param {Object} e
     * @return {Object}
     */
    eventGetLatLng: function(e) {
      var offset = Util.getOffset(document.getElementById('npmap-map')),
          x = e.pageX || e.clientX,
          y = e.pageY || e.clientY;

      return map.pointLocation(new MM.Point(x - offset.left, y - offset.top));
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
      return this.pixelToLatLng(this.getClickDotPixel());
    },
    /**
     * Returns the {L.Point} for the #npmap-clickdot div. This pixel is relative to the upper-lefthand corner of the map.
     */
    getClickDotPixel: function() {
      var offset = Util.getOffset(document.getElementById('npmap-map')),
          position = Util.getOffset(document.getElementById('npmap-clickdot'));

      return new MM.Point(position.left - offset.left, position.top - offset.top);
    },
    /**
     * Gets the map element.
     * @return {Object}
     */
    getMapElement: function() {
      return map.parent;
    },
    /**
     * Gets the latLng (MM.Location) of the marker.
     * @param {Object} marker The marker to get the latLng for.
     * @return {Object}
     */
    getMarkerLatLng: function(marker) {
      var coordinates = marker.geometry.coordinates;

      return new MM.Location(coordinates[1], coordinates[0]);
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
     * Converts a {MM.Location} to a {MM.Point}.
     * @param {Object} latLng
     * @return {Object}}
     */
    latLngToPixel: function(latLng) {
      return map.locationPoint(latLng);
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
     * Positions the npmap-clickdot div.
     * @param {Object} to The {MM.Location} to position the div to.
     * @return null
     */
    positionClickDot: function(to) {
      var clickDot = document.getElementById('npmap-clickdot');

      if (to.lon) {
        to = map.locationPoint(to);
      } else {
        to = map.locationPoint(new MM.Location(to.lat, to.lng));
      }

      clickDot.style.left = to.x + 'px';
      clickDot.style.top = to.y + 'px';
    },
    /**
     * Sets zoom restrictions on the map.
     * @param {Object} restrictions
     */
    setZoomRestrictions: function(restrictions) {
      NPMap.config.zoomRange = NPMap.config.zoomRange || {};
      
      if (restrictions.max) {
        NPMap.config.zoomRange.max = max;
      }
      
      if (restrictions.min) {
        NPMap.config.zoomRange.min = min;
      }
      
      map.setZoomRange(min, max);
    },
    /**
     * Zooms the map to a bounding box.
     * @param {Object} bbox A {MM.Extent} object.
     * @return null
     */
    toBounds: function(bounds) {
      map.setExtent(bounds);
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     */
    toInitialExtent: function() {
      NPMap.InfoBox.hide();
      runEasey(initialCenter, initialZoom, 400);
    },
    /**
     * Zooms the map to the extent of an array of latLng objects.
     * @param {Array} latLngs The array of latLng objects.
     * @return null
     */
    toLatLngs: function(latLngs) {
      map.setExtent(latLngs);
    },
    /**
     * Zooms the map to the extent of an array of markers.
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
     * Zooms the map to a zoom level.
     * @param {Number} zoom
     * @return null
     */
    zoom: function(zoom) {
      runEasey(initialCenter, zoom);
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