// TODO: Start using underscore's templating (or mustache.js) to clean this code up.
define([
  'Event',
  'InfoBox',
  'Layer/Layer',
  'Map/Map'
], function(Event, InfoBox, Layer, Map) {
  var
      // The preserved HTML string from the #npmap-infobox-content div.
      backContent = null,
      // The preserved HTML string from the #npmap-infobox-title div.
      backTitle = null,
      // The last scroll position of the clustered view.
      clusterPosition = 0,
      // The number of identifiable layers that are visible.
      identifyLayers = 0,
      // An array of results for the current identify operation.
      identifyResults = [];
      
  /**
   * Builds a HTML string for a layer.
   * @param {Object} layer
   * @return {String}
   */
  function buildHtmlForLayer(layer) {
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
    identifyResults.push({
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
          html += '<li><a href="javascript:void(0)" onclick="NPMap.Layer.ArcGisServerRest._infoBoxMoreInfo(\'' + constructId(layer.layerName, subLayer.layerId, title.result['OBJECTID']) + '\',\'' + layer.layerName + '\',this);return false;">' + title.title + '</a></li>';
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
  function constructId(layerName, layerId, objectId) {
    return layerName.replace(' ', '') + '-' + layerId + '-' + objectId;
  }
  
  Event.add('NPMap.InfoBox', 'hide', function() {
    NPMap.Layer.ArcGisServerRest._identifyResult = null;
  });

  return NPMap.Layer.ArcGisServerRest = {
    // Holds the current identify result object for this layer. This will be an array if multiple results are returned or an object if a single result is returned.
    _identifyResult: null,
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

      identifyResults = [];

      if (!data || data.length === 0) {
        content = 'No information is available for this location.';
        title = 'Sorry!';
      } else if (data.length === 1) {
        content = buildHtmlForLayer(data[0]);
        title = data[0].layerName.replace(/_/g, ' ');
      } else {
        _.each(data, function(v, i) {
          content += '<div><h3>' + data[i].layerName.replace(/_/g, ' ') + '</h3>' + buildHtmlForLayer(data[i]) + '</div>';
        });

        title = 'Results';
      }
      
      backContent = content;
      backTitle = title = '<h2>' + title + '</h2>';
      
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
              clusterPosition = 0;
              InfoBox.scrollTo(0);
            }
          } else {
            clearInterval(interval);
            Map.hideProgressBar();
            InfoBox.show('The identify operation is taking too long. Zoom in further and try again.', 'Sorry!');
            clusterPosition = 0;
            InfoBox.scrollTo(0);
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
      if (identifyLayers > 0) {
        var el = document.getElementById('npmap-map'),
            latLngApi = Map[NPMap.config.api].eventGetLatLng(e),
            latLng = Map.latLngFromApi(latLngApi);

        InfoBox.latLng = latLngApi;
        Map[NPMap.config.api].positionClickDot(latLngApi);
        this._doIdentify(latLng, el.offsetHeight, el.offsetWidth, Map.getBounds());
      }
    },
    /**
     * Called when the user hits the "<<Back to List" link in an InfoBox.
     * @return null
     */
    _infoBoxBack: function() {
      InfoBox.show(backContent, backTitle);
      InfoBox.scrollTo(clusterPosition);

      this._identifyResult = identifyResults;
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

      for (var i = 0; i < identifyResults.length; i++) {
        if (identifyResults[i].layerName === name) {
          results = identifyResults[i].results;
          break;
        }
      }

      for (var i = 0; i < results.length; i++) {
        if (results[i].layerId === parseInt(ids[1], 0)) {
          subLayer = results[i];
          results = subLayer.results;
          break;
        }
      }

      for (var i = 0; i < results.length; i++) {
        if (results[i].OBJECTID === ids[2]) {
          attributes = results[i];
          break;
        }
      }

      // layer.edit.userRole is a way of restricting the edit UI.
      if (layer.edit && layer.edit.userRole !== 'Reader') {
        var editable = layer.edit.layers.split(',');

        for (var l = 0; l < editable.length; l++) {
          if (parseInt(editable[l], 0) === subLayer.layerId) {
            actions.push({
              group: 'Edit',
              handler: function() {
                layer.edit.handlers['delete']({
                  globalId: attributes.GlobalID,
                  name: name,
                  objectId: attributes.OBJECTID,
                  subLayerId: subLayer.layerId
                });
              },
              text: 'Delete feature'
            },{
              group: 'Edit',
              handler: function() {
                layer.edit.handlers.updateAttributes({
                  globalId: attributes.GlobalID,
                  name: name,
                  objectId: attributes.OBJECTID,
                  subLayerId: subLayer.layerId
                });
              },
              text: 'Update feature attributes'
            },{
              group: 'Edit',
              handler: function() {
                layer.edit.handlers.updateGeometry({
                  globalId: attributes.GlobalID,
                  name: name,
                  objectId: attributes.OBJECTID,
                  subLayerId: subLayer.layerId
                });
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

      clusterPosition = InfoBox.getScrollPosition();

      InfoBox.scrollTo(0);
      InfoBox.show(InfoBox._build(layer, attributes, 'content'), '<h2>' + title + '</h2>', null, actions);
    },
    /**
     * Creates a GeoJson layer.
     * @param {Object} config
     * @param {Boolean} silent (Optional) If true, the NPMap.Layer events will not be called.
     * @return null
     */
    create: function(config, silent) {
      var tileLayer,
          uriConstructor = config.url + '/tile/{{z}}/{{y}}/{{x}}';

      if (!silent) {
        Event.trigger('NPMap.Layer', 'beforeadd', config);
      }

      if (!config.tiled) {
        uriConstructor = function(x, y, z) {
          var heightWidth = 256,
              e = ((x + 1) * heightWidth) * 360 / (heightWidth * Math.pow(2, z)) - 180,
              n = Math.asin((Math.exp((0.5 - (y * heightWidth) / (heightWidth) / Math.pow(2, z)) * 4 * Math.PI) - 1) / (Math.exp((0.5 - (y * heightWidth) / 256 / Math.pow(2, z)) * 4 * Math.PI) + 1)) * 180 / Math.PI,
              s = Math.asin((Math.exp((0.5 - ((y + 1) * heightWidth) / (heightWidth) / Math.pow(2, z)) * 4 * Math.PI) - 1) / (Math.exp((0.5 - ((y + 1) * heightWidth) / 256 / Math.pow(2, z)) * 4 * Math.PI) + 1)) * 180 / Math.PI,
              w = (x * heightWidth) * 360 / (heightWidth * Math.pow(2, z)) - 180,
              u = config.url + '/export?dpi=96&transparent=true&format=png8&bbox=' + w + ',' + s + ',' + e + ',' + n + '&bboxSR=4326&imageSR=102100&size=256,256&f=image';

          if (config.layersStatus && config.layersStatus !== 'all') {
            u += '&layers=show:' + config.layersStatus;
          }
          
          return u;
        };
      }

      if (typeof config.identify === 'undefined' || config.identify !== false) {
        identifyLayers++;
        config.identifiable = true;
      } else {
        config.identifiable = false;
      }

      config.layersStatus = config.layersStatus || config.layers;
      tileLayer = Map[NPMap.config.api].createTileLayer(uriConstructor, {
        opacity: config.opacity,
        zIndex: config.zIndex || null
      });
      config.api = tileLayer;
      tileLayer.npmap = {
        layerName: config.name,
        layerType: config.type
      };

      Map.addTileLayer(tileLayer);

      if (!silent) {
        Event.trigger('NPMap.Layer', 'added', config);
      }
    },
    /**
     * Hides the layer.
     * @param {Object} config
     * @return null
     */
    hide: function(config) {
      InfoBox.hide();
      Map[NPMap.config.api].hideTileLayer(config);

      if (config.identifiable === true) {
        identifyLayers--;
      }

      config.layersStatus = '';
      config.visible = false;
    },
    /**
     * Reloads the layer. Can be used after an edit operation or after a subLayer has been toggled on or off.
     * @param {Object} config
     * @return null
     */
    reload: function(config) {
      InfoBox.hide();
      this.remove(config);

      config.visible = true;

      this.create(config, true);
    },
    /**
     * Removes the layer.
     * @param {Object} config
     * @return null
     */
    remove: function(config) {
      InfoBox.hide();
      Map[NPMap.config.api].removeTileLayer(config.api);

      if (config.identifiable === true) {
        identifyLayers--;
      }

      config.visible = false;
      
      delete config.api;
      delete config.identifiable;

      Event.trigger('NPMap.Layer', 'removed', config);
    },
    /**
     * Shows the layer.
     * @param {Object} config
     * @return null
     */
    show: function(config) {
      InfoBox.hide();
      Map[NPMap.config.api].showTileLayer(config);

      if (config.identifiable === true) {
        identifyLayers++;
      }

      config.layersStatus = config.layers;
      config.visible = true;
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
          this.remove(config);
        } else {
          this.reload(config);
        }

        if (!on) {
          InfoBox.hide();
        }
      }
    }
  };
});