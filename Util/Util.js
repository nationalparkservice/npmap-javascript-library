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
  /**
   * Gets all elements by class.
   * @param {String} cls
   * @return {Array}
   */
  function getElementsByClass(cls) {
    var classElements = [],
        els = document.getElementsByTagName('*'),
        elsLen = els.length,
        pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");

    for (i = 0, j = 0; i < elsLen; i++) {
      if (pattern.test(els[i].className)) {
        classElements[j] = els[i];
        j++;
      }
    }

    return classElements;
  }

  // TODO: Switch all Array.remove() calls over to splice.
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

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
     *
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
     */
    getFirstPropertyOfObject: function(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return obj[key];
        }
      }
    },
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
     *
     */
    getOuterDimensions: function(el) {
      var height = 0,
          width = 0;

      if (el) {
        var changed = [],
            parentNode = el.parentNode;

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
     * Gets the current scroll position of the browser window.
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
     *
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
     *
     */
    hasClass: function(el, cls) {
      return el.className.indexOf(cls) !== -1;
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
     * @param {Function} func (Optional)
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
     *
     */
    monitorResize: function(el, handler) {
      var dimensions = this.getOuterDimensions(el),
          me = this;

      elementsToMonitor.push({
        el: el,
        handler: handler,
        height: dimensions.height,
        width: dimensions.width
      });

      if (!elementResizeInterval) {
        elementResizeInterval = setInterval(function() {
          for (var i = 0; i < elementsToMonitor.length; i++) {
            var e = elementsToMonitor[i],
                d = me.getOuterDimensions(e.el);

            if (e.height !== d.height || e.width !== d.width) {
              e.handler(d);

              e.height = d.height;
              e.width = d.width;
            }
          }
        }, 0);
      }
    },
    /**
     *
     */
    removeClass: function(el, cls) {
      el.className = el.className.replace(cls, '');
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
          }, 250);
    },
    /**
     * Stops the propagation of all events.
     * @param {Object} el
     */
    stopAllPropagation: function(el) {
      for (var i = 0; i < propagationEvents.length; i++) {
        var propagationEvent = propagationEvents[i];

        if (propagationEvent === 'mousewheel') {
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
    },
    /**
     *
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