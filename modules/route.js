define(function() {
  // TODO: These three "libraries" will no longer be needed when you switch over all maps to the new routing framework.
  /**
   * Base64
   */
  Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(b){var d="",c,a,f,g,h,e,i=0;for(b=Base64._utf8_encode(b);i<b.length;){c=b.charCodeAt(i++);a=b.charCodeAt(i++);f=b.charCodeAt(i++);g=c>>2;c=(c&3)<<4|a>>4;h=(a&15)<<2|f>>6;e=f&63;if(isNaN(a))h=e=64;else if(isNaN(f))e=64;d=d+this._keyStr.charAt(g)+this._keyStr.charAt(c)+this._keyStr.charAt(h)+this._keyStr.charAt(e)}return d},decode:function(b){var d="",c,a,f,g,h,e=0;for(b=b.replace(/[^A-Za-z0-9\+\/\=]/g,
  "");e<b.length;){c=this._keyStr.indexOf(b.charAt(e++));a=this._keyStr.indexOf(b.charAt(e++));g=this._keyStr.indexOf(b.charAt(e++));h=this._keyStr.indexOf(b.charAt(e++));c=c<<2|a>>4;a=(a&15)<<4|g>>2;f=(g&3)<<6|h;d+=String.fromCharCode(c);if(g!=64)d+=String.fromCharCode(a);if(h!=64)d+=String.fromCharCode(f)}return d=Base64._utf8_decode(d)},_utf8_encode:function(b){b=b.replace(/\r\n/g,"\n");for(var d="",c=0;c<b.length;c++){var a=b.charCodeAt(c);if(a<128)d+=String.fromCharCode(a);else{if(a>127&&a<2048)d+=
  String.fromCharCode(a>>6|192);else{d+=String.fromCharCode(a>>12|224);d+=String.fromCharCode(a>>6&63|128)}d+=String.fromCharCode(a&63|128)}}return d},_utf8_decode:function(b){for(var d="",c=0,a=c1=c2=0;c<b.length;){a=b.charCodeAt(c);if(a<128){d+=String.fromCharCode(a);c++}else if(a>191&&a<224){c2=b.charCodeAt(c+1);d+=String.fromCharCode((a&31)<<6|c2&63);c+=2}else{c2=b.charCodeAt(c+1);c3=b.charCodeAt(c+2);d+=String.fromCharCode((a&15)<<12|(c2&63)<<6|c3&63);c+=3}}return d}};
  /**
   * Json2
   */
  (function(e){e.toJSON=function(a){if(typeof JSON=="object"&&JSON.stringify)return JSON.stringify(a);var b=typeof a;if(a===null)return"null";if(b!="undefined"){if(b=="number"||b=="boolean")return a+"";if(b=="string")return e.quoteString(a);if(b=="object"){if(typeof a.toJSON=="function")return e.toJSON(a.toJSON());if(a.constructor===Date){var c=a.getUTCMonth()+1;if(c<10)c="0"+c;var d=a.getUTCDate();if(d<10)d="0"+d;b=a.getUTCFullYear();var f=a.getUTCHours();if(f<10)f="0"+f;var g=a.getUTCMinutes();if(g<
  10)g="0"+g;var h=a.getUTCSeconds();if(h<10)h="0"+h;a=a.getUTCMilliseconds();if(a<100)a="0"+a;if(a<10)a="0"+a;return'"'+b+"-"+c+"-"+d+"T"+f+":"+g+":"+h+"."+a+'Z"'}if(a.constructor===Array){c=[];for(d=0;d<a.length;d++)c.push(e.toJSON(a[d])||"null");return"["+c.join(",")+"]"}c=[];for(d in a){b=typeof d;if(b=="number")b='"'+d+'"';else if(b=="string")b=e.quoteString(d);else continue;if(typeof a[d]!="function"){f=e.toJSON(a[d]);c.push(b+":"+f)}}return"{"+c.join(", ")+"}"}}};e.evalJSON=function(a){if(typeof JSON==
  "object"&&JSON.parse)return JSON.parse(a);return eval("("+a+")")};e.secureEvalJSON=function(a){if(typeof JSON=="object"&&JSON.parse)return JSON.parse(a);var b=a;b=b.replace(/\\["\\\/bfnrtu]/g,"@");b=b.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]");b=b.replace(/(?:^|:|,)(?:\s*\[)+/g,"");if(/^[\],:{}\s]*$/.test(b))return eval("("+a+")");else throw new SyntaxError("Error parsing JSON, source is not valid.");};e.quoteString=function(a){if(a.match(i))return'"'+a.replace(i,
  function(b){var c=j[b];if(typeof c==="string")return c;c=b.charCodeAt();return"\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16)})+'"';return'"'+a+'"'};var i=/["\\\x00-\x1f\x7f-\x9f]/g,j={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"}})(jQuery);
  /**
	 * Watermark v3.1.3 (March 22, 2011) plugin for jQuery
	 * http://jquery-watermark.googlecode.com/
	 * Copyright (c) 2009-2011 Todd Northrop
	 * http://www.speednet.biz/
	 * Dual licensed under the MIT or GPL Version 2 licenses.
   */
  (function(a,h,y){var w="function",v="password",j="maxLength",n="type",b="",c=true,u="placeholder",i=false,t="watermark",g=t,f="watermarkClass",q="watermarkFocus",l="watermarkSubmit",o="watermarkMaxLength",e="watermarkPassword",d="watermarkText",k=/\r/g,s="input:data("+g+"),textarea:data("+g+")",m="input:text,input:password,input[type=search],input:not([type]),textarea",p=["Page_ClientValidate"],r=i,x=u in document.createElement("input");a.watermark=a.watermark||{version:"3.1.3",runOnce:c,options:{className:t,useNative:c,hideBeforeUnload:c},hide:function(b){a(b).filter(s).each(function(){a.watermark._hide(a(this))})},_hide:function(a,r){var p=a[0],q=(p.value||b).replace(k,b),l=a.data(d)||b,m=a.data(o)||0,i=a.data(f);if(l.length&&q==l){p.value=b;if(a.data(e))if((a.attr(n)||b)==="text"){var g=a.data(e)||[],c=a.parent()||[];if(g.length&&c.length){c[0].removeChild(a[0]);c[0].appendChild(g[0]);a=g}}if(m){a.attr(j,m);a.removeData(o)}if(r){a.attr("autocomplete","off");h.setTimeout(function(){a.select()},1)}}i&&a.removeClass(i)},show:function(b){a(b).filter(s).each(function(){a.watermark._show(a(this))})},_show:function(g){var p=g[0],u=(p.value||b).replace(k,b),h=g.data(d)||b,s=g.attr(n)||b,t=g.data(f);if((u.length==0||u==h)&&!g.data(q)){r=c;if(g.data(e))if(s===v){var m=g.data(e)||[],l=g.parent()||[];if(m.length&&l.length){l[0].removeChild(g[0]);l[0].appendChild(m[0]);g=m;g.attr(j,h.length);p=g[0]}}if(s==="text"||s==="search"){var i=g.attr(j)||0;if(i>0&&h.length>i){g.data(o,i);g.attr(j,h.length)}}t&&g.addClass(t);p.value=h}else a.watermark._hide(g)},hideAll:function(){if(r){a.watermark.hide(m);r=i}},showAll:function(){a.watermark.show(m)}};a.fn.watermark=a.fn.watermark||function(p,o){var t="string";if(!this.length)return this;var s=i,r=typeof p===t;if(r)p=p.replace(k,b);if(typeof o==="object"){s=typeof o.className===t;o=a.extend({},a.watermark.options,o)}else if(typeof o===t){s=c;o=a.extend({},a.watermark.options,{className:o})}else o=a.watermark.options;if(typeof o.useNative!==w)o.useNative=o.useNative?function(){return c}:function(){return i};return this.each(function(){var B="dragleave",A="dragenter",z=this,i=a(z);if(!i.is(m))return;if(i.data(g)){if(r||s){a.watermark._hide(i);r&&i.data(d,p);s&&i.data(f,o.className)}}else{if(x&&o.useNative.call(z,i)&&(i.attr("tagName")||b)!=="TEXTAREA"){r&&i.attr(u,p);return}i.data(d,r?p:b);i.data(f,o.className);i.data(g,1);if((i.attr(n)||b)===v){var C=i.wrap("<span>").parent(),t=a(C.html().replace(/type=["']?password["']?/i,'type="text"'));t.data(d,i.data(d));t.data(f,i.data(f));t.data(g,1);t.attr(j,p.length);t.focus(function(){a.watermark._hide(t,c)}).bind(A,function(){a.watermark._hide(t)}).bind("dragend",function(){h.setTimeout(function(){t.blur()},1)});i.blur(function(){a.watermark._show(i)}).bind(B,function(){a.watermark._show(i)});t.data(e,i);i.data(e,t)}else i.focus(function(){i.data(q,1);a.watermark._hide(i,c)}).blur(function(){i.data(q,0);a.watermark._show(i)}).bind(A,function(){a.watermark._hide(i)}).bind(B,function(){a.watermark._show(i)}).bind("dragend",function(){h.setTimeout(function(){a.watermark._show(i)},1)}).bind("drop",function(e){var c=i[0],a=e.originalEvent.dataTransfer.getData("Text");if((c.value||b).replace(k,b).replace(a,b)===i.data(d))c.value=a;i.focus()});if(z.form){var w=z.form,y=a(w);if(!y.data(l)){y.submit(a.watermark.hideAll);if(w.submit){y.data(l,w.submit);w.submit=function(c,b){return function(){var d=b.data(l);a.watermark.hideAll();if(d.apply)d.apply(c,Array.prototype.slice.call(arguments));else d()}}(w,y)}else{y.data(l,1);w.submit=function(b){return function(){a.watermark.hideAll();delete b.submit;b.submit()}}(w)}}}}a.watermark._show(i)})};if(a.watermark.runOnce){a.watermark.runOnce=i;a.extend(a.expr[":"],{data:function(c,d,b){return!!a.data(c,b[3])}});(function(c){a.fn.val=function(){var e=this;if(!e.length)return arguments.length?e:y;if(!arguments.length)if(e.data(g)){var f=(e[0].value||b).replace(k,b);return f===(e.data(d)||b)?b:f}else return c.apply(e,arguments);else{c.apply(e,arguments);a.watermark.show(e);return e}}})(a.fn.val);p.length&&a(function(){for(var b,c,d=p.length-1;d>=0;d--){b=p[d];c=h[b];if(typeof c===w)h[b]=function(b){return function(){a.watermark.hideAll();return b.apply(null,Array.prototype.slice.call(arguments))}}(c)}});a(h).bind("beforeunload",function(){a.watermark.options.hideBeforeUnload&&a.watermark.hideAll()})}})(jQuery,window);

  var
      // An array of letters to use for destination objects.
      abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      // The module config object.
      config = (function() {
        for (var i = 0; i < NPMap.config.modules.length; i++) {
          if (NPMap.config.modules[i].name === 'route') {
            return NPMap.config.modules[i];
          }
        }
      })(),
      // The destination markers that have been added to the map. This array is empty if no route is on the map.
      destinationMarkers = [],
      // The directions overlay div.
      divDirections = document.createElement('div'),
      // The routing div.
      divRoute = document.createElement('div'),
      // The HTML string to display in the empty itinerary.
      emptyText = '<div style="padding:30px 15px 0 15px;text-align:center;">There are no destinations in your itinerary.</div>',
      // The route line object. This is null if no route has been added to the map.
      routeLine = null,
      // The baseApi map object.
      map = NPMap[NPMap.config.api].map,
      // The width of the route panel.
      panelWidth = config.width || 224,
      // The position of the route panel.
      position = config.position || 'top right';
      
  /**
   * DEPRECATED: Create a route.
   * @param {Array} locations An array of locations to create the route from.
   */
  function createRoute(locations) {
    var url = 'http://dev.virtualearth.net/REST/v1/Routes?';
    
    // TODO: Should only hide this if InfoBox is outside of the current map div.
    NPMap.InfoBox.hide();
    
    $.each(locations, function(i, v) {
      var destination = null;
      
      if (v.address) {
        destination = v.address;
      } else if (v.latLng) {
        destination = v.latLng;
      } else {
        // Throw error.
      }
  
      url += 'waypoint.' + (i + 1) + '=' + destination + '&';
    });

    url = url.slice(0, url.length - 1) + '&routePathOutput=Points&distanceUnit=mi&jsonp=?&key=AqZQwVLETcXEgQET2dUEQIFcN0kDsUrbY8sRKXQE6dTkhCDw9v8H_CY8XRfZddZm';

    $.getJSON(url, function(data) {
      if (data && data.resourceSets && data.resourceSets.length > 0 && data.resourceSets[0].resources && data.resourceSets[0].resources.length > 0) {
        var resource = data.resourceSets[0].resources[0],
            bbox = resource.bbox,
            distanceUnit = resource.distanceUnit.toLowerCase(),
            durationUnit = resource.durationUnit.toLowerCase(),
            totalDistance = resource.travelDistance,
            totalDuration = resource.travelDuration,
            html = '<div style="padding:5px;"><table><tr><td style="font-size:100%;vertical-align:top;"><span style="display:block;">' + getRouteHeader(locations[locations.length - 1], totalDistance, distanceUnit, totalDuration, durationUnit) + '</span></td></tr></table>',
            legs = resource.routeLegs,
            printData = (function() {
              var all = [];
              
              function buildStartAddress(leg) {
                var a = null;

                if (leg.startLocation) {
                  if (leg.startLocation.address) {
                    a = leg.startLocation.address.formattedAddress;
                  } else if (locations[i].latLng) {
                    var coordinates = leg.startLocation.point.coordinates;

                    a = coordinates[0] + ',' + coordinates[1];
                  }
                } else if (leg.actualStart) {
                  if (leg.actualStart.type === 'Point') {
                    var coordinates = leg.actualStart.coordinates;

                    a = coordinates[0] + ',' + coordinates[1];
                  }
                }

                return a;
              }

              $.each(legs, function(i, v) {
                if (legs[i - 1]) {
                  if (legs[i - 1].endLocation && (v.startLocation.name != legs[i - 1].endLocation.name)) {
                    all.push({
                      a: buildStartAddress(legs[i])
                    });
                  }
                } else {
                  all.push({
                    a: buildStartAddress(legs[i])
                  });
                }

                all.push({
                  a: (function() {
                    var a = null;

                    if (legs[i].endLocation) {
                      if (legs[i].endLocation.address) {
                        a = legs[i].endLocation.address.formattedAddress;
                      } else if (locations[i].latLng) {
                        var coordinates = legs[i].endLocation.point.coordinates;
                        
                        a = coordinates[0] + ',' + coordinates[1];
                      }
                    } else if (legs[i].actualEnd) {
                      if (legs[i].actualEnd.type === 'Point') {
                        var coordinates = legs[i].actualEnd.coordinates;

                        a = coordinates[0] + ',' + coordinates[1];
                      }
                    }

                    return a;
                  })()
                });
              });
              
              return all;
            })();

        $.each(printData, function(i, v) {
          if (typeof locations[i].name !== 'undefined') {
            v.n = NPMap.utils.replaceBadCharacters(locations[i].name);
          }
        });
        $.each(legs, function(i, v) {
          var count = v.itineraryItems.length;
          
          if (i === 0) {
            html += '<div style="background-color:#EEE;border:solid 1px #CCC;display:block;margin-top:5px;padding:8px"><table><tr><td style="height:39px;vertical-align:top;width:35px;"><img src="' + NPMap.config.server + '/images/routestart.png" /></td><td style="vertical-align:top;"><span style="display:block;margin-left:10px;">' + getRouteDestinationHeader(locations[i]) + '</span></td></tr></table></div><div style="display:block;margin:0 auto;width:95%;"><table style="border-collapse:collapse;width:100%;" border="0">';
          }

          html += '<div style="display:block;margin:0 auto;width:95%;"><table style="border-collapse:collapse;width:100%;" border="0">';
          
          $.each(v.itineraryItems, function(i2, v2) {
            if (i2 % 2 === 0) {
              if (i2 === count - 1) {
                html += '<tr style="border-left:solid 1px #CCC;border-right:solid 1px #CCC;">';
              } else {
                html += '<tr style="border-bottom:solid 1px #CCC;border-left:solid 1px #CCC;border-right:solid 1px #CCC;">';
              }
            } else {
              if (i2 === count - 1) {
                html += '<tr style="background-color:#EBF2DA;border-left:solid 1px #CCC;border-right:solid 1px #CCC;">';
              } else {
                html += '<tr style="background-color:#EBF2DA;border-bottom:solid 1px #CCC;border-left:solid 1px #CCC;border-right:solid 1px #CCC;">';
              }
            }
            
            html += '<td style="padding:8px 0;text-align:center;vertical-align:top;width:35px;">' + getRouteIcon(v2.instruction.maneuverType) + '</td><td style="padding:8px 0;vertical-align:top;width:30px;">' + (i2 + 1) + '.</td><td style="padding:8px 0;vertical-align:top;"><span>' + v2.instruction.text  + '</span></td><td style="padding:8px 8px 8px 0;text-align:right;width:160px;">' + getDistance(v2.travelDistance, distanceUnit) + '<br>' + getTime(v2.travelDuration, durationUnit) + '</td></tr>';
          });

          html += '</table></div><div style="background-color:#EEE;border:solid 1px #CCC;display:block;padding:8px"><table><tr><td style="height:39px;vertical-align:top;width:35px;"><img src="' + NPMap.config.server + '/images/routestart.png" /></td><td style="vertical-align:top;"><span style="display:block;margin-left:10px;">' + getRouteDestinationHeader(locations[i + 1]) + '</span></td></tr></table></div>';
        });

        html += '<div style="margin:10px;text-align:center;">Disclaimer: These directions are for planning purposes only. While the National Park Service strives to provide the most accurate information possible, please use caution when driving in unfamiliar locations and check directions against the content provided by each Park\'s website. The National Park Service assumes no responsibility for information provided by NPS partners.</div></div></div>';
        
        $("#printdirections").attr('href', NPMap.config.server + '/route/print?data=' + Base64.encode($.toJSON(printData)));
        $('#directionsbuttons').show();
        $('#directionscontent').html(html);

        if ($('#adddestination').length > 0) {
          $('#adddestination').removeClass('disabled');
        }

        $('#createroute').removeClass('disabled');
      } else {
        if ($('#adddestination').length > 0) {
          $('#adddestination').removeClass('disabled');
        }

        $('#createroute').removeClass('disabled');
      }
    });
  }
  /**
   * Filters out locations from a geocode result that are not addresses.
   */
  function filterOutNonAddresses(destinations) {
    var remove = [];
    
    $.each(destinations, function(i, v) {
      if (getType(v.entityType) === 'Other') {
        remove.push(v);
      }
    });
    
    if (remove.length === destinations.length) {
      return [];
    } else {
      $.each(remove, function(i, v) {
        destinations.splice($.inArray(v, destinations), 1);
      });
    }
    
    return destinations;
  }
  /**
   * Uses the Bing Maps Location REST endpoint to geocode an address or latitude/longitude.
   * @param {Function} callback The function to call when the geocode operation is finished.
   * @param {String} address (Optional) The address string to geocode.
   * @param {Float} lat (Optional) The latitude to geocode.
   * @param {Float} lng (Optional) The longitude to geocode.
   */
  function geocode(callback, address, lat, lng) {
    var url = 'http://dev.virtualearth.net/REST/v1/Locations',
        valid = false;

    if (address) {
      url += '?query=' + address;
      valid = true;
    } else if (!isNaN(lat) & !isNaN(lng)) {
      url += '/' + lat + ',' + lng;
      valid = true;
    }

    if (url.indexOf('?') === -1) {
      url += '?';
    } else {
      url += '&';
    }

    url += 'jsonp=?&key=AqZQwVLETcXEgQET2dUEQIFcN0kDsUrbY8sRKXQE6dTkhCDw9v8H_CY8XRfZddZm';

    if (valid) {
      $.getJSON(url, callback);
    } else {
      // This isn't valid.
    }
  }
  /**
   * DEPRECATED: Builds and returns a human-readable distance string.
   * @param {Float} distance The distance.
   * @param {String} unit The distance unit.
   */
  function getDistance(distance, unit) {
    if (distance === 0.00 || distance === 0.0) {
      return '';
    } else if (distance < 1) {
      return (distance.toFixed(1) + ' ' + unit + 's');
    } else if (distance === 1.00) {
      return '1 mile';
    } else {
      return (distance.toFixed(1) + ' ' + unit + 's');
    }
  }
  /**
   * Given a number, return a blank string or 's' to pluralize.
   * @param {Number} The number.
   */
  function getPluralSingular(number) {
    if (number === 1) {
      return '';
    } else {
      return 's';
    }
  }
  /**
   * Builds a route destination header HTML string.
   * @param {Object} location
   */
  function getRouteDestinationHeader(location) {
    var html = '';
    
    if (location.name) {
      html += NPMap.utils.replaceBadCharacters(location.name) + '<br>';
    }
    
    if (location.address) {
      html += NPMap.utils.replaceBadCharacters(location.address);
    } else {
      html += '@' + location.latLng;
    }
    
    return html;
  }
  /**
   * Builds a route header.
   * @param {Object} location
   * @param {Number} distance
   * @param {String} distanceUnit
   * @param {Number} duration
   * @param {String} durationUnit
   */
  function getRouteHeader(location, distance, distanceUnit, duration, durationUnit) {
    var html = 'Directions to: ';
    
    if (location.name) {
      html += NPMap.utils.replaceBadCharacters(location.name) + '<br>';

      if (location.address) {
        html += 'Address: ' + NPMap.utils.replaceBadCharacters(location.address);
      } else {
        html += '@' + location.latLng;
      }
    } else {
      if (location.address) {
        html += NPMap.utils.replaceBadCharacters(location.address);
      } else {
        html += '@' + location.latLng;
      }
    }
    
    html += '<br>Distance and time: ' + getDistance(distance, distanceUnit) + ', about ' + getTime(duration, durationUnit);
    
    return html;
  }
  /**
   * Gets a route icon.
   * @param {String} maneuverType
   */
  function getRouteIcon(maneuverType) {
    var html = null,
        img = null;
    
    switch (maneuverType) {
      case 'ArriveFinish':
        break;
      case 'BearRight':
        break;
      case 'BearRightThenTurnRight':
        break;
      case 'DepartStart':
        break;
      case 'KeepStraight':
        break;
      case 'KeepToStayLeft':
        break;
      case 'RampThenHighwayRight':
        break;
      case 'RoadNameChange':
        break;
      case 'TurnLeft':
        img = 'arrow_turn_left.png';
        break;
      case 'TakeRampRight':
        break;
      case 'TurnRight':
        img = 'arrow_turn_right.png';
        break;
    }
    
    if (img) {
      html = '<img src="' + NPMap.config.server + '/npmap/lib/famfamfam/' + img + '" />';
    } else {
      html = '';
    }
    
    return html;
  }
  /**
   * DEPRECATED: Generates a time string.
   * @param {Number} time
   * @param {String} unit
   */
  function getTime(time, unit) {
    if (time === 0) {
      return '';
    }
    
    if (time > 60) {
      var seconds = time % 60,
          minutes = (time - seconds) / 60;

      if (minutes > 60) {
        var minLeft = minutes % 60,
            hours = (minutes - minLeft) / 60;
             
        return hours + ' hr' + ', ' + minLeft + ' min';
      } else {
        return minutes + ' min';
      }
    } else {
      return ('Less than 1 min');
    }
  }
  /**
   * Gets a generalized location "type".
   * @param {String} type
   * @return {String}
   */
  function getType(type) {
    if (type === 'Address' || type === 'RoadIntersection') {
      return 'Address';
    } else if (type === 'PopulatedPlace') {
      return 'Populated Place';
    } else if (type === 'AdminDivision2') {
      return 'Administrative Unit';
    } else if (type.indexOf('Postcode') !== -1) {
      return 'Zip code';
    } else {
      return 'Other';
    }
  }
  /**
   *
   */
  function hideRoutePanel(callback) {
    $('#route').slideUp(200, function() {
      $('#routetrigger').slideDown(100);
      
      if (callback) {
        callback();
      }
    });
  }
  /**
   *
   */
  function refreshDestinations() {
    var rows = $('#itinerarytable tr');
    
    if (rows.length > 0) {
      $.each(rows, function(i, v) {
        var html = '',
            icon = '<img src="' + NPMap.config.server + '/npmap/' + NPMap.version + '/resources/images/route-';
        
        if (i != 0) {
          html += '<img class="cursor" src="' + NPMap.config.server + '/npmap/lib/famfamfam/arrow_up.png" onclick="NPMap.Route.performDestinationAction(this, \'up\');return false;" />&nbsp;';
        }
        
        if (i + 1 != rows.length && i < rows.length) {
          html += '<img class="cursor" src="' + NPMap.config.server + '/npmap/lib/famfamfam/arrow_down.png" onclick="NPMap.Route.performDestinationAction(this, \'down\');return false;" />&nbsp;';
        }
        
        html += '<img class="cursor" src="' + NPMap.config.server + '/npmap/lib/famfamfam/cross.png" onclick="NPMap.Route.performDestinationAction(this, \'remove\');return false;" />';
        
        $(v).find('td').eq(2).html(html);
        
        if (i % 2 === 0) {
          $(v).removeClass('odd').addClass('even');
        } else {
          $(v).removeClass('even').addClass('odd');
        }
        
        if (i + 1 === rows.length) {
          icon += 'end';
        } else {
          icon += 'start';
        }
        
        $(v).find('td').eq(0).html(icon += '.png" />');
      });
      // TODO: Remove all route geometries and then recreate them here. The destinations array should hold geometries.
      /*
      $.each(destinations, function(i, v) {
        var point = map.createMarker(v.latLng);
        
        //map.removeGeometry(v.geometry);
        map.addGeometry(point);
        
        v.geometry = point;
      });
      */
    } else {
      $('#itinerary').html(emptyText);
    }
  }
  /**
   * Shows the route panel.
   * @param {Function} callback A function to call after the panel has been shown.
   */
  function showRoutePanel(callback) {
    if ($('#route').is(':visible') === false) {
      $('#routetrigger').slideUp(100, function() {
        $('#route').slideDown(200, function() {
          if ($('#routefrom').length > 0) {
            $('#routefrom').focus();
          } else {
            $('#routeadd').focus();
          }
        });
      
        if (callback) {
          callback();
        }
      });
    } else {
      if (callback) {
        callback();
      }
    }
  }
  
  if (config.mode !== 'no-ui') {
    divDirections.id = 'npmapdirections';
    divDirections.innerHTML = '<div style="background-color:#F0F0F0;height:100%;opacity:0.9;left:0px;position:absolute;top:0px;width:100%;z-index:9999991;"></div><div style="-moz-box-shadow:0 0 40px 5px #000;-webkit-box-shadow:0 0 40px #000;background-color:white;border:solid 1px #6B6B6C;font-family:arial,helvetica,sans-serif;font-size:12px;height:90%;left:5%;position:absolute;top:5%;width:90%;z-index:9999991;"><div id="directionscontent" style="bottom:40px;overflow:auto;position:absolute;top:0px;width:100%;"></div><div id="directionsbuttons" style="border-top:solid 1px #cccccc;bottom:0px;display:none;font-size:80%;height:40px;line-height:40px;position:absolute;text-align:center;vertical-align:middle;width:100%;"><a href="#" target="_blank" id="printdirections" class="sq-btn" style="height:14px;">Print</a>&nbsp;<a href="javascript:void(0)" id="closedirections" class="sq-btn" style="height:14px;">Close</a></div>';
    divDirections.style.display = 'none';
    divDirections.style.height = '100%';
    divDirections.style.margin = '0px';
    divDirections.style.padding = '0px';
    divDirections.style.position = 'absolute';
    divDirections.style.width = '100%';
    divDirections.style.zIndex = '50';
    document.getElementById(NPMap.config.div).appendChild(divDirections);
    
    divRoute.id = 'npmaproute';
  
    if (config.mode === 'multi') {
      divRoute.innerHTML = '<div id="routetrigger" style="cursor:pointer;font-size:12px;padding:5px;text-align:center;">Directions</div><div id="route" style="border-bottom:solid 1px #CCC;border-left:solid 1px #CCC;border-right:solid 1px #CCC;-moz-box-shadow:0 0 15px #888;-webkit-box-shadow:0 0 15px #888;box-shadow:0 0 15px #888;display:none;font-size:12px;padding:5px;"><form id="routeaddform" style="margin:0;padding:0;"><table style="margin-bottom:5px;"><tr><td><input id="routeadd" type="text" style="border:1px solid #D3D3D3;padding:5px;width:' + (panelWidth - 90) + 'px;" /></td><td style="font-size:80%;text-align:right;width:57px;"><button class="sq-btn" id="adddestination" style="margin-left:10px;width:55px;">&nbsp;Add&nbsp;</button></td></tr></table></form><div id="itinerary" style="border-bottom:solid 1px #ccc;border-top:solid 1px #ccc;color:#333;font-size:12px;height:100px;margin:0 -5px 0 -5px;overflow:auto;">' + emptyText + '</div><div style="font-size:80%;margin-top:5px;text-align:center;"><button class="sq-btn" id="createroute">Route</button> <button class="sq-btn" id="closeroute">Close</button></div></div>';
    } else {
      divRoute.innerHTML = '<div id="routetrigger" style="cursor:pointer;font-size:12px;padding:5px;text-align:center;">Directions</div><div id="route" style="border-bottom:solid 1px #CCC;border-left:solid 1px #CCC;border-right:solid 1px #CCC;-moz-box-shadow:0 0 15px #888;-webkit-box-shadow:0 0 15px #888;box-shadow:0 0 15px #888;display:none;font-size:12px;padding:5px;"><input id="routefrom" type="text" style="border:1px solid #D3D3D3;margin-bottom:5px;padding:5px;width:' + (panelWidth - 24) + 'px;" /><input id="routeto" type="text" style="border:1px solid #D3D3D3;padding:5px;width:' + (panelWidth - 24) + 'px;" /><div style="font-size:80%;margin-top:10px;text-align:center;"><button class="sq-btn" id="createroute">Route</button> <button class="sq-btn" id="closeroute">Close</button></div></div>';
    }
    
    divRoute.style.backgroundColor = '#FAF7F5';
    divRoute.style.position = 'absolute';
    divRoute.style.width = panelWidth + 'px';
    divRoute.style.zIndex = '30';
    
    position = position.split(' ');
  
    switch (position[0]) {
      case 'bottom':
        divRoute.className = 'ui-corner-top';
        divRoute.style.bottom = '0px';
        break;
      case 'top':
        divRoute.className = 'ui-corner-bottom';
        divRoute.style.top = '0px';
        break;
    }
  
    switch (position[1]) {
      case 'left':
        divRoute.style.left = '10px';
        break;
      case 'right':
        divRoute.style.right = '10px';
        break;
    }
    
    NPMap.Map.addElementToMapDiv(divRoute);

    if (config.mode === 'multi') {
      $('#routeadd').watermark('Address or landmark');
    } else {
      $('#routefrom').watermark('From address or landmark');
      $('#routeto').watermark('To address or landmark');
    }
    
    $('#closedirections').click(function(e) {
      $('#npmapdirections').hide();
      e.preventDefault();
    });
    $('#closeroute').click(function(e) {
      hideRoutePanel();
      e.preventDefault();
    });
    $('#createroute').click(function(e) {
      if (config.mode === 'multi' && NPMap.Route.destinations.length > 1) {
        $('#adddestination').addClass('disabled');
        $('#createroute').addClass('disabled');
        $('#directionscontent').html('<div style="padding:5px;">Creating route...</div>');
        $('#directionsbuttons').hide();
        $('#npmapdirections').show();
        createRoute(NPMap.Route.destinations);
      } else {
        var from = $('#routefrom').val(),
            to = $('#routeto').val();
            
        if (from && to) {
          var addressFrom = null,
              addressTo = null,
              latLngFrom = null,
              latLngTo = null,
              nameFrom = null,
              nameTo = null,
              splitStringFrom = from.split('@'),
              splitStringTo = to.split('@');
              
          $('#adddestination').addClass('disabled');
          $('#createroute').addClass('disabled');
          $('#directionscontent').html('<div style="padding:5px;">Creating route...</div>');
          $('#directionsbuttons').hide();
          $('#npmapdirections').show();
    
          if (splitStringFrom.length > 1) {
            var latLngSplit = splitStringFrom[1].split(',');
            
            nameFrom = $.trim(splitStringFrom[0]);
    
            if (latLngSplit.length > 1) {
              if (!isNaN(parseFloat(latLngSplit[0])) && !isNaN(parseFloat(latLngSplit[1]))) {
                latLngFrom = splitStringFrom[1];
              }
            }
          } else {
            addressFrom = splitStringFrom;
          }
    
          if (splitStringTo.length > 1) {
            var latLngSplit = splitStringTo[1].split(',');
            
            nameTo = $.trim(splitStringTo[0]);
    
            if (latLngSplit.length > 1) {
              if (!isNaN(parseFloat(latLngSplit[0])) && !isNaN(parseFloat(latLngSplit[1]))) {
                latLngTo = splitStringTo[1];
              }
            }
          } else {
            addressTo = splitStringTo;
          }
          
          createRoute([{
            address: addressFrom,
            latLng: latLngFrom,
            name: nameFrom
          },{
            address: addressTo,
            latLng: latLngTo,
            name: nameTo
          }]);
        }
      }
  
      e.preventDefault();
    });
    $('#routeaddform').live('submit', function() {
      var value = $('#routeadd').val();
  
      if (value) {
        $('#adddestination').addClass('disabled');
        $('#createroute').addClass('disabled');
        NPMap.Route.addDestinationToItinerary(value);
      }
  
      return false;
    });
    $('#routetrigger').click(function(e) {
      showRoutePanel();
      e.preventDefault();
    });
  }
  
  return NPMap.Route = {
    /**
     * Adds a "From" destination to the route.
     * @param {String} address (Optional) The address of the destination.
     * @param {Float} lat (Optional) The latitude of the destination.
     * @param {Float} lng (Optional) The longitude of the destination.
     * @param {String} name (Optional) The name of the destination.
     */
    addDestinationFrom: function(address, lat, lng, name) {
      showRoutePanel(function() {
        if (address) {
          $('#routefrom').val(NPMap.utils.replaceBadCharacters(address));
        } else if (name) {
          $('#routefrom').val(NPMap.utils.replaceBadCharacters(name) + ' @' + lat + ',' + lng);
        } else if (lat && lng) {
          $('#routefrom').val('@' + lat + ',' + lng);
        }
      });
    },
    /**
     * Adds a "To" destination to the route.
     * @param {String} address (Optional) The address of the destination.
     * @param {Float} lat (Optional) The latitude of the destination.
     * @param {Float} lng (Optional) The longitude of the destination.
     * @param {String} name (Optional) The name of the destination.
     */
    addDestinationTo: function(address, lat, lng, name) {
      showRoutePanel(function() {
        if (address) {
          $('#routeto').val(NPMap.utils.replaceBadCharacters(address));
        } else if (name) {
          $('#routeto').val(NPMap.utils.replaceBadCharacters(name) + ' @' + lat + ',' + lng);
        } else if (lat && lng) {
          $('#routeto').val('@' + lat + ',' + lng);
        }
      });
    },
    /**
     * Adds a destination to the itinerary.
     * @param {String} address (Optional) The address of the destination.
     * @param {Float} lat (Optional) The latitude of the destination.
     * @param {Float} lng (Optional) The longitude of the destination.
     * @param {String} name (Optional) The name of the destination.
     */
    addDestinationToItinerary: function(address, lat, lng, name) {
      var me = this;
      
      showRoutePanel(function() {
        if (me.destinations.length < 16) {
          var callback = function(result) {
            function add(a, ll, n) {
              var html = '<tr><td style="padding:5px;" valign="top"></td><td style="padding:5px 0;" valign="top">' + (n ? NPMap.utils.replaceBadCharacters(n) + '<br>' : '') + (a ? NPMap.utils.replaceBadCharacters(a) : '@' + ll) + '</td><td style="padding:5px;text-align:right;" valign="top"></td></tr>';
              
              $('#routeadd').val('');
              me.destinations.push({
                address: a,
                latLng: ll,
                name: n
              });
              $('#itinerarytable tbody').append(html);
              refreshDestinations();
              $.toast({
                message: "Your destination was added to the itinerary!",
                displayTime: 1500,
                inTime: 100,
                outTime: 400
              });
            }
            
            if ($('#itinerary').html().toLowerCase().indexOf('<table') === -1) {
              $('#itinerary').html('<table id="itinerarytable" style="border-collapse:collapse;text-align:left !important;width:100%;"><tbody></tbody></table>');
            }

            if (result.lat && result.lng) {
              add(null, result.lat + ',' + result.lng, name);
            } else if (result.statusCode === 200 && result.statusDescription === 'OK') {
              if (result.resourceSets.length > 0 && result.resourceSets[0].resources.length > 0) {
                // TODO: Add ability to disambiguate.

                var first = result.resourceSets[0].resources[0];

                add(first.address.formattedAddress, first.point.coordinates.join(','), name);
              } else {
                $.toast({
                  message: "Sorry, but that destination could not be found.",
                  displayTime: 4000,
                  inTime: 100,
                  outTime: 400
                });
              }
            } else {
              $.toast({
                message: "Sorry, but there was an error contacting the server.",
                displayTime: 4000,
                inTime: 100,
                outTime: 400
              });
            }
            
            $('#adddestination').removeClass('disabled');
            $('#createroute').removeClass('disabled');
          };
        
          if (address) {
            geocode(callback, address);
          } else if (lat && lng) {
            //geocode(callback, null, lat, lng);
            callback({
              lat: lat,
              lng: lng
            });
          }
        } else {
          $.toast({
            message: "Sorry, but you cannot add more than 15 destinations to your itinerary.",
            displayTime: 4000,
            inTime: 100,
            outTime: 400
          });
        }
      });
    },
    /**
     * Builds a distance string.
     * @param {Number} distance
     * @param {String} unit
     * @return {String}
     */
    buildDistanceString: function(distance, unit) {
      if (unit === 'Mile') {
        unit = 'mi';
      } else if (unit === 'Kilometer') {
        unit = 'km';
      }
      
      if (distance === 0 || distance === 0.00 || distance === 0.0 || distance === 0) {
        return '';
      } else if (distance === 1.00) {
        return '1 ' + unit;
      } else {
        if (distance < 1) {
          return (distance.toFixed(2) + ' ' + unit);
        } else {
          return (distance.toFixed(1) + ' ' + unit);
        }
      }
    },
    /**
     * Builds a duration string.
     * @param {Number} duration
     * @param {String} unit
     * @return {String}
     */
    buildDurationString: function(duration, unit) {
      if (duration === 0) {
        return '';
      }
      
      if (unit === 'Second') {
        if (duration > 60) {
          var seconds = duration % 60,
              minutes = (duration - seconds) / 60;
    
          if (minutes > 60) {
            var minLeft = minutes % 60,
                hours = (minutes - minLeft) / 60;
                 
            return 'about ' + hours + ' hour ' + minLeft + ' min' + getPluralSingular(minLeft);
          } else {
            return 'about ' + minutes + ' min' + getPluralSingular(minutes);
          }
        } else {
          return ('Less than 1 min');
        }
      }
    },
    /**
     * Builds the itinerary HTML structure from a route result. This structure is standard, and can be styled using the NPMap themes.
     * @param {Array} destinations An array of destination objects that will be used to generate the itinerary.
     * @param {Object} result The route result that will be used to generate the itinerary.
     * @return {String} An HTML string for the itinerary.
     */
    buildItineraryHtml: function(destinations, result) {      
      var root = result.resourceSets[0].resources[0],
          distanceUnit = root.distanceUnit,
          durationUnit = root.durationUnit,
          html = '<div class="pyv-directions-details-header"><h2>Driving Directions to ',
          legs = root.routeLegs,
          step = 1,
          totalDistance = root.travelDistance,
          totalDuration = root.travelDuration;
      
      function buildDestinationHtml(index) {
        var letter = abc[index];
        
        return '<h3 class="location-' + letter + ' location"><span class="identifier">' + letter + '</span> <span style="display:block;margin-left:30px;">' + destinations[index].name + '</span></h3>';
      }
      function buildItineraryItemHtml(item) {
        var h = item.instruction.text;
        
        if (item.details && item.details.length > 0) {
          $.each(item.details, function(i, detail) {
            if (detail.names && detail.names.length > 0) {
              $.each(detail.names, function(i2, name) {
                h = h.replace(name, '<strong>' + name + '</strong>');
              });
            }
          });
        }
        
        if (item.hints && item.hints.length > 0) {
          h += '<ul class="section-sub-details">';
          
          $.each(item.hints, function(i, v) {
            h += '<li>' + v.text + '</li>';
          });
          
          h += '</ul>';
        }
        
        return h;
      }
      
      html += destinations[destinations.length - 1].name + '</h2><span class="route-info">Route: ' + totalDistance.toFixed(1) + ' mi, ' + getTime(totalDuration, durationUnit) + '</span>';
      html += buildDestinationHtml(0) + '</div>';
      
      $.each(legs, function(i, leg) {
        var h = '<ul class="pyv-directions-details-directions">',
            letter = abc[i + 1];
        
        $.each(leg.itineraryItems, function(i2, item) {
          var distance = item.travelDistance.toFixed(1);
          
          h += '<li><span class="numeric">' + step + '.</span>';
          h += buildItineraryItemHtml(item);
          
          if (distance !== '0.0') {
            h += '<span class="section-distance">' + distance + ' mi</span></li>';
          }
          
          step++;
        });
        
        h += '</ul>';
        h += '<div class="pyv-directions-details-';
        
        if (i + 1 === legs.length) {
          h += 'footer';
        } else {
          h += 'header';
        }
        
        h += '">' + buildDestinationHtml(i + 1) + '</div>';
        
        html += h;
      });
      
      return html;
    },
    /**
     * Builds a string that can be used to pass data into a print page.
     * @param {Array} destinations
     * @param {Object} options (Optional)
     */
    buildPrintString: function(destinations, options) {
      var u = '?d=';
      
      $.each(destinations, function(i, v) {
        if (v.id) {
          u += 'i:' + v.id + '-,-';
          u += 'l:' + v.latLng + '-,-';
          u += 't:' + v.type;
        } else {
          if (v.address) {
            if (typeof(v.address) === 'string') {
              u += 'a:' + v.address + '-,-';
            } else if (v.address.formattedAddress && v.address.formattedAddress !== v.name) {
              u += 'a:' + v.address.formattedAddress + '-,-';
            }
          }
          
          u += 'l:' + v.latLng + '-,-n:' + v.name + '';
        }
        
        u += '-to-';
      });
      
      u = u.slice(0, u.length - 4);
      u = u.replace(/ /g, '+');
      
      if (options) {
        u += '&o=';
        
        $.each(options, function(i, v) {
          u += i + ':' + v + '-,-';
        });
        
        u = u.slice(0, u.length - 3);
      }
      
      return u;
    },
    /**
     * Builds a route from an array of destination objects.
     * @param {Array} destinations The destination objects to build the route from.
     * @param {Function} callback The function to call when the route operation has been completed. This function will be passed the resulting array.
     * @param {Object} options
     */
    buildRoute: function(destinations, callback, options) {
      var url = 'http://dev.virtualearth.net/REST/v1/Routes?';
      
      this.removeRouteLine();
      
      if (options.roundTrip) {
        destinations.push(destinations[0]);
      }
      
      $.each(destinations, function(i, v) {
        var destination = null;
        
        if (v.address && v.address.formattedAddress) {
          destination = v.address.formattedAddress;
        } else if (v.latLng) {
          destination = v.latLng;
        } else {
          NPMap.utils.throwError('Destination does not have an address or latLng.');
        }
        
        url += 'waypoint.' + (i + 1) + '=' + destination + '&';
      });
            
      url = url.slice(0, url.length - 1) + '&routePathOutput=Points&jsonp=?&key=AqZQwVLETcXEgQET2dUEQIFcN0kDsUrbY8sRKXQE6dTkhCDw9v8H_CY8XRfZddZm';
      
      if (options.avoidHighways) {
        url += '&avoid=highways';
      }
      
      if (options.avoidTools) {
        if (url.indexOf('&avoid') === -1) {
          url += '&avoid=tolls';
        } else {
          url += ',tolls';
        }
      }
      
      if (options.distanceUnit) {
        url += '&distanceUnit=' + options.distanceUnit;
      } else {
        url += '&distanceUnit=mi';
      }
      
      $.getJSON(url, function(result) {
        callback(result);
      });
    },
    /**
     * Clears the route from the map. This includes the route line and all destination markers.
     */
    clearRoute: function() {
      this.removeDestinationMarkers();
      this.removeRouteLine();
    },
    // The module config object.
    config: config,
    /**
     * Creates a destination marker.
     * @param {String} latLng The latLng string, in "latitude,longitude" format to create the marker at.
     * @param {String} letter The letter, A-Z, to label the marker with.
     * @return {Object}
     */
    createDestinationMarker: function(latLng, letter) {
      // TODO: Right now this is Bing-specific.
      var m = NPMap.Map.createMarker(latLng, {
        anchor: new Microsoft.Maps.Point(14, 37),
        height: 37,
        icon: NPMap.config.server + '/npmap/' + NPMap.version + '/modules/resources/route/images/map_marker_waypoint.png',
        text: letter,
        textOffset: new Microsoft.Maps.Point(-6, 5),
        width: 39
      });
      
      destinationMarkers.push(m);
      
      return m;
    },
    // An array of destination objects that have been added to the itinerary.
    destinations: [],
    /**
     * Draws a route on the map.
     * @param {Object} result The route result object.
     * @param {Boolean} addMarkers (Optional) Should destination markers be added too?
     * @param {Function} callback (Optional) A function to call after the route has been drawn on the map.
     */
    drawRouteOnMap: function(result, addMarkers, callback) {
      var me = this,
          destinationLatLngs = [],
          root = result.resourceSets[0].resources[0],
          bbox = root.bbox,
          latLngs = [],
          points = root.routePath.line.coordinates;
      
      $.each(points, function(i, v) {
        latLngs.push(v[0] + ',' + v[1]);
      });
      
      if (addMarkers) {
        $.each(root.routeLegs, function(i, leg) {
          var actualEnd = leg.actualEnd.coordinates,
              actualStart = leg.actualStart.coordinates,
              end = actualEnd[0] + ',' + actualEnd[1],
              start = actualStart[0] + ',' + actualStart[1];
              
          if (destinationLatLngs[destinationLatLngs.length - 1] !== start) {
            destinationLatLngs.push(start);
          }
          
          destinationLatLngs.push(end);
        });
        
        $.each(destinationLatLngs, function(i, latLng) {
          NPMap.Map.addShape(me.createDestinationMarker(latLng, abc[i]));
        });
      }
      
      routeLine = NPMap.Map.createLine(latLngs, {
        strokeColor: new Microsoft.Maps.Color(255, 194, 108, 44),
        strokeThickness: 4
      });
      
      NPMap.Map.addShape(routeLine);
      NPMap.Map.zoomToBoundingBox({
        nw: bbox[2] + ',' + bbox[1],
        se: bbox[0] + ',' + bbox[3]
      });
      
      if (callback) {
        callback(result);
      }
    },
    // An array of event handler objects that have been added to this class.
    events: [],
    /**
     * Geocodes a location using the Bing Maps Location REST service.
     * @param {String} location The location to geocode.
     * @param {Function} callback A function to call when the geocode is completed. This function will be passed back the result {Object} from the geocode operation.
     * @param {Boolean} addressesOnly (Optional) Should this geocode operation only return addresses?
     */
    geocode: function(location, callback) {
      $.getJSON('http://dev.virtualearth.net/REST/v1/Locations?query=' + location + '&jsonp=?&key=AqZQwVLETcXEgQET2dUEQIFcN0kDsUrbY8sRKXQE6dTkhCDw9v8H_CY8XRfZddZm', function(result) {
        var locations = [],
            results = result.resourceSets[0].resources;

        results = filterOutNonAddresses(results);
        
        $.each(results, function(i, v) {
          locations.push({
            address: v.address,
            bbox: v.bbox,
            confidence: v.confidence,
            latLng: v.point.coordinates[0].toFixed(6) + ',' + v.point.coordinates[1].toFixed(6),
            name: v.name,
            type: getType(v.entityType)
          });
        });
        
        locations.sort(function(a, b) {
          var confidenceA = confidenceA,
              confidenceB = confidenceB;
          
          if (confidenceA === 'High') {
            if (confidenceB === 'High') {
              return a.name > b.name;
            } else {
              return true;
            }
          } else if (confidenceA === 'Medium') {
            if (confidenceB === 'High') {
              return false;
            } else if (confidenceB === 'Medium') {
              return a.name > b.name;
            } else {
              return true;
            }
          } else {
            if (confidenceB === 'High' || confidenceB === 'Medium') {
              return false;
            } else {
              return a.name > b.name;
            }
          }
        });
        
        callback(locations);
      });
    },
    /**
     * Performs one of three actions on a destination in the route itinerary: move up, move down, or remove.
     * @param {Object} el The HTML <tr> element to perform the action on.
     * @param {String} The action to perform. Must be 'up', 'down', or 'remove'.
     */
    performDestinationAction: function(el, action) {
      var me = this,
          parent = $(el).parent().parent(),
          html = $('<div>').append(parent.clone()).remove().html(),
          index = $('#itinerarytable tr').index($(el).closest('tr')),
          destination = $.extend({}, me.destinations[index]);
          
      me.destinations.splice(index, 1);
      parent.remove();
      
      if (action === 'down') {
        $('#itinerarytable > tbody > tr').eq(index).after(html);
        me.destinations.splice(index + 1, 0, destination);
      } else if (action === 'up') {
        $('#itinerarytable > tbody > tr').eq(--index).before(html);
        me.destinations.splice(index, 0, destination);
      }
      
      refreshDestinations();
    },
    /**
     * Removes a destination marker from the destinationMarkers array and the map.
     * @param {Object} marker The marker to remove.
     */
    removeDestinationMarker: function(marker) {
      var i = 0;
      
      for (i; i < destinationMarkers.length; i++) {
        // TODO: This is Bing-specific.
        if (destinationMarkers[i].getText() === marker.getText()) {
          break;
        }
      }
      
      destinationMarkers.splice(i, 1);
      NPMap.Map.removeShape(marker);
    },
    /**
     * Removes the route destination markers from the map.
     */
    removeDestinationMarkers: function() {
      $.each(destinationMarkers, function(i, marker) {
        NPMap.Map.removeShape(marker);
      });
      
      destinationMarkers = [];
    },
    /**
     * Removes the route line from the map.
     */
    removeRouteLine: function() {
      if (routeLine) {
        NPMap.Map.removeShape(routeLine);
        routeLine = null;
      }
    }
  };
});