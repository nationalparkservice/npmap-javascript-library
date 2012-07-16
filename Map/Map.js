define([
  'InfoBox'
], function(InfoBox) {
  var
      // The jQuery map div object.
      $mapDiv = $('#npmap-map'),
      // The jQuery map div parent object.
      $mapDivParent = $mapDiv.parent(),
      // Is the map in fullscreen mode?
      isFullScreen = false,
      // The zoom level to scale in meters.
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
  /**
   * Sets the width of the attribution control based on the width of the map and logos and positions it.
   */
  function setAttributionMaxWidthAndPosition() {
    var divOverviewMap = document.getElementById('npmap-overviewmap'),
        max = $mapDiv.width() - $('#npmap-logos').outerWidth() - 40,
        right = 0;
    
    if (divOverviewMap) {
      max = max - $('#npmap-overviewmap').outerWidth();
      right = $('#npmap-overviewmap').outerWidth();
    }
    
    $('#npmap-attribution').css({
      'right': right + 'px',
      'max-width': max + 'px'
    });
  }
  
  // Hook up the resize event on the map div.
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
    // An array of event handler objects that have been added to this class.
    _events: [],
    /**
     * Initializes the construction of the NPMap.Map class. This is called by the baseApi map object after its map is created and should never be called manually.
     */
    _init: function() {
      var
          // The jQuery map div.
          $map,
          // The attribution control div.
          attribution = document.createElement('div'),
          // An array of "setup" callback functions.
          callbacks = [],
          // The "clickdot" div.
          clickdot = document.createElement('div'),
          // An array of elements to add to the map div.
          elements = [],
          // HTML for the logos div.
          logosHtml = '',
          // Self-reference.
          me = this,
          // The config object for NPMap's modules.
          modulesConfig = NPMap.config.modules || null,
          // The notify div.
          notify = document.createElement('div'),
          // The progress div.
          progress = document.createElement('div'),
          // The tip div.
          tip = document.createElement('div'),
          // The config object for NPMap's tools. Supports legacy config information too.
          toolsConfig = (function() {
            if (NPMap.config.tools) {
              return {
                fullscreen: NPMap.config.tools.fullscreen || false,
                navigation: NPMap.config.tools.navigation || {
                  pan: NPMap.config.tools.pan || 'home',
                  position: 'top left',
                  zoom: NPMap.config.tools.zoom || 'small'
                },
                overview: NPMap.config.tools.overview || false,
                print: NPMap.config.tools.print || false,
                share: NPMap.config.tools.share || false
              };
            } else if (typeof NPMap.config.tools === 'undefined') {
              return {
                fullscreen: false,
                navigation: {
                  pan: 'home',
                  position: 'top left',
                  zoom: 'small'
                },
                overview: false,
                print: false,
                share: false
              };
            } else {
              return {};
            }
          })();

      // Hooks up a navigation control.
      function hookUpNavigationControl(id, handler) {
        var el = document.getElementById(id);
        
        bean.add(el, 'mousedown dblclick', function(e) {
          e.stop();
        });
        bean.add(el, 'click', function(e) {
          e.stop();
          handler();
        });
        
        return el;
      }

      if (NPMap.config.api === 'bing') {
        $map = $(document.getElementById('npmap-map').getElementsByTagName('div')[0]);
      } else {
        $map = $('#npmap-map');
      }

      $map.bind('contextmenu', function(e) {
        return false;
      });

      attribution.id = 'npmap-attribution';
      elements.push(attribution);
      clickdot.id = 'npmap-clickdot';
      elements.push(clickdot);
      notify.id = 'npmap-notify';
      elements.push(notify);
      progress.id = 'npmap-progressbar';
      progress.innerHTML = '<div></div>';
      elements.push(progress);
      tip.className = 'padded rounded shadowed transparent';
      tip.id = 'npmap-tip';
      elements.push(tip);
      
      if (NPMap.config.api !== 'leaflet' && NPMap.config.api !== 'modestmaps') {
        logosHtml += '<span style="display:block;float:left;margin-right:8px;"><img src="' + NPMap.config.server + '/resources/img/' + NPMap.config.api + 'logo.png" /></span>';
      }
      
      if (!NPMap.config.hideNpmapLogo) {
        logosHtml += '<span style="display:block;float:right;"><a href="http://www.nps.gov/npmap" target="_blank"><img src="' + NPMap.config.server + '/resources/img/npmaplogo.png" alt="NPMap - Web Mapping for the U.S. National Park Service" /></a></span>';
      }

      if (logosHtml.length > 0) {
        // The logo div.
        var logos = document.createElement('div');
        
        logos.id = 'npmap-logos';
        logos.innerHTML = logosHtml;
        logos.style.cssText = 'bottom:3px;height:30px;left:5px;position:absolute;z-index:30;';
        elements.push(logos);
        callbacks.push(function() {
          $('#npmap-logos').resize(setAttributionMaxWidthAndPosition);
        });
      }

      if (toolsConfig.navigation) {
        var
            // The navigation controls div.
            navigation = document.createElement('div'),
            // HTML string for the navigation div.
            navigationHtml = '',
            // The position string for the navigation tools.
            position = toolsConfig.navigation.position.split(' ');
            
        if (toolsConfig.navigation.pan) {
          var compass = toolsConfig.navigation.pan;

          navigation.style.width = '58px';

          navigationHtml += '<div id="npmap-navigation-compass" class="npmap-navigation-compass-' + compass + '"><a id="npmap-navigation-compass-east" class="pointer"></a><a id="npmap-navigation-compass-north" class="pointer"></a><a id="npmap-navigation-compass-south" class="pointer"></a><a id="npmap-navigation-compass-west" class="pointer"></a>';
          
          if (compass === 'home') {
            navigationHtml += '<a id="npmap-navigation-compass-center" class="pointer"></a>';
          }
          
          navigationHtml += '</div>';

          callbacks.push(function() {
            var buttons = [];

            buttons.push(hookUpNavigationControl('npmap-navigation-compass-east', function() {
              NPMap.Map.panInDirection('east');
            }));
            buttons.push(hookUpNavigationControl('npmap-navigation-compass-north', function() {
              NPMap.Map.panInDirection('north');
            }));
            buttons.push(hookUpNavigationControl('npmap-navigation-compass-south', function() {
              NPMap.Map.panInDirection('south');
            }));
            buttons.push(hookUpNavigationControl('npmap-navigation-compass-west', function() {
              NPMap.Map.panInDirection('west');
            }));
            
            if (compass === 'home') {
              hookUpNavigationControl('npmap-navigation-compass-center', function() {
                me.toInitialExtent();
              });
            }
            
            for (var i = 0; i < buttons.length; i++) {
              var button = buttons[i],
                  compassEl = document.getElementById('npmap-navigation-compass');
                  
              button.direction = button.id.split('-')[3];
              
              bean.add(button, 'mouseenter', function(e) {
                compassEl.className = compassEl.className.replace('npmap-navigation-compass-' + compass, ' npmap-navigation-compass-' + compass + '-' + this.direction + '-over');
              });
              bean.add(button, 'mouseleave', function(e) {
                compassEl.className = compassEl.className.replace(' npmap-navigation-compass-' + compass + '-' + this.direction + '-over', 'npmap-navigation-compass-' + compass);
              });
            }
          });
        }
        
        if (toolsConfig.navigation.zoom === 'small') {
          navigationHtml += '<div id="npmap-navigation-small-zoom" class="npmap-navigation-small-zoom"';
          
          if (typeof toolsConfig.navigation.pan !== 'undefined') {
            navigationHtml += ' style="margin-left:17px;margin-top:5px;"';
          }
          
          navigationHtml += '><a id="npmap-navigation-small-zoom-in" class="pointer"></a><a id="npmap-navigation-small-zoom-out" class="pointer"></a></div>';

          callbacks.push(function() {
            var buttons = [];
          
            buttons.push(hookUpNavigationControl('npmap-navigation-small-zoom-in', function() {
              NPMap.Map.zoomIn();
            }));
            buttons.push(hookUpNavigationControl('npmap-navigation-small-zoom-out', function() {
              NPMap.Map.zoomOut();
            }));
            
            for (var i = 0; i < buttons.length; i++) {
              var button = buttons[i];
              
              button.inOrOut = button.id.split('-')[4];
              
              bean.add(button, 'mouseenter', function(e) {
                $('#npmap-navigation-small-zoom').removeClass('npmap-navigation-small-zoom').addClass('npmap-navigation-small-zoom-' + this.inOrOut + '-over');
              });
              bean.add(button, 'mouseleave', function(e) {
                $('#npmap-navigation-small-zoom').removeClass('npmap-navigation-small-zoom-' + this.inOrOut + '-over').addClass('npmap-navigation-small-zoom');
              });
            }
          });
        }

        if (position[0] === 'bottom') {
          navigation.style.bottom = '15px';
        } else {
          navigation.style.top = '15px';
        }
        
        if (position[1]) {
          if (position[1] === 'left') {
            navigation.style.left = '15px';
          } else {
            navigation.style.right = '15px';
          }
        }

        navigation.id = 'npmap-navigation';
        navigation.innerHTML = navigationHtml;
        navigation.style.position = 'absolute';
        navigation.style.zIndex = '30';
        elements.push(navigation);
      }
      
      if (toolsConfig.fullscreen || toolsConfig.print || toolsConfig.share) {
        var html = '<ul id="npmap-tools">',
            toolbar = document.createElement('div');

        if (toolsConfig.print) {
          html += '<li id="npmap-toolbar-print"><div class="npmap-toolbar-print"></div></li>';

          callbacks.push(function() {
            
          });
        }

        if (toolsConfig.share) {
          html += '<li id="npmap-toolbar-share"><div class="npmap-toolbar-share"></div></li>';

          callbacks.push(function() {
            
          });
        }

        if (toolsConfig.fullscreen) {
          html += '<li id="npmap-toolbar-fullscreen"><div class="npmap-toolbar-fullscreen"></div></li>';

          callbacks.push(function() {
            hookUpClickEvent('npmap-toolbar-fullscreen', function() {
              NPMap.Map.toggleFullScreen();
            });
          });
        }
        
        toolbar.innerHTML = html + '</ul>';
        toolbar.id = 'npmap-toolbar';
        
        document.getElementById('npmap-map').style.top = '28px';
        document.getElementById('npmap').insertBefore(toolbar, document.getElementById('npmap-map'));
      }

      if (NPMap.config.modules && NPMap.config.modules.length > 0) {
        var count = 0;

        for (var i = 0; i < NPMap.config.modules.length; i++) {
          var name = NPMap.config.modules[i].name.toLowerCase();

          if (name !== 'edit' && name !== 'route') {
            count++;
          }
        }

        if (count > 0) {
          var modules = document.createElement('div'),
              modulesHtml = '',
              tabs = document.createElement('div'),
              tabsHtml = '';

          for (var j = 0; j < NPMap.config.modules.length; j++) {
            var module = NPMap.config.modules[j],
                nameLower = module.name.toLowerCase();

            if (nameLower !== 'edit' && nameLower !== 'route') {
              modulesHtml += '<div id="npmap-modules-' + nameLower + '">Test</div>';
              tabsHtml += '<div id="npmap-module-tab-' + nameLower + '" class="npmap-module-tab" onclick="NPMap.Map.handleModuleTabClick(this);return false;"><div class="npmap-module-tab-' + nameLower + '"></div></div>';
            }
          }

          modules.id = 'npmap-modules';
          modules.innerHTML = '<div id="npmap-modules-close" class="npmap-module-tab" style="position:absolute;right:-29px;top:' + (document.getElementById('npmap-toolbar') ? '45px' : '15px') + ';z-index:1;" onclick="NPMap.Map.handleModuleCloseClick();return false;"><div class="npmap-module-tab-close"></div></div>';
          tabs.id = 'npmap-modules-tabs';
          tabs.innerHTML = tabsHtml;
          
          callbacks.push(function() {
            // Hook up tab click events here.
          });
          elements.push(tabs);

          document.getElementById('npmap').insertBefore(modules, document.getElementById('npmap-map'));
        }
      }

      // TODO: This is currently Bing specific.
      if ((toolsConfig.overviewMap || toolsConfig.overview) && NPMap.config.api === 'bing') {
        var overview = document.createElement('div');

        overview.id = 'npmap-overview';
        overview.innerHTML = '<div id="npmap-overview-title" style="color:#454545;display:none;padding:8px;position:absolute;">Overview Map</div><div id="npmap-overview-map" style="bottom:0px;left:0px;position:absolute;right:0px;top:0px;"></div>';
        overview.style.bottom = $('#npmap-attribution').outerHeight() + 'px';
        
        elements.push(overview);
        callbacks.push(function() {
          var overviewMap = new Microsoft.Maps.Map(document.getElementById('npmap-overviewmap-map'), {
            credentials: NPMap.config.credentials ? NPMap.config.credentials : 'AqZQwVLETcXEgQET2dUEQIFcN0kDsUrbY8sRKXQE6dTkhCDw9v8H_CY8XRfZddZm',
            disablePanning: true,
            disableZooming: true,
            fixedMapPosition: true,
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            showBreadcrumb: false,
            showCopyright: false,
            showDashboard: false,
            showLogo: false,
            showMapTypeSelector: false,
            showScalebar: false
          });

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
            
            if ($('#npmap-overview-button').hasClass('expanded')) {
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

          cancelMouseEvents($('#npmap-overview'));
        
          $('<div id="npmap-overview-button" class="npmap-overview-open cursor" style="position:absolute;"></div>').appendTo('#npmap-overview-map').click(function() {
            var $overview = $('#npmap-overview'),
                $this = $(this),
                $title = $('#npmap-overview-title');
            
            if ($this.hasClass('expanded')) {
              $title.hide();
              $('#npmap-overview-map').css({
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
              $this.removeClass('npmap-overview-close').removeClass('npmap-overview-close-over').removeClass('expanded').addClass('npmap-overview-open');
              overviewMap.entities.clear();
            } else {
              $title.show();
              $('#npmap-overview-map').css({
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
              $this.removeClass('npmap-overview-open').removeClass('npmap-overview-open-over').addClass('npmap-overview-close').addClass('expanded');
            }
          }).mouseover(function() {
            var $this = $(this);
            
            if ($this.hasClass('expanded')) {
              $this.removeClass('npmap-overview-close').addClass('npmap-overview-close-over');
            } else {
              $this.removeClass('npmap-overview-open').addClass('npmap-overview-open-over');
            }
          }).mouseout(function() {
            var $this = $(this);
            
            if ($this.hasClass('expanded')) {
              $this.removeClass('npmap-overview-close-over').addClass('npmap-overview-close');
            } else {
              $this.removeClass('npmap-overview-open-over').addClass('npmap-overview-open');
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
        });
      }

      if (NPMap.config.baseLayers && NPMap.config.baseLayers.length > 1) {
        var
            // The switcher div.
            switcher = document.createElement('div'),
            // The switcher menu div.
            switcherMenu = document.createElement('div');

        // TODO: Write this yourself.
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
        callbacks.push(function() {
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
            var icon = NPMap.config.server + '/resources/tools/switcher/aerial-large.png', // TODO: Specify generic icon url.
                label = baseLayer.code,
                match = NPMap.Map[NPMap.config.api].matchBaseLayer(baseLayer),
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
                  
                  icon = NPMap.config.server + '/resources/tools/switcher/aerial-large.png';
                  
                  break;
                case 'NPS':
                  if (!label) {
                    label = 'NPS View';
                  }
                  
                  icon = NPMap.config.server + '/resources/tools/switcher/nps-large.png';
                  
                  break;
                case 'Street':
                  if (!label) {
                    label = 'Street View';
                  }
                  
                  icon = NPMap.config.server + '/resources/tools/switcher/street-large.png';
                  
                  break;
                case 'Topo':
                  if (!label) {
                    label = 'Topo View';
                  }
                  
                  icon = NPMap.config.server + '/resources/tools/switcher/topo-large.png';
                  
                  break;
              }
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
            NPMap.Map[NPMap.config.api].switchBaseLayer(data.baseLayer);
          });
        });
      }
      
      this.addElementsToMapDiv(elements, function() {
        if (callbacks.length > 0) {
          for (var i = 0; i < callbacks.length; i++) {
            callbacks[i]();
          }
        }

        setAttributionMaxWidthAndPosition();
        $('#npmap-tip').css({
          display: 'none',
          maxWidth: '200px',
          position: 'absolute',
          zIndex: 32
        });
        
        NPMap.Util.safeLoad('NPMap.' + NPMap.config.api + '.map.Map', function() {
          NPMap.Event.trigger('NPMap.Map', 'ready', NPMap.Map[NPMap.config.api].Map);
        });
      });
    },
    /**
     * Adds an HTML element to the map div.
     * @param {Object} el
     * @param {Function} callback (Optional)
     */
    addElementToMapDiv: function(el, callback) {
      if (NPMap.config.api === 'bing') {
        NPMap.Map.Bing.addElementToMapDiv(el);
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
        NPMap.Util.safeLoad('NPMap.bing', function() {
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
      NPMap.Map[NPMap.config.api].addShape(shape);
    },
    /**
     * Adds a tile layer to the map.
     * @param {Object} layer
     */
    addTileLayer: function(layer) {
      NPMap.Map[NPMap.config.api].addTileLayer(layer);
    },
    /**
     * Converts an API bounds to a NPMap bounds.
     * @param {Object} bounds
     * @return {Object}
     */
    boundsFromApi: function(bounds) {
      return NPMap.Map[NPMap.config.api].boundsFromApi(bounds);
    },
    /**
     * Converts a NPMap bounds to an API bounds.
     * @param {Object}
     * @return {Object}
     */
    boundsToApi: function(bounds) {
      return NPMap.Map[NPMap.config.api].boundsToApi(bounds);
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
     * Centers then zooms the map.
     * @param {String} latLng The latLng string, in "latitude,longitude" format, to center the map on.
     */
    center: function(latLng) {
      NPMap.Map[NPMap.config.api].center(NPMap.Map[NPMap.config.api].latLngToApi(latLng));
    },
    /**
     * Centers then zooms the map.
     * @param {String} latLng The latLng string, in "latitude,longitude" format, to center the map on.
     * @param {Integer} zoom The zoom level to zoom the map to.
     * @param {Function} callback (Optional) A callback function to call after the map has been centered and zoomed.
     */
    centerAndZoom: function(latLng, zoom, callback) {
      NPMap.Map[NPMap.config.api].centerAndZoom(NPMap.Map[NPMap.config.api].latLngToApi(latLng), zoom, callback);
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
        apiLatLngs.push(me.latLngToApi(v));
      });
      
      return NPMap.Map[NPMap.config.api].createLine(apiLatLngs, options, data, clickHandler);
    },
    /**
     * Creates a marker using the baseApi's marker class, if it exists.
     * @param {String} latLng The latitude/longitude string, in "latitude,longitude" format, to use to create the marker.
     * @param {Object} options (Optional) baseApi-specific marker options.
     * @param {Object} data (Optional)
     * @param {Function} clickHandler (Optional)
     */
    createMarker: function(latLng, options, data, clickHandler) {
      options = (function() {
        // Current valid NPMap options: height (Bing), icon (Bing/Google), and width (Bing).
        var o;

        if (options) {
          if (!options.icon) {
            options.height = 13;
            options.icon = NPMap.config.server + '/resources/markers/nps_round_13.png';
            options.width = 13;
          }

          o = NPMap.Map[NPMap.config.api].convertMarkerOptions(options);
        } else {
          o = NPMap.Map[NPMap.config.api].convertMarkerOptions({
            height: 13,
            icon: NPMap.config.server + '/resources/markers/nps_round_13.png',
            width: 13
          });
        }

        return o;
      })();

      return NPMap.Map[NPMap.config.api].createMarker(this.latLngToApi(latLng), options, data, clickHandler);
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
      var apiLatLngs = [],
          me = this;

      for (var i = 0; i < latLngs.length; i++) {
        apiLatLngs.push(me.latLngToApi(latLngs[i]));
      }
      
      return NPMap.Map[NPMap.config.api].createPolygon(apiLatLngs, options);
    },
    /**
     * Gets the active layer types for both baseLayers and layers.
     * @return {Array}
     */
    getActiveLayerTypes: function() {
      var types = [];
      
      if (NPMap.config.baseLayers) {
        for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
          var baseLayer = NPMap.config.baseLayers[i],
              baseLayerType = baseLayer.type;

          if ((typeof baseLayer.visible === 'undefined' || baseLayer.visible === true) && _.indexOf(types, baseLayerType) === -1) {
            types.push(baseLayerType);
          }
        }
      }

      if (NPMap.config.layers) {
        for (var j = 0; j < NPMap.config.layers.length; j++) {
          var layer = NPMap.config.layers[j],
              layerType = layer.type;

          if ((typeof layer.visible === 'undefined' || layer.visible === true) && _.indexOf(types, layerType) === -1) {
            types.push(layerType);
          }
        }
      }

      return types;
    },
    /**
     *
     */
    getBounds: function() {
      return this.boundsFromApi(NPMap.Map[NPMap.config.api].getBounds());
    },
    /**
     * Gets the center of the map.
     * @return {String}
     */
    getCenter: function() {
      return this.latLngFromApi(NPMap.Map[NPMap.config.api].getCenter());
    },
    /**
     * Gets the container div.
     */
    getContainerDiv: function() {
      return NPMap.Map[NPMap.config.api].getContainerDiv();
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
      return this.latLngFromApi(NPMap.Map[NPMap.config.api].getMarkerLatLng(marker));
    },
    /**
     * Gets a marker option.
     * @param {Object} marker The baseApi marker object.
     * @param {String} option The option to get. Currently the valid options are: 'icon'.
     */
    getMarkerOption: function(marker, option) {
      return NPMap.Map[NPMap.config.api].getMarkerOption(marker, option);
    },
    /**
     * Gets the visibility property of a marker.
     * @param {Object} marker The marker to check the visibility for.
     */
    getMarkerVisibility: function(marker) {
      return NPMap.Map[NPMap.config.api].getMarkerVisibility(marker);
    },
    /**
     * Gets the maximum zoom level for this map.
     * @return {Number}
     */
    getMaxZoom: function() {
      return NPMap.Map[NPMap.config.api].getMaxZoom();
    },
    /**
     * Gets the minimum zoom level for this map.
     * @return {Number}
     */
    getMinZoom: function() {
      return NPMap.Map[NPMap.config.api].getMinZoom();
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
      return NPMap.Map[NPMap.config.api].getZoom();
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     */
    handleResize: function() {
      if (typeof NPMap.Map[NPMap.config.api] !== 'undefined') {
        NPMap.Map[NPMap.config.api].handleResize();
      }
      
      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.reposition();
      }
    },
    /**
     * Checks to see if a clustered layer has been added to the map.
     * @return {Boolean}
     */
    hasClusteredLayer: function() {
      hasClustered = false;
      
      if (NPMap.config.layers) {
        for (var i = 0; i < NPMap.config.layers.length; i++) {
          var layer = NPMap.config.layers[i];

          if (layer.type === 'NativeVectors' && layer.clustered === true) {
            hasClustered = true;
            break;
          }
        }
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
        for (var i = 0; i < NPMap.config.layers.length; i++) {
          var layer = NPMap.config.layers[i];

          if ((layer.type === 'NativeVectors' && layer.tiled) || (layer.type === 'ArcGisServerRest' || layer.type === 'TileStream')) {
            hasTiled = true;
            break;
          }
        }
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
      NPMap.Map[NPMap.config.api].hideShape(shape);
    },
    /**
     * Hides the tip.
     */
    hideTip: function() {
      document.getElementById('npmap-tip').style.display = 'none';
    },
    /**
     * Tests to see if a latLng is within the map's current bounds.
     * @param latLng {String} {Required} The latitude/longitude string, in "latitude,longitude" format, to test.
     * @return {Boolean}
     */
    isLatLngWithinMapBounds: function(latLng) {
      return NPMap.Map[NPMap.config.api].isLatLngWithinMapBounds(latLng);
    },
    /**
     * Tests the equivalency of two location strings.
     * @param {String} latLng1 The first latLng string.
     * @param {String} latLng2 The second latLng string.
     * @returns {Boolean}
     */
    latLngsAreEqual: function(latLng1, latLng2) {
      var areEqual = false;
          
      latLng1 = latLng1.split(',');
      latLng2 = latLng2.split(',');
      
      if ((parseFloat(latLng1[0]).toFixed(7) === parseFloat(latLng2[0]).toFixed(7)) && (parseFloat(latLng1[1]).toFixed(7) === parseFloat(latLng2[1]).toFixed(7))) {
        areEqual = true;
      }

      return areEqual;
    },
    /**
     * Converts a baseApi lat/lng object to a lat/lng string in "latitude/longitude" format.
     * @param {Object} latLng The lat/lng object.
     * @return {String}
     */
    latLngFromApi: function(latLng) {
      return NPMap.Map[NPMap.config.api].latLngFromApi(latLng);
    },
    /**
     * Converts a lat/lng string ("latitude/longitude") to a baseApi's latLng object.
     * @param {String} latLng The lat/lng string.
     * @return {Object}
     */
    latLngToApi: function(latLng) {
      return NPMap.Map[NPMap.config.api].latLngToApi(latLng);
    },
    /**
     * Turns meters into a zoom level. This function is not precise, as it is impossible to get precise meter scale values for the entire earth reprojected to web mercator. Only use this in cases where approximate numbers are acceptable.
     * @param {Number} meters
     * @return {Number}
     */
    metersToZoomLevel: function(meters) {
      var z;

      for (var i = 0; i < zoomScales.length; i++) {
        var zoom = zoomScales[i][0];
        
        if (meters >= zoomScales[i][1]) {
          if (zoomScales[i - 1]) {
            if (meters < zoomScales[i - 1][1]) {
              z = zoomScales[i + 1][0];
            }
          } else {
            z = zoom;
          }
        } else if (meters < zoomScales[zoomScales.length - 1][1]) {
          z = zoom;
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
      NPMap.Map[NPMap.config.api].panByPixels(pixels);
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
      }
    },
    /**
     * Removes a shape from the map.
     * @param {Object} shape The shape to remove from the map.
     */
    removeShape: function(shape) {
      NPMap.Map[NPMap.config.api].removeShape(shape);
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
     *
     */
    setBounds: function(bounds) {
      NPMap.Map[NPMap.config.api].setBounds(bounds);
    },
    /**
     * Sets the initial center of the map. This initial center is stored with the map, and is used by the setInitialExtent method, among other things.
     * @param {Object} c
     */
    setInitialCenter: function(center) {
      NPMap.Map[NPMap.config.api].setInitialCenter(this.latLngToApi(center));
    },
    /**
     * Sets the initial zoom of the map. This initial zoom is stored with the map, and is used by the setInitialExtent method, among other things.
     * @param {Number} zoom
     */
    setInitialZoom: function(zoom) {
      NPMap.Map[NPMap.config.api].setInitialZoom(zoom);
    },
    /**
     * Sets a marker's options.
     * @param {Object} marker The baseApi marker object.
     * @param {Object} options The options to set. Currently the valid options are: 'class', 'icon', 'label', 'visible', and 'zIndex'.
     */
    setMarkerOptions: function(marker, options) {
      NPMap.Map[NPMap.config.api].setMarkerOptions(marker, options);
    },
    /**
     * Sets the notify target to an HTML element other than the map div. This can only be called after NPMap has been initialized.
     * @param {Object} target
     */
    setNotifyTarget: function(target) {
      $('#npmap-notify').appendTo($(target));
    },
    /**
     *
     */
    setZoomRestrictions: function(restrictions) {
      NPMap.Map[NPMap.config.api].setZoomRestrictions(restrictions);
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
      NPMap.Map[NPMap.config.api].showShape(shape);
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
     * Toggles fullscreen mode on or off.
     */
    toggleFullScreen: function() {
      var baseApi = NPMap.Map[NPMap.config.api],
          currentCenter = baseApi.getCenter(),
          currentZoom = baseApi.getZoom(),
          el = document.getElementById('npmap');

      /*
      if (el.requestFullScreen || el.mozRequestFullScreen || el.webkitRequestFullScreen) {
        document.onfullscreenchange = function(e) {
          if (document.fullScreenElement || document.mozFullScreenElement || document.webkitFullScreenElement) {
            isFullScreen = true;
          } else {
            isFullScreen = false;
          }
        };

        if (isFullScreen) {
          if (el.cancelFullScreen) {
            el.cancelFullScreen();
          } else if (el.mozCancelFullScreen) {
            el.mozCancelFullScreen();
          } else {
            document.webkitCancelFullScreen();
          }

          isFullScreen = false;
        } else {
          if (el.requestFullScreen) {
            el.requestFullScreen();
          } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
          } else {
            el.webkitRequestFullScreen();
          }

          isFullScreen = true;
        }
      } else {
        */
        var $mask = $('#npmap-fullscreen-mask'),
            $window = $(window);
        
        if (NPMap.InfoBox.visible) {
          currentCenter = baseApi.latLngToApi(NPMap.InfoBox.latLng);
        }

        if (isFullScreen) {
          $('body').css({
            overflow: 'visible'
          });
          $mapDiv.removeClass('npmap-fullscreen-map').css({
            height: '100%',
            width: '100%'
          }).appendTo($mapDivParent);
          $mask.hide();
          
          isFullScreen = false;
          document.getElementById('npmap-infobox').style.zIndex = '999999';
        } else {
          if ($mask.length === 0) {
            var div = document.createElement('div');
            div.id = 'npmap-fullscreen-mask';
            document.body.appendChild(div);
            $mask = $('#npmap-fullscreen-mask');
          }
          
          $('body').css({
            overflow: 'hidden'
          });
          $mask.show();
          $mapDiv.addClass('npmap-fullscreen-map').css({
            height: $window.height() + 'px',
            width: $window.width() + 'px'
          }).appendTo($mask);
          
          isFullScreen = true;
          document.getElementById('npmap-infobox').style.zIndex = '99999999999999';
        }
      //}
      
      baseApi.handleResize(function() {
        baseApi.centerAndZoom(currentCenter, currentZoom);
      });
    },


    /*
    handleModuleCloseClick: function() {
      console.log(0);

      NPMap.Map.toggleModule('search', false);
    },
    handleModuleTabClick: function(el) {
      NPMap.Map.toggleModule(el.id.replace('npmap-module-tab-', ''), true);
    },
    */


    /**
     * Toggles a module on or off.
     * @param {String} module
     * @param {Boolean} on
     */
    toggleModule: function(module, on) {
      console.log(module);
      
      var $module = $('#npmap-modules-' + module),
          $modules = $('#npmap-modules');

      if (on) {
        $('#npmap-modules-tabs').hide();
        $module.show();
        $modules.show();
        $('#npmap-map').css({
          left: $modules.outerWidth() + 'px'
        });
        $('#npmap-toolbar').css({
          left: $modules.outerWidth() + 'px'
        });
      } else {
        console.log('here');

        $modules.hide();
        $('#npmap-map').css({
          left: '0'
        });
        $('#npmap-toolbar').css({
          left: '0'
        });
        $module.hide();
        $('#npmap-modules-tabs').show();
      }
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     */
    toInitialExtent: function() {
      NPMap.Map[NPMap.config.api].toInitialExtent();
    },
    /**
     * DEPRECATED: Updates a marker's icon.
     * @param {Object} marker A baseApi marker object.
     * @param {String} icon The url of the new icon.
     */
    updateMarkerIcon: function(marker, icon) {
      NPMap.Map[NPMap.config.api].updateMarkerIcon(marker, icon);
    },
    /**
     * DEPRECATED: Updates a marker's label.
     * @param {Object} marker A baseApi marker object.
     * @param {String} label The new label string.
     */
    updateMarkerLabel: function(marker, label) {
      NPMap.Map[NPMap.config.api].updateMarkerLabel(marker, label);
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
     * Zooms the map to a zoom level.
     * @param {Number} zoom
     */
    zoom: function(zoom) {
      NPMap.Map[NPMap.config.api].zoom(zoom);
    },
    /**
     * Zooms the map in by one zoom level.
     */
    zoomIn: function() {
      NPMap.Map[NPMap.config.api].zoomIn();
    },
    /**
     * Zooms the map out by one zoom level.
     */
    zoomOut: function() {
      NPMap.Map[NPMap.config.api].zoomOut();
    },
    /**
     * Zooms the map to a bounding box.
     * @param {Object} bbox A bbox object with nw and se lat/lng strings.
     */
    zoomToBoundingBox: function(bbox) {
      NPMap.Map[NPMap.config.api].zoomToBoundingBox({
        nw: NPMap.Map[NPMap.config.api].latLngToApi(bbox.nw),
        se: NPMap.Map[NPMap.config.api].latLngToApi(bbox.se)
      });
    },
    /**
     * Zooms the map to a lat/lng.
     * @param {String} latLng The lat/lng string, in "latitude,longitude" format, to zoom the map to.
     */
    zoomToLatLng: function(latLng) {
      NPMap.Map[NPMap.config.api].zoomToLatLng(this.latLngToApi(latLng));
    },
    /**
     * Zooms the map to the extent of an array of lat/lng strings.
     * @param {Array} latLngs The array of lat/lng strings.
     */
    zoomToLatLngs: function(latLngs) {
      var apiLatLngs = [],
          me = this;
      
      $.each(latLngs, function(i, latLng) {
        apiLatLngs.push(me.latLngToApi(latLng));
      });
      
      NPMap.Map[NPMap.config.api].zoomToLatLngs(apiLatLngs);
    },
    /**
     * Zooms the map to the extent of an array of marker objects.
     * @param {Array} markers The array of marker objects.
     */
    zoomToMarkers: function(markers) {
      NPMap.Map[NPMap.config.api].zoomToMarkers(markers);
    }
  };
});