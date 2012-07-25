define([
  'Map/Map'
], function(Map) {
  var bounds,
      currentExtent,
      map,
      max = 19,
      min = 0;

  dojo.require('esri.map');
  dojo.require('esri.geometry');
  dojo.addOnLoad(function() {
    var baseLayer;

    if (NPMap.config.bbox) {
      bounds = NPMap.config.bbox.slice(1, NPMap.config.bbox.length - 1).split(',');
      bounds = new esri.geometry.Extent({
        xmax: parseFloat(bounds[2]),
        xmin: parseFloat(bounds[0]),
        ymin: parseFloat(bounds[1]),
        ymax: parseFloat(bounds[3]),
        spatialReference: {
          wkid: 4326
        }
      });
    } else {
      bounds = new esri.geometry.Extent({
        xmax: -2309009.750438016,
        xmin: -20233187.13519394,
        ymax: 8433755.952870969,
        ymin: 1937220.0448589968,
        spatialReference: {
          wkid: 102100
        }
      });
    }

    currentExtent = bounds;
    map = new esri.Map(NPMap.config.div, {
      extent: bounds,
      logo: false,
      showInfoWindowOnClick: false,
      slider: false,
      wrapAround180: false
    });
    
    if (NPMap.config.baseLayers) {
      for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
        var layer = NPMap.config.baseLayers[i];
        
        if (typeof layer.visible === 'undefined' || layer.visible) {
          if (layer.type === 'ArcGisServerRest') {
            baseLayer = true;
            layer.zIndex = 0;
            NPMap.Util.safeLoad('NPMap.esri.layers.ArcGisServerRest', function() {
              NPMap.esri.layers.ArcGisServerRest.addLayer(layer);
            });
            
            break;
          }
        }
      }
    }
    
    if (!baseLayer) {
      map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer"));
    }
    
    dojo.connect(map, 'onClick', function(e) {
      NPMap.Event.trigger('NPMap.Map', 'click', e);
    });
    dojo.connect(map, 'onExtentChange', function(extent, delta, zoomChanged) {
      currentExtent = extent;

      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.reposition();
      }
    });
    dojo.connect(map, 'onLoad', function() {
      dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
    });
    dojo.connect(map, 'onPan', function(extent, delta) {
      currentExtent = extent;

      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.reposition();

        console.log(extent);
        console.log(NPMap.InfoBox.latLng);
      }
    });

    var interval = setInterval(function() {
      if (NPMap.Map.Esri) {
        clearInterval(interval);

        NPMap.Map.Esri.map = map;
        NPMap.Map.Esri._isReady = true;

        Map._init();
      }
    }, 10);
  });
  dojo.ready(function() {
    dojo.declare('esri.layers.WebTileLayer', [esri.layers.TiledMapServiceLayer], {
      constructor: function(urlTemplate, options) {
        var extent = new esri.geometry.Extent({
          xmin: -22041259,
          ymin: -33265069,
          xmax: 22041259,
          ymax: 33265069,
          spatialReference: {
            wkid: 102100
          }
        });

        options = options || {};
        
        this.initialExtent = this.fullExtent = extent;
        this.spatialReference = new esri.SpatialReference({
          wkid: 102100
        });
        this.tileInfo = new esri.layers.TileInfo({
          rows: 256,
          cols: 256,
          origin: {
            x: -20037508.342787,
            y: 20037508.342787
          },
          spatialReference: {
            wkid: 102100
          },
          lods: [{
            level: 0,
            resolution: 156543.033928,
            scale: 591657527.591555
          },{
            level: 1,
            resolution: 78271.5169639999,
            scale: 295828763.795777
          },{
            level: 2,
            resolution: 39135.7584820001,
            scale: 147914381.897889
          },{
            level: 3,
            resolution: 19567.8792409999,
            scale: 73957190.948944
          },{
            level: 4,
            resolution: 9783.93962049996,
            scale: 36978595.474472
          },{
            level: 5,
            resolution: 4891.96981024998,
            scale: 18489297.737236
          },{
            level: 6,
            resolution: 2445.98490512499,
            scale: 9244648.868618
          },{
            level: 7,
            resolution: 1222.99245256249,
            scale: 4622324.434309
          },{
            level: 8,
            resolution: 611.49622628138,
            scale: 2311162.217155
          },{
            level: 9,
            resolution: 305.748113140558,
            scale: 1155581.108577
          },{
            level: 10,
            resolution: 152.874056570411,
            scale: 577790.554289
          },{
            level: 11,
            resolution: 76.4370282850732,
            scale: 288895.277144
          },{
            level: 12,
            resolution: 38.2185141425366,
            scale: 144447.638572
          },{
            level: 13,
            resolution: 19.1092570712683,
            scale: 72223.819286
          },{
            level: 14,
            resolution: 9.55462853563415,
            scale: 36111.909643
          },{
            level: 15,
            resolution: 4.77731426794937,
            scale: 18055.954822
          },{
            level: 16,
            resolution: 2.38865713397468,
            scale: 9027.977411
          },{
            level: 17,
            resolution: 1.19432856685505,
            scale: 4513.988705
          },{
            level: 18,
            resolution: 0.597164283559817,
            scale: 2256.994353
          },{
            level: 19,
            resolution: 0.298582141647617,
            scale: 1128.497176
          }]
        });

        this.copyright = options.attribution || '';
        this.loaded = true;
        this.tileServers = options.tileServers || [];
        this.urlTemplate = urlTemplate;

        this.onLoad(this);
      },
      getTileUrl: function(level, row, col) {
        return this.urlTemplate(level, row, col);
      }
    });
  });

  return NPMap.Map.Esri = {
    // Is the map loaded and ready to be interacted with programatically?
    _isReady: false,
    // The esri.Map object. This reference should be used to access any of the ArcGIS API for JavaScript functionality that can't be done through the NPMap.Map methods.
    map: null,
    /**
     * Adds a base layer to the map.
     * @param baseLayer An object with id, tiled, url, and visible properties.
     */
    addBaseLayer: function(baseLayer) {
      var layer,
          options = {
            id: baseLayer.code,
            visible: baseLayer.visible
          };

      if (baseLayer.tiled) {
        layer = new esri.layers.ArcGISTiledMapServiceLayer(baseLayer.url, options);
      } else {
        layer = new esri.layers.ArcGISDynamicMapServiceLayer(baseLayer.url, options);
      }
      
      map.addLayer(layer);
      
      return layer;
    },
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map. This can be an esri.geometry.Point, Polygon, or Polyline object.
     */
    addShape: function(shape) {
      
    },
    /**
     * Adds a tile layer to the map.
     * @param {Object} layer
     */
    addTileLayer: function(layer) {
      map.addLayer(layer);
    },
    /**
     * Converts an API bounds to a NPMap bounds.
     * @param {Object} bounds
     * @return {Object}
     */
    boundsFromApi: function(bounds) {
      var ne = this.latLngFromApi(new esri.geometry.Point(bounds.xmax, bounds.ymax, new esri.SpatialReference({
            wkid: 102100
          }))),
          sw = this.latLngFromApi(new esri.geometry.Point(bounds.xmin, bounds.ymin, new esri.SpatialReference({
            wkid: 10200
          })));

      return {
        e: ne.lng,
        n: ne.lat,
        s: sw.lng,
        w: sw.lat
      };
    },
    /**
     * Converts a NPMap bounds to an API bounds.
     * @param {Object}
     * @return {Object}
     */
    boundsToApi: function(bounds) {
      return new esri.geometry.Extent(bounds.w, bounds.s, bounds.e, bounds.n, new esri.SpatialReference({
        wkid: 102100
      }));
    },
    /**
     * Centers the map.
     * @param {Object} latLng
     */
    center: function(latLng) {
      map.centerAt(latLng);
    },
    /**
     * Centers then zooms the map.
     * @param {} latLng The latLng to center the map on.
     * @param {Integer} zoom The zoom level to zoom the map to.
     * @param {Function} callback (Optional) A callback function to call after the map has been centered and zoomed.
     */
    centerAndZoom: function(latLng, zoom, callback) {
      map.centerAndZoom(latLng, zoom);

      if (callback) {
        callback();
      }
    },
    /**
     * Creates an esri.geometry.Polyline object.
     * @param {Array} latLngs An array of {} objects.
     * @param {} options (Optional) Any additional options to apply to the line.
     * @param {Object} data (Optional) An object with key/value pairs of information that need to be stored with the marker. This object will be added to the line.data property.
     * @param {Function} clickHandler (Optional) A function to call when the marker is clicked.
     * @return {esri.geometry.Polyline}
     */
    createLine: function(latLngs, options, data, clickHandler) {
      var json = {
            paths: [
              [
                [-122.68, 45.53],
                [-122.58, 45.55],
                [-122.57, 45.58],
                [-122.53, 45.6]
              ]
            ],
            spatialReference: {
              wkid: 4326
            }
          },
          line = new esri.geometry.Polyline(json);

      return line;
    },
    /**
     * Creates an esri.Graphic object.
     * @param {Object} latLng Where to place the marker.
     * @param {} options (Optional) Any additional options to apply to the marker.
     * @return {esri.geometry.Point}
     */
    createMarker: function(latLng, options, data, clickHandler) {
      return new esri.Graphic(latLng, new esri.symbol.SimpleMarkerSymbol().setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE).setColor(new dojo.Color([255,0,0,0.5])), {"Xcoord":19,"Ycoord":20,"Plant":"Mesa Mint"}, new esri.InfoTemplate("Vernal Pool Locations","Latitude: ${Ycoord}<br/>Longitude: ${Xcoord}<br/>Plant Name:${Plant}"));
    },
    /**
     * Creates an esri.geometry.Polygon object.
     * @param {Array} latLngs An array of {} objects.
     * @param {} options (Optional) Any additional options to apply to the polygon.
     * @param {Object} data (Optional) An object with key/value pairs of information that need to be stored with the polygon. This object will be added to the polygon.data property.
     * @return {esri.geometry.Polygon}
     */
    createPolygon: function(latLngs, options, data) {

    },
    /**
     * Creates a tile layer.
     * @param {Object} config
     * @param {String/Function} constructor
     */
    createTileLayer: function(config, constructor) {
      var uriConstructor;

      if (typeof constructor === 'string') {
        uriConstructor = function(level, row, column) {
          return constructor.replace('{x}', column).replace('{y}', row).replace('{z}', level);
        };
      } else {
        uriConstructor = function(level, row, column) {
          return constructor(column, row, level, config.url);
        };
      }

      return new esri.layers.WebTileLayer(uriConstructor);
    },
    /**
     * Gets a latLng from a click event object.
     * @param {Object} e
     * @return {Object}
     */
    eventGetLatLng: function(e) {
      return e.mapPoint;
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
      return currentExtent;
    },
    /**
     * Gets the center of the map.
     * @param {Number} spatialReference (Optional) The spatial reference to use.
     * @return {esri.geometry.Point}
     */
    getCenter: function(spatialReference) {
      var center = currentExtent.getCenter();

      if (spatialReference === 102100) {
        return center;
      } else {
        return esri.geometry.webMercatorToGeographic(center);
      }
    },
    /**
     * Gets the latLng () of the #npmap-clickdot div element.
     * @return {}
     */
    getClickDotLatLng: function() {
      var divClickDot = document.getElementById('npmap-clickdot');

      return esri.geometry.toMapGeometry(currentExtent, map.width, map.height, new esri.geometry.Point(parseFloat(divClickDot.style.left, 0), parseFloat(divClickDot.style.top, 0)));
    },
    /**
     * Gets the container div.
     * @return {Object}
     */
    getContainerDiv: function() {
      return map.root;
    },
    /**
     * Gets a {} from a {}.
     * @param {} point
     * @return {}
     */
    getLatLngFromPixel: function(point) {
      
    },
    /**
     * Gets the anchor of a marker.
     * @param {} marker The {esri.geometry.Point} to get the anchor for.
     * @return {Object} An object with x and y properties.
     */
    getMarkerAnchor: function(marker) {
      
    },
    /**
     * Gets the icon for a marker.
     * @param {esri.geometry.Point} marker
     * @return
     */
    getMarkerIcon: function(marker) {
      
    },
    /**
     * Gets the latLng () of the marker.
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
      
    },
    /**
     * Gets the visibility property of a marker.
     * @param {Object} marker The marker to check the visibility for.
     */
    getMarkerVisibility: function(marker) {
      
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
     * Returns a {} object for a given latLng.
     * @param {} latLng
     */
    getPixelFromLatLng: function(latLng) {
      
    },
    /**
     * Gets the zoom level of the map.
     * @return {Number}
     */
    getZoom: function() {
      return map.getLevel();
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     */
    handleResize: function() {
      map.resize();
    },
    /**
     * Hides a shape.
     * @param {} or {} or {} shape The shape to hide.
     */
    hideShape: function(shape) {

    },
    /**
     * Tests to see if a marker is within the map's current bounds.
     * @param latLng {Object/String} {Required} The latitude/longitude, either a {esri.geometry.Point} object or a string in "latitude,longitude" format, to test.
     * @return {Boolean}
     */
    isLatLngWithinMapBounds: function(latLng) {
      console.log(map.extent);
      console.log(currentExtent);
      console.log(latLng);
      console.log(currentExtent.contains(latLng));


      return currentExtent.contains(latLng);
    },
    /**
     * Converts an {esri.geometry.Point} object to the NPMap representation of a latitude/longitude string.
     * @param latLng {esri.geometry.Point} The Point object to convert to a string.
     * @return {String} A latitude/longitude string in "latitude,longitude" format.
     */
    latLngFromApi: function(latLng) {
      if (latLng.spatialReference.wkid !== 4326) {
        latLng = esri.geometry.webMercatorToGeographic(latLng);
      }

      return {
        lat: latLng.y,
        lng: latLng.x
      };
    },
    /**
     * Converts a lat/lng string ("latitude/longitude") or object ({x:lng,y:lat}) to a {esri.geometry.Point} object.
     * @param {String/Object} latLng
     * @return {Object}
     */
    latLngToApi: function(latLng) {
      var lat,
          lng;

      if (typeof latLng === 'string') {
        latLng = latLng.split(',');
        lat = latLng[0];
        lng = latLng[1];
      } else {
        lat = latLng.lat;
        lng = latLng.lng;
      }
      
      return esri.geometry.geographicToWebMercator(new esri.geometry.Point(lng, lat, new esri.SpatialReference({
        wkid: 4326
      })));
    },
    /**
     * Iterates through the default base layers and returns a match if it exists.
     * @param {Object} baseLayer The baseLayer object.
     * @return {Object}
     */
    matchBaseLayer: function(baseLayer) {
      
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     */
    panByPixels: function(pixels) {
      var extent = map.extent,
          height = map.height,
          width = map.width,
          center = esri.geometry.toScreenGeometry(extent, width, height, this.getCenter(102100));
          
      map.centerAt(esri.geometry.toMapGeometry(extent, width, height, new esri.geometry.Point(center.x - pixels.x, center.y - pixels.y)));
    },
    panEast: function() {
      map.panRight();
    },
    panNorth: function() {
      map.panUp();
    },
    panSouth: function() {
      map.panDown();
    },
    panWest: function() {
      map.panLeft();
    },
    /**
     * Positions the #npmap-clickdot div on top of the pushpin, lat/lng object, or lat/lng string that is passed in.
     * @param {esri.geometry.Point} OR {String} to The Pushpin, Location, or latitude/longitude string to position the div onto.
     */
    positionClickDot: function(to) {
      var divClickDot = document.getElementById('npmap-clickdot'),
          point = esri.geometry.toScreenGeometry(currentExtent, map.width, map.height, to);

      divClickDot.style.height = '5px';
      divClickDot.style.width = '5px';
      divClickDot.style.backgroundColor = 'red';

      divClickDot.style.left = point.x + 'px';
      divClickDot.style.top = point.y + 'px';
    },
    /**
     * Removes a shape from the map.
     * @param {Object} shape
     */
    removeShape: function(shape) {
      
    },
    /**
     * Sets a marker's options.
     * @param {Object} marker
     * @param {Object} options The options to set. Currently the valid options are: 'class', 'icon', 'label', 'visible', and 'zIndex'.
     */
    setMarkerOptions: function(marker, options) {
      
    },
    /**
     * Shows a shape.
     * @param {} or {} or {} shape The shape to show.
     */
    showShape: function(shape) {
      
    },
    /**
     * Switches the base map.
     * @param {Object} type The base layer to switch to.
     */
    switchBaseLayer: function(to) {
      var active;
      
      for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
        var baseLayer = NPMap.config.baseLayers[i];
        
        if (baseLayer.visible) {
          active = baseLayer;
          break;
        }
      }
      
      if (to.type === 'ArcGisServerRest') {
        NPMap.esri.layers.ArcGisServerRest.hideLayer(active);
      }

      if (active.type === 'ArcGisServerRest') {
        NPMap.esri.layers.ArcGisServerRest.showLayer(to);
      }
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     */
    toInitialExtent: function() {
      map.setExtent(bounds);
    },
    /**
     * Zooms the map to a zoom level.
     * @param {Number} zoom
     */
    zoom: function(zoom) {
      map.setLevel(zoom);
    },
    /**
     * Zooms the map in by one zoom level.
     */
    zoomIn: function() {
      map.setLevel(map.getLevel() + 1);
    },
    /**
     * Zooms the map out by one zoom level.
     */
    zoomOut: function() {
      map.setLevel(map.getLevel() - 1);
    }
  };
});