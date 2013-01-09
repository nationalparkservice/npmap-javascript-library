define([
  'Util/Util'
], function(Util) {
  var parser = new DOMParser();

  /**
   * Parses a string.
   * @param {String} str
   * @return {Object}
   */
  function parse(str) {
    return parser.parseFromString(str, 'text/xml');
  }

  return NPMap.Util.Xml = {
    /**
     * Loads a Xml file.
     * @param {String} url
     * @param {Function} callback
     * @return null
     */
    load: function(url, callback) {
      if (url.indexOf('http://') !== -1 && url.indexOf(location.host) === -1) {
        reqwest({
          error: function(error) {
            console.log(error);
          },
          success: function(response) {
            callback(parse(response.d));
          },
          type: 'jsonp',
          url: 'http://maps.nps.gov/proxy/xml?url=' + url + '&callback=?'
        });
      } else {
        reqwest({
          method: 'get',
          success: function(response) {
            callback(parse(response.responseText));
          },
          type: 'xml',
          url: url
        });
      }
    }
  };
});