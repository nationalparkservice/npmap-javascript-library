define(function() {
  var queue = [];

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
        queue.push({
          cl: cl,
          event: event,
          func: func
        });
      }
    },
    // TODO: I don't think this is still needed. Check into it. You should be able to talk the call out of bootstrap.js too.
    /**
     * Processes the NPMap.Event queue.
     */
    processQueue: function() {
      for (var i = 0; i < queue.length; i++) {
        var q = queue[i];

        NPMap[q.cl]._events.push({
          event: q.event,
          func: q.func
        });
      }
      
      if (queue.length === 0) {
        delete NPMap.Event.processQueue;
      } else {
        // TODO: Should you delay then processQueue again here?
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
      
      if (this.processQueue) {
        this.processQueue();
      }
      
      if (typeof NPMap[cl] !== 'undefined') {
        for (var i = 0; i < NPMap[cl]._events.length; i++) {
          var v = NPMap[cl]._events[i];

          if (v.event === event) {
            if (!e) {
              v.func();
            } else {
              v.func(e);
            }

            break;
          }
        }
      } else {
        var me = this;
        
        console.log('Event ("' + obj + ', ' + event + '") triggered, but class does not exist. Looping at 100...');
        setTimeout(function() {
          me.trigger(obj, event, e);
        }, 100);
      }
    }
  };
});