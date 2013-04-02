define([
  'Event',
  'Map/Map',
  'Tool/Tool'
],function(Event, Map, Tool) {
  var
      //
      _config = NPMap.config._tools.geocoder,
      //
      form = document.createElement('form');

  // TODO: Shouldn't this attribution be stored here with the tool?
  Map._attribution.push('&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1-0/">ODbL 1.0</a>.');
  Map._geocodeOnFocus = function() {
    console.log('Load NPS geocode JSON here...');
    document.getElementById('npmap-geocoder-input').onfocus = null;
    delete Map._geocodeOnFocus;
  };

  form.id = 'npmap-geocoder';
  form.innerHTML = '<button id="npmap-geocoder-button"><i class="icon-search"></i></button><input type="text" id="npmap-geocoder-input" placeholder="Find a Location" class="search" onfocus="NPMap.Map._geocodeOnFocus();return false;">';
  form.style.cssText = 'left:87px;position:absolute;top:30px;z-index:30;';

  Tool._add(form, function() {
    function geocode(e) {
      var query = document.getElementById('npmap-geocoder-input').value;

      if (e && e.preventDefault) {
        e.preventDefault();
      }

      if (query.length > 1) {
        reqwest({
          error: function(error) {
            NPMap.Map.notify('The location search failed, possibly because the Nominatim web service is unavailable.', null, 'error');
          },
          jsonpCallback: 'json_callback',
          success: function(response) {
            if (response && response.length && typeof response[0].boundingbox === 'object') {
              var bounds = response[0].boundingbox;

              NPMap.Map.toBounds({
                e: bounds[3],
                n: bounds[1],
                s: bounds[0],
                w: bounds[2]
              });
            } else {
              NPMap.Map.notify('That location cannot be found.', null, 'info');
            }
          },
          type: 'jsonp',
          //url: 'http://open.mapquestapi.com/nominatim/v1/search.php?format=json&limit=1&q=' + query
          url: 'http://nominatim.openstreetmap.org/search?format=json&email=npmap@nps.gov&limit=1&q=' + query
        });
      }

      if (e) {
        return false;
      }
    }

    if (form.attachEvent) {
      form.attachEvent('submit', geocode);
    } else {
      form.addEventListener('submit', geocode);
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