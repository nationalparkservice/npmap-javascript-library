describe("NPMap.Map", function() {
  it('should be able to add an element to the map div', function() {
    var div = document.createElement('div');
    div.id = 'npmap-test-div';
    div.style.cssText = 'background-color:blue;height:5px;left:100px;position:absolute;top:100px;width:5px;';

    NPMap.Map.addElement(div);

    expect(document.getElementById('npmap-test-div')).toBeDefined();
  });
  // addElementsToMapDiv
  // addShape
  it('should be able to center the map', function() {
    expect(function() {
      NPMap.Map.center('39.751527115853754,-104.88604848489224');
    }).not.toThrow();
  });
  it('should be able to center and zoom the map', function() {
    expect(function() {
      NPMap.Map.centerAndZoom('39.752544764563154,-105.01213075031792', 15);
    }).not.toThrow();
  });
  // createLine
  // createMarker
  // createPolygon
  it('should be able to get the center', function() {
    expect(NPMap.Map.getCenter()).toBeString();
  });
  // getClickDotLatLng
  // getLatLngFromPixel
  it('should be able to get the container div', function() {
    expect(NPMap.Map.getContainerDiv()).toBeDefined();
  });
  // getMarkerAnchor
  // getMarkerIcon
  // getMarkerLatLng
  // getMarkerOption
  // getMarkerVisibility
  it('should be able to get the max zoom', function() {
    expect(NPMap.Map.getMaxZoom()).toBeNumber();
  });
  it('should be able to get the min zoom', function() {
    expect(NPMap.Map.getMinZoom()).toBeNumber();
  });
  // getPixelFromLatLng
  it('should be able to get the zoom', function() {
    expect(NPMap.Map.getZoom()).toBeNumber();
  });
  // handleResize
  // hideShape
  // isLatLngWithinMapBounds
  // latLngFromApi
  // matchBaseLayer
  // panByPixels
  // positionClickDot
  // removeShape
  // setMarkerIcon
  // setMarkerOptions
  // showShape
  // latLngToApi
  // switchBaseLayer
  it('should be able to zoom and/or pan the map to its initial extent', function() {
    expect(function() {
      NPMap.Map.toInitialExtent();
    }).not.toThrow();
  });
  // updateMarkerIcon DEPRECATED
  // updateMarkerLabel DEPRECATED
  it('should be able to zoom the map', function() {
    expect(function() {
      NPMap.Map.zoom(9);
    }).not.toThrow();
  });
  // zoomIn
  // zoomOut
  // zoomToBoundingBox
  // zoomToLatLng
  // zoomToLatLngs
  // zoomToMarkers
});