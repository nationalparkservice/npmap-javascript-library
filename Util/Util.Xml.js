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
  /**
   * https://developer.mozilla.org/en-US/docs/JXON
   */
  function parseText (sValue) {
    if (/^\s*$/.test(sValue)) { return null; }
    if (/^(?:true|false)$/i.test(sValue)) { return sValue.toLowerCase() === "true"; }
    if (isFinite(sValue)) { return parseFloat(sValue); }
    if (isFinite(Date.parse(sValue))) { return new Date(sValue); }
    return sValue;
  }
  /**
   * https://developer.mozilla.org/en-US/docs/JXON
   */
  function JXONTree (oXMLParent) {
    var nAttrLen = 0,
        nLength = 0,
        sCollectedTxt = "";
    
    if (oXMLParent.hasChildNodes()) {
      for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
        oNode = oXMLParent.childNodes.item(nItem);
        
        if ((oNode.nodeType - 1 | 1) === 3) {
          sCollectedTxt += oNode.nodeType === 3 ? oNode.nodeValue.trim() : oNode.nodeValue;
        } else if (oNode.nodeType === 1 && !oNode.prefix) {
          sProp = oNode.nodeName.toLowerCase();
          vContent = new JXONTree(oNode);

          if (this.hasOwnProperty(sProp)) {
            if (this[sProp].constructor !== Array) {
              this[sProp] = [this[sProp]];
            }
            
            this[sProp].push(vContent);
          } else {
            this[sProp] = vContent; nLength++;
          }
        }
      }

      this.keyValue = parseText(sCollectedTxt);
    } else {
      this.keyValue = null;
    }
    
    if (oXMLParent.hasAttributes()) {
      var oAttrib;

      this.keyAttributes = {};
      
      for (nAttrLen; nAttrLen < oXMLParent.attributes.length; nAttrLen++) {
        oAttrib = oXMLParent.attributes.item(nAttrLen);
        this.keyAttributes[oAttrib.name.toLowerCase()] = parseText(oAttrib.value.trim());
      }
    }
  }

  return NPMap.Util.Xml = {
    /**
     * Loads a Xml file.
     * @param {String} url
     * @param {Function} callback
     * @return null
     */
    load: function(url, callback) {
      /*
      if (url.indexOf('http://') !== -1 && url.indexOf(location.host) === -1) {
        // TODO: Should you try with CORS first, then fall back to proxy?
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
          success: function(response) {
            callback(parse(response.responseText));
          },
          type: 'xml',
          url: url
        });
      }
      */

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
    },
    /**
     * Converts an XML object into a JXON object.
     * @param {Object} xml
     * @return {Object}
     */
    toJxon: function(xml) {
      return new JXONTree(xml);
    }
  };
});