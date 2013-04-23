define([
  'Util/Util'
], function(Util) {
  return NPMap.Util.Geocode = {
    /**
     * Performs a geocode operation.
     * @param {String} value
     * @param {Function} callback
     * @param {Boolean} includeNps (Optional)
     */
    geocodeMapquest: function(value, callback, includeNps) {
      reqwest({
        error: function(error) {
          callback({
            message: 'The location search failed. Please check your network connection.',
            success: false
          });
        },
        //jsonpCallback: 'json_callback',
        success: function(response) {
          if (response) {
            console.log(response);

            if (response.results && response.results[0] && response.results[0].locations && response.results[0].locations.length > 0) {
              var result = {};

              result.results = [];
              result.search = value;
              result.success = true;

              _.each(response.results[0].locations, function(location) {
                var details = {
                      address: {}
                    },
                    display = null,
                    num = 0;

                _.each(location, function(value, property) {
                  if (property.indexOf('adminArea') === 0) {
                    if (property.indexOf('Type') !== -1) {
                      details[value.toLowerCase()] = location[property.replace('Type', '')];
                      num++;
                    }
                  } else if (property === 'postalCode') {
                    details.address.postalCode = value;
                    num++;
                  } else if (property === 'sideOfStreet') {
                    details.address.sideOfStreet = value;
                    num++;
                  } else if (property === 'street') {
                    details.address.street = value;
                    num++;
                  }
                });

                if (num === 0) {
                  details = null;
                }

                switch (location.geocodeQuality) {
                  case 'CITY':
                    display = details.city + ', ' + details.state;
                    break;
                  case 'POINT':
                    //display =
                    break;
                }

                result.results.push({
                  details: details,
                  display: display,
                  latLng: location.latLng,
                  quality: location.geocodeQuality
                });
              });
              console.log(result);
              callback(result);
            } else {
              callback({
                message: 'No locations found.',
                success: true
              });
            }
          } else {
            callback({
              message: 'The geocode failed. Please try again.',
              success: false
            });
          }
        },
        type: 'jsonp',
        url: 'http://www.mapquestapi.com/geocoding/v1/address?location=' + value + '&key=Fmjtd%7Cluub2l01nd%2Cal%3Do5-96121w&thumbMaps=false'
      });
    },
    /**
     *
     */
    geocodeNominatim: function(value, callback, includeNps) {
      reqwest({
        error: function(error) {
          callback({
            message: 'The location search failed. Please check your network connection.',
            success: false
          });
        },
        jsonpCallback: 'json_callback',
        success: function(response) {
          var obj = {};

          if (response) {
            obj.results = response;
            obj.success = true;
          } else {
            obj.message = 'The response from the Nominatim service was invalid. Please try again.';
            obj.success = false;
          }

          callback(obj);
        },
        type: 'jsonp',
        url: 'http://open.mapquestapi.com/nominatim/v1/search.php?format=json&addressdetails=1&dedupe=1&q=' + value + '&key=Fmjtd%7Cluub2l01nd%2Cal%3Do5-96121w'
      });
    }
  };
});