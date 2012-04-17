define([
  '../../layers/arcgisserverrest.js'
], function(arcgisserverrest) {
	/**
   * Adapted from http://google-maps-utility-library-v3.googlecode.com
   */

  // START GENERAL CODE
  function isString(o) {
	  return o && typeof o === 'string';
  }
  // END GENERAL CODE


  // TODO: Move this into Google baseApi script.
  // START ArcGisServerRestService code.
	var G = google.maps,
		  RAD_DEG = Math.PI / 180;
	
	// Start spatial reference
	var NAD83,
		spatialReferences = {},
		WEB_MERCATOR,
		WEB_MERCATOR_AUX,
		WGS84;
	
	function SpatialReference(params) {
		params = params || {};
		
		this.wkid = params.wkid;
		this.wkt = params.wkt;
	}
	
	SpatialReference.prototype.forward = function(lnglat) {
		return lnglat;
	};
	SpatialReference.prototype.getCircum = function() {
		return 360;
	};
	SpatialReference.prototype.inverse = function(coords) {
		return coords;
	};
	SpatialReference.prototype.toJSON = function() {
		return '{' + (this.wkid ? ' wkid:' + this.wkid : 'wkt: \'' + this.wkt + '\'') + '}';
	};
	
	function Geographic(params) {
		params = params || {};
		
		SpatialReference.call(this, params);
	}
	
	Geographic.prototype = new SpatialReference();
	
	NAD83 = new Geographic({
		wkid: 4269
	});
	WGS84 = new Geographic({
		wkid: 4326
	});
	
	function SphereMercator(params) {
		params = params || {};
		
		SpatialReference.call(this, params);
		this.a = (params.semi_major || 6378137.0) / (params.unit || 1);
		this.lamda0 = (params.central_meridian || 0.0) * RAD_DEG;
	}
	
	SphereMercator.prototype.forward = function(lnglat) {
		var phi = lnglat[1] * RAD_DEG;
		var lamda = lnglat[0] * RAD_DEG;
		var E = this.a * (lamda - this.lamda0);
		var N = (this.a / 2) * Math.log((1 + Math.sin(phi)) / (1 - Math.sin(phi)));
		return [E, N];
	};
	SphereMercator.prototype.getCircum = function() {
	  	return Math.PI * 2 * this.a;
	};
	SphereMercator.prototype.inverse = function(coords) {
		var E = coords[0];
		var N = coords[1];
		var phi = Math.PI / 2 - 2 * Math.atan(Math.exp(-N / this.a));
		var lamda = E / this.a + this.lamda0;
		return [lamda / RAD_DEG, phi / RAD_DEG];
	};
	
	WEB_MERCATOR = new SphereMercator({
	  wkid: 102113,
	  semi_major: 6378137.0,
	  central_meridian: 0,
	  unit: 1
	});
	WEB_MERCATOR_AUX = new SphereMercator({
	  wkid: 102100,
	  semi_major: 6378137.0,
	  central_meridian: 0,
	  unit: 1
	});
		
	spatialReferences = {
	  '4326': WGS84,
	  '4269': NAD83,
	  '102113': WEB_MERCATOR,
	  '102100': WEB_MERCATOR_AUX
	};
	  
	SpatialReference.WGS84 = WGS84;
	SpatialReference.NAD83 = NAD83;
	SpatialReference.WEB_MERCATOR = WEB_MERCATOR;
	SpatialReference.WEB_MERCATOR_AUX = WEB_MERCATOR_AUX;
	
	function Projection(tileInfo) {
		this.lods = tileInfo ? tileInfo.lods : null;
		this.spatialReference = tileInfo ? spatialReferences[tileInfo.spatialReference.wkid || tileInfo.spatialReference.wkt] : WEB_MERCATOR;
		
		if (!this.spatialReference) {
			NPMap.utils.throwError('Unsupported Spatial Reference');
		}
		
		this.resolution0 = tileInfo ? tileInfo.lods[0].resolution: 156543.033928;
		this.minZoom = Math.floor(Math.log(this.spatialReference.getCircum() / this.resolution0 / 256) / Math.LN2 + 0.5);
		this.maxZoom = tileInfo ? this.minZoom + this.lods.length - 1 : 20;
		
		if (G.Size) {
			this.tileSize = tileInfo ? new G.Size(tileInfo.cols, tileInfo.rows) : new G.Size(256, 256);
		}
		
		this.scale = Math.pow(2, this.minZoom) * this.resolution0;
		this.originX = tileInfo ? tileInfo.origin.x : -20037508.342787;
		this.originY = tileInfo ? tileInfo.origin.y : 20037508.342787;
		
		if (tileInfo) {
			var ratio;
			
			for (var i = 0; i < tileInfo.lods.length - 1; i++) {
				ratio = tileInfo.lods[i].resolution / tileInfo.lods[i + 1].resolution;
				
				if (ratio > 2.001 || ratio < 1.999) {
			    	//throw new Error('This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2');
			  	}
			}
		}
	}
	
	Projection.prototype.fromLatLngToPoint = function(latlng, point) {
		if (!latlng || isNaN(latlng.lat()) || isNaN(latlng.lng())) {
			return null;
		}
		
		var coords = this.spatialReference.forward([latlng.lng(), latlng.lat()]),
			point = point || new G.Point(0, 0);
		
		point.x = (coords[0] - this.originX) / this.scale;
		point.y = (this.originY - coords[1]) / this.scale;
		
		return point;
	};
	Projection.prototype['fromLatLngToPoint'] = Projection.prototype.fromLatLngToPoint;
	Projection.prototype.fromPointToLatLng = function(pixel, nowrap) {
		if (pixel === null) {
			return null;
		}
		
		var x = pixel.x * this.scale + this.originX,
			y = this.originY - pixel.y * this.scale,
			geo = this.spatialReference.inverse([x, y]);
		
		return new G.LatLng(geo[1], geo[0]);
	};
	Projection.prototype['fromLatLngToPoint'] = Projection.prototype.fromLatLngToPoint;
	Projection.prototype.getScale = function(zoom) {
		var res = 0,
			zoomIdx = zoom - this.minZoom;
		
		if (this.lods[zoomIdx]) {
			res = this.lods[zoomIdx].scale;
		}
		
		return res;
	};
	Projection.WEB_MERCATOR = new Projection();
	// End spatial reference
	
	// Start mapping
	function formatParams(params) {
	  var query = '';
	  	
    if (params) {
	    params.f = params.f || 'json';
	      
      for (var x in params) {
	      if (params.hasOwnProperty(x) && params[x] !== null && params[x] !== undefined) {
	        var val = formatRequestString(params[x]);
	        query += (x + '=' + (escape ? escape(val) : encodeURIComponent(val)) + '&');
	      }
	    }
	  }
	  	
    return query;
	}
	function formatRequestString(o) {
	  var ret;
	  	
	  if (typeof o === 'object') {
	    if ($.isArray(o)) {
	    	ret = [];

	      $.each(o, function(i, v) {
	      	ret.push(formatRequestString(v));
	      });
	      		
	      return '[' + ret.join(',') + ']';
	    } else if (isOverlay_(o)) {
	      	return fromOverlaysToJSON(o);
	    } else if (o.toJSON) {
	      	return o.toJSON();
	    } else {
	      ret = '';
	      
	      for (var x in o) {
	        if (o.hasOwnProperty(x)) {
	          	if (ret.length > 0) {
	            	ret += ', ';
	          	}
	          			
	          	ret += x + ':' + formatRequestString(o[x]);
	        }
	      }
	      
	      return '{' + ret + '}';
	    }
	  }

	  return o.toString();
	}
	function getLayerDefsString(defs) {
	  	var strDefs = '';
	  	
	  	for (var x in defs) {
	    	if (defs.hasOwnProperty(x)) {
	      		if (strDefs.length > 0) {
	        		strDefs += ';';
	      		}
	      
	      		strDefs += (x + ':' + defs[x]);
	    	}
	  	}
	  
	  	return strDefs;
	}
	function setNodeOpacity(node, op) {
		op = Math.min(Math.max(op, 0), 1);
		
		if (node) {
			var st = node.style;
			
			if (typeof st.opacity !== 'undefined') {
				st.opacity = op;
			}
			
			if (typeof st.filters !== 'undefined') {
				st.filters.alpha.opacity = Math.floor(100 * op);
			}
			
			if (typeof st.filter !== 'undefined') {
				st.filter = 'alpha(opacity:' + Math.floor(op * 100) + ')';
			}
		}
	}
	
	function Layer(url) {
		this.definition = null;
		this.url = url;
	}
	
	Layer.prototype.isInScale = function(scale) {
		if (this.maxScale && (this.maxScale > scale)) {
			return false;
		}
		
		if (this.minScale && (this.minScale < scale)) {
			return false;
		}
		
		return true;
	};
	Layer.prototype.load = function() {
		var me = this;
		
		if (this.loaded) {
			return;
		}
		
		$.getJSON(this.url + '?callback=?&f=json', function(data) {
			$.extend(me, data);
			me.loaded = true;
			//triggerEvent(me, 'load');
		});
	};

	function MapService(url, opts) {
		var tks = url.split('/');
		
		this.loaded = false;
		this.name = tks[tks.length - 2].replace(/_/g, ' ');
		this.url = url;
		
		opts = opts || {};
		
		if (opts.delayLoad) {
			var me = this;
			
			window.setTimeout(function() {
				me.loadServiceInfo();
			}, opts.delayLoad * 1000);
		} else {
			this.loadServiceInfo();
		}
	}
	
	MapService.prototype.exportMap = function(p, callback, errback) {
		if (!p || !p.bounds) {
			return;
		}
		
		var bounds = p.bounds,
			defs = p.layerDefinitions,
			layerOpt = p.layerOption || 'show',
			params = {},
			vlayers = p.layerIds;
		
		params.bbox = bounds.getSouthWest().lng() + ',' + bounds.getSouthWest().lat() + ',' + bounds.getNorthEast().lng() + ',' + bounds.getNorthEast().lat();
		params.bboxSR = '4326';
		params.dpi = p.dpi;
		params.f = p.f;
		params.format = p.format;
		params.layerDefs = getLayerDefsString(defs);
		params.layerTimeOptions = p.layerTimeOptions;
		params.size = '' + p.width + ',' + p.height;
		params.transparent = (p.transparent === false ? false : true);
		
		if (p.imageSR) {
		  	if (p.imageSR.wkid) {
		    	params.imageSR = p.imageSR.wkid;
		  	} else {
		    	params.imageSR = '{wkt:' + p.imageSR.wkt + '}';
		  	}
		}
		
		if (defs === undefined) {
			defs = this.getLayerDefs();
		}
		
		if (vlayers === undefined) {
		  	vlayers = this.getVisibleLayerIds();
		}
		
		if (vlayers.length > 0) {
		  	params.layers =  layerOpt + ':' + vlayers.join(',');
		} else {
		  	if (this.loaded && callback) {
		    	callback({
		      		href: null
		    	});
		    	
		    	return;
		  	}
		}
		
		if (p.time) {
		  	params.time = formatTimeString(p.time, p.endTime);
		}
		
		if (params.f === 'image') {
		  	return this.url + '/export?' + formatParams(params);
		} else {
		  	$.getJSON(this.url + '/export', params, function(data) {
		  		if (data.extent) {
		  			data.bounds = fromEnvelopeToLatLngBounds(data.extent);
		  			delete data.extent;
		  			callback(data);
		  		} else {
		  			//handleErr(errback, data.error);
		  		}
		  	});
		}
	};
	MapService.prototype.getLayer = function(nameOrId) {
		var layers = this.layers;
		
		if (layers) {
			$.each(layers, function(i, v) {
				if (nameOrId === v.id) {
					return v;
				}
				
				if (isString(nameOrId) && (v.name.toLowerCase() === nameOrId.toLowerCase())) {
					return v;
				}
			});
		}
		
		return null;
	};
	MapService.prototype.getLayerDefs = function() {
	  	var ret = {};
	  	
	  	if (this.layers) {
	    	$.each(this.layers, function(i, v) {
	    		var layer = v;
	    	
	    		if (layer.definition) {
	    	  		ret[String(layer.id)] = layer.definition;
	    		}
	    	});
	    }
	  	
	  	return ret;
	};
	MapService.prototype.getVisibleLayerIds = function() {
	  	var ret = [];
	  
	  	if (this.layers) {
	    	var layer;

	    	$.each(this.layers, function(i, v) {
	    		layer = v;
	    		
	    		if (layer.subLayers) {
	    			for (var i = 0, c = layer.subLayers.length; i < c; i++) {
	    				if (layer.subLayers[i].visible === false) {
	    					layer.visible = false;
	    					break;
	    				}
	    			}
	    		}
	    	});
	    	
	    	for (var i = 0, c = this.layers.length; i < c; i++) {
	    		layer = this.layers[i];
	    		
	    		if (layer.subLayers && layer.subLayers.length > 0) {
	    			continue;
	    		}
	    		
	    		if (layer.visible === true) {
	    			ret.push(layer.id);
	    		}
	    	}
	    }
	  
	  	return ret;
	};
	MapService.prototype.init = function(json) {
		var me = this;
		
		$.extend(this, json);
    
    if (json.error) {
      // TODO: Throw error and label this service in the legend with an error.
    } else {
      /*
		  if (json.spatialReference.wkt) {
			  this.spatialReference = Util.registerSR(json.spatialReference.wkt);
		  } else {
		  */
			  this.spatialReference = spatialReferences[json.spatialReference.wkid];
		  //}

		  if (json.tables !== undefined) {
			  // v10.0 +
			  $.getJSON(this.url + '/layers?callback=?&f=json', function(data) {
				  me.initLayers(data);
			  });
		  } else {
			  // v9.3
			  me.initLayers(json);
		  }
    }
	};
	MapService.prototype.initLayers = function(json) {
		var c,
			i,
			info,
			layer,
			layers = [],
			me = this,
			tables = [];
		
		this.layers = layers;
		
		if (json.tables) {
			this.tables = tables;
			
			$.each(json.tables, function(i, v) {
				info = v;
				layer = new Layer(me.url + '/' + info.id);
				
				$.extend(layer, info);
				
				tables.push(layer);
			});
		}
		
		$.each(json.layers, function(i, v) {
			info = v;
			layer = new Layer(me.url + '/' + info.id);
			
			$.extend(layer, info);
			
			layer.visible = layer.defaultVisibility;
			
			layers.push(layer);
		});
		
		$.each(layers, function(i, v) {
			layer = v;
			
			if (layer.subLayerIds) {
				layer.subLayers = [];
				
				$.each(layer.subLayerIds, function(i2, v2) {
					var subLayer = v2;
					
					layer.subLayers.push(subLayer);
					
					subLayer.parentLayer = layer;
				});
			}
		});
		
		this.loaded = true;
		
		// triggerEvent(this, 'load');
	};
	MapService.prototype.loadServiceInfo = function() {
		var me = this;
		
		$.getJSON(this.url + '?callback=?&f=json', function(data) {
			me.init(data);
		});
	};
		
	function MapType(tileLayer, opts) {
		var layer;
		
		opts = opts || {};
		
		if (opts.opacity) {
			this.opacity = opts.opacity;
			delete opts.opacity;
		}
		
		$.extend(this, opts);

		layer = new TileLayer(tileLayer, opts);
		
    if (opts.disableCaching) {
      layer.disableCaching = true;
    }

		this.tileLayer = layer;
		this.tiles = {};
		
		if (opts.maxZoom !== undefined) {
			this.maxZoom = opts.maxZoom;
		} else {
			this.maxZoom = Math.max(0, layer.maxZoom);
		}
		
		this.tileSize = new G.Size(256, 256);
		
		if (!this.name) {
			this.name = layer.name;
		}
	}
	
	MapType.prototype.getTile = function(tileCoord, zoom, ownerDocument) {
		var div = ownerDocument.createElement('div'),
			  tileId = '_' + tileCoord.x + '_' + tileCoord.y + '_' + zoom;
		
		if (zoom <= this.tileLayer.maxZoom && zoom >= this.tileLayer.minZoom) {
			var url = this.tileLayer.getTileUrl(tileCoord, zoom);
			
			if (url) {
				var img = ownerDocument.createElement(document.all ? 'img' : 'div');
				
        img.style.border = '0px none';
				img.style.height = '' + this.tileSize.height + 'px';
				img.style.left = '0';
				img.style.margin = '0px';
				img.style.overflow = 'hidden';
				img.style.padding = '0px';
				img.style.position = 'absolute';
				img.style.top = '0';
				img.style.width = '' + this.tileSize.width + 'px';
				
				if (document.all) {
					img.src = url;
				} else {
					img.style.backgroundImage = 'url(' + url + ')';
				}
				
				div.appendChild(img);
				this.tileLayer.tiles[tileId] = img;
				
				if (this.tileLayer.opacity !== undefined) {
					setNodeOpacity(img, this.tileLayer.opacity);
				} else {
					setNodeOpacity(img, this.opacity);
				}
			}
		} else {
			// TODO: Use a div to display "NoData".
		}
		
		this.tiles[tileId] = div;
		div.setAttribute('tid', tileId);
		return div;
	};
	MapType.prototype['getTile'] = MapType.prototype.getTile;
	MapType.prototype.getOpacity = function() {
	  	return this.opacity;
	};
	MapType.prototype.getTileLayers = function() {
	    return this.tileLayers;
	};
	MapType.prototype.releaseTile = function(node) {
		if (node.getAttribute('tid')) {
	    	var tileId = node.getAttribute('tid');
	    	
	    	if (this.tiles[tileId]) {
	      		delete this.tiles[tileId];
	    	}
	    	
	    	if (this.tileLayer.tiles[tileId]) {
	    		delete this.tileLayer.tiles[tileId];
	    	}
	  	}
	};
	MapType.prototype['releaseTile'] = MapType.prototype.releaseTile;
	MapType.prototype.setOpacity = function(op) {
		this.opacity = op;
	  
	  	var tiles = this.tiles;
	  
	  	for (var x in tiles) {
	    	if (tiles.hasOwnProperty(x)) {
	      		var nodes = tiles[x].childNodes;
	      
	      		$.each(nodes, function(i, v) {
	      			setNodeOpacity(v, op);
	      		});
	    	}
	  	}
	};
	
	function TileLayer(service, opts) {
		opts = opts || {};
		
		if (opts.opacity) {
			this.opacity = opts.opacity;
			delete opts.opacity;
		}
		
		$.extend(this, opts);

		this.mapService = (service instanceof MapService) ? service : new MapService(service);
		this.maxZoom = opts.maxZoom || 19;
		this.dynaZoom = opts.dynaZoom || this.maxZoom;
		this.minZoom = opts.minZoom || 0;
		this.name = opts.name || this.mapService.name;
		
		if (this.mapService.loaded) {
			this.init(opts);
		} else {
			var me = this;
			
			G.event.addListenerOnce(this.mapService, 'load', function() {
				me.init(opts);
			});
		}
		
		this.tiles = {};
		this.map = opts.map; // WHERE IS THE MAP?
	}
	
	TileLayer.prototype.getMapService = function() {
		return this.mapService;
	};
	TileLayer.prototype.getOpacity = function() {
		return this.opacity;
	};
	TileLayer.prototype.getTileUrl = function(tile, zoom) {
		var url = '',
			z = zoom - (this.projection ? this.projection.minZoom : this.minZoom);

    if (!isNaN(tile.x) && !isNaN(tile.y) && z >= 0 && tile.x >= 0 && tile.y >= 0) {
			var singleFusedMapCache = this.mapService.singleFusedMapCache,
				  u = this.mapService.url;

      // TODO: Currently defaults to dynamic. You should wait until the information from the service is available and then figure this out.
      if (typeof singleFusedMapCache === 'undefined' || singleFusedMapCache === false || zoom > this.dynaZoom) {
				var numOfTiles = 1 << zoom,
					  params = {
						  'f': 'image'
					  },
					  prj = Projection.WEB_MERCATOR,
					  size = prj.tileSize;
					
				params.bounds = new G.LatLngBounds(prj.fromPointToLatLng(new G.Point(tile.x * (size.width / numOfTiles), (tile.y + 1) * (size.height / numOfTiles))), prj.fromPointToLatLng(new G.Point((tile.x + 1) * (size.width / numOfTiles), tile.y * (size.height / numOfTiles))));
				params.format = 'png32';
				params.height = size.height;
				params.imageSR = prj.spatialReference;
				params.width = size.width;
				
				url = this.mapService.exportMap(params);
			} else {
				url = u + '/tile/' + z + '/' + tile.y + '/' + tile.x;
			}

      if (this.disableCaching) {
        url += '?p=' + new Date().getTime();
      }
			
			return url;
		}
	};
	TileLayer.prototype.init = function(opts) {
		if (this.mapService.tileInfo) {
			this.maxZoom = opts.maxZoom || this.projection.maxZoom;
			this.minZoom = opts.minZoom || this.projection.minZoom;
			this.projection = new Projection(this.mapService.tileInfo);
		}
	};
	TileLayer.prototype.setOpacity = function(op) {
		this.opacity = op;
		
		var tiles = this.tiles;
		
		for (var x in tiles) {
			if (tiles.hasOwnProperty(x)) {
				setNodeOpacity(tiles[x], op);
			}
		}
	};
	// End mapping
	
  NPMap.Event.add('NPMap.Map', 'click', function(e) {
    var map = NPMap.google.map.Map,
        bounds = map.getBounds(),
        ne = bounds.getNorthEast(),
        sw = bounds.getSouthWest();
        
    NPMap.InfoBox.hide();
    NPMap.InfoBox.latLng = NPMap.google.map.latLngToString(e.latLng);
    NPMap.google.map.positionClickDot(e.latLng);
    NPMap.layers.ArcGisServerRest.doIdentify(e.latLng.lat(), e.latLng.lng(), map.getDiv().offsetHeight, map.getDiv().offsetWidth, ne.lat(), ne.lng(), sw.lat(), sw.lng());
  });
  
  NPMap.google.layers = NPMap.google.layers || {};

  return NPMap.google.layers.ArcGisServerRest = {
    /**
     * Adds an ArcGisServerRest layer to the map.
     * @param {Object} layer The layer to add to the map.
     */
    addLayer: function(layer) {
      if (!layer.url) {
        NPMap.utils.throwError('You must specify a url in the layer config for your ArcGisServerRest layer.');
      }

      if (typeof layer.visible === 'undefined' || layer.visible === true) {
        var ags,
            options = {
              name: layer.name,
              opacity: 0.7
            },
            url = layer.url;
            
        if (typeof layer.editable !== undefined) {
          options.disableCaching = true;
        }

        ags = new MapType(url, options);
        
        NPMap.google.map.Map.mapTypes.set(url, ags);
			  NPMap.google.map.Map.overlayMapTypes.insertAt(0, ags);

        layer.service = ags.tileLayer.mapService;
      }
    },
    hideLayer: function(layer) {
      NPMap.google.map.Map.overlayMapTypes.forEach(function(l, i) {
        if (l.name === layer.name) {
          NPMap.google.map.Map.overlayMapTypes.removeAt(i);
        }
      });
      
      layer.visible = false;
    },
    /**
     * Reloads an ArcGisServerRest layer. Can be used after an edit operation or after a subLayer has been toggled on or off.
     * @param {Object} layer The layer to reload.
     */
    reloadLayer: function(layer) {
      this.hideLayer(layer);
      this.showLayer(layer);
    },
    removeLayer: function(layer) {
      this.hideLayer(layer);
    },
    showLayer: function(layer) {
      layer.visible = true;
      NPMap.google.layers.ArcGisServerRest.addLayer(layer);
    }
  };
});