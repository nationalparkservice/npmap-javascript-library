/*
 TODO:
   1. Migrate this up to NPMap.Map.Google
   2. In Module.Edit.js, hook up to 'shapedrawn' event.
   3. Add new events like 'shapeselected', 'shapedeselected'
*/
define([
  'Module/Module.Edit'
], function(Edit) {
  var
      // The {google.maps.Map} object.
      _map = NPMap.Map[NPMap.config.api].map,
      // The DrawingManager.
      _manager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        map: _map
      }),
      // The currently-selected shape.
      _selected = null;

  /**
   * Clears the selected shape.
   * @return null
   */
  function _clearSelection() {
    if (_selected) {
      _selected.setEditable(false);
      _selected = null;
    }
  }

  google.maps.event.addListener(_manager, 'drawingmode_changed', _clearSelection);
  google.maps.event.addListener(_manager, 'overlaycomplete', function(event) {
    var latLngs = [],
        shape = event.overlay;

    switch (event.type) {
      case 'circle':
        //getCenter()
        //getRadius()
        type = 'Polygon';
        break;
      case 'marker':
        latLngs.push(NPMap.Map.Google.latLngFromApi(event.overlay.getPosition()));
        type = 'Marker';
        break;
      case 'polygon':
        type = 'Polygon';

        event.overlay.getPath().forEach(function(latLng, i) {
          latLngs.push(NPMap.Map.Google.latLngFromApi(latLng));
        });
        break;
      case 'polyline':
        event.overlay.getPath().forEach(function(latLng, i) {
          latLngs.push(NPMap.Map.Google.latLngFromApi(latLng));
        });
        type = 'Line';
        break;
      case 'rectangle':
        var bounds = event.overlay.getBounds(),
            ne = bounds.getNorthEast(),
            sw = bounds.getSouthWest();

        type = 'Polygon';

        latLngs.push(NPMap.Map.Google.latLngFromApi(ne));
        latLngs.push(NPMap.Map.Google.latLngFromApi(new google.maps.LatLng(ne.lat(), sw.lng())));
        latLngs.push(NPMap.Map.Google.latLngFromApi(sw));
        latLngs.push(NPMap.Map.Google.latLngFromApi(new google.maps.LatLng(sw.lat(), ne.lng())));
        break;
    }

    Edit._shapes.push(shape);
    NPMap.Event.trigger('NPMap.Map', 'shapedrawn', {
      latLngs: latLngs,
      shape: shape,
      type: type
    });
  });
  google.maps.event.addListener(_map, 'click', _clearSelection);

  return NPMap.Module.Edit.Google = {
    // The {google.maps.drawing.DrawingManager} object.
    manager: _manager,
    // The shapes that have been added to the map.
    shapes: []
  };
});