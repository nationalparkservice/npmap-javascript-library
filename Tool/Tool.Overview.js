define([
  'Event',
  'Map/Map',
  'Tool/Tool'
],function(Event, Map, Tool) {
  var
      //
      _config = NPMap.config._tools.overview;

  // TODO: This is currently Bing specific.
  /*
  if (configTools.overview && NPMap.config.api.toLowerCase() === 'bing') {
    var divOverview = document.createElement('div');

    divOverview.id = 'npmap-overview';
    divOverview.innerHTML = '<div id="npmap-overview-title" style="color:#454545;display:none;padding:8px;position:absolute;">Overview Map</div><div id="npmap-overview-map" style="bottom:0px;left:0px;position:absolute;right:0px;top:0px;"></div>';
    divOverview.style.bottom = Util.getOuterDimensions(divAttribution).height + 'px';
    
    elements.push({
      el: divOverview,
      func: function() {
        var divOverviewButton = document.createElement('div'),
            divOverviewMap = document.getElementById('npmap-overview-map'),
            divOverviewTitle = document.getElementById('npmap-overview-title'),
            mapOverview = new Microsoft.Maps.Map(divOverviewMap, {
              credentials: NPMap.config.credentials ? NPMap.config.credentials : 'AqZQwVLETcXEgQET2dUEQIFcN0kDsUrbY8sRKXQE6dTkhCDw9v8H_CY8XRfZddZm',
              disablePanning: true,
              disableZooming: true,
              fixedMapPosition: true,
              mapTypeId: Microsoft.Maps.MapTypeId.road,
              showBreadcrumb: false,
              showCopyright: false,
              showDashboard: false,
              showLogo: false,
              showMapTypeSelector: false,
              showScalebar: false
            });

        function updateOverviewMap() {
          var bounds = NPMap.bing.map.Map.getBounds(),
              nw = bounds.getNorthwest(),
              se = bounds.getSoutheast(),
              ne = new Microsoft.Maps.Location(se.latitude, nw.longitude),
              sw = new Microsoft.Maps.Location(nw.latitude, se.longitude);
          
          mapOverview.setView({
            bounds: bounds,
            padding: 20
          });
          mapOverview.entities.clear();

          if (Util.hasClass(divOverviewButton, 'expanded')) {
            mapOverview.entities.push(new Microsoft.Maps.Polygon([
              nw,
              ne,
              se,
              sw,
              nw
            ], {
              fillColor: new Microsoft.Maps.Color(175, 218, 233, 228),
              strokeColor: new Microsoft.Maps.Color(255, 186, 197, 191),
              strokeThickness: 1
            }));
          }
        }

        Util.stopAllPropagation(divOverview);

        divOverviewButton.id = 'npmap-overviewmap-button';
        divOverviewButton.className = 'npmap-overview-open cursor';
        divOverviewButton.style.cssText = 'position:absolute;';

        document.getElementById('npmap-overview-map').appendChild(divOverviewButton);

        bean.add(divOverviewButton, 'click', function() {
          if (Util.hasClass(this, 'expanded')) {
            this.style.display = 'none';
            divOverviewMap.style.top = '0px';
            // TODO: Animate this resize.
            divOverview.style.height = '48px';
            divOverview.style.width = '48px';
            
            mapOverview.setOptions({
              height: 48,
              width: 48
            });
            setAttributionMaxWidthAndPosition();
            updateOverviewMap();
            Util.removeClass(this, 'npmap-overview-close-over');
            Util.removeClass(this, 'expanded');
            Util.addClass(this, 'npmap-overview-open');
            mapOverview.entities.clear();
          } else {
            divOverviewTitle.style.display = 'block';
            divOverviewMap.style.top = Util.getOuterDimensions(divOverviewTitle).height + 'px';
            // TODO: Animate this resize.
            divOverview.style.height = '173px';
            divOverview.style.width = '174px';

            mapOverview.setOptions({
              height: 173,
              width: 174
            });
            setAttributionMaxWidthAndPosition();
            updateOverviewMap();
            Util.removeClass(this, 'npmap-overview-open');
            Util.removeClass(this, 'npmap-overview-open-over');
            Util.addClass(this, 'npmap-overview-close');
            Util.addClass(this, 'expanded');
          }
        });
        bean.add(divOverviewButton, 'mouseover', function() {
          if (Util.hasClass(this, 'expanded')) {
            Util.removeClass(this, 'npmap-overview-close');
            Util.addClass(this, 'npmap-overview-close-over');
          } else {
            Util.removeClass(this, 'npmap-overview-open');
            Util.addClass('npmap-overview-open-over');
          }
        });
        bean.add(divOverviewButton, 'mouseout', function() {
          if (Util.hasClass(this, 'expanded')) {
            Util.removeClass(this, 'npmap-overview-close-over');
            Util.addClass(this, 'npmap-overview-close');
          } else {
            Util.removeClass(this, 'npmap-overview-open-over');
            Util.addClass(this, 'npmap-overview-open');
          }
        });
        
        
        //Microsoft.Maps.Events.addHandler(overviewMap, 'viewchangeend', function() {
        //  NPMap.bing.map.Map.setView({
        //    center: overviewMap.getCenter()
        //  });
        //});
        
        Event.add('NPMap.Map', 'viewchanged', function(e) {
          updateOverviewMap();
        });
      }
    });
  }
  */

  return NPMap.Tool.Overview = {
    /**
     *
     */
    _getConfig: function() {
      return _config;
    },
    /**
     *
     */
    getConfig: function() {
      return NPMap.config.tools.overview;
    }
  };
});