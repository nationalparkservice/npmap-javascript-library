describe("NPMap.Map", function() {
  it('should be able to add an element to the map div', function() {
    var div = document.createElement('div');
    div.id = 'npmap-test-div';
    div.style.cssText = 'background-color:blue;height:5px;left:100px;position:absolute;top:100px;width:5px;';

    NPMap.Map.addElementToMapDiv(div);

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
  // getMapDiv
  // getMarkerAnchor
  // getMarkerIcon
  // getMarkerLatLng
  // getMarkerOption
  // getMarkerVisibility
  // getMaxZoom
  // getMinZoom
  // getParentDiv
  // getPixelFromLatLng
  it('should be able to get the zoom', function() {
    expect(NPMap.Map.getZoom()).toBeNumber();
  });
  // handleResize
  // hideShape
  // isLatLngWithinMapBounds
  // latLngToString
  // matchBaseLayer
  // panByPixels
  // positionClickDot
  // removeShape
  // setMarkerIcon
  // setMarkerOptions
  // showShape
  // stringToLatLng
  // switchBaseLayer
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
  // zoomToInitialExtent
  // zoomToLatLng
  // zoomToLatLngs
  // zoomToMarkers
});