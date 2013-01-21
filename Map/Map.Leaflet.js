/**
 * @module NPMap.Map.Leaflet
 *
 * The module for the Leaflet base API.
 */
define([
  'Event',
  'Map/Map',
  'Util/Util'
], function(Event, Map, Util) {
  /**
   * wax - 7.0.0dev11 - v6.0.4-113-g6b1c56c, customized a bit to filter out Bing layers and properly set opacity and zIndex on layers.
   */
  wax.leaf={};wax.leaf.interaction=function(){function a(){b=!0}var b=!1,g,d;return wax.interaction().attach(function(j){if(!arguments.length)return d;d=j;for(var b=["moveend"],c=0;c<b.length;c++)d.on(b[c],a)}).detach(function(b){if(!arguments.length)return d;d=b;for(var f=["moveend"],c=0;c<f.length;c++)d.off(f[c],a)}).parent(function(){return d._container}).grid(function(){if(!b&&g)return g;var a=d._layers,f=[],c;for(c in a){var e=a[c]._url;if("undefined"!==typeof e&&("string"===typeof e&&-1===e.indexOf("virtualearth")||"function"===typeof e)&&a[c]._tiles)for(var k in a[c]._tiles)if(e=a[c]._tiles[k],e.src){var h=wax.u.offset(e);f.push([h.top,h.left,e])}}return g=f})};wax.leaf.connector=L.TileLayer.extend({initialize:function(a,b){a=a||{};b=b||{};a.minZoom=a.minzoom||0;a.maxZoom=a.maxzoom||22;a.opacity=b.opacity||1;"number"===typeof b.zIndex&&(a.zIndex=b.zIndex);L.TileLayer.prototype.initialize.call(this,a.tiles[0],a)}});
  /**
   * CartoDb - v0.55, slightly modified by NPS.
   */
  L.CartoDBLayer=L.TileLayer.extend({version:"0.55",includes:L.Mixin.Events,options:{query:"SELECT * FROM {{table_name}}",opacity:0.99,auto_bound:!1,attribution:"CartoDB",debug:!1,visible:!0,added:!1,tiler_domain:"cartodb.com",tiler_port:"80",tiler_protocol:"http",sql_domain:"cartodb.com",sql_port:"80",sql_protocol:"http",extra_params:{},cdn_url:null,subdomains:"abc"},initialize:function(a){L.Util.setOptions(this,a);if(!a.table_name||!a.map){if(a.debug)throw"cartodb-leaflet needs at least a CartoDB table name and the Leaflet map object :(";}else a.auto_bound&&this.setBounds()},onAdd:function(){this._addLayer();this.fire("added");this.options.added=!0},onRemove:function(){this._remove();this.options.added=!1},setOpacity:function(a){if(this.options.added)if(isNaN(a)||1<a||0>a){if(this.options.debug)throw a+" is not a valid value";}else this.options.opacity=a,this.options.visible&&(this.layer.setOpacity(1==a?0.99:a),this.fire("updated"));else if(this.options.debug)throw"the layer is not still added to the map";},setQuery:function(a){if(this.options.added)if(isNaN(a))this.options.query=a,this._update();else{if(this.options.debug)throw a+" is not a valid query";}else if(this.options.debug)throw"the layer is not still added to the map";},setStyle:function(a){if(this.options.added)if(isNaN(a))this.options.tile_style=a,this._update();else{if(this.options.debug)throw a+" is not a valid style";}else if(this.options.debug)throw"the layer is not still added to the map";},setInteractivity:function(a){if(this.options.added)if(isNaN(a))this.options.interactivity=a,this._update();else{if(this.options.debug)throw a+" is not a valid setInteractivity value";}else if(this.options.debug)throw"the layer is not still added to the map";},setLayerOrder:function(){},setInteraction:function(a){if(this.options.added)if(!1!==a&&!0!==a){if(this.options.debug)throw a+" is not a valid setInteraction value";}else{if(this.interaction)if(a){var b=this;this.interaction.on("on",function(a){b._bindWaxOnEvents(b.options.map,a)});this.interaction.on("off",function(){b._bindWaxOffEvents()})}else this.interaction.off("on"),this.interaction.off("off")}else if(this.options.debug)throw"the layer is not still added to the map";},setAttribution:function(a){if(this.options.added)if(isNaN(a))this.options.map.attributionControl.removeAttribution(this.options.attribution),this.options.attribution=a,this.options.map.attributionControl.addAttribution(this.options.attribution),this.layer.options.attribution=this.options.attribution,this.tilejson.attribution=this.options.attribution,this.fire("updated");else{if(this.options.debug)throw a+" is not a valid attribution";}else if(this.options.debug)throw"The layer is still not added to the map";},setOptions:function(a){if(this.options.added)if("object"!=typeof a||a.length){if(this.options.debug)throw a+" options has to be an object";}else L.Util.setOptions(this,a),this._update();else if(this.options.debug)throw"the layer is not still added to the map";},isVisible:function(){return this.options.visible},isAdded:function(){return this.options.added},hide:function(){if(this.options.added)if(this.options.visible)this.layer.setOpacity(0),this.setInteraction(!1),this.options.visible=!1,this.fire("hidden");else{if(this.options.debug)throw"the layer is already hidden";}else if(this.options.debug)throw"the layer is not still added to the map";},show:function(){if(this.options.added)if(this.options.visible){if(this.options.debug)throw"the layer is already shown";}else this.layer.setOpacity(this.options.opacity),this.setInteraction(!0),this.options.visible=!0,this.fire("shown");else if(this.options.debug)throw"the layer is not still added to the map";},_remove:function(){this.setInteraction(!1);this.layer.off("loading").off("load");this.interaction&&this.interaction.remove();this.options.map.removeLayer(this.layer);this.fire("removed")},_update:function(){this._remove();this._addLayer();this.fire("updated")},setBounds:function(a){var b=this,c="",c=a?a:this.options.query;reqwest({url:this._generateCoreUrl("sql")+"/api/v2/sql/?q="+escape("SELECT ST_XMin(ST_Extent(the_geom)) as minx,ST_YMin(ST_Extent(the_geom)) as miny,ST_XMax(ST_Extent(the_geom)) as maxx,ST_YMax(ST_Extent(the_geom)) as maxy from ("+c.replace(/\{\{table_name\}\}/g,this.options.table_name)+") as subq"),type:"jsonp",jsonpCallback:"callback",success:function(a){if(null!=a.rows[0].maxx){var c=a.rows[0],f=c.maxx,g=c.maxy;a=c.minx;c=c.miny;a=-179>a?-179:179<a?179:a;c=-85.0511>c?-85.0511:85.0511<c?85.0511:c;f=new L.LatLng(-85.0511>g?-85.0511:85.0511<g?85.0511:g,-179>f?-179:179<f?179:f);a=new L.LatLng(c,a);a=new L.LatLngBounds(f,a);b.options.map.fitBounds(a)}},error:function(a,b){if(this.options.debug)throw"Error getting table bounds: "+b;}})},_addLayer:function(){var a=this;this.tilejson=this._generateTileJson();this.layer=(new wax.leaf.connector(this.tilejson)).on("loading",function(){a.fire("loading",this)}).on("load",function(){a.fire("load",this)});this._checkTiles();this.options.map.addLayer(this.layer,!1);this.options.interactivity&&(this.interaction=wax.leaf.interaction().map(this.options.map).tilejson(this.tilejson).on("on",function(b){a._bindWaxOnEvents(a.options.map,b)}).on("off",function(){a._bindWaxOffEvents()}))},_bindWaxOnEvents:function(a,b){var c=this._findPos(a,b),c=a.layerPointToLatLng(c);switch(b.e.type){case "mousemove":if(this.options.featureOver)return this.options.featureOver(b.e,c,{x:b.e.clientX,y:b.e.clientY},b.data);if(this.options.debug)throw"featureOver function not defined";break;case "click":if(this.options.featureClick)this.options.featureClick(b.e,c,{x:b.e.clientX,y:b.e.clientY},b.data);else if(this.options.debug)throw"featureClick function not defined";break;case "touchend":if(this.options.featureClick)this.options.featureClick(b.e,c,{x:b.e.clientX,y:b.e.clientY},b.data);else if(this.options.debug)throw"featureClick function not defined";}},_bindWaxOffEvents:function(){if(this.options.featureOut)return this.options.featureOut&&this.options.featureOut();if(this.options.debug)throw"featureOut function not defined";},_generateTileJson:function(){var a=this._generateTileUrls(),b=a.grid_url;if(-1!=a.grid_url.indexOf("{s}")){var b=[],c=this.options.subdomains;"[object Array]"!==Object.prototype.toString.call(c)&&c.split("");for(var d=0;d<c.length;d++)b.push(a.grid_url.replace(/\{s\}/g,c[d]))}return{blankImage:NPMap.config.server+"/resources/img/blank-tile.png",tilejson:"1.0.0",scheme:"xyz",attribution:this.options.attribution,tiles:[a.tile_url],grids:b,tiles_base:a.tile_url,grids_base:b,opacity:this.options.opacity,formatter:function(a,b){return b}}},_parseUri:function(a){var b="source protocol authority userInfo user password host port relative path directory file query anchor".split(" ");a=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(a);for(var c={},d=14;d--;)c[b[d]]=a[d]||"";c.queryKey={};c[b[12]].replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,b,d){b&&(c.queryKey[b]=d)});return c},_addUrlData:function(a,b){a+=this._parseUri(a).query?"&":"?";return a+b},_generateCoreUrl:function(a){return this.options.cdn_url?this.options.cdn_url:"sql"==a?this.options.sql_protocol+"://"+(this.options.user_name?this.options.user_name+".":"")+this.options.sql_domain+(""!=this.options.sql_port?":"+this.options.sql_port:""):this.options.tiler_protocol+"://"+(this.options.user_name?this.options.user_name+".":"")+this.options.tiler_domain+(""!=this.options.tiler_port?":"+this.options.tiler_port:"")},_generateTileUrls:function(){var a=this._generateCoreUrl("tiler"),b=a+"/tiles/"+this.options.table_name+"/{z}/{x}/{y}",c=b+".png",d=b+".grid.json";if(this.options.query)var e=encodeURIComponent(this.options.query.replace(/\{\{table_name\}\}/g,this.options.table_name)),e=e.replace(/%7Bx%7D/g,"{x}").replace(/%7By%7D/g,"{y}").replace(/%7Bz%7D/g,"{z}"),e="sql="+e,c=this._addUrlData(c,e),d=this._addUrlData(d,e);for(_param in this.options.extra_params)c=this._addUrlData(c,_param+"="+this.options.extra_params[_param]),d=this._addUrlData(d,_param+"="+this.options.extra_params[_param]);this.options.tile_style&&(e="style="+encodeURIComponent(this.options.tile_style.replace(/\{\{table_name\}\}/g,this.options.table_name)),c=this._addUrlData(c,e),d=this._addUrlData(d,e));this.options.interactivity&&(e="interactivity="+encodeURIComponent(this.options.interactivity.replace(/ /g,"")),c=this._addUrlData(c,e),d=this._addUrlData(d,e));return{core_url:a,base_url:b,tile_url:c,grid_url:d}},_findPos:function(a,b){var c=curtop=0,d=a._container;if(d.offsetParent){do c+=d.offsetLeft,curtop+=d.offsetTop;while(d=d.offsetParent);return a.containerPointToLayerPoint(new L.Point((b.e.clientX||b.e.changedTouches[0].clientX)-c,(b.e.clientY||b.e.changedTouches[0].clientY)-curtop))}return a.mouseEventToLayerPoint(b.e)},_checkTiles:function(){var a=this;new Image;var b=this._generateTileUrls();b.tile_url=b.tile_url.replace(/\{z\}/g,4).replace(/\{x\}/g,6).replace(/\{y\}/g,6);b.grid_url=b.grid_url.replace(/\{z\}/g,4).replace(/\{x\}/g,6).replace(/\{y\}/g,6);reqwest({method:"get",url:b.grid_url.replace(/\{s\}/g,"a"),type:"jsonp",jsonpCallback:"callback",jsonpCallbackName:"grid",success:function(){clearTimeout(c)},error:function(b,c){a.interaction&&a.interaction.remove();if(a.options.debug)throw"There is an error in your query or your interaction parameter";a.fire("layererror",c)}});var c=setTimeout(function(){clearTimeout(c);if(a.options.debug)throw"There is an error in your query or your interaction parameter";a.fire("layererror","There is a problem in your SQL or interaction parameter")},2E3)}});

  var
      // The currently active baseLayer config.
      _activeBaseLayer,
      // An array of the default base layers for the Leaflet baseAPI.
      _DEFAULT_BASE_LAYERS = {
        aerial: {
          icon: 'aerial',
          id: 'nps.map-n9nxe12m',
          name: 'Aerial View',
          type: 'TileStream'
        },
        blank: {
          cls: 'blank',
          icon: 'blank',
          mapTypeId: 'Blank',
          name: 'Blank View',
          type: 'Api'
        },
        hybrid: {
          attribution: 'Data <a href="http://openstreetmap.org/copyright">copyright OpenStreetMap and contributors</a>, licensed <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
          icon: 'aerial',
          id: 'nps.map-r3ilza09',
          name: 'Hybrid View',
          type: 'TileStream'
        },
        streets: {
          attribution: 'Data <a href="http://openstreetmap.org/copyright">copyright OpenStreetMap and contributors</a>, licensed <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>. <a href="http://mapbox.com/map-feedback/">Feedback</a>',
          icon: 'street',
          id: 'nps.map-06dnxzq5',
          name: 'Street View',
          type: 'TileStream'
        },
        terrain: {
          attribution: 'Data <a href="http://openstreetmap.org/copyright">copyright OpenStreetMap and contributors</a>, licensed <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>. <a href="http://mapbox.com/map-feedback/">Feedback</a>',
          icon: 'topo',
          id: 'nps.map-lj6szvbq',
          name: 'Terrain View',
          type: 'TileStream'
        }
      },
      // Helps handle map single and double-click events.
      _doubleClicked = false,
      // The center {L.LatLng} to initialize the map with.
      _initialCenter = NPMap.config.center ? new L.LatLng(NPMap.config.center.lat, NPMap.config.center.lng) : new L.LatLng(39, -96),
      // The zoom level to initialize the map with.
      _initialZoom = NPMap.config.zoom ? NPMap.config.zoom : 4,
      // The {L.Map} object.
      _map,
      // The map config object.
      _mapConfig = {
        attributionControl: false,
        boxZoom: false,
        center: _initialCenter,
        inertia: false, // TODO: Turned off because 'move' event is not called by Leaflet when the map is "thrown".
        zoom: _initialZoom,
        zoomControl: false
      };

  /**
   * Handles the map resize.
   * @return null
   */
  function _handleResize() {
    _map.invalidateSize();
  }
  /**
   * Hooks up shape click and dblclick (allows propagation through to map).
   * @param {Object} shape
   * @return null
   */
  function _hookUpShapeClick(shape) {
    shape.on('click', function(e) {
      _doubleClicked = false;

      setTimeout(function() {
        if (!_doubleClicked) {
          var cloned = _.clone(e.originalEvent);

          _.extend(cloned, e);

          delete cloned.originalEvent;

          Event.trigger('NPMap.Map', 'shapeclick', cloned);
        }
      }, 350);
    });
    shape.on('dblclick', function(e) {
      var latLng = e.latlng,
          Leaflet = NPMap.Map.Leaflet;

      _doubleClicked = true;

      if (!latLng) {
        latLng = Leaflet.getMarkerLatLng(e.target);
      }

      Leaflet.centerAndZoom(latLng, Leaflet.getZoom() + 1);
    });
  }

  /**
   * Bing Maps layer. - https://github.com/shramov/leaflet-plugins
   */
  L.TileLayer.Bing = L.TileLayer.extend({
    options: {
      errorTileUrl: NPMap.config.server + '/resources/img/blank-tile.png',
      subdomains: [
        0,
        1,
        2,
        3
      ],
      type: 'Aerial'
    },
    _update: function() {
      if (this._url === null || !this._map) {
        return;
      }

      this._update_attribution();
      L.TileLayer.prototype._update.apply(this, []);
    },
    _update_attribution: function() {
      var bounds = this._map.getBounds(),
          zoom = this._map.getZoom();

      for (var i = 0; i < this._providers.length; i++) {
        var p = this._providers[i];
        
        if ((zoom <= p.zoomMax && zoom >= p.zoomMin) && bounds.intersects(p.bounds)) {
          if (!p.active) {
            _activeBaseLayer.attribution.push(p.attrib);
          }

          p.active = true;
        } else {
          if (p.active) {
            _activeBaseLayer.attribution.splice(_.indexOf(_activeBaseLayer.attribution, p.attrib), 1);
          }

          p.active = false;
        }
      }
      
      Map.updateAttribution();
    },
    getTileUrl: function(p, z) {
      var subdomains = this.options.subdomains,
          s = this.options.subdomains[Math.abs((p.x + p.y) % subdomains.length)];

      z = this._getZoomForUrl();

      return this._url.replace('{subdomain}', s).replace('{quadkey}', this.tile2quad(p.x, p.y, z));
    },
    initialize: function(key, options) {
      L.Util.setOptions(this, options);

      _activeBaseLayer.attribution = [];
      this._key = key;
      this._url = null;
      this.meta = {};
      this.loadMetadata();
    },
    initMetadata: function() {
      var r = this.meta.resourceSets[0].resources[0];
      
      this.options.subdomains = r.imageUrlSubdomains;
      this._providers = [];
      this._url = r.imageUrl;
      
      for (var i = 0; i < r.imageryProviders.length; i++) {
        var p = r.imageryProviders[i];
        
        for (var j = 0; j < p.coverageAreas.length; j++) {
          var c = p.coverageAreas[j],
              coverage = {zoomMin: c.zoomMin, zoomMax: c.zoomMax, active: false},
              bounds = new L.LatLngBounds(
                new L.LatLng(c.bbox[0] + 0.01, c.bbox[1] + 0.01),
                new L.LatLng(c.bbox[2] - 0.01, c.bbox[3] - 0.01)
              );
          
          coverage.bounds = bounds;
          coverage.attrib = p.attribution;

          this._providers.push(coverage);
        }
      }

      this._update();
    },
    loadMetadata: function() {
      var _this = this,
          cbid = '_bing_metadata_' + L.Util.stamp(this),
          script = document.createElement('script');

      window[cbid] = function(meta) {
        var e = document.getElementById(cbid);

        _this.meta = meta;
        window[cbid] = undefined;

        e.parentNode.removeChild(e);

        if (meta.errorDetails) {
          return;
        }

        _this.initMetadata();
      };

      script.id = cbid;
      script.src = 'http://dev.virtualearth.net/REST/v1/Imagery/Metadata/' + this.options.type + '?include=ImageryProviders&jsonp=' + cbid + '&key=' + this._key;
      script.type = 'text/javascript';

      document.getElementsByTagName('head')[0].appendChild(script);
    },
    onRemove: function(map) {
      for (var i = 0; i < this._providers.length; i++) {
        var p = this._providers[i];
        
        if (p.active) {
          p.active = false;
        }
      }

      _activeBaseLayer.attribution = [];
      
      L.TileLayer.prototype.onRemove.apply(this, [_map]);
    },
    tile2quad: function(x, y, z) {
      var quad = '';
      
      for (var i = z; i > 0; i--) {
        var digit = 0,
            mask = 1 << (i - 1);
        
        if ((x & mask) !== 0) {
          digit += 1;
        }

        if ((y & mask) !== 0) {
          digit += 2;
        }

        quad = quad + digit;
      }

      return quad;
    }
  });
  /**
   * Simple tile layer.
   */
  L.TileLayer.Simple = L.TileLayer.extend({
    getTileUrl: function(xy, z) {
      return this._url(xy, z);
    },
    initialize: function(url, options) {
      options.errorTileUrl = NPMap.config.server + '/resources/img/blank-tile.png';

      this._url = url;

      L.Util.setOptions(this, options);
    }
  });
  /**
   * Zoomify layer.
   */
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
    _createTileProto: function () {
      var img = this._tileImg = L.DomUtil.create('img', 'leaflet-tile');
      img.galleryimg = 'no';
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
    getTileUrl: function(xy) {
      var zoom = Map.getZoom();
      
      return this._url + 'TileGroup' + this._coordinateGroup({
        column: xy.x,
        row: xy.y,
        zoom: zoom
      }) + '/'+ zoom + '-' + xy.x + '-' + xy.y + '.jpg';
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
    }
  });

  if (NPMap.config.baseLayers) {
    Map._matchBaseLayers(_DEFAULT_BASE_LAYERS);

    for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
      var baseLayerI = NPMap.config.baseLayers[i];
      
      if (baseLayerI.visible) {
        _activeBaseLayer = baseLayerI;

        if (baseLayerI.type === 'Zoomify') {
          _mapConfig.crs = L.Util.extend({}, L.CRS, {
            code: 'Direct',
            projection: {
              project: function(latlng) {
                return new L.Point(latlng.lng, latlng.lat);
              },
              unproject: function(point, unbounded) {
                return new L.LatLng(point.y, point.x, true);
              }
            },
            transformation: new L.Transformation(1, 0, 1, 0)
          });
          _mapConfig.worldCopyJump = false;
        }
        
        break;
      }
    }
  } else if (typeof NPMap.config.baseLayers === 'undefined') {
    NPMap.config.baseLayers = [
      _DEFAULT_BASE_LAYERS['streets']
    ];
    NPMap.config.baseLayers[0].visible = true;
    _activeBaseLayer = NPMap.config.baseLayers[0];
  } else {
    NPMap.config.baseLayers = [
      _DEFAULT_BASE_LAYERS['blank']
    ];
    NPMap.config.baseLayers[0].visible = true;
    _activeBaseLayer = NPMap.config.baseLayers[0];
  }
  
  if (typeof NPMap.config.zoomRange !== 'undefined') {
    if (typeof NPMap.config.zoomRange.max !== 'undefined') {
      _mapConfig.maxZoom = NPMap.config.zoomRange.max;
    }
    
    if (typeof NPMap.config.zoomRange.min !== 'undefined') {
      _mapConfig.minZoom = NPMap.config.zoomRange.min;
    }
  } else {
    _mapConfig.maxZoom = 19;
    _mapConfig.minZoom = 0;
  }
  
  _map = new L.Map(NPMap.config.div, _mapConfig);

  for (var j = 0; j < NPMap.config.baseLayers.length; j++) {
    var baseLayerJ = NPMap.config.baseLayers[j];

    if (baseLayerJ.visible) {
      if (baseLayerJ.type === 'Api') {
        if (baseLayerJ.mapTypeId !== 'Blank') {
          // TODO: Switch this API key over to the key that is set in NPMap.config.
          baseLayerJ.api = new L.TileLayer.Bing('Ag4-2f0g7bcmcVgKeNYvH_byJpiPQSx4F9l0aQaz9pDYMORbeBFZ0N3C3A5LSf65', {
            type: baseLayerJ.mapTypeId
          });
          _map.addLayer(baseLayerJ.api, true);
        }
      }

      NPMap.Event.trigger('NPMap.Map', 'baselayerchanged');
      break;
    }
  }

  L.DomEvent.on(_map.getContainer(), 'mousedown', function(e) {
    Event.trigger('NPMap.Map', 'mousedown', e);
    L.DomEvent.preventDefault(e);
  });
  L.DomEvent.on(_map.getContainer(), 'mouseenter', function(e) {
    Event.trigger('NPMap.Map', 'mouseover', e);
    L.DomEvent.preventDefault(e);
  });
  L.DomEvent.on(_map.getContainer(), 'mouseleave', function(e) {
    Event.trigger('NPMap.Map', 'mouseout', e);
    L.DomEvent.preventDefault(e);
  });
  L.DomEvent.on(_map.getContainer(), 'mousemove', function(e) {
    Event.trigger('NPMap.Map', 'mousemove', e);
    L.DomEvent.preventDefault(e);
  });
  L.DomEvent.on(_map.getContainer(), 'mouseup', function(e) {
    Event.trigger('NPMap.Map', 'mouseup', e);
    L.DomEvent.preventDefault(e);
  });
  // TODO: For mouse events on map, maybe combine e.originalEvent and e - minus the originalEvent property?
  _map.on('click', function(e) {
    _doubleClicked = false;

    setTimeout(function() {
      if (!_doubleClicked) {
        Event.trigger('NPMap.Map', 'click', e.originalEvent);
      }
    }, 350);
  });
  _map.on('contextmenu', function(e) {
    Event.trigger('NPMap.Map', 'rightclick', e);
  });
  _map.on('dblclick', function(e) {
    _doubleClicked = true;

    Event.trigger('NPMap.Map', 'dblclick', e.originalEvent);
  });
  _map.on('move', function() {
    NPMap.Event.trigger('NPMap.Map', 'viewchanging');
  });
  _map.on('moveend', function() {
    NPMap.Event.trigger('NPMap.Map', 'viewchanging');
  });
  _map.on('movestart', function() {
    NPMap.Event.trigger('NPMap.Map', 'viewchanging');
  });
  _map.on('zoomstart', function() {
    NPMap.Event.trigger('NPMap.Map', 'zoomstart');
  });
  Map._init();
  _handleResize();
  
  return NPMap.Map.Leaflet = {
    // The current attribution for the map {Array}.
    _attribution: [],
    // Is the map loaded and ready to be interacted with programatically?
    _isReady: true,
    /**
     * Creates and adds a CartoDb layer to the map.
     * @param {Object} options
     * @return {Object}
     */
    _addCartoDbLayer: function(options) {
      var layer;

      options.map = _map;
      layer = new L.CartoDBLayer(options);

      _map.addLayer(layer);

      return layer;
    },
    /**
     * Creates and adds a tile layer to the map.
     * @param {Object} options
     * @return {Object}
     */
    _addTileLayer: function(options) {
      var getSubdomain,
          layer,
          uriConstructor;

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

      if (typeof options.constructor === 'string') {
        uriConstructor = function(xy) {
          return _.template(options.constructor)({
            s: typeof getSubdomain == 'function' ? getSubdomain() : null,
            x: xy.x,
            y: xy.y,
            z: _map.getZoom()
          });
        };
      } else {
        uriConstructor = function(xy) {
          var subdomain = null;

          if (getSubdomain) {
            subdomain = getSubdomain();
          }

          return options.constructor(xy.x, xy.y, _map.getZoom(), options.url ? options.url : null, subdomain);
        };
      }

      layer = new L.TileLayer.Simple(uriConstructor, {
        errorTileUrl: NPMap.config.server + '/resources/img/blank-tile.png',
        maxZoom: typeof options.maxZoom === 'number' ? options.maxZoom : 18,
        minZoom: typeof options.minZoom === 'number' ? options.minZoom : 0,
        opacity: typeof options.opacity === 'number' ? options.opacity : 1.0,
        zIndex: typeof options.zIndex === 'number' ? options.zIndex : null
      });

      _map.addLayer(layer);

      return layer;
    },
    /**
     * Creates and adds a TileStream layer to the map.
     * @param {Object} options
     * @return {Object}
     */
    _addTileStreamLayer: function(options) {
      var layer = new wax.leaf.connector(options.tileJson, options);

      _map.addLayer(layer);

      return layer;
    },
    /**
     * Creates and adds a TileStream layer to the map.
     * @param {Object} options
     * @return {Object}
     */
    _addZoomifyLayer: function(options) {
      var layer = new L.TileLayer.Zoomify(options.url, {
        height: options.height,
        width: options.width
      });

      _map.addLayer(layer);

      return layer;
    },
    /**
     * Hides a CartoDb layer.
     * @param {Object} layer
     * @return null
     */
    _hideCartoDbLayer: function(layer) {
      this._hideTileLayer(layer);
    },
    /**
     * Hides a tile layer.
     * @param {Object} layer
     * @return null
     */
    _hideTileLayer: function(layer) {
      var config = NPMap.Layer.getLayerByName(layer.npmap.layerName);

      if (typeof config.opacityNpmap === 'undefined') {
        if (typeof config.opacity === 'undefined') {
          config.opacityNpmap = 1.0;
        } else {
          config.opacityNpmap = config.opacity;
        }
      }

      layer.setOpacity(0);
    },
    /**
     * Hides a TileStream layer.
     * @param {Object} layer
     * @return null
     */
    _hideTileStreamLayer: function(layer) {
      this._hideTileLayer(layer);
    },
    /**
     * Hides a Zoomify layer.
     * @param {Object} layer
     * @return null
     */
    _hideZoomifyLayer: function(layer) {
      
    },
    /**
     * Removes a CartoDb layer from the map.
     * @param {Object} layer
     * @return null
     */
    _removeCartoDbLayer: function(layer) {
      this._removeTileLayer(layer);
    },
    /**
     * Removes a tile layer from the map.
     * @param {Object} layer
     * @return null
     */
    _removeTileLayer: function(layer) {
      _map.removeLayer(layer);
    },
    /**
     *
     */
    _removeTileStreamLayer: function(layer) {
      this._removeTileLayer(layer);
    },
    /**
     * Sets the base layer.
     * @param {Object} baseLayer
     * @return null
     */
    _setBaseLayer: function(baseLayer) {
      var api,
          cls = baseLayer.cls,
          mapTypeId,
          me = this,
          removeAttribution = [];

      for (var k = 0; k < NPMap.config.baseLayers.length; k++) {
        var bl = NPMap.config.baseLayers[k];

        if (bl.visible) {
          _activeBaseLayer = bl;
        }

        bl.visible = false;
      }

      if (_activeBaseLayer.type === 'Api') {
        if (_activeBaseLayer.mapTypeId !== 'Blank') {
          _map.removeLayer(_activeBaseLayer.api);
          delete _activeBaseLayer.api;
        }
      } else {
        NPMap.Layer[_activeBaseLayer.type]._remove(_activeBaseLayer);
      }

      _activeBaseLayer = baseLayer;

      if (cls) {
        cls = cls.toLowerCase();
      }

      if (baseLayer.type === 'Api') {
        if (baseLayer.mapTypeId !== 'blank') {
          baseLayer.api = new L.TileLayer.Bing('Ag4-2f0g7bcmcVgKeNYvH_byJpiPQSx4F9l0aQaz9pDYMORbeBFZ0N3C3A5LSf65', {
            type: baseLayer.mapTypeId
          });
          _map.addLayer(baseLayer.api, true);
        }
      } else {
        NPMap.Layer[baseLayer.type]._add(baseLayer);
      }

      baseLayer.visible = true;

      NPMap.Event.trigger('NPMap.Map', 'baselayerchanged');
    },
    /**
     * Sets tile layer options.
     * @param {Object} layer
     * @param {Object} options
     * Currently supported: opacity.
     */
    _setTileLayerOptions: function(layer, options) {
      var opacity = options.opacity;

      if (typeof opacity === 'number') {
        layer.setOpacity(opacity);

        NPMap.Layer.getLayerByName(layer.npmap.layerName).opacityNpmap = opacity;
      }
    },
    /**
     * Shows a CartoDb layer.
     * @param {Object} layer
     * @return null
     */
    _showCartoDbLayer: function(layer) {
      this._showTileLayer(layer);
    },
    /**
     * Shows a tile layer.
     * @param {Object} layer
     * @return null
     */
    _showTileLayer: function(layer) {
      layer.setOpacity(NPMap.Layer.getLayerByName(layer.npmap.layerName).opacityNpmap);
    },
    /**
     * Shows a TileStream layer.
     * @param {Object} layer
     * @return null
     */
    _showTileStreamLayer: function(layer) {
      this._showTileLayer(layer);
    },
    // The {L.Map} object. This reference should be used to access any of the Leaflet functionality that can't be done through NPMap's API.
    map: _map,
    
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map.
     * @return null
     */
    addShape: function(shape) {
      shape.addTo(_map);
    },
    /**
     * Sets the bounds of the map.
     * @param {L.LatLngBounds} bounds
     * @return null
     */
    bounds: function(bounds) {
      _map.fitBounds(bounds);
    },
    /**
     * Converts an API bounds to a NPMap bounds.
     * @param {Object} bounds
     * @return {Object}
     */
    boundsFromApi: function(bounds) {
      var nw = bounds.getNorthWest(),
          se = bounds.getSouthEast();

      return {
        e: se.lng,
        n: nw.lat,
        s: se.lat,
        w: nw.lng
      };
    },
    /**
     * Converts a NPMap bounds to an API bounds.
     * @param {Object}
     * @return {Object}
     */
    boundsToApi: function(bounds) {
      return new L.LatLngBounds(new L.LatLng(bounds.n, bounds.w), new L.LatLng(bounds.s, bounds.e));
    },
    /**
     * Centers the map.
     * @param {Object} latLng
     * @return null
     */
    center: function(latLng) {
      this.centerAndZoom(latLng, this.getZoom());
    },
    /**
     * Zooms to the center and zoom provided. If zoom isn't provided, the map will zoom to level 17.
     * @param {L.LatLng} latLng
     * @param {Number} zoom
     * @return null
     */
    centerAndZoom: function(latLng, zoom) {
      _map.setView(latLng, zoom);
    },
    /**
     * Converts NPMap line options to Leaflet line options.
     * @param {Object} options
     * @return {Object}
     * Notes: Valid Leaflet options: clickable, color, dashArray, fill, fillColor, fillOpacity, opacity, stroke, weight
     */
    convertLineOptions: function(options) {
      var o = {};

      if (options.strokeColor) {
        o.color = '#' + options.strokeColor;
      }

      if (options.strokeOpacity) {
        o.opacity = Util.convertOpacity(options.strokeOpacity);
      }
      
      if (options.strokeWidth) {
        o.weight = options.strokeWidth;
      }
      
      return o;
    },
    /**
     * Converts NPMap marker options to Leaflet marker options.
     * @param {Object} options
     * @return {Object}
     * Notes: Valid Leaflet options: clickable, draggable, icon, opacity, title, zIndex
     */
    convertMarkerOptions: function(options) {
      var o = {};

      if (options.url) {
        var anchor = options.anchor,
            height = options.height,
            width = options.width;

        if (!anchor) {
          anchor = {
            x: width / 2,
            y: 0
          };
        }

        o.icon = L.icon({
          iconAnchor: [
            anchor.x,
            anchor.y
          ],
          iconSize: [
            width,
            height
          ],
          iconUrl: options.url
        });
      }

      return o;
    },
    /**
     * Converts NPMap polygon options to Leaflet polygon options.
     * @param {Object} options
     * @return {Object}
     * Notes: Valid Leaflet options: clickable, color, dashArray, fill, fillColor, fillOpacity, opacity, stroke, weight
     */
    convertPolygonOptions: function(options) {
      var o = {};

      if (options.fillColor) {
        o.fillColor = '#' + options.fillColor;
      }

      if (options.fillOpacity) {
        o.fillOpacity = Util.convertOpacity(options.fillOpacity);
      }

      if (options.strokeColor) {
        o.color = '#' + options.strokeColor;
      }

      if (options.strokeOpacity) {
        o.opacity = Util.convertOpacity(options.strokeOpacity);
      }
      
      if (options.strokeWidth) {
        o.weight = options.strokeWidth;
      }
      
      return o;
    },
    /**
     * DEPRECATED
     */
    createCartoDbLayer: function(options) {

    },
    /**
     * Creates a line shape.
     * @param {Array} latLngs An array of {L.LatLng} objects.
     * @param {Object} options (Optional) Any additional options to apply to the line.
     * @return {Object}
     */
    createLine: function(latLngs, options) {
      var line = L.polyline(latLngs, options);

      _hookUpShapeClick(line);

      return line;
    },
    /**
     * Creates a marker shape.
     * @param latLng {L.LatLng} Where to place the marker.
     * @param options {Object} (Optional) Any additional options to apply to the marker.
     * @return {Object}
     */
    createMarker: function(latLng, options) {
      var marker = L.marker(latLng, options);

      _hookUpShapeClick(marker);

      return marker;
    },
    /**
     * Creates a polygon shape.
     * @param latLngs {Array} (Required) An array of {L.LatLng} objects.
     * @param options {Object} (Optional) Any additional options to apply to the polygon.
     * @return {Object}
     */
    createPolygon: function(latLngs, options) {
      var polygon =  L.polygon(latLngs, options);

      _hookUpShapeClick(polygon);

      return polygon;
    },
    /**
     * DEPRECATED
     */
    createTileLayer: function(constructor, options) {
      
    },
    /**
     * DEPRECATED
     */
    createZoomifyLayer: function(config) {
      
    },
    /**
     * Gets a latLng from a click event object.
     * @param {Object} e
     * @return {Object}
     */
    eventGetLatLng: function(e) {
      if (e.latlng) {
        return e.latlng;
      } else {
        return _map.mouseEventToLatLng(e);
      }
    },
    /**
     * Gets a shape from a click event object.
     * @param {Object} e
     * @return {Object}
     */
    eventGetShape: function(e) {
      return e.target;
    },
    /**
     * Gets the current bounds of the map.
     * @return {Object}
     */
    getBounds: function() {
      return _map.getBounds();
    },
    /**
     * Gets the center {L.LatLng} of the map.
     * @return {Object}
     */
    getCenter: function() {
      return _map.getCenter();
    },
    /**
     * Returns the {L.LatLng} for the #npmap-clickdot div.
     * @return {Object}
     */
    getClickDotLatLng: function() {
      return this.pixelToLatLng(this.getClickDotPixel());
    },
    /**
     * Returns the {L.Point} for the #npmap-clickdot div.
     * @return {Object}
     */
    getClickDotPixel: function() {
      var offset = Util.getOffset(document.getElementById('npmap-map')),
          position = Util.getOffset(document.getElementById('npmap-clickdot'));

      return new L.Point(position.left - offset.left, position.top - offset.top);
    },
    /**
     * Gets the latLngs {L.LatLng} of the line.
     * @param {Object} line The line to get the latLngs for.
     * @return {Array}
     */
    getLineLatLngs: function(line) {
      return line.getLatLngs();
    },
    /**
     * Gets the map element.
     * @return {Object}
     */
    getMapElement: function() {
      return document.getElementById('npmap-map');
    },
    /**
     * Gets the latLng (L.LatLng) of the marker.
     * @param {Object} marker The marker to get the latLng for.
     * @return {Object}
     */
    getMarkerLatLng: function(marker) {
      return marker.getLatLng();
    },
    /**
     * Gets the maximum zoom level for this map.
     * @return {Number}
     */
    getMaxZoom: function() {
      return _mapConfig.maxZoom;
    },
    /**
     * Gets the minimum zoom level for this map.
     * @return {Number}
     */
    getMinZoom: function() {
      return _mapConfig.minZoom;
    },
    /**
     * Gets the latLngs {L.LatLng} of the polygon.
     * @param {Object} polygon The polygon to get the latLngs for.
     * @return {Array}
     */
    getPolygonLatLngs: function(polygon) {
      return polygon.getLatLngs();
    },
    /**
     * Gets the zoom level of the map.
     * @return {Number}
     */
    getZoom: function() {
      return _map.getZoom();
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     * @param {Function} callback
     * @return null
     */
    handleResize: function(callback) {
      _handleResize();
      
      if (callback) {
        callback();
      }
    },
    /**
     * Hides a shape.
     * @param {Object} shape
     * @return null
     */
    hideShape: function(shape) {
      this.removeShape(shape);
    },
    /**
     * Returns true if the input latLng is contained within the current map bounds.
     * @param {L.LatLng} latLng
     * @return {Boolean}
     */
    isLatLngWithinMapBounds: function(latLng) {
      return this.getBounds().contains(latLng);
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
     * Converts a {L.LatLng} to a {L.Point}.
     * @param {Object} latLng
     * @return {Object}
     */
    latLngToPixel: function(latLng) {
      return _map.latLngToContainerPoint(latLng);
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     * @param {Function} callback (Optional)
     * @return null
     */
    panByPixels: function(pixels, callback) {
      var point = new L.Point(-pixels.x, -pixels.y);

      if (NPMap.InfoBox.visible) {
        _map._rawPanBy(point);
        _map.fireEvent('movestart');
        _map.fireEvent('move');
        _map.fireEvent('moveend');

        if (callback) {
          callback();
        }
      } else {
        _map.panBy(point);

        if (callback) {
          function callbackPanByPixels() {
            _map.off('moveend', callbackPanByPixels);
            callback();
          }

          _map.on('moveend', callbackPanByPixels);
        }
      }
    },
    /**
     * Turns a {L.Point} to a NPMap pixel object.
     * @param {Object} pixel
     * @return {Object}
     */
    pixelFromApi: function(pixel) {
      return {
        x: pixel.x,
        y: pixel.y
      };
    },
    /**
     * Converts a NPMap pixel object to a {L.Point}.
     * @param {Object} pixel
     * @return {Object}
     */
    pixelToApi: function(pixel) {
      return new L.Point(pixel.x, pixel.y);
    },
    /**
     * Converts a {L.Point} to a {L.LatLng}.
     * @param {L.Point} pixel
     * @return {Object}
     */
    pixelToLatLng: function(pixel) {
      return _map.containerPointToLatLng(pixel);
    },
    /**
     * Positions the #npmap-clickdot div on top of the {L.Marker} or {L.LatLng} that is passed in.
     * @param {Object} to The {L.Marker} or {L.LatLng} to position the div onto.
     * @return null
     */
    positionClickDot: function(to) {
      var clickDot = document.getElementById('npmap-clickdot'),
          latLng = (function() {
            var latLng = null;

            if (typeof to.lat === 'number') {
              latLng = new L.LatLng(to.lat, to.lng);
            } else {
              latLng = to.getLatLng();
            }
            
            return latLng;
          })(),
          pixel = this.latLngToPixel(latLng);

      clickDot.style.left = pixel.x + 'px';
      clickDot.style.top = pixel.y + 'px';
    },
    /**
     * DEPRECATED
     */
    removeCartoDbLayer: function(layer) {
      
    },
    /**
     * Removes a shape from the map.
     * @param {Object} shape The shape to remove from the map. This can be a {L}.Marker, Polyline, Polygon, Rectangle, or Circle object.
     * @return null
     */
    removeShape: function(shape) {
      _map.removeLayer(shape);
    },
    /**
     * DEPRECATED
     */
    removeTileLayer: function(layer) {
      
    },
    /**
     * Sets the initial center of the map.
     * @param {Object} center
     * @return null
     */
    setInitialCenter: function(center) {
      _initialCenter = center;
      NPMap.config.center = {
        lat: center.lat,
        lng: center.lng
      };
    },
    /**
     * Sets the initial zoom of the map.
     * @param {Number} zoom
     * @return null
     */
    setInitialZoom: function(zoom) {
      zoom = NPMap.config.zoom = zoom;
    },
    /**
     * Sets zoom restrictions on the map.
     * @param {Object} restrictions
     * @return null
     */
    setZoomRestrictions: function(restrictions) {
      NPMap.config.zoomRange = NPMap.config.zoomRange || {};
      
      if (restrictions.max) {
        NPMap.config.zoomRange.max = max;
      }
      
      if (restrictions.min) {
        NPMap.config.zoomRange.min = min;
      }
      
      // TODO: Cannot currently set zoom restrictions dynamically using Leaflet API.
    },
    /**
     * Shows a shape.
     * @param {Object} shape
     * @return null
     */
    showShape: function(shape) {
      this.addShape(shape);
    },
    /**
     * Zooms the map to a {L.LatLngBounds}.
     * @param {Object} bounds
     * @return null
     */
    toBounds: function(bounds) {
      _map.fitBounds(bounds);
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     * @return null
     */
    toInitialExtent: function() {
      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.hide();
      }
      _map.setView(_initialCenter, _initialZoom);
    },
    /**
     * Zooms the map to the extent of an array of latLng objects.
     * @param {Array} latLngs The array of latLng objects.
     * @return null
     */
    toLatLngs: function(latLngs) {
      _map.setExtent(latLngs);
    },
    /**
     * Zooms the map to the extent of an array of markers.
     * @param {Array} markers The array of marker objects.
     * @return null
     */
    toMarkers: function(markers) {
      var bounds = new L.LatLngBounds(),
          me = this;

      for (var i = 0; i < markers.length; i++) {
        bounds.extend(me.getMarkerLatLng(markers[i]));
      }

      this.toBounds(bounds);
    },
    /**
     * Zooms the map to a zoom level.
     * @param {Number} zoom
     * @return null
     */
    zoom: function(zoom) {
      _map.setView(this.getCenter(), zoom);
    },
    /**
     * Zooms the map in by one zoom level.
     * @return null
     */
    zoomIn: function() {
      _map.zoomIn();
    },
    /**
     * Zooms the map out by one zoom level.
     * @return null
     */
    zoomOut: function() {
      _map.zoomOut();
    }
  };
});