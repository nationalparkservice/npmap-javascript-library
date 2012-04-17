NPMap.google.layers = NPMap.google.layers || {};
NPMap.google.layers.GoogleFusion = (function() {
    return {
        addLayer: function(details) {
            if (!details.fusionId) {
                // Throw error.
            }

            var options = {
                map: NPMap.google.map.Map,
                suppressInfoWindows: true
            };

            if (details.query) {
                options.query = details.query;
            }

            var layer = new google.maps.FusionTablesLayer(details.fusionId, options);

            details.active = true;
            details.object = layer;
            details.visible = true;

            google.maps.event.addListener(layer, 'click', function(e) {
                if (e && typeof(e.latLng) != 'undefined') {
                    var activeLayerObject,
                        layerId,
                        pixelOffset = NPMap.google.map.getPixelFromLatLng(e.latLng);

                    $('#npmap-clickdot').css({
                        backgroundColor: 'transparent',
                        border: 'solid 1px transparent',
                        left: (pixelOffset.x - 2) + 'px',
                        top: (pixelOffset.y - 2) + 'px'
                    }).show();

                    for (var i = 0; i < NPMap.config.layers.length; i++) {
                        var activeLayer = NPMap.config.layers[i];

                        if (activeLayer.type === 'GoogleFusion' && (layer.tableId === activeLayer.fusionId)) {
                            activeLayerObject = activeLayer;
                            break;
                        }
                    }

                    NPMap.layers.GoogleFusion.buildInfoBox(e.row, activeLayerObject);
                }
            });
        },
        hideLayer: function(fusionId) {
            this.removeLayer(fusionId);
        },
        removeLayer: function(fusionId) {
            for (var i = 0; i < NPMap.config.layers.length; i ++) {
                if (NPMap.config.layers[i].fusionId === fusionId) {
                    NPMap.config.layers[i].object.setMap(null);
                    NPMap.config.layers[i].object = null;
                    NPMap.config.layers[i].active = false;
                    NPMap.config.layers[i].visible = false;
                    break;
                }
            }
        },
        showLayer: function(fusionId) {
            for (var i = 0; i < NPMap.config.layers.length; i ++) {
                if (NPMap.config.layers[i].fusionId === fusionId) {
                    if (NPMap.config.layers[i].active === false) {
                        this.addLayer(NPMap.config.layers[i]);
                    }

                    break;
                }
            }
        }
    };
})();