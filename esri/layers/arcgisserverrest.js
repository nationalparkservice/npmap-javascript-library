NPMap.esri.layers = NPMap.esri.layers || {};
NPMap.esri.layers.ArcGisServerRest = function() {
    dojo.require('esri.tasks.identify');
    dojo.connect(NPMap.esri.map.Map, 'onClick', function(e) {
        var count = 0,
            results = [],
            value = .1;

        $('#npmap-clickdot').hide();
        
        if (NPMap.InfoBox.visible) {
            NPMap.InfoBox.hide();
        }

        $('#npmap-clickdot').css({
            left: e.layerX - 2.5,
            top: e.layerY - 2.5
        }).show();

        $.each(NPMap.config.layers, function(i, v) {
            if (v.type === 'ArcGisServerRest') {
                var identify = new esri.tasks.IdentifyTask(v.url),
                    parameters = new esri.tasks.IdentifyParameters();
                    
                parameters.geometry = e.mapPoint;
                parameters.height = NPMap.esri.map.Map.height;
                parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
                parameters.mapExtent = NPMap.esri.map.Map.extent;
                parameters.returnGeometry = false;
                parameters.tolerance = 3;
                parameters.width = NPMap.esri.map.Map.width;

                count++;

                identify.execute(parameters, function(data, e) {
                    results.push({
                        data: data,
                        layerName: v.name
                    });

                    count--;
                });
            }
        });

        $('#npmapprogressbar').progressbar().fadeIn();
        $('#npmapprogressbar').progressbar('option', 'value', value);

        var interval = setInterval(function() {
            value = value + .1;

            $('#npmapprogressbar').progressbar('option', 'value', value);

            if (value < 100) {
                if (count === 0) {
                    clearInterval(interval);
                    $('#npmapprogressbar').progressbar('option', 'value', 100);
                    setTimeout(function() {
                        $('#npmapprogressbar').progressbar().fadeOut();
                        NPMap.InfoBox.show(NPMap.layers.ArcGisServerRest.buildInfoBox(results), [
                            e.pageX,
                            e.pageY
                        ]);
                    }, 500);
                }
            } else {
                clearInterval(interval);
                $('#npmapprogressbar').progressbar().fadeOut();
                NPMap.InfoBox.show('Sorry, but the identify operation is taking too long. Zoom in more and try again.', [
                    e.pageX,
                    e.pageY
                ]);
            }
        }, 5);
    });
    dojo.connect(NPMap.esri.map.Map, 'onMouseDown', function(e) {
        $('#npmap-clickdot').hide();
        
        if (NPMap.InfoBox.visible) {
            NPMap.InfoBox.hide();
        }
    });
    dojo.connect(NPMap.esri.map.Map, 'onPanStart', function(e) {
        $('#npmap-clickdot').hide();
        
        if (NPMap.InfoBox.visible) {
            NPMap.InfoBox.hide();
        }
    });
    dojo.connect(NPMap.esri.map.Map, 'onZoomStart', function(e) {
        $('#npmap-clickdot').hide();
        
        if (NPMap.InfoBox.visible) {
            NPMap.InfoBox.hide();
        }
    });
    
    return {
        addLayer: function(details) {
            if (!details.url) {
                // Throw error.
            }

            var layer;

            if (details.tiled) {
                layer = new esri.layers.ArcGISTiledMapServiceLayer(details.url, {
                    //visible: details.visible
                    visible: true
                });
            } else {
                layer = new esri.layers.ArcGISDynamicMapServiceLayer(details.url, {
                    //visible: details.visible
                    visible: true
                });
            }

            NPMap.esri.map.Map.addLayer(layer);
        }
    };
}();