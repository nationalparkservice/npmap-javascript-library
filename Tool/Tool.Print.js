define([
  'Event',
  'Map/Map',
  'Tool/Tool'
],function(Event, Map, Tool) {
  var
      //
      _config = NPMap.config._tools.print,
      //
      _tool = document.createElement('li');

  Tool._addToToolbar(_tool, function() {
    var button = document.createElement('button');
    button.innerHTML = '<span class="npmap-toolbar-print"><span class="hide">Print the Map</span></span>';
    _tool.appendChild(button);
    bean.add(button, 'click', function() {
      if (typeof _config === 'function') {
        _config();
      } else if (typeof _config === 'string') {
        // TODO: Implement.
      }
    });
  });

  return NPMap.Tool.Print = {
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
      return NPMap.config.tools.print;
    }
  };
});