define([
  NPMap.config.server + '/npmap/' + NPMap.version + '/classes/InfoBox/InfoBox.js'
], function(InfoBox) {
  /**
   * Modified version of jQueryToast v0.1 - http://plugins.jquery.com/project/jQueryToast
   */
  (function(b){toasting=!1;toastQueue=[];b.toast=function(a){return new c(a)};var c=function(a){var c={message:"",displayTime:2E3,inTime:300,outTime:200,maxWidth:400};if(window.toasting)window.toastQueue.unshift(a);else{var d=b("#npmap-toast");window.toasting=!0;a=b.extend(c,a);d.html(a.message);d.fadeIn(a.inTime);setTimeout(function(){d.fadeOut(a.outTime,function(){window.toasting=!1;0<window.toastQueue.length&&(next=window.toastQueue.pop(),b.toast(next))})},a.displayTime)}}})(jQuery);
  
  var $mapDiv = $('#npmap'),
      zoomScales = [
        [0, 295829355],
        [1, 147914668],
        [2, 73957339],
        [3, 36978669],
        [4, 18489335],
        [5, 9244667],
        [6, 4622334],
        [7, 2311166],
        [8, 1155583],
        [9, 577792],
        [10, 288896],
        [11, 144448],
        [12, 72224],
        [13, 36112],
        [14, 18056],
        [15, 9028],
        [16, 4514],
        [17, 2257],
        [18, 1128],
        [19, 564]
      ];
  
  /**
   * Cancels navigation click events for an element.
   */
  function cancelMouseEvents($el) {
    $el.bind('contextmenu', function(e) {
      e.stopPropagation();
    }).bind('click', function(e) {
      e.stopPropagation();
    }).bind('dblclick', function(e) {
      e.stopPropagation();
    }).bind('mousedown', function(e) {
      e.stopPropagation();
    }).bind('mouseover', function(e) {
      e.stopPropagation();
    }).bind('mousewheel', function(e) {
      e.stopPropagation();
    });
        
    return $el;
  }
  /**
   * Creates a notify div.
   * @param {String} message
   * @param {String} title (Optional)
   * @param {String} type (Optional)
   * @return {Object}
   */
  function createNotify(message, title, type) {
    var cls = 'content',
        html = '';
        msg = document.createElement('div');

    if (type) {
      cls += ' ' + type;
    }

    msg.className = cls;

    if (title) {
      html += '<h3>' + title + '</h3><p>' + message + '</p>';
    } else {
      html += '<p style="text-align:center;">' + message + '</p>';
    }

    msg.innerHTML = html;
        
    return msg;
  }
  /**
   * Sets the width of the attribution control based on the width of the map and logos and positions it.
   */
  function setAttributionMaxWidthAndPosition() {
    var max = $mapDiv.width() - $('#npmap-logos').outerWidth() - 40,
        right = 0;
    
    if ($('#npmap-overviewmap')) {
      max = max - $('#npmap-overviewmap').outerWidth();
      right = $('#npmap-overviewmap').outerWidth();
    }
    
    $('#npmap-attribution').css({
      'right': right + 'px',
      'max-width': max + 'px'
    });
  }
  
  $mapDiv.resize(function() {
    setAttributionMaxWidthAndPosition();
    NPMap.Map.handleResize();
  });
    
  /**
   * @class NPMap.Map
   * 
   * The base class for all map objects. No "baseApi" specific code lives here.
   */
  return NPMap.Map = {
    // The layer handlers that are being used by the map.
    activeLayerHandlers: (function() {
      var a = [];

      if (NPMap.config.layers) {
        $.each(NPMap.config.layers, function(i, v) {
          var inArray = false;
          
          for (var j = 0; j < a.length; j++) {
            if (a[j] === v.type) {
              inArray = true;
              break;
            }
          }

          if (!inArray) {
            a.push(v.type);
          }
        });
      }
      
      return a;
    })(),
    /**
     * Adds an HTML element to the map div.
     * @param {Object} el
     * @param {Function} callback (Optional)
     */
    addElementToMapDiv: function(el, callback) {
      if (NPMap.config.api === 'bing') {
        NPMap.bing.map.addElementToMapDiv(el);
      } else {
        document.getElementById(NPMap.config.div).appendChild(el);
      }
      
      cancelMouseEvents($(el));

      if (callback) {
        callback();
      }
    },
    /**
     * Adds an HTML element to the map div.
     * @param {Array} els
     * @param {Function} callback (Optional)
     */
    addElementsToMapDiv: function(els, callback) {
      var me = this;
      
      if (NPMap.config.api === 'bing') {
        NPMap.utils.safeLoad('NPMap.bing', function() {
          $.each(els, function(i, el) {
            me.addElementToMapDiv(el);
          });
          
          if (callback) {
            callback();
          }
        });
      } else {
        $.each(els, function(i, el) {
          me.addElementToMapDiv(el);
        });
        
        if (callback) {
         callback();
        }
      }
    },
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map. This can be a marker, line, or polygon object for the active baseApi.
     */
    addShape: function(shape) {
      NPMap[NPMap.config.api].map.addShape(shape);
    },
    /**
     * Builds the attribution string for the visible layers.
     * @param {String} attribution An attribution string to add to the visible layer attribution.
     * @return {String}
     */
    buildAttributionStringForVisibleLayers: function(attribution) {
      var attr = [],
          me = this;
      
      if (attribution) {
        $.each(attribution.split('|'), function(i, v) {
          attr.push(v);
        });
      }
      
      $.each(me.getVisibleLayers(), function(i, v) {
        if (v.attribution) {
          $.each(v.attribution.split('|'), function(i2, v2) {
            var credit = v2.replace(/^\s*/, '').replace(/\s*$/, '');

            if ($.inArray(credit, attr) === -1) {
              attr.push(credit);
            }
          });
        }
      });

      if (attr.length > 0) {
        attr.sort();
        return attr.join(' | ');
      } else {
        return null;
      }
    },
     /**
     * Builds an HTML string for a layer's InfoBox element.
     * @param {Object} layer The layer config object.
     * @param {Object} attributes A set of key-value pair attributes.
     * @param {String} element The identify element to build the HTML string for.
     * @return {String}
     */
    buildInfoBoxHtmlString: function(layer, attributes, element) {
      var html = null;
      
      if (layer.identify && layer.identify[element]) {
        if (typeof(layer.identify[element]) === 'function') {
          html = layer.identify[element](attributes);
        } else {
          html = layer.identify[element];
        
          $.each(attributes, function(i, v) {
            // TODO: Use {mustache} here.
            html = html.replace('{' + i + '}', v);
          });
        }
      }
      
      if (!html) {
        if (element === 'content') {
          html = 'There is no description available for this location.';
        } else if (element === 'title') {
          html = 'No Title';
        }
      }

      return html;
    },
    /**
     * Centers then zooms the map.
     * @param {String} latLng The latLng string, in "latitude,longitude" format, to center the map on.
     * @param {Integer} zoom The zoom level to zoom the map to.
     * @param {Function} callback (Optional) A callback function to call after the map has been centered and zoomed.
     */
    centerAndZoom: function(latLng, zoom, callback) {
      NPMap[NPMap.config.api].map.centerAndZoom(NPMap[NPMap.config.api].map.stringToLatLng(latLng), zoom, callback);
    },
    /**
     * Creates a line using the baseApi's line class, if it exists.
     * @param {Array} latLngs An array of the latitude/longitude strings, in "latitude,longitude" format, to use to create the line.
     * @param {Object} options (Optional) baseApi-specific line options.
     * @param {Object} data (Optional)
     * @param {Function} clickHandler (Optional)
     */
    createLine: function(latLngs, options, data, clickHandler) {
      var apiLatLngs = [],
          me = this;
      
      $.each(latLngs, function(i, v) {
        apiLatLngs.push(me.stringToLatLng(v));
      });
      
      return NPMap[NPMap.config.api].map.createLine(apiLatLngs, options, data, clickHandler);
    },
    /**
     * Creates a marker using the baseApi's marker class, if it exists.
     * @param {String} latLng The latitude/longitude string, in "latitude,longitude" format, to use to create the marker.
     * @param {Object} options (Optional) baseApi-specific marker options.
     * @param {Object} data (Optional)
     * @param {Function} clickHandler (Optional)
     */
    createMarker: function(latLng, options, data, clickHandler) {
      return NPMap[NPMap.config.api].map.createMarker(this.stringToLatLng(latLng), options, data, clickHandler);
    },
    /**
     * Creates a polygon using the baseApi's marker class, if it exists.
     * @param {Array} latLngs An array of latitude/longitude strings, in "latitude,longitude" format, to use to create the polygon.
     * @param {Object} options (Optional) baseApi-specific polygon options.
     * @param {Object} data (Optional)
     * @param {Function} clickHandler (Optional)
     * @return {Object}
     */
    createPolygon: function(latLngs, options, data, clickHandler) {
      // TODO: Add support for data and clickHandler configs.
      var baseApiLatLngs = [],
          me = this;

      $.each(latLngs, function(i, v) {
        baseApiLatLngs.push(me.stringToLatLng(v));
      });
      
      return NPMap[NPMap.config.api].map.createPolygon(baseApiLatLngs, options);
    },
    /**
     * An array of event handler objects that have been added to this class.
     */
    events: [],
    /**
     * Gets the center of the map.
     * @return {String}
     */
    getCenter: function() {
      return this.latLngToString(NPMap[NPMap.config.api].map.getCenter());
    },
    /**
     *
     */
    getFiltersForLayer: function(layer) {
      if (layer.legend && layer.legend.filters) {
        $.each(layer.legend.filters, function(i, v) {
          
        });
      }
    },
    /**
     * Returns the layerConfig object for a layer.
     * @param {String} layerId The id of the layer to search for.
     * @param {Array} layers (Optional) The array of layers to search. If this is undefined or null, the NPMap.config.layers array will be searched.
     * @returns {Object}
     */
    getLayerById: function(layerId, layers) {
      if (!layers) {
        layers = NPMap.config.layers;
      }
      
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].id === layerId) {
          return layers[i];
        }
      }
    },
    /**
     * Returns the layerConfig object for a layer.
     * @param {String} layerName The name of the layer to search for.
     * @param {Array} layers (Optional) The array of layers to search. If this is undefined or null, the NPMap.config.layers array will be searched.
     * @return {Object}
     */
    getLayerByName: function(layerName, layers) {
      if (!layers) {
        layers = NPMap.config.layers;
      }
      
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].name === layerName) {
          return layers[i];
        }
      }
    },
    /**
     * Get the marker latitude and longitude, in "latitude,longitude" format.
     * @param {Object} marker
     * @return {String}
     */
    getMarkerLatLng: function(marker) {
      return this.latLngToString(NPMap[NPMap.config.api].map.getMarkerLatLng(marker));
    },
    /**
     * Gets a marker option.
     * @param {Object} marker The baseApi marker object.
     * @param {String} option The option to get. Currently the valid options are: 'icon'.
     */
    getMarkerOption: function(marker, option) {
      return NPMap[NPMap.config.api].map.getMarkerOption(marker, option);
    },
    /**
     * Gets the visibility property of a marker.
     * @param {Object} marker The marker to check the visibility for.
     */
    getMarkerVisibility: function(marker) {
      return NPMap[NPMap.config.api].map.getMarkerVisibility(marker);
    },
    /**
     * Builds out an array of visible layers. Can filter out visible layers that have either grids or tiles, if the checkFor parameter is passed in.
     */
    getVisibleLayers: function() {
      var layers = [];

      if (NPMap.config.layers && $.isArray(NPMap.config.layers)) {
        $.each(NPMap.config.layers, function(i, v) {
          if (v.visible) {
            layers.push(v);
          }
        });
      }
    
      return layers;
    },
    /**
     * Gets the zoom level of the map.
     * @return {Number}
     */
    getZoom: function() {
      return NPMap[NPMap.config.api].map.getZoom();
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     */
    handleResize: function() {
      if (typeof(NPMap[NPMap.config.api].map.handleResize) != 'undefined') {
        NPMap[NPMap.config.api].map.handleResize();
      }
    },
    /**
     * Checks to see if a clustered layer has been added to the map.
     * @return {Boolean}
     */
    hasClusteredLayer: function() {
      hasClustered = false;
      
      if (NPMap.config.layers) {
        $.each(NPMap.config.layers, function(i, v) {
          if (v.type === 'NativeVectors' && v.clustered === true) {
            hasClustered = true;
          }
        });
      }
      
      return hasClustered;
    },
    /**
     * Checks to see if a tiled layer has been added to the map.
     * @return {Boolean}
     */
    hasTiledLayer: function() {
      hasTiled = false;
      
      if (NPMap.config.layers) {
        $.each(NPMap.config.layers, function(i, v) {
          if ((v.type === 'NativeVectors' && v.tiled) || (v.type === 'ArcGisServerRest' || v.type === 'TileStream')) {
            hasTiled = true;
          }
        });
      }
      
      return hasTiled;
    },
    /**
     * Hides the progress bar.
     */
    hideProgressBar: function() {
      $('#npmap-progressbar div').css({
        width: '100%'
      });
      $('#npmap-progressbar').fadeOut();
    },
    /**
     * Hides a shape.
     * @param {Object} shape The shape to hide.
     */
    hideShape: function(shape) {
      NPMap[NPMap.config.api].map.hideShape(shape);
    },
    /**
     * Hides the tip.
     */
    hideTip: function() {
      $('#npmap-tip').hide();
    },
    /**
     * Initializes the construction of the NPMap.Map class. This is called by the baseApi map object after its map is created and should never be called manually.
     */
    init: function() {
      var attribution = document.createElement('div'),
          compass,
          dot = document.createElement('div'),
          elements = [],
          logos = document.createElement('div'),
          me = this,
          navigation = document.createElement('div'),
          navigationHtml = '',
          notify = document.createElement('div'),
          npmapLogo = '<a href="http://maps.nps.gov" target="_blank"><img src="' + NPMap.config.server + '/npmap/' + NPMap.version + '/resources/images/npmap-logo-dark.png" alt="NPMap - Web Mapping for the U.S. National Park Service" style="border:0 !important;display:block;" /></a>',
          progress = document.createElement('div'),
          switcher = document.createElement('div'),
          switcherMenu = document.createElement('div'),
          tip = document.createElement('div'),
          toast = document.createElement('div'),
          toolsConfig = (function() {
            if (NPMap.config.tools) {
              return NPMap.config.tools;
            }

            if (typeof NPMap.config.tools === 'undefined') {
              return {
                pan: 'north',
                zoom: 'small'
              };
            } else {
              return {};
            }
          })();
      
      /**
       * Hooks up the click event to an element.
       * @param {String} id
       * @param {Function} func
       * @return {Object}
       */
      function hookUpClickEvent(id, func) {
        var $el = $('#' + id);
        
        cancelMouseEvents($el);

        $el.click(function(e) {
          func();
        });
        
        return $el;
      }
      
      attribution.id = 'npmap-attribution';
      attribution.style.bottom = '0px';
      attribution.style.maxWidth = '400px';
      attribution.style.padding = '0 5px';
      attribution.style.position = 'absolute';
      attribution.style.right = '0px';
      attribution.style.textAlign = 'right';
      attribution.style.zIndex = '30';
      // TODO: Figure out how to position outside of map div.
      dot.id = 'npmap-clickdot';
      dot.style.backgroundColor = 'transparent';
      dot.style.display = 'none';
      dot.style.height = '1px';
      dot.style.position = 'absolute';
      dot.style.width = '1px';
      dot.style.zIndex = '30';
      logos.id = 'npmap-logos';
      logos.innerHTML = '<table style="height:29px;"><tr>' + (NPMap.config.api === 'modestmaps' ? '' : '<td style="vertical-align:middle;"><div style="margin-right:5px;"><img src="' + NPMap.config.server + '/npmap/' + NPMap.version + '/resources/images/' + NPMap.config.api + 'logo.png" style="display:block;" /></div></td>') + ((NPMap.config && NPMap.config.hideNpmapLogo === true) ? '' : '<td style="vertical-align:middle;">' + npmapLogo + '</td>') + '</tr></table>';
      logos.style.bottom = '3px';
      logos.style.left = '3px';
      logos.style.position = 'absolute';
      logos.style.zIndex = '30';
      
      elements.push(attribution, dot, logos);
      
      navigation.id = 'npmap-navigation';
      
      if (toolsConfig.pan) {
        navigation.style.width = '58px';
        
        compass = toolsConfig.pan;
        navigationHtml += '<div id="npmap-navigation-compass" class="npmap-navigation-compass-' + compass + '"><div id="npmap-navigation-compass-east" class="pointer"></div><div id="npmap-navigation-compass-north" class="pointer"></div><div id="npmap-navigation-compass-south" class="pointer"></div><div id="npmap-navigation-compass-west" class="pointer"></div>';
        
        if (compass === 'home') {
          navigationHtml += '<div id="npmap-navigation-compass-center" class="pointer"></div>';
        }
        
        navigationHtml += '</div>';
      }
      
      if (toolsConfig.zoom === 'small') {
        navigationHtml += '<div id="npmap-navigation-small-zoom" class="npmap-navigation-small-zoom"';
        
        if (typeof toolsConfig.pan !== 'undefined') {
          navigationHtml += ' style="margin-left:17px;margin-top:5px;"';
        }
        
        navigationHtml += '><div id="npmap-navigation-small-zoom-in" class="pointer"></div><div id="npmap-navigation-small-zoom-out" class="pointer"></div></div>';
      }
      
      if (navigationHtml.length > 0) {
        navigation.innerHTML = navigationHtml;
        navigation.style.left = '15px';
        navigation.style.position = 'absolute';
        navigation.style.top = '15px';
        navigation.style.zIndex = '30';
        
        elements.push(navigation);
      }
      
      
      notify.id = 'npmap-notify';

      elements.push(notify);

      progress.id = 'npmap-progressbar';
      progress.innerHTML = '<div></div>';
      progress.style.bottom = '35px';
      progress.style.display = 'none';
      progress.style.left = '50%';
      progress.style.marginLeft = '-100px';
      progress.style.position = 'absolute';
      progress.style.width = '200px';
      progress.style.zIndex = '30';
      
      elements.push(progress);
      
      if (NPMap.config.baseLayers && NPMap.config.baseLayers.length > 1) {
        (function(b){var d=function(){b(".jdropdown-menu").css({display:"none"});b(".jdropdown-anchor").removeClass("jdropdown-active");b(this).trigger("jdropdown.close")},f={init:function(a){return this.each(function(){var c=b(this),e=c.data("items");c.data("jdropdown")||(b(a.container).addClass("jdropdown-menu"),b(this).addClass("jdropdown-anchor").data("jdropdown",{items:"object"===typeof e?e:a.items,anchor:b(this),menu:b(a.container),options:a}).on({click:h}));return this})},destroy:function(){}},h=function(a){a.preventDefault();
        if(b(this).hasClass("jdropdown-active"))d();else{d();var a=b(this).data("jdropdown"),c=b(this).position(),e=a.menu;e.data("jdropdown",a).empty();(b.isFunction(a.renderMenu)?b.isFunction(a.renderItem)?a.renderItem(a.renderMenu(),a.items):g(a.renderMenu(),a.items):b.isFunction(a.renderItem)?a.renderItem(b("<ul></ul>"),a.items):g(b("<ul></ul>"),a.items)).appendTo(e);"left"==a.options.orientation?a.menu.css({display:"block",left:c.left,position:"absolute",top:c.top+b(this).outerHeight()}):a.menu.css({display:"block",
        left:c.left-e.outerWidth()+b(this).outerWidth(),position:"absolute",top:c.top+b(this).outerHeight()});b(this).addClass("jdropdown-active").trigger("jdropdown.open")}},g=function(a,c){b.each(c,function(e,d){b("<li"+(e===c.length-1?"":' style="border-bottom:solid 1px #F2F1EF;"')+"></li>").data("jdropdown.item",d).append(b("<a></a>").attr({href:"javascript:void(0)","class":d["class"]}).html('<div style="color:#818177;height:28px;line-height:28px;vertical-align:middle;"><div style="float:left;text-align:center;width:35px;"><img src="'+
        d.icon+'" style="height:22px;margin-top:3px;" /></div><div style="float:right;width:105px;">'+d.label+"</div></div>").on({click:i})).appendTo(a)});return a},i=function(){d();b(this).trigger("jdropdown.selectItem")};b(document).on("click",function(a){a=b(a.target);!a.parents().hasClass("jdropdown-menu")&&!a.parents().hasClass("jdropdown-anchor")&&!a.hasClass("jdropdown-menu")&&!a.hasClass("jdropdown-anchor")&&d()});b.fn.jdropdown=function(a){if(f[a])return f[a].apply(this,Array.prototype.slice.call(arguments,
        1));if("object"===typeof a||!a)return f.init.apply(this,arguments)}})(jQuery);
        
        switcher.className = 'npmap-switcher-dropdown';
        switcher.id = 'npmap-switcher';
        switcher.innerHTML = '<div id="npmap-switcher-dropdown-left"></div><div id="npmap-switcher-dropdown-icon"></div><div id="npmap-switcher-dropdown-text"></div><div id="npmap-switcher-dropdown-right"></div>';
        switcherMenu.id = 'npmap-switcher-menu';
        
        elements.push(switcher, switcherMenu);
      }
      
      tip.className = 'padded rounded shadowed transparent';
      tip.id = 'npmap-tip';

      elements.push(tip);

      toast.className = 'toast';
      toast.id = 'npmap-toast';
      toast.style.bottom = '70px';
      toast.style.display = 'none';
      toast.style.left = '50%';
      toast.style.marginLeft = '-75px';
      toast.style.position = 'absolute';
      toast.style.width = '150px';
      toast.style.zIndex = '32';
      
      elements.push(toast);
      
      this.addElementsToMapDiv(elements, function() {
        var $map;

        $('#npmap-logos').resize(setAttributionMaxWidthAndPosition);

        if (NPMap.config.baseLayers && NPMap.config.baseLayers.length > 1) {
          var activeIcon,
              activeLabel,
              items = [];
          
          function setIcon(url) {
            $('#npmap-switcher-dropdown-icon').html('<img src="' + url + '" style="height:15px;margin-top:4.5px;" />');
          }
          function setLabel(text) {
            $('#npmap-switcher-dropdown-text').html(text.toUpperCase());
          }
          
          $.each(NPMap.config.baseLayers, function(i, baseLayer) {
            var icon = NPMap.config.server + '/npmap/' + NPMap.version + '/resources/switcher/aerial-large.png', // TODO: Specify generic icon url.
                label = baseLayer.code,
                match = NPMap[NPMap.config.api].map.matchBaseLayer(baseLayer),
                type = baseLayer.type;
            
            if (match) {
              label = null;
              
              if (baseLayer.name) {
                label = baseLayer.name;
              } else if (match.name) {
                label = match.name;
              }
              
              type = match.type;
              
              switch (match.type) {
                case 'Aerial':
                  if (!label) {
                    label = 'Aerial View';
                  }
                  
                  icon = NPMap.config.server + '/npmap/' + NPMap.version + '/resources/switcher/aerial-large.png';
                  
                  break;
                case 'NPS':
                  if (!label) {
                    label = 'NPS View';
                  }
                  
                  icon = NPMap.config.server + '/npmap/' + NPMap.version + '/resources/switcher/nps-large.png';
                  
                  break;
                case 'Street':
                  if (!label) {
                    label = 'Street View';
                  }
                  
                  icon = NPMap.config.server + '/npmap/' + NPMap.version + '/resources/switcher/street-large.png';
                  
                  break;
                case 'Topo':
                  if (!label) {
                    label = 'Topo View';
                  }
                  
                  icon = NPMap.config.server + '/npmap/' + NPMap.version + '/resources/switcher/topo-large.png';
                  
                  break;
              };
            } else {
              if (baseLayer.icon) {
                icon = baseLayer.icon;
              }
              
              if (baseLayer.name) {
                label = baseLayer.name;
              }
            }
            
            if (typeof baseLayer.visible !== undefined && baseLayer.visible === true) {
              activeIcon = icon;
              activeLabel = label;
            }
            
            items.push({
              baseLayer: baseLayer,
              icon: icon,
              label: label
            });
          });
          
          setIcon(activeIcon);
          setLabel(activeLabel);
          
          items.sort(function(a, b) {
            return a.label > b.label;
          });
          
          $('.npmap-switcher-dropdown').jdropdown({
            container: '#npmap-switcher-menu',
            items: items,
            orientation: 'right'
          });
          $(document).on('jdropdown.selectItem', '#npmap-switcher-menu a', function(e, event) {
            var data = $(this).parent().data('jdropdown.item');
            
            e.preventDefault();
            setIcon(data.icon.replace('large', 'small'));
            setLabel(data.label);
            NPMap[NPMap.config.api].map.switchBaseLayer(data.baseLayer);
          });
        }
        
        if (toolsConfig.pan) {
          hookUpClickEvent('npmap-navigation-compass-east', function() {
            NPMap.Map.panInDirection('east');
          }).mouseover(function(e) {
            $('#npmap-navigation-compass').removeClass('npmap-navigation-compass-' + compass).addClass('npmap-navigation-compass-' + compass + '-east-over');
          }).mouseout(function(e) {
            $('#npmap-navigation-compass').removeClass('npmap-navigation-compass-' + compass + '-east-over').addClass('npmap-navigation-compass-' + compass);
          });
          hookUpClickEvent('npmap-navigation-compass-north', function() {
            NPMap.Map.panInDirection('north');
          }).mouseover(function(e) {
            $('#npmap-navigation-compass').removeClass('npmap-navigation-compass-' + compass).addClass('npmap-navigation-compass-' + compass + '-north-over');
          }).mouseout(function(e) {
            $('#npmap-navigation-compass').removeClass('npmap-navigation-compass-' + compass + '-north-over').addClass('npmap-navigation-compass-' + compass);
          });
          hookUpClickEvent('npmap-navigation-compass-south', function() {
            NPMap.Map.panInDirection('south');
          }).mouseover(function(e) {
            $('#npmap-navigation-compass').removeClass('npmap-navigation-compass-' + compass).addClass('npmap-navigation-compass-' + compass + '-south-over');
          }).mouseout(function(e) {
            $('#npmap-navigation-compass').removeClass('npmap-navigation-compass-' + compass + '-south-over').addClass('npmap-navigation-compass-' + compass);
          });
          hookUpClickEvent('npmap-navigation-compass-west', function() {
            NPMap.Map.panInDirection('west');
          }).mouseover(function(e) {
            $('#npmap-navigation-compass').removeClass('npmap-navigation-compass-' + compass).addClass('npmap-navigation-compass-' + compass + '-west-over');
          }).mouseout(function(e) {
            $('#npmap-navigation-compass').removeClass('npmap-navigation-compass-' + compass + '-west-over').addClass('npmap-navigation-compass-' + compass);
          });
          
          if (compass === 'home') {
            hookUpClickEvent('npmap-navigation-compass-center', function() {
              me.zoomToInitialExtent();
            });
          }
        }
        
        if (toolsConfig.zoom) {
          hookUpClickEvent('npmap-navigation-small-zoom-in', function() {
            NPMap.Map.zoomIn();
          }).mouseover(function(e) {
            $('#npmap-navigation-small-zoom').removeClass('npmap-navigation-small-zoom').addClass('npmap-navigation-small-zoom-in-over');
          }).mouseout(function(e) {
            $('#npmap-navigation-small-zoom').removeClass('npmap-navigation-small-zoom-in-over').addClass('npmap-navigation-small-zoom');
          });
          hookUpClickEvent('npmap-navigation-small-zoom-out', function() {
            NPMap.Map.zoomOut();
          }).mouseover(function(e) {
            $('#npmap-navigation-small-zoom').removeClass('npmap-navigation-small-zoom').addClass('npmap-navigation-small-zoom-out-over');
          }).mouseout(function(e) {
            $('#npmap-navigation-small-zoom').removeClass('npmap-navigation-small-zoom-out-over').addClass('npmap-navigation-small-zoom');
          });
        }
        
        if (NPMap.config.api === 'bing') {
          $map = $(NPMap.bing.map.getMapDiv());
        } else {
          $map = $('#npmap');
        }

        $map.bind('contextmenu', function(e) {
          return false;
        });

        // TODO: This is currently Bing specific.
        if (NPMap.config.api === 'bing' && toolsConfig.overviewMap) {
		      var overview = document.createElement('div'),
		          overviewMap;
          
          function updateOverviewMap() {
    		    var bounds = NPMap.bing.map.Map.getBounds(),
    		        nw = bounds.getNorthwest(),
    		        se = bounds.getSoutheast(),
    		        ne = new Microsoft.Maps.Location(se.latitude, nw.longitude),
    		        sw = new Microsoft.Maps.Location(nw.latitude, se.longitude);
    		    
    		    overviewMap.setView({
    		      bounds: bounds,
    		      padding: 20
    		    });
    		    overviewMap.entities.clear();
    		    
    		    if ($('#npmap-overviewmap-button').hasClass('expanded')) {
    		      overviewMap.entities.push(new Microsoft.Maps.Polygon([
    		        nw,
    		        ne,
    		        se,
    		        sw,
    		        nw
    		      ], {
    		        fillColor: new Microsoft.Maps.Color(175, 218, 233, 228),
    		        strokeColor: new Microsoft.Maps.Color(255, 186, 197, 191),
    		        strokeThickness: 1
    		      }));
    		    }
    		  }
		  
    		  overview.id = 'npmap-overviewmap';
    		  overview.innerHTML = '<div id="npmap-overviewmap-title" style="color:#454545;display:none;padding:8px;position:absolute;">Overview Map</div><div id="npmap-overviewmap-map" style="bottom:0px;left:0px;position:absolute;right:0px;top:0px;"></div>';
    		  overview.style.backgroundColor = 'white';
    		  overview.style.borderLeft = 'solid 3px black';
    		  overview.style.borderTop = 'solid 3px black';
    		  overview.style.bottom = $('#npmap-attribution').outerHeight() + 'px';
    		  overview.style.height = '48px';
    		  overview.style.position = 'absolute';
    		  overview.style.right = '0px';
    		  overview.style.width = '48px';
    		  overview.style.zIndex = '31';
    		  
    		  NPMap.bing.map.addElementToMapDiv(overview);
    		  
    		  overviewMap = new Microsoft.Maps.Map(document.getElementById('npmap-overviewmap-map'), {
    		    animate: false, // TODO: This isn't working.
    		    credentials: 'AqZQwVLETcXEgQET2dUEQIFcN0kDsUrbY8sRKXQE6dTkhCDw9v8H_CY8XRfZddZm',
    		    disablePanning: true,
    		    disableZooming: true,
    		    fixedMapPosition: true,
    		    mapTypeId: Microsoft.Maps.MapTypeId.road,
    		    showBreadcrumb: false,
    		    showCopyright: false,
    		    showDashboard: false,
    		    showLogo: false,
    		    showMapTypeSelector: false,
    		    showScalebar: false,
    		    useInertia: false
    		  });
    		  
    		  cancelMouseEvents($('#npmap-overviewmap'));
    		  
    		  $('<div id="npmap-overviewmap-button" class="npmap-overviewmap-open cursor" style="position:absolute;"></div>').appendTo('#npmap-overviewmap-map').click(function() {
    		    var $overview = $('#npmap-overviewmap'),
    		        $this = $(this),
    		        $title = $('#npmap-overviewmap-title');
    		    
    		    if ($this.hasClass('expanded')) {
    		      $title.hide();
    		      $('#npmap-overviewmap-map').css({
    		        top: '0px'
    		      });
    		      $overview.animate({
    		        height: 48,
    		        width: 48
    		      }, 250, function() {
    		        overviewMap.setOptions({
    		          height: 48,
    		          width: 48
    		        });
    		        setAttributionMaxWidthAndPosition();
    		        updateOverviewMap();
    		      });
    		      $this.removeClass('npmap-overviewmap-close').removeClass('npmap-overviewmap-close-over').removeClass('expanded').addClass('npmap-overviewmap-open');
    		      overviewMap.entities.clear();
    		    } else {
    		      $title.show();
    		      $('#npmap-overviewmap-map').css({
    		        top: $title.height() + 'px'
    		      });
    		      $overview.animate({
    		        height: 173,
    		        width: 174
    		      }, 250, function() {
    		        overviewMap.setOptions({
    		          height: 173,
    		          width: 174
    		        });
    		        setAttributionMaxWidthAndPosition();
    		        updateOverviewMap();
    		      });
    		      $this.removeClass('npmap-overviewmap-open').removeClass('npmap-overviewmap-open-over').addClass('npmap-overviewmap-close').addClass('expanded');
    		    }
    		  }).mouseover(function() {
    		    var $this = $(this);
    		    
    		    if ($this.hasClass('expanded')) {
    		      $this.removeClass('npmap-overviewmap-close').addClass('npmap-overviewmap-close-over');
    		    } else {
    		      $this.removeClass('npmap-overviewmap-open').addClass('npmap-overviewmap-open-over');
    		    }
    		  }).mouseout(function() {
    		    var $this = $(this);
    		    
    		    if ($this.hasClass('expanded')) {
    		      $this.removeClass('npmap-overviewmap-close-over').addClass('npmap-overviewmap-close');
    		    } else {
    		      $this.removeClass('npmap-overviewmap-open-over').addClass('npmap-overviewmap-open');
    		    }
    		  });
    		  
    		  /*
    		  Microsoft.Maps.Events.addHandler(overviewMap, 'viewchangeend', function() {
    		    NPMap.bing.map.Map.setView({
    		      center: overviewMap.getCenter()
    		    });
    		  });
    		  */
    		  
    		  NPMap.Event.add('NPMap.Map', 'viewchangeend', function(e) {
    		    updateOverviewMap();
    		  });
    		}
    		
    		setAttributionMaxWidthAndPosition();
        $('#npmap-tip').css({
          display: 'none',
          maxWidth: '200px',
          position: 'absolute',
          zIndex: 32
        });
      });
    },
    /**
     * Tests to see if a latLng is within the map's current bounds.
     * @param latLng {String} {Required} The latitude/longitude string, in "latitude,longitude" format, to test.
     * @return {Boolean}
     */
    isLatLngWithinMapBounds: function(latLng) {
      return NPMap[NPMap.config.api].map.isLatLngWithinMapBounds(latLng);
    },
    /**
     * Converts a baseApi lat/lng object to a lat/lng string in "latitude/longitude" format.
     * @param {Object} latLng The lat/lng object.
     * @return {String}
     */
    latLngToString: function(latLng) {
      return NPMap[NPMap.config.api].map.latLngToString(latLng);
    },
    /**
     * Turns meters into a zoom level. This function is not precise, as it is impossible to get precise meter scale values for the entire earth. Only use this in cases where approximate numbers are acceptable.
     * @param {Number} meters
     * @return {Number}
     */
    metersToZoomLevel: function(meters) {
      var i = 0,
          z;
      
      for (i; i < zoomScales.length; i++) {
        if (meters >= zoomScales[i][1]) {
          if (zoomScales[i - 1]) {
            if (meters < zoomScales[i - 1][1]) {
              z = zoomScales[i][0];
            }
          } else {
            z = zoomScales[i][0];
          }
        } else if (meters < zoomScales[zoomScales.length - 1][1]) {
          z = zoomScales[i][0];
        }
      }

      return z;
    },
    /**
     * Shows the notification.
     * @param {String} message
     * @param {String} title (Optional)
     * @param {String} type (Optional) - 'error', 'info', or 'success'
     * @param {Number} interval (Optional)
     */
    notify: function(message, title, type, interval) {
      var $msg = $(createNotify(message, title, type));

      interval = interval || 3000;

      $('#npmap-notify').append($msg);
      $msg.hide().slideDown(100, function() {
        setTimeout(function() {
          $msg.slideUp(100);
        }, interval);
      });
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     */
    panByPixels: function(pixels) {
      NPMap[NPMap.config.api].map.panByPixels(pixels);
    },
    /**
     * Pans the map in a direction by a quarter of the current map viewport.
     * @param {String} direction The direction to pan the map in. Valid directions are 'east', 'north', 'south', and 'west'.
     */
    panInDirection: function(direction) {
      var h = $('#' + NPMap.config.div).outerHeight(),
          me = this,
          w = $('#' + NPMap.config.div).outerWidth();
          
      switch (direction) {
        case 'east':
          me.panByPixels({
            x: - (w / 4),
            y: 0
          });
          break;
        case 'north':
          me.panByPixels({
            x: 0,
            y: h / 4
          });
          break;
        case 'south':
          me.panByPixels({
            x: 0,
            y: - (h / 4)
          });
          break;
        case 'west':
          me.panByPixels({
            x: w / 4,
            y: 0
          });
          break;
      };
    },
    /**
     * Removes a shape from the map.
     * @param {Object} shape The shape to remove from the map.
     */
    removeShape: function(shape) {
      NPMap[NPMap.config.api].map.removeShape(shape);
    },
    /**
     * Sets the attribution string for the map.
     * @param {String} attribution
     */
    setAttribution: function(attribution) {
      var $d = $('#npmap-attribution');

      if ($d.length > 0) {
        $('#npmap-attribution').html(attribution);
      } else {
        var int = setInterval(function() {
          $d = $('#npmap-attribution');
          
          if ($d.length > 0) {
            clearInterval(int);
            $('#npmap-attribution').html(attribution);
          }
        }, 100);
      }
    },
    /**
     * Sets a marker's options.
     * @param {Object} marker The baseApi marker object.
     * @param {Object} options The options to set. Currently the valid options are: 'class', 'icon', 'label', 'visible', and 'zIndex'.
     */
    setMarkerOptions: function(marker, options) {
      NPMap[NPMap.config.api].map.setMarkerOptions(marker, options);
    },
    /**
     * Shows the progress bar.
     * @param {Number} value (Optional) The value to start the progress bar at.
     */
    showProgressBar: function(value) {
      if (!value) {
        value = 0;
      }
      
      $('#npmap-progressbar div').css({
        width: value + '%'
      });
      $('#npmap-progressbar').fadeIn();
      
      //this.updateProgressBar(value);
    },
    /**
     * Shows a shape.
     * @param {Object} shape The shape to show.
     */
    showShape: function(shape) {
      NPMap[NPMap.config.api].map.showShape(shape);
    },
    /**
     * Shows the tip.
     * @param {String} content
     * @param {Object} position
     */
    showTip: function(content, position) {
      $('#npmap-tip').html(content).css({
        bottom: $mapDiv.height() - position.y + 'px',
        right: $mapDiv.width() - position.x + 'px'
      }).show();
    },
    /**
     * Converts a lat/lng string ("latitude/longitude") to a baseApi's latLng object.
     * @param {String} latLng The lat/lng string.
     * @return {Object}
     */
    stringToLatLng: function(latLng) {
      return NPMap[NPMap.config.api].map.stringToLatLng(latLng);
    },
    /**
     * DEPRECATED: Updates a marker's icon.
     * @param {Object} marker A baseApi marker object.
     * @param {String} icon The url of the new icon.
     */
    updateMarkerIcon: function(marker, icon) {
      NPMap[NPMap.config.api].map.updateMarkerIcon(marker, icon);
    },
    /**
     * DEPRECATED: Updates a marker's label.
     * @param {Object} marker A baseApi marker object.
     * @param {String} label The new label string.
     */
    updateMarkerLabel: function(marker, label) {
      NPMap[NPMap.config.api].map.updateMarkerLabel(marker, label);
    },
    /**
     * Updates the progress bar value.
     * @param {Number} value The value to update the progress bar with.
     */
    updateProgressBar: function(value) {
      //$('#npmap-progressbar').progressbar('option', 'value', value);

      $('#npmap-progressbar div').css({
        width: value + '%'
      });
    },
    /**
     * Zooms the map in by one zoom level.
     */
    zoomIn: function() {
      NPMap[NPMap.config.api].map.zoomIn();
    },
    /**
     * Zooms the map out by one zoom level.
     */
    zoomOut: function() {
      NPMap[NPMap.config.api].map.zoomOut();
    },
    /**
     * Zooms the map to a bounding box.
     * @param {Object} bbox A bbox object with nw and se lat/lng strings.
     */
    zoomToBoundingBox: function(bbox) {
      NPMap[NPMap.config.api].map.zoomToBoundingBox({
        nw: NPMap[NPMap.config.api].map.stringToLatLng(bbox.nw),
        se: NPMap[NPMap.config.api].map.stringToLatLng(bbox.se)
      });
    },
    /**
     * Zooms the map to its initial extent.
     */
    zoomToInitialExtent: function() {
      NPMap[NPMap.config.api].map.zoomToInitialExtent();
    },
    /**
     * Zooms the map to a lat/lng.
     * @param {String} latLng The lat/lng string, in "latitude,longitude" format, to zoom the map to.
     */
    zoomToLatLng: function(latLng) {
      NPMap[NPMap.config.api].map.zoomToLatLng(this.stringToLatLng(latLng));
    },
    /**
     * Zooms the map to the extent of an array of lat/lng strings.
     * @param {Array} latLngs The array of lat/lng strings.
     */
    zoomToLatLngs: function(latLngs) {
      var apiLatLngs = [],
          me = this;
      
      $.each(latLngs, function(i, latLng) {
        apiLatLngs.push(me.stringToLatLng(latLng));
      });
      
      NPMap[NPMap.config.api].map.zoomToLatLngs(apiLatLngs);
    }
  };
});