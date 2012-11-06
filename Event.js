/**
 * @module NPMap.Event
 */
define(function() {
  var
      // Contains all of the active events.
      activeEvents = [],
      // An incrementing integer to use for event ids.
      id = 0;

  return NPMap.Event = {
    /**
     * Add an event to an NPMap class.
     * @param {String} obj The name of the nested class, in "NPMap.ObjectName" format, to add the event to.
     * @param {String} event The name of the event to add to the class.
     * @param {Function} func The function to call when the event is fired.
     * @param {Boolean} single Should this event only be called once and then disposed?
     * @return {Number}
     */
    add: function(obj, event, func, single) {
      activeEvents.push({
        cls: obj.replace('NPMap.', ''),
        event: event,
        func: func,
        id: id,
        single: single || false
      });

      id++;

      return id - 1;
    },
    /**
     * Gets all the events, and optionally just the events that have been added to a modulezs.
     * @param {String} obj (Optional)
     * @return {Array}
     */
    get: function(obj) {
      var events = [];

      if (!obj) {
        events = activeEvents;
      } else {
        var cls = obj.replace('NPMap.', '');

        for (var i = 0; i < activeEvents.length; i++) {
          var active = activeEvents[i];

          if (active.cls === cls) {
            events.push(active);
          }
        }
      }

      return events;
    },
    /**
     * Removes an existing event from a NPMap module.
     * @param {Number} id
     * @return null
     */
    remove: function(id) {
      var cls,
          index = -1;

      for (var i = 0; i < activeEvents.length; i++) {
        var activeEvent = activeEvents[i];

        if (activeEvent.id === id) {
          cls = activeEvent.cls;
          index = i;
          break;
        }
      }

      if (index !== -1) {
        activeEvents.splice(index, 1);
      }

      index = -1;
    },
    /**
     * Triggers an event.
     * @param {String} obj The name of the nested class, in "NPMap.ObjectName" format, to trigger the event for.
     * @param {String} event The name of the event to trigger.
     * @param {Object} e (Optional) The event object to pass to the event handler function.
     * @return null
     */
    trigger: function(obj, event, e) {
      var cls = obj.replace('NPMap.', ''),
          remove = [];

      if (typeof NPMap[cls] !== 'undefined') {
        for (var i = 0; i < activeEvents.length; i++) {
          var v = activeEvents[i];

          if (cls === v.cls && v.event === event) {
            if (!e) {
              v.func();
            } else {
              v.func(e);
            }

            if (v.single === true) {
              remove.push(i);
            }
          }
        }

        _.each(remove, function(index) {
          activeEvents.splice(index, 1);
        });
      } else {
        var me = this;
        
        console.log('Event ("' + obj + ', ' + event + '") triggered, but class does not exist. Looping in 100ms...');
        setTimeout(function() {
          me.trigger(obj, event, e);
        }, 100);
      }
    }
  };
});