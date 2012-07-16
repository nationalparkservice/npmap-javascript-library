define([
  'Util/Util'
], function(Util) {
  return NPMap.Util.Json = {
    /**
     * Loads a Json file.
     * @param {String} url
     * @param {Function} callback
     */
    load: function(url, callback) {
      reqwest({
        success: callback,
        type: 'json',
        url: url
      });
    }
  };
});