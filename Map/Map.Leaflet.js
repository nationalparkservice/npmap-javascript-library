/**
           Is the fundamental problem that you store the events with the modules themselves? If you stored them in a central place in the NPMap.Event class, would that solve your problem?

           That way, events could be added even before a module was loaded, and events could still get called correctly once the modules loaded.
       */



define([
  'Event',
  'Map/Map',
  'Util/Util'
], function(Event, Map, Util) {
  /**
   * wax - 7.0.0dev11 - v6.0.4-113-g6b1c56c
   */
  wax.leaf={};wax.leaf.interaction=function(){function e(){g=!0}var g=!1,f,c;return wax.interaction().attach(function(b){if(!arguments.length)return c;c=b;for(var d=["moveend"],a=0;a<d.length;a++)c.on(d[a],e)}).detach(function(b){if(!arguments.length)return c;c=b;for(var d=["moveend"],a=0;a<d.length;a++)c.off(d[a],e)}).parent(function(){return c._container}).grid(function(){if(!g&&f)return f;var b=c._layers,d=[],a;for(a in b)if(b[a]._tiles)for(var e in b[a]._tiles){var h=wax.u.offset(b[a]._tiles[e]);d.push([h.top,h.left,b[a]._tiles[e]])}return f=d})};
  
  var
      // The currently active baseLayer config.
      activeBaseLayer,
      // An array of the default base layers for the Leaflet baseAPI.
      DEFAULT_BASE_LAYERS = {
        aerial: {
          cls: 'aerial',
          icon: 'aerial',
          mapTypeId: 'Aerial',
          name: 'Aerial View',
          type: 'Api'
        },
        blank: {
          cls: 'blank',
          icon: 'blank',
          mapTypeId: 'Blank',
          name: 'Blank View',
          type: 'Api'
        },
        hybrid: {
          cls: 'hybrid',
          icon: 'aerial',
          mapTypeId: 'AerialWithLabels',
          name: 'Hybrid View',
          type: 'Api'
        },
        streets: {
          cls: 'streets',
          icon: 'street',
          mapTypeId: 'Road',
          name: 'Street View',
          type: 'Api'
        },
        terrain: {
          attribution: 'MapBox | @ OpenStreetMap Contributors',
          icon: 'topo',
          id: 'nps.map-lj6szvbq',
          name: 'Terrain View',
          type: 'TileStream'
        }
      },
      // Helps handle map single and double-click events.
      doubleClicked = false,
      // The center {L.LatLng} to initialize the map with.
      initialCenter = NPMap.config.center ? new L.LatLng(NPMap.config.center.lat, NPMap.config.center.lng) : new L.LatLng(39, -96),
      // The zoom level to initialize the map with.
      initialZoom = NPMap.config.zoom ? NPMap.config.zoom : 4,
      // The {L.Map} object.
      map,
      // The map config object.
      mapConfig = {
        attributionControl: false,
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false
      };

  /**
   * Handles the map resize.
   * @return null
   */
  function handleResize() {
    map.invalidateSize();
  }

  /**
   * Bing Maps layer. - https://github.com/shramov/leaflet-plugins
   */
  L.TileLayer.Bing = L.TileLayer.extend({
    options: {
      attribution: 'Bing',
      subdomains: [
        0,
        1,
        2,
        3
      ],
      type: 'Aerial'
    },
    _update: function() {
      if (this._url === null || !this._map) {
        return;
      }

      this._update_attribution();
      L.TileLayer.prototype._update.apply(this, []);
    },
    _update_attribution: function() {
      var bounds = this._map.getBounds(),
          zoom = this._map.getZoom();

      for (var i = 0; i < this._providers.length; i++) {
        var p = this._providers[i];
        
        if ((zoom <= p.zoomMax && zoom >= p.zoomMin) && bounds.intersects(p.bounds)) {
          if (!p.active) {
            activeBaseLayer.attribution.push(p.attrib);
          }

          p.active = true;
        } else {
          if (p.active) {
            activeBaseLayer.attribution.splice(_.indexOf(activeBaseLayer.attribution, p.attrib), 1);
          }

          p.active = false;
        }
      }
      
      Map.updateAttribution();
    },
    getTileUrl: function(p, z) {
      var subdomains = this.options.subdomains,
          s = this.options.subdomains[Math.abs((p.x + p.y) % subdomains.length)];

      z = this._getZoomForUrl();

      return this._url.replace('{subdomain}', s).replace('{quadkey}', this.tile2quad(p.x, p.y, z));
    },
    initialize: function(key, options) {
      L.Util.setOptions(this, options);

      activeBaseLayer.attribution = [];
      this._key = key;
      this._url = null;
      this.meta = {};
      this.loadMetadata();
    },
    initMetadata: function() {
      var r = this.meta.resourceSets[0].resources[0];
      
      this.options.subdomains = r.imageUrlSubdomains;
      this._providers = [];
      this._url = r.imageUrl;
      
      for (var i = 0; i < r.imageryProviders.length; i++) {
        var p = r.imageryProviders[i];
        
        for (var j = 0; j < p.coverageAreas.length; j++) {
          var c = p.coverageAreas[j],
              coverage = {zoomMin: c.zoomMin, zoomMax: c.zoomMax, active: false},
              bounds = new L.LatLngBounds(
                new L.LatLng(c.bbox[0] + 0.01, c.bbox[1] + 0.01),
                new L.LatLng(c.bbox[2] - 0.01, c.bbox[3] - 0.01)
              );
          
          coverage.bounds = bounds;
          coverage.attrib = p.attribution;

          this._providers.push(coverage);
        }
      }

      this._update();
    },
    loadMetadata: function() {
      var _this = this,
          cbid = '_bing_metadata_' + L.Util.stamp(this),
          script = document.createElement('script');

      window[cbid] = function(meta) {
        var e = document.getElementById(cbid);

        _this.meta = meta;
        window[cbid] = undefined;

        e.parentNode.removeChild(e);

        if (meta.errorDetails) {
          return;
        }

        _this.initMetadata();
      };

      script.id = cbid;
      script.src = 'http://dev.virtualearth.net/REST/v1/Imagery/Metadata/' + this.options.type + '?include=ImageryProviders&jsonp=' + cbid + '&key=' + this._key;
      script.type = 'text/javascript';

      document.getElementsByTagName('head')[0].appendChild(script);
    },
    onRemove: function(map) {
      for (var i = 0; i < this._providers.length; i++) {
        var p = this._providers[i];
        
        if (p.active) {
          p.active = false;
        }
      }

      activeBaseLayer.attribution = [];
      
      L.TileLayer.prototype.onRemove.apply(this, [map]);
    },
    tile2quad: function(x, y, z) {
      var quad = '';
      
      for (var i = z; i > 0; i--) {
        var digit = 0,
            mask = 1 << (i - 1);
        
        if ((x & mask) !== 0) {
          digit += 1;
        }

        if ((y & mask) !== 0) {
          digit += 2;
        }

        quad = quad + digit;
      }

      return quad;
    }
  });
  /**
   * Simple tile layer.
   */
  L.TileLayer.Simple = L.TileLayer.extend({
    getTileUrl: function(xy, z) {
      return this._url(xy, z);
    },
    initialize: function(url, options) {
      options.errorTileUrl = NPMap.config.server + '/resources/img/blank-tile.png';

      this._url = url;

      L.Util.setOptions(this, options);
    }
  });
  /**
   * Zoomify layer.
   */
  L.TileLayer.Zoomify = L.TileLayer.extend({
    options: {
      continuousWorld: true,
      errorTileUrl: NPMap.config.server + '/resources/img/blank-tile.png',
      noWrap: false,
      reuseTiles: true
    },
    // Taken from https://github.com/migurski/canvas-warp
    _coordinateGroup: function(c) {
      for (var i = 0; i < this._groups.length; i += 1) {
        if (i + 1 === this._groups.length) {
          return i;
        }
        
        var group = this._groups[i + 1],
            g = {
              column: group.column,
              row: group.row,
              zoom: group.zoom
            };
            
        if (c.zoom < g.zoom || (c.zoom === g.zoom && (c.row < g.row || (c.row === g.row && c.column < g.column)))) {
          return i;
        }
      }
  
      return -1;
    },
    _createTileProto: function () {
      var img = this._tileImg = L.DomUtil.create('img', 'leaflet-tile');
      img.galleryimg = 'no';
    },
    // Taken from Modest Maps JS
    _zoomBy: function(coordinate, distance) {
      var power = Math.pow(2, distance);
    
      return {
        column: coordinate.column * power,
        row: coordinate.row * power,
        zoom: coordinate.zoom + distance
      };
    },
    // Taken from Modest Maps JS
    _zoomTo: function(coordinate, destination) {
      var power = Math.pow(2, destination - coordinate.zoom);
    
      return {
        column: coordinate.column * power,
        row: coordinate.row * power,
        zoom: destination
      };
    },
    // Taken from https://github.com/migurski/canvas-warp
    getTileUrl: function(xy) {
      var zoom = Map.getZoom();

      return this._url + 'TileGroup' + this._coordinateGroup({
        column: xy.x,
        row: xy.y,
        zoom: zoom
      }) + '/'+ zoom + '-' + xy.x + '-' + xy.y + '.jpg';
    },
    initialize: function(url, options) {
      options = L.Util.setOptions(this, options);
      
      // Taken from https://github.com/migurski/canvas-warp
      var me = this,
          zoom = Math.ceil(Math.log(Math.max(options.width, options.height)) / Math.LN2),
          bottomRightInLimit = me._zoomBy({
            column: options.width,
            row: options.height,
            zoom: zoom
          }, -8),
          groups = [],
          i = 0,
          topLeftOutLimit = {
            column: 0,
            row: 0,
            zoom: 0
          };
          
      me._url = url;
      
      for (var c = {
        column: 0,
        row: 0,
        zoom: 0
      }; c.zoom <= bottomRightInLimit.zoom; c.zoom += 1) {
        var bri = me._zoomTo(bottomRightInLimit, c.zoom),
            tlo = me._zoomTo(topLeftOutLimit, c.zoom);
            
        for (c.row = tlo.row; c.row <= bri.row; c.row += 1) {
          for (c.column = tlo.column; c.column <= bri.column; c.column += 1) {
            if (i % 256 === 0) {
              groups.push({
                column: c.column,
                row: c.row,
                zoom: c.zoom
              });
            }
            
            i += 1;
          }
        }
      }
      
      this._groups = groups;
    }
  });

  if (NPMap.config.baseLayers) {
    Map._matchBaseLayers(DEFAULT_BASE_LAYERS);

    for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
      var baseLayerI = NPMap.config.baseLayers[i];
      
      if (baseLayerI.visible) {
        activeBaseLayer = baseLayerI;

        // TODO: This should be contained in Zoomify layer handler.
        if (baseLayerI.type === 'Zoomify') {
          mapConfig.crs = L.Util.extend({}, L.CRS, {
            code: 'Direct',
            projection: {
              project: function(latlng) {
                return new L.Point(latlng.lng, latlng.lat);
              },
              unproject: function(point, unbounded) {
                return new L.LatLng(point.y, point.x, true);
              }
            },
            transformation: new L.Transformation(1, 0, 1, 0)
          });
          mapConfig.worldCopyJump = false;
        }
        
        break;
      }
    }
  } else if (typeof NPMap.config.baseLayers === 'undefined') {
    NPMap.config.baseLayers = [
      DEFAULT_BASE_LAYERS['streets']
    ];
    NPMap.config.baseLayers[0].visible = true;
    activeBaseLayer = NPMap.config.baseLayers[0];
  } else {
    NPMap.config.baseLayers = [
      DEFAULT_BASE_LAYERS['blank']
    ];
    NPMap.config.baseLayers[0].visible = true;
    activeBaseLayer = NPMap.config.baseLayers[0];
  }
  
  if (typeof NPMap.config.restrictZoom !== 'undefined') {
    if (typeof NPMap.config.restrictZoom.max !== 'undefined') {
      mapConfig.maxZoom = NPMap.config.restrictZoom.max;
    }
    
    if (typeof NPMap.config.restrictZoom.min !== 'undefined') {
      mapConfig.minZoom = NPMap.config.restrictZoom.min;
    }
  } else {
    mapConfig.maxZoom = 19;
    mapConfig.minZoom = 0;
  }
  
  map = new L.Map(NPMap.config.div, mapConfig);

  for (var j = 0; j < NPMap.config.baseLayers.length; j++) {
    var baseLayerJ = NPMap.config.baseLayers[j];

    if (baseLayerJ.visible) {
      if (baseLayerJ.type === 'Api') {
        if (baseLayerJ.mapTypeId !== 'Blank') {
          // TODO: Switch this API key over to the key that is set in NPMap.config.
          baseLayerJ.api = new L.TileLayer.Bing('Ag4-2f0g7bcmcVgKeNYvH_byJpiPQSx4F9l0aQaz9pDYMORbeBFZ0N3C3A5LSf65', {
            type: baseLayerJ.mapTypeId
          });
          map.addLayer(baseLayerJ.api);
        }
      } else {
        NPMap.Layer[baseLayerJ.type].create(baseLayerJ);
      }

      NPMap.Event.trigger('NPMap.Map', 'baselayerchanged');
      break;
    }
  }

  map.on('click', function(e) {
    doubleClicked = false;

    setTimeout(function() {
      if (!doubleClicked) {
        Event.trigger('NPMap.Map', 'click', e);
      }
    }, 350);
  });
  map.on('contextmenu', function(e) {
    Event.trigger('NPMap.Map', 'rightclick', e);
  });
  map.on('dblclick', function(e) {
    doubleClicked = true;

    Event.trigger('NPMap.Map', 'dblclick', e);
  });
  map.on('dragend', function() {
    Map.setCursor('default');
  });
  map.on('dragstart', function() {
    Map.setCursor('move');
  });
  map.on('mousedown', function(e) {
    Event.trigger('NPMap.Map', 'mousedown', e);
  });
  map.on('mouseenter', function(e) {
    Event.trigger('NPMap.Map', 'mouseover', e);
  });
  map.on('mouseleave', function(e) {
    Event.trigger('NPMap.Map', 'mouseout', e);
  });
  map.on('mousemove', function(e) {
    Event.trigger('NPMap.Map', 'mousemove', e);
  });
  map.on('mouseup', function(e) {
    Event.trigger('NPMap.Map', 'mouseup', e);
  });
  map.on('move', function(e) {
    if (NPMap.InfoBox.visible) {
      NPMap.InfoBox.reposition();
    }

    NPMap.Event.trigger('NPMap.Map', 'viewchanging');
  });
  map.on('zoomstart', function() {
    NPMap.Event.trigger('NPMap.Map', 'zoomstart');
  });
  Map._init();
  handleResize();
  
  return NPMap.Map.Leaflet = {
    // The current attribution {Array}.
    _attribution: [],
    // Is the map loaded and ready to be interacted with programatically?
    _isReady: true,
    // The {L.Map} object. This reference should be used to access any of the Leaflet functionality that can't be done through NPMap's API.
    map: map,
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map.
     * @return null
     */
    addShape: function(shape) {
      shape.addTo(map);
    },
    /**
     * Adds a tile layer to the map.
     * @param {Object} layer
     * @return null
     */
    addTileLayer: function(layer) {
      map.addLayer(layer, layer.zIndex === 0);
    },
    /**
     * Sets the bounds of the map.
     * @param {L.LatLngBounds} bounds
     * @return null
     */
    bounds: function(bounds) {
      map.fitBounds(bounds);
    },
    /**
     * Converts an API bounds to a NPMap bounds.
     * @param {Object} bounds
     * @return {Object}
     */
    boundsFromApi: function(bounds) {
      var nw = bounds.getNorthWest(),
          se = bounds.getSouthEast();

      return {
        e: se.lng,
        n: nw.lat,
        s: se.lat,
        w: nw.lng
      };
    },
    /**
     * Converts a NPMap bounds to an API bounds.
     * @param {Object}
     * @return {Object}
     */
    boundsToApi: function(bounds) {
      return new L.LatLngBounds(new L.LatLng(bounds.w, bounds.n), new L.LatLng(bounds.e, bounds.s));
    },
    /**
     * Centers the map.
     * @param {Object} latLng
     * @return null
     */
    center: function(latLng) {
      this.centerAndZoom(latLng, this.getZoom());
    },
    /**
     * Zooms to the center and zoom provided. If zoom isn't provided, the map will zoom to level 17.
     * @param {L.LatLng} latLng
     * @param {Number} zoom
     * @return null
     */
    centerAndZoom: function(latLng, zoom) {
      map.setView(latLng, zoom);
    },
    /**
     * Converts NPMap line options to Leaflet line options.
     * @param {Object} options
     * @return {Object}
     */
    convertLineOptions: function(options) {
      return '"Not yet implemented"';
    },
    /**
     * Converts NPMap marker options to Leaflet marker options.
     * @param {Object} options
     * @return {Object}
     */
    convertMarkerOptions: function(options) {
      return '"Not yet implemented"';
    },
    /**
     * Converts NPMap polygon options to Leaflet polygon options.
     * @param {Object} options
     * @return {Object}
     */
    convertPolygonOptions: function(options) {
      return '"Not yet implemented"';
    },
    /**
     * Creates a line shape.
     * @param {Array} latLngs An array of {L.LatLng} objects.
     * @param {Object} options (Optional) Any additional options to apply to the line.
     * @return {Object}
     */
    createLine: function(latLngs, options) {
      return '"Not yet implemented"';
    },
    /**
     * Creates a marker shape.
     * @param latLng {L.LatLng} Where to place the marker.
     * @param options {Object} (Optional) Any additional options to apply to the marker.
     * @return {Object}
     */
    createMarker: function(latLng, options) {
      return new L.Marker(latLng);
    },
    /**
     * Creates a polygon shape.
     * @param latLngs {Array} (Required) An array of {L.LatLng} objects.
     * @param options {Object} (Optional) Any additional options to apply to the polygon.
     * @return {Object}
     */
    createPolygon: function(latLngs, options) {
      return '"Not yet implemented"';
    },
    /**
     * Creates a tile layer.
     * @param {String/Function} constructor
     * @param {Object} options (Optional)
     * @return {Object}
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
        uriConstructor = function(xy) {
          var template = _.template(constructor),
              uri = template({
                x: xy.x,
                y: xy.y,
                z: map.getZoom()
              });

          if (getSubdomain) {
            uri = uri.replace('{{s}}', getSubdomain());
          }
          
          return uri;
        };
      } else {
        uriConstructor = function(xy) {
          var subdomain = null;

          if (getSubdomain) {
            subdomain = getSubdomain();
          }

          return constructor(xy.x, xy.y, map.getZoom(), options.url ? options.url : null, subdomain);
        };
      }

      return new L.TileLayer.Simple(uriConstructor, options);
    },
    /**
     * Creates a Zoomify layer.
     * @param {Object} config
     * @return {Object}
     */
    createZoomifyLayer: function(config) {
      return new L.TileLayer.Zoomify(config.url, {
        height: config.height,
        width: config.width
      });
    },
    /**
     * Gets a latLng from a click event object.
     * @param {Object} e
     * @return {Object}
     */
    eventGetLatLng: function(e) {
      if (e.latlng) {
        return e.latlng;
      } else {
        return map.mouseEventToLatLng(e);
      }
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
      return map.getBounds();
    },
    /**
     * Gets the center {L.LatLng} of the map.
     * @return {Object}
     */
    getCenter: function() {
      return map.getCenter();
    },
    /**
     * Returns the {L.LatLng} for the #npmap-clickdot div.
     * @return {Object}
     */
    getClickDotLatLng: function() {
      return this.pixelToLatLng(this.getClickDotPixel());
    },
    /**
     * Returns the {L.Point} for the #npmap-clickdot div.
     * @return {Object}
     */
    getClickDotPixel: function() {
      var offset = Util.getOffset(document.getElementById('npmap-map')),
          position = Util.getOffset(document.getElementById('npmap-clickdot'));

      return new L.Point(position.left - offset.left, position.top - offset.top);
    },
    /**
     * Gets the map element.
     * @return {Object}
     */
    getMapElement: function() {
      return document.getElementById('npmap-map');
    },
    /**
     * Gets the latLng (L.LatLng) of the marker.
     * @param {Object} marker The marker to get the latLng for.
     * @return {Object}
     */
    getMarkerLatLng: function(marker) {
      return marker.getLatLng();
    },
    /**
     * Gets the maximum zoom level for this map.
     * @return {Number}
     */
    getMaxZoom: function() {
      return mapConfig.maxZoom;
    },
    /**
     * Gets the minimum zoom level for this map.
     * @return {Number}
     */
    getMinZoom: function() {
      return mapConfig.minZoom;
    },
    /**
     * Gets the zoom level of the map.
     * @return {Number}
     */
    getZoom: function() {
      return map.getZoom();
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     * @param {Function} callback
     * @return null
     */
    handleResize: function(callback) {
      handlResize();
      
      if (callback) {
        callback();
      }
    },
    /**
     * Returns true if the input latLng is contained within the current map bounds.
     * @param {L.LatLng} latLng
     * @return {Boolean}
     */
    isLatLngWithinMapBounds: function(latLng) {
      return this.getBounds().contains(latLng);
    },
    /**
     * Converts a {L.LatLng} to a NPMap lat/lng object.
     * @param latLng {L.LatLng} The object to convert.
     * @return {Object} An NPMap lat/lng object.
     */
    latLngFromApi: function(latLng) {
      return {
        lat: latLng.lat,
        lng: latLng.lng
      };
    },
    /**
     * Converts a lat/lng object to a L.LatLng object.
     * @param {Object} latLng The lat/lng to convert.
     * @return {Object}
     */
    latLngToApi: function(latLng) {
      return new L.LatLng(latLng.lat, latLng.lng);
    },
    /**
     * Converts a {L.LatLng} to a {L.Point}.
     * @param {Object} latLng
     * @return {Object}
     */
    latLngToPixel: function(latLng) {
      return map.latLngToContainerPoint(latLng);
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     * @param {Function} callback (Optional)
     * @return null
     */
    panByPixels: function(pixels, callback) {
      map.panBy(new L.Point(-pixels.x, -pixels.y));

      if (callback) {
        function callbackPanByPixels() {
          map.off('moveend', callbackPanByPixels);
          callback();
        }

        map.on('moveend', callbackPanByPixels);
      }
    },
    /**
     * Turns a {L.Point} to a NPMap pixel object.
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
     * Converts a NPMap pixel object to a {L.Point}.
     * @param {Object} pixel
     * @return {Object}
     */
    pixelToApi: function(pixel) {
      return new L.Point(pixel.x, pixel.y);
    },
    /**
     * Converts a {L.Point} to a {L.LatLng}.
     * @param {L.Point} pixel
     * @return {Object}
     */
    pixelToLatLng: function(pixel) {
      return map.containerPointToLatLng(pixel);
    },
    /**
     * Positions the #npmap-clickdot div on top of the {L.Marker} or {L.LatLng} that is passed in.
     * @param {Object} to The {L.Marker} or {L.LatLng} to position the div onto.
     * @return null
     */
    positionClickDot: function(to) {
      var clickDot = document.getElementById('npmap-clickdot'),
          latLng = (function() {
            var latLng = null;

            if (typeof(to) === 'string') {
              to = to.split(',');
              latLng = new L.LatLng(parseFloat(to[0]), parseFloat(to[1]));
            } else {
              if (typeof to.lat === 'number') {
                latLng = new L.LatLng(to.lat, to.lng);
              } else {
                latLng = to.getLatLng();
              }
            }
            
            return latLng;
          })(),
          pixel = this.latLngToPixel(latLng);

      clickDot.style.left = pixel.x + 'px';
      clickDot.style.top = pixel.y + 'px';
    },
    /**
     * Removes a tile layer from the map.
     * @param {Object} layer
     * @return null
     */
    removeTileLayer: function(layer) {
      map.removeLayer(layer);
    },
    /**
     * Sets the initial center of the map.
     * @param {Object} center
     * @return null
     */
    setInitialCenter: function(center) {
      initialCenter = center;
      NPMap.config.center = {
        lat: center.lat,
        lng: center.lng
      };
    },
    /**
     * Sets the initial zoom of the map.
     * @param {Number} zoom
     * @return null
     */
    setInitialZoom: function(zoom) {
      zoom = NPMap.config.zoom = zoom;
    },
    /**
     * Sets zoom restrictions on the map.
     * @param {Object} restrictions
     * @return null
     */
    setZoomRestrictions: function(restrictions) {
      NPMap.config.restrictZoom = NPMap.config.restrictZoom || {};
      
      if (restrictions.max) {
        NPMap.config.restrictZoom.max = max;
      }
      
      if (restrictions.min) {
        NPMap.config.restrictZoom.min = min;
      }
      
      // TODO: Cannot currently set zoom restrictions dynamically using Leaflet API.
    },
    /**
     * Switches the base map.
     * @param {Object} baseLayer The base layer to switch to.
     * @return null
     */
    switchBaseLayer: function(baseLayer) {
      var api,
          cls = baseLayer.cls,
          mapTypeId,
          me = this,
          removeAttribution = [];

      for (var k = 0; k < NPMap.config.baseLayers.length; k++) {
        var bl = NPMap.config.baseLayers[k];

        if (bl.visible) {
          activeBaseLayer = bl;
        }

        bl.visible = false;
      }

      if (activeBaseLayer.type === 'Api') {
        if (activeBaseLayer.mapTypeId !== 'Blank') {
          map.removeLayer(activeBaseLayer.api);
          delete activeBaseLayer.api;
        }
      } else {
        NPMap.Layer[activeBaseLayer.type].remove(activeBaseLayer);
      }

      activeBaseLayer = baseLayer;

      if (cls) {
        cls = cls.toLowerCase();
      }

      if (baseLayer.type === 'Api') {
        if (baseLayer.mapTypeId !== 'blank') {
          baseLayer.api = new L.TileLayer.Bing('Ag4-2f0g7bcmcVgKeNYvH_byJpiPQSx4F9l0aQaz9pDYMORbeBFZ0N3C3A5LSf65', {
            type: baseLayer.mapTypeId
          });
          map.addLayer(baseLayer.api);
        }
      } else {
        NPMap.Layer[baseLayer.type].create(baseLayer);
      }

      baseLayer.visible = true;

      NPMap.Event.trigger('NPMap.Map', 'baselayerchanged');
    },
    /**
     * Zooms the map to a {L.LatLngBounds}.
     * @param {Object} bounds
     * @return null
     */
    toBounds: function(bounds) {
      map.fitBounds(bounds);
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     * @return null
     */
    toInitialExtent: function() {
      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.hide();
      }
      map.setView(initialCenter, initialZoom);
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
      var bounds = new L.LatLngBounds(),
          me = this;

      for (var i = 0; i < markers.length; i++) {
        bounds.extend(me.getMarkerLatLng(markers[i]));
      }

      this.toBounds(bounds);
    },
    /**
     * Zooms the map to a zoom level.
     * @param {Number} zoom
     * @return null
     */
    zoom: function(zoom) {
      map.setView(this.getCenter(), zoom);
    },
    /**
     * Zooms the map in by one zoom level.
     * @return null
     */
    zoomIn: function() {
      map.zoomIn();
    },
    /**
     * Zooms the map out by one zoom level.
     * @return null
     */
    zoomOut: function() {
      map.zoomOut();
    }
  };
});