/**
 * @module NPMap.Layer
 * @event 'added'
 * @event 'beforeadd'
 * @event 'ready'
 * @event 'removed'
 */
define([
  'Event',
  'Map/Map'
], function(Event, Map) {
  var
      // A count of the number of visible layers that the map is initialized with.
      initializedActiveLayerCount = (function() {
        var count = 0;

        if (NPMap.config.baseLayers) {
          for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
            var baseLayer = NPMap.config.baseLayers[i];

            if (baseLayer.type !== 'Api' && baseLayer.visible) {
              count++;
              break;
            }
          }
        }

        if (NPMap.config.layers) {
          for (var j = 0; j < NPMap.config.layers.length; j++) {
            var visible = NPMap.config.layers[j].visible;

            if (typeof visible === 'undefined' || visible === true) {
              count++;
            }
          }
        }

        return count;
      })(),
      //
      interval,
      // Information about all of NPMap's layer handlers.
      LAYER_HANDLERS = {
        ArcGisServerRest: {
          clickable: true,
          type: 'raster'
        },
        CartoDb: {
          clickable: true,
          type: 'vector'
        },
        GeoJson: {
          clickable: true,
          type: 'vector'
        },
        GoogleFusion: {
          clickable: true,
          type: 'vector'
        },
        Json: {
          clickable: true,
          type: 'vector'
        },
        Kml: {
          clickable: true,
          type: 'vector'
        },
        NativeVectors: {
          clickable: true,
          type: 'vector'
        },
        Tiled: {
          clickable: true,
          type: 'raster'
        },
        TileStream: {
          clickable: true,
          type: 'vector'
        },
        Xml: {
          clickable: true,
          type: 'vector'
        },
        Zoomify: {
          clickable: false,
          type: 'raster'
        }
      },
      // The layer names that have already been added to the map.
      usedNames = [];

  Event.add('NPMap.Layer', 'added', function(config) {
    this._countAdded++;
    Map.updateAttribution();
  });
  Event.add('NPMap.Layer', 'beforeadd', function(config) {
    if (!config.name) {
      config.name = 'Layer_' + new Date().getTime();

      if (_.indexOf(usedNames, config.name) !== -1) {
        var random = Math.floor(Math.random() * (999999999 - 0 + 1)) + 0;

        config.name = config.name + random;
      }
    }

    if (_.indexOf(usedNames, config.name) === -1) {
      usedNames.push(config.name);
    } else {
      throw new Error('All layer names must be unique. "' + config.name + '" is used more than once.');
    }

    if (!config.type) {
      throw new Error('All layers must have a "type".');
    }

    var meta = LAYER_HANDLERS[config.type];
    
    if (meta.type === 'vector') {
      var lineStyle = {};
          markerStyle = {
            anchor: {
              x: 6.5,
              y: 0
            },
            height: 13,
            url: NPMap.config.server + '/resources/img/markers/brown-circle-13x13.png',
            width: 13
          },
          polygonStyle = {
            fillColor: '5e7630',
            fillOpacity: 174,
            strokeColor: '5e7630',
            strokeOpacity: 200,
            strokeWidth: 1
          },
          style = config.style;

      if (style) {
        if (style.line) {
          lineStyle = style.line;
        }

        if (style.marker && style.marker.url) {
          if (style.marker.height && style.marker.width) {
            if (!style.marker.anchor) {
              style.marker.anchor = {
                x: style.marker.width / 2,
                y: 0
              };
            }

            markerStyle = style.marker;
          } else {
            // TODO: You need to load the image and calculate the height, width, and anchor here.
            markerStyle = style.marker;
          }
        }

        if (style.polygon) {
          polygonStyle = style.polygon;
        }
      } else {
        style = {};
      }

      config.style = {
        line: Map[NPMap.config.api].convertLineOptions(lineStyle),
        marker: Map[NPMap.config.api].convertMarkerOptions(markerStyle),
        polygon: Map[NPMap.config.api].convertPolygonOptions(polygonStyle)
      };
    }
  });
  Event.add('NPMap.Layer', 'removed', function(config) {
    usedNames.splice(_.indexOf(usedNames, config.name), 1);
    Map.updateAttribution();
  });
  Event.add('NPMap.Map', 'click', function(e) {
    if (NPMap.config.layers && NPMap.config.layers.length > 0) {
      for (var i = 0; i < NPMap.config.layers.length; i++) {
        var layerType = NPMap.config.layers[i].type,
            meta = LAYER_HANDLERS[layerType];

        if (meta.type === 'raster' && meta.clickable === true) {
          NPMap.Layer[layerType]._handleClick(e);
        }
      }
    }
  });
  Event.add('NPMap.Map', 'shapeclick', function(e) {
    if (NPMap.config.layers && NPMap.config.layers.length > 0) {
      for (var j = 0; j < NPMap.config.layers.length; j++) {
        var layerType = NPMap.config.layers[j].type,
            meta = LAYER_HANDLERS[layerType];
            
        if (meta.type === 'vector' && meta.clickable === true) {
          NPMap.Layer[layerType]._handleClick(e);
        }
      }
    }
  });
  Event.add('NPMap.Map', 'zoomstart', function() {
    if (!NPMap.InfoBox.marker) {
      NPMap.InfoBox.hide();
    }
  });

  interval = setInterval(function() {
    var Layer = NPMap.Layer;

    if (typeof Layer !== 'undefined' && typeof Layer._countAdded !== 'undefined' && Layer._countAdded === initializedActiveLayerCount) {
      clearInterval(interval);
      delete Layer._countAdded;
      Event.trigger('NPMap.Layer', 'ready');
    }
  }, 250);
  
  return NPMap.Layer = {
    // The number of layers that have been added. This property is deleted after the NPMap.Map ready event is triggered.
    _countAdded: 0,
    /**
     * Gets the active layer types for both the baseLayers and layers configs.
     * @return {Array}
     */
    getActiveLayerTypes: function() {
      var types = [];
      
      this.iterateThroughAllLayers(function(l) {
        var type = l.type,
            visible = l.visible;

        if ((typeof visible === 'undefined' || visible === true) && _.indexOf(types, type) === -1) {
          types.push(type);
        }
      });

      return types;
    },
    /**
     * Gets a layer config object by layer id.
     * @param {String} id The id of the layer to search for.
     * @param {Array} layers (Optional) The array of layers to search. If this is undefined or null, the NPMap.config.layers array will be searched.
     * @return {Object}
     */
    getLayerById: function(id, layers) {
      if (!layers) {
        layers = NPMap.config.layers;
      }

      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (layer.id === id) {
          return layer;
        }
      }
    },
    /**
     * Gets a layer config object by layer name.
     * @param {String} name The name of the layer to search for.
     * @param {Array} layers (Optional) The array of layers to search. If this is undefined or null, the NPMap.config.layers array will be searched.
     * @return {Object}
     */
    getLayerByName: function(name, layers) {
      if (!layers) {
        layers = NPMap.config.layers;
      }

      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (layer.name === name) {
          return layer;
        }
      }
    },
    /**
     * Gets the layer name.
     * @param {Object} config
     * @return {String}
     */
    getName: function(config) {
      return config.name;
    },
    /**
     * Gets the layer type.
     * @param {Object} config
     * @return {String}
     */
    getType: function(config) {
      return config.type;
    },
    /**
     * Gets the layers that are currently visible.
     * @return {Array}
     */
    getVisibleLayers: function() {
      var layers = [];

      this.iterateThroughAllLayers(function(l) {
        if (l.visible) {
          layers.push(l);
        }
      });
      
      return layers;
    },
    /**
     * Iterates through all the objects in the NPMap.config.baseLayers and NPMap.config.layers configs. The function will be passed each of the layer config objects as a parameter.
     * @param {Function} func
     * @return null
     */
    iterateThroughAllLayers: function(func) {
      this.iterateThroughBaseLayers(func);
      this.iterateThroughLayers(func);
    },
    /**
     * Iterates through all the objects in the NPMap.config.baseLayers config. The function will be passed each of the layer config objects as a parameter.
     * @param {Function} func
     * @return null
     */
    iterateThroughBaseLayers: function(func) {
      if (NPMap.config.baseLayers) {
        _.each(NPMap.config.baseLayers, func);
      }
    },
    /**
     * Iterates through all the objects in the NPMap.config.layers config. The function will be passed each of the layer config objects as a parameter.
     * @param {Function} func
     * @return null
     */
    iterateThroughLayers: function(func) {
      if (NPMap.config.layers) {
        _.each(NPMap.config.layers, func);
      }
    }
  };
});