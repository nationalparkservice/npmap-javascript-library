// TODO: Add the ability to bring ArcGisServer tiles in as a single overlay: https://developers.google.com/maps/documentation/javascript/overlays#CustomOverlays
define([
  '../../layers/arcgisserverrest.js'
], function(arcgisserverrest) {
  var ags = (function() {
    var 
        // A {google.maps.MVCArray} of the current overlays.
        agsOverlays = new google.maps.MVCArray(),
        // A local reference to the map.
        map = NPMap.google.map.Map;

    /**
     * @private
     */
    function callback_(fn, obj) {
      var args = [];
      
      for (var i = 2, c = arguments.length; i < c; i++) {
        args.push(arguments[i]);
      }
      
      return function() {
        fn.apply(obj, args);
      };
    }
    /**
     * @private
     */
    function clearOverlay_(overlay) {
      overlay.setMap(null);
      overlay = null;
    }
    /**
     * Helper method to convert an envelope object to <code>google.maps.LatLngBounds</code>.
     * @private
     * @param {Object} extent
     * @return {google.maps.LatLngBounds}
     */
    function fromEnvelopeToLatLngBounds_(extent) {
      var ne,
          sr = spatialReferences_[extent.spatialReference.wkid || extent.spatialReference.wkt],
          sw;

      sr = sr || WGS84;
      ne = sr.inverse([extent.xmax, extent.ymax]),
      sw = sr.inverse([extent.xmin, extent.ymin]);

      return new google.maps.LatLngBounds(new google.maps.LatLng(sw[1], sw[0]), new google.maps.LatLng(ne[1], ne[0]));
    }
    /**
     * Get the layerdef text string from an object literal.
     * @private
     * @param {Object} defs
     * @return {String}
     */
    function getLayerDefsString_(defs) {
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
    /**
     * Set opacity of a node.
     * @private
     * @param {Node} node
     * @param {Number} 0-1
     */
    function setNodeOpacity_(node, op) {
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
          st.filter = "alpha(opacity:" + Math.floor(op * 100) + ")";
        }
      }
    }
    /**
     * Triggers a google.maps.event.
     * @private
     */
    function triggerEvent_(src, evtName, args) {
      google.maps.event.trigger.apply(this, arguments);
    }

    // Projection
    var NAD83,RAD_DEG=Math.PI/180,WEB_MERCATOR,WEB_MERCATOR_AUX,WGS84;function registerSR(wkidt,wktOrSR){var sr=spatialReferences_[""+wkidt];if(sr)return sr;if(wktOrSR instanceof SpatialReference){spatialReferences_[""+wkidt]=wktOrSR;sr=wktOrSR}else{var wkt=wktOrSR||wkidt;var params={"wkt":wkidt};if(wkidt===parseInt(wkidt,10))params={"wkid":wkidt};var prj=extractString_(wkt,'PROJECTION["','"]');var spheroid=extractString_(wkt,"SPHEROID[","]").split(",");if(prj!==""){params.unit=parseFloat(extractString_(extractString_(wkt,"PROJECTION",""),"UNIT[","]").split(",")[1]);
    params.semi_major=parseFloat(spheroid[1]);params.inverse_flattening=parseFloat(spheroid[2]);params.latitude_of_origin=parseFloat(extractString_(wkt,'"Latitude_Of_Origin",',"]"));params.central_meridian=parseFloat(extractString_(wkt,'"Central_Meridian",',"]"));params.false_easting=parseFloat(extractString_(wkt,'"False_Easting",',"]"));params.false_northing=parseFloat(extractString_(wkt,'"False_Northing",',"]"))}switch(prj){case "":sr=new SpatialReference(params);break;case "Lambert_Conformal_Conic":params.standard_parallel_1=
    parseFloat(extractString_(wkt,'"Standard_Parallel_1",',"]"));params.standard_parallel_2=parseFloat(extractString_(wkt,'"Standard_Parallel_2",',"]"));sr=new LambertConformalConic(params);break;case "Transverse_Mercator":params.scale_factor=parseFloat(extractString_(wkt,'"Scale_Factor",',"]"));sr=new TransverseMercator(params);break;case "Albers":params.standard_parallel_1=parseFloat(extractString_(wkt,'"Standard_Parallel_1",',"]"));params.standard_parallel_2=parseFloat(extractString_(wkt,'"Standard_Parallel_2",',
    "]"));sr=new Albers(params);break;default:throw new Error(prj+"  not supported");}if(sr)spatialReferences_[""+wkidt]=sr}return sr}function SpatialReference(params){params=params||{};this.wkid=params.wkid;this.wkt=params.wkt}SpatialReference.prototype.forward=function(lnglat){return lnglat};SpatialReference.prototype.inverse=function(coords){return coords};SpatialReference.prototype.getCircum=function(){return 360};
    SpatialReference.prototype.toJSON=function(){return"{"+(this.wkid?" wkid:"+this.wkid:"wkt: '"+this.wkt+"'")+"}"};function Geographic(params){params=params||{};SpatialReference.call(this,params)}Geographic.prototype=new SpatialReference;function SphereMercator(params){params=params||{};SpatialReference.call(this,params);this.a_=(params.semi_major||6378137)/(params.unit||1);this.lamda0_=(params.central_meridian||0)*RAD_DEG}SphereMercator.prototype=new SpatialReference;
    SphereMercator.prototype.forward=function(lnglat){var phi=lnglat[1]*RAD_DEG;var lamda=lnglat[0]*RAD_DEG;var E=this.a_*(lamda-this.lamda0_);var N=this.a_/2*Math.log((1+Math.sin(phi))/(1-Math.sin(phi)));return[E,N]};SphereMercator.prototype.inverse=function(coords){var E=coords[0];var N=coords[1];var phi=Math.PI/2-2*Math.atan(Math.exp(-N/this.a_));var lamda=E/this.a_+this.lamda0_;return[lamda/RAD_DEG,phi/RAD_DEG]};SphereMercator.prototype.getCircum=function(){return Math.PI*2*this.a_};WGS84=new Geographic({wkid:4326});
    NAD83=new Geographic({wkid:4269});WEB_MERCATOR=new SphereMercator({central_meridian:0,semi_major:6378137,unit:1,wkid:102113});WEB_MERCATOR_AUX=new SphereMercator({central_meridian:0,semi_major:6378137,unit:1,wkid:102100});spatialReferences_={4269:NAD83,4326:WGS84,102100:WEB_MERCATOR_AUX,102113:WEB_MERCATOR};SpatialReference.NAD83=NAD83;SpatialReference.WGS84=WGS84;SpatialReference.WEB_MERCATOR=WEB_MERCATOR;SpatialReference.WEB_MERCATOR_AUX=WEB_MERCATOR_AUX;
    function Projection(tileInfo){this.lods_=tileInfo?tileInfo.lods:null;this.spatialReference_=tileInfo?spatialReferences_[tileInfo.spatialReference.wkid||tileInfo.spatialReference.wkt]:WEB_MERCATOR;if(!this.spatialReference_)throw new Error("unsupported Spatial Reference");this.resolution0_=tileInfo?tileInfo.lods[0].resolution:156543.033928;this.minZoom=Math.floor(Math.log(this.spatialReference_.getCircum()/this.resolution0_/256)/Math.LN2+0.5);this.maxZoom=tileInfo?this.minZoom+this.lods_.length-1:
    20;if(google.maps.Size)this.tileSize_=tileInfo?new google.maps.Size(tileInfo.cols,tileInfo.rows):new google.maps.Size(256,256);this.scale_=Math.pow(2,this.minZoom)*this.resolution0_;this.originX_=tileInfo?tileInfo.origin.x:-2.0037508342787E7;this.originY_=tileInfo?tileInfo.origin.y:2.0037508342787E7;if(tileInfo){var ratio;for(var i=0;i<tileInfo.lods.length-1;i++){ratio=tileInfo.lods[i].resolution/tileInfo.lods[i+1].resolution;if(ratio>2.001||ratio<1.999)throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
    }}}Projection.prototype.fromLatLngToPoint=function(latlng,opt_point){if(!latlng||isNaN(latlng.lat())||isNaN(latlng.lng()))return null;var coords=this.spatialReference_.forward([latlng.lng(),latlng.lat()]);var point=opt_point||new G.Point(0,0);point.x=(coords[0]-this.originX_)/this.scale_;point.y=(this.originY_-coords[1])/this.scale_;return point};
    Projection.prototype.fromPointToLatLng=function(pixel,opt_nowrap){if(pixel===null)return null;var x=pixel.x*this.scale_+this.originX_;var y=this.originY_-pixel.y*this.scale_;var geo=this.spatialReference_.inverse([x,y]);return new G.LatLng(geo[1],geo[0])};Projection.prototype.getScale=function(zoom){var zoomIdx=zoom-this.minZoom;var res=0;if(this.lods_[zoomIdx])res=this.lods_[zoomIdx].scale;return res};Projection.WEB_MECATOR=new Projection;
    
    /**
     * @class MapOverlay
     * @constructor
     * @param {Object} service
     * @param {Object} options
     */
    function MapOverlay(service, options) {
      this.div_ = null;
      this.drawing_ = false;
      this.listeners_ = [];
      this.needsNewRefresh_ = false;
      this.exportOptions = options.exportOptions || {};
      this.layersStatus = options.layersStatus || 'all';
      this.mapService = service instanceof MapService ? service : new MapService(service);
      this.maxZoom = options.maxZoom;
      this.minZoom = options.minZoom;
      this.opacity = options.opacity || 1;
      this.setMap(map);
    }
    MapOverlay.prototype = new google.maps.OverlayView;
    /**
     *
     */
    MapOverlay.prototype.draw = function() {
      if(!this.drawing_ || this.needsNewRefresh_ === true) {
        this.refresh()
      }
    };
    /**
     *
     */
    MapOverlay.prototype.onAdd = function() {
      var me = this;
      this.listeners_.push(google.maps.event.addListener(map, 'bounds_changed', callback_(this.refresh, this)));
      agsOverlays.push(this)
    };
    /**
     *
     */
    MapOverlay.prototype.onRemove = function() {
      for(var i = 0, j = this.listeners_.length;i < j;i++) {
        google.maps.event.removeListener(this.listeners_[i])
      }
      if(this.overlay_) {
        this.overlay_.setMap(null)
      }
      for(var i = 0, c = agsOverlays.getLength();i < c;i++) {
        if(agsOverlays.getAt(i) == this) {
          agsOverlays.removeAt(i);
          break;
        }
      }
    };
    /**
     *
     */
    MapOverlay.prototype.refresh = function() {
      if (this.drawing_ === true) {
        this.needsNewRefresh_ = true;
        return;
      }

      var div = map.getDiv(),
          me = this,
          params = this.exportOptions,
          prj = map.getProjection(),
          sr = WEB_MERCATOR;
      
      if (prj && prj instanceof Projection) {
        sr = prj.spatialReference_
      }

      params.bounds = map.getBounds();
      params.height = div.offsetHeight;
      params.imageSR = sr;
      params.layersStatus = this.layersStatus;
      params.width = div.offsetWidth;

      triggerEvent_(this, 'drawstart');
      
      this.drawing_ = true;

      if (!this.dragging_ && this.overlay_) {
        clearOverlay_(this.overlay_)
      }

      this.mapService.exportMap(params, function(json) {
        me.drawing_ = false;
        
        if (me.needsNewRefresh_ === true) {
          me.needsNewRefresh_ = false;
          me.refresh();
          return
        }

        if (json.href) {
          if (me.overlay_) {
            clearOverlay_(me.overlay_)
          }

          me.overlay_ = new ImageOverlay(json.bounds, json.href, me.opacity_)
        }

        triggerEvent_(me, 'drawend')
      })
    };

    /**
     * @class ImageOverlay
     * @constructor
     * @param {Object} bounds
     * @param {Object} url
     * @param {Object} opacity
     */
    function ImageOverlay(bounds, url, opacity) {
      this.bounds_ = bounds;
      this.div_ = null;
      this.map_ = map;
      this.op_ = opacity;
      this.url_ = url;

      this.setMap(map);
    }
    ImageOverlay.prototype = new google.maps.OverlayView();
    /**
     *
     */
    ImageOverlay.prototype.onAdd = function() {
      var div = document.createElement('div'),
          panes = this.getPanes();

      div.style.border = 'none';
      div.style.borderWidth = '0px';
      div.style.position = 'absolute';
      div.style.backgroundImage = 'url(' + this.url_ + ')';

      this.div_ = div;

      setNodeOpacity_(div, this.op_);
      panes.overlayLayer.appendChild(div);
    };
    /**
     *
     */
    ImageOverlay.prototype.draw = function() {
      var div = this.div_,
          overlayProjection = this.getProjection(),
          ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast()),
          sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());

      div.style.left = sw.x + 'px';
      div.style.top = ne.y + 'px';
      div.style.width = (ne.x - sw.x) + 'px';
      div.style.height = (sw.y - ne.y) + 'px';
    };
    /**
     *
     */
    ImageOverlay.prototype.onRemove = function() {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }

    /**
     * @class MapService
     * @constructor
     * @param {String} url
     */
    function MapService(url) {
      var tokens = url.split('/');

      this.loaded_ = false;
      this.name = tokens[tokens.length - 2].replace(/_/g, ' ');
      this.url = url;

      this.loadServiceInfo_();
    }
    /**
     *
     */
    MapService.prototype.exportMap = function(p, callback, errback) {
      if (!p || !p.bounds) {
        return;
      }

      var bnds = p.bounds,
          defs = p.layerDefinitions || this.getLayerDefs_(),
          layerOpt = p.layerOption || 'show',
          params = {},
          vlayers = p.layersStatus.split(',');

      params.bbox = bnds.getSouthWest().lng() + ',' + bnds.getSouthWest().lat() + ',' + bnds.getNorthEast().lng() + ',' + bnds.getNorthEast().lat();
      params.bboxSR = '4326';
      params.dpi = p.dpi || 96;
      params.f = p.f || 'json';
      //params.format = p.format || 'json';
      params.layerDefs = getLayerDefsString_(defs);
      params.size = p.width + ',' + p.height;
      params.transparent = (p.transparent === false ? false : true);

      if (p.imageSR) {
        if (p.imageSR.wkid) {
          params.imageSR = p.imageSR.wkid;
        } else {
          params.imageSR = '{wkt:' + p.imageSR.wkt + '}';
        }
      }

      if (vlayers.length > 0) {
        params.layers =  layerOpt + ':' + vlayers.join(',');
      } else {
        if (this.loaded_ && callback) {
          callback({
            href: null
          });

          return;
        }
      }

      if (params.f === 'image') {
        return this.url + '/export?' + formatParams_(params);
      } else {
        reqwest({
          data: params,
          success: function(json) {
            if (json.extent) {
              json.bounds = fromEnvelopeToLatLngBounds_(json.extent);

              delete json.extent;

              callback(json); 
            } else {
              handleErr_(errback, json.error);  
            }
          },
          type: 'jsonp',
          url: this.url + '/export'
        });
      }
    };
    /**
     * @private
     */
    MapService.prototype.getLayerDefs_ = function() {
      var ret = {};
      
      if (this.layers) {
        for (var i = 0, c = this.layers.length; i < c; i++) {
          var layer = this.layers[i];
          
          if (layer.definition) {
            ret[String(layer.id)] = layer.definition;
          }
        }
      }

      return ret;
    };
    /**
     * @private
     */
    MapService.prototype.init_ = function(json) {
      if (json.error) {
        NPMap.utils.throwError(json.error.message);
      }

      _.extend(this, json);

      if (json.spatialReference.wkt) {
        this.spatialReference = registerSR(json.spatialReference.wkt);
      } else {
        this.spatialReference = spatialReferences_[json.spatialReference.wkid];
      }

      this.loaded_ = true;
      triggerEvent_(this, 'load');
    };
    /**
     * @private
     */
    MapService.prototype.loadServiceInfo_ = function() {
      var me = this;

      reqwest({
        data: {
          f: 'json'
        },
        success: function(json) {
          me.init_(json);
        },
        type: 'jsonp',
        url: this.url
      });
    };

    return {
      MapOverlay: MapOverlay
    };
  })();
	
  // The number of valid identify layers that have been added to the map and are visible.
  var identifyLayers = 0;
  
  NPMap.Event.add('NPMap.Map', 'click', function(e) {
    if (identifyLayers > 0) {
      var map = NPMap.google.map.Map,
          bounds = map.getBounds(),
          ne = bounds.getNorthEast(),
          sw = bounds.getSouthWest();
        
      NPMap.InfoBox.hide();
      NPMap.InfoBox.latLng = NPMap.google.map.latLngToString(e.latLng);
      NPMap.google.map.positionClickDot(e.latLng);
      NPMap.layers.ArcGisServerRest.doIdentify(e.latLng.lat(), e.latLng.lng(), map.getDiv().offsetHeight, map.getDiv().offsetWidth, ne.lat(), ne.lng(), sw.lat(), sw.lng());
    }
  });
  NPMap.google.map.Map.setOptions({
    draggableCursor: 'pointer'
  });

  NPMap.google.layers = NPMap.google.layers || {};

  return NPMap.google.layers.ArcGisServerRest = {
    /**
     * Adds an ArcGisServerRest layer to the map.
     * @param {Object} layer The layer to add to the map.
     */
    addLayer: function(layer) {
      if (!layer.name) {
        NPMap.utils.throwError('All "ArcGisServerRest" layers must have a name.');
      }
      
      if (!layer.url) {
        NPMap.utils.throwError('All "ArcGisServerRest" layers must have a url.');
      }

      if (typeof layer.visible === 'undefined' || layer.visible === true) {
        var agsLayer,
            interval,
            me = this,
            options = {
              name: layer.name,
              opacity: layer.opacity || 1.0
            };

        layer.gType = layer.tiled ? 'MapType' : 'MapOverlay';
        layer.layersStatus = layer.layersStatus || layer.layers;

        if (typeof layer.edit !== 'undefined') {
          options.disableCaching = true;
        }

        if (typeof layer.identify === 'undefined' || layer.identify !== false) {
          identifyLayers++;
          layer.identifiable = true;
        } else {
          layer.identifiable = false;
        }

        if (layer.gType === 'MapType') {
          agsLayer = new gmaps.ags.MapType(layer.url, options);
			    NPMap.google.map.Map.overlayMapTypes.insertAt(0, ags);
        } else {
          var interval,
              service;
          
          if (layer.layersStatus && layer.layersStatus !== 'all') {
            options.layersStatus = layer.layersStatus;
          }

          agsLayer = new ags.MapOverlay(layer.url, options);
        }

        layer.ags = agsLayer;
        layer.visible = true;
      }
    },
    /**
     * Hides the ArcGisServerRest layer.
     * @param {Object} The layer config object of the layer to hide.
     */
    hideLayer: function(layer) {
      var service = layer.ags.mapService;
      
      if (layer.gType === 'MapType') {
        NPMap.google.map.Map.overlayMapTypes.removeAt(0);
      } else {
        layer.ags.setMap(null);
      }

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
      // TODO: Verify that this method works on both types of gType.
      layer.ags.refresh();
    },
    /**
     * Remove a layer from the map.
     * @param {Object} The layer config object of the layer to remove.
     */
    removeLayer: function(layer) {
      this.hideLayer(layer);
    },
    /**
     * Shows the ArcGisServerRest layer.
     * @param {Object} layer The layer config object of the layer to show.
     * @param {Boolean} allLayers_ Should all layers be toggled on?
     */
    showLayer: function(layer, allLayers_) {
      if (typeof allLayers_ === 'undefined') {
        allLayers_ = true;
      }

      if (allLayers_) {
        layer.layersStatus = layer.layers;
      }

      layer.ags.layersStatus = layer.layersStatus;
      layer.visible = true;
      
      if (layer.gType === 'MapType') {
        NPMap.google.layers.ArcGisServerRest.addLayer(layer);
      } else {
        layer.ags.setMap(NPMap.google.map.Map);
      }

      if (layer.identifiable === true) {
        identifyLayers++;
      }
    },
    /**
     * Toggles a layer's sublayer on or off.
     * @param {Object} layer The layer config object.
     * @param {Integer} subLayerIndex The index of the sublayer.
     * @param {Boolean} on Toggle this layer on?
     */
    toggleSubLayer: function(layer, subLayerIndex, on) {
      if (on && !layer.visible) {
        layer.layersStatus = String(subLayerIndex);
        this.showLayer(layer, false);
      } else {
        layer.ags.layersStatus = layer.layersStatus;
        this.reloadLayer(layer);
      }
    }
  };
});