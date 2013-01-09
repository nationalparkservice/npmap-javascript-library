define(function() {
  var
      // The interval for the div resize.
      elementResizeInterval = null,
      // The elements to monitor for changes in size.
      elementsToMonitor = [],
      // Events to cancel when stopPropagation is called.
      propagationEvents = [
        'click',
        'contextmenu',
        'dblclick',
        'mousedown',
        'mouseover',
        'mouseup'
      ];

  /**
   * Adds an event listener to an element.
   * @param {Object} el
   * @param {String} name
   * @param {Function} handler
   * @return null
   */
  function bindEvent(el, name, handler) {
    if (el.addEventListener){
      el.addEventListener(name, handler, false);
    } else if (el.attachEvent){
      el.attachEvent('on' + name, handler);
    }
  }
  /**
   * Gets all elements by class.
   * @param {String} cls
   * @return {Array}
   */
  function getElementsByClass(cls) {
    var classElements = [],
        els = document.getElementsByTagName('*'),
        elsLen = els.length,
        pattern = new RegExp("(^|\\s)"+cls+"(\\s|$)");

    for (i = 0, j = 0; i < elsLen; i++) {
      if (pattern.test(els[i].className)) {
        classElements[j] = els[i];
        j++;
      }
    }

    return classElements;
  }

  if (!LazyLoader) {
    /**
     * https://github.com/LukeTheDuke/Lazyloader
     */
    var LazyLoader=function(i,j){function k(a){var a=a.toLowerCase(),b=a.indexOf("js"),a=a.indexOf("css");return-1==b&&-1==a?!1:b>a?"js":"css"}function m(a){var b=document.createElement("link");b.href=a;b.rel="stylesheet";b.type="text/css";b.onload=c;b.onreadystatechange=function(){("loaded"==this.readyState||"complete"==this.readyState)&&c()};document.getElementsByTagName("head")[0].appendChild(b)}function f(a){try{document.styleSheets[a].cssRules?c():document.styleSheets[a].rules&&document.styleSheets[a].rules.length?c():setTimeout(function(){f(a)},250)}catch(b){setTimeout(function(){f(a)},250)}}function c(){g--;0==g&&j&&j()}for(var g=0,d,l=document.styleSheets.length-1,h=0;h<i.length;h++)if(g++,d=i[h],"css"==k(d)&&(m(d),l++,!window.opera&&-1==navigator.userAgent.indexOf("MSIE")&&f(l)),"js"==k(d)){var e=document.createElement("script");e.type="text/javascript";e.src=d;e.onload=c;document.getElementsByTagName("head")[0].appendChild(e)}};
  }

  // TODO: Switch all Array.remove() calls over to splice and get rid of this.
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  // TODO: This is here because String.trim is not supported in IE7/8.
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }

  return NPMap.Util = {
    /**
     * Adds a CSS class to an element.
     * @param {Object} el
     * @param {String} cls
     * @return null
     */
    addClass: function(el, cls) {
      el.className = el.className += ' ' + cls;
    },
    /**
     * Binds an event to an HTML element.
     * @param {Object} el
     * @param {String} name
     * @param {Function} handler
     * @return null
     */
    bindEventToElement: function(el, name, handler) {
      bindEvent(el, name, handler);
    },
    /**
     * Converts a 0-255 opacity to 0-1.0.
     * @param {Number} opacity
     * @return {Number}
     */
    convertOpacity: function(opacity) {
      return (opacity / 25.5) * 0.1;
    },
    /**
     * Given an object, does a property exist?
     * @param {Object} obj The object to test.
     * @param {String} prop The property to look for. Ex: 'NPMap.config.tools.keyboard'.
     * @return {Boolean}
     */
    doesPropertyExist: function(obj, prop) {
      var parts = prop.split('.');
      
      for (var i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];
        
        if (obj !== null && typeof obj === "object" && part in obj) {
          obj = obj[part];
        } else {
          return false;
        }
      }

      return true;
    },
    /**
     * Cancels a mousewheel event.
     * @param {Object} e
     * @return {Boolean}
     */
    eventCancelMouseWheel: function(e) {
      e = e || window.event;

      if (e.preventDefault) {
        e.preventDefault();
      }

      if (e.stopPropagation) {
        e.stopPropagation();
      }

      e.cancelBubble = true;
      e.returnValue = false;

      return false;
    },
    /**
     * Cross-browser cancel event propagation.
     * @param {Object} e
     * @return null
     */
    eventCancelPropagation: function(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else if (window.event) {
        window.event.cancelBubble = true;
      }
    },
    /**
     * Gets elements by class name.
     * @param {String} cls
     * @return {Array}
     */
    getElementsByClass: function(cls) {
      if (document.getElementsByClassName) {
        return document.getElementsByClassName(cls);
      } else {
        return getElementsByClass(cls);
      }
    },
    /**
     * Gets the first property of an object.
     * @param {Object} obj The object to get the first property of.
     * @return {Array}|{Boolean}|{Function}|{Object}
     */
    getFirstPropertyOfObject: function(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return obj[key];
        }
      }
    },
    /**
     * Gets the mouse position, in pixels and relative to the page, for a MouseEvent object. Taken from mapbox/wax - https://github.com/mapbox/wax.
     * @param {Object} e
     * @return {Object}
     */
    getMousePositionPage: function(e) {
      if (e.pageX || e.pageY) {
        return {
          x: e.pageX,
          y: e.pageY
        };
      } else if (e.clientX || e.clientY) {
        return {
          x: e.clientX,
          y: e.clientY
        };
      } else if (e.touches && e.touches.length === 1) {
        return {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        };
      }
    },
    /**
     * Gets the next sibling element.
     * @param {Object} el
     * @return {Object}
     */
    getNextElement: function(el) {
      do {
        el = el.nextSibling;
      } while (el && el.nodeType != 1);
      
      return el;
    },
    /**
     * Gets the offset, in pixels, of an element.
     * @param {Object} el
     * @return {Object}
     */
    getOffset: function(el) {
      for (var lx=0, ly=0; el !== null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    
      return {
        left: lx,
        top: ly
      };
    },
    /**
     * Gets the outer dimensions, in pixels, of an HTML element.
     * @param {Object} el
     * @return {Object}
     */
    getOuterDimensions: function(el) {
      var height = 0,
          width = 0;

      if (el) {
        var changed = [],
            parentNode = el.parentNode;

        // TODO: Clean this up, function declarations should not be placed in blocks.
        function checkDisplay(node) {
          if (node.style && node.style.display === 'none') {
            changed.push(node);
            node.style.display = 'block';
          }
        }
        
        checkDisplay(el);

        if (el.id !== 'npmap' && parentNode) {
          checkDisplay(parentNode);

          while (parentNode.id && parentNode.id !== 'npmap' && parentNode.id !== 'npmap-map') {
            parentNode = parentNode.parentNode;

            if (parentNode) {
              checkDisplay(parentNode);
            }
          }
        }

        height = el.offsetHeight;
        width = el.offsetWidth;

        changed.reverse();

        for (var i = 0; i < changed.length; i++) {
          changed[i].style.display = 'none';
        }
      }

      return {
        height: height,
        width: width
      };
    },
    /**
     * Gets the width of the browser's vertical scrollbar.
     * @return {Number}
     */
    getScrollBarWidth: function() {
      var inner = document.createElement('p');
      inner.style.width = "100%";
      inner.style.height = "200px";

      var outer = document.createElement('div');
      outer.style.position = "absolute";
      outer.style.top = "0px";
      outer.style.left = "0px";
      outer.style.visibility = "hidden";
      outer.style.width = "200px";
      outer.style.height = "150px";
      outer.style.overflow = "hidden";
      outer.appendChild (inner);

      document.body.appendChild(outer);
      var w1 = inner.offsetWidth;
      outer.style.overflow = 'scroll';
      var w2 = inner.offsetWidth;
      if (w1 == w2) w2 = outer.clientWidth;

      document.body.removeChild (outer);

      return (w1 - w2);
    },
    /**
     * Gets the current scroll position, in pixels, of the browser window.
     * @return {Object}
     */
    getScrollPosition: function() {
      var position = {
        left: 0,
        top: 0
      };

      if (typeof window.pageYOffset !== 'undefined') {
        position.left = window.pageXOffset;
        position.top = window.pageYOffset;
      } else if (typeof document.documentElement.scrolltop !== 'undefined' && document.documentElement.scrollTop > 0) {
        position.left = document.documentElement.scrollLeft;
        position.top = document.documentElement.scrollTop;
      } else if (typeof document.body.scrollTop !== 'undefined') {
        position.left = document.body.scrollLeft;
        position.top = document.body.scrollTop;
      }

      return position;
    },
    /**
     * Gets the current window dimensions, in pixels.
     * @return {Object}
     */
    getWindowDimensions: function() {
      var height = 0,
          width = 0;

      if (typeof window.innerWidth === 'number') {
        height = window.innerHeight;
        width = window.innerWidth;
      } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        height = document.documentElement.clientHeight;
        width = document.documentElement.clientWidth;
      } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        height = document.body.clientHeight;
        width = document.body.clientWidth;
      }
      
      return {
        height: height,
        width: width
      };
    },
    /**
     * Checks to see if an HTML element has a CSS class.
     * @param {Object} el
     * @param {String} cls
     * @return {Boolean}
     */
    hasClass: function(el, cls) {
      if (!el.className) {
        return false;
      } else {
        return el.className.indexOf(cls) !== -1;
      }
    },
    /**
     * Converts a HEX color to RGB.
     * @param {String} hex The HEX string to convert.
     * @return {String}
     */
    hexToRgb: function(hex) {
      var i = 3,
          rgb = hex.replace('#', '').match(/(.{2})/g);
          
      while (i--) {
        rgb[i] = parseInt(rgb[i], 16);
      }
      
      return rgb;
    },
    /**
     * Injects a CSS stylesheet or multiple CSS stylesheets into the page.
     * @param {String/Array} location The path to the CSS stylesheet.
     * @param {Function} callback (Optional)
     * @return null
     */
    injectCss: function(locations, callback) {
      if (typeof locations === 'string') {
        locations = [
          locations
        ];
      }

      LazyLoader(locations, callback);
    },
    /**
     * Returns true if the test number falls between the start and end numbers.
     * @param {Number} start
     * @param {Number} end
     * @param {Number} test
     * @return {Boolean}
     */
    isBetween: function(start, end, test) {
      if ((test <= start && test >= end) || (test >= start && test <= end)) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * Returns true if the number passed in is an integer.
     * @param {Number} int The number to test.
     * @return {Boolean}
     */
    isInt: function(n) {
      return n % 1 === 0;
    },
    /**
     * UNDOCUMENTED
     */
    isLocalUrl: function(url) {
      return (url.indexOf('http://') !== -1 && url.indexOf(location.host) === -1);
    },
    /**
     * Detects if a MouseEvent is a right-click event.
     * @param {Object} e
     * @return {Boolean}
     */
    isRightClick: function(e) {
      var isRight = false;

      e = e || window.event;

      if ("which" in e) {
        isRight = e.which === 3;
      } else if ("button" in e) {
        isRight = e.button === 2;
      }
      
      return isRight;
    },
    /**
     * Iterates through all of the child nodes of an element.
     * @param {Object} el
     * @param {Function} func
     * @return null
     */
    iterateThroughChildNodes: function(el, func) {
      if (el && el.childNodes) {
        for (var i = 0; i < el.childNodes.length; i++) {
          var childNode = el.childNodes[i];

          if (func) {
            func(childNode);
          }

          this.iterateThroughChildNodes(childNode, func);
        }
      }
    },
    /**
     * Monitors an HTML element and calls the handler when its size changes.
     * @param {Object} el
     * @param {Function} handler
     * @return null
     */
    monitorResize: function(el, handler) {
      var dimensions = this.getOuterDimensions(el),
          me = this;

      if (!elementsToMonitor.length) {
        (function loop() {
          setTimeout(function() {
            for (var i = 0; i < elementsToMonitor.length; i++) {
              var e = elementsToMonitor[i],
                  d = me.getOuterDimensions(e.el);

              if (e.height !== d.height || e.width !== d.width) {
                e.handler(d);

                e.height = d.height;
                e.width = d.width;
              }
            }

            loop();
          }, 16);
        })();
      }

      elementsToMonitor.push({
        el: el,
        handler: handler,
        height: dimensions.height,
        width: dimensions.width
      });
    },
    /**
     * Removes a CSS class from an HTML element.
     * @param {Object} el
     * @param {String} cls
     * @return null
     */
    removeClass: function(el, cls) {
      el.className = el.className.replace(cls, '');
    },
    /**
     * DEPRECATED: STILL USED BY ROUTE MODULE.
     * Replaces "bad characters" that have been inserted by NPMap into strings.
     * @param {String} html The HTML string to perform the replace operation on.
     * @return {String}
     */
    replaceBadCharacters: function(html) {
      return html.replace(/{singlequote}/g, '\'');
    },
    /**
     * Checks to make sure a module has been loaded before calling callback function. This function assumes that the module resides in the NPMap namespace.
     * @param module {String} The full name of the module, including namespace, that must be loaded before callback is called.
     * @param callback {Function} The callback function to call once the module has been loaded.
     * @return null
     */
    safeLoad: function(module, callback) {
      var interval,
          partition = module.replace('NPMap.', '').split('.');
          
      interval = setInterval(function() {
        try {
          var obj = NPMap;

          for (var i = 0; i < partition.length; i++) {
            obj = obj[partition[i]];
            
            if (typeof obj === 'undefined') {
              break;
            } else if ((i + 1) === partition.length) {
              clearInterval(interval);
              callback();
            }
          }
        } catch (e) {

        }
      }, 250);
    },
    /**
     * Stops the propagation of all events on an HTML element.
     * @param {Object} el
     * @return null
     */
    stopAllPropagation: function(el) {
      var me = this;

      for (var i = 0; i < propagationEvents.length; i++) {
        bindEvent(el, propagationEvents[i], me.eventCancelPropagation, false);
      }
    },
    /**
     * Strips all HTML from a string.
     * @param {String} html The string to strip HTML from.
     * @return {String}
     */
    stripHtmlFromString: function(html) {
      var div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    },
    /**
     * Trims whitespace from the beginning and end of a string.
     * @param {String} string
     * @return {String}
     */
    trimString: function(string) {
      string = string.replace(/^\s+/, '');

      for (var i = string.length - 1; i >= 0; i--) {
        if (/\S/.test(string.charAt(i))) {
          string = string.substring(0, i + 1);
          break;
        }
      }
      return string;
    }
  };
});