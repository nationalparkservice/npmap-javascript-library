/**
 * NPMap.Layer.ArcGisServerRest module.
 */
define([
  'Event',
  'InfoBox',
  'Layer/Layer',
  'Map/Map'
], function(Event, InfoBox, Layer, Map) {
  var
      // The preserved HTML string from the #npmap-infobox-content div.
      _backContent = null,
      // The preserved HTML string from the #npmap-infobox-title div.
      _backTitle = null,
      // The last scroll position of the clustered view.
      _clusterPosition = 0,
      // The number of identifiable layers that are visible.
      _identifyLayers = 0,
      // An array of results for the current identify operation.
      _identifyResults = [];
      
  /**
   * Builds a HTML string for a layer.
   * @param {Object} layer
   * @return {String}
   */
  function _buildHtmlForLayer(layer) {
    var html = '<ul>',
        layerConfig = Layer.getLayerByName(layer.layerName),
        subLayers = [];

    _.each(layer.data.results, function(result, i) {
      var subLayerObject;

      _.each(subLayers, function(subLayer, i2) {
        if (subLayer.layerName === result.layerName) {
          subLayerObject = subLayer;
        }
      });

      if (!subLayerObject) {
        subLayers.push({
          displayFieldName: result.displayFieldName,
          layerId: result.layerId,
          layerName: result.layerName,
          results: [
            result.attributes
          ]
        });
      } else {
        subLayerObject.results.push(result.attributes);
      }
    });
    subLayers.sort(function(a, b) {
      return a.layerName > b.layerName;
    });
    _identifyResults.push({
      layerName: layer.layerName,
      results: subLayers
    });
    _.each(subLayers, function(subLayer, i) {
      var titles = [];

      if (!layerConfig.identify || !layerConfig.identify.simpleTree) {
        html += '<li>' + subLayer.layerName.replace(/_/g, ' ') + '<ul>';
      }

      _.each(subLayer.results, function(result, i2) {
        var title,
            type = 'title';

        if (layerConfig.identify && (layerConfig.identify.cluster || layerConfig.identify.title)) {
          if (layerConfig.identify.cluster) {
            type = 'cluster';
          }

          title = InfoBox._build(layerConfig, result, type);
          
          if (!title) {
            title = result[subLayer.displayFieldName];
          }
        } else {
          title = result[subLayer.displayFieldName];
        }
        
        if (type !== 'cluster') {
          title = NPMap.Util.stripHtmlFromString(title);
        }
        
        titles.push({
          result: result,
          title: title,
          type: type
        });
      });
      titles.sort(function(a, b) {
        var A = a.title.toUpperCase(),
            B = b.title.toUpperCase();
            
        return (A < B) ? -1 : (A > B) ? 1 : 0;
      });
      _.each(titles, function(title, i2) {
        if (title.type === 'title') {
          html += '<li><a href="javascript:void(0)" onclick="NPMap.Layer.ArcGisServerRest._infoBoxMoreInfo(\'' + _constructId(layer.layerName, subLayer.layerId, title.result['OBJECTID']) + '\',\'' + layer.layerName + '\',this);return false;">' + title.title + '</a></li>';
        } else {
          // TODO: Right now you're assuming that if layerConfig.identify.cluster is specified, they don't want the "more info" behavior. What if they still do?
          html += '<li>' + title.title + '</li>';
        }
      });

      if (!layerConfig.identify || !layerConfig.identify.simpleTree) {
        html += '</ul></li>';
      }
    });

    return html + '</ul>';
  }
  /**
   * Constructs a unique id.
   * @param {String} layerName
   * @param {Number} layerId
   * @param {Number} objectId
   * @return {String}
   */
  function _constructId(layerName, layerId, objectId) {
    return layerName.replace(' ', '') + '-' + layerId + '-' + objectId;
  }
  
  Event.add('NPMap.InfoBox', 'hide', function() {
    NPMap.Layer.ArcGisServerRest._identifyResult = null;
  });

  return NPMap.Layer.ArcGisServerRest = {
    // Holds the current identify result object for this layer. This will be an array if multiple results are returned or an object if a single result is returned.
    _identifyResult: null,
    /**
     * Adds an ArcGisServerRest layer.
     * @param {Object} config
     * @param {Function} callback
     * @return null
     */
    _add: function(config, callback) {
      var tileLayer,
          uriConstructor = config.url + '/tile/{{z}}/{{y}}/{{x}}';

      if (!config.tiled) {
        uriConstructor = function(x, y, z) {
          var hW = 256,
              u = config.url + '/export?dpi=96&transparent=true&format=png8&bbox=' + ((x * hW) * 360 / (hW * Math.pow(2, z)) - 180) + ',' + (Math.asin((Math.exp((0.5 - ((y + 1) * hW) / (hW) / Math.pow(2, z)) * 4 * Math.PI) - 1) / (Math.exp((0.5 - ((y + 1) * hW) / 256 / Math.pow(2, z)) * 4 * Math.PI) + 1)) * 180 / Math.PI) + ',' + (((x + 1) * hW) * 360 / (hW * Math.pow(2, z)) - 180) + ',' + (Math.asin((Math.exp((0.5 - (y * hW) / (hW) / Math.pow(2, z)) * 4 * Math.PI) - 1) / (Math.exp((0.5 - (y * hW) / 256 / Math.pow(2, z)) * 4 * Math.PI) + 1)) * 180 / Math.PI) + '&bboxSR=4326&imageSR=102100&size=256,256&f=image';

          if (config.edit) {
            u += '&disableCache:' + new Date().getTime();
          }

          if (config.layersStatus && config.layersStatus !== 'all') {
            u += '&layers=show:' + config.layersStatus;
          }
          
          return u;
        };
      }

      if (typeof config.identify === 'undefined' || config.identify !== false) {
        _identifyLayers++;
        config.identifiable = true;
      } else {
        config.identifiable = false;
      }

      config.layersStatus = config.layersStatus || config.layers;
      tileLayer = config.api = Map._addTileLayer({
        constructor: uriConstructor,
        name: config.name,
        opacity: config.opacity,
        zIndex: config.zIndex,
        zoomRange: config.zoomRange
      });
      tileLayer.npmap = {
        layerName: config.name,
        layerType: config.type
      };

      if (callback) {
        callback();
      }
    },
    /**
     * Builds an infobox for an ArcGisServerRest layer. If provided by the user, this function uses the identify config information from each layer's config.
     * @param {Object/Array} (Required) data - The data object or array to build the infobox for.
     * @return {Object}
     */
    _buildInfoBox: function(data) {
      // TODO: Enable sorting for simpleTree === true.
      var content = '',
          me = this,
          title = '';

      _identifyResults = [];

      if (!data || data.length === 0) {
        content = 'No information is available for this location.';
        title = 'Sorry!';
      } else if (data.length === 1) {
        content = _buildHtmlForLayer(data[0]);
        title = data[0].layerName.replace(/_/g, ' ');
      } else {
        _.each(data, function(v, i) {
          content += '<div><h3>' + data[i].layerName.replace(/_/g, ' ') + '</h3>' + _buildHtmlForLayer(data[i]) + '</div>';
        });

        title = 'Results';
      }
      
      _backContent = content;
      _backTitle = title = '<h2>' + title + '</h2>';
      
      return {
        content: content,
        title: title
      };
    },
    /**
     * Performs an identify operation.
     * @param {Object} latLng
     * @param {Number} divHeight
     * @param {Number} divWidth
     * @param {Object} bounds
     * @return null
     */
    _doIdentify: function(latLng, divHeight, divWidth, bounds) {
      var count = 0,
          me = this,
          results = [],
          value = 0.1;

      for (var i = 0; i < NPMap.config.layers.length; i++) {
        (function() {
          var layer = NPMap.config.layers[i];

          if (layer.type === 'ArcGisServerRest' && layer.visible === true) {
            count++;

            reqwest({
              data: {
                f: 'json',
                geometry: latLng.lng + ',' + latLng.lat,
                geometryType: 'esriGeometryPoint',
                imageDisplay: divWidth + ',' + divHeight + ',' + 96,
                layers: 'visible' + (layer.layersStatus && layer.layersStatus !== 'all' ? ':' + layer.layersStatus : ''),
                mapExtent: bounds.w + ',' + bounds.s + ',' + bounds.e + ',' + bounds.n,
                returnGeometry: false,
                sr: 4326,
                tolerance: 10
              },
              success: function(response) {
                if (response.results && response.results.length > 0) {
                  results.push({
                    data: response,
                    layerName: layer.name
                  });
                }

                count--;
              },
              type: 'jsonp',
              url: layer.url + '/identify?callback=?'
            });
          }
        })();
      }
      
      if (count > 0) {
        var interval;

        Map.showProgressBar(value);

        interval = setInterval(function() {
          value = value + 0.1;

          Map.updateProgressBar(value);
          
          if (value < 100) {
            if (count === 0) {
              var infobox;
              
              clearInterval(interval);
              
              infobox = me._buildInfoBox(results);
              me._identifyResult = results;
              
              Map.hideProgressBar(value);
              InfoBox.show(infobox.content, infobox.title);
              _clusterPosition = 0;
              InfoBox._scrollTo(0);
            }
          } else {
            clearInterval(interval);
            Map.hideProgressBar();
            InfoBox.show('The identify operation is taking too long. Zoom in further and try again.', 'Sorry!');
            _clusterPosition = 0;
            InfoBox._scrollTo(0);
          }
        }, 5);
      }
    },
    /**
     * Handles the click operation for ArcGisServerRest layers.
     * @param {Object} e
     * @return null
     */
    _handleClick: function(e) {
      if (_identifyLayers) {
        var el = document.getElementById('npmap-map'),
            latLngApi = Map[NPMap.config.api].eventGetLatLng(e),
            latLng = Map.latLngFromApi(latLngApi);

        InfoBox.latLng = latLngApi;
        Map[NPMap.config.api].positionClickDot(latLngApi);
        this._doIdentify(latLng, el.offsetHeight, el.offsetWidth, Map.getBounds());
      }
    },
    /**
     * Hides the layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     * @return null
     */
    _hide: function(config, callback) {
      Map[NPMap.config.api]._hideTileLayer(config.api);

      if (config.identifiable) {
        _identifyLayers--;
      }

      config.layersStatus = '';

      if (callback) {
        callback();
      }
    },
    /**
     * Called when the user hits the "<<Back to List" link in an InfoBox.
     * @return null
     */
    _infoBoxBack: function() {
      InfoBox.show(_backContent, _backTitle);
      InfoBox._scrollTo(_clusterPosition);

      this._identifyResult = _identifyResults;
    },
    /**
     * Gets more attribution infomation for an individual geometry and displays it in the InfoBox.
     * @param {String} id The id of the geometry.
     * @param {String} name The name of the layer.
     * @param {String} el The HTML element.
     * @return null
     */
    _infoBoxMoreInfo: function(id, name, el) {
      var actions = [{
            handler: this._infoBoxBack,
            text: 'Back to list'
          }],
          attributes,
          ids = id.split('-'),
          layer = Layer.getLayerByName(name, NPMap.config.layers),
          me = this,
          results,
          subLayer,
          title = el.innerHTML;

      for (var i = 0; i < _identifyResults.length; i++) {
        if (_identifyResults[i].layerName === name) {
          results = _identifyResults[i].results;
          break;
        }
      }

      for (var j = 0; j < results.length; j++) {
        if (results[j].layerId === parseInt(ids[1], 0)) {
          subLayer = results[j];
          results = subLayer.results;
          break;
        }
      }

      for (var k = 0; k < results.length; k++) {
        if (results[k].OBJECTID === ids[2]) {
          attributes = results[k];
          break;
        }
      }

      // TODO: Document userRole: layer.edit.userRole is a way of restricting the edit UI.
      if (layer.edit && layer.edit.userRole !== 'Reader') {
        var editable = layer.edit.layers.split(','),
            editAttributes = {
              globalId: attributes.GlobalID,
              name: name,
              objectId: attributes.OBJECTID,
              subLayerId: subLayer.layerId
            };

        for (var l = 0; l < editable.length; l++) {
          if (parseInt(editable[l], 0) === subLayer.layerId) {
            actions.push({
              group: 'Edit',
              handler: function() {
                layer.edit.handlers['delete'](editAttributes);
              },
              text: 'Delete feature'
            },{
              group: 'Edit',
              handler: function() {
                layer.edit.handlers.updateAttributes(editAttributes);
              },
              text: 'Update feature attributes'
            },{
              group: 'Edit',
              handler: function() {
                layer.edit.handlers.updateGeometry(editAttributes);
              },
              text: 'Update feature geometry'
            });

            break;
          }
        }
      }

      me._identifyResult = attributes;

      if (layer.skipActions) {
        actions = [];
      }

      _clusterPosition = InfoBox._getScrollPosition();

      InfoBox._scrollTo(0);
      InfoBox.show(InfoBox._build(layer, attributes, 'content'), '<h2>' + title + '</h2>', null, actions);
    },
    /**
     * Removes the layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     * @return null
     */
    _remove: function(config, callback) {
      Map[NPMap.config.api]._removeTileLayer(config.api);
      
      if (config.identifiable) {
        _identifyLayers--;
      }

      delete config.identifiable;

      if (callback) {
        callback();
      }
    },
    /**
     * Sets the options for a layer.
     * @param {Object} config
     * @param {Object} options
     * @return null
     */
    _setOptions: function(config, options) {
      Map[NPMap.config.api]._setTileLayerOptions(config.api, options);
    },
    /**
     * Shows the layer.
     * @param {Object} config
     * @param {Function} callback (Optional)
     * @return null
     */
    _show: function(config, callback) {
      Map[NPMap.config.api]._showTileLayer(config.api);

      if (config.identifiable) {
        _identifyLayers++;
      }

      config.layersStatus = config.layers;
      config.visible = true;

      if (callback) {
        callback();
      }
    },
    /**
     * Refreshes the layer.
     * @param {Object} config
     * @return null
     */
    refresh: function(config) {
      if (config.api) {
        Layer.remove(config, true);
      }
      
      Layer.add(config, true);
    },
    /**
     * Toggles a layer's sublayer on or off.
     * @param {Object} config The layer config object.
     * @param {Integer} subLayerIndex The index of the sublayer.
     * @param {Boolean} on Toggle this layer on?
     * @return null
     */
    toggleSubLayer: function(config, subLayerIndex, on) {
      var changed = false,
          index = -1,
          subLayers = config.layersStatus.split(',');

      for (var i = 0; i < subLayers.length; i++) {
        if (parseInt(subLayers[i], 0) === parseInt(subLayerIndex, 0)) {
          index = i;
          break;
        }
      }

      if (on) {
        if (index === -1) {
          changed = true;
          subLayers.push(subLayerIndex);
        }
      } else {
        if (index !== -1) {
          changed = true;
          subLayers.splice(index, 1);
        }
      }

      config.layersStatus = subLayers.join();

      if (config.layersStatus.indexOf(',') === 0) {
        config.layersStatus = config.layersStatus.slice(1, config.layersStatus.length);
      }

      if (changed) {
        if (subLayers.length === 0) {
          Layer.remove(config);
        } else {
          this.refresh(config);
        }

        if (!on) {
          InfoBox.hide();
        }
      }
    }
  };
});