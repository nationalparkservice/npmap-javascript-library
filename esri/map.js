define([
  NPMap.config.server + '/map.js'
], function(core) {
  var bounds,
      map;

  dojo.require('esri.map');
  dojo.addOnLoad(function() {
    var baseLayer;

    if (NPMap.config.bbox) {
      var boundsString = NPMap.config.bbox.slice(1, NPMap.config.bbox.length - 1).split(',');

      bounds = new esri.geometry.Extent({
          xmax: parseFloat(boundsString[2]),
          xmin: parseFloat(boundsString[0]),
          ymin: parseFloat(boundsString[1]),
          ymax: parseFloat(boundsString[3]),
          spatialReference: {
              wkid: 102100
          }
      });
    }

    /*
    //Add the topographic layer to the map. View the ArcGIS Online site for services http://arcgisonline/home/search.html?t=content&f=typekeywords:service    
        var basemap = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer");
        map.addLayer(basemap);
*/

    map = new esri.Map(NPMap.config.div, {
        extent: bounds,
        logo: false,
        nav: false,
        showInfoWindowOnClick: false,
        slider: false,
        wrapAround180: true
    });

    for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
      var layer = NPMap.config.baseLayers[i];

      if (layer.visible) {
        if (layer.type === 'ArcGisServerRest') {
          // TODO: Add ArcGisServerRest layer via the layer handler.
          baseLayer = new esri.layers.ArcGISTiledMapServiceLayer(baseLayer.url);

          map.addLayer(baseLayer);

          break;
        }
      }
    }

    if (!baseLayer) {
      baseLayer = new esri.layers.ArcGISTiledMapServiceLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer');

      map.addLayer(baseLayer);
    }

    dojo.connect(map, 'onLoad', function() {
      dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
    });

    NPMap.esri.map.Map = map;
    NPMap.esri.map.isReady = true;

    core.init();
  });

  NPMap.esri = NPMap.esri || {};
  
  return NPMap.esri.map = {
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
      
      NPMap.esri.map.Map.addLayer(layer);
      
      return layer;
    },
    isReady: false,
    Map: null,
    panByPixels: function() {

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
    switchBaseLayer: function(to) {
      for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
        var layer = NPMap.config.baseLayers[i];
        
        if (layer.visible) {
          layer.hide();
          break;
        }
      }
      
      for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
        var layer = NPMap.config.baseLayers[i];
        
        if (layer.id === to) {
          layer.show();
          break;
        }
      }
    },
    zoomIn: function() {

    },
    zoomOut: function() {

    },
    zoomToExtent: function() {
      map.setExtent(bounds);
    }
  };
});