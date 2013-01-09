define([
  'Util/Util'
], function(Util) {
  return NPMap.Util.Json = {
    /**
     * Loads a Json file.
     * @param {String} url
     * @param {Function} callback
     * @param {Object} options (Optional)
     * @return null
     */
    load: function(url, callback, options) {
      options = options || {};

      if (options.callback || !Util.isLocalUrl(url)) {
        reqwest({
          jsonpCallback: options.callback || null,
          success: callback,
          type: 'jsonp',
          url: url
        });
      } else {
        reqwest({
          success: callback,
          type: 'json',
          url: url
        });
      }
    }
  };
});