define([
  '../../modules/edit.js'
], function(edit) {
  var 
      // The module config object.
      config = (function() {
        for (var i = 0; i < NPMap.config.modules.length; i++) {
          if (NPMap.config.modules[i].name === 'edit') {
            return NPMap.config.modules[i];
          }
        }
      })(),
      // The {google.maps.Map} object.
      map = NPMap[NPMap.config.api].map.Map,
      // The DrawingManager.
      manager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        map: map
      }),
      // ?
      selected = null;
  
  /**
   *
   */
  function clearSelection() {
    if (selected) {
      selected.setEditable(false);
      selected = null;
    }
  }
  /**
   *
   */
  function selectColor(color) {
    selectedColor = color;

    var polylineOptions = manager.get('polylineOptions');
    polylineOptions.strokeColor = color;
    manager.set('polylineOptions', polylineOptions);

    var rectangleOptions = manager.get('rectangleOptions');
    rectangleOptions.fillColor = color;
    manager.set('rectangleOptions', rectangleOptions);

    var circleOptions = manager.get('circleOptions');
    circleOptions.fillColor = color;
    manager.set('circleOptions', circleOptions);

    var polygonOptions = manager.get('polygonOptions');
    polygonOptions.fillColor = color;
    manager.set('polygonOptions', polygonOptions);
  }
  /**
   *
   */
  function setSelectedShapeColor(color) {
    if (selected) {
      if (selected.type == google.maps.drawing.OverlayType.POLYLINE) {
        selected.set('strokeColor', color);
      } else {
        selected.set('fillColor', color);
      }
    }
  }
  /**
   *
   */
  function setSelection(shape) {
    clearSelection();

    selected = shape;
    
    shape.setEditable(true);
    selectColor(shape.get('fillColor') || shape.get('strokeColor'));
  }

  google.maps.event.addListener(manager, 'drawingmode_changed', clearSelection);  
  google.maps.event.addListener(manager, 'overlaycomplete', function(event) {
    var latLngsNpmap = [],
        shape = event.overlay;

    switch (event.type) {
      case 'circle':
        //getCenter()
        //getRadius()
        type = 'polygon';
        break;
      case 'marker':
        latLngsNpmap.push(NPMap.Map.Google.latLngFromApi(event.overlay.getPosition()));
        type = 'point';
        break;
      case 'polygon':
        type = 'polygon';

        event.overlay.getPath().forEach(function(latLng, i) {
          latLngsNpmap.push(NPMap.Map.Google.latLngFromApi(latLng));
        });
        break;
      case 'polyline':
        event.overlay.getPath().forEach(function(latLng, i) {
          latLngsNpmap.push(NPMap.Map.Google.latLngFromApi(latLng));
        });
        type = 'line';
        break;
      case 'rectangle':
        var bounds = event.overlay.getBounds(),
            ne = bounds.getNorthEast(),
            sw = bounds.getSouthWest();
        
        type = 'polygon';

        latLngsNpmap.push(NPMap.Map.Google.latLngFromApi(ne));
        latLngsNpmap.push(NPMap.Map.Google.latLngFromApi(new google.maps.LatLng(ne.lat(), sw.lng())));
        latLngsNpmap.push(NPMap.Map.Google.latLngFromApi(sw));
        latLngsNpmap.push(NPMap.Map.Google.latLngFromApi(new google.maps.LatLng(sw.lat(), ne.lng())));
        break;
    }
    
    /*
    if (event.type != google.maps.drawing.OverlayType.MARKER) {
      google.maps.event.addListener(shape, 'click', function() {
        setSelection(shape);
      });
      setSelection(shape);
    }
    */

    manager.setDrawingMode(null);
    NPMap.google.modules.edit.shapes.push(shape);

    NPMap.Event.trigger('Edit', 'shapedrawn', {
      latLngs: latLngsNpmap,
      shape: shape,
      type: type
    });
  });
  google.maps.event.addListener(map, 'click', clearSelection);
  
  NPMap.google.modules = NPMap.google.modules || {};

  return NPMap.google.modules.edit = {
    // The {google.maps.drawing.DrawingManager} object.
    manager: manager,
    // The shapes that have been added to the map.
    shapes: []
  };
});