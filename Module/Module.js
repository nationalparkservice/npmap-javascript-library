define([
  'Event',
  'Map/Map',
  'Util/Util'
], function(Event, Map, Util) {
  var
      //
      _build = [],
      // The map div.
      _divMap = document.getElementById(NPMap.config._div),
      // The npmap div.
      _divNpmap = document.getElementById('npmap'),
      //
      _divModules = document.createElement('div'),
      // The modules close div.
      _divModulesClose = document.createElement('div'),
      // The module tabs div.
      _divModulesTabs = document.createElement('div'),
      //
      _modules = NPMap.config.modules;

  /**
   *
   */
  function _cancelMouseWheel(el) {
    bean.add(el, 'mousewheel', function(e) {
      if ((this.scrollTop === 0 && e.wheelDeltaY > 0) || ((this.scrollTop === (this.scrollHeight - this.offsetHeight)) && e.wheelDeltaY < 0)) {
        Util.eventCancelMouseWheel(e);
      }
    });
  }

  _divModules.id = 'npmap-modules';
  _divModulesClose.className = 'npmap-modules-tabs';
  _divModulesClose.id = 'npmap-modules-close';
  _divModulesClose.innerHTML = '<button class="npmap-module-tab"><i class="icon-close"></i></button>';
  _divModulesTabs.className = 'npmap-modules-tabs';
  _divModulesTabs.id = 'npmap-modules-tabs';
  _divNpmap.insertBefore(_divModules, _divMap);
  _divNpmap.insertBefore(_divModulesClose, _divMap);
  bean.add(document.getElementById('npmap-modules-close').childNodes[0], 'click', function() {
    NPMap.Module.hide();
  });
  Map.addControl(_divModulesTabs);
  _.each(_modules, function(module) {
    var name = module.name;

    if (name) {
      var id = name.toLowerCase();

      module.id = id.split(' ').join('_');

      if (id !== 'directions' && id !== 'edit') {
        _build.push(module);
      }
    }
  });

  if (_build.length) {
    _.each(_build, function(module) {
      NPMap.Module.add(module, true);
    });
  }

  Event.add('NPMap.Map', 'resized', function() {
    _.each(_divModules.childNodes, function(childNode) {
      var childNodes = childNode.childNodes;

      childNodes[1].style.height = (Util.getOuterDimensions(_divModules).height - Util.getOuterDimensions(childNodes[0]).height - 24) + 'px';
    });
  });

  return NPMap.Module = {
    /**
     * Adds a module to the modules panel.
     * @param {Object} module
     * @param {Boolean} cancelMouseWheel (Optional)
     * @return null
     */
    add: function(module, cancelMouseWheel) {
      var divModule = document.createElement('div'),
          divTab = document.createElement('button'),
          htmlContent;

      divModule.id = 'npmap-modules-' + module.id;

      if (typeof module.html === 'string') {
        htmlContent = module.html;
      } else {
        htmlContent = '<div class="npmap-module-title">' + module.title + '</div><div class="npmap-module-content">';

        if (typeof module.description === 'string' && module.description.length) {
          htmlContent += '<div class="description">' + module.description + '</div>';
        }

        htmlContent += module.content + '</div>';
      }

      divModule.innerHTML = htmlContent;
      _divModules.appendChild(divModule);
      divTab.id = 'npmap-modules-tabs-' + module.id;
      divTab.className = 'npmap-module-tab';
      divTab.innerHTML = '<i class="icon-' + module.icon + '"></i>';
      bean.add(divTab, 'click', function(e) {
        NPMap.Module.open(this);
        return false;
      });
      _divModulesTabs.appendChild(divTab);

      if (cancelMouseWheel) {
        _cancelMouseWheel(divModule);
      }
    },
    /**
     * Closes the UI for a module.
     * @param {Object} el
     * @return null
     */
    close: function() {

    },
    /**
     * Hides the modules panel.
     * @return null
     */
    hide: function() {
      _divModulesClose.style.display = 'none';
      _divModules.style.display = 'none';
      _divModulesTabs.style.display = 'block';
      _divMap.style.left = '0';
    },
    /**
     * Opens the UI for a module.
     * @param {Object} el
     * @return null
     */
    open: function(el) {
      var id = el.id.replace('npmap-modules-tabs-', ''),
          module;

      for (var i = 0; i < NPMap.config.modules.length; i++) {
        var m = NPMap.config.modules[i];

        if (m.id === id) {
          module = m;
          break;
        }
      }

      this.show();
    },
    /**
     * Shows the modules panel.
     * @return null
     */
    show: function() {
      if (_divModules.style.display === '' || _divModules.style.display === 'none') {
        _divModulesTabs.style.display = 'none';
        _divMap.style.left = '250px';
        _divModules.style.display = 'block';
        _divModulesClose.style.display = 'block';
      }
    }
  };
});