var latLng = {
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

describe('Conversion methods:', function() {
  var boundsApi = null,
      boundsNpmap = {
        e: -37.3330078125,
        n: 48.49296796071654,
        s: 28.040498067172177,
        w: -154.6669921875
      },
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
  it('pixelToApi', function() {
    expect(function() {
      pixelApi = NPMap.Map.pixelToApi(pixelNpmap);
    }).not.toThrow();
  });
  it('pixelFromApi', function() {
    if (!pixelApi) {
      pixelApi = NPMap.Map.pixelToApi(pixelNpmap);
    }

    expect(NPMap.Map.pixelFromApi(pixelApi).x).toBeNumber();
  });
  it('pixelToLatLng', function() {
    expect(NPMap.Map.pixelToLatLng(pixelNpmap).lat).toBeNumber();
  });
});

/*
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
*/