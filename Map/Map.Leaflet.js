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
   * wax - 7.0.0dev11 - v6.0.4-113-g6b1c56c, customized a bit to filter out Bing layers.
   */
  wax.leaf={};wax.leaf.interaction=function(){function a(){h=!0}var h=!1,e,c;return wax.interaction().attach(function(f){if(!arguments.length)return c;c=f;for(var d=["moveend"],b=0;b<d.length;b++)c.on(d[b],a)}).detach(function(f){if(!arguments.length)return c;c=f;for(var d=["moveend"],b=0;b<d.length;b++)c.off(d[b],a)}).parent(function(){return c._container}).grid(function(){if(!h&&e)return e;var a=c._layers,d=[],b;for(b in a)if("undefined"!==typeof a[b]._url&&-1===a[b]._url.indexOf("virtualearth")&&a[b]._tiles)for(var j in a[b]._tiles){var g=a[b]._tiles[j];if(g.src){var i=wax.u.offset(g);d.push([i.top,i.left,g])}}return e=d})};wax.leaf.connector=L.TileLayer.extend({initialize:function(a){a=a||{};a.minZoom=a.minzoom||0;a.maxZoom=a.maxzoom||22;L.TileLayer.prototype.initialize.call(this,a.tiles[0],a)}});
  /**
   * CartoDb - v0.55
   */
  L.CartoDBLayer=L.Class.extend({version:"0.55",includes:L.Mixin.Events,options:{query:"SELECT * FROM {{table_name}}",opacity:0.99,auto_bound:false,attribution:"CartoDB",debug:false,visible:true,added:false,tiler_domain:"cartodb.com",tiler_port:"80",tiler_protocol:"http",sql_domain:"cartodb.com",sql_port:"80",sql_protocol:"http",extra_params:{},cdn_url:null,subdomains:"abc"},initialize:function(a){L.Util.setOptions(this,a);if(!a.table_name||!a.map){if(a.debug){throw ("cartodb-leaflet needs at least a CartoDB table name and the Leaflet map object :(")}else{return}}if(a.auto_bound){this.setBounds()}},onAdd:function(a){this._addLayer();this.fire("added");this.options.added=true},onRemove:function(a){this._remove();this.options.added=false},setOpacity:function(a){if(!this.options.added){if(this.options.debug){throw ("the layer is not still added to the map")}else{return}}if(isNaN(a)||a>1||a<0){if(this.options.debug){throw (a+" is not a valid value")}else{return}}this.options.opacity=a;if(this.options.visible){this.layer.setOpacity(a==1?0.99:a);this.fire("updated")}},setQuery:function(a){if(!this.options.added){if(this.options.debug){throw ("the layer is not still added to the map")}else{return}}if(!isNaN(a)){if(this.options.debug){throw (a+" is not a valid query")}else{return}}this.options.query=a;this._update()},setStyle:function(a){if(!this.options.added){if(this.options.debug){throw ("the layer is not still added to the map")}else{return}}if(!isNaN(a)){if(this.options.debug){throw (a+" is not a valid style")}else{return}}this.options.tile_style=a;this._update()},setInteractivity:function(a){if(!this.options.added){if(this.options.debug){throw ("the layer is not still added to the map")}else{return}}if(!isNaN(a)){if(this.options.debug){throw (a+" is not a valid setInteractivity value")}else{return}}this.options.interactivity=a;this._update()},setLayerOrder:function(a){},setInteraction:function(b){if(!this.options.added){if(this.options.debug){throw ("the layer is not still added to the map")}else{return}}if(b!==false&&b!==true){if(this.options.debug){throw (b+" is not a valid setInteraction value")}else{return}}if(this.interaction){if(b){var a=this;this.interaction.on("on",function(c){a._bindWaxOnEvents(a.options.map,c)});this.interaction.on("off",function(c){a._bindWaxOffEvents()})}else{this.interaction.off("on");this.interaction.off("off")}}},setAttribution:function(a){if(!this.options.added){if(this.options.debug){throw ("the layer is not still added to the map")}else{return}}if(!isNaN(a)){if(this.options.debug){throw (a+" is not a valid attribution")}else{return}}this.options.map.attributionControl.removeAttribution(this.options.attribution);this.options.attribution=a;this.options.map.attributionControl.addAttribution(this.options.attribution);this.layer.options.attribution=this.options.attribution;this.tilejson.attribution=this.options.attribution;this.fire("updated")},setOptions:function(a){if(!this.options.added){if(this.options.debug){throw ("the layer is not still added to the map")}else{return}}if(typeof a!="object"||a.length){if(this.options.debug){throw (a+" options has to be an object")}else{return}}L.Util.setOptions(this,a);this._update()},isVisible:function(){return this.options.visible},isAdded:function(){return this.options.added},hide:function(){if(!this.options.added){if(this.options.debug){throw ("the layer is not still added to the map")}else{return}}if(!this.options.visible){if(this.options.debug){throw ("the layer is already hidden")}else{return}}this.layer.setOpacity(0);this.setInteraction(false);this.options.visible=false;this.fire("hidden")},show:function(){if(!this.options.added){if(this.options.debug){throw ("the layer is not still added to the map")}else{return}}if(this.options.visible){if(this.options.debug){throw ("the layer is already shown")}else{return}}this.layer.setOpacity(this.options.opacity);this.setInteraction(true);this.options.visible=true;this.fire("shown")},_remove:function(){this.setInteraction(false);this.layer.off("loading").off("load");if(this.interaction){this.interaction.remove()}this.options.map.removeLayer(this.layer);this.fire("removed")},_update:function(){this._remove();this._addLayer();this.fire("updated")},setBounds:function(c){var a=this,b="";if(c){b=c}else{b=this.options.query}reqwest({url:this._generateCoreUrl("sql")+"/api/v2/sql/?q="+escape("SELECT ST_XMin(ST_Extent(the_geom)) as minx,ST_YMin(ST_Extent(the_geom)) as miny,ST_XMax(ST_Extent(the_geom)) as maxx,ST_YMax(ST_Extent(the_geom)) as maxy from ("+b.replace(/\{\{table_name\}\}/g,this.options.table_name)+") as subq"),type:"jsonp",jsonpCallback:"callback",success:function(q){if(q.rows[0].maxx!=null){var p=q.rows[0];var l=p.maxx;var j=p.maxy;var k=p.minx;var i=p.miny;var e=-85.0511;var g=85.0511;var m=-179;var n=179;var h=function(s,t,r){return s<t?t:s>r?r:s};l=h(l,m,n);k=h(k,m,n);j=h(j,e,g);i=h(i,e,g);var o=new L.LatLng(j,l);var f=new L.LatLng(i,k);var d=new L.LatLngBounds(o,f);a.options.map.fitBounds(d)}},error:function(d,f){if(this.options.debug){throw ("Error getting table bounds: "+f)}}})},_addLayer:function(){var a=this;this.tilejson=this._generateTileJson();this.layer=new wax.leaf.connector(this.tilejson).on("loading",function(){a.fire("loading",this)}).on("load",function(){a.fire("load",this)});this._checkTiles();this.options.map.addLayer(this.layer,false);if(this.options.interactivity){this.interaction=wax.leaf.interaction().map(this.options.map).tilejson(this.tilejson).on("on",function(b){a._bindWaxOnEvents(a.options.map,b)}).on("off",function(b){a._bindWaxOffEvents()})}},_bindWaxOnEvents:function(b,c){var a=this._findPos(b,c),d=b.layerPointToLatLng(a);switch(c.e.type){case"mousemove":if(this.options.featureOver){return this.options.featureOver(c.e,d,{x:c.e.clientX,y:c.e.clientY},c.data)}else{if(this.options.debug){throw ("featureOver function not defined")}}break;case"click":if(this.options.featureClick){this.options.featureClick(c.e,d,{x:c.e.clientX,y:c.e.clientY},c.data)}else{if(this.options.debug){throw ("featureClick function not defined")}}break;case"touchend":if(this.options.featureClick){this.options.featureClick(c.e,d,{x:c.e.clientX,y:c.e.clientY},c.data)}else{if(this.options.debug){throw ("featureClick function not defined")}}break;default:break}},_bindWaxOffEvents:function(){if(this.options.featureOut){return this.options.featureOut&&this.options.featureOut()}else{if(this.options.debug){throw ("featureOut function not defined")}}},_generateTileJson:function(){var c=this._generateTileUrls();var d=c.grid_url;if(c.grid_url.indexOf("{s}")!=-1){d=[];var a=this.options.subdomains;if(Object.prototype.toString.call(a)!=="[object Array]"){a.split("")}for(var b=0;b<a.length;b++){d.push(c.grid_url.replace(/\{s\}/g,a[b]))}}return{blankImage:NPMap.config.server+"/resources/img/blank-tile.png",tilejson:"1.0.0",scheme:"xyz",attribution:this.options.attribution,tiles:[c.tile_url],grids:d,tiles_base:c.tile_url,grids_base:d,opacity:this.options.opacity,formatter:function(e,f){return f}}},_parseUri:function(e){var d={strictMode:false,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},a=d.parser[d.strictMode?"strict":"loose"].exec(e),c={},b=14;while(b--){c[d.key[b]]=a[b]||""}c[d.q.name]={};c[d.key[12]].replace(d.q.parser,function(g,f,h){if(f){c[d.q.name][f]=h}});return c},_addUrlData:function(a,b){a+=(this._parseUri(a).query)?"&":"?";return a+=b},_generateCoreUrl:function(a){if(this.options.cdn_url){return this.options.cdn_url}if(a=="sql"){return this.options.sql_protocol+"://"+((this.options.user_name)?this.options.user_name+".":"")+this.options.sql_domain+((this.options.sql_port!="")?(":"+this.options.sql_port):"")}else{return this.options.tiler_protocol+"://"+((this.options.user_name)?this.options.user_name+".":"")+this.options.tiler_domain+((this.options.tiler_port!="")?(":"+this.options.tiler_port):"")}},_generateTileUrls:function(){var b=this._generateCoreUrl("tiler"),g=b+"/tiles/"+this.options.table_name+"/{z}/{x}/{y}",h=g+".png",a=g+".grid.json";if(this.options.query){var f=encodeURIComponent(this.options.query.replace(/\{\{table_name\}\}/g,this.options.table_name));f=f.replace(/%7Bx%7D/g,"{x}").replace(/%7By%7D/g,"{y}").replace(/%7Bz%7D/g,"{z}");var e="sql="+f;h=this._addUrlData(h,e);a=this._addUrlData(a,e)}for(_param in this.options.extra_params){h=this._addUrlData(h,_param+"="+this.options.extra_params[_param]);a=this._addUrlData(a,_param+"="+this.options.extra_params[_param])}if(this.options.tile_style){var c="style="+encodeURIComponent(this.options.tile_style.replace(/\{\{table_name\}\}/g,this.options.table_name));h=this._addUrlData(h,c);a=this._addUrlData(a,c)}if(this.options.interactivity){var d="interactivity="+encodeURIComponent(this.options.interactivity.replace(/ /g,""));h=this._addUrlData(h,d);a=this._addUrlData(a,d)}return{core_url:b,base_url:g,tile_url:h,grid_url:a}},_findPos:function(b,c){var d=curtop=0;var a=b._container;if(a.offsetParent){do{d+=a.offsetLeft;curtop+=a.offsetTop}while(a=a.offsetParent);return b.containerPointToLayerPoint(new L.Point((c.e.clientX||c.e.changedTouches[0].clientX)-d,(c.e.clientY||c.e.changedTouches[0].clientY)-curtop))}else{return b.mouseEventToLayerPoint(c.e)}},_checkTiles:function(){var c={z:4,x:6,y:6},b=this,a=new Image(),e=this._generateTileUrls();e.tile_url=e.tile_url.replace(/\{z\}/g,c.z).replace(/\{x\}/g,c.x).replace(/\{y\}/g,c.y);e.grid_url=e.grid_url.replace(/\{z\}/g,c.z).replace(/\{x\}/g,c.x).replace(/\{y\}/g,c.y);reqwest({method:"get",url:e.grid_url.replace(/\{s\}/g,"a"),type:"jsonp",jsonpCallback:"callback",jsonpCallbackName:"grid",success:function(){clearTimeout(d)},error:function(f,g){if(b.interaction){b.interaction.remove()}if(b.options.debug){throw ("There is an error in your query or your interaction parameter")}b.fire("layererror",g)}});var d=setTimeout(function(){clearTimeout(d);if(b.options.debug){throw ("There is an error in your query or your interaction parameter")}b.fire("layererror","There is a problem in your SQL or interaction parameter")},2000)}});
  
  var
      // The currently active baseLayer config.
      activeBaseLayer,
      // An array of the default base layers for the Leaflet baseAPI.
      DEFAULT_BASE_LAYERS = {
        aerial: {
          cls: 'aerial',
          icon: 'aerial',
          mapTypeId: 'Aerial',
          name: 'Aerial View',
          type: 'Api'
        },
        blank: {
          cls: 'blank',
          icon: 'blank',
          mapTypeId: 'Blank',
          name: 'Blank View',
          type: 'Api'
        },
        hybrid: {
          cls: 'hybrid',
          icon: 'aerial',
          mapTypeId: 'AerialWithLabels',
          name: 'Hybrid View',
          type: 'Api'
        },
        streets: {
          cls: 'streets',
          icon: 'street',
          mapTypeId: 'Road',
          name: 'Street View',
          type: 'Api'
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
      doubleClicked = false,
      // The center {L.LatLng} to initialize the map with.
      initialCenter = NPMap.config.center ? new L.LatLng(NPMap.config.center.lat, NPMap.config.center.lng) : new L.LatLng(39, -96),
      // The zoom level to initialize the map with.
      initialZoom = NPMap.config.zoom ? NPMap.config.zoom : 4,
      // The {L.Map} object.
      map,
      // The map config object.
      mapConfig = {
        attributionControl: false,
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false
      };

  /**
   * Handles the map resize.
   * @return null
   */
  function handleResize() {
    map.invalidateSize();
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
            activeBaseLayer.attribution.push(p.attrib);
          }

          p.active = true;
        } else {
          if (p.active) {
            activeBaseLayer.attribution.splice(_.indexOf(activeBaseLayer.attribution, p.attrib), 1);
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

      activeBaseLayer.attribution = [];
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

      activeBaseLayer.attribution = [];
      
      L.TileLayer.prototype.onRemove.apply(this, [map]);
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
    Map._matchBaseLayers(DEFAULT_BASE_LAYERS);

    for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
      var baseLayerI = NPMap.config.baseLayers[i];
      
      if (baseLayerI.visible) {
        activeBaseLayer = baseLayerI;

        if (baseLayerI.type === 'Zoomify') {
          mapConfig.crs = L.Util.extend({}, L.CRS, {
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
          mapConfig.worldCopyJump = false;
        }
        
        break;
      }
    }
  } else if (typeof NPMap.config.baseLayers === 'undefined') {
    NPMap.config.baseLayers = [
      DEFAULT_BASE_LAYERS['streets']
    ];
    NPMap.config.baseLayers[0].visible = true;
    activeBaseLayer = NPMap.config.baseLayers[0];
  } else {
    NPMap.config.baseLayers = [
      DEFAULT_BASE_LAYERS['blank']
    ];
    NPMap.config.baseLayers[0].visible = true;
    activeBaseLayer = NPMap.config.baseLayers[0];
  }
  
  if (typeof NPMap.config.restrictZoom !== 'undefined') {
    if (typeof NPMap.config.restrictZoom.max !== 'undefined') {
      mapConfig.maxZoom = NPMap.config.restrictZoom.max;
    }
    
    if (typeof NPMap.config.restrictZoom.min !== 'undefined') {
      mapConfig.minZoom = NPMap.config.restrictZoom.min;
    }
  } else {
    mapConfig.maxZoom = 19;
    mapConfig.minZoom = 0;
  }
  
  map = new L.Map(NPMap.config.div, mapConfig);

  for (var j = 0; j < NPMap.config.baseLayers.length; j++) {
    var baseLayerJ = NPMap.config.baseLayers[j];

    if (baseLayerJ.visible) {
      if (baseLayerJ.type === 'Api') {
        if (baseLayerJ.mapTypeId !== 'Blank') {
          // TODO: Switch this API key over to the key that is set in NPMap.config.
          baseLayerJ.api = new L.TileLayer.Bing('Ag4-2f0g7bcmcVgKeNYvH_byJpiPQSx4F9l0aQaz9pDYMORbeBFZ0N3C3A5LSf65', {
            type: baseLayerJ.mapTypeId
          });
          map.addLayer(baseLayerJ.api, true);
        }
      }

      NPMap.Event.trigger('NPMap.Map', 'baselayerchanged');
      break;
    }
  }

  // Update attribution.

  map.on('click', function(e) {
    doubleClicked = false;

    setTimeout(function() {
      if (!doubleClicked) {
        Event.trigger('NPMap.Map', 'click', e);
      }
    }, 350);
  });
  map.on('contextmenu', function(e) {
    Event.trigger('NPMap.Map', 'rightclick', e);
  });
  map.on('dblclick', function(e) {
    doubleClicked = true;

    Event.trigger('NPMap.Map', 'dblclick', e);
  });
  map.on('dragend', function() {
    Map.setCursor('default');
  });
  map.on('dragstart', function() {
    Map.setCursor('move');
  });
  map.on('mousedown', function(e) {
    Event.trigger('NPMap.Map', 'mousedown', e);
  });
  map.on('mouseenter', function(e) {
    Event.trigger('NPMap.Map', 'mouseover', e);
  });
  map.on('mouseleave', function(e) {
    Event.trigger('NPMap.Map', 'mouseout', e);
  });
  map.on('mousemove', function(e) {
    Event.trigger('NPMap.Map', 'mousemove', e);
  });
  map.on('mouseup', function(e) {
    Event.trigger('NPMap.Map', 'mouseup', e);
  });
  map.on('move', function(e) {
    if (NPMap.InfoBox.visible) {
      NPMap.InfoBox.reposition();
    }

    NPMap.Event.trigger('NPMap.Map', 'viewchanging');
  });
  map.on('zoomstart', function() {
    NPMap.Event.trigger('NPMap.Map', 'zoomstart');
  });
  Map._init();
  handleResize();
  
  return NPMap.Map.Leaflet = {
    // The current attribution for the map {Array}.
    _attribution: [],
    // Is the map loaded and ready to be interacted with programatically?
    _isReady: true,
    // The {L.Map} object. This reference should be used to access any of the Leaflet functionality that can't be done through NPMap's API.
    map: map,
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map.
     * @return null
     */
    addShape: function(shape) {
      shape.addTo(map);
    },
    /**
     * Adds a tile layer to the map.
     * @param {Object} layer
     * @return null
     */
    addTileLayer: function(layer) {
      map.addLayer(layer, layer.zIndex === 0);
    },
    /**
     * Sets the bounds of the map.
     * @param {L.LatLngBounds} bounds
     * @return null
     */
    bounds: function(bounds) {
      map.fitBounds(bounds);
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
      return new L.LatLngBounds(new L.LatLng(bounds.w, bounds.n), new L.LatLng(bounds.e, bounds.s));
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
      map.setView(latLng, zoom);
    },
    /**
     * Converts NPMap line options to Leaflet line options.
     * @param {Object} options
     * @return {Object}
     */
    convertLineOptions: function(options) {
      return '"Not yet implemented"';
    },
    /**
     * Converts NPMap marker options to Leaflet marker options.
     * @param {Object} options
     * @return {Object}
     */
    convertMarkerOptions: function(options) {
      return '"Not yet implemented"';
    },
    /**
     * Converts NPMap polygon options to Leaflet polygon options.
     * @param {Object} options
     * @return {Object}
     */
    convertPolygonOptions: function(options) {
      return '"Not yet implemented"';
    },
    /**
     * Creates a CartoDb layer.
     * @param {Object} options
     * @return {Object}
     */
    createCartoDbLayer: function(options) {
      options.auto_bound = false;
      options.debug = false;
      options.map = map;
      
      map.addLayer(new L.CartoDBLayer(options));
    },
    /**
     * Creates a line shape.
     * @param {Array} latLngs An array of {L.LatLng} objects.
     * @param {Object} options (Optional) Any additional options to apply to the line.
     * @return {Object}
     */
    createLine: function(latLngs, options) {
      return '"Not yet implemented"';
    },
    /**
     * Creates a marker shape.
     * @param latLng {L.LatLng} Where to place the marker.
     * @param options {Object} (Optional) Any additional options to apply to the marker.
     * @return {Object}
     */
    createMarker: function(latLng, options) {
      return new L.Marker(latLng);
    },
    /**
     * Creates a polygon shape.
     * @param latLngs {Array} (Required) An array of {L.LatLng} objects.
     * @param options {Object} (Optional) Any additional options to apply to the polygon.
     * @return {Object}
     */
    createPolygon: function(latLngs, options) {
      return '"Not yet implemented"';
    },
    /**
     * Creates a tile layer.
     * @param {String/Function} constructor
     * @param {Object} options (Optional)
     * @return {Object}
     */
    createTileLayer: function(constructor, options) {
      var getSubdomain = null,
          uriConstructor;

      options = options || {};

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

      if (typeof constructor === 'string') {
        uriConstructor = function(xy) {
          var template = _.template(constructor),
              uri = template({
                x: xy.x,
                y: xy.y,
                z: map.getZoom()
              });

          if (getSubdomain) {
            uri = uri.replace('{{s}}', getSubdomain());
          }
          
          return uri;
        };
      } else {
        uriConstructor = function(xy) {
          var subdomain = null;

          if (getSubdomain) {
            subdomain = getSubdomain();
          }

          return constructor(xy.x, xy.y, map.getZoom(), options.url ? options.url : null, subdomain);
        };
      }

      return new L.TileLayer.Simple(uriConstructor, options);
    },
    /**
     * Creates a Zoomify layer.
     * @param {Object} config
     * @return {Object}
     */
    createZoomifyLayer: function(config) {
      return new L.TileLayer.Zoomify(config.url, {
        height: config.height,
        width: config.width
      });
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
        return map.mouseEventToLatLng(e);
      }
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
      return map.getBounds();
    },
    /**
     * Gets the center {L.LatLng} of the map.
     * @return {Object}
     */
    getCenter: function() {
      return map.getCenter();
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
      return mapConfig.maxZoom;
    },
    /**
     * Gets the minimum zoom level for this map.
     * @return {Number}
     */
    getMinZoom: function() {
      return mapConfig.minZoom;
    },
    /**
     * Gets the zoom level of the map.
     * @return {Number}
     */
    getZoom: function() {
      return map.getZoom();
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     * @param {Function} callback
     * @return null
     */
    handleResize: function(callback) {
      handleResize();
      
      if (callback) {
        callback();
      }
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
      return map.latLngToContainerPoint(latLng);
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     * @param {Function} callback (Optional)
     * @return null
     */
    panByPixels: function(pixels, callback) {
      map.panBy(new L.Point(-pixels.x, -pixels.y));

      if (callback) {
        function callbackPanByPixels() {
          map.off('moveend', callbackPanByPixels);
          callback();
        }

        map.on('moveend', callbackPanByPixels);
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
      return map.containerPointToLatLng(pixel);
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

            if (typeof(to) === 'string') {
              to = to.split(',');
              latLng = new L.LatLng(parseFloat(to[0]), parseFloat(to[1]));
            } else {
              if (typeof to.lat === 'number') {
                latLng = new L.LatLng(to.lat, to.lng);
              } else {
                latLng = to.getLatLng();
              }
            }
            
            return latLng;
          })(),
          pixel = this.latLngToPixel(latLng);

      clickDot.style.left = pixel.x + 'px';
      clickDot.style.top = pixel.y + 'px';
    },
    /**
     * Removes a tile layer from the map.
     * @param {Object} layer
     * @return null
     */
    removeTileLayer: function(layer) {
      map.removeLayer(layer);
    },
    /**
     * Sets the initial center of the map.
     * @param {Object} center
     * @return null
     */
    setInitialCenter: function(center) {
      initialCenter = center;
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
      NPMap.config.restrictZoom = NPMap.config.restrictZoom || {};
      
      if (restrictions.max) {
        NPMap.config.restrictZoom.max = max;
      }
      
      if (restrictions.min) {
        NPMap.config.restrictZoom.min = min;
      }
      
      // TODO: Cannot currently set zoom restrictions dynamically using Leaflet API.
    },
    /**
     * Switches the base map.
     * @param {Object} baseLayer The base layer to switch to.
     * @return null
     */
    switchBaseLayer: function(baseLayer) {
      var api,
          cls = baseLayer.cls,
          mapTypeId,
          me = this,
          removeAttribution = [];

      for (var k = 0; k < NPMap.config.baseLayers.length; k++) {
        var bl = NPMap.config.baseLayers[k];

        if (bl.visible) {
          activeBaseLayer = bl;
        }

        bl.visible = false;
      }

      if (activeBaseLayer.type === 'Api') {
        if (activeBaseLayer.mapTypeId !== 'Blank') {
          map.removeLayer(activeBaseLayer.api);
          delete activeBaseLayer.api;
        }
      } else {
        NPMap.Layer[activeBaseLayer.type].remove(activeBaseLayer);
      }

      activeBaseLayer = baseLayer;

      if (cls) {
        cls = cls.toLowerCase();
      }

      if (baseLayer.type === 'Api') {
        if (baseLayer.mapTypeId !== 'blank') {
          baseLayer.api = new L.TileLayer.Bing('Ag4-2f0g7bcmcVgKeNYvH_byJpiPQSx4F9l0aQaz9pDYMORbeBFZ0N3C3A5LSf65', {
            type: baseLayer.mapTypeId
          });
          map.addLayer(baseLayer.api, true);
        }
      } else {
        NPMap.Layer[baseLayer.type].create(baseLayer);
      }

      baseLayer.visible = true;

      NPMap.Event.trigger('NPMap.Map', 'baselayerchanged');
    },
    /**
     * Zooms the map to a {L.LatLngBounds}.
     * @param {Object} bounds
     * @return null
     */
    toBounds: function(bounds) {
      map.fitBounds(bounds);
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     * @return null
     */
    toInitialExtent: function() {
      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.hide();
      }
      map.setView(initialCenter, initialZoom);
    },
    /**
     * Zooms the map to the extent of an array of latLng objects.
     * @param {Array} latLngs The array of latLng objects.
     * @return null
     */
    toLatLngs: function(latLngs) {
      map.setExtent(latLngs);
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
      map.setView(this.getCenter(), zoom);
    },
    /**
     * Zooms the map in by one zoom level.
     * @return null
     */
    zoomIn: function() {
      map.zoomIn();
    },
    /**
     * Zooms the map out by one zoom level.
     * @return null
     */
    zoomOut: function() {
      map.zoomOut();
    }
  };
});