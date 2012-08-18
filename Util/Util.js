define(function() {
  var
      // The interval for the div resize.
      divResizeInterval,
      // The divs to monitor for changes in size.
      divsToMonitor = [],
      // Events to cancel when stopPropagation is called.
      propagationEvents = [
        'click',
        'contextmenu',
        'dblclick',
        'mousedown',
        'mouseover',
        'mouseup',
        'mousewheel',
        'scroll',
        'wheel'
      ];

  /**
   * Cross-browser cancel event propagation.
   * @param {Object} e
   */
  function cancelEventPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }
  /**
   * Cancels the mouse wheel event.
   * @param {Object} e
   */
  function cancelMouseWheel(e) {
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
  }

  // TODO: Switch all Array.remove() calls over to splice.
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  return NPMap.Util = {
    /**
     * Given an object, does a property exist.
     * @param {Object} obj The object to test.
     * @param {String} prop The property to look for. Ex: 'NPMap.config.tools.keyboard'.
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
     * Gets the first property of an object.
     * @param {Object} obj The object to get the first property of.
     */
    getFirstPropertyOfObject: function(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return obj[key];
        }
      }
    },
    // TODO: Rename to getContainerDivOffset.
    /**
     * Gets the offset, in pixels, of the map div in the page.
     * @return {Object}
     */
    getMapDivOffset: function() {
      var offset = $('#' + NPMap.config.div).offset();
      
      return {
        left: offset.left,
        top: offset.top
      };
    },
    /**
     * Gets the current scroll position of the browser window.
     */
    getScrollPosition: function() {
      var position = {
        x: 0,
        y: 0
      };

      if (typeof window.pageYOffset !== 'undefined') {
        position.x = window.pageXOffset;
        position.y = window.pageYOffset;
      } else if (typeof document.documentElement.scrolltop !== 'undefined' && document.documentElement.scrollTop > 0) {
        position.x = document.documentElement.scrollLeft;
        position.y = document.documentElement.scrollTop;
      } else if (typeof document.body.scrollTop !== 'undefined') {
        position.x = document.body.scrollLeft;
        position.y = document.body.scrollTop;
      }

      return position;
    },
    /**
     * Injects a CSS stylesheet into the page.
     * @param {String} location The path to the CSS stylesheet.
     */
    injectCss: function(location) {
      if (document.createStyleSheet) {
        document.createStyleSheet(location);
      } else {
        var c = document.createElement('link');
        c.type = 'text/css';
        c.rel = 'stylesheet';
        c.href = location;
        c.media = 'screen';
        document.getElementsByTagName("head")[0].appendChild(c);
      }
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
     *
     */
    monitorDivSize: function(el, handler) {
      divsToMonitor.push(el);

      if (!divResizeInterval) {
        divResizeInterval = setInterval(function() {
          for (var i = 0; i < divsToMonitor.length; i++) {
            
          }
        }, 250);
      }
    },
    /**
     * Replaces "bad characters" that have been inserted by NPMap into strings.
     * @param {String} html The HTML string to perform the replace operation on.
     * @return {String}
     */
    replaceBadCharacters: function(html) {
      return html.replace(/{singlequote}/g, '\'');
    },
    /**
     * Checks to make sure a module has been loaded before calling callback function. This function assumes that the module resides in the NPMap namespace.
     * @param module {String} (Required) The full name of the module, including namespace, that must be loaded before callback is called.
     * @param callback {Function} (Required) The callback function to call once the module has been loaded.
     */
    safeLoad: function(module, callback) {
      module = module.replace('NPMap.', '');
      
      var partition = module.split('.'),
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
          }, 100);
    },
    /**
     * Stops the propagation of all events.
     * @param {Object} el
     */
    stopAllPropagation: function(el) {
      for (var i = 0; i < propagationEvents.length; i++) {
        var propagationEvent = propagationEvents[i];

        if (propagationEvent === 'mousewheel') {
          // http://www.stoimen.com/blog/2009/07/01/javascript-disable-mouse-wheel/
          el.addEventListener('mousewheel', cancelMouseWheel, false);
        } else {
          el.addEventListener(propagationEvent, cancelEventPropagation, false);
        }
        
      }
    },
    /**
     * Strips HTML elements from a string.
     * @param {String} html The string to strip HTML from.
     * @return {String}
     */
    stripHtmlFromString: function(html) {
      var div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    }
  };
});