// TODO: Auto-pan is working properly except for when parent === 'page' and you've scrolled horizontally/vertically and at least one side of the InfoBox falls off of the page.
define([
  'Event',
  'Map/Map',
  'Util/Util'
], function(Event, Map, Util) {
  var
      // The InfoBox config object from the NPMap.config object.
      config = NPMap.config.infobox || {},
      // The number of actions currently being displayed in the InfoBox.
      actions = 0,
      // Where to position the InfoBox anchor. Currently, the only valid value is 'right'.
      anchorPosition = 'right',
      // The design to use for the InfoBox.
      design = config.design || 'basic',
      // The main InfoBox div.
      divInfoBox = document.createElement('div'),
      // The bottom div of the InfoBox.
      divInfoBoxBottom,
      // The content div of the InfoBox.
      divInfoBoxContent,
      // The content wrapper div of the InfoBox.
      divInfoBoxContentWrapper,
      // The footer div of the InfoBox.
      divInfoBoxFooter,
      // The title div of the InfoBox.
      divInfoBoxTitle,
      // The map div.
      divMap,
      // The height of the map div.
      mapHeight,
      // The position of the map on the page in pixels.
      mapPosition = {
        east: 0,
        north: 0,
        south: 0,
        west: 0
      },
      // The width of the map div.
      mapWidth,
      // This variable holds the user-defined maxHeight for the #npmapinfobox div.
      maxHeight = null,
      // This variable holds the user-defined maxWidth for the #npmapinfobox div.
      maxWidth = null,
      // The offset of the map div element (NPMap.config.div).
      offset,
      // The left offset of the map div element, in pixels.
      offsetLeft,
      // The top offset of the map div element, in pixels.
      offsetTop,
      // The amount of padding, in pixels, to preserve between the edge of the InfoBox and the edge of the map.
      padding = config.padding || 20,
      // Preserving the initial padding setting here. This will not be over-written.
      paddingSetting = padding,
      // The pan configuration.
      pan = config.pan || 'map',
      // The parent config.
      parent = config.parent || 'map',
      // Should the boundsCheck be skipped?
      skipBoundsCheck = false,
      // An object with CSS key-value pairs.
      styles = config.styles || {},
      // The window dimensions.
      windowDimensions = Util.getWindowDimensions(),
      // The height of the browser window, in pixels.
      windowHeight = windowDimensions.height,
      // The width of the browser window, in pixels.
      windowWidth = windowDimensions.width,
      // Should the map pan when an InfoBox is shown or resized?
      panActivated = (function() {
        if (parent === 'map' && (pan === 'center' || pan === 'map')) {
          return true;
        } else if (parent === 'page' && (pan === 'center' || pan === 'map' || pan === 'page')) {
          return true;
        } else {
          return false;
        }
      })();

  /**
   * Checks to see if the InfoBox is overlapping beyond the edges of the InfoBox's parent element.
   * @param {Function} callback
   * @return null
   */
  function checkBounds(callback) {
    if (NPMap.InfoBox && NPMap.InfoBox.visible) {
      var clickDotPixel = NPMap.Map[NPMap.config.api].pixelFromApi(NPMap.Map[NPMap.config.api].getClickDotPixel()),
          divNavigation = document.getElementById('npmap-navigation'),
          infoboxBottomDimensions = Util.getOuterDimensions(divInfoBoxBottom),
          infoboxDimensions = Util.getOuterDimensions(divInfoBox),
          navigationWidth = Util.getOuterDimensions(divNavigation).width + parseInt(divNavigation.style.left.replace('px', ''), null),
          p = {
            left: clickDotPixel.x - infoboxDimensions.width + 69,
            top: clickDotPixel.y - infoboxDimensions.height - infoboxBottomDimensions.height
          },
          paddingHalved = (padding / 2),
          r = {
            h: 0,
            v: 0
          };

      if (parent === 'page') {
        var scrollPosition = Util.getScrollPosition();
        p.left = p.left + (mapPosition.west - scrollPosition.x);
        p.top = p.top + (mapPosition.north - scrollPosition.y);
      }
      
      if (pan === 'center') {
        var h = (mapHeight - infoboxDimensions.height) / 2,
            o = Util.getOffset(divMap),
            w = (mapWidth - infoboxDimensions.width) / 2;

        if (parent === 'map') {
          o.left = 0;
          o.top = 0;

          if (p.top < 0) {
            r.v = -p.top + h + o.top;
          } else {
            r.v = h - p.top + o.top;
          }
        } else {
          r.v = (mapHeight / 2) - clickDotPixel.y + infoboxBottomDimensions.height + infoboxDimensions.height / 2;
        }

        if (p.left < 0) {
          if (parent === 'map') {
            r.h = -p.left + w + o.left;
          } else {
            // TODO: Hook this up for parent === 'page'
            r.h = -p.left + (mapWidth / 2) - ((infoboxDimensions.width * 2) / 2);
          }
        } else {
          r.h = w - p.left + o.left;
        }
      } else {
        for (var property in mapPosition) {
          switch (property) {
            case 'east':
              if (parent === 'map' && pan === 'map') {
                var outer = p.left + infoboxDimensions.width - mapWidth;

                if (outer > 0) {
                  r.h = -outer - paddingHalved;
                } else if (Math.abs(outer) < paddingHalved) {
                  r.h = -paddingHalved - outer;
                }
              } else {
                if (pan === 'map') {
                  if ((p.left + infoboxDimensions.width) > mapPosition.east) {
                    r.h = mapPosition.east - (p.left + infoboxDimensions.width) - paddingHalved;
                  } else if (p.left + infoboxDimensions.width > mapPosition.east - paddingHalved) {
                    r.h = mapPosition.east - paddingHalved - (p.left + infoboxDimensions.width);
                  }
                } else if (pan === 'page') {
                  var n = (p.left + infoboxDimensions.width) - windowWidth;

                  if (n > 0) {
                    r.h = -n - paddingHalved;
                  }
                }
              }

              break;
            case 'north':
              if (parent === 'map' && pan === 'map') {
                if (p.top < paddingHalved) {
                  if (p.top < 0) {
                    r.v = Math.abs(p.top) + paddingHalved;
                  } else {
                    r.v = paddingHalved - p.top;
                  }
                }
              } else {
                if (pan === 'map') {
                  if (p.top < mapPosition.north) {
                    r.v = mapPosition.north - p.top + paddingHalved;
                  } else if (p.top < mapPosition.north + paddingHalved) {
                    r.v = mapPosition.north - (p.top - paddingHalved);
                  }
                } else if (pan === 'page') {
                  if (p.top < 0) {
                    r.v = Math.abs(p.top) + paddingHalved;
                  }
                }
              }
              
              break;
            case 'south':
              // TODO: Implement when you have an InfoBox design that needs it.
              break;
            case 'west':
              if (parent === 'map' && pan === 'map') {
                if (p.left < 0) {
                  r.h = Math.abs(p.left) + paddingHalved;
                } else if (p.left < paddingHalved) {
                  r.h = paddingHalved -p.left;
                }
              } else {
                if (pan === 'map') {
                  if (p.left < mapPosition.west) {
                    r.h = mapPosition.west - p.left + paddingHalved;
                  } else if (p.left < mapPosition.west + paddingHalved) {
                    r.h = paddingHalved - (p.left - mapPosition.west);
                  }
                } else if (pan === 'page') {
                  if (p.left < 0) {
                    r.h = Math.abs(p.left) + paddingHalved;
                  }
                }
              }

              // Take into account navigation controls width.
              if (r.h > 0) {
                r.h = r.h + navigationWidth;
              } else if (p.left < navigationWidth) {
                r.h = (navigationWidth + paddingHalved) - p.left;
              }

              break;
          }
        }
      }

      if ((r.h !== 0 && r.h < mapWidth) || (r.v !== 0 && r.v < mapHeight)) {
        NPMap.Map.panByPixels({
          x: r.h,
          y: r.v
        }, function() {
          if (callback) {
            callback();
          }
        });
      } else if (callback) {
        callback();
      }
    }
  }
  /**
   * Positions the InfoBox.
   * @param {Function} callback (Optional)
   * @return null
   */
  function position(callback) {
    var bottom,
        clickDotPosition = NPMap.Map[NPMap.config.api].pixelFromApi(NPMap.Map[NPMap.config.api].getClickDotPixel()),
        clickDotLeft = clickDotPosition.x,
        clickDotTop = clickDotPosition.y,
        right;

    if (parent === 'map') {
      bottom = mapHeight - clickDotTop;
      right = mapWidth - clickDotLeft;

      if (design === 'basic') {
        bottom = bottom + 30;
        right = right - 69;
      } else if (design === 'nps' || design === 'pyv') {
        bottom = bottom + 24;
        right = right - (Util.getOuterDimensions(divInfoBox).width / 2) - 8;
      }
    } else if (parent === 'page') {
      if (design === 'basic') {
        bottom = (windowHeight - (clickDotTop + offsetTop)) + 30;
        right = (windowWidth - clickDotLeft - offsetLeft - 69) - Util.getScrollBarWidth();
      } else if (design === 'nps' || design === 'pyv') {
        // TODO: You need to test this. You'll have to adjust it.
        bottom = (windowHeight - (clickDotTop + offsetTop)) + 30;
        right = (windowWidth - clickDotLeft - offsetLeft - 69);
      }
    }

    divInfoBox.style.bottom = bottom + 'px';
    divInfoBox.style.right = right + 'px';

    if (callback) {
      callback();
    }
    
    refreshOffsetsAndWidth();
  }
  /**
   * Refreshes the dimensions of the map.
   * @return null
   */
  function refreshDimensions() {
    var offset = Util.getOffset(divMap),
        left = offset.left,
        top = offset.top;
    
    mapPosition.east = left + divMap.offsetWidth;
    mapPosition.north = top;
    mapPosition.south = top + divMap.offsetHeight;
    mapPosition.west = left;
  }
  /**
   * Updates the mapPosition object, sets the max-height/width dimensions of the InfoBox, and checks the bounds of the InfoBox.
   * @return null
   */
  function refreshDimensionsAndHeightWidth() {
    refreshDimensions();
    
    if (!maxHeight) {
      setMaxHeight();
    }
    
    if (!maxWidth) {
      setMaxWidth();
    }
  }
  /**
   * Refreshes the map div offsets and width.
   * @return null
   */
  function refreshOffsetsAndWidth() {
    windowDimensions = Util.getWindowDimensions();

    // TODO: You should move this into NPMap.Map.
    mapHeight = divMap.offsetHeight;
    mapWidth = divMap.offsetWidth;
    offset = Util.getOffset(divMap);
    offsetLeft = offset.left;
    offsetTop = offset.top;
    windowHeight = windowDimensions.height;
    windowWidth = windowDimensions.width;
  }
  /**
   * Resizes an object to fit into the current InfoBox content size.
   * @param {Object} obj The object to resize.
   * @param {Number} mH The max-height.
   * @param {Number} mW The max-width.
   * @return null
   */
  function resizeObjectForContent(obj, mH, mW) {
    var dimensions = Util.getOuterDimensions(obj),
        dimensionsContent = Util.getOuterDimensions(divInfoBoxContentWrapper),
        height = dimensions.height,
        width = dimensions.width;

    if (height > mH) {
      obj.style.height = mH + 'px';
    }

    if (width > mW) {
      obj.style.width = mW + 'px';
    }
    
    if (height > dimensionsContent.height) {
      divInfoBoxContentWrapper.style.height = height + 'px';
    }

    if (width > dimensionsContent.width) {
      divInfoBoxContentWrapper.style.width = width + 'px';
    }
  }
  /**
   * Sets the maxHeight of the InfoBox based on the height of the map div.
   * @return null
   */
  function setMaxHeight() {
    // TODO: If parent is set to 'page', you need to set maxHeight based on available height. This should probably update when the page is scrolled vertically?

    var valid = mapHeight - (padding * 2);

    if (maxHeight && (maxHeight <= valid)) {
      // Leave it.
    } else {
      maxHeight = valid;
      
      // TODO: Animate.
      divInfoBox.style.maxHeight = maxHeight + 'px';
    }
  }
  /**
   * Sets the maxWidth of the InfoBox based on the height of the map div.
   * @return null
   */
  function setMaxWidth() {
    // TODO: If parent is set to 'page', you need to set maxWidth based on available width. This should probably update when the page is scrolled horizontally?
    
    var valid = mapWidth - (padding * 2);

    if (maxWidth && (maxWidth <= valid)) {
      // Leave it.
    } else {
      maxWidth = valid;
      
      // TODO: Animate.
      divInfoBox.style.maxWidth = maxWidth + 'px';
    }
  }
  
  if (design === 'basic') {
    Util.injectCss(NPMap.config.server + '/resources/css/classes/infobox/basic.css');
    
    divInfoBox.innerHTML = '<div id="npmap-infobox-close" onclick="NPMap.InfoBox.hide();return false;"></div><div id="npmap-infobox-title"></div><div id="npmap-infobox-content-wrapper"><div id="npmap-infobox-content"></div></div><div id="npmap-infobox-footer"></div><div id="npmap-infobox-bottom"><img src="' + NPMap.config.server + '/resources/img/classes/infobox/hook' + (Modernizr.boxshadow ? '-shadow' : '') + '.png" style="right:23px;position:absolute;" /></div>';
  } else if (design === 'nps' || design === 'pyv') {
    Util.injectCss(NPMap.config.server + '/resources/css/classes/infobox/nps.css');
    
    // TODO: Add support for non-shadowed "hook".
    divInfoBox.innerHTML = '<div id="npmap-infobox-close" onclick="NPMap.InfoBox.hide();return false;"></div><div id="npmap-infobox-title"></div><div id="npmap-infobox-content-wrapper"><div id="npmap-infobox-content"></div></div><div id="npmap-infobox-footer"></div><div id="npmap-infobox-bottom"><div style="height:25px;margin:auto;width:18px;"><img src="' + NPMap.config.server + '/resources/img/classes/infobox/hook-nps.png" /></div>';
  }
  
  divInfoBox.className = 'shadow';
  divInfoBox.id = 'npmap-infobox';
  divInfoBox.style.display = 'none';
  divInfoBox.style.position = 'absolute';

  Event.add('NPMap.Map', 'ready', function() {
    divMap = NPMap.Map.getMapElement();
    mapHeight = divMap.offsetHeight;
    mapWidth = divMap.offsetWidth;
    offset = Util.getOffset(divMap);
    offsetLeft = offset.left;
    offsetTop = offset.top;

    if (parent === 'map') {
      divInfoBox.style.zIndex = 30;

      NPMap.Map.addControl(divInfoBox);
    } else {
      divInfoBox.style.zIndex = 999999;
      
      document.body.appendChild(divInfoBox);
    }

    for (var property in styles) {
      var value = styles[property];

      if (property === 'max-height' || property === 'maxHeight') {
        if (typeof value === 'string') {
          value = value.replace('px', '');
        }

        maxHeight = parseFloat(value);
        property = 'maxHeight';
        value = maxHeight + 'px';
      } else if (property === 'max-width' || property === 'maxWidth') {
        if (typeof value === 'string') {
          value = value.replace('px', '');
        }

        maxWidth = parseFloat(value);
        property = 'maxWidth';
        value = maxWidth + 'px';
      }

      try {
        divInfoBox.style[property] = value + ' !important';
      } catch(_ie78) {
        try {
          divInfoBox.style[property] = value;
        } catch (_ie7) {

        }
      }
    }
    
    if (!maxHeight) {
      setMaxHeight();
    }
    
    if (!maxWidth) {
      setMaxWidth();
    }

    divInfoBoxBottom = document.getElementById('npmap-infobox-bottom');
    divInfoBoxContent = document.getElementById('npmap-infobox-content');
    divInfoBoxContentWrapper = document.getElementById('npmap-infobox-content-wrapper');
    divInfoBoxFooter = document.getElementById('npmap-infobox-footer');
    divInfoBoxTitle = document.getElementById('npmap-infobox-title');

    if (panActivated) {
      Util.monitorResize(divMap, function() {
        refreshOffsetsAndWidth();
        refreshDimensionsAndHeightWidth();
      });
    } else {
      Util.monitorResize(divMap, function() {
        refreshOffsetsAndWidth();
        refreshDimensions();
      });
    }

    if (parent === 'page') {
      window.onresize = function() {
        refreshOffsetsAndWidth();

        if (NPMap.InfoBox && NPMap.InfoBox.visible) {
          NPMap.InfoBox.reposition();
        }
      
        refreshDimensions();
      };
    }

    bean.add(divInfoBoxContentWrapper, 'mousewheel', function(e) {
      if ((this.scrollTop === 0 && e.wheelDeltaY > 0) || ((this.scrollTop === (this.scrollHeight - this.offsetHeight)) && e.wheelDeltaY < 0)) {
        Util.eventCancelMouseWheel(e);
      } else {
        Util.eventCancelPropagation(e);
      }
    });
    refreshDimensions();
    refreshOffsetsAndWidth();
    Util.iterateThroughChildNodes(divInfoBox, function(el) {
      if (el.id !== 'npmap-infobox-bottom') {
        Util.stopAllPropagation(el);
      }
    });
  });

  return NPMap.InfoBox = {
    /**
     * Builds a HTML string for the InfoBox.
     * @param {Object} config The layer config object.
     * @param {Object} attributes A set of key-value pair attributes.
     * @param {String} element The identify element to build the HTML string for.
     * @return {String}
     */
    _build: function(config, attributes, element) {
      var html = null,
          template;

      if (typeof NPMap.config.identify !== 'undefined' && typeof NPMap.config.identify[element] !== 'undefined') {
        if (typeof NPMap.config.identify[element] === 'function') {
          html = NPMap.config.identify[element](attributes);
        } else {
          template = _.template(NPMap.config.identify[element]);
          html = template(attributes);
        }
      } else if (config) {
        if (typeof config.identify !== 'undefined' && typeof config.identify[element] !== 'undefined') {
          if (typeof config.identify[element] === 'function') {
            html = config.identify[element](attributes);
          } else {
            template = _.template(config.identify[element]);
            html = template(attributes);
          }
        }
      }
      
      if (!html) {
        if (element === 'content') {
          html = '<ul>';

          for (var prop in attributes) {
            html += '<li>' + prop + ': ' + attributes[prop] + '</li>';
          }

          html += '</ul>';
        } else if (element === 'title') {
          html = 'Attributes';
        }
      }

      return html;
    },
    /**
     * Gets the current scroll position of the InfoBox content wrapper div.
     * @return {Number}
     */
    _getScrollPosition: function() {
      return divInfoBoxContentWrapper.scrollTop;
    },
    /**
     * Scrolls the InfoBox content wrapper div to a position.
     * @param {Number} y
     * @return null
     */
    _scrollTo: function(y) {
      if (typeof divInfoBoxContentWrapper !== 'undefined') {
        divInfoBoxContentWrapper.scrollTop = y;
      }
    },
    // An array of action objects associated with the current identify operation. If the InfoBox is hidden, this will be null.
    actions: [],
    // An array of result objects for the current identify operation. If the InfoBox is hidden, this will be null.
    results: [],
    // The current latitude/longitude of the InfoBox. If the InfoBox is hidden, this will be null.
    latLng: null,
    // The current marker, if a marker is present. This is null if the InfoBox is displaying without a marker or if the InfoBox is hidden.
    marker: null,
    // This is true if the InfoBox is currently visible.
    visible: false,
    /**
     * Hides the InfoBox.
     * @return null
     */
    hide: function() {
      if (this.visible) {
        if (this.marker && this.marker.oldIconUrl) {
          NPMap.Map[NPMap.config.api].setMarkerIcon(this.marker, this.marker.oldIconUrl);
          delete this.marker.oldIconUrl;
        }

        divInfoBox.style.display = 'none';
        divInfoBox.style.width = 'auto';
        divInfoBoxContentWrapper.style.height = 'auto';
        divInfoBoxContentWrapper.style.width = '250px';
        divInfoBoxFooter.style.display = 'none';
        this.actions = [];
        this.visible = false;
        this.latLng = null;
        this.marker = null;
        
        NPMap.Event.trigger('InfoBox', 'hide');
      }
    },
    /**
     * Removes an action HTML element (<a>) from the InfoBox.
     * @return null
     */
    removeAction: function(el) {
      el.parentNode.removeChild(el);

      actions--;
      skipBoundsCheck = true;

      if (actions === 0) {
        divInfoBoxFooter.style.display = 'none';
      }
    },
    /**
     * Repositions the npmap-clickdot div then repositions the InfoBox. If the marker or npmap-clickdot is not in the current map bounds, it is hidden.
     * @return null
     */
    reposition: function() {
      var to = this.marker || this.latLng;

      NPMap.Map[NPMap.config.api].positionClickDot(to);
      
      if (NPMap.Map[NPMap.config.api].isLatLngWithinMapBounds(NPMap.Map[NPMap.config.api].getClickDotLatLng()) === true) {
        position();
      } else {
        // TODO: This should only hide if 'parent' is 'page'. Right now, however, the baseApi code doesn't support negative positioning of #npmap-clickdot.
        this.hide();
      }
    },
    /**
     * Shows the InfoBox.
     * @param {String} content The content string (HTML allowed) to set the InfoBox's content div to.
     * @param {String} title The title string (HTML allowed) to set the InfoBox's title div to.
     * @param {String} footer (Optional) The footer string (HTML allowed) to set the InfoBox's footer div to.
     * @param {Array} actions (Optional) An array of action objects and template strings (like 'zoombable').
     * @param {Object} styles (Optional) An object w/nested objects to override individual styles for the content, title, and/or footer divs. Example: {content: {maxHeight: '500px'}}.
     * @param {String} or {Object} target (Optional) Either a latitude,longitude string or a marker object to position the InfoBox too.
     * @return null
     */
    show: function(content, title, footer, actions, styles, target) {
      var bottomHeight,
          footerHeight,
          hasFooterContent = false,
          me = this,
          mH;

      if (this.visible) {
        this.hide();
      }

      actions = actions || [];

      if (target) {
        NPMap.Map[NPMap.config.api].positionClickDot(target);

        if (typeof target === 'string' || (typeof target === 'object' && typeof target.lat === 'number')) {
          NPMap.InfoBox.latLng = target;
        } else {
          NPMap.InfoBox.latLng = NPMap.Map.getMarkerLatLng(target);
          NPMap.InfoBox.marker = target;
        }
      }
      
      NPMap.Map.hideTip();

      divInfoBoxContentWrapper.style.height = 'auto';
      divInfoBoxContentWrapper.style.width = (design === 'basic' ? '250px' : '381px');
      divInfoBoxFooter.style.display = 'none';
      divInfoBoxTitle.innerHTML = title;

      if (config.hideActions) {
        actions = [];
      } else {
        if (actions.length > 0) {
          var add = [],
              remove = [];
          
          _.each(actions, function(action, i) {
            if (typeof action === 'string') {
              if (action === 'zoomable') {
                add.push({
                  handler: function() {
                    NPMap.Map.centerAndZoom(me.latLng, NPMap.Map[NPMap.config.api].getMaxZoom());
                  },
                  text: 'Zoom to this location'
                });
                remove.push(i);
              }
            }
          });
          _.each(remove, function(index) {
            actions.splice(index, 1);
          });
          _.each(add, function(action) {
            actions.push(action);
          });
        }
        
        if (NPMap.config.modules) {
          _.each(NPMap.config.modules, function(module) {
            if (module.name === 'route') {
              var address = null,
                  lat = me.latLng.lat.toFixed(5),
                  lng = me.latLng.lng.toFixed(5),
                  titleNoHtml = (Util.trimString(Util.stripHtmlFromString(title))).replace(/'/g, '{singlequote}');
                
              if (this.marker && this.marker.data) {
                if (this.marker.data['address']) {
                  address = this.marker.data['address'];
                } else if (this.marker.data['Address']) {
                  address = this.marker.data['Address'];
                } else if (config.addressAttribute && this.marker.data[module.addressAttribute]) {
                  address = this.marker.data[module.addressAttribute];
                }
              }
              
              address = address || null;
              
              if (module.mode === 'multi') {
                actions.push({
                  handler: function() {
                    NPMap.Route.addDestinationToItinerary(address, lat, lng, titleNoHtml);
                  },
                  text: 'Add destination to itinerary'
                });
              } else {
                actions.push({
                  group: 'Route',
                  handler: function() {
                    NPMap.Route.addDestinationFrom(address, lat, lng, titleNoHtml);
                  },
                  text: 'Directions from here'
                });
                actions.push({
                  group: 'Route',
                  handler: function() {
                    NPMap.Route.addDestinationTo(address, lat, lng, titleNoHtml);
                  },
                  text: 'Directions to here'
                });
              }
            }
          });
        }
        
        actions.sort(function(a, b) {
          // TODO: Figure out how to work with groups and take into account here.
          return a.text > b.text;
        });
        
        me.actions = actions;
  
        actions = (function() {
          var a = [];
  
          _.each(actions, function(action, i) {
            var h = '<a href="javascript:void(0)"';

            if (action.text.indexOf('Back') === 0) {
              h += ' class="back"';
            }
  
            h += ' onclick="NPMap.InfoBox.actions[' + i + '].handler();return false;">' + action.text + '</a>';
  
            a.push(h);
          });
          
          return a;
        })();
      }

      if (content) {
        content = content.replace(/\'/g, '&#39;');
      }
      
      if (footer) {
        footer = footer.replace(/\'/g, '&#39;');
      }
      
      if (title) {
        title = title.replace(/\'/g, '&#39;');
      }
      
      if (this.marker) {
        this.latLng = NPMap.Map.getMarkerLatLng(this.marker);
        
        if (this.marker.highlightIconUrl) {
          this.marker.oldIconUrl = NPMap.Map[NPMap.config.api].getMarkerIcon(this.marker);
          NPMap.Map[NPMap.config.api].setMarkerIcon(this.marker, this.marker.highlightIconUrl);
        }
      } else if (!this.latLng) {
        this.latLng = NPMap.Map[NPMap.config.api].latLngFromApi(NPMap.Map[NPMap.config.api].getClickDotLatLng());
      }
      
      if (footer) {
        if (actions.length > 0) {
          _.each(actions, function(action) {
            footer += action + '<br>';
          });
          
          footer = footer.slice(0, footer.length - 4);
        }
        
        divInfoBoxFooter.innerHTML = '<div style="text-align:left;">' + h + '</div>';
        divInfoBoxFooter.style.display = 'block';
        hasFooterContent = true;
      } else {
        if (actions.length > 0) {
          var h = '';

          _.each(actions, function(action) {
            h += action + '<br>';
          });

          h = h.slice(0, h.length - 4);
          
          divInfoBoxFooter.innerHTML = '<div style="text-align:left;">' + h + '</div>';
          divInfoBoxFooter.style.display = 'block';
          hasFooterContent = true;
        } else {
          divInfoBoxFooter.style.display = 'none';
          hasFooterContent = false;
        }
      }
      
      bottomHeight = Util.getOuterDimensions(divInfoBoxBottom).height;
      footerHeight = hasFooterContent ? Util.getOuterDimensions(divInfoBoxFooter).height : 0;
      mH = maxHeight - Util.getOuterDimensions(divInfoBoxTitle).height - bottomHeight;

      if (padding < (bottomHeight + footerHeight)) {
        padding = bottomHeight + footerHeight;
      }
      
      mH = mH - padding;
      
      // TODO: Animate the height and width resize of the InfoBox, if it is visible.
      divInfoBoxContentWrapper.style.maxHeight = mH + 'px';
      divInfoBoxContentWrapper.style.maxWidth = maxWidth + 'px';
      divInfoBoxContent.innerHTML = content;

      try {
        // TODO: You should only scroll to top if "more info". This is more complicated than you might think, though, because you'll need to preserve the scrollTop of the "clustered" contents and then restore it on "back".
        divInfoBoxContentWrapper.scrollLeft = 0;
        divInfoBoxContentWrapper.scrollTop = 0;
      } catch(e) {
      
      }

      Util.iterateThroughChildNodes(divInfoBox, function(el) {
        var nodeName = el.nodeName.toLowerCase();

        if (nodeName === 'img' || nodeName === 'object') {
          resizeObjectForContent(el, mH, maxWidth);
        }
      });

      this.visible = true;

      position(function() {
        if (panActivated && !skipBoundsCheck) {
          checkBounds(function() {
            divInfoBox.style.display = 'block';
            NPMap.Event.trigger('InfoBox', 'show');
          });
        }
      });
    }
  };
});