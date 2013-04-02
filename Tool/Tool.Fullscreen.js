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

  _tool.id = 'npmap-toolbar-fullscreen';

  Tool._addToToolbar(_tool, function() {
    var button = document.createElement('button');
    button.className = 'npmap-toolbar-fullscreen';
    _tool.appendChild(button);
    bean.add(button, 'click', Map.toggleFullScreen);
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