define([
  '../../layers/arcgisserverrest.js'
], function(arcgisserverrest) {
  dojo.require('esri.tasks.identify');
  dojo.connect(NPMap.esri.map.Map, 'onClick', function(e) {
    var latLng = esri.geometry.webMercatorToGeographic(e.mapPoint),
        map = NPMap.esri.map.Map,
        extent = esri.geometry.webMercatorToGeographic(map.extent);
        
    console.log(latLng);
    
    NPMap.InfoBox.hide();
    NPMap.InfoBox.latLng = latLng.y + ',' + latLng.x;
    NPMap.esri.map.positionClickDot(latLng);
    NPMap.layers.ArcGisServerRest.doIdentify(latLng.y, latLng.x, map.height, map.width, extent.ymax, extent.xmax, extent.ymin, extent.xmin);
  });
  dojo.connect(NPMap.esri.map.Map, 'onZoomStart', function(e) {
    NPMap.InfoBox.hide();
  });
  
  NPMap.esri.layers = NPMap.esri.layers || {};
  
  return NPMap.esri.layers.ArcGisServerRest = {
    addLayer: function(layer) {
      if (!layer.url) {
        throw new Error('The layer does not have a URL defined!');
      }
      
      if (typeof layer.visible === 'undefined' || layer.visible) {
        var l;
        
        if (layer.tiled) {
          l = new esri.layers.ArcGISTiledMapServiceLayer(layer.url);
        } else {
          l = new esri.layers.ArcGISDynamicMapServiceLayer(layer.url);
        }
        
        layer.layer = l;
        layer.visible = true;
        
        if (layer.zIndex) {
          NPMap.esri.map.Map.addLayer(l, layer.zIndex);
        } else {
          NPMap.esri.map.Map.addLayer(l);
        }
      }
    },
    /**
     * Hides the ArcGisServerRest layer.
     * @param {Object} The layer config object of the layer to hide.
     */
    hideLayer: function(layer) {
      layer.visible = false;
      
      NPMap.esri.layers.ArcGisServerRest.removeLayer(layer);
    },
    /**
     * Reloads an ArcGisServerRest layer. Can be used after an edit operation or after a subLayer has been toggled on or off.
     * @param {Object} layer The layer to reload.
     */
    reloadLayer: function(layer) {
      NPMap.esri.layers.ArcGisServerRest.hideLayer();
      NPMap.esri.layers.ArcGisServerRest.showLayer();
    },
    /**
     * Remove a layer from the map.
     * @param {Object} The layer config object of the layer to remove.
     */
    removeLayer: function(layer) {
      NPMap.esri.map.Map.removeLayer(layer.layer);
    },
    /**
     * Shows the ArcGisServerRest layer.
     * @param {Object} The layer config object of the layer to show.
     */
    showLayer: function(layer) {
      layer.visible = true;
      
      NPMap.esri.map.Map.addLayer(layer);
    }
  };
});