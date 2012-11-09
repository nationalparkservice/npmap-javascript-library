define([
  'Util/Util'
], function(Util) {
  var 
      // The xml parse function.
      parse;

  function parseText (sValue) {
    if (/^\s*$/.test(sValue)) {
      return null;
    }

    if (/^(?:true|false)$/i.test(sValue)) {
      return sValue.toLowerCase() === 'true';
    }
    
    if (isFinite(sValue)) {
      return parseFloat(sValue);

    }
    if (isFinite(Date.parse(sValue))) {
      return new Date(sValue);
    }

    return sValue;
  }
  
  // https://developer.mozilla.org/en/JXON
  function JXONTree (oXMLParent) {
    var hasAttributes = false,
        nAttrLen = 0,
        nLength = 0,
        sCollectedTxt = '';
    
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

    if (oXMLParent.hasAttributes) {
      hasAttributes = oXMLParent.hasAttributes();
    }
    else {
      var attributes = oXMLParent.attributes;

      for (var i = 0; i < attributes.length; i++) {
        if (attributes[i].specified) {
          hasAttributes = true;
          break;
        }
      }
    }

    if (hasAttributes) {
      var oAttrib;

      this.keyAttributes = {};
      
      for (nAttrLen; nAttrLen < oXMLParent.attributes.length; nAttrLen++) {
        oAttrib = oXMLParent.attributes.item(nAttrLen);
        this.keyAttributes[oAttrib.name.toLowerCase()] = parseText(oAttrib.value.trim());
      }
    }

    // Object.freeze was introduced in IE 9.
    if (Object.freeze) {
      Object.freeze(this);
    }
  }

  JXONTree.prototype.valueOf = function () {
    return this.keyValue;
  };
  JXONTree.prototype.toString = function () {
    return String(this.keyValue);
  };
  JXONTree.prototype.getItem = function (nItem) {
    if (nLength === 0) {
      return null;
    }

    var nCount = 0;
    
    for (var sKey in this) {
      if (nCount === nItem) {
        return this[sKey];
      }

      nCount++;
    }

    return null;
  };
  JXONTree.prototype.getAttribute = function (nAttrId) {
    if (nAttrLen === 0 || nAttrId + 1 > nAttrLen) {
      return null;
    }
    
    var nAttr = 0;
    
    for (var sAttrName in this.keyAttributes) {
      if (nAttr === nAttrId) {
        return this.keyAttributes[sAttrName];
      } nAttr++;
    }

    return null;
  };
  JXONTree.prototype.hasChildren = function () {
    return this.keyLength > 0;
  };

  if (typeof window.DOMParser !== 'undefined') {
    parse = function(xml) {
      return (new window.DOMParser()).parseFromString(xml, 'text/xml');
    };
  } else if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
    parse = function(xml) {
      var doc = new window.ActiveXObject('Microsoft.XMLDOM');
      doc.async = 'false';
      doc.loadXML(xml);
      return doc;
    };
  } else {
    throw new Error('No XML parser found');
  }

  return NPMap.Util.Xml = {
    /**
     * Loads a Xml file.
     * @param {String} url
     * @param {Function} callback
     */
    load: function(url, callback) {
      if (url.indexOf('http://') !== -1 && url.indexOf(location.host) === -1) {
        //url = 'http://www.nps.gov/npmap/support/examples/data/civilwareranationalcemeteries.kml';

        reqwest({
          success: function(response) {
            callback(new JXONTree(parse(response.d).getElementsByTagName('Document')[0]));
          },
          type: 'jsonp',
          url: 'http://maps.nps.gov/proxy/kml?url=' + url + '&callback=?'
        });
      } else {
        reqwest({
          method: 'get',
          success: function(response) {
            callback(new JXONTree(parse(response.responseText).getElementsByTagName('Document')[0]));
          },
          type: 'xml',
          url: url
        });
      }
    },
    /**
     * Converts an XML string to a JXON object.
     * @param {String} xml
     * @return {Object}
     */
    toJavaScript: function(xml) {
      return new JXONTree(xml);
    }
  };
});