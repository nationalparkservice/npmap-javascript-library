define([
  '../../layers/arcgisserverrest.js'
], function(arcgisserverrest) {
  var identifyLayers = 0;

  NPMap.Event.add('NPMap.Map', 'click', function(e) {
    if (identifyLayers > 0) {
      var map = NPMap.bing.map.Map,
          bounds = map.getBounds(),
          latLng = map.tryPixelToLocation(new Microsoft.Maps.Point(e.getX(), e.getY())),
          nw = bounds.getNorthwest(),
          se = bounds.getSoutheast();
      
      NPMap.InfoBox.hide();
      NPMap.InfoBox.latLng = NPMap.bing.map.latLngToString(latLng);
      NPMap.bing.map.positionClickDot(latLng);
      NPMap.layers.ArcGisServerRest.doIdentify(latLng.latitude, latLng.longitude, map.getHeight(), map.getWidth(), nw.latitude, se.longitude, se.latitude, nw.longitude);
    }
  });
  
  NPMap.bing.layers = NPMap.bing.layers || {};

  return NPMap.bing.layers.ArcGisServerRest = {
    addLayer: function(layer) {
      if (!layer.name) {
        NPMap.utils.throwError('All "ArcGisServerRest" layers must have a name.');
      }
      
      if (!layer.url) {
        NPMap.utils.throwError('All "ArcGisServerRest" layers must have a url.');
      }

      // TODO: This shouldn't be necessary.
      if (identifyLayers < 0) {
        identifyLayers = 0;
      }
      
      var identifiable = false,
          url = layer.url,
          tileSource = new Microsoft.Maps.TileSource({
            height: 256,
            uriConstructor: function(tile) {
              var x = tile.x,
                  y = tile.y,
                  zoom = tile.levelOfDetail;
              
              if (layer.tiled) {
                return url + '/tile/' + zoom + '/' + y + '/' + x;
              } else {
                var tileHeight = 256,
                    tileWidth = 256,
                    e = ((x + 1) * tileWidth) * 360 / (tileWidth * Math.pow(2, zoom)) - 180,
                    n = Math.asin((Math.exp((0.5 - (y * tileHeight) / (tileHeight) / Math.pow(2, zoom)) * 4 * Math.PI) - 1) / (Math.exp((0.5 - (y * tileHeight) / 256 / Math.pow(2, zoom)) * 4 * Math.PI) + 1)) * 180 / Math.PI,
                    s = Math.asin((Math.exp((0.5 - ((y + 1) * tileHeight) / (tileHeight) / Math.pow(2, zoom)) * 4 * Math.PI) - 1) / (Math.exp((0.5 - ((y + 1) * tileHeight) / 256 / Math.pow(2, zoom)) * 4 * Math.PI) + 1)) * 180 / Math.PI,
                    w = (x * tileWidth) * 360 / (tileWidth * Math.pow(2, zoom)) - 180,
                    u = url + '/export?dpi=96&transparent=true&format=png8&bbox=' + w + ',' + s + ',' + e + ',' + n + '&bboxSR=4326&imageSR=102100&size=256,256&f=image';

                if (layer.layers && layer.layers !== 'all') {
                  u += '&layers=show:' + layer.layers;
                }

                return u;
              }
            },
            width: 256
          }),
          tileLayer = new Microsoft.Maps.TileLayer({
            mercator: tileSource,
            opacity: layer.opacity || 1
          });
      
      layer.entity = tileLayer;

      if (typeof layer.identify === undefined || layer.identify !== false) {
        identifyLayers++;
        layer.identifiable = true;
      } else {
        layer.identifiable = false;
      }

      if (typeof layer.visible === undefined || layer.visible !== false) {
        layer.visible = true;
      }

      NPMap.bing.map.Map.entities.push(tileLayer);
    },
    /**
     * Hides the ArcGisServerRest layer.
     * @param {Object} The layer config object of the layer to hide.
     */
    hideLayer: function(layer) {
      NPMap.InfoBox.hide();
      NPMap.bing.map.Map.entities.get(NPMap.bing.map.Map.entities.indexOf(layer.entity)).setOptions({
        visible: false
      });

      if (layer.identifiable === true) {
        identifyLayers--;
      }

      layer.visible = false;
    },
    /**
     * Reloads an ArcGisServerRest layer. Can be used after an edit operation or after a subLayer has been toggled on or off.
     * @param {Object} layer The layer to reload.
     */
    reloadLayer: function(layer) {
      this.removeLayer(layer);
      this.addLayer(layer);
    },
    /**
     * Remove a layer from the map.
     * @param {Object} The layer config object of the layer to remove.
     */
    removeLayer: function(layer) {
      NPMap.InfoBox.hide();
      NPMap.bing.map.Map.entities.removeAt(NPMap.bing.map.Map.entities.indexOf(layer.entity));
      
      if (layer.identifiable === true) {
        identifyLayers--;
      }

      layer.visible = false;
      
      delete layer.entity;
    },
    /**
     * Shows the ArcGisServerRest layer.
     * @param {Object} The layer config object of the layer to show.
     */
    showLayer: function(layer) {
      NPMap.bing.map.Map.entities.get(NPMap.bing.map.Map.entities.indexOf(layer.entity)).setOptions({
        visible: true
      });

      if (layer.identifiable === true) {
        identifyLayers++;
      }

      layer.visible = true;
    }
  };
});