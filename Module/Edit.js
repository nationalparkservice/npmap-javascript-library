define(function() {
  // The module config object.
  var config = (function() {
    for (var i = 0; i < NPMap.config.modules.length; i++) {
      if (NPMap.config.modules[i].name === 'edit') {
        return NPMap.config.modules[i];
      }
    }
  })();
  
  return NPMap.Edit = {
    // The module config object.
    config: config,
    // An array of event handler objects that have been added to this class.
    events: [],
    /**
     * Removes all of the shapes that have been created by the edit module from the map.
     */
    removeAllShapes: function() {
      _.each(NPMap[NPMap.config.api].modules.edit.shapes, function(shape) {
        NPMap[NPMap.config.api].map.removeShape(shape);
      });
      NPMap[NPMap.config.api].modules.edit.shapes = [];
    }
  };
});