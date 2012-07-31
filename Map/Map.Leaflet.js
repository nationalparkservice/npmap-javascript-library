// TODO: Hook up attribution for all layers.
define([
  'Map/Map'
], function(Map) {
  wax.leaf=wax.leaf||{};wax.leaf.interaction=function(){function e(){g=!0}var g=!1,f,c;return wax.interaction().attach(function(b){if(!arguments.length)return c;c=b;for(var d=["moveend"],a=0;a<d.length;a++)c.on(d[a],e)}).detach(function(b){if(!arguments.length)return c;c=b;for(var d=["moveend"],a=0;a<d.length;a++)c.off(d[a],e)}).parent(function(){return c._container}).grid(function(){if(!g&&f)return f;var b=c._layers,d=[],a;for(a in b)if(b[a]._tiles)for(var e in b[a]._tiles){var h=wax.u.offset(b[a]._tiles[e]);d.push([h.top,h.left,b[a]._tiles[e]])}return f=d})};

  var
      // The base layer to initialize the map with.
      baseLayer,
      // The center {L.LatLng} to initialize the map with.
      center = NPMap.config.center ? new L.LatLng(NPMap.config.center.lat, NPMap.config.center.lng) : new L.LatLng(39, -96),
      // The {L.Map} object.
      map,
      // The map config object.
      mapConfig = {},
      // The zoom level to initialize the map with.
      zoom = NPMap.config.zoom ? NPMap.config.zoom : 4;

  // Simple projection for "flat" maps. - https://github.com/CloudMade/Leaflet/issues/210#issuecomment-3344944
  // TODO: This should be contained in Zoomify layer handler.
  L.Projection.NoWrap = {
    project: function (latlng) {
      return new L.Point(latlng.lng, latlng.lat);
    },
    unproject: function (point, unbounded) {
      return new L.LatLng(point.y, point.x, true);
    }
  };
  L.CRS.Direct = L.Util.extend({}, L.CRS, {
    code: 'Direct',
    projection: L.Projection.NoWrap,
    transformation: new L.Transformation(1, 0, 1, 0)
  });
  L.TileLayer.Simple = L.TileLayer.extend({
    options: {
      errorTileUrl: NPMap.config.server + '/resources/img/blank-tile.png'
    },
    getTileUrl: function(xy, z) {
      return this._url(xy, z);
    }
  });
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
    getTileUrl: function(xy, z) {
      return this._url + 'TileGroup' + this._coordinateGroup({column:xy.x,row:xy.y,zoom:z}) + '/'+ z + '-' + xy.x + '-' + xy.y + '.jpg';
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
    },
    // Override _createTileProto, as we don't want to set CSS height/width to 256x256.
    _createTileProto: function () {
      var img = this._tileImg = L.DomUtil.create('img', 'leaflet-tile');
      img.galleryimg = 'no';
    }
  });
  
  mapConfig.attributionControl = false;
  mapConfig.center = center;
  mapConfig.zoom = zoom;
  mapConfig.zoomControl = false;

  if (NPMap.config.baseLayers) {
    for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
      var layer = NPMap.config.baseLayers[i];
      
      if (layer.visible) {
        NPMap.Util.safeLoad('NPMap.Layer.' + layer.type, function() {
          NPMap.Layer[layer.type].create(layer);
        });
        
        baseLayer = true;
        
        // TODO: This should be contained in Zoomify layer handler.
        if (layer.type === 'Zoomify') {
          mapConfig.crs = L.CRS.Direct;
          mapConfig.worldCopyJump = false;
        }
        
        break;
      }
    }
  } else {
    // TODO: Initialize the map with a blank baseLayer.

    /*
    NPMap.config.baseLayers = [{
      attribution: '<a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>',
      maxZoom: 17,
      type: 'TileStream',
      url: 'http://{{s}}.tiles.mapbox.com/v3/mapbox.mapbox-light/{{z}}/{{x}}/{{y}}.png'
    }];
    */
  }
  
  if (typeof NPMap.config.restrictZoom !== 'undefined') {
    if (typeof NPMap.config.restrictZoom.max !== 'undefined') {
      mapConfig.maxZoom = NPMap.config.restrictZoom.max;
    }
    
    if (typeof NPMap.config.restrictZoom.min !== 'undefined') {
      mapConfig.minZoom = NPMap.config.restrictZoom.min;
    }
  } else {
    mapConfig.maxZoom = 17;
    mapConfig.minZoom = 0;
  }
  
  map = new L.Map(NPMap.config.div, mapConfig);
  
  if (!baseLayer) {
    baseLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-light/{z}/{x}/{y}.png', {
      attribution: '<a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>',
      maxZoom: 17
    });
    
    map.addLayer(baseLayer);
    NPMap.Map.setAttribution('<a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>');
  }
  
  Map._init();
  
  return NPMap.Map.Leaflet = {
    // Is the map loaded and ready to be interacted with programatically?
    _isReady: true,
    // The {L.Map} object. This reference should be used to access any of the Leaflet functionality that can't be done through NPMap's API.
    map: map,
    /**
     * Adds a tile layer to the map.
     * @param {Object} layer
     */
    addTileLayer: function(layer) {
      map.addLayer(layer);
    },
    center: function(latLng) {
      this.centerAndZoom(latLng, this.getZoom());
    },
    /**
     * Zooms to the center and zoom provided. If zoom isn't provided, the map will zoom to level 17.
     * @param {L.LatLng} latLng
     * @param {Number} zoom
     */
    centerAndZoom: function(latLng, zoom) {
      map.setView(latLng, zoom);
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
        uriConstructor = function(xy, z) {
          constructor = constructor.replace('{{x}}', xy.x).replace('{{y}}', xy.y).replace('{{z}}', z);

          if (getSubdomain) {
            constructor = constructor.replace('{{s}}', getSubdomain());
          }
          
          return constructor;
        };
      } else {
        uriConstructor = function(xy, z) {
          var subdomain = null;

          if (getSubdomain) {
            subdomain = getSubdomain();
          }

          return constructor(xy.x, xy.y, z, options.url ? options.url : null, subdomain);
        };
      }

      return new L.TileLayer.Simple(uriConstructor);
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
     *
     * @return {L.LatLng}
     */
    getCenter: function() {
      return map.getCenter();
    },
    /**
     * Gets the container div.
     */
    getContainerDiv: function() {
      return document.getElementById('npmap');
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
     *
     * @return {Number}
     */
    getZoom: function() {
      return map.getZoom();
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     */
    handleResize: function(callback) {
      map.invalidateSize();
      
      if (callback) {
        callback();
      }
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
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     */
    panByPixels: function(pixels) {
      map.panBy(new L.Point(-pixels.x, -pixels.y));
    },
    /**
     *
     */
    setBounds: function(bounds) {
      map.fitBounds(bounds);
    },
    /**
     * Sets the initial center of the map. This initial center is stored with the map, and is used by the setInitialExtent method, among other things.
     * @param {Object} c
     */
    setInitialCenter: function(c) {
      center = c;
      NPMap.config.center = {
        lat: c.lat,
        lng: c.lng
      };
    },
    /**
     * Sets the initial zoom of the map. This initial zoom is stored with the map, and is used by the setInitialExtent method, among other things.
     * @param {Number} zoom
     */
    setInitialZoom: function(zoom) {
      zoom = NPMap.config.zoom = zoom;
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
      
      // TODO: Cannot currently set zoom restrictions dynamically using Leaflet API.
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     */
    toInitialExtent: function() {
      map.setView(center, zoom);
    },
    /**
     * Zooms the map in by one zoom level.
     */
    zoomIn: function() {
      map.zoomIn();
    },
    /**
     * Zooms the map out by one zoom level.
     */
    zoomOut: function() {
      map.zoomOut();
    }
  };
});