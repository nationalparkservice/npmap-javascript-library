define(function() {
  var
      // Contains all the active events.
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
      var cls = obj.replace('NPMap.', ''),
          e = {
            cls: cls,
            event: event,
            func: func,
            id: id,
            single: single || false
          };

      NPMap[cls]._events = NPMap[cls]._events || [];
      
      NPMap[cls]._events.push(e);
      activeEvents.push(e);

      id++;

      return id - 1;
    },
    /**
     * Remove an existing event from an NPMap class.
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

      for (var i = 0; i < NPMap[cls]._events.length; i++) {
        if (NPMap[cls]._events[i].id === id) {
          index = i;
          break;
        }
      }
      
      if (index !== -1) {
        NPMap[cls]._events.splice(index, 1);
      }
    },
    /**
     * Triggers an event.
     * @param {String} obj The name of the nested class, in "NPMap.ObjectName" format, to trigger the event for.
     * @param {String} event The name of the event to trigger.
     * @param {Object} e (Optional) The event object to pass to the event handler function.
     * @return null
     */
    trigger: function(obj, event, e) {
      var cl = obj.replace('NPMap.', ''),
          remove = [];

      if (typeof NPMap[cl] !== 'undefined' && typeof NPMap[cl]._events !== 'undefined') {
        for (var i = 0; i < NPMap[cl]._events.length; i++) {
          var v = NPMap[cl]._events[i];

          if (v.event === event) {
            if (!e) {
              v.func();
            } else {
              v.func(e);
            }

            if (v.single === true) {
              remove.push(v);
            }
          }
        }

        _.each(remove, function(handler) {
          NPMap[cl]._events.splice(NPMap[cl]._events.indexOf(handler), 1);
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