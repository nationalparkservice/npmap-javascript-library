define(function() {
  NPMap.layers = NPMap.layers || {};
  
  return NPMap.layers.GoogleFusion = {
    /**
     * Builds an infobox for the GoogleFusion layer. Takes information provided by the user as part of the activeLayer config.
     * data {object} required - The data object returned from the GoogleFusion table.
     * layer {object} required - The layer object taken from the activeLayer config.
     */
    buildInfoBox: function(data, layer) {
      var content,
          title;

      if (!data) {
        content = 'No information is available for this resource.';
        title = 'Sorry!';
      } else {
        title = '<h2>';

        if (typeof(layer.identify.content) === 'function') {
          content = layer.identify.content(data);
        } else {
          content = layer.identify.content;
        }

        if (typeof(layer.identify.title) === 'function') {
          title = layer.identify.title(data);
        } else {
          title = layer.identify.title;
        }

        title += '</h2>';

        $.each(data, function(i, v) {
          // TODO: These should be regular expressions that replace multiple instances if they exist.
          content = content.replace('{' + v.columnName + '}', v.value);
          title = title.replace('{' + v.columnName + '}', v.value);
        });
      }

      NPMap.InfoBox.show(content, title);
    }
  };
});