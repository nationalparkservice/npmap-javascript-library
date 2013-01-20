/**
 * wax - 7.0.0dev13 - v6.0.4-142-ga157a2d
 */
wax.g = {};
wax.g.bwdetect = function(map, options) {
    options = options || {};
    var lowpng = options.png || '.png128',
        lowjpg = options.jpg || '.jpg70';

    // Create a low-bandwidth map type.
    if (!map.mapTypes['mb-low']) {
        var mb = map.mapTypes.mb;
        var tilejson = {
            tiles: [],
            scheme: mb.options.scheme,
            blankImage: mb.options.blankImage,
            minzoom: mb.minZoom,
            maxzoom: mb.maxZoom,
            name: mb.name,
            description: mb.description
        };
        for (var i = 0; i < mb.options.tiles.length; i++) {
            tilejson.tiles.push(mb.options.tiles[i]
                .replace('.png', lowpng)
                .replace('.jpg', lowjpg));
        }
        m.mapTypes.set('mb-low', new wax.g.connector(tilejson));
    }

    return wax.bwdetect(options, function(bw) {
      map.setMapTypeId(bw ? 'mb' : 'mb-low');
    });
};
wax.g.interaction = function() {
  var _grid,
      dirty = false,
      map,
      tileloadListener = null,
      idleListener = null;
  
  function attach(x) {
    if (!arguments.length) {
      return map;
    }

    map = x;
    idleListener = google.maps.event.addListener(map, 'idle', setdirty);
    tileloadListener = google.maps.event.addListener(map, 'tileloaded', setdirty);
  }
  function detach(x) {
    if (tileloadListener) {
      google.maps.event.removeListener(tileloadListener);
    }
    
    if (idleListener) {
      google.maps.event.removeListener(idleListener);
    }
  }
  function grid() {
    if (!dirty && _grid) {
      return _grid;
    } else {
      var mapOffset = wax.u.offset(map.getDiv()),
          zoom = map.getZoom();

      _grid = [];

      var get = function(mapType) {
        if (!mapType.interactive) {
          return;
        }

        for (var key in mapType.cache) {
          if (key.split('/')[0] != zoom) {
            continue;
          }

          var tileOffset = wax.u.offset(mapType.cache[key]);

          _grid.push([
            tileOffset.top,
            tileOffset.left,
            mapType.cache[key]
          ]);
        }
      };
      
      // Iterate over base mapTypes and overlayMapTypes.
      for (var i in map.mapTypes) {
        get(map.mapTypes[i]);
      }

      map.overlayMapTypes.forEach(get);
    }
    
    return _grid;
  }
  function setdirty() {
    dirty = true;
  }

  return wax.interaction().attach(attach).detach(detach).parent(function() {
    return map.getDiv();
  }).grid(grid);
};
wax.g.connector = function(options) {
    options = options || {};

    this.options = {
        tiles: options.tiles,
        scheme: options.scheme || 'xyz',
        blankImage: options.blankImage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
    };

    this.minZoom = options.minzoom || 0;
    this.maxZoom = options.maxzoom || 22;

    this.name = options.name || '';
    this.description = options.description || '';

    // non-configurable options
    this.interactive = true;
    this.tileSize = new google.maps.Size(256, 256);

    // DOM element cache
    this.cache = {};
};

// Get a tile element from a coordinate, zoom level, and an ownerDocument.
wax.g.connector.prototype.getTile = function(coord, zoom, ownerDocument) {
    var key = zoom + '/' + coord.x + '/' + coord.y;
    if (!this.cache[key]) {
        var img = this.cache[key] = new Image(256, 256);
        this.cache[key].src = this.getTileUrl(coord, zoom);
        this.cache[key].setAttribute('gTileKey', key);
        this.cache[key].onerror = function() { img.style.display = 'none'; };
    }
    return this.cache[key];
};

// Remove a tile that has fallen out of the map's viewport.
//
// TODO: expire cache data in the gridmanager.
wax.g.connector.prototype.releaseTile = function(tile) {
    var key = tile.getAttribute('gTileKey');
    if (this.cache[key]) delete this.cache[key];
    if (tile.parentNode) tile.parentNode.removeChild(tile);
};

// Get a tile url, based on x, y coordinates and a z value.
wax.g.connector.prototype.getTileUrl = function(coord, z) {
    // Y coordinate is flipped in Mapbox, compared to Google
    var mod = Math.pow(2, z),
        y = (this.options.scheme === 'tms') ?
            (mod - 1) - coord.y :
            coord.y,
        x = (coord.x % mod);

    x = (x < 0) ? (coord.x % mod) + mod : x;

    if (y < 0) return this.options.blankImage;

    return this.options.tiles
        [parseInt(x + y, 10) %
            this.options.tiles.length]
                .replace(/\{z\}/g, z)
                .replace(/\{x\}/g, x)
                .replace(/\{y\}/g, y);
};