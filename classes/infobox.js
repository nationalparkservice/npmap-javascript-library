// TODO: You need to support panning if the InfoBox falls within the "padding" set around the edge of the map.
define(function() {
  var 
      // The parent map div of the NPMap div.
      $mapDiv = $('#' + NPMap.config.div).parent(),
      // The InfoBox config object from the NPMap.config object.
      config = NPMap.config.infobox || {},
      // The number of actions currently being displayed in the InfoBox.
      actions = 0,
      // Where to position the InfoBox anchor. Currently, the only valid value is 'right'.
      anchorPosition = 'right',
      // The design to use for the InfoBox.
      design = config.design || 'basic',
      // The infobox div.
      infobox = document.createElement('div'),
      // The position of the map on the page in pixels.
      mapPosition = {
        east: 0,
        north: 0,
        south: 0,
        west: 0
      },
      // This variable holds the user-defined maxHeight for the #npmapinfobox div.
      maxHeight = null,
      // This variable holds the user-defined maxWidth for the #npmapinfobox div.
      maxWidth = null,
      // The offset of the map div element (NPMap.config.div).
      offset = NPMap.utils.getMapDivOffset(),
      // The left offset of the map div element, in pixels.
      offsetLeft = offset.left,
      // The top offset of the map div element, in pixels.
      offsetTop = offset.top,
      // The amount of padding, in pixels, to preserve between the edge of the InfoBox and the edge of the map.
      padding = config.padding || 20,
      // 
      paddingSetting = padding,
      // The pan configuration.
      pan = config.pan || 'none',
      // The parent config.
      parent = config.parent || 'map',
      // Should the boundsCheck be skipped?
      skipBoundsCheck = false,
      // An object with CSS key-value pairs.
      styles = config.styles || {},
      // The width of the browser window, in pixels.
      windowWidth = $(window).width(),
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
   */
  function checkBounds() {
    if (NPMap.InfoBox && NPMap.InfoBox.visible) {
      var $me = $('#npmap-infobox'),
          p = $me.position(),
          paddingHalved = (padding / 2),
          r = {
            h: 0,
            v: 0
          };

      if (pan === 'center') {
        var h = ($mapDiv.outerHeight() - $me.outerHeight()) / 2,
            o = NPMap.utils.getMapDivOffset(),
            w = ($mapDiv.outerWidth() - $me.outerWidth()) / 2;

        if (parent === 'map') {
          o.left = 0;
          o.top = 0;
        }
        
        if (p.top < 0) {
          r.v = -p.top + h + o.top;
        } else {
          r.v = h - p.top + o.top;
        }
        
        if (p.left < 0) {
          r.h = -p.left + w + o.left;
        } else {
          r.h = w - p.left + o.left;
        }
      } else {
        $.each(mapPosition, function(i, v) {
          switch (i) {
            case 'east':
              if (parent === 'map' && pan === 'map') {
                var o = p.left + $me.outerWidth() - $mapDiv.width();
                
                if (o > 0) {
                  r.h = -o - paddingHalved;
                }
              } else {
                if (pan === 'map') {
                  if ((p.left + $me.outerWidth()) > mapPosition.east) {
                    r.h = mapPosition.east - (p.left + $me.outerWidth()) - paddingHalved;
                  }
                } else if (pan === 'page') {
                  var o = (p.left + $me.outerWidth()) - $(document.body).width();
                  
                  if (o > 0) {
                    r.h = -o - paddingHalved;
                  }
                }
              }
  
              break;
            case 'north':
              if (parent === 'map' && pan === 'map') {
                if (p.top < 0) {
                  r.v = Math.abs(p.top) + paddingHalved;
                }
              } else {
                if (pan === 'map') {
                  if (p.top < mapPosition.north) {
                    r.v = mapPosition.north - p.top + paddingHalved;
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
                }
              } else {
                if (pan === 'map') {
                  if (p.left < mapPosition.west) {
                    r.h = mapPosition.west - p.left + paddingHalved;
                  }
                } else if (pan === 'page') {
                  if (p.left < 0) {
                    r.h = Math.abs(p.left) + paddingHalved;
                  }
                }
              }
              
              break;
          }
        });
      }

      // TODO: MAYBE??? Get the height and width of the InfoBox, and verify that there is enough space to reposition it. If there isn't, don't reposition it.
      if ((r.h !== 0 && r.h < $mapDiv.outerWidth()) || (r.v !== 0 && r.v < $mapDiv.outerHeight())) {
        NPMap.Map.panByPixels({
          x: r.h,
          y: r.v
        });
      }
    }
  }  
  /**
   * Positions the InfoBox.
   * @param {Function} callback (Optional)
   */
  function position(callback) {
    if (parent === 'map') {
      var bottom = $mapDiv.height() - $('#npmap-clickdot').position().top,
          right = $mapDiv.width() - $('#npmap-clickdot').position().left;

      if (design === 'basic') {
        bottom = bottom + 30;
        right = right - 69;
      } else if (design === 'pyv') {
        bottom = bottom + 24;
        right = right - ($('#npmap-infobox').outerWidth() / 2) - 8;
      }
      
      $('#npmap-infobox').css({
        bottom: bottom + 'px',
        right: right + 'px'
      });
    } else if (parent === 'page') {
      if (design === 'basic') {
        $('#npmap-infobox').css({
          bottom: ($(window).height() - ($('#npmap-clickdot').position().top + offsetTop)) + 30 + 'px',
          right: (windowWidth - $('#npmap-clickdot').position().left - offsetLeft - 69) + 'px'
        });
      } else if (design === 'pyv') {
        // TODO: You need to test this. You'll have to adjust it.
        $('#npmap-infobox').css({
          bottom: ($(window).height() - ($('#npmap-clickdot').position().top + offsetTop)) + 30 + 'px',
          right: (windowWidth - $('#npmap-clickdot').position().left - offsetLeft - 69) + 'px'
        });
      }
    }

    if (callback) {
      callback();
    }
    
    refreshOffsetsAndWidth();
  }
  /**
   * Refreshes the dimensions of the map.
   */
  function refreshDimensions() {
    var p = $mapDiv.position();
    
    mapPosition.east = p.left + $mapDiv.width();
    mapPosition.north = p.top;
    mapPosition.south = p.top + $mapDiv.height();
    mapPosition.west = p.left;
  }
  /**
   * Updates the mapPosition object, sets the max-height/width dimensions of the InfoBox, and checks the bounds of the InfoBox.
   */
  function refreshDimensionsAndHeightWidth() {
    refreshDimensions();
    
    if (!maxHeight) {
      setMaxHeight();
    }
    
    if (!maxWidth) {
      setMaxWidth();
    }
    
    /*
    if (NPMap.InfoBox && NPMap.InfoBox.visible) {
      checkBounds();
    }
    */
  }
  /**
   * Refreshes the map div offsets and width.
   */
  function refreshOffsetsAndWidth() {
    offset = NPMap.utils.getMapDivOffset();
    offsetLeft = offset.left;
    offsetTop = offset.top;
    windowWidth = $(window).width();
  }
  /**
   * Resizes an image to fit into the current InfoBox content size.
   * @param {Object} img The image or "object" to work with.
   * @param {Number} mH The max-height.
   * @param {Number} mW The max-width.
   */
  function resizeImageForContent(img, mH, mW) {
    var $img = $(img);
    
    if ($img.height() > mH) {
      $img.css({
        height: mH
      });
    }
    
    if ($img.width() > mW) {
      $img.css({
        width: mW
      });
    }
    
    if ($img.height() > $('#npmap-infobox-content-wrapper').outerHeight()) {
      $('#npmap-infobox-content-wrapper').css({
        height: $img.height()
      });
    }
    
    if ($img.width() > $('#npmap-infobox-content-wrapper').outerWidth()) {
      $('#npmap-infobox-content-wrapper').css({
        width: $img.width()
      });
    }
  }
  /**
   * Sets the maxHeight of the InfoBox based on the height of the map div.
   */
  function setMaxHeight() {
    // TODO: If parent is set to 'page', you need to set maxHeight based on available height. This should probably update when the page is scrolled vertically?

    var valid = $mapDiv.outerHeight() - (padding * 2);

    if (maxHeight && (maxHeight <= valid)) {
      // Leave it.
    } else {
      maxHeight = valid;
      
      // TODO: Animate.
      $('#npmap-infobox').css('max-height', maxHeight + 'px');
    }
  }
  /**
   * Sets the maxWidth of the InfoBox based on the height of the map div.
   */
  function setMaxWidth() {
    // TODO: If parent is set to 'page', you need to set maxWidth based on available width. This should probably update when the page is scrolled horizontally?
    
    var valid = $mapDiv.outerWidth() - (padding * 2);

    if (maxWidth && (maxWidth <= valid)) {
      // Leave it.
    } else {
      maxWidth = valid;
      
      // TODO: Animate.
      $('#npmap-infobox').css('max-width', maxWidth + 'px');
    }
  }
  function setupInfoBox() {
    $.each(styles, function(i, v) {
      if (i === 'max-height' || i === 'maxHeight') {
        if (typeof(v) === 'string') {
          v = v.replace('px', '');
        }
        
        maxHeight = parseFloat(v);
        $('#npmap-infobox').css(i, v + 'px !important');
      } else if (i === 'max-width' || i === 'maxWidth') {
        if (typeof(v) === 'string') {
          v = v.replace('px', '');
        }
        
        maxWidth = parseFloat(v);
        $('#npmap-infobox').css(i, v + 'px !important');
      } else {
        $('#npmap-infobox').css(i, v + ' !important');
      }
    });
    
    if (!maxHeight) {
      setMaxHeight();
    }
    
    if (!maxWidth) {
      setMaxWidth();
    }
    
    $('#npmap-infobox').bind('contextmenu', function(e) {
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
    
    // TODO: Change cursor to default.
    
    if (panActivated) {
      $mapDiv.resize(refreshDimensionsAndHeightWidth);
    } else {
      $mapDiv.resize(refreshDimensions);
    }
    
    // TODO: Test this.
    if (parent === 'page') {
      $(window).resize(function() {
        refreshOffsetsAndWidth();

        if (NPMap.InfoBox && NPMap.InfoBox.visible) {
          NPMap.InfoBox.reposition();
        }
      
        refreshDimensions();
      });
    }
    
    refreshDimensions();
    refreshOffsetsAndWidth();
  }
  
  if (design === 'basic') {
    NPMap.utils.injectCss(NPMap.config.server + '/resources/classes/infobox/css/infobox.css');
    
    infobox.innerHTML = '<div id="npmap-infobox-close" onclick="NPMap.InfoBox.hide();return false;"></div><div id="npmap-infobox-title"></div><div id="npmap-infobox-content-wrapper"><div id="npmap-infobox-content"></div></div><div id="npmap-infobox-footer"></div><div id="npmap-infobox-bottom"><img src="' + NPMap.config.server + '/resources/classes/infobox/img/hook' + (Modernizr.boxshadow ? '_shadow' : '') + '.png" style="right:23px;position:absolute;" /></div>';
  } else if (design === 'pyv') {
    NPMap.utils.injectCss(NPMap.config.server + '/resources/classes/infobox/css/infobox-pyv.css');
    
    // TODO: Add support for non-shadowed "hook".
    infobox.innerHTML = '<div id="npmap-infobox-close" class="close" onclick="NPMap.InfoBox.hide();return false;"></div><div id="npmap-infobox-title"></div><div id="npmap-infobox-content-wrapper"><div id="npmap-infobox-content"></div></div><div id="npmap-infobox-footer"></div><div id="npmap-infobox-bottom"><div style="height:25px;margin:auto;width:18px;"><img src="' + NPMap.config.server + '/resources/classes/infobox/img/hook_pyv.png" /></div>';
  }
  
  infobox.className = 'shadow';
  infobox.id = 'npmap-infobox';
  infobox.style.display = 'none';
  infobox.style.position = 'absolute';
  
  if (parent === 'map') {
    infobox.style.zIndex = 29;
    
    NPMap.utils.safeLoad('NPMap.Map', function() {
      NPMap.Map.addElementToMapDiv(infobox);
      setupInfoBox();
    });
  } else {
    infobox.style.zIndex = 999999;
    
    document.body.appendChild(infobox);
    setupInfoBox();
  }
  
  /**
   * @class NPMap.InfoBox
   * 
   * The InfoBox displays attribute information for geospatial data.
   */
  return NPMap.InfoBox = {
    /** 
     * An array of action objects associated with the current identify operation. This is null if the InfoBox is hidden.
     */
    actions: [],
    /*
     * An array of result objects for the current identify operation. This is null if the InfoBox is hidden.
     */
    results: [],
    /**
     * An array of event handler objects that have been added to this class.
     */
    events: [],
    /**
     * The current latitude/longitude, in "latitude,longitude" format, of the InfoBox (or is it the InfoBox's anchor?). If the InfoBox is hidden, this will be null.
     */
    latLng: null,
    /**
     * The current marker, if a marker is present. This is null if the InfoBox is displaying without a marker or if the InfoBox is hidden.
     */
    marker: null,
    /**
     * Is the InfoBox currently visible?
     */
    visible: false,
    /**
     * Hides the InfoBox.
     */
    hide: function() {
      if (this.visible) {
        $('#npmap-infobox').hide()
        
        if (this.marker && this.marker.oldIconUrl) {
          NPMap[NPMap.config.api].map.setMarkerIcon(this.marker, this.marker.oldIconUrl);
          delete this.marker.oldIconUrl;
        }

        $('#npmap-infobox').css({
          width: 'auto'
        });
        $('#npmap-infobox-content-wrapper').css({
          height: 'auto',
          width: '250px'
        });
        $('#npmap-infobox-footer').hide();

        this.actions = [];
        this.visible = false;
        this.latLng = null;
        this.marker = null;
        
        NPMap.Event.trigger('InfoBox', 'hide');
      }
    },
    /**
     * Removes an action HTML element (<a>) from the InfoBox.
     */
    removeAction: function(el) {
      $(el).remove();
      actions--;

      skipBoundsCheck = true;

      if (actions === 0) {
        $('#npmap-infobox-footer').hide();
      }
    },
    /**
     * Repositions the npmap-clickdot div then repositions the InfoBox. If the marker or npmap-clickdot is not in the current map bounds, it is hidden.
     */
    reposition: function() {
      var me = this,
          to = this.marker || this.latLng;
      
      // to is undefined
      
      NPMap[NPMap.config.api].map.positionClickDot(to);
      
      if (NPMap[NPMap.config.api].map.isLatLngWithinMapBounds(NPMap[NPMap.config.api].map.getClickDotLatLng()) === true) {
        position();
      } else {
        // TODO: This should only hide if 'parent' is 'page'. Right now, however, the baseApi code doesn't support negative positioning of #npmap-clickdot.
        me.hide();
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
     */
    show: function(content, title, footer, actions, styles, target) {
      var bottomHeight,
          footerHeight,
          hasFooterContent = false,
          me = this,
          mH;
      
      if (target) {
        NPMap.bing.map.positionClickDot(target);
        
        if (typeof target === 'string') {
          NPMap.InfoBox.latLng = target;
        } else {
          NPMap.InfoBox.latLng = NPMap.Map.getMarkerLatLng(target);
          NPMap.InfoBox.marker = target;
        }
      }

      NPMap.Map.hideTip();
      $('#npmap-infobox-content-wrapper').css({
        height: 'auto',
        width: design === 'basic' ? '250px' : '381px'
      });
      $('#npmap-infobox-footer').hide();
      $('#npmap-infobox-title').html(title);
      
      actions = actions || [];
      
      me.actions = [];
      
      if (config.skipActions) {
        actions = [];
      } else {
        if (actions.length > 0) {
          var add = [],
              remove = [];
          
          $.each(actions, function(i, v) {
            if (typeof v === 'string') {
              switch (v) {
                case 'zoomable':
                  if (NPMap.config.api != 'modestmaps') {
                    var max = NPMap[NPMap.config.api].map.getMaxZoom();
  
                    if (NPMap[NPMap.config.api].map.getZoom() < max) {
                      add.push({
                        handler: function() {
                          //NPMap.InfoBox.removeAction(this);
                          NPMap.Map.centerAndZoom(me.latLng, max);
                        },
                        text: 'Zoom to this location'
                      });
                    }
                  }

                  remove.push(i);
  
                  break;
              };
            }
          });
          $.each(remove, function(i, v) {
            actions.remove(v);
          });
          $.each(add, function(i, v) {
            actions.push(v);
          });
        }
        
        if (NPMap.config.modules) {
          $.each(NPMap.config.modules, function(i, v) {
            switch (v.name) {
              case 'route':
                var address = null,
	                config = v,
	                latLngSplit = me.latLng.split(','),
	                lat = parseFloat(latLngSplit[0]).toFixed(5),
	                lng = parseFloat(latLngSplit[1]).toFixed(5),
	                titleNoHtml = ($.trim(NPMap.utils.stripHtmlFromString(title))).replace(/'/g, '{singlequote}');
	              
	            if (this.marker && this.marker.data) {
	              if (this.marker.data['address']) {
	                address = this.marker.data['address'];
	              } else if (this.marker.data['Address']) {
	                address = this.marker.data['Address'];
	              } else if (config.addressAttribute && this.marker.data[config.addressAttribute]) {
	                address = this.marker.data[config.addressAttribute];
	              }
	            }
	            
	            address = address || null;
	            
	            if (config.mode === 'multi') {
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
                
                break;
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
  
          $.each(actions, function(i, v) {
            var h = '<a href="javascript:void(0)"';

            if (v.text.indexOf('Back') === 0) {
              h += ' class="back"';
            }
  
            h += ' onclick="NPMap.InfoBox.actions[' + i + '].handler();return false;">' + v.text + '</a>';
  
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
          this.marker.oldIconUrl = NPMap[NPMap.config.api].map.getMarkerIcon(this.marker);
          NPMap[NPMap.config.api].map.setMarkerIcon(this.marker, this.marker.highlightIconUrl);
        }
      } else if (!this.latLng) {
        this.latLng = NPMap[NPMap.config.api].map.latLngToString(NPMap[NPMap.config.api].map.getClickDotLatLng());
      }
      
      if (footer) {
        if (actions.length > 0) {
          $.each(actions, function(i, v) {
            footer += v + '<br>';
          });
          
          footer = footer.slice(0, footer.length - 4);
        }
        
        $('#npmap-infobox-footer').html('<div style="text-align:left;">' + footer + '</div>').show();
        hasFooterContent = true;
      } else {
        if (actions.length > 0) {
          var h = '';

          $.each(actions, function(i, v) {
            h += v + '<br>';
          });

          h = h.slice(0, h.length - 4);
          
          $('#npmap-infobox-footer').html('<div style="text-align:left;">' + h + '</div>').show();
          hasFooterContent = true;
        } else {
          $('#npmap-infobox-footer').hide();
          hasFooterContent = true;
        }
      }
      
      bottomHeight = $('#npmap-infobox-bottom').outerHeight();
      footerHeight = (function() {
        if (hasFooterContent) {
          return $('#npmap-infobox-footer').outerHeight();
        } else {
          return 0;
        }
      })();
      mH = maxHeight - $('#npmap-infobox-title').outerHeight() - bottomHeight;

      if (padding < (bottomHeight + footerHeight)) {
        padding = bottomHeight + footerHeight;
      }
      
      mH = mH - padding;
      
      // TODO: Animate the height and width resize of the InfoBox, if it is visible.
      $('#npmap-infobox-content-wrapper').css({
        maxHeight: mH + 'px',
        maxWidth: maxWidth + 'px'
      });
      $('#npmap-infobox-content').html(content);
      
      try {
        // TODO: You should only scroll to top if "more info". This is more complicated than you might think, though, because you'll need to preserve the scrollTop of the "clustered" contents and then restore it on "back".
        $('#npmap-infobox-content-wrapper').scrollLeft(0).scrollTop(0);
      } catch(e) {
      
      }

      $('#npmap-infobox img').each(function(i, v) {
        resizeImageForContent(v, mH, maxWidth);
      });
      $('#npmap-infobox object').each(function(i, v) {
        resizeImageForContent(v, mH, maxWidth);
      });

      if (this.visible) {
        position(function() {
          if (panActivated && !skipBoundsCheck) {
            checkBounds();
          }
        });
      } else {
        this.visible = true;
        
        position(function() {
          $('#npmap-infobox').show();
          NPMap.Event.trigger('InfoBox', 'show');

          if (panActivated && !skipBoundsCheck) {
            checkBounds();
          }
        });
      }
    }
  };
});