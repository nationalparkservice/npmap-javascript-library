define([
  'Event',
  'Map/Map'
], function(Event, Map) {
  var
      //
      _config = NPMap.config._tools,
      //
      _divMap = document.getElementById(NPMap.config._div),
      //
      _divNpmap = document.getElementById('npmap'),
      //
      _divToolbar;

  return NPMap.Tool = {
    /**
     *
     */
    _add: function(el, callback) {
      function add() {
        Map.addControl(el, callback);
      }

      if (Map._isReady === true) {
        add();
      } else {
        Event.add('NPMap.Map', 'ready', add);
      }
    },
    /**
     *
     */
    _addToToolbar: function(el, callback) {
      var tools = document.getElementById('npmap-tools');

      if (!tools) {
        var toolbar = document.createElement('div');

        toolbar.id = 'npmap-toolbar';
        toolbar.innerHTML = '<ul id="npmap-tools"></ul>';
        _divMap.style.top = '28px';
        _divNpmap.insertBefore(toolbar, _divMap);
        tools = document.getElementById('npmap-tools');
      }

      tools.appendChild(el);

      if (callback) {
        callback();
      }
    }
  };
});