/*
 * This layer handler supports KML, KMZ, and GeoRSS files. The URL of these files has to be publicly accessible.
 */
NPMap.google.layers = NPMap.google.layers || {};
NPMap.google.layers.Kml = (function() {
    return {
        addLayer: function(details) {
            var layer = new google.maps.KmlLayer(details.url, {
                map: NPMap.google.map.Map,
                suppressInfoWindows: false
            });
        }
    };
})();