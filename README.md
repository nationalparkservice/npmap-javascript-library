# NPMap

NPMap is a JavaScript (astraction) library developed, maintained, and used by the [U.S. National Park Service](http://www.nps.gov). It creates a "wrapper" around various web mapping APIs and exposes commonly-used functionality through a simple and targeted API. In addition, NPMap provides a number of custom components and a look-and-feel that fits in with the graphic identity of the National Park Service.

For more information, including API documentation and examples, check out the [support documentation](http://www.nps.gov/npmap/support).

## Module hierarchy

- Map
  - Map.js
  - Map.Bing.js
  - Map.Esri.js
  - Map.Google.js
  - Map.Leaflet.js
  - Map.ModestMaps.js
- Layer
  - Layer.js
  - Layer.GeoJson.js (Util.Json, Util.GeoJson)



- Module
- Util
- Event.js
- InfoBox.js








Layer.GeoJson
|
Loads: Util.Json
       Util.GeoJson

       and also uses methods exposed through Map.js and Map.Bing.js


OR


Layer.GeoJson.Bing
|
Loads: Layer.GeoJson, which loads Layer.js, Util.Json, and Util.GeoJson




API base types for layers:

- Tiled
- Vector