define([
  'Event',
  'Map/Map',
  'Tool/Tool'
],function(Event, Map, Tool) {
  var
      //
      _config = NPMap.config._tools.share,
      //
      _tool = document.createElement('li');

  _tool.id = 'npmap-toolbar-share';

  Tool._addToToolbar(_tool, function() {
    var button = document.createElement('button');
    button.className = 'npmap-toolbar-share';
    _tool.appendChild(button);
    bean.add(button, 'click', function() {
      alert('The share tool has not yet been implemented.');
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
      return NPMap.config.tools.share;
    }
  };
});