define([
  'Event',
  'Map/Map',
  'Tool/Tool'
],function(Event, Map, Tool) {
  var
      //
      _config = NPMap.config._tools.navigation,
      // An array of callback functions.
      callbacksNavigation = [],
      // The navigation controls div.
      divNavigation = document.createElement('div'),
      // HTML string for the navigation div.
      navigationHtml = '',
      // The position string for the navigation tools.
      position = _config.position.split(' ');

  /**
   * Hooks mouseevents up to navigation controls.
   * @param {String} id
   * @param {Function} handler
   * @return {Object}
   */
  function hookUpNavigationControl(id, handler) {
    var el = document.getElementById(id);

    bean.add(el, 'dblclick mousedown mouseup', function(e) {
      e.stop();
    });
    bean.add(el, 'click', function(e) {
      e.stop();
      handler();
    });

    return el;
  }

  if (_config.pan) {
    var compass = _config.pan;

    divNavigation.style.width = '58px';

    navigationHtml += '<div id="npmap-navigation-compass" class="npmap-navigation-compass-' + compass + '"><a id="npmap-navigation-compass-east" class="pointer"></a><a id="npmap-navigation-compass-north" class="pointer"></a><a id="npmap-navigation-compass-south" class="pointer"></a><a id="npmap-navigation-compass-west" class="pointer"></a>';

    if (compass === 'home') {
      navigationHtml += '<a id="npmap-navigation-compass-center" class="pointer"></a>';
    }

    navigationHtml += '</div>';

    callbacksNavigation.push(function() {
      var buttons = [];

      buttons.push(hookUpNavigationControl('npmap-navigation-compass-east', function() {
        Map.panInDirection('east');
      }));
      buttons.push(hookUpNavigationControl('npmap-navigation-compass-north', function() {
        Map.panInDirection('north');
      }));
      buttons.push(hookUpNavigationControl('npmap-navigation-compass-south', function() {
        Map.panInDirection('south');
      }));
      buttons.push(hookUpNavigationControl('npmap-navigation-compass-west', function() {
        Map.panInDirection('west');
      }));

      if (compass === 'home') {
        hookUpNavigationControl('npmap-navigation-compass-center', function() {
          Map.toInitialExtent();
        });
      }

      _.each(buttons, function(button) {
        var elCompass = document.getElementById('npmap-navigation-compass');

        button.direction = button.id.split('-')[3];

        bean.add(button, 'mouseenter', function(e) {
          elCompass.className = elCompass.className.replace('npmap-navigation-compass-' + compass, ' npmap-navigation-compass-' + compass + '-' + this.direction + '-over');
        });
        bean.add(button, 'mouseleave', function(e) {
          elCompass.className = elCompass.className.replace(' npmap-navigation-compass-' + compass + '-' + this.direction + '-over', 'npmap-navigation-compass-' + compass);
        });
      });
    });
  }

  if (_config.zoom === 'small') {
    navigationHtml += '<div id="npmap-navigation-small-zoom" class="npmap-navigation-small-zoom"';

    if (typeof _config.pan !== 'undefined') {
      navigationHtml += ' style="margin-left:17px;margin-top:5px;"';
    }

    navigationHtml += '><a id="npmap-navigation-small-zoom-in" class="pointer"></a><a id="npmap-navigation-small-zoom-out" class="pointer"></a></div>';

    callbacksNavigation.push(function() {
      var buttons = [];

      buttons.push(hookUpNavigationControl('npmap-navigation-small-zoom-in', function() {
        Map.zoomIn();
      }));
      buttons.push(hookUpNavigationControl('npmap-navigation-small-zoom-out', function() {
        Map.zoomOut();
      }));

      _.each(buttons, function(button) {
        var divZoom = document.getElementById('npmap-navigation-small-zoom');

        button.inOrOut = button.id.split('-')[4];

        bean.add(button, 'mouseenter', function(e) {
          divZoom.className += '-' + this.inOrOut + '-over';
        });
        bean.add(button, 'mouseleave', function(e) {
          divZoom.className = divZoom.className.replace('-' + this.inOrOut + '-over', '');
        });
      });
    });
  }

  if (position[0] === 'bottom') {
    divNavigation.style.bottom = '15px';
  } else {
    divNavigation.style.top = '15px';
  }

  if (position[1]) {
    if (position[1] === 'left') {
      divNavigation.style.left = '15px';
    } else {
      divNavigation.style.right = '15px';
    }
  } else {
    divNavigation.style.left = '15px';
  }

  divNavigation.id = 'npmap-navigation';
  divNavigation.innerHTML = navigationHtml;
  divNavigation.style.position = 'absolute';
  divNavigation.style.zIndex = '30';

  Tool._add(divNavigation, function() {
    _.each(callbacksNavigation, function(callback) {
      callback();
    });
  });

  return NPMap.Tool.Navigation = {
    /**
     *
     */
    _getConfig: function() {
      return _config;
    },
    /**
     *
     */
    getConfig: function() {
      return NPMap.config.tools.navigation;
    }
  };
});