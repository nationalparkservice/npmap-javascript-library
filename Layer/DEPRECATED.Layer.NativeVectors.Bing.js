define([
  '../../layers/nativevectors.js'
], function(nativevectors) {
  /* Begin MercatorProjection */
  function bound(value, opt_min, opt_max) {
    if (opt_min != null) {
      value = Math.max(value, opt_min);
    }
    
    if (opt_max != null) {
      value = Math.min(value, opt_max);
    }
    
    return value;
  }
  function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
  }
  function MercatorProjection() {
    this.pixelOrigin_ = new Microsoft.Maps.Point(256 / 2, 256 / 2);
    this.pixelsPerLonDegree_ = 256 / 360;
    this.pixelsPerLonRadian_ = 256 / (2 * Math.PI);
  }
  function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
  }

  MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
    var me = this,
        origin = me.pixelOrigin_,
        point = opt_point || new Microsoft.Maps.Point(0, 0),
        siny = bound(Math.sin(degreesToRadians(latLng.latitude)), -0.9999, 0.9999);

    point.x = origin.x + latLng.longitude * me.pixelsPerLonDegree_;
    point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * - me.pixelsPerLonRadian_;
    
    return point;
  };
  MercatorProjection.prototype.fromPointToLatLng = function(point) {
    var me = this,
        origin = me.pixelOrigin_,
        latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;

    return new Microsoft.Maps.Location(radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2), (point.x - origin.x) / me.pixelsPerLonDegree_);
  };
  /* End MercatorProjection */

  var // The center {Microsoft.Maps.Location} of the map after the last 'viewchange'.
      oldCenter = NPMap.bing.map.Map.getCenter(),
      // An array of the tileIds that were loaded after the last 'viewchange'.
      oldTiles = [],
      // The zoom {Number} of the map after the last 'viewchange'.
      oldZoom = Math.round(NPMap.bing.map.Map.getZoom()),
      // The {MercatorProjection} object. Used to do reprojections.
      projection = new MercatorProjection();

  // Clears all NativeVectors markers/tiles off the map.
  function clearAllData() {
    oldTiles.length = 0;

    $.each(NPMap.config.layers, function(i, v) {
      if (v.type === 'NativeVectors' && !v.preload) {
        clearDataForLayer(v);
      }
    });
  }
  // Clears all of a layer's NativeVectors markers/tiles off the map.
  function clearDataForLayer(layer) {
    if (layer.geometries) {
      $.each(layer.geometries, function(i, v) {
        if (v && v.geometries && v.geometries.length > 0) {
          $.each(v.geometries, function(i2, v2) {
            NPMap.bing.map.Map.entities.removeAt(NPMap.bing.map.Map.entities.indexOf(v2));
          });

          v.geometries.length = 0;
        }
      });
    }
  }
  /**
   * Creates a Bing Maps marker.
   * @param {Object} layer
   * @param {Object} data
   */
  function createMarker(layer, data) {
    var size = typeof(data.numberPins) === 'undefined' ? 13 : NPMap.layers.NativeVectors.getIconSize(data.numberPins),
        visible = data.visible;
        marker = NPMap.bing.map.createMarker(new Microsoft.Maps.Location(data.lat, data.lng), {
          anchor: new Microsoft.Maps.Point(size / 2, size / 2),
          height: size,
          icon: typeof(layer.iconUrl) === 'string' ? layer.iconUrl.replace('{size}', size) : layer.iconUrl(data),
          visible: typeof(visible) === 'undefined' ? true : visible,
          width: size
        }, data);
          
    // TODO: marker.content should be stored in the data object.
    marker.content = data.content;
    marker.data.layerName = layer.name;
    marker.data.layerType = 'NativeVectors';

    // TODO: highlightIconUrl should also be supported in Kml layerHandler. 
    if (layer.highlightIconUrl) {
      marker.highlightIconUrl = layer.highlightIconUrl;
    }

    NPMap.bing.map.Map.entities.push(marker);

    return marker;
  }
  /**
    * Loads data for one or more NativeVector layers.
    * @param {String} (Optional) clearMap If clearMap is false, all clearing will be skipped. If clearMap === 'all', all NativeVector markers will be cleared. If clearMap is a string other than 'all' or true, only markers not in a currently visible tile (for tiled layers) will be cleared or all geometries (for non-tiled layers) will be cleared. This is the default.
    * @param {Object} (Optional) layer A NativeVector layer object from the NPMap.config.layers array. If this is passed in, only this layer will be loaded.
    */
  function loadData(clearMap, layer) {
    var nonTiledLayers = [],
        tiledLayers = [],
        zoom = Math.round(NPMap.bing.map.Map.getZoom());
        
    // TODO: Should clearMap === true clear all and clearMap === false clear none and clearMap not set just use default clear behavior? This need to be clearified.
    clearMap = clearMap || true;

    if (clearMap === 'all') {
      clearAllData();
    }

    if (layer) {
      if (clearMap === true) {
        clearDataForLayer(layer);
      }
          
      if (layer.tiled) {
        tiledLayers.push(layer);
      } else {
        if (!layer.preload) {
          nonTiledLayers.push(layer);
        }
      }
    } else {
      $.each(NPMap.config.layers, function(i, v) {
        if (v.type === 'NativeVectors' && v.active && !v.hidden && !v.preload) {
          if (v.tiled) {
            tiledLayers.push(v);
          } else {
            nonTiledLayers.push(v);
          }
        }
      });
    }

    if (nonTiledLayers.length > 0) {
      // TODO: Combine requests into a single request for layers with identical configurations. 
      $.each(nonTiledLayers, function(i, v) {
        if (clearMap && clearMap != 'all' && !v.preload) {
          clearDataForLayer(v);
        }
            
        var bounds = NPMap.bing.map.Map.getBounds(),
            nw = bounds.getNorthwest(),
            se = bounds.getSoutheast(),
            options = {
              brLat: se.latitude,
              brLng: se.longitude,
              s: v.name,
              tlLat: nw.latitude,
              tlLng: nw.longitude,
              z: zoom
            };

        NPMap.layers.NativeVectors.loadData('http://maps.nps.gov/clustercache/get', options);
      });
    }

    if (tiledLayers.length > 0) {
      var boundingBoxes = [],
          bounds = NPMap.bing.map.Map.getBounds(),
          boundsNwLatLng = bounds.getNorthwest(),
          boundsSeLatLng = bounds.getSoutheast(),
          groupLayers = [],
          newTiles = [],
          tileCoordinateNw = latLngToTile(boundsNwLatLng, zoom),
          tileCoordinateSe = latLngToTile(boundsSeLatLng, zoom)
          minX = tileCoordinateNw.x,
          minY = tileCoordinateNw.y,
          tileColumns = tileCoordinateSe.x - tileCoordinateNw.x + 1,
          tileRows = tileCoordinateSe.y - tileCoordinateNw.y + 1,
          zfactor = Math.pow(2, zoom);

      while (tileRows--) {
        while (tileColumns--) {
          newTiles.push((minX + tileColumns) + ',' + minY);
        }

        minY++;
        tileColumns = tileCoordinateSe.x - tileCoordinateNw.x + 1;
      }

      if (clearMap && clearMap != 'all') {
        var removedIds = [];

        $.each(oldTiles, function(i, v) {
          var found = false;

          for (var j = 0; j < newTiles.length; j++) {
            if (v === newTiles[j]) {
              found = true;
              break;
            }
          }

          if (!found) {
            removedIds.push(v);
          }
        });
        $.each(removedIds, function(i, v) {
          for (var j = 0; j < oldTiles.length; j++) {
            if (oldTiles[j] === v) {
              oldTiles.splice(j, 1);
              break;
            }
          }
        });
        $.each(tiledLayers, function(i, v) {
          for (j in v.geometries) {
            if ($.inArray(v.geometries[j].tileId, removedIds) !== -1) {
              $.each(v.geometries[j].geometries, function(i2, v2) {
                NPMap.bing.map.Map.entities.removeAt(NPMap.bing.map.Map.entities.indexOf(v2));
              });

              delete v.geometries[j];
            }
          }
        });
      }

      // TODO: You need to check to make sure that the identify configs are *exactly the same before grouping layers. If they aren't, the identify won't work correctly.
      // TODO: You also need to verify that the query parameter (if it exists) is exactly the same.
      $.each(tiledLayers, function(i, v) {
        var found = false,
            i = 0,
            parameter = v.parameter || null,
            query = v.query || null;

        for (i; i < groupLayers.length; i++) {
          if (groupLayers[i].parameter === parameter) {
            found = true;
            groupLayers[i].name += v.name + ',';
            break;
          }
        }

        if (!found) {
          groupLayers.push({
            name: v.name + ',',
            parameter: parameter,
            query: query
          });
        }
      });
      $.each(newTiles, function(i, v) {
        if ($.inArray(v, oldTiles) === -1) {
          var s = v.split(','),
              x = parseInt(s[0]),
              y = parseInt(s[1]);
            
          oldTiles.push(v);
          boundingBoxes.push({
            nw: projection.fromPointToLatLng(new Microsoft.Maps.Point((x * 256) / zfactor, (y * 256) / zfactor)),
            se: projection.fromPointToLatLng(new Microsoft.Maps.Point((x + 1) * 256 / zfactor, ((y + 1) * 256) / zfactor)),
            tileId: v
          });
        }
      });
      $.each(groupLayers, function(i, v) {
        v.name = v.name.slice(0, v.name.length - 1);
            
        $.each(boundingBoxes, function(i2, v2) {
          var options = {
            brLat: v2.se.latitude,
            brLng: v2.se.longitude,
            s: v.name,
            tileId: v2.tileId,
            tlLat: v2.nw.latitude,
            tlLng: v2.nw.longitude,
            z: zoom
          };

          if (v.parameter) {
            options.parameter = v.parameter;
          }

          if (v.query) {
            options.query = (typeof(v.query) === 'function') ? v.query() : v.query;
          }
              
          NPMap.layers.NativeVectors.loadData('http://maps.nps.gov/clustercache/get', options);
        });
      });
    }
  }
  /**
   * Gets the Bing Maps tile coordinate for a given {Microsoft.Maps.Location}.
   * @param {Microsoft.Maps.Location} latLng
   * @param {Number} zoom
   */
  function latLngToTile(latLng, zoom) {
    var worldCoordinate = projection.fromLatLngToPoint(latLng);

    return new Microsoft.Maps.Point(Math.floor((worldCoordinate.x * Math.pow(2, zoom)) / 256), Math.floor((worldCoordinate.y * Math.pow(2, zoom)) / 256));
  }

  // TODO: This Microsoft.Maps.Events handler should be supported by NPMap.Event.
  Microsoft.Maps.Events.addThrottledHandler(NPMap.bing.map.Map, 'viewchangeend', function() {
    var zoom = Math.round(NPMap.bing.map.Map.getZoom());

    if (zoom != oldZoom) {      
      NPMap.layers.NativeVectors.stopAllPendingRequests();
    }

    oldCenter = NPMap.bing.map.Map.getCenter();
    oldZoom = zoom;

    loadData();
  }, 500);
  // TODO: This Microsoft.Maps.Events handler should be supported by NPMap.Event.
  Microsoft.Maps.Events.addHandler(NPMap.bing.map.Map, 'viewchangestart', function() {
    var zoom = NPMap.bing.map.Map.getZoom(),
        zoomRange = NPMap.bing.map.Map.getZoomRange();

    if (zoom > zoomRange.min && zoom < zoomRange.max && zoom != oldZoom && (Math.abs(zoom - oldZoom) > .1)) {
      clearAllData();
    }
  });
  NPMap.Event.add('NPMap.Map', 'layerclick', function(e) {
    var target = e.target;

    if (target && target.data && target.data.layerType === 'NativeVectors') {
      var layer = NPMap.Map.getLayerByName(target.data.layerName);
      
      if (layer.identify) {
        NPMap.InfoBox.hide();

        NPMap.InfoBox.latLng = NPMap.bing.map.latLngFromApi(target.getLocation());
	      NPMap.InfoBox.marker = target;
	      NPMap.bing.map.positionClickDot(target);
	      NPMap.layers.NativeVectors.getInfoBoxData(target, layer);
      }
    }
  });

  NPMap.bing.layers = NPMap.bing.layers || {};
  
  return NPMap.bing.layers.NativeVectors = {
    /*
     * Adds a NativeVectors layer to the map. Can also be called if a layer has already been added to the map, but needs to be "lazy-loaded."
     * @param {Object} layer The layer config object of the layer that is to be added to the map.
     */
    addLayer: function(layer) {
      layer.active = typeof(layer.active) === 'undefined' ? true : layer.active;
      layer.hidden = typeof(layer.hidden) === 'undefined' ? false : layer.hidden;

      if (layer.preload) {
        // TODO: Need to support hidden config here.

        if (layer.active === true) {
          layer.loaded = true;
          
          $.ajax({
            dataType: 'jsonp',
            success: function(data, textStatus, jqXHR) {
              layer.geometries = [];

              $.each(data.d, function(i, v) {
                var obj = {
                  content: v[layer.data.primaryKey],
                  data: {},
                  lat: v[layer.data.latField],
                  lng: v[layer.data.lngField]
                };

                if (layer.preloadVisibilityFilter) {
                  obj.visible = layer.preloadVisibilityFilter(v);
                }

                $.each(v, function(i2, v2) {
                  obj.data[i2] = v2;
                });

                layer.geometries.push(createMarker(layer, obj));
              });
            },
            url: layer.data.url.replace('{callback}', 'callback=?')
          });
        }
      } else {
        var added = 0,
            i = 0,
            total = 0;

        $.each(NPMap.config.layers, function(i, v) {
          if (v.type === 'NativeVectors') {
            total++;

            if (v.added) {
              added++;
            } else {
              if (v.name === layer.name) {
                v.added = true;
                v.geometries = [];

                added++;
              }
            }
          }
        });

        if (added === total) {
          // TODO: Need to support a callback here.
          loadData();
        }
      }
    },
    /**
     * Converts data returned from a NativeVectors clustered call into geometries.
     * @param {Array} data
     */
    dataToGeometries: function(data) {
      $.each(NPMap.config.layers, function(i, v) {
        if (v.type === 'NativeVectors' && data[v.name] && v.active && !v.hidden) {
          var tile = {
            geometries: [],
            tileId: data.tileId
          };

          $.each(data[v.name], function(i2, v2) {
            tile.geometries.push(createMarker(v, v2));
          });

          v.geometries.push(tile);
        }
      });
    },
    /**
     * Reloads all of the NativeVector layers.
     */
    reloadLayers: function() {
      clearAllData();
      loadData();
    }
  };
});