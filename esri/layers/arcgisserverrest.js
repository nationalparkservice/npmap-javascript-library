define([
  '../../layers/arcgisserverrest.js'
], function(arcgisserverrest) {
  dojo.require('esri.tasks.identify');
  dojo.connect(NPMap.esri.map.Map, 'onClick', function(e) {
    console.log(e);
    
    var latLng = esri.geometry.webMercatorToGeographic(e.mapPoint),
        map = NPMap.esri.map.Map,
        extent = esri.geometry.webMercatorToGeographic(map.extent);
        
        //bounds = map.getBounds(),
        //latLng = map.tryPixelToLocation(new Microsoft.Maps.Point(e.getX(), e.getY())),
        //nw = bounds.getNorthwest(),
        //se = bounds.getSoutheast();
      
    console.log(extent);
    
    NPMap.InfoBox.hide();
    NPMap.InfoBox.latLng = latLng.y + ',' + latLng.x;
    NPMap.esri.map.positionClickDot(latLng);
    NPMap.layers.ArcGisServerRest.doIdentify(latLng.y, latLng.x, map.height, map.width, extent.ymax, extent.xmax, extent.ymin, extent.xmin);
    
    
    
    
    
    /*
    var count = 0,
        results = [],
        value = .1;
        
    if (NPMap.InfoBox.visible) {
      NPMap.InfoBox.hide();
    }
    
    $('#npmap-clickdot').css({
      left: e.layerX - 2.5,
      top: e.layerY - 2.5
    });
    $.each(NPMap.config.layers, function(i, v) {
      if (v.type === 'ArcGisServerRest') {
        var identify = new esri.tasks.IdentifyTask(v.url),
            parameters = new esri.tasks.IdentifyParameters();
            
        parameters.geometry = e.mapPoint;
        parameters.height = map.height;
        parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
        parameters.mapExtent = map.extent;
        parameters.returnGeometry = false;
        parameters.tolerance = 3;
        parameters.width = map.width;

        count++;
        
        identify.execute(parameters, function(data) {
          results.push({
            data: data,
            layerName: v.name
          });
          
          count--;
        });
      }
    });
    
    var interval = setInterval(function() {
      if (count === 0) {
        console.log(results);
        
        clearInterval(interval);
        NPMap.InfoBox.show(NPMap.layers.ArcGisServerRest.buildInfoBox(results), [
          e.pageX,
          e.pageY
        ]);
      }
    }, 100);
    
    

    //$('#npmapprogressbar').progressbar().fadeIn();
    //$('#npmapprogressbar').progressbar('option', 'value', value);
    
    /*
    var interval = setInterval(function() {
      value = value + .1;

      $('#npmapprogressbar').progressbar('option', 'value', value);

      if (value < 100) {
        if (count === 0) {
          clearInterval(interval);
          //$('#npmapprogressbar').progressbar('option', 'value', 100);
          setTimeout(function() {
            //$('#npmapprogressbar').progressbar().fadeOut();
            NPMap.InfoBox.show(NPMap.layers.ArcGisServerRest.buildInfoBox(results), [
              e.pageX,
              e.pageY
            ]);
          }, 500);
        }
      } else {
        clearInterval(interval);
        //$('#npmapprogressbar').progressbar().fadeOut();
        NPMap.InfoBox.show('Sorry, but the identify operation is taking too long. Zoom in more and try again.', [
          e.pageX,
          e.pageY
        ]);
      }
    }, 5);
    */
  });
  /*
  dojo.connect(NPMap.esri.map.Map, 'onPanStart', function(e) {
    if (NPMap.InfoBox.visible) {
      NPMap.InfoBox.hide();
    }
  });
*/
  dojo.connect(NPMap.esri.map.Map, 'onZoomStart', function(e) {
    if (NPMap.InfoBox.visible) {
      NPMap.InfoBox.hide();
    }
  });
  
  NPMap.esri.layers = NPMap.esri.layers || {};

  return NPMap.esri.layers.ArcGisServerRest = {
    addLayer: function(layer) {
      if (!layer.url) {
        NPMap.utils.throwError('The layer does not have a URL defined!');
      }
      
      if (typeof layer.visible === 'undefined' || layer.visible) {
        var l;
        
        if (layer.tiled) {
          l = new esri.layers.ArcGISTiledMapServiceLayer(layer.url);
          
          console.log(l);
        } else {
          l = new esri.layers.ArcGISDynamicMapServiceLayer(layer.url);
        }
        
        layer.layer = l;
        
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
      
      NPMap.esri.map.Map.removeLayer(layer.layer);
    },
    /**
     * Reloads an ArcGisServerRest layer. Can be used after an edit operation or after a subLayer has been toggled on or off.
     * @param {Object} layer The layer to reload.
     */
    reloadLayer: function(layer) {
      this.hideLayer();
      this.showLayer();
    },
    /**
     * Remove a layer from the map.
     * @param {Object} The layer config object of the layer to remove.
     */
    removeLayer: function(layer) {
      
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