var NPMap = NPMap || {};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
// The version of the library to use.
NPMap.version = '0.8.0';

/**
 * Utility functions for use throughout NPMap.
 */
NPMap.utils = {
  /**
   * Given an object, does a property exist.
   * @param {Object} obj The object to test.
   * @param {String} prop The property to look for. Ex: 'NPMap.config.tools.keyboard'.
   */
  doesPropertyExist: function(obj, prop) {
    var parts = prop.split('.');
    
    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];
      
      if (obj !== null && typeof obj === "object" && part in obj) {
        obj = obj[part];
      } else {
        return false;
      }
    }
    return true;
  },
  /**
   * Gets the first property of an object.
   * @param {Object} obj The object to get the first property of.
   */
  getFirstPropertyOfObject: function(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return obj[key];
      }
    }
  },
  /**
   * Gets the offset, in pixels, of the map div in the page.
   * @return {Object}
   */
  getMapDivOffset: function() {
    var offset = $('#' + NPMap.config.div).offset();
    
    return {
      left: offset.left,
      top: offset.top
    };
  },
  /**
   * Injects a CSS stylesheet into the page.
   * @param {String} location The path to the CSS stylesheet.
   */
  injectCss: function(location) {
    if (document.createStyleSheet) {
      document.createStyleSheet(location);
    } else {
      var c = document.createElement('link');
      c.type = 'text/css';
      c.rel = 'stylesheet';
      c.href = location;
      c.media = 'screen';
      document.getElementsByTagName("head")[0].appendChild(c);
    }
  },
  /**
   * Returns true if the test number falls between the start and end numbers.
   * @param {Number} start
   * @param {Number} end
   * @param {Number} test
   * @return {Boolean}
   */
  isBetween: function(start, end, test) {
    if ((test <= start && test >= end) || (test >= start && test <= end)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * Returns true if the number passed in is an integer.
   * @param {Number} int The number to test.
   * @return {Boolean}
   */
  isInt: function(n) {
   return n % 1 == 0;
  },
  /**
   * Replaces "bad characters" that have been inserted by NPMap into strings.
   * @param {String} html The HTML string to perform the replace operation on.
   * @return {String}
   */
  replaceBadCharacters: function(html) {
    return html.replace(/{singlequote}/g, '\'');
  },
  /**
   * Checks to make sure a module has been loaded before calling callback function. This function assumes that the module resides in the NPMap namespace.
   * @param module {String} (Required) The full name of the module, including namespace, that must be loaded before callback is called.
   * @param callback {Function} (Required) The callback function to call once the module has been loaded.
   */
  safeLoad: function(module, callback) {
    module = module.replace('NPMap.', '');

    var partition = module.split('.'),
        int = setInterval(function() {
          try {
            var loaded = function() {
                  clearInterval(int);
                  callback();
                },
                obj = NPMap;

            for (var i = 0; i < partition.length; i++) {
              obj = obj[partition[i]];

              if (typeof(obj) === 'undefined') {
                break;
              } else if ((i + 1) === partition.length) {
                loaded();
              }
            }
          } catch (e) {

          }
        }, 100);
  },
  /**
   * Strips HTML elements from a string.
   * @param {String} html The string to strip HTML from.
   * @return {String}
   */
  stripHtmlFromString: function(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  },
  /**
   * Throws an error and stops execution.
   * @param {String} error The error to throw.
   */
  throwError: function(error) {
    try {
      throw error;
    } catch(e) {
      throw(e);
    }
  }
};

if (!NPMap.config) {
  NPMap.utils.throwError('The NPMap.config object does not exist!');
}

if (!NPMap.config.div) {
  NPMap.utils.throwError('The NPMap.config.div string does not exist!');
}

if (!NPMap.config.api) {
  NPMap.config.api = 'bing';
}

if (typeof(NPMap.config.server) === 'undefined') {
  NPMap.config.server = 'http://www.nps.gov/npmap/' + NPMap.version;
}

// TODO: Start using spin.js from here: http://fgnass.github.com/spin.js/.
document.getElementById(NPMap.config.div).innerHTML = '<div id="npmap" style="height:100%;left:0px;position:absolute;top:0px;width:100%;"></div><div id="npmap-mask" style="background-color:#F0F0F0;display:block;height:100%;left:0;overflow:auto;position:absolute;top:0;width:100%;z-index:999999;"><div id="npmap-loading" style="-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;-moz-box-shadow:0 0 3px 3px #CA702D;-webkit-box-shadow:0 0 3px 3px #CA702D;box-shadow:0 0 3px 3px #CA702D;background-color:black;border:solid black 2px;height:60px;left:50%;margin-left:-30px;margin-top:-30px;position:absolute;top:50%;width:60px;z-index:999998"><img src="' + NPMap.config.server + '/resources/images/loader.gif" /></div></div>';

NPMap.config.div = 'npmap';

// Log - http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

if (!window.Modernizr) {
  /** Modernizr 2.0.6 (Custom Build) | MIT & BSD
   *  Contains: boxshadow | opacity | iepp | cssclasses | testprop | testallprops | prefixes | domprefixes | load
   */
  ;window.Modernizr=function(a,b,c){function B(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+o.join(c+" ")+c).split(" ");return A(d,b)}function A(a,b){for(var d in a)if(k[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function z(a,b){return!!~(""+a).indexOf(b)}function y(a,b){return typeof a===b}function x(a,b){return w(n.join(a+";")+(b||""))}function w(a){k.cssText=a}var d="2.0.6",e={},f=!0,g=b.documentElement,h=b.head||b.getElementsByTagName("head")[0],i="modernizr",j=b.createElement(i),k=j.style,l,m=Object.prototype.toString,n=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),o="Webkit Moz O ms Khtml".split(" "),p={},q={},r={},s=[],t,u={}.hasOwnProperty,v;!y(u,c)&&!y(u.call,c)?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],c)},p.boxshadow=function(){return B("boxShadow")},p.opacity=function(){x("opacity:.55");return/^0.55$/.test(k.opacity)};for(var C in p)v(p,C)&&(t=C.toLowerCase(),e[t]=p[C](),s.push((e[t]?"":"no-")+t));w(""),j=l=null,a.attachEvent&&function(){var a=b.createElement("div");a.innerHTML="<elem></elem>";return a.childNodes.length!==1}()&&function(a,b){function s(a){var b=-1;while(++b<g)a.createElement(f[b])}a.iepp=a.iepp||{};var d=a.iepp,e=d.html5elements||"abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",f=e.split("|"),g=f.length,h=new RegExp("(^|\\s)("+e+")","gi"),i=new RegExp("<(/*)("+e+")","gi"),j=/^\s*[\{\}]\s*$/,k=new RegExp("(^|[^\\n]*?\\s)("+e+")([^\\n]*)({[\\n\\w\\W]*?})","gi"),l=b.createDocumentFragment(),m=b.documentElement,n=m.firstChild,o=b.createElement("body"),p=b.createElement("style"),q=/print|all/,r;d.getCSS=function(a,b){if(a+""===c)return"";var e=-1,f=a.length,g,h=[];while(++e<f){g=a[e];if(g.disabled)continue;b=g.media||b,q.test(b)&&h.push(d.getCSS(g.imports,b),g.cssText),b="all"}return h.join("")},d.parseCSS=function(a){var b=[],c;while((c=k.exec(a))!=null)b.push(((j.exec(c[1])?"\n":c[1])+c[2]+c[3]).replace(h,"$1.iepp_$2")+c[4]);return b.join("\n")},d.writeHTML=function(){var a=-1;r=r||b.body;while(++a<g){var c=b.getElementsByTagName(f[a]),d=c.length,e=-1;while(++e<d)c[e].className.indexOf("iepp_")<0&&(c[e].className+=" iepp_"+f[a])}l.appendChild(r),m.appendChild(o),o.className=r.className,o.id=r.id,o.innerHTML=r.innerHTML.replace(i,"<$1font")},d._beforePrint=function(){p.styleSheet.cssText=d.parseCSS(d.getCSS(b.styleSheets,"all")),d.writeHTML()},d.restoreHTML=function(){o.innerHTML="",m.removeChild(o),m.appendChild(r)},d._afterPrint=function(){d.restoreHTML(),p.styleSheet.cssText=""},s(b),s(l);d.disablePP||(n.insertBefore(p,n.firstChild),p.media="print",p.className="iepp-printshim",a.attachEvent("onbeforeprint",d._beforePrint),a.attachEvent("onafterprint",d._afterPrint))}(a,b),e._version=d,e._prefixes=n,e._domPrefixes=o,e.testProp=function(a){return A([a])},e.testAllProps=B,g.className=g.className.replace(/\bno-js\b/,"")+(f?" js "+s.join(" "):"");return e}(this,this.document),function(a,b,c){function k(a){return!a||a=="loaded"||a=="complete"}function j(){var a=1,b=-1;while(p.length- ++b)if(p[b].s&&!(a=p[b].r))break;a&&g()}function i(a){var c=b.createElement("script"),d;c.src=a.s,c.onreadystatechange=c.onload=function(){!d&&k(c.readyState)&&(d=1,j(),c.onload=c.onreadystatechange=null)},m(function(){d||(d=1,j())},H.errorTimeout),a.e?c.onload():n.parentNode.insertBefore(c,n)}function h(a){var c=b.createElement("link"),d;c.href=a.s,c.rel="stylesheet",c.type="text/css";if(!a.e&&(w||r)){var e=function(a){m(function(){if(!d)try{a.sheet.cssRules.length?(d=1,j()):e(a)}catch(b){b.code==1e3||b.message=="security"||b.message=="denied"?(d=1,m(function(){j()},0)):e(a)}},0)};e(c)}else c.onload=function(){d||(d=1,m(function(){j()},0))},a.e&&c.onload();m(function(){d||(d=1,j())},H.errorTimeout),!a.e&&n.parentNode.insertBefore(c,n)}function g(){var a=p.shift();q=1,a?a.t?m(function(){a.t=="c"?h(a):i(a)},0):(a(),j()):q=0}function f(a,c,d,e,f,h){function i(){!o&&k(l.readyState)&&(r.r=o=1,!q&&j(),l.onload=l.onreadystatechange=null,m(function(){u.removeChild(l)},0))}var l=b.createElement(a),o=0,r={t:d,s:c,e:h};l.src=l.data=c,!s&&(l.style.display="none"),l.width=l.height="0",a!="object"&&(l.type=d),l.onload=l.onreadystatechange=i,a=="img"?l.onerror=i:a=="script"&&(l.onerror=function(){r.e=r.r=1,g()}),p.splice(e,0,r),u.insertBefore(l,s?null:n),m(function(){o||(u.removeChild(l),r.r=r.e=o=1,j())},H.errorTimeout)}function e(a,b,c){var d=b=="c"?z:y;q=0,b=b||"j",C(a)?f(d,a,b,this.i++,l,c):(p.splice(this.i++,0,a),p.length==1&&g());return this}function d(){var a=H;a.loader={load:e,i:0};return a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=r&&!s,u=s?l:n.parentNode,v=a.opera&&o.call(a.opera)=="[object Opera]",w="webkitAppearance"in l.style,x=w&&"async"in b.createElement("script"),y=r?"object":v||x?"img":"script",z=w?"img":y,A=Array.isArray||function(a){return o.call(a)=="[object Array]"},B=function(a){return Object(a)===a},C=function(a){return typeof a=="string"},D=function(a){return o.call(a)=="[object Function]"},E=[],F={},G,H;H=function(a){function f(a){var b=a.split("!"),c=E.length,d=b.pop(),e=b.length,f={url:d,origUrl:d,prefixes:b},g,h;for(h=0;h<e;h++)g=F[b[h]],g&&(f=g(f));for(h=0;h<c;h++)f=E[h](f);return f}function e(a,b,e,g,h){var i=f(a),j=i.autoCallback;if(!i.bypass){b&&(b=D(b)?b:b[a]||b[g]||b[a.split("/").pop().split("?")[0]]);if(i.instead)return i.instead(a,b,e,g,h);e.load(i.url,i.forceCSS||!i.forceJS&&/css$/.test(i.url)?"c":c,i.noexec),(D(b)||D(j))&&e.load(function(){d(),b&&b(i.origUrl,h,g),j&&j(i.origUrl,h,g)})}}function b(a,b){function c(a){if(C(a))e(a,h,b,0,d);else if(B(a))for(i in a)a.hasOwnProperty(i)&&e(a[i],h,b,i,d)}var d=!!a.test,f=d?a.yep:a.nope,g=a.load||a.both,h=a.callback,i;c(f),c(g),a.complete&&b.load(a.complete)}var g,h,i=this.yepnope.loader;if(C(a))e(a,0,i,0);else if(A(a))for(g=0;g<a.length;g++)h=a[g],C(h)?e(h,0,i,0):A(h)?H(h):B(h)&&b(h,i);else B(a)&&b(a,i)},H.addPrefix=function(a,b){F[a]=b},H.addFilter=function(a){E.push(a)},H.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",G=function(){b.removeEventListener("DOMContentLoaded",G,0),b.readyState="complete"},0)),a.yepnope=d()}(this,this.document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
}

/**
 * Underscore.js 1.1.7
 * (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
 * Underscore is freely distributable under the MIT license.
 * Portions of Underscore are inspired or borrowed from Prototype,
 * Oliver Steele's Functional, and John Resig's Micro-Templating.
 * For all details and documentation: http://documentcloud.github.com/underscore
 */
(function(){var p=this,C=p._,m={},i=Array.prototype,n=Object.prototype,f=i.slice,D=i.unshift,E=n.toString,l=n.hasOwnProperty,s=i.forEach,t=i.map,u=i.reduce,v=i.reduceRight,w=i.filter,x=i.every,y=i.some,o=i.indexOf,z=i.lastIndexOf;n=Array.isArray;var F=Object.keys,q=Function.prototype.bind,b=function(a){return new j(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):p._=b;b.VERSION="1.1.7";var h=b.each=b.forEach=function(a,c,b){if(a!=null)if(s&&a.forEach===s)a.forEach(c,b);else if(a.length===
+a.length)for(var e=0,k=a.length;e<k;e++){if(e in a&&c.call(b,a[e],e,a)===m)break}else for(e in a)if(l.call(a,e)&&c.call(b,a[e],e,a)===m)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(c,b);h(a,function(a,g,G){e[e.length]=c.call(b,a,g,G)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var k=d!==void 0;a==null&&(a=[]);if(u&&a.reduce===u)return e&&(c=b.bind(c,e)),k?a.reduce(c,d):a.reduce(c);h(a,function(a,b,f){k?d=c.call(e,d,a,b,f):(d=a,k=!0)});if(!k)throw new TypeError("Reduce of empty array with no initial value");
return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(v&&a.reduceRight===v)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;A(a,function(a,g,f){if(c.call(b,a,g,f))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(c,b);h(a,function(a,g,f){c.call(b,a,g,f)&&(e[e.length]=a)});return e};
b.reject=function(a,c,b){var e=[];if(a==null)return e;h(a,function(a,g,f){c.call(b,a,g,f)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=!0;if(a==null)return e;if(x&&a.every===x)return a.every(c,b);h(a,function(a,g,f){if(!(e=e&&c.call(b,a,g,f)))return m});return e};var A=b.some=b.any=function(a,c,d){c=c||b.identity;var e=!1;if(a==null)return e;if(y&&a.some===y)return a.some(c,d);h(a,function(a,b,f){if(e|=c.call(d,a,b,f))return m});return!!e};b.include=b.contains=function(a,c){var b=
!1;if(a==null)return b;if(o&&a.indexOf===o)return a.indexOf(c)!=-1;A(a,function(a){if(b=a===c)return!0});return b};b.invoke=function(a,c){var d=f.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,
c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,f){return{value:a,criteria:c.call(d,a,b,f)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,b){var d={};h(a,function(a,f){var g=b(a,f);(d[g]||(d[g]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||
(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(b.isArray(a))return f.call(a);if(b.isArguments(a))return f.call(a);return b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?f.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,d){return f.call(a,b==null||d?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,
function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));a[a.length]=d;return a},[])};b.without=function(a){return b.difference(a,f.call(arguments,1))};b.uniq=b.unique=function(a,c){return b.reduce(a,function(a,e,f){if(0==f||(c===!0?b.last(a)!=e:!b.include(a,e)))a[a.length]=e;return a},[])};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var c=f.call(arguments,1);return b.filter(b.uniq(a),
function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a,c){return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=f.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(o&&a.indexOf===o)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,
b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===q&&q)return q.apply(a,f.call(arguments,1));var d=f.call(arguments,2);return function(){return a.apply(b,d.concat(f.call(arguments)))}};b.bindAll=function(a){var c=f.call(arguments,1);
c.length==0&&(c=b.functions(a));h(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=f.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(f.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;
a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return B(a,b,!1)};b.debounce=function(a,b){return B(a,b,!0)};b.once=function(a){var b=!1,d;return function(){if(b)return d;b=!0;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(f.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=f.call(arguments);return function(){for(var b=f.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=
function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=F||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)l.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){h(f.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){h(f.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,c){if(a===c)return!0;var d=typeof a;if(d!=typeof c)return!1;if(a==c)return!0;if(!a&&c||a&&!c)return!1;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual)return a.isEqual(c);if(c.isEqual)return c.isEqual(a);if(b.isDate(a)&&b.isDate(c))return a.getTime()===c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!1;
if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(d!=="object")return!1;if(a.length&&a.length!==c.length)return!1;d=b.keys(a);var e=b.keys(c);if(d.length!=e.length)return!1;for(var f in a)if(!(f in c)||!b.isEqual(a[f],c[f]))return!1;return!0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(l.call(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&a.nodeType==
1)};b.isArray=n||function(a){return E.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||!a.getTimezoneOffset||
!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){p._=C;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.mixin=function(a){h(b.functions(a),function(c){H(c,b[c]=a[c])})};var I=0;b.uniqueId=function(a){var b=I++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};
b.template=function(a,c){var d=b.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return c?d(c):d};
var j=function(a){this._wrapped=a};b.prototype=j.prototype;var r=function(a,c){return c?b(a).chain():a},H=function(a,c){j.prototype[a]=function(){var a=f.call(arguments);D.call(a,this._wrapped);return r(c.apply(b,a),this._chain)}};b.mixin(b);h(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=i[a];j.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});h(["concat","join","slice"],function(a){var b=i[a];j.prototype[a]=function(){return r(b.apply(this._wrapped,
arguments),this._chain)}});j.prototype.chain=function(){this._chain=!0;return this};j.prototype.value=function(){return this._wrapped}})();
/*!
  * Reqwest! A general purpose XHR connection manager
  * (c) Dustin Diaz 2011
  * https://github.com/ded/reqwest
  * license MIT
  */
!function(a,b){typeof module!="undefined"?module.exports=b():typeof define=="function"&&define.amd?define(a,b):this[a]=b()}("reqwest",function(){function handleReadyState(a,b,c){return function(){a&&a[readyState]==4&&(twoHundo.test(a.status)?b(a):c(a))}}function setHeaders(a,b){var c=b.headers||{},d;c.Accept=c.Accept||defaultHeaders.accept[b.type]||defaultHeaders.accept["*"],!b.crossOrigin&&!c[requestedWith]&&(c[requestedWith]=defaultHeaders.requestedWith),c[contentType]||(c[contentType]=b.contentType||defaultHeaders.contentType);for(d in c)c.hasOwnProperty(d)&&a.setRequestHeader(d,c[d])}function generalCallback(a){lastValue=a}function urlappend(a,b){return a+(/\?/.test(a)?"&":"?")+b}function handleJsonp(a,b,c,d){var e=uniqid++,f=a.jsonpCallback||"callback",g=a.jsonpCallbackName||"reqwest_"+e,h=new RegExp("((^|\\?|&)"+f+")=([^&]+)"),i=d.match(h),j=doc.createElement("script"),k=0;i?i[3]==="?"?d=d.replace(h,"$1="+g):g=i[3]:d=urlappend(d,f+"="+g),win[g]=generalCallback,j.type="text/javascript",j.src=d,j.async=!0,typeof j.onreadystatechange!="undefined"&&(j.event="onclick",j.htmlFor=j.id="_reqwest_"+e),j.onload=j.onreadystatechange=function(){if(j[readyState]&&j[readyState]!=="complete"&&j[readyState]!=="loaded"||k)return!1;j.onload=j.onreadystatechange=null,j.onclick&&j.onclick(),a.success&&a.success(lastValue),lastValue=undefined,head.removeChild(j),k=1},head.appendChild(j)}function getRequest(a,b,c){var d=(a.method||"GET").toUpperCase(),e=typeof a=="string"?a:a.url,f=a.processData!==!1&&a.data&&typeof a.data!="string"?reqwest.toQueryString(a.data):a.data||null,g;return(a.type=="jsonp"||d=="GET")&&f&&(e=urlappend(e,f),f=null),a.type=="jsonp"?handleJsonp(a,b,c,e):(g=xhr(),g.open(d,e,!0),setHeaders(g,a),g.onreadystatechange=handleReadyState(g,b,c),a.before&&a.before(g),g.send(f),g)}function Reqwest(a,b){this.o=a,this.fn=b,init.apply(this,arguments)}function setType(a){var b=a.match(/\.(json|jsonp|html|xml)(\?|$)/);return b?b[1]:"js"}function init(o,fn){function complete(a){o.timeout&&clearTimeout(self.timeout),self.timeout=null,o.complete&&o.complete(a)}function success(resp){var r=resp.responseText;if(r)switch(type){case"json":try{resp=win.JSON?win.JSON.parse(r):eval("("+r+")")}catch(err){return error(resp,"Could not parse JSON in response",err)}break;case"js":resp=eval(r);break;case"html":resp=r}fn(resp),o.success&&o.success(resp),complete(resp)}function error(a,b,c){o.error&&o.error(a,b,c),complete(a)}this.url=typeof o=="string"?o:o.url,this.timeout=null;var type=o.type||setType(this.url),self=this;fn=fn||function(){},o.timeout&&(this.timeout=setTimeout(function(){self.abort()},o.timeout)),this.request=getRequest(o,success,error)}function reqwest(a,b){return new Reqwest(a,b)}function normalize(a){return a?a.replace(/\r?\n/g,"\r\n"):""}function serial(a,b){var c=a.name,d=a.tagName.toLowerCase(),e=function(a){a&&!a.disabled&&b(c,normalize(a.attributes.value&&a.attributes.value.specified?a.value:a.text))};if(a.disabled||!c)return;switch(d){case"input":if(!/reset|button|image|file/i.test(a.type)){var f=/checkbox/i.test(a.type),g=/radio/i.test(a.type),h=a.value;(!f&&!g||a.checked)&&b(c,normalize(f&&h===""?"on":h))}break;case"textarea":b(c,normalize(a.value));break;case"select":if(a.type.toLowerCase()==="select-one")e(a.selectedIndex>=0?a.options[a.selectedIndex]:null);else for(var i=0;a.length&&i<a.length;i++)a.options[i].selected&&e(a.options[i])}}function eachFormElement(){var a=this,b,c,d,e=function(b,c){for(var e=0;e<c.length;e++){var f=b[byTag](c[e]);for(d=0;d<f.length;d++)serial(f[d],a)}};for(c=0;c<arguments.length;c++)b=arguments[c],/input|select|textarea/i.test(b.tagName)&&serial(b,a),e(b,["input","select","textarea"])}function serializeQueryString(){return reqwest.toQueryString(reqwest.serializeArray.apply(null,arguments))}function serializeHash(){var a={};return eachFormElement.apply(function(b,c){b in a?(a[b]&&!isArray(a[b])&&(a[b]=[a[b]]),a[b].push(c)):a[b]=c},arguments),a}var context=this,win=window,doc=document,old=context.reqwest,twoHundo=/^20\d$/,byTag="getElementsByTagName",readyState="readyState",contentType="Content-Type",requestedWith="X-Requested-With",head=doc[byTag]("head")[0],uniqid=0,lastValue,xmlHttpRequest="XMLHttpRequest",isArray=typeof Array.isArray=="function"?Array.isArray:function(a){return a instanceof Array},defaultHeaders={contentType:"application/x-www-form-urlencoded",accept:{"*":"text/javascript, text/html, application/xml, text/xml, */*",xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript",js:"application/javascript, text/javascript"},requestedWith:xmlHttpRequest},xhr=win[xmlHttpRequest]?function(){return new XMLHttpRequest}:function(){return new ActiveXObject("Microsoft.XMLHTTP")};return Reqwest.prototype={abort:function(){this.request.abort()},retry:function(){init.call(this,this.o,this.fn)}},reqwest.serializeArray=function(){var a=[];return eachFormElement.apply(function(b,c){a.push({name:b,value:c})},arguments),a},reqwest.serialize=function(){if(arguments.length===0)return"";var a,b,c=Array.prototype.slice.call(arguments,0);return a=c.pop(),a&&a.nodeType&&c.push(a)&&(a=null),a&&(a=a.type),a=="map"?b=serializeHash:a=="array"?b=reqwest.serializeArray:b=serializeQueryString,b.apply(null,c)},reqwest.toQueryString=function(a){var b="",c,d=encodeURIComponent,e=function(a,c){b+=d(a)+"="+d(c)+"&"};if(isArray(a))for(c=0;a&&c<a.length;c++)e(a[c].name,a[c].value);else for(var f in a){if(!Object.hasOwnProperty.call(a,f))continue;var g=a[f];if(isArray(g))for(c=0;c<g.length;c++)e(f,g[c]);else e(f,a[f])}return b.replace(/&$/,"").replace(/%20/g,"+")},reqwest.compat=function(a,b){return a&&(a.type&&(a.method=a.type)&&delete a.type,a.dataType&&(a.type=a.dataType),a.jsonpCallback&&(a.jsonpCallbackName=a.jsonpCallback)&&delete a.jsonpCallback,a.jsonp&&(a.jsonpCallback=a.jsonp)),new Reqwest(a,b)},reqwest})

/**
 * The NPMap.Event class.
 */
NPMap.Event = (function() {
  var queue = [];
  
  return {
    /**
     * Add an event to an NPMap class.
     * @param {String} obj The name of the nested class, in "NPMap.ObjectName" format, to add the event to.
     * @param {String} event The name of the event to add to the class.
     * @param {Function} func The function to call when the event is fired.
     */
    add: function(obj, event, func) {
      var cl = obj.replace('NPMap.', '');

      if (NPMap[cl]) {
        NPMap[cl].events = NPMap[cl].events || [];

        NPMap[cl].events.push({
          event: event,
          func: func
        });
      } else {
        queue.push({
          cl: cl,
          event: event,
          func: func
        });
      }
    },
    /**
     * Processes the NPMap.Event queue.
     */
    processQueue: function() {
      $.each(queue, function(i, v) {
        NPMap[v.cl].events.push({
          event: v.event,
          func: v.func
        });
      });

      delete NPMap.Event.processQueue;
    },
    /**
     * Remove an existing event from an NPMap class.
     * @param {String} obj The name of the nested class, in "NPMap.ObjectName" format, to remove the event from.
     * @param {String} event The name of the event to remove to the class.
     * @param {Function} func The function to remove.
     */
    remove: function(obj, event, func) {
      var cl = obj.replace('NPMap.', '');
        
      if (NPMap[cl]) {
        var index = -1;
        
        for (var i = 0; i < NPMap[cl].handlers; i++) {
          if (NPMap[cl].handlers[i].event = event) {
            index = i;
            break;
          }
        }

        if (index != -1) {
          NPMap[cl].handlers.slice(index, 1);
        }
      }
    },
    /**
     * Triggers an event.
     * @param {String} obj The name of the nested class, in "NPMap.ObjectName" format, to trigger the event for.
     * @param {String} event The name of the event to trigger.
     * @param {Object} e (Optional) The event object to pass to the event handler function.
     */
    trigger: function(obj, event, e) {
      var cl = obj.replace('NPMap.', '');

      $.each(NPMap[cl].events, function(i, v) {
        if (v.event === event) {
          if (!e) {
            v.func();
          } else {
            v.func(e);
          }
        }
      });
    }
  };
})();

// Load NPMap's "base" CSS.
NPMap.utils.injectCss(NPMap.config.server + '/resources/css/npmap.css');

(function() {
  // TODO: Take out jQuery dependency. You can do everything you're currently doing without it.
  var jqueryLoaded = function() {
        /*!
         * jQuery resize event - v1.1 - 3/14/2010
         * http://benalman.com/projects/jquery-resize-plugin/
         * 
         * Copyright (c) 2010 "Cowboy" Ben Alman
         * Dual licensed under the MIT and GPL licenses.
         * http://benalman.com/about/license/
         */
        var w=window;
        (function(b,g,k){function h(){l=g[e](function(){c.each(function(){var a=b(this),c=a.width(),d=a.height(),j=b.data(this,i);if(c!==j.w||d!==j.h)a.trigger(f,[j.w=c,j.h=d])});h()},d[m])}var g=w,c=b([]),d=b.resize=b.extend(b.resize,{}),l,e="setTimeout",f="resize",i=f+"-special-event",m="delay";d[m]=250;d.throttleWindow=!0;b.event.special[f]={setup:function(){if(!d.throttleWindow&&this[e])return!1;var a=b(this);c=c.add(a);b.data(this,i,{w:a.width(),h:a.height()});1===c.length&&h()},teardown:function(){if(!d.throttleWindow&&this[e])return!1;
        var a=b(this);c=c.not(a);a.removeData(i);c.length||clearTimeout(l)},add:function(a){function c(a,d,e){var g=b(this),h=b.data(this,i);h.w=d!==k?d:g.width();h.h=e!==k?e:g.height();f.apply(this,arguments)}if(!d.throttleWindow&&this[e])return!1;var f;if(b.isFunction(a))return f=a,c;f=a.handler;a.handler=c}}})(jQuery,this);jQuery.resize.delay=100;jQuery.resize.throttleWindow=!1;
        /* Copyright 2011, Ben Lin (http://dreamerslab.com/)
         * Licensed under the MIT License (LICENSE.txt).
         *
         * Version: 1.0.5
         *
         * Requires: jQuery 1.2.3+
         */
        ;(function(a){a.fn.extend({actual:function(b,k){var c,d,h,g,f,j,e,i;if(!this[b]){throw'$.actual => The jQuery method "'+b+'" you called does not exist';}h=a.extend({absolute:false,clone:false,includeMargin:undefined},k);d=this;if(h.clone===true){e=function(){d=d.filter(":first").clone().css({position:"absolute",top:-1000}).appendTo("body");};i=function(){d.remove();};}else{e=function(){c=d.parents().andSelf().filter(":hidden");g=h.absolute===true?{position:"absolute",visibility:"hidden",display:"block"}:{visibility:"hidden",display:"block"};f=[];c.each(function(){var m={},l;for(l in g){m[l]=this.style[l];this.style[l]=g[l];}f.push(m);});};i=function(){c.each(function(m){var n=f[m],l;for(l in g){this.style[l]=n[l];}});};}e();j=d[b](h.includeMargin);i();return j;}});})(jQuery);
		
    		// TODO: You need to add support for operating in noConflict mode.
    		if (typeof $ === 'undefined') {
    		  $ = jQuery;
    		}

        $(document).ready(function() {
          loadMapping();
        });
      },
      loadMapping = function() {
        var apiUrl = null,
            callback = null,
            preLoaded = false;
        
        NPMap.apiLoaded = function() {
          var callback = function() {
            require([
              NPMap.config.server + '/' + NPMap.config.api + '/map.js'
            ], function(map) {
              var interval = setInterval(function() {
                if (map.isReady === true) {
                  var layerHandlers = [],
                      scripts = [];

                  clearInterval(interval);
                  
                  if (NPMap.config.baseLayers) {
                    $.each(NPMap.config.baseLayers, function(i, v) {
                      if (v.type && $.inArray(v.type, layerHandlers) === -1) {
                        layerHandlers.push(v.type);
                      }
                    });
                  }
                  
                  if (NPMap.config.layers) {
                    $.each(NPMap.config.layers, function(i, v) {
                      if (v.type && $.inArray(v.type, layerHandlers) === -1) {
                        layerHandlers.push(v.type);
                      }
                    });
                    $.each(layerHandlers, function(i, v) {
                      var layerType = v.toLowerCase();
                      
                      require([
                        NPMap.config.server + '/' + NPMap.config.api + '/layers/' + layerType + '.js'
                      ], function(layerHandler) {
                        $.each(NPMap.config.layers, function(i2, v2) {
                          if (v2.type.toLowerCase() === layerType) {
                            layerHandler.addLayer(v2);
                          }
                        });
                      });
                    });
                  }
  
                  // TODO: Delay the connection and module loads until after the layer handlers have all been fully added. Right now this is not necessary, but layers may need to hook into connection/module functionality in the future.
                  
                  if (NPMap.connections) {
                    $.each(NPMap.config.modules, function(i, v) {
                      scripts.push(NPMap.config.server + '/' + NPMap.config.api + '/connections/' + v.name.toLowerCase() + '.js');
                    });
                  }

                  if (NPMap.config.modules) {
                    $.each(NPMap.config.modules, function(i, v) {
                      scripts.push(NPMap.config.server + '/' + NPMap.config.api + '/modules/' + v.name.toLowerCase() + '.js');
                    });
                  }

                  require(scripts, function() {
                    callback = function() {
                      setTimeout(function() {
                        var location = escape(window.top.location),
                            query = escape(window.top.location.search),
                            locationUrl = location.replace(query, '');
  
                        $('#npmap-loading').hide();
                        $('#npmap-mask').fadeOut().remove();
                        NPMap.Event.processQueue();

                        if (location.indexOf('localhost') === -1 && location.indexOf('file:') === -1 && location.indexOf('file%3A') === -1) {
                          setTimeout(function() {
                            reqwest({
                              type: 'jsonp',
                              url: 'http://maps.nps.gov/track/load?a=' + NPMap.config.api + '&q=' + query + '&u=' + locationUrl + '&v=' + NPMap.version + '&callback=?'
                            });
                          }, 1000);
                        }
                      }, 100);
                    };

                    // Keep the NPMap namespace as clean as possible.
                    delete NPMap.apiLoaded;

                    if (NPMap.config.events && typeof(NPMap.config.events.init) === 'function') {
                      NPMap.config.events.init(callback);
                    } else {
                      callback();
                    }
                  });
                }
              }, 5);
            });
          };
          
          if (NPMap.config.events && typeof(NPMap.config.events.preinit) === 'function') {
            NPMap.config.events.preinit(callback);
          } else {
            callback();
          }
        };
          
        switch (NPMap.config.api) {
          case 'bing':
            apiUrl = 'http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onscriptload=callback';
            callback = function() {
              var interval = setInterval(function() {
                if (typeof(Microsoft) != 'undefined' && typeof(Microsoft.Maps) != 'undefined' && typeof(Microsoft.Maps.Globals) != 'undefined') {
                  clearInterval(interval);
  
                  if ($('head').html().indexOf('veapicore.js') === -1) {
                    var s = document.createElement('script');
                    s.src = Microsoft.Maps.Globals.jsPath + 'veapicore.js';
                    document.body.appendChild(s);
                  }
                  
                  interval = setInterval(function() {
                    if (typeof(Microsoft.Maps.Map) != 'undefined') {
                      clearInterval(interval);
                      NPMap.apiLoaded();
                    }
                  }, 5);
                }
              }, 5);
            };
            break;
          case 'esri':
            apiUrl = 'http://serverapi.arcgisonline.com/jsapi/arcgis/?v=2.8';
            callback = function() {
              var interval = setInterval(function() {
                if (typeof esri !== 'undefined') {
                  clearInterval(interval);
                  NPMap.apiLoaded();
                }
              }, 5);
            };
            break;
          case 'google':
            if (typeof(google) != 'undefined' && typeof(google.maps) != 'undefined') {
              callback = NPMap.apiLoaded();
              preLoaded = true;
            } else {
              apiUrl = 'http://maps.googleapis.com/maps/api/js?v=3&client=gme-usgovernmentdepartment&channel=nps-npmap&sensor=true&callback=NPMap.apiLoaded';

              if (NPMap.config.modules) {
                for (var i = 0; i < NPMap.config.modules.length; i++) {
                  if (NPMap.config.modules[i].name === 'edit') {
                    apiUrl += '&libraries=drawing';
                    break;
                  }
                }
              }
            }
            
            break;
          case 'modestmaps':
            apiUrl = 'http://www.nps.gov/npmap/scripts/libs/modestmaps-1.0.0-alpha-wax-6.0.0-beta5.min.js';
            //apiUrl = 'http://www.nps.gov/npmap/js/libs/modestmaps-wax-5.0.0.min.js';
            callback = function() {
              var int = setInterval(function() {
                if (typeof(com) != 'undefined' && typeof(com.modestmaps) != 'undefined' && typeof(com.modestmaps.Map) != 'undefined') {
                  clearInterval(int);
                  NPMap.apiLoaded();
                }
              }, 50);
            };
            break;
          default:
            NPMap.utils.throwError('Invalid base API specified.');
            break;
        }

        if (preLoaded) {
          if (callback) {
            callback();
          }
        } else {
          require([apiUrl], function() {
            if (callback) {
              callback();
            }
          });
        }
      },
      s = document.createElement('script'),
      url = 'http://www.nps.gov/npmap/js/libs/require';
  
  if (typeof(jQuery) === 'undefined') {
    url += '-jquery';
  }
  
  s.src = url + '-1.0.7.min.js';
  
  if (window.attachEvent && document.all) {
    s.onreadystatechange = function() {
      if (this.readyState === 'complete' || this.readyState === 'loaded') {
        jqueryLoaded();
      }
    };
  } else {
    s.onload = jqueryLoaded;
  }
  
  document.body.appendChild(s);
})();