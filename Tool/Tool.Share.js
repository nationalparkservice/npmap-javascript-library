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

  /*
  function buildString(obj) {
    var c = '',
        i = 0;

    _.each(obj, function(value, key, list) {
      if (obj.hasOwnProperty(key)) {
        var text;

        switch (typeof value) {
          case 'boolean':
            text = key + ':' + value;
            break;
          case 'function':
            break;
          case 'number':
            text = key + ':' + value;
            break;
          case 'object':
            text = key + ':' + '{' + buildString(value) + '}';
            break;
          case 'string':
            text = key + ':\'' + value + '\'';
            break;
        }

        if (text) {
          if (i) {
            c += ',';
          }

          c += text;
        }

        i++;
      }
    });

    return c;
  }
  */

  _tool.id = 'npmap-toolbar-share';

  Tool._addToToolbar(_tool, function() {
    var button = document.createElement('button');
    button.className = 'npmap-toolbar-share';
    _tool.appendChild(button);
    bean.add(button, 'click', function() {
      alert('The share tool has not yet been implemented.');

      /*
       TODO #1: Move this into its own module and lazy-load it.

       b = visible base layer, taken from NPMap.config.baseLayers
       ac = active center lat/lng
       az = active zoom
       l = visible layers, taken from NPMap.config.layers
       oc = original center lat/lng, taken from NPMap.config.center
       oz = original zoom, taken from NPMap.config.zoom
       t = title

       TODO: Add some tools: keyboard, zoombox, scalebar, overviewmap, navigation, etc.
             Also add some modules?
      */

      /*
      var c = '{' + buildString(NPMap.config) + '}',
          ll = NPMap.Map.getCenter();

      //console.log(c);
      //console.log(eval('(' + c + ')'));

      window.open('http://maps.nps.gov/print.html?c=' + Util.encodeBase64(c) + '&l=' + ll.lat + ',' + ll.lng + (typeof configTools.print.title === 'string' ? '&t=' + configTools.print.title : '') + '&z=' + NPMap.Map.getZoom());
      */
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