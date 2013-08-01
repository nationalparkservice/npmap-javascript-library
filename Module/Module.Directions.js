define([
  'Map/Map',
  'Module/Module',
  'Util/Util',
  'Util/Util.Geocode',
  'Util/Util.Route'
], function(Map, Module, Util, UtilGeocode, UtilRoute) {
  /**
   * Base64
   */
  Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(b){var d="",c,a,f,g,h,e,i=0;for(b=Base64._utf8_encode(b);i<b.length;){c=b.charCodeAt(i++);a=b.charCodeAt(i++);f=b.charCodeAt(i++);g=c>>2;c=(c&3)<<4|a>>4;h=(a&15)<<2|f>>6;e=f&63;if(isNaN(a))h=e=64;else if(isNaN(f))e=64;d=d+this._keyStr.charAt(g)+this._keyStr.charAt(c)+this._keyStr.charAt(h)+this._keyStr.charAt(e)}return d},decode:function(b){var d="",c,a,f,g,h,e=0;for(b=b.replace(/[^A-Za-z0-9\+\/\=]/g,"");e<b.length;){c=this._keyStr.indexOf(b.charAt(e++));a=this._keyStr.indexOf(b.charAt(e++));g=this._keyStr.indexOf(b.charAt(e++));h=this._keyStr.indexOf(b.charAt(e++));c=c<<2|a>>4;a=(a&15)<<4|g>>2;f=(g&3)<<6|h;d+=String.fromCharCode(c);if(g!=64)d+=String.fromCharCode(a);if(h!=64)d+=String.fromCharCode(f)}return d=Base64._utf8_decode(d)},_utf8_encode:function(b){b=b.replace(/\r\n/g,"\n");for(var d="",c=0;c<b.length;c++){var a=b.charCodeAt(c);if(a<128)d+=String.fromCharCode(a);else{if(a>127&&a<2048)d+=String.fromCharCode(a>>6|192);else{d+=String.fromCharCode(a>>12|224);d+=String.fromCharCode(a>>6&63|128)}d+=String.fromCharCode(a&63|128)}}return d},_utf8_decode:function(b){for(var d="",c=0,a=c1=c2=0;c<b.length;){a=b.charCodeAt(c);if(a<128){d+=String.fromCharCode(a);c++}else if(a>191&&a<224){c2=b.charCodeAt(c+1);d+=String.fromCharCode((a&31)<<6|c2&63);c+=2}else{c2=b.charCodeAt(c+1);c3=b.charCodeAt(c+2);d+=String.fromCharCode((a&15)<<12|(c2&63)<<6|c3&63);c+=3}}return d}};
  /**
   * Drag and drop - http://web.archive.org/web/20041010061435/http://blog.simon-cozens.org/6785.html, with quite a few custom modifications.
   */
  var Drag={obj:null,init:function(o,oRoot,minX,maxX,minY,maxY,bSwapHorzRef,bSwapVertRef,fXMapper,fYMapper){o.childNodes[0].onmousedown=Drag.start;o.hmode=bSwapHorzRef?false:true;o.vmode=bSwapVertRef?false:true;o.root=oRoot&&oRoot!=null?oRoot:o;if(o.hmode&&isNaN(parseInt(o.root.style.left)))o.root.style.left="0px";if(o.vmode&&isNaN(parseInt(o.root.style.top)))o.root.style.top="0px";if(!o.hmode&&isNaN(parseInt(o.root.style.right)))o.root.style.right="0px";if(!o.vmode&&isNaN(parseInt(o.root.style.bottom)))o.root.style.bottom="0px";o.minX=typeof minX!="undefined"?minX:null;o.minY=typeof minY!="undefined"?minY:null;o.maxX=typeof maxX!="undefined"?maxX:null;o.maxY=typeof maxY!="undefined"?maxY:null;o.xMapper=fXMapper?fXMapper:null;o.yMapper=fYMapper?fYMapper:null;o.root.onDragStart=new Function;o.root.onDragEnd=new Function;o.root.onDrag=new Function},start:function(e){var o=Drag.obj=this.parentNode;e=Drag.fixE(e);var y=parseInt(o.vmode?o.root.style.top:o.root.style.bottom);var x=parseInt(o.hmode?o.root.style.left:o.root.style.right);o.root.onDragStart(x,y);o.lastMouseX=e.clientX;o.lastMouseY=e.clientY;if(o.hmode){if(o.minX!=null)o.minMouseX=e.clientX-x+o.minX;if(o.maxX!=null)o.maxMouseX=o.minMouseX+o.maxX-o.minX}else{if(o.minX!=null)o.maxMouseX=-o.minX+e.clientX+x;if(o.maxX!=null)o.minMouseX=-o.maxX+e.clientX+x}if(o.vmode){if(o.minY!=null)o.minMouseY=e.clientY-y+o.minY;if(o.maxY!=null)o.maxMouseY=o.minMouseY+o.maxY-o.minY}else{if(o.minY!=null)o.maxMouseY=-o.minY+e.clientY+y;if(o.maxY!=null)o.minMouseY=-o.maxY+e.clientY+y}document.onmousemove=Drag.drag;document.onmouseup=Drag.end;return false},drag:function(e){e=Drag.fixE(e);var o=Drag.obj;var ey=e.clientY;var ex=e.clientX;var y=parseInt(o.vmode?o.root.style.top:o.root.style.bottom);var x=parseInt(o.hmode?o.root.style.left:o.root.style.right);var nx,ny;if(o.minX!=null)ex=o.hmode?Math.max(ex,o.minMouseX):Math.min(ex,o.maxMouseX);if(o.maxX!=null)ex=o.hmode?Math.min(ex,o.maxMouseX):Math.max(ex,o.minMouseX);if(o.minY!=null)ey=o.vmode?Math.max(ey,o.minMouseY):Math.min(ey,o.maxMouseY);if(o.maxY!=null)ey=o.vmode?Math.min(ey,o.maxMouseY):Math.max(ey,o.minMouseY);nx=x+(ex-o.lastMouseX)*(o.hmode?1:-1);ny=y+(ey-o.lastMouseY)*(o.vmode?1:-1);if(o.xMapper)nx=o.xMapper(y);else if(o.yMapper)ny=o.yMapper(x);Drag.obj.root.style[o.hmode?"left":"right"]=nx+"px";Drag.obj.root.style[o.vmode?"top":"bottom"]=ny+"px";Drag.obj.lastMouseX=ex;Drag.obj.lastMouseY=ey;Drag.obj.root.onDrag(nx,ny,Drag.obj.root);return false},end:function(){document.onmousemove=null;document.onmouseup=null;Drag.obj.root.onDragEnd(parseInt(Drag.obj.root.style[Drag.obj.hmode?"left":"right"]),parseInt(Drag.obj.root.style[Drag.obj.vmode?"top":"bottom"]),Drag.obj.root);Drag.obj=null},fixE:function(e){if(typeof e=="undefined")e=window.event;if(typeof e.layerX=="undefined")e.layerX=e.offsetX;if(typeof e.layerY=="undefined")e.layerY=e.offsetY;return e}};

  var
      // An array of letters to use for location objects.
      _abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      // The module config object.
      _config = (function() {
        for (var i = 0; i < NPMap.config.modules.length; i++) {
          if (NPMap.config.modules[i].name === 'directions') {
            return NPMap.config.modules[i];
          }
        }
      })(),
      _disambiguateResults = [],
      _divFormControls,
      _divOptions,
      _stops = [],
      _ulDisambiguation,
      _ulLocation;

  /**
   *
   */
  function _addLocationLi(setFocus) {
    var locationLis = _ulLocation.childNodes,
        max = (function() {
          var options = _getOptions();

          if (options.roundTrip) {
            return 24;
          } else {
            return 25;
          }
        })();

    if (locationLis.length <= max) {
      var firstLi = locationLis[0],
          input = document.createElement('input'),
          label = document.createElement('label'),
          li = document.createElement('li'),
          locationForm = document.getElementById('npmap-directions-form');

      if (Util.hasClass(firstLi, 'initial')) {
        var divChildNodes = _divFormControls.childNodes,
            liChildNodes = firstLi.childNodes;

        Util.removeClass(firstLi, 'initial');
        Util.removeClass(liChildNodes[2], 'search');
        firstLi.removeChild(liChildNodes[1]);
        firstLi.appendChild(_createRemoveButton());
        divChildNodes[0].style.display = 'none';
        divChildNodes[1].style.display = 'block';
        Util.getElementsByClass('mods-addStop')[0].style.display = 'block';
        Util.getElementsByClass('mods-options')[0].style.display = 'block';

        bean.add(liChildNodes[1], 'keyup', _inputKeyup);
      }

      bean.add(input, 'keyup', _inputKeyup);
      input.setAttribute('id', 'location-' + _abc[locationLis.length]);
      input.setAttribute('type', 'text');
      label.className = 'identifier';
      label.innerHTML = _abc[locationLis.length];
      label.setAttribute('for', 'location-' + _abc[locationLis.length]);
      li.appendChild(label);
      li.appendChild(input);
      li.appendChild(_createRemoveButton());
      _ulLocation.appendChild(li);
      _hookupDragDrop();

      if (setFocus) {
        input.focus();
      }
    } else {
      // Notify user that they cannot add more than {{max}} locations.
    }
  }
  /**
   *
   */
  function _addToItinerary(el, stop) {
    var bounds = stop.boundingbox,
        letter = el.id.replace('location-', ''),
        marker = Map.createMarker({
          lat: stop.lat,
          lng: stop.lon
        }, {
          anchor: {
            x: 19.5,
            y: 37
          },
          height: 37,
          text: letter,
          url: NPMap.config.server + '/resources/img/modules/directions/stop-marker.png',
          width: 39
        });

    _stops.push({
      bounds: {
        e: bounds[3],
        n: bounds[1],
        s: bounds[0],
        w: bounds[2]
      },
      display: stop.display_name,
      //displayUser: value,
      latLng: {
        lat: stop.lat,
        lng: stop.lon
      },
      letter: letter,
      marker: marker,
      source: 'mapquest'
    });
    Map.addShape(marker);

    if (_stops.length > 1) {
      UtilRoute.route(null, function(response) {
        console.log(response);
      });
    }
  }
  /**
   *
   */
  function _clearStops() {
    var childNodes = _ulLocation.childNodes;

    if (childNodes.length > 1) {
      var clear = [];

      _.each(_ulLocation.childNodes, function(childNode, index) {
        if (index > 0) {
          clear.push(childNode);
        }
      });
      _.each(clear, function(childNode) {
        _ulLocation.removeChild(childNode);
      });
      _refreshStops();
    }

    childNodes[0].childNodes[2].value = '';

    _.each(_stops, function(stop) {
      Map.removeShape(stop.marker);
    });

    _stops = [];
  }
  /**
   *
   */
  function _createRemoveButton() {
    var button = document.createElement('button');

    bean.add(button, 'click', function(e) {
      _removeStop(this.parentNode.childNodes[1].id.replace('location-', ''));
    });
    bean.add(button, 'mouseout', function(e) {
      this.childNodes[0].className = 'icon-close-x';
    });
    bean.add(button, 'mouseover', function(e) {
      this.childNodes[0].className = 'icon-close-x-over';
    });
    button.className = 'btn-remove ir';
    button.innerHTML = '<i class="icon-close-x"></i>Remove location';
    button.setAttribute('type', 'button');

    return button;
  }
  /**
   *
   */
  function _disambiguateSelect(num) {
    var input,
        value = _ulDisambiguation.childNodes[num - 1].childNodes[0].childNodes[1].innerHTML;

    for (var i = 0; i < _ulLocation.childNodes.length; i++) {
      var li = _ulLocation.childNodes[i];

      if (Util.hasClass(li.childNodes[1], 'disambiguate')) {
        input = li.childNodes[1];
        break;
      } else if (Util.hasClass(li.childNodes[2], 'disambiguate')) {
        input = li.childNodes[2];
        break;
      }
    }

    Util.removeClass(input, 'disambiguate');
    input.value = value;
    _addToItinerary(input, _disambiguateResults[num - 1]);
    _resetDisambiguate();
    _addLocationLi(true);
  }
  /**
   *
   */
  function _firstToSearch() {
    var button = document.createElement('button'),
        divChildNodes = _divFormControls.childNodes,
        firstLi = _ulLocation.childNodes[0],
        liChildNodes = firstLi.childNodes;

    button.className = 'npmap-search-button';
    button.innerHTML = '<i class="icon-search"></i>';
    Util.addClass(firstLi, 'initial');
    firstLi.removeChild(liChildNodes[2]);
    Util.addClass(liChildNodes[1], 'search');
    firstLi.insertBefore(button, liChildNodes[1]);
    divChildNodes[0].style.display = 'block';
    divChildNodes[1].style.display = 'none';
    Util.getElementsByClass('mods-addStop')[0].style.display = 'none';
    Util.getElementsByClass('mods-options')[0].style.display = 'none';

    bean.remove(liChildNodes[2], 'keyup', _inputKeyup);
    button.onclick = function() {
      NPMap.Module.Directions._geocode(this.parentNode.childNodes[2]);
      return false;
    };
  }
  /**
   *
   */
  function _geocode(el) {
    var value = el.value;

    if (value.length === 0) {
      el.focus();
    } else {
      UtilGeocode.geocodeNominatim(value, function(response) {
        if (response.success) {
          var good = [];

          _.each(response.results, function(result) {
            if (result.importance > 0.49) {
              good.push(result);
            }
          });

          if (good.length === 0) {
            NPMap.Map.notify('The location could not be found.', null, 'info');
          } else if (good.length === 1) {
            _addToItinerary(el, good[0]);
            _addLocationLi(true);
          } else {
            _disambiguateResults = good;
            Util.addClass(el, 'disambiguate');
            _.each(good, function(result, index) {
              var li = document.createElement('li');
              li.innerHTML = '<a href="javascript:void(0)"><span class="location-option-numeric">' + (index + 1) + '</span><h3 style="margin-right:35px;">' + result.display_name + '</h3><span class="location-option-address" style="margin-right:35px;"></span><i class="icon-add-disambiguate" style="position:absolute;right:5px;top:5px;"></i></a>';
              _ulDisambiguation.appendChild(li);
            });
            Util.getElementsByClass('directions-location-options')[0].style.display = 'block';
            _.each(_ulDisambiguation.childNodes, function(li) {
              var aNodeChildNodes = li.childNodes[0].childNodes,
                  icon = aNodeChildNodes[3];

              icon.style.top = ((Util.getOuterDimensions(li).height - 19) / 2) + 'px';

              bean.add(li, 'click', function() {
                _disambiguateSelect(parseInt(aNodeChildNodes[0].innerHTML, 10));
              });
              bean.add(li, 'mouseout', function() {
                icon.className = 'icon-add-disambiguate';
              });
              bean.add(li, 'mouseover', function() {
                icon.className = 'icon-add-disambiguate-over';
              });
            });
          }
        } else {
          NPMap.Map.notify(response.message ? response.message : 'The geocode operation could not be performed.', null, 'error');
        }
      });
    }
  }
  /**
   *
   */
  function _getOptions() {
    return {};
  }
  /**
   *
   */
  function _hideOptions() {
    var buttonOptions = Util.getElementsByClass('btn-options')[0];

    _divOptions.style.display = 'none';
    _divFormControls.style.marginTop = '';
    buttonOptions.style.backgroundColor = 'transparent';
    buttonOptions.childNodes[0].className = 'icon-options-collapsed';
    bean.remove(buttonOptions, 'click', NPMap.Module.Directions._hideOptions);
    bean.add(buttonOptions, 'click', NPMap.Module.Directions._showOptions);
  }
  function _hookupDragDrop() {
    var lis = _ulLocation.childNodes,
        offset = Util.getOffset(_ulLocation),
        offsets = [];

    function recalcOffsets () {
      _.each(lis, function(li, index) {
        offsets[index] = li.offsetTop;
      });
    }
    function whereAmI(elem) {
      for (var i = 0; i < lis.length; i++) {
        if (lis[i] == elem) {
          return i;
        }
      }
    }

    /*
    var height = Util.getOuterDimensions(_ulLocation).height,
        topUl = Util.getOffset(_ulLocation).top;
    */

    _.each(lis, function(li, index) {
      /*
      //o, oRoot, minX, maxX, minY, maxY

      var maxY = null,
          minY = null,
          top = Util.getOffset(li).top;

      if (top > 0) {
        minY = topUl - top;
      }

      Drag.init(li, null, 0, 0, minY - 5, height - (28 * (index + 1)) + 5);
      */

      Drag.init(li, null, 0, 0, null, null);

      li.onDrag = function(x, y, myElem) {
        y = myElem.offsetTop;
        recalcOffsets();
        var pos = whereAmI(myElem);

        if (pos != lis.length-1 && y > offsets[pos + 1]) {
          _ulLocation.removeChild(myElem);
          _ulLocation.insertBefore(myElem, lis[pos+1]);
          myElem.style["top"] = "0px";
        }

        if (pos != 0 && y < offsets[pos - 1]) {
          _ulLocation.removeChild(myElem);
          _ulLocation.insertBefore(myElem, lis[pos-1]);
          myElem.style["top"] = "0px";
        }
      };
      li.onDragEnd = function(x, y, myElem) {
        var changed = false;

        myElem.style["top"] = "0px";

        for (var i = 0; i < _ulLocation.childNodes.length; i++) {
          var li = _ulLocation.childNodes[i];

          if (_.indexOf(_abc, li.childNodes[0].innerHTML) !== i) {
            changed = true;
            break;
          }
        }

        if (changed) {
          _refreshStops();
        }
      };
    });

    recalcOffsets();
  }
  /**
   *
   */
  function _inputKeyup(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (e.keyCode === 13) {
      _geocode(this);
    } else {
      // Set dirty.
    }
  }
  /**
   *
   */
  function _refreshStops() {
    var childNodes = _ulLocation.childNodes;

    if (childNodes.length === 1) {
      _firstToSearch();
      _setLiLetter(childNodes[0], 0);
    } else {
      _.each(childNodes, function(childNode, index) {
        _setLiLetter(childNode, index);
      });
    }

    _hookupDragDrop();
  }
  /**
   *
   */
  function _removeStop(letter) {
    _ulLocation.removeChild(_ulLocation.childNodes[_.indexOf(_abc, letter)]);
    _refreshStops();
  }
  /**
   *
   */
  function _resetDisambiguate() {
    var div = Util.getElementsByClass('directions-location-options')[0];

    _disambiguateResults = [];
    div.style.display = 'none';
    div.childNodes[1].innerHTML = null;
  }
  /**
   *
   */
  function _setLiLetter(li, index) {
    var children = li.childNodes,
        letter = _abc[index];

    children[0].setAttribute('for', 'location-' + letter);
    children[0].innerHTML = letter;
    children[1].id = 'location-' + letter;
  }
  /**
   *
   */
  function _showOptions() {
    var buttonOptions = Util.getElementsByClass('btn-options')[0];

    _divOptions.style.display = 'block';
    _divFormControls.style.marginTop = '98px';
    buttonOptions.style.backgroundColor = '#F3EFE5';
    buttonOptions.childNodes[0].className = 'icon-options-expanded';
    bean.remove(buttonOptions, 'click', NPMap.Module.Directions._showOptions);
    bean.add(buttonOptions, 'click', NPMap.Module.Directions._hideOptions);
  }

  NPMap.Util.injectCss(NPMap.config.server + '/Module/Module.Directions.css');
  // TODO: Shouldn't this attribution be stored here with the tool?
  Map._attribution.push('&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors');
  Module.add({
    content: '' +
      '<div id="npmap-directions">' +
        '<form id="npmap-directions-form" onsubmit="return false;">' +
          '<ul class="location-fields ui-sortable">' +
            '<li class="initial">' +
              '<label class="identifier" for="location-A">' +
                'A' +
              '</label>' +
              '<button class="npmap-search-button" onclick="NPMap.Module.Directions._geocode(this.parentNode.childNodes[2]);return false;"><i class="icon-search"></i></button>' +
              '<input id="location-A" type="text" class="search">' +
            '</li>' +
          '</ul>' +
          '<div class="directions-location-options" style="display:none;">' +
            '<div class="directions-note directions-warning">' +
              'Multiple locations were found. Did you mean:' +
            '</div>' +
            '<ul>' +
            '</ul>' +
          '</div>' +
          '<div class="directions-form-mods clearfix">' +
            '<div class="mods-addStop">' +
              '<button class="btn-add-stop" onclick="NPMap.Module.Directions._addLocationLi(true);return false;" type="button">' +
                '<i class="icon-add-stop" style="margin-right:3px;"></i>Add Stop' +
              '</button>' +
            '</div>' +
            '<div class="mods-options mods-dd">' +
              '<button class="btn-options" onclick="NPMap.Module.Directions._showOptions();return false;" type="button">' +
                '<i class="icon-options-collapsed" style="margin-right:3px;margin-top:2px;"></i>Options' +
              '</button>' +
              '<div class="mods-options-entries">' +
                '<ul>' +
                  '<li>' +
                    '<input type="checkbox" id="avoid-toll">' +
                    '<label for="avoid-toll">Avoid toll roads</label>' +
                  '</li>' +
                  '<li>' +
                    '<input type="checkbox" id="avoid-highways">' +
                    '<label for="avoid-highways">Avoid highways</label>' +
                  '</li>' +
                  '<li>' +
                    '<input type="checkbox" id="round-trip">' +
                    '<label for="round-trip">Round trip</label>' +
                  '</li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="directions-form-controls">' +
            '<button class="btn-primary" onclick="NPMap.Module.Directions._addLocationLi(true);return false;" type="button">' +
              'Add Stop' +
            '</button>' +
            '<button class="btn-primary" onclick="NPMap.Module.Directions._create();return false;" style="display:none;" type="button">' +
              'Plan Route' +
            '</button>' +
            '<button class="btn-simple" href="javascript:void(0)" onclick="NPMap.Map.modal(\'Are you sure you want to clear all the locations?\',\'Yes, clear all\',\'No, do not clear all\',NPMap.Module.Directions._clearStops);return false;" type="button">' +
              'Clear' +
            '</button>' +
          '</div>' +
        '</form>' +
        '<div class="directions-details" style="display:none;">' +
        '</div>' +
      '</div>' +
      '<div class="disclaimer">' +
        '<p>DISCLAIMER: These directions are for planning purposes only. While the National Park Service strives to provide the most accurate information possible, please use caution when driving in unfamiliar locations and check directions against the content provided by each Park\'s website. The National Park Service assumes no responsibility for information provided by NPS partners.</p>' +
      '</div>',
    description: '<p>Enter an address or use the map to add locations. Drag the black labels to reorder stops.</p>',
    icon: 'directions',
    id: 'directions',
    name: 'Directions',
    title: 'Directions'
  });

  _divFormControls = Util.getElementsByClass('directions-form-controls')[0];
  _divOptions = Util.getElementsByClass('mods-options-entries')[0];
  _ulDisambiguation = Util.getElementsByClass('directions-location-options')[0].childNodes[1];
  _ulLocation = Util.getElementsByClass('location-fields')[0];
  _hookupDragDrop();

  return NPMap.Module.Directions = {
    /**
     *
     */
    _addLocationLi: function(setFocus) {
      _addLocationLi(setFocus);
    },
    /**
     *
     */
    _clearStops: function() {
      _clearStops();
    },
    /**
     *
     */
    _create: function() {

    },
    /**
     *
     */
    _geocode: function(el) {
      _geocode(el);
    },
    /**
     *
     */
    _getConfig: function() {
      return _config;
    },
    /**
     *
     */
    _hideOptions: function() {
      _hideOptions();
    },
    /**
     *
     */
    _showOptions: function() {
      _showOptions();
    }
  };
});