define([
  'Module/Module'
], function(Module) {
  // The module config object.
  var config = (function() {
    for (var i = 0; i < NPMap.config.modules.length; i++) {
      if (NPMap.config.modules[i].name === 'edit') {
        return NPMap.config.modules[i];
      }
    }
  })();

  //NPMap.Map[NPMap.config.api]._initializeDrawingTools();
  
  return NPMap.Module.Edit = {
    //
    _shapes: [],
    /**
     *
     */
    _getConfig: function() {
      return config;
    },
    /**
     *
     */
    clearShapes: function() {
      _.each(this._shapes, function(shape) {
        NPMap.Map.removeShape(shape);
      });

      this._shapes = [];
    }
  };
});