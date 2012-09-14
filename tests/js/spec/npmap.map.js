var boundsNpmap = {
      e: -37.3330078125,
      n: 48.49296796071654,
      s: 28.040498067172177,
      w: -154.6669921875
    },
    latLng = {
      lat: 39.751527115853754,
      lng: -104.88604848489224
    },
    line,
    lineLatLngs = [{
      lat: 38.7841,
      lng: -96.9255
    },{
      lat: 38.7862,
      lng: -96.7
    },{
      lat: 38.833,
      lng: -96.4723
    }],
    marker,
    markerLatLng = {
      lat: 39.2153,
      lng: -97.2578
    },
    markers,
    polygon,
    polygonLatLngs = [{
      lat: 39.1833,
      lng: -96.4805
    },{
      lat: 39.0448,
      lng: -96.49699
    },{
      lat: 39.0448,
      lng: -96.25804
    },{
      lat: 39.17268,
      lng: -96.26092
    }],
    zoom = 15;

/**
 * Creates an array of markers and adds them to the map.
 * @return {Array}
 */
function createMarkers() {
  var latLng = NPMap.Map.getCenter(),
      markerLatLng = {
        lat: latLng.lat,
        lng: latLng.lng
      },
      num = 5;

  function updateMarkerLatLng() {
    markerLatLng = {
      lat: latLng.lat - (0.5 * num),
      lng: latLng.lng - (0.5 * num)
    };
  }

  markers = [];

  updateMarkerLatLng();

  while (num--) {
    var marker = NPMap.Map.createMarker(markerLatLng);

    markers.push(marker);
    NPMap.Map.addShape(marker);
    updateMarkerLatLng();
  }
}

// getMarkerLatLng - move to getMarkerOption
// getMarkerOption
// getMarkerVisibility - merge into getMarkerOption
// hideShape - move to setShapeOptions
// isLatLngWithinMapBounds
// latLngsAreEqual
// metersToZoomLevel
// removeShape
// setBounds
// setInitialCenter
// setInitialZoom
// setMarkerOptions - move to setShapeOptions
// setZoomRestrictions
// showShape - move to setShapeOptions

