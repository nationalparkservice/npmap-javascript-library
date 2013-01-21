define([
  'Event',
  'Map/Map',
  'Meta'
], function(Event, Map, META) {
  var
      // A count of the number of visible layers that the map is initialized with.
      _initializedActiveLayerCount = (function() {
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
      _interval,
      // The default line style.
      _lineStyle = {
        strokeColor: '000000',
        strokeOpacity: 200,
        strokeWidth: 2
      },
      // The default marker style.
      _markerStyle = {
        anchor: {
          x: 6.5,
          y: 0
        },
        height: 13,
        url: NPMap.config.server + '/resources/img/markers/brown-circle-13x13.png',
        width: 13
      },
      // The default polygon style.
      _polygonStyle = {
        fillColor: '5e7630',
        fillOpacity: 174,
        strokeColor: '5e7630',
        strokeOpacity: 200,
        strokeWidth: 1
      },
      // All of the layer names that have been added to the map.
      _usedNames = [];

  Event.add('NPMap.Layer', 'added', function(config) {
    this._countAdded++;
    Map._updateAttribution();
  });
  Event.add('NPMap.Layer', 'beforeadd', function(config) {
    var meta = NPMap.Layer.getLayerHandlerMeta(config.type);

    if (!config.name) {
      config.name = 'Layer_' + new Date().getTime();

      if (_.indexOf(_usedNames, config.name) !== -1) {
        var random = Math.floor(Math.random() * (999999999 - 0 + 1)) + 0;

        config.name = config.name + random;
      }
    }

    if (_.indexOf(_usedNames, config.name) === -1) {
      _usedNames.push(config.name);
    } else {
      throw new Error('All layer names must be unique. "' + config.name + '" is used more than once.');
    }

    if (!config.type) {
      throw new Error('All layers must have a "type".');
    }

    if (meta.type === 'vector') {
      var style = config.style;

      if (style) {
        if (style.line) {
          _lineStyle = style.line;
        }

        if (style.marker && style.marker.url) {
          if (style.marker.height && style.marker.width) {
            if (!style.marker.anchor) {
              style.marker.anchor = {
                x: style.marker.width / 2,
                y: 0
              };
            }

            _markerStyle = style.marker;
          } else {
            // TODO: You need to load the image and calculate the height, width, and anchor here.
            _markerStyle = style.marker;
          }
        }

        if (style.polygon) {
          _polygonStyle = style.polygon;
        }
      }

      config.styleNpmap = {
        line: Map[NPMap.config.api].convertLineOptions(_lineStyle),
        marker: Map[NPMap.config.api].convertMarkerOptions(_markerStyle),
        polygon: Map[NPMap.config.api].convertPolygonOptions(_polygonStyle)
      };
    }
  });
  Event.add('NPMap.Layer', 'hidden', function(config) {
    Map._updateAttribution();
  });
  Event.add('NPMap.Layer', 'removed', function(config) {
    _usedNames.splice(_.indexOf(_usedNames, config.name), 1);
    Map._updateAttribution();
  });
  Event.add('NPMap.Layer', 'shown', function(config) {
    Map._updateAttribution();
  });
  Event.add('NPMap.Map', 'click', function(e) {
    if (NPMap.config.layers && NPMap.config.layers.length) {
      for (var i = 0; i < NPMap.config.layers.length; i++) {
        var layerType = NPMap.config.layers[i].type,
            meta = NPMap.Layer.getLayerHandlerMeta(layerType);

        if (meta.type === 'raster' && meta.identify) {
          NPMap.Layer[layerType]._handleClick(e);
        }
      }
    }
  });
  Event.add('NPMap.Map', 'shapeclick', function(e) {
    if (NPMap.config.layers && NPMap.config.layers.length) {
      for (var j = 0; j < NPMap.config.layers.length; j++) {
        var layerType = NPMap.config.layers[j].type,
            meta = NPMap.Layer.getLayerHandlerMeta(layerType);
            
        if (meta.type === 'vector' && meta.identify) {
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

  _interval = setInterval(function() {
    var Layer = NPMap.Layer;

    if (typeof Layer !== 'undefined' && typeof Layer._countAdded !== 'undefined' && Layer._countAdded === _initializedActiveLayerCount) {
      clearInterval(_interval);
      delete Layer._countAdded;
      Event.trigger('NPMap.Layer', 'ready');
    }
  }, 250);
  
  return NPMap.Layer = {
    // The number of layers that have been added. This property is deleted after the NPMap.Map ready event is triggered.
    _countAdded: 0,
    /**
     * Adds a layer to the map.
     * @param {Object} config
     * @param {Boolean} silent (Optional)
     * @return null
     */
    add: function(config, silent) {
      var func = this[config.type]._add;

      function callback() {
        if (!silent) {
          Event.trigger('NPMap.Layer', 'added', config);
        }
      }

      config.visible = true;

      if (!silent) {
        Event.trigger('NPMap.Layer', 'beforeadd', config);
      }

      if (typeof func === 'function') {
        func(config, callback);
      } else {
        callback();
      }
    },
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
     * @return {Object}
     */
    getLayerByName: function(name) {
      var baseLayers = NPMap.config.baseLayers,
          layers = NPMap.config.layers;

      if (layers && layers.length) {
        for (var i = 0; i < layers.length; i++) {
          var layer = layers[i];

          if (layer.name === name) {
            return layer;
          }
        }
      }
      
      if (baseLayers && baseLayers.length) {
        for (var j = 0; j < baseLayers.length; j++) {
          var baseLayer = baseLayers[j];

          if (baseLayer.name === name) {
            return baseLayer;
          }
        }
      }
    },
    /**
     * Get the META information for a layer handler.
     * @param {String} name
     * @return {Object}
     */
    getLayerHandlerMeta: function(name) {
      for (var i = 0; i < META.layerHandlers.length; i++) {
        var layerHandler = META.layerHandlers[i];

        if (layerHandler.name === name) {
          return layerHandler;
        }
      }

      return null;
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
     * Hides a layer.
     * @param {Object} config
     * @param {Boolean} silent (Optional)
     * @return null
     */
    hide: function(config, silent) {
      var type = config.type,
          func = this[type]._hide,
          meta = this.getLayerHandlerMeta(type);

      function callback() {
        if (meta.type === 'raster') {
        
        } else {
          _.each(config.shapes, function(shape) {
            Map.hideShape(shape);
          });
        }

        config.visible = false;

        if (!silent) {
          Event.trigger('NPMap.Layer', 'hidden', config);
        }
      }

      NPMap.InfoBox.hide();

      if (!silent) {
        Event.trigger('NPMap.Layer', 'beforehide', config);
      }

      if (typeof func === 'function') {
        func(config, callback);
      } else {
        callback();
      }
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
    },
    /**
     * Removes a layer.
     * @param {Object} config
     * @param {Boolean} silent (Optional)
     * @return null
     */
    remove: function(config, silent) {
      var type = config.type,
          func = this[type]._remove,
          meta = this.getLayerHandlerMeta(type);

      function callback() {
        if (meta.type === 'raster') {
          delete config.api;
        } else {
          _.each(config.shapes, function(shape) {
            Map.removeShape(shape);
          });

          delete config.shapes;
          delete config.styleNpmap;
        }

        config.visible = false;

        if (!silent) {
          Event.trigger('NPMap.Layer', 'removed', config);
        }
      }

      NPMap.InfoBox.hide();

      if (!silent) {
        Event.trigger('NPMap.Layer', 'beforeremove', config);
      }
      
      if (typeof func === 'function') {
        func(config, callback);
      } else {
        callback();
      }
    },
    /**
     * Shows a layer.
     * @param {Object} config
     * @param {Boolean} silent (Optional)
     * @return null
     */
    show: function(config, silent) {
      var type = config.type,
          func = this[type]._show,
          meta = this.getLayerHandlerMeta(type);

      function callback() {
        if (meta.type === 'raster') {
          
        } else {
          _.each(config.shapes, function(shape) {
            Map.showShape(shape);
          });
        }

        config.visible = true;

        if (!silent) {
          Event.trigger('NPMap.Layer', 'shown', config);
        }
      }

      if (!silent) {
        Event.trigger('NPMap.Layer', 'beforeshow', config);
      }

      if (typeof func === 'function') {
        func(config, callback);
      } else {
        callback();
      }
    }
  };
});