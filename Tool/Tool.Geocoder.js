define([
  'Event',
  'Map/Map',
  'Tool/Tool',
  'Util/Util.Geocode'
],function(Event, Map, Tool, UtilGeocoder) {
  var
      //
      _config = NPMap.config._tools.geocoder,
      //
      _form = document.createElement('form');

  function _geocode(e) {
    var query = document.getElementById('npmap-geocoder-input').value;

    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (query.length > 1) {
      UtilGeocoder.geocode(query, function(response) {
        if (response.success) {
          if (response.message) {
            NPMap.Map.notify(response.message, null, 'info');
          } else {
            var bounds = response[0].boundingbox;

            NPMap.Map.toBounds({
              e: bounds[3],
              n: bounds[1],
              s: bounds[0],
              w: bounds[2]
            });
          }
        } else {
          NPMap.Map.notify(response.message, null, 'error');
        }
      });
    } else {
      document.getElementById('npmap-geocoder-input').focus();
    }

    if (e) {
      return false;
    }
  }

  // TODO: Shouldn't this attribution be stored here with the tool?
  Map._attribution.push('&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1-0/">ODbL 1.0</a>.');
  Map._geocodeOnFocus = function() {
    //console.log('Load NPS geocode JSON here...');
    document.getElementById('npmap-geocoder-input').onfocus = null;
    delete Map._geocodeOnFocus;
  };

  _form.id = 'npmap-geocoder';
  _form.innerHTML = '<button id="npmap-geocoder-button" class="npmap-search-button"><i class="icon-search"></i></button><input id="npmap-geocoder-input" type="text" placeholder="Find a Location" class="search" onfocus="NPMap.Map._geocodeOnFocus();return false;">';
  _form.style.cssText = 'left:87px;position:absolute;top:30px;z-index:30;';

  Tool._add(_form, function() {
    if (_form.attachEvent) {
      _form.attachEvent('submit', _geocode);
    } else {
      _form.addEventListener('submit', _geocode);
    }
  });

  return NPMap.Tool.Geocoder = {
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
      return NPMap.config.tools.geocoder;
    }
  };
});