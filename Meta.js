define(function() {
  return NPMap.META = {
    "baseApis": [{
      "layerHandlers": [
        "ArcGisServerRest",
        "GeoJson",
        "Json",
        "Kml",
        "Tiled",
        "Xml"
      ],
      "modules": [
        "Route"
      ],
      "name": "Bing",
      "tools": [
        "BaseLayerSwitcher",
        "Fullscreen",
        "Keyboard",
        "Navigation",
        "OverviewMap"
      ],
      "usage": {
        "external": true,
        "internal": true
      }
    },{
      "layerHandlers": [
        "ArcGisServerRest",
        "CartoDb",
        "GeoJson",
        "GoogleFusion",
        "Json",
        "Kml",
        "Tiled",
        "TileStream",
        "Xml"
      ],
      "modules": [
        "Edit",
        "Route"
      ],
      "name": "Google",
      "tools": [
        "BaseLayerSwitcher",
        "Fullscreen",
        "Keyboard",
        "Navigation"
      ],
      "usage": {
        "external": true,
        "internal": true
      }
    },{
      "layerHandlers": [
        "ArcGisServerRest",
        "CartoDb",
        "GeoJson",
        "Json",
        "Kml",
        "Tiled",
        "TileStream",
        "Xml"
      ],
      "modules": [
        "Route"
      ],
      "name": "Leaflet",
      "tools": [
        "BaseLayerSwitcher",
        "Fullscreen",
        "Keyboard",
        "Navigation"
      ],
      "usage": {
        "external": true,
        "internal": true
      }
    },{
      "layerHandlers": [
        "ArcGisServerRest",
        "Tiled",
        "TileStream"
      ],
      "modules": [
        "Route"
      ],
      "name": "ModestMaps",
      "tools": [
        "BaseLayerSwitcher",
        "Fullscreen",
        "Navigation"
      ],
      "usage": {
        "external": true,
        "internal": true
      }
    }],
    "layerHandlers": [{
      "display": true,
      "hover": false,
      "identify": true,
      "modules": [
        "Edit",
        "Route"
      ],
      "name": "ArcGisServerRest",
      "type": "raster"
    },{
      "display": true,
      "hover": true,
      "identify": true,
      "modules": [
        "Route"
      ],
      "name": "CartoDb",
      "type": "raster"
    },{
      "display": true,
      "hover": true,
      "identify": true,
      "modules": [
        "Route"
      ],
      "name": "GeoJson",
      "type": "vector"
    },{
      "display": true,
      "hover": true,
      "identify": true,
      "modules": [
        "Route"
      ],
      "name": "GoogleFusion",
      "type": "raster"
    },{
      "display": true,
      "hover": true,
      "identify": true,
      "modules": [
        "Route"
      ],
      "name": "Json",
      "type": "vector"
    },{
      "display": true,
      "hover": true,
      "identify": true,
      "modules": [
        "Route"
      ],
      "name": "Kml",
      "type": "vector"
    },{
      "display": true,
      "hover": false,
      "identify": false,
      "modules": [
        "Route"
      ],
      "name": "Tiled",
      "type": "raster"
    },{
      "display": true,
      "hover": true,
      "identify": true,
      "modules": [
        "Route"
      ],
      "name": "TileStream",
      "type": "raster"
    },{
      "display": true,
      "hover": true,
      "identify": true,
      "modules": [
        "Route"
      ],
      "name": "Xml",
      "type": "vector"
    }],
    "modules": [{
      "name": "Edit"
    },{
      "name": "Route"
    }],
    "tools": [{
      "name": "BaseLayerSwitcher"
    },{
      "name": "Fullscreen"
    },{
      "name": "Geocoder"
    },{
      "name": "History"
    },{
      "name": "Keyboard"
    },{
      "name": "Legend"
    },{
      "name": "Navigation"
    },{
      "name": "OverviewMap"
    },{
      "name": "Print"
    },{
      "name": "ScaleBar"
    },{
      "name": "Share"
    }]
  };
});