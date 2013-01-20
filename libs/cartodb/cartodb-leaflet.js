/**
 * CartoDb - v0.55, slightly modified by NPS.
 */
L.CartoDBLayer = L.TileLayer.extend({
  version: "0.55",
  includes: L.Mixin.Events,
  options: {
    query: "SELECT * FROM {{table_name}}",
    opacity: 0.99,
    auto_bound: false,
    attribution: "CartoDB",
    debug: false,
    visible: true,
    added: false,
    tiler_domain: "cartodb.com", tiler_port:"80",
    tiler_protocol: "http",
    sql_domain: "cartodb.com",
    sql_port: "80",
    sql_protocol: "http",
    extra_params: {},
    cdn_url: null,
    subdomains: "abc"
  },
  initialize: function(a) {
    L.Util.setOptions(this, a);

    if (!a.table_name || !a.map) {
      if (a.debug) {
        throw "cartodb-leaflet needs at least a CartoDB table name and the Leaflet map object :(";
      } else {
        return;
      }
    }
  
    if (a.auto_bound) {
      this.setBounds();
    }
  },
  onAdd: function(a) {
    this._addLayer();
    this.fire("added");
    this.options.added = true;
  },
  onRemove: function(a) {
    this._remove();
    this.options.added = false;
  },
  setOpacity: function(a) {
    if (!this.options.added) {
      if (this.options.debug) {
        throw "the layer is not still added to the map";
      } else {
        return;
      }
    }

    if (isNaN(a) || a > 1 || a < 0) {
      if (this.options.debug) {
        throw a + " is not a valid value";
      } else {
        return;
      }
    }

    this.options.opacity = a;
    
    if (this.options.visible) {
      this.layer.setOpacity(a == 1 ? 0.99 : a);
      this.fire("updated");
    }
  },
  setQuery:function(a) {
    if (!this.options.added) {
      if (this.options.debug) {
        throw "the layer is not still added to the map";
      } else {
        return;
      }
    }

    if (!isNaN(a)) {
      if (this.options.debug) {
        throw a + " is not a valid query";
      } else {
        return;
      }
    }

    this.options.query = a;
    this._update();
  },
  setStyle: function(a) {
    if (!this.options.added) {
      if (this.options.debug) {
        throw"the layer is not still added to the map";
      } else {
        return;
      }
    }

    if (!isNaN(a)) {
      if (this.options.debug) {
        throw a + " is not a valid style";
      } else {
        return;
      }
    }

    this.options.tile_style = a;
    this._update();
  },
  setInteractivity: function(a) {
    if (!this.options.added) {
      if(this.options.debug) {
        throw"the layer is not still added to the map";
      } else {
        return;
      }
    }

    if (!isNaN(a)) {
      if (this.options.debug) {
        throw a + " is not a valid setInteractivity value";
      } else {
        return;
      }
    }

    this.options.interactivity = a;
    this._update();
  },
  setLayerOrder:function(a) {
  
  },
  setInteraction:function(b) {
    if (!this.options.added) {
      if (this.options.debug) {
        throw"the layer is not still added to the map";
      } else {
        return;
      }
    }
    
    if (b !== false && b !== true) {
      if (this.options.debug) {
        throw b + " is not a valid setInteraction value";
      } else {
        return;
      }
    }

    if (this.interaction) {
      if (b) {
        var a = this;

        this.interaction.on("on", function(c) {
          a._bindWaxOnEvents(a.options.map, c);
        });
        this.interaction.on("off", function(c) {
          a._bindWaxOffEvents();
        });
      } else {
        this.interaction.off("on");
        this.interaction.off("off");
      }
    }
  },
  setAttribution: function(a) {
    if (!this.options.added) {
      if (this.options.debug) {
        throw "The layer is still not added to the map";
      } else {
        return;
      }
    }
    if (!isNaN(a)) {
      if (this.options.debug) {
        throw a + " is not a valid attribution";
      } else {
        return;
      }
    }

    this.options.map.attributionControl.removeAttribution(this.options.attribution);
    this.options.attribution = a;
    this.options.map.attributionControl.addAttribution(this.options.attribution);
    this.layer.options.attribution = this.options.attribution;
    this.tilejson.attribution = this.options.attribution;
    this.fire("updated");
  },
  setOptions: function(a) {
    if (!this.options.added) {
      if (this.options.debug) {
        throw "the layer is not still added to the map";
      } else {
        return;
      }
    }

    if (typeof a != "object" || a.length) {
      if (this.options.debug) {
        throw a + " options has to be an object";
      } else {
        return;
      }
    }
    
    L.Util.setOptions(this, a);
    this._update();
  },
  isVisible: function() {
    return this.options.visible;
  },
  isAdded: function() {
    return this.options.added;
  },
  hide: function() {
    if (!this.options.added) {
      if (this.options.debug) {
        throw "the layer is not still added to the map";
      } else {
        return;
      }
    }

    if (!this.options.visible) {
      if (this.options.debug) {
        throw "the layer is already hidden";
      } else {
        return;
      }
    }

    this.layer.setOpacity(0);
    this.setInteraction(false);
    this.options.visible = false;
    this.fire("hidden");
  },
  show: function() {
    if (!this.options.added) {
      if (this.options.debug) {
        throw "the layer is not still added to the map";
      } else {
        return;
      }
    }

    if (this.options.visible) {
      if (this.options.debug) {
        throw "the layer is already shown";
      } else {
        return;
      }
    }

    this.layer.setOpacity(this.options.opacity);
    this.setInteraction(true);
    this.options.visible = true;
    this.fire("shown");
  },
  _remove: function() {
    this.setInteraction(false);
    this.layer.off("loading").off("load");
    
    if (this.interaction) {
      this.interaction.remove();
    }

    this.options.map.removeLayer(this.layer);
    this.fire("removed");
  },
  _update: function() {
    this._remove();
    this._addLayer();
    this.fire("updated");
  },
  setBounds:function(c) {
    var a = this, b = "";

    if (c) {
      b = c;
    } else {
      b = this.options.query;
    }

    reqwest({
      url: this._generateCoreUrl("sql") + "/api/v2/sql/?q=" + escape("SELECT ST_XMin(ST_Extent(the_geom)) as minx,ST_YMin(ST_Extent(the_geom)) as miny,ST_XMax(ST_Extent(the_geom)) as maxx,ST_YMax(ST_Extent(the_geom)) as maxy from (" + b.replace(/\{\{table_name\}\}/g, this.options.table_name) + ") as subq"),
      type: "jsonp",
      jsonpCallback: "callback",
      success: function(q) {
        if (q.rows[0].maxx != null) {
          var p = q.rows[0];
          var l = p.maxx;
          var j = p.maxy;
          var k = p.minx;
          var i = p.miny;
          var e = -85.0511;
          var g = 85.0511;
          var m = -179;
          var n = 179;
          var h = function(s, t, r) {
            return s < t ? t : s > r ? r : s;
          };
          l = h(l, m, n);
          k = h(k, m, n);
          j = h(j, e, g);
          i = h(i, e, g);
          var o = new L.LatLng(j, l);
          var f = new L.LatLng(i, k);
          var d = new L.LatLngBounds(o, f);
          a.options.map.fitBounds(d);
        }
      },
      error: function(d, f) {
        if(this.options.debug) {
          throw"Error getting table bounds: " + f;
        }
      }
    });
  },
  _addLayer: function() {
    var a = this;

    this.tilejson = this._generateTileJson();
    this.layer = (new wax.leaf.connector(this.tilejson)).on("loading", function() {
      a.fire("loading", this);
    }).on("load", function() {
      a.fire("load", this);
    });
    this._checkTiles();
    this.options.map.addLayer(this.layer, false);
    
    if (this.options.interactivity) {
      this.interaction = wax.leaf.interaction().map(this.options.map).tilejson(this.tilejson).on("on", function(b) {
        a._bindWaxOnEvents(a.options.map, b);
      }).on("off", function(b) {
        a._bindWaxOffEvents();
      });
    }
  },
  _bindWaxOnEvents: function(b, c) {
    var a = this._findPos(b, c), d = b.layerPointToLatLng(a);
    
    switch (c.e.type) {
      case "mousemove":
        if (this.options.featureOver) {
          return this.options.featureOver(c.e, d, {x:c.e.clientX, y:c.e.clientY}, c.data);
        } else {
          if(this.options.debug) {
            throw "featureOver function not defined";
          }
        }
        break;
      case "click":
        if (this.options.featureClick) {
          this.options.featureClick(c.e, d, {x:c.e.clientX, y:c.e.clientY}, c.data);
        } else {
          if (this.options.debug) {
            throw "featureClick function not defined";
          }
        }
        break;
      case "touchend":
        if (this.options.featureClick) {
          this.options.featureClick(c.e, d, {x:c.e.clientX, y:c.e.clientY}, c.data);
        } else {
          if (this.options.debug) {
            throw "featureClick function not defined";
          }
        }
        break;
      default:
        break;
    }
  },
  _bindWaxOffEvents: function() {
    if (this.options.featureOut) {
      return this.options.featureOut && this.options.featureOut();
    } else {
      if (this.options.debug) {
        throw "featureOut function not defined";
      }
    }
  },
  _generateTileJson:function() {
    var c = this._generateTileUrls();
    var d = c.grid_url;

    if (c.grid_url.indexOf("{s}") != -1) {
      d = [];
      
      var a = this.options.subdomains;
      
      if (Object.prototype.toString.call(a) !== "[object Array]") {
        a.split("");
      }

      for (var b = 0;b < a.length;b++) {
        d.push(c.grid_url.replace(/\{s\}/g, a[b]));
      }
    }

    return {
      blankImage: NPMap.config.server + "/resources/img/blank-tile.png",
      tilejson: "1.0.0",
      scheme: "xyz",
      attribution: this.options.attribution,
      tiles: [
        c.tile_url
      ],
      grids: d,
      tiles_base: c.tile_url,
      grids_base: d,
      opacity: this.options.opacity,
      formatter: function(e, f) {
        return f;
      }
    };
  },
  _parseUri:function(e) {
    var d = {
      strictMode: false,
      key: [
        "source",
        "protocol",
        "authority",
        "userInfo",
        "user",
        "password",
        "host",
        "port",
        "relative",
        "path",
        "directory",
        "file",
        "query",
        "anchor"
      ],
      q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g},
        parser: {
          strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
          loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
      }, 
      a = d.parser[d.strictMode ? "strict" : "loose"].exec(e),
      c = {},
      b = 14;
    
    while (b--) {
      c[d.key[b]] = a[b] || "";
    }

    c[d.q.name] = {};
    c[d.key[12]].replace(d.q.parser, function(g, f, h) {
      if (f) {
        c[d.q.name][f] = h;
      }
    });

    return c;
  },
  _addUrlData: function(a, b) {
    a += this._parseUri(a).query ? "&" : "?";
    return a += b;
  },
  _generateCoreUrl: function(a) {
    if (this.options.cdn_url) {
      return this.options.cdn_url;
    }

    if (a == "sql") {
      return this.options.sql_protocol + "://" + (this.options.user_name ? this.options.user_name + "." : "") + this.options.sql_domain + (this.options.sql_port != "" ? ":" + this.options.sql_port : "");
    } else {
      return this.options.tiler_protocol + "://" + (this.options.user_name ? this.options.user_name + "." : "") + this.options.tiler_domain + (this.options.tiler_port != "" ? ":" + this.options.tiler_port : "");
    }
  },
  _generateTileUrls: function() {
    var b = this._generateCoreUrl("tiler"),
        g = b + "/tiles/" + this.options.table_name + "/{z}/{x}/{y}",
        h = g + ".png",
        a = g + ".grid.json";
    
    if (this.options.query) {
      var f = encodeURIComponent(this.options.query.replace(/\{\{table_name\}\}/g, this.options.table_name));
      f = f.replace(/%7Bx%7D/g, "{x}").replace(/%7By%7D/g, "{y}").replace(/%7Bz%7D/g, "{z}");
      var e = "sql=" + f;
      h = this._addUrlData(h, e);
      a = this._addUrlData(a, e);
    }

    for (_param in this.options.extra_params) {
      h = this._addUrlData(h, _param + "=" + this.options.extra_params[_param]);
      a = this._addUrlData(a, _param + "=" + this.options.extra_params[_param]);
    }

    if (this.options.tile_style) {
      var c = "style=" + encodeURIComponent(this.options.tile_style.replace(/\{\{table_name\}\}/g, this.options.table_name));
      h = this._addUrlData(h, c);
      a = this._addUrlData(a, c);
    }

    if (this.options.interactivity) {
      var d = "interactivity=" + encodeURIComponent(this.options.interactivity.replace(/ /g, ""));
      h = this._addUrlData(h, d);
      a = this._addUrlData(a, d);
    }

    return {
      core_url: b,
      base_url: g,
      tile_url: h,
      grid_url: a
    };
  },
  _findPos: function(b, c) {
    var d = curtop = 0;
    var a = b._container;
    
    if (a.offsetParent) {
      do {
        d += a.offsetLeft;
        curtop += a.offsetTop;
      } while (a = a.offsetParent);
      
      return b.containerPointToLayerPoint(new L.Point((c.e.clientX || c.e.changedTouches[0].clientX) - d, (c.e.clientY || c.e.changedTouches[0].clientY) - curtop));
    } else {
      return b.mouseEventToLayerPoint(c.e);
    }
  },
  _checkTiles:function() {
    var c = {
        z: 4,
        x: 6,
        y: 6
      },
      b = this,
      a = new Image(),
      e = this._generateTileUrls();

    e.tile_url = e.tile_url.replace(/\{z\}/g, c.z).replace(/\{x\}/g, c.x).replace(/\{y\}/g, c.y);
    e.grid_url = e.grid_url.replace(/\{z\}/g, c.z).replace(/\{x\}/g, c.x).replace(/\{y\}/g, c.y);
    
    reqwest({
      method: "get",
      url: e.grid_url.replace(/\{s\}/g, "a"),
      type: "jsonp",
      jsonpCallback: "callback",
      jsonpCallbackName: "grid",
      success: function() {
        clearTimeout(d);
      },
      error: function(f, g) {
        if (b.interaction) {
          b.interaction.remove();
        }
      
        if (b.options.debug) {
          throw "There is an error in your query or your interaction parameter";
        }
      
        b.fire("layererror", g);
    }});

    var d = setTimeout(function() {
      clearTimeout(d);
      
      if (b.options.debug) {
        throw "There is an error in your query or your interaction parameter";
      }

      b.fire("layererror", "There is a problem in your SQL or interaction parameter");
    }, 2E3);
  }});