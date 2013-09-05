/* globals bean, define, NPMap */

define([
  'Event',
  'Map/Map',
  'Tool/Tool'
],function(Event, Map, Tool) {
  var
      //
      _config = NPMap.config._tools.fullscreen,
      //
      _tool = document.createElement('li');

  Tool._addToToolbar(_tool, function() {
    var button = document.createElement('button');
    button.className = 'minimized';
    button.innerHTML = '<span class="npmap-toolbar-fullscreen"><span class="hide">Enter/Exit Fullscreen Mode</span></span>';
    _tool.appendChild(button);
    bean.add(button, 'click', function() {
      var cancel = false,
          clsName = 'minimized';

      if (button.className.indexOf('minimized') === -1) {
        if (_config.events && _config.events.beforeminimize) {
          var stop = _config.events.beforeminimize();

          if (stop === false) {
            cancel = true;
          }
        }
      } else {
        if (_config.events && _config.events.beforemaximize) {
          var stop = _config.events.beforemaximize();

          if (stop === false) {
            cancel = true;
          }
        }

        clsName = 'maximized';
      }

      if (!cancel) {
        Map.toggleFullScreen();
      }

      button.className = clsName;
    });
  });

  return NPMap.Tool.Fullscreen = {
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
      return NPMap.config.tools.fullscreen;
    }
  };
});
