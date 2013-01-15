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

      if (options.callback && !Util.isLocalUrl(url)) {
        reqwest({
          jsonpCallback: options.callback,
          success: callback,
          type: 'jsonp',
          url: url
        });
      } else if (!Util.isLocalUrl(url)) {
        reqwest({
          data: {
            url: url
          },
          jsonpCallback: 'callback',
          success: callback,
          type: 'jsonp',
          url: 'http://maps.nps.gov/proxy/json'
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