describe('Conversion methods:', function() {
  var boundsApi = null,
      latLngApi = null,
      latLngNpmap = {
        lat: 39,
        lng: -96
      },
      pixelApi = null,
      pixelNpmap = {
        x: 50,
        y: 50
      };

  it('boundsFromApi', function() {
    if (!boundsApi) {
      boundsApi = NPMap.Map.boundsToApi(boundsNpmap);
    }
    
    expect(NPMap.Map.boundsFromApi(boundsApi).e).toBeNumber();
  });
  it('boundsToApi', function() {
    expect(function() {
      boundsApi = NPMap.Map.boundsToApi(boundsNpmap);
    }).not.toThrow();
  });
  it('latLngFromApi', function() {
    if (!latLngApi) {
      latLngApi = NPMap.Map.latLngToApi(latLngNpmap);
    }

    expect(NPMap.Map.latLngFromApi(latLngApi).lat).toBeNumber();
  });
  it('latLngToApi', function() {
    expect(function() {
      latLngApi = NPMap.Map.latLngToApi(latLngNpmap);
    }).not.toThrow();
  });
  it('latLngToPixel', function() {
    expect(NPMap.Map.latLngToPixel(latLngNpmap).x).toBeNumber();
  });
  it('pixelFromApi', function() {
    if (!pixelApi) {
      pixelApi = NPMap.Map.pixelToApi(pixelNpmap);
    }

    expect(NPMap.Map.pixelFromApi(pixelApi).x).toBeNumber();
  });
  it('pixelToApi', function() {
    expect(function() {
      pixelApi = NPMap.Map.pixelToApi(pixelNpmap);
    }).not.toThrow();
  });
  it('pixelToLatLng', function() {
    expect(NPMap.Map.pixelToLatLng(pixelNpmap).lat).toBeNumber();
  });
});
describe('Get map state:', function() {
  it('getBounds', function() {
    expect(NPMap.Map.getBounds().e).toBeNumber();
  });
  it('getCenter', function() {
    expect(NPMap.Map.getCenter().lat).toBeNumber();
  });
  it('getMaxZoom', function() {
    expect(NPMap.Map.getMaxZoom()).toBeNumber();
  });
  it('getMinZoom', function() {
    expect(NPMap.Map.getMinZoom()).toBeNumber();
  });
  it('getZoom', function() {
    expect(NPMap.Map.getZoom()).toBeNumber();
  });
  it('hasClusteredLayer', function() {
    expect(NPMap.Map.hasClusteredLayer()).toBeDefined();
  });
  it('hasTiledLayer', function() {
    expect(NPMap.Map.hasTiledLayer()).toBeDefined();
  });
});
describe('Layer methods:', function() {
  // addTileLayer
  // addZoomifyLayer
  // createZoomifyLayer
});
describe('Map manipulation:', function() {
  it('center', function() {
    expect(function() {
      NPMap.Map.center(latLng);
    }).not.toThrow();
  });
  it('centerAndZoom', function() {
    expect(function() {
      NPMap.Map.centerAndZoom(latLng, zoom);
    }).not.toThrow();
  });
  it('panByPixels', function() {
    expect(function() {
      NPMap.Map.panByPixels({
        x: -50,
        y: -50
      });
    }).not.toThrow();
  });
  it('panInDirection', function() {
    expect(function() {
      NPMap.Map.panInDirection('east');
    }).not.toThrow();
  });
  it('toBounds', function() {
    expect(function() {
      NPMap.Map.toBounds(boundsNpmap);
    }).not.toThrow();
  });
  it('toInitialExtent', function() {
    expect(function() {
      NPMap.Map.toInitialExtent();
    }).not.toThrow();
  });
  it('toLatLngs', function() {
    expect(function() {
      NPMap.Map.toLatLngs(polygonLatLngs);
    }).not.toThrow();
  });
  it('toMarkers', function() {
    if (!markers) {
      createMarkers();
    }
    
    expect(function() {
      NPMap.Map.toMarkers(markers);
    }).not.toThrow();
  });
  it('zoom', function() {
    expect(function() {
      NPMap.Map.zoom(9);
    }).not.toThrow();
  });
  it('zoomIn', function() {
    expect(function() {
      NPMap.Map.zoomIn();
    }).not.toThrow();
  });
  it('zoomOut', function() {
    expect(function() {
      NPMap.Map.zoomOut();
    }).not.toThrow();
  });
});
describe('Shape methods:', function() {
  it('createLine', function() {
    line = NPMap.Map.createLine(lineLatLngs);

    expect(line).toBeDefined();
  });
  it('addShape', function() {
    if (!line) {
      line = NPMap.Map.createLine(lineLatLngs);
    }

    expect(function() {
      NPMap.Map.addShape(line);
    }).not.toThrow();
  });
  it('createMarker', function() {
    marker = NPMap.Map.createMarker(markerLatLng);

    expect(marker).toBeDefined();
  });
  it('addShape', function() {
    if (!marker) {
      marker = NPMap.Map.createMarker(markerLatLng);
    }

    expect(function() {
      NPMap.Map.addShape(marker);
    }).not.toThrow();
  });
  it('createPolygon', function() {
    polygon = NPMap.Map.createPolygon(polygonLatLngs);

    expect(polygon).toBeDefined();
  });
  it('addShape', function() {
    if (!polygon) {
      polygon = NPMap.Map.createPolygon(polygonLatLngs);
    }

    expect(function() {
      NPMap.Map.addShape(polygon);
    }).not.toThrow();
  });
});
describe('User interface (including modules and tools):', function() {
  it('addControl', function() {
    var div = document.createElement('div');
    div.id = 'npmap-test-div';
    div.style.cssText = 'background-color:blue;height:5px;left:100px;position:absolute;top:100px;width:5px;';

    NPMap.Map.addControl(div);

    expect(document.getElementById('npmap-test-div')).toBeDefined();
  });
  // buildAttributionString
  it('getMapElement', function() {
    expect(NPMap.Map.getMapElement()).toBeDefined();
  });
  // handleResize
  // hideProgressBar
  // hideTip
  // notify
  // setAttribution
  // setCursor
  // setNotifyTarget
  // showProgressBar
  // showTip
  // toggleFullScreen
  // toggleModule [NOT YET IMPLEMENTED]
  // updateProgressBar
});

switch (baseApi) {
  case 'bing':
    describe('\'bing\' features:', function() {

    });
    break;
  case 'esri':
    break;
  case 'google':
    break;
  case 'leaflet':
    break;
  case 'modestmaps':
    break;
}