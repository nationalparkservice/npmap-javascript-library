/**
 * wax - 7.0.0dev11 - v6.0.4-113-g6b1c56c, customized a bit to filter out Bing layers and properly set opacity and zIndex on layers.
 */
wax.leaf = {};
wax.leaf.interaction = function() {
  function a() {
    h = !0;
  }

  var h = !1, f, c;

  return wax.interaction().attach(function(g) {
    if (!arguments.length) {
      return c;
    }
    
    c = g;
    
    for (var d = ["moveend"], b = 0; b < d.length; b++) {
      c.on(d[b], a);
    }
  }).detach(function(g) {
    if (!arguments.length) {
      return c;
    }

    c = g;
    
    for (var d = ["moveend"], b = 0; b < d.length; b++) {
      c.off(d[b], a);
    }
  }).parent(function() {
    return c._container;
  }).grid(function() {
    if (!h && f) {
      return f;
    }

    var a = c._layers, d = [], b;
    
    for (b in a) {
      var e = a[b]._url;
      if ("undefined" !== typeof e && ("string" === typeof e && -1 === e.indexOf("virtualearth") || "function" === typeof e) && a[b]._tiles) {
        for (var j in a[b]._tiles) {
          if (e = a[b]._tiles[j], e.src) {
            var i = wax.u.offset(e);
            
            d.push([i.top, i.left, e]);
          }
        }
      }
    }

    return f = d;
  });
};
wax.leaf.connector = L.TileLayer.extend({
  initialize: function(a, b) {
    a = a || {};
    b = b || {};
    a.minZoom = a.minzoom || 0;
    a.maxZoom = a.maxzoom || 22;
    a.opacity = b.opacity || 1.0;

    if (typeof b.zIndex === 'number') {
      a.zIndex = b.zIndex;
    }

    L.TileLayer.prototype.initialize.call(this, a.tiles[0], a);
  }
});