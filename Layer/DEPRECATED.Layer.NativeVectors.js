define(function() {
  var backContent = null,
      backFooter = null,
      backTitle = null,
      pendingRequests = [];
  
  /**
   * Builds an infobox for a layer. Takes information provided by the user as part of the activeLayer config.
   * @param {Object/Array} (Required) data - The data object or array to build the infobox for.
   * @param {Object} (Required) layer - The layer config object from the NPMap.config.layers array.
   * @param {Boolean} (Optional) goBack - If true, a "Go back..." link will be added to bottom of infobox. Defaults to false.
   */
  function buildInfoBox(data, layer, goBack, geometry) {
    var actions = [
          'zoomable'
        ],
        content = '',
        footer = null,
        title = '';

    if (!data.d) {
      content = 'No information is available for this location.';
      title = 'Sorry!';
    } else if (_.isArray(data.d)) {
      var getCountText = function(count) {
        var text = null;
            
        if (count > 49) {
          // TODO: Shouldn't be hardcoded to API.
              
          text = 'More than 50';
        } else {
          text = count;
        }
            
        return text;
      };
          
      if (data.d.length > 49) {
        footer = '<a href="javascript:void(0)" onclick="NPMap.' + NPMap.config.api + '.map.zoomIn(true);return false;">Zoom in to view more</a>';
      }
          
      content = '<ul>';
      title = ('<h2>' + layer.identify.clusterTitle + '</h2>').replace('[{count}]', getCountText(data.d.length)).replace('[{singularPlural}]', getSingularPlural(data.d.length));
          
      _.each(data.d, function(v, i) {
        var liContent = '<li><a href="javascript:void(0)" onclick="NPMap.layers.NativeVectors.infoBoxMoreInfo(\'' + v[layer.primaryKey] + '\',\'' + layer.name + '\');return false;">' + layer.identify.clusterContent + '</a></li>';
            
        _.each(v, function(v2, i2) {
          liContent = liContent.replace('{' + i2 + '}', v2);
        });
            
        content += liContent;
      });
          
      content += '</ul>';

      backContent = content;
      backFooter = footer;
      backTitle = title;
    } else {
      if (geometry && geometry.data) {
        _.each(geometry.data, function(v, i) {
          data.d[i] = v;
        });
      }
          
      content = '<div class="content">';
      contentIsFunction = false,
      title = '<h2>',
      titleIsFunction = false;
          
      if (typeof(layer.identify.content) === 'function') {
        contentIsFunction = true;
        content += layer.identify.content(data.d);
      } else {
        content += layer.identify.content;
      }
          
      if (typeof(layer.identify.title) === 'function') {
        titleIsFunction = true;
        title += layer.identify.title(data.d);
      } else {
        title += layer.identify.title;
      }
          
      if (!contentIsFunction || !titleIsFunction) {
        _.each(data.d, function(v, i) {
          if (!contentIsFunction) {
            content = content.replace('{' + i + '}', v);
          }
              
          if (!titleIsFunction) {
            title = title.replace('{' + i + '}', v);
          }
        });

        if (geometry && geometry.data) {
          _.each(geometry.data, function(v, i) {
            if (!contentIsFunction) {
              content = content.replace('{' + i + '}', v);
            }

            if (!titleIsFunction) {
              title = title.replace('{' + i + '}', v);
            }
          });
        }
      }
          
      content += '</div>';
      title += '</h2>';

      if (goBack) {
        content += '<div class="more"><a href="javascript:void(0)" onclick="NPMap.layers.NativeVectors.infoBoxBack();return false;">&lt;&lt; Back to List</a></div>';
      }
    }

    if (layer.skipActions) {
      actions = [];
    }
        
    NPMap.InfoBox.show(content, title, footer, actions);
  }
  /**
   * Returns 's' for numbers greater than one and an empty string for numbers less than one.
   * @param {Number} num
   */
  function getSingularPlural(num) {
    var letter = '';
        
    if (num > 1) {
      letter = 's';
    }
        
    return letter;
  }
  
  NPMap.layers = NPMap.layers || {};

  return NPMap.layers.NativeVectors = {
    /**
     * DEPRECATED
     * Converts a layer's baseIconUrl, which is defined by the map creator, to a valid icon URL based on the number of pins a marker represents.
     */
    buildIconUrl: function(baseIconUrl, numberPins) {
      return baseIconUrl.replace('{size}', NPMap.layers.NativeVectors.getIconSize(numberPins));
    },
    /**
     * Gets an icon size by the number of pins.
     * @param numberPins {Integer} (Required) The number of pins an icon will represent.
     * @return {Integer} The icon size.
     */
    getIconSize: function(numberPins) {
      var size = 25;

      if (numberPins === 1) {
        size = 10;
      } else if (numberPins < 11) {
        size = 13;
      } else if (numberPins < 21) {
        size = 16;
      } else if (numberPins < 31) {
        size = 19;
      } else if (numberPins < 41) {
        size = 22;
      }
      
      return size;
    },
    /**
     * Performs the "identify" operation when a geometry is clicked.
     * @param {String} (Required) content - A comma-delimited string of the ids represented by a point or an object that contains data properties, including a "content" property.
     * @param {Object} (Required) layer - The layer config object from the NPMap.config.layers array.
     * @param {Boolean} (Optional) goBack - If true, a "Go back..." link will be added to bottom of infobox. Defaults to false.
     * @param {int} (Optional) oldHeight - If not null, oldHeight will be passed into NPMap.InfoBox.show, and used to reposition the infowindow after show is called.
     */
    getInfoBoxData: function(content, layer, goBack, oldHeight) {
      var ids,
          url;
      
      if (typeof(content) === 'object') {
        ids = content.content.split(',');
      } else {
        ids = content.split(',');
      }

      if (ids.length === 1) {
        if (typeof(layer.identify.url) === 'function') {
          url = layer.identify.url(content.data);

          if (url.indexOf('?$') === -1) {
            url += '?$';
          } else {
            url += '&$';
          }

          url += 'callback=?&$format=json';
        } else {
          url = layer.identify.url.replace('{identifier}', layer.identify.identifier);
        
          if (url.indexOf('?$') === -1) {
            url += '?$';
          } else {
            url += '&$';
          }

          url += 'callback=?&$format=json';

          if (content.data) {
            _.each(content.data, function(v, i) {
              url = url.replace('{' + i + '}', v);
            });
          }
          
          url = url.replace('{primaryKey}', ids[0]);

          if (layer.identify.fields && layer.identify.fields != '*') {
            url += '&$select=' + layer.identify.fields;
          }
        }
      } else {
        // TODO: Add support for layer.identify.url functions here.
        
        if (ids.length > 50) {
          ids = ids.slice(0, 50);
        }
        
        url = layer.identify.clusterUrl;
        
        if (url.indexOf('?$') === -1) {
          url += '?$filter=';
        } else {
          url += '&$filter=';
        }
        
        _.each(ids, function(v, i) {
          url += layer.primaryKey + ' eq ' + layer.identify.identifier.replace('{primaryKey}', v) + ' or ';
        });
        
        url = url.slice(0, url.length - 4) + '&$callback=?&$format=json';
        
        if (layer.identify.clusterSortInfo) {
          url += '&$orderby=' + layer.identify.clusterSortInfo;
        }
        
        if (layer.identify.fields && layer.identify.clusterFields != '*') {
          url += '&$select=' + layer.identify.fields;
        }
      }
      
      goBack = goBack || false;
      
      reqwest({
        success: function(data) {
          buildInfoBox(data, layer, goBack, content);
        },
        type: 'jsonp',
        url: url
      });
    },
    /**
     * This function is called when the "Back" action is performed in a clustered InfoBox.
     */
    infoBoxBack: function() {
      NPMap.InfoBox.show(backContent, backTitle, backFooter ? backFooter : null);
    },
    /**
     * This function is called when the "More Info" action is performed on a clustered InfoBox item.
     */
    infoBoxMoreInfo: function(primaryKey, layerName) {
      var i = 0,
          layer;
      
      for (i; i < NPMap.config.layers.length; i++) {
        if (NPMap.config.layers[i].name === layerName) {
          layer = NPMap.config.layers[i];
          break;
        }
      }
      
      NPMap.layers.NativeVectors.getInfoBoxData(primaryKey, layer, true);
    },
    /**
     * @param url {String} Required
     * @param data {Object} Optional
     * @param layer {Object} Optional
     */
    loadData: function(url, data) {
      var options = {
        jsonpCallback: 'NPMap.layers.NativeVectors.loadDataCallback',
        type: 'jsonp',
        url: url
      };

      function load() {
        var jqxhr = reqwest(options);
        
        if (typeof jqxhr !== 'undefined' && typeof data !== 'undefined' && typeof data.tileId !== 'undefined') {
          jqxhr.tileId = data.tileId;
          pendingRequests.push(jqxhr);
        }
      }

      if (typeof(data) != 'undefined') {
        options.data = data;
      }
      
      if (typeof(data) != 'undefined' && typeof(data.tileId) != 'undefined') {
        var isPending = false;
        
        for (var i = 0; i < pendingRequests.length; i++) {
          if (data.tileId === pendingRequests[i].tileId) {
            isPending = true;
            break;
          }
        }

        if (!isPending) {
          load();
        }
      } else {
        load();
      }
    },
    /**
     * This function is called by jQuery after data are loaded.
     */
    loadDataCallback: function(data) {
      var index = -1;
      
      for (var i = 0; i < pendingRequests.length; i++) {
        if (data.tileId === pendingRequests[i].tileId) {
          index = i;
          break;
        }
      }
      
      if (index != -1) {
        pendingRequests.splice(index, 1);
      }
      
      NPMap[NPMap.config.api].layers.NativeVectors.dataToGeometries(data);
    },
    /**
     * Stops all the pending jQuery AJAX requests.
     */
    stopAllPendingRequests: function() {
      _.each(pendingRequests, function(v, i) {
        v.abort();
      });

      pendingRequests = [];
    }
  };
});