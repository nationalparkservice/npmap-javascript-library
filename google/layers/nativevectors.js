/*
 * This layer handler supports clustered and non-clustered services pulled from various database connections and services.
 */

NPMap.google.layers = NPMap.google.layers || {};
NPMap.google.layers.NativeVectors = (function() {    
    var MERCATOR_RANGE = 256;

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
    function radiansToDegrees(rad) {
        return rad / (Math.PI / 180);
    }
    function MercatorProjection() {
        this.pixelOrigin_ = new google.maps.Point(MERCATOR_RANGE / 2, MERCATOR_RANGE / 2);
        this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
        this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
    }
    MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
        var me = this,
            origin = me.pixelOrigin_,
            point = opt_point || new google.maps.Point(0, 0),
            siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);

        point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;
        point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * - me.pixelsPerLonRadian_;
        
        return point;
    };
    MercatorProjection.prototype.fromPointToLatLng = function(point) {
        var me = this,
            origin = me.pixelOrigin_,
            lng = (point.x - origin.x) / me.pixelsPerLonDegree_,
            latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_,
            lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
      
        return new google.maps.LatLng(lat, lng);
    };

    var clearAllTiles = function() {
            oldTiles.length = 0;

            $.each(NPMap.config.layers, function(i, v) {
                if (v.type === 'NativeVectors') {
                    $.each(v.geometries, function(i2, v2) {
                        // TODO: Figure out why this is needed. Something funky is going on.
                        if (v2 && v2.geometries) {
                            $.each(v2.geometries, function(i3, v3) {
                                v3.setMap(null);
                            });

                            v2.geometries.length = 0;
                        }
                    });
                }
            });
        },
        /**
         * Loads data for one or more NativeVector layers.
         * @param {String} (Optional) clearMap - If clearMap is false, all clearing will be skipped. If clearMap === 'all', all NativeVector markers will be cleared. If clearMap is a string other than 'all' or true, only markers not in a currently visible tile will be cleared. This is the default.
         * @param {Object} (Optional) layer - A NativeVector layer object from the NPMap.config.layers array. If this is passed in, only this layer will be loaded.
         */
        loadData = function(clearMap, layer) {
            // Need to check individual layer that was passed in OR all NativeVector layers to see which are tiled and which aren't.
            // Then go through the process of loading the tiles and overall bounding box.

            var bounds = NPMap.google.map.Map.getBounds(),
                boundsNeLatLng = bounds.getNorthEast(),
                boundsSwLatLng = bounds.getSouthWest(),
                nonTiledLayers = [],
                tiledLayers = [];
            
            if (clearMap === 'all') {
                clearAllTiles();
            } else {
                clearMap = clearMap || true;
            }

            if (layer) {
                if (layer.tiled) {
                    tiledLayers.push(layer);
                } else {
                    nonTiledLayers.push(layer);
                }
            } else {
                $.each(NPMap.config.layers, function(i, v) {
                    if (v.type === 'NativeVectors' && v.active && !v.hidden) {
                        if (v.tiled) {
                            tiledLayers.push(v);
                        } else {
                            nonTiledLayers.push(v);
                        }
                    }
                });
            }
            
            if (nonTiledLayers.length > 0) {
                if (clearMap && clearMap != 'all') {
                    $.each(nonTiledLayers, function(i, v) {
                        for (j in v.geometries) {
                            $.each(v.geometries[j].geometries, function(i2, v2) {
                                v2.setMap(null);
                            });

                            delete v.geometries[j];
                        }
                    });
                }

                if (layer) {
                    var parameter = layer.parameter || null;

                    NPMap.layers.TiledVectors.loadData(sw.lat(), ne.lng(), layer.name, ne.lat(), sw.lng(), NPMap.google.map.Map.getZoom(), parameter);
                } else {
                    $.each(nonTiledLayers, function(i, v) {
                        var parameter = v.parameter || null;
                        
                        NPMap.layers.TiledVectors.loadData(sw.lat(), ne.lng(), v.name, ne.lat(), sw.lng(), NPMap.google.map.Map.getZoom(), parameter);
                    });
                }
            }

            if (tiledLayers.length > 0) {
                var boundingBoxes = [],
                    boundsNwLatLng = new google.maps.LatLng(boundsNeLatLng.lat(), boundsSwLatLng.lng()),
                    boundsSeLatLng = new google.maps.LatLng(boundsSwLatLng.lat(), boundsNeLatLng.lng()),
                    groupLayers = [],
                    newTiles = [],
                    zoom = NPMap.google.map.Map.getZoom(),
                    zfactor = Math.pow(2, zoom);
                  
                // TODO: You should really do a better job of this. You need to calculate all of this tile stuff on the server.  
                if (boundsNwLatLng.lng() > 0 && boundsSeLatLng.lng() < 0) {
                    boundsNwLatLng = new google.maps.LatLng(boundsNwLatLng.lat(), -179);
                }

                var tileCoordinateNw = pointToTile(boundsNwLatLng, zoom),
                    tileCoordinateSe = pointToTile(boundsSeLatLng, zoom),
                    tileColumns = tileCoordinateSe.x - tileCoordinateNw.x + 1,
                    tileRows = tileCoordinateSe.y - tileCoordinateNw.y + 1,
                    minX = tileCoordinateNw.x,
                    minY = tileCoordinateNw.y;

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
                                    v2.setMap(null);
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
                            tileId: v,
                            ne: projection.fromPointToLatLng(new google.maps.Point((x * 256) / zfactor, (y * 256) / zfactor)),
                            sw: projection.fromPointToLatLng(new google.maps.Point((x + 1) * 256 / zfactor, ((y + 1) * 256) / zfactor))
                        });
                    }
                });
                $.each(groupLayers, function(i, v) {
                    v.name = v.name.slice(0, v.name.length - 1);
                    
                    $.each(boundingBoxes, function(i2, v2) {
                        NPMap.layers.NativeVectors.loadData(v2.sw.lat(), v2.sw.lng(), v.name, v2.ne.lat(), v2.ne.lng(), NPMap.google.map.Map.getZoom(), v.parameter, v2.tileId, v.query);
                    });
                });
            }
        },
        oldTiles = [],
        oldZoom = NPMap.google.map.Map.getZoom(),
        pointToTile = function(latLng, z){
            var worldCoordinate = projection.fromLatLngToPoint(latLng);
            var pixelCoordinate = new google.maps.Point(worldCoordinate.x * Math.pow(2, z), worldCoordinate.y * Math.pow(2, z));
            var tileCoordinate = new google.maps.Point(Math.floor(pixelCoordinate.x / MERCATOR_RANGE), Math.floor(pixelCoordinate.y / MERCATOR_RANGE));
            return tileCoordinate;
        },
        projection = new MercatorProjection();
    
    google.maps.event.addListener(NPMap.google.map.Map, 'bounds_changed', function() {
        NPMap.InfoBox.hide();
    });
    google.maps.event.addListener(NPMap.google.map.Map, 'center_changed', function() {
        NPMap.InfoBox.hide();
    });
    google.maps.event.addListener(NPMap.google.map.Map, 'click', function() {
        NPMap.InfoBox.hide();
    });
    google.maps.event.addListener(NPMap.google.map.Map, 'dragstart', function() {
        NPMap.InfoBox.hide();
    });
    google.maps.event.addListener(NPMap.google.map.Map, 'idle', loadData);
    google.maps.event.addListener(NPMap.google.map.Map, 'zoom_changed', function() {
        var currentZoom = NPMap.google.map.Map.getZoom();

        if (currentZoom != oldZoom) {
            clearAllTiles();
        }

        oldZoom = currentZoom;
    });

    return {
        addLayer: function(details) {
            // TODO: Need to support nonTiled layers here.

            var added = 0
                i = 0,
                total = 0;
            
            $.each(NPMap.config.layers, function(i, v) {
                if (v.type === 'NativeVectors') {
                    total++;

                    if (v.added) {
                        added++;
                    } else {
                        if (v.name === details.name) {
                            if (typeof(v.active) === 'undefined') {
                                v.active = true;
                            }
                            
                            if (typeof(v.hidden) === 'undefined') {
                                v.hidden = false;
                            }

                            v.added = true;
                            v.geometries = [];

                            added++;
                        }
                    }
                }
            });

            if (added === total) {
                loadData();
            }
        },
        dataToGeometries: function(data) {
            if ($.isArray(data)) {
                $.each(data, function(i, v) {
                    
                });
            } else {
                $.each(NPMap.config.layers, function(i, v) {
                    if (v.type === 'NativeVectors' && data[v.name] && v.active && !v.hidden) {
                        var tile = {
                            geometries: [],
                            tileId: data.tileId
                        };
                        
                        $.each(data[v.name], function(i2, v2) {
                            var geometry = new google.maps.Marker({
                                icon: new google.maps.MarkerImage(NPMap.layers.NativeVectors.buildIconUrl(v.iconUrl, v2.numberPins)),
                                map: NPMap.google.map.Map,
                                position: new google.maps.LatLng(v2.lat, v2.lng)
                            });

                            geometry.content = v2.content;
                            geometry.layer = v;

                            google.maps.event.addListener(geometry, 'click', function(e) {
                                // Show progress bar.
                                
                                NPMap.InfoBox.hide();

                                var overlay = new google.maps.OverlayView();
                                overlay.draw = function() {};
                                overlay.setMap(NPMap.google.map.Map);

                                pixelOffset = overlay.getProjection().fromLatLngToContainerPixel(geometry.getPosition());

                                $('#npmap-clickdot').css({
                                    backgroundColor: 'transparent',
                                    border: 'solid 1px transparent',
                                    left: pixelOffset.x + 'px',
                                    top: (pixelOffset.y - (geometry.icon.size.height / 2) - 2) + 'px'
                                }).show();

                                NPMap.layers.NativeVectors.getInfoBoxData(geometry.content, v);
                            });

                            tile.geometries.push(geometry);
                        });

                        v.geometries.push(tile);
                    }
                });
            }
        },
        reloadLayers: function() {
            loadData('all');
        }
    };
})();