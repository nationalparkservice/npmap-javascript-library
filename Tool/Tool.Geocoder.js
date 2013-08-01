define([
  'Event',
  'Map/Map',
  'Tool/Tool',
  'Util/Util',
  'Util/Util.Geocode'
],function(Event, Map, Tool, Util, UtilGeocoder) {
  var
      //
      _bounds = {},
      //
      _button,
      //
      _config = NPMap.config._tools.geocoder,
      //
      _form = document.createElement('form'),
      //
      _input,
      //
      _isDirty = false,
      //
      _oldValue = null,
      //
      _selectedLi = null,
      //
      _ul;

  /**
   *
   */
  function _checkScroll() {
    if (_selectedLi) {
      var top = Util.getPosition(_selectedLi).top,
          bottom = top + Util.getOuterDimensions(_selectedLi).height,
          scrollTop = _ul.scrollTop,
          visible = [
            scrollTop,
            scrollTop + Util.getOuterDimensions(_ul).height
          ];

      if (top < visible[0]) {
        _ul.scrollTop = top - 10;
      } else if (bottom > visible[1]) {
        _ul.scrollTop = top - 10;
      }
    }
  }
  /**
   *
   */
  function _clearResults() {
    _ul.innerHTML = '';
    _ul.style.display = 'none';
    _selectedLi = null;
  }
  /**
   *
   */
  function _geocode(e) {
    var query = _input.value;

    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (_isDirty && !_selectedLi && query.length > 1) {
      _isDirty = false;
      _clearResults();
      _button.innerHTML = '<img src="' + NPMap.config.server + '/resources/img/buttons/loading.gif" style="left:4px;position:absolute;top:4px;">';
      _button.style.backgroundColor = 'black';
      _button.style.cursor = 'wait';
      UtilGeocoder.geocodeNominatim(query, function(response) {
        _button.innerHTML = '<i class="icon-search"></i>';
        _button.style.backgroundColor = '#CB9733';
        _button.style.cursor = 'pointer';

        if (response.success) {
          if (response.results && response.results.length) {
            var bounds = response.results[0].boundingbox;

            NPMap.Map.toBounds({
              e: bounds[3],
              n: bounds[1],
              s: bounds[0],
              w: bounds[2]
            });
          } else {
            if (response.message) {
              NPMap.Map.notify(response.message, null, 'info');
            } else {
              NPMap.Map.notify('That location could not be found.', null, 'info');
            }
          }
        } else {
          NPMap.Map.notify(response.message, null, 'error');
        }
      });
    } else {
      _input.focus();
    }

    if (e) {
      return false;
    }
  }
  /**
   *
   */
  function _handleSelect(li) {
    var id = li.id;

    _clearResults();
    _isDirty = false;
    _input.value = _oldValue = id;
    _input.focus();
    Map.toBounds(_bounds[id]);
  }

  // TODO: Shouldn't this attribution be stored here with the tool?
  Map._attribution.push('&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors');
  Map._geocodeOnFocus = function() {
    reqwest({
      jsonpCallbackName: 'callback',
      success: function(response) {
        _oldValue = _input.value;
        _.each(response, function(value, key) {
          _bounds[key] = {
            e: value[0],
            n: value[1],
            s: value[2],
            w: value[3]
          };
        });
        _input.onkeydown = function(e) {
          if (_isDirty) {
            if (e.keyCode === 38) {
              if (_selectedLi) {
                Util.removeClass(_selectedLi, 'selected');

                _selectedLi = Util.getPreviousElement(_selectedLi);

                if (_selectedLi) {
                  Util.addClass(_selectedLi, 'selected');
                } else {
                  _input.focus();
                }

                if (e.preventDefault) {
                  e.preventDefault();
                }
              } else {
                // TODO: Select last li.
              }

              _checkScroll();
            } else if (e.keyCode === 40) {
              if (_selectedLi) {
                var nextSibling = Util.getNextElement(_selectedLi);

                if (nextSibling) {
                  Util.removeClass(_selectedLi, 'selected');
                  _selectedLi = nextSibling;
                  Util.addClass(_selectedLi, 'selected');
                }
              } else {
                _selectedLi = _ul.childNodes[0];
                Util.addClass(_selectedLi, 'selected');
              }

              _checkScroll();
            }
          }
        };
        _input.onkeyup = function(e) {
          var newValue = _input.value;

          if (e.keyCode === 13) {
            if (_selectedLi) {
              _handleSelect(_selectedLi);
            }
          } else if (e.keyCode === 27) {
            _clearResults();
          } else if (newValue !== _oldValue) {
            _isDirty = true;
            _oldValue = newValue;

            if (newValue.length > 0) {
              var results = [];

              _.each(_bounds, function(value, key) {
                if (key.toLowerCase().indexOf(newValue.toLowerCase()) !== -1) {
                  results.push({
                    b: value,
                    d: key
                  });
                }
              });

              if (results.length > 0) {
                _clearResults();
                _.each(results, function(result, index) {
                  var d = result.d,
                      i = d.toLowerCase().indexOf(newValue.toLowerCase()),
                      li = document.createElement('li');

                  if (index === 0) {
                    li.className = 'first';
                  }

                  if (index === results.length - 1) {
                    li.className = 'last';
                  }

                  li.id = d;
                  li.innerHTML = (d.slice(0, i) + '<strong>' + d.slice(i, i + newValue.length) + '</strong>' + d.slice(i + newValue.length));
                  bean.add(li, 'click', function() {
                    _handleSelect(this);
                  });
                  bean.add(li, 'mouseout', function() {
                    Util.removeClass(li, 'mouseover');
                  });
                  bean.add(li, 'mouseover', function() {
                    Util.addClass(li, 'mouseover');
                  });
                  _ul.appendChild(li);
                });

                _ul.style.display = 'block';
              } else {
                _clearResults();
              }
            } else {
              _clearResults();
            }
          }
        };
      },
      type: 'jsonp',
      url: 'http://www.nps.gov/npmap/data/park-bounds.js'
    });
    _input.onfocus = null;
    delete Map._geocodeOnFocus;
  };

  _form.id = 'npmap-geocoder';
  _form.innerHTML = '<button id="npmap-geocoder-button" class="npmap-search-button"><i class="icon-search"></i></button><input id="npmap-geocoder-input" type="text" placeholder="Find a Location" class="search" onfocus="this.value=this.value;NPMap.Map._geocodeOnFocus();return false;"><ul id="npmap-geocoder-results"></ul>';
  _form.style.cssText = 'left:87px;position:absolute;top:30px;z-index:30;';

  Tool._add(_form, function() {
    if (_form.attachEvent) {
      _form.attachEvent('submit', _geocode);
    } else {
      _form.addEventListener('submit', _geocode);
    }

    _button = document.getElementById('npmap-geocoder-button');
    _input = document.getElementById('npmap-geocoder-input');
    _ul = document.getElementById('npmap-geocoder-results');

    bean.add(_form, 'mousewheel', function(e) {
      Util.eventCancelMouseWheel(e);
    });
    bean.add(_ul, 'mousedown', function() {
      _input.focus();
    });
    bean.add(_ul, 'mouseup', function() {
      _input.focus();
    });
    Util.captureMouseWheel(_ul);
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