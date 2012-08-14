define(function() {
  return NPMap.Event = {
    /**
     * Add an event to an NPMap class.
     * @param {String} obj The name of the nested class, in "NPMap.ObjectName" format, to add the event to.
     * @param {String} event The name of the event to add to the class.
     * @param {Function} func The function to call when the event is fired.
     */
    add: function(obj, event, func) {
      var cl = obj.replace('NPMap.', '');

      if (NPMap[cl]) {
        NPMap[cl]._events = NPMap[cl]._events || [];
        
        NPMap[cl]._events.push({
          event: event,
          func: func
        });
      } else {
        var me = this;

        setTimeout(function() {
          me.add(obj, event, func);
        }, 100);
      }
    },
    /**
     * Remove an existing event from an NPMap class.
     * @param {String} obj The name of the nested class, in "NPMap.ObjectName" format, to remove the event from.
     * @param {String} event The name of the event to remove to the class.
     * @param {Function} func The function to remove.
     */
    remove: function(obj, event, func) {
      var cl = obj.replace('NPMap.', '');
      
      if (NPMap[cl]) {
        var index = -1;
        
        for (var i = 0; i < NPMap[cl]._events.length; i++) {
          if (NPMap[cl]._events[i].event === event) {
            index = i;
            break;
          }
        }

        if (index != -1) {
          NPMap[cl]._events.slice(index, 1);
        }
      }
    },
    /**
     * Triggers an event.
     * @param {String} obj The name of the nested class, in "NPMap.ObjectName" format, to trigger the event for.
     * @param {String} event The name of the event to trigger.
     * @param {Object} e (Optional) The event object to pass to the event handler function.
     */
    trigger: function(obj, event, e) {
      var cl = obj.replace('NPMap.', '');

      if (typeof NPMap[cl] !== 'undefined' && typeof NPMap[cl]._events !== 'undefined') {
        for (var i = 0; i < NPMap[cl]._events.length; i++) {
          var v = NPMap[cl]._events[i];

          if (v.event === event) {
            if (!e) {
              v.func();
            } else {
              v.func(e);
            }
          }
        }
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