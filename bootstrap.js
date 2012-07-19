NPMap.version = '0.8.0';

if (!NPMap.config) {
  throw new Error('The NPMap.config object does not exist!');
}

if (!NPMap.config.div) {
  throw new Error('The NPMap.config.div string does not exist!');
}

if (NPMap.config.api) {
  switch (NPMap.config.api.toLowerCase()) {
    case 'bing':
      NPMap.config.api = 'Bing';
      break;
    case 'esri':
      NPMap.config.api = 'Esri';
      break;
    case 'google':
      NPMap.config.api = 'Google';
      break;
    case 'leaflet':
      NPMap.config.api = 'Leaflet';
      break;
    case 'modestmaps':
      NPMap.config.api = 'ModestMaps';
      break;
    default:
      throw new Error('The NPMap.config.api config is invalid!');
  }
} else {
  NPMap.config.api = 'Bing';
}

if (typeof NPMap.config.server === 'undefined') {
  NPMap.config.server = 'http://www.nps.gov/npmap/' + NPMap.version;
}

document.getElementById(NPMap.config.div).innerHTML = '<div id="npmap" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div id="npmap-map"></div></div><div id="npmap-mask" style="background-color:#F0F0F0;display:block;height:100%;left:0;position:absolute;top:0;width:100%;z-index:999999;"><div id="npmap-loading" style="-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;-moz-box-shadow:0 0 3px 3px #CA702D;-webkit-box-shadow:0 0 3px 3px #CA702D;box-shadow:0 0 3px 3px #CA702D;background-color:black;border:solid black 2px;height:60px;left:50%;margin-left:-30px;margin-top:-30px;position:absolute;top:50%;width:60px;z-index:999998"><img src="' + NPMap.config.server + '/resources/img/loader.gif" /></div></div>';

NPMap.config.div = 'npmap-map';

// TODO: Move all of these dependencies out of bootstrap.js.

if (typeof JSON === 'undefined') {
  /**
   * Json2
   */
  var JSON;JSON||(JSON={});(function(){function k(a){return 10>a?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return"string"===typeof c?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function m(a,j){var c,d,h,n,g=e,f,b=j[a];b&&("object"===typeof b&&"function"===typeof b.toJSON)&&(b=b.toJSON(a));"function"===typeof i&&(b=i.call(j,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?""+b:"null";case "boolean":case "null":return""+b;case "object":if(!b)return"null";e+=l;f=[];if("[object Array]"===Object.prototype.toString.apply(b)){n=b.length;for(c=0;c<n;c+=1)f[c]=m(c,b)||"null";h=0===f.length?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&"object"===typeof i){n=i.length;for(c=0;c<n;c+=1)"string"===typeof i[c]&&(d=i[c],(h=m(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=m(d,b))&&f.push(o(d)+(e?": ":":")+h);h=0===f.length?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+"}";e=g;return h}}"function"!==typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,l,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;"function"!==typeof JSON.stringify&&(JSON.stringify=function(a,j,c){var d;l=e="";if(typeof c==="number")for(d=0;d<c;d=d+1)l=l+" ";else typeof c==="string"&&(l=c);if((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return m("",{"":a})});"function"!==typeof JSON.parse&&(JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)if(Object.prototype.hasOwnProperty.call(b,g)){f=c(b,g);f!==void 0?b[g]=f:delete b[g]}return e.call(a,d,b)}var d,a=""+a;q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){d=eval("("+a+")");return typeof e==="function"?c({"":d},""):d}throw new SyntaxError("JSON.parse");})})();
}

/**
 * Log - http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
 */
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try {console.log();return window.console;}catch(err){return window.console={};}})());

if (!window.Modernizr) {
  /**
   * Modernizr 2.0.6 (Custom Build) | MIT & BSD
   * Contains: boxshadow | opacity | iepp | cssclasses | testprop | testallprops | prefixes | domprefixes | load
   */
  ;window.Modernizr=function(a,b,c){function B(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+o.join(c+" ")+c).split(" ");return A(d,b)}function A(a,b){for(var d in a)if(k[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function z(a,b){return!!~(""+a).indexOf(b)}function y(a,b){return typeof a===b}function x(a,b){return w(n.join(a+";")+(b||""))}function w(a){k.cssText=a}var d="2.0.6",e={},f=!0,g=b.documentElement,h=b.head||b.getElementsByTagName("head")[0],i="modernizr",j=b.createElement(i),k=j.style,l,m=Object.prototype.toString,n=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),o="Webkit Moz O ms Khtml".split(" "),p={},q={},r={},s=[],t,u={}.hasOwnProperty,v;!y(u,c)&&!y(u.call,c)?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],c)},p.boxshadow=function(){return B("boxShadow")},p.opacity=function(){x("opacity:.55");return/^0.55$/.test(k.opacity)};for(var C in p)v(p,C)&&(t=C.toLowerCase(),e[t]=p[C](),s.push((e[t]?"":"no-")+t));w(""),j=l=null,a.attachEvent&&function(){var a=b.createElement("div");a.innerHTML="<elem></elem>";return a.childNodes.length!==1}()&&function(a,b){function s(a){var b=-1;while(++b<g)a.createElement(f[b])}a.iepp=a.iepp||{};var d=a.iepp,e=d.html5elements||"abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",f=e.split("|"),g=f.length,h=new RegExp("(^|\\s)("+e+")","gi"),i=new RegExp("<(/*)("+e+")","gi"),j=/^\s*[\{\}]\s*$/,k=new RegExp("(^|[^\\n]*?\\s)("+e+")([^\\n]*)({[\\n\\w\\W]*?})","gi"),l=b.createDocumentFragment(),m=b.documentElement,n=m.firstChild,o=b.createElement("body"),p=b.createElement("style"),q=/print|all/,r;d.getCSS=function(a,b){if(a+""===c)return"";var e=-1,f=a.length,g,h=[];while(++e<f){g=a[e];if(g.disabled)continue;b=g.media||b,q.test(b)&&h.push(d.getCSS(g.imports,b),g.cssText),b="all"}return h.join("")},d.parseCSS=function(a){var b=[],c;while((c=k.exec(a))!=null)b.push(((j.exec(c[1])?"\n":c[1])+c[2]+c[3]).replace(h,"$1.iepp_$2")+c[4]);return b.join("\n")},d.writeHTML=function(){var a=-1;r=r||b.body;while(++a<g){var c=b.getElementsByTagName(f[a]),d=c.length,e=-1;while(++e<d)c[e].className.indexOf("iepp_")<0&&(c[e].className+=" iepp_"+f[a])}l.appendChild(r),m.appendChild(o),o.className=r.className,o.id=r.id,o.innerHTML=r.innerHTML.replace(i,"<$1font")},d._beforePrint=function(){p.styleSheet.cssText=d.parseCSS(d.getCSS(b.styleSheets,"all")),d.writeHTML()},d.restoreHTML=function(){o.innerHTML="",m.removeChild(o),m.appendChild(r)},d._afterPrint=function(){d.restoreHTML(),p.styleSheet.cssText=""},s(b),s(l);d.disablePP||(n.insertBefore(p,n.firstChild),p.media="print",p.className="iepp-printshim",a.attachEvent("onbeforeprint",d._beforePrint),a.attachEvent("onafterprint",d._afterPrint))}(a,b),e._version=d,e._prefixes=n,e._domPrefixes=o,e.testProp=function(a){return A([a])},e.testAllProps=B,g.className=g.className.replace(/\bno-js\b/,"")+(f?" js "+s.join(" "):"");return e}(this,this.document),function(a,b,c){function k(a){return!a||a=="loaded"||a=="complete"}function j(){var a=1,b=-1;while(p.length- ++b)if(p[b].s&&!(a=p[b].r))break;a&&g()}function i(a){var c=b.createElement("script"),d;c.src=a.s,c.onreadystatechange=c.onload=function(){!d&&k(c.readyState)&&(d=1,j(),c.onload=c.onreadystatechange=null)},m(function(){d||(d=1,j())},H.errorTimeout),a.e?c.onload():n.parentNode.insertBefore(c,n)}function h(a){var c=b.createElement("link"),d;c.href=a.s,c.rel="stylesheet",c.type="text/css";if(!a.e&&(w||r)){var e=function(a){m(function(){if(!d)try{a.sheet.cssRules.length?(d=1,j()):e(a)}catch(b){b.code==1e3||b.message=="security"||b.message=="denied"?(d=1,m(function(){j()},0)):e(a)}},0)};e(c)}else c.onload=function(){d||(d=1,m(function(){j()},0))},a.e&&c.onload();m(function(){d||(d=1,j())},H.errorTimeout),!a.e&&n.parentNode.insertBefore(c,n)}function g(){var a=p.shift();q=1,a?a.t?m(function(){a.t=="c"?h(a):i(a)},0):(a(),j()):q=0}function f(a,c,d,e,f,h){function i(){!o&&k(l.readyState)&&(r.r=o=1,!q&&j(),l.onload=l.onreadystatechange=null,m(function(){u.removeChild(l)},0))}var l=b.createElement(a),o=0,r={t:d,s:c,e:h};l.src=l.data=c,!s&&(l.style.display="none"),l.width=l.height="0",a!="object"&&(l.type=d),l.onload=l.onreadystatechange=i,a=="img"?l.onerror=i:a=="script"&&(l.onerror=function(){r.e=r.r=1,g()}),p.splice(e,0,r),u.insertBefore(l,s?null:n),m(function(){o||(u.removeChild(l),r.r=r.e=o=1,j())},H.errorTimeout)}function e(a,b,c){var d=b=="c"?z:y;q=0,b=b||"j",C(a)?f(d,a,b,this.i++,l,c):(p.splice(this.i++,0,a),p.length==1&&g());return this}function d(){var a=H;a.loader={load:e,i:0};return a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=r&&!s,u=s?l:n.parentNode,v=a.opera&&o.call(a.opera)=="[object Opera]",w="webkitAppearance"in l.style,x=w&&"async"in b.createElement("script"),y=r?"object":v||x?"img":"script",z=w?"img":y,A=Array.isArray||function(a){return o.call(a)=="[object Array]"},B=function(a){return Object(a)===a},C=function(a){return typeof a=="string"},D=function(a){return o.call(a)=="[object Function]"},E=[],F={},G,H;H=function(a){function f(a){var b=a.split("!"),c=E.length,d=b.pop(),e=b.length,f={url:d,origUrl:d,prefixes:b},g,h;for(h=0;h<e;h++)g=F[b[h]],g&&(f=g(f));for(h=0;h<c;h++)f=E[h](f);return f}function e(a,b,e,g,h){var i=f(a),j=i.autoCallback;if(!i.bypass){b&&(b=D(b)?b:b[a]||b[g]||b[a.split("/").pop().split("?")[0]]);if(i.instead)return i.instead(a,b,e,g,h);e.load(i.url,i.forceCSS||!i.forceJS&&/css$/.test(i.url)?"c":c,i.noexec),(D(b)||D(j))&&e.load(function(){d(),b&&b(i.origUrl,h,g),j&&j(i.origUrl,h,g)})}}function b(a,b){function c(a){if(C(a))e(a,h,b,0,d);else if(B(a))for(i in a)a.hasOwnProperty(i)&&e(a[i],h,b,i,d)}var d=!!a.test,f=d?a.yep:a.nope,g=a.load||a.both,h=a.callback,i;c(f),c(g),a.complete&&b.load(a.complete)}var g,h,i=this.yepnope.loader;if(C(a))e(a,0,i,0);else if(A(a))for(g=0;g<a.length;g++)h=a[g],C(h)?e(h,0,i,0):A(h)?H(h):B(h)&&b(h,i);else B(a)&&b(a,i)},H.addPrefix=function(a,b){F[a]=b},H.addFilter=function(a){E.push(a)},H.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",G=function(){b.removeEventListener("DOMContentLoaded",G,0),b.readyState="complete"},0)),a.yepnope=d()}(this,this.document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
}

if (typeof _ === 'undefined') {
  /**
   * Underscore.js 1.1.7
   * (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
   * Underscore is freely distributable under the MIT license.
   * Portions of Underscore are inspired or borrowed from Prototype,
   * Oliver Steele's Functional, and John Resig's Micro-Templating.
   * For all details and documentation: http://documentcloud.github.com/underscore
   */
  (function(){var p=this,C=p._,m={},i=Array.prototype,n=Object.prototype,f=i.slice,D=i.unshift,E=n.toString,l=n.hasOwnProperty,s=i.forEach,t=i.map,u=i.reduce,v=i.reduceRight,w=i.filter,x=i.every,y=i.some,o=i.indexOf,z=i.lastIndexOf;n=Array.isArray;var F=Object.keys,q=Function.prototype.bind,b=function(a){return new j(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):p._=b;b.VERSION="1.1.7";var h=b.each=b.forEach=function(a,c,b){if(a!=null)if(s&&a.forEach===s)a.forEach(c,b);else if(a.length=== +a.length)for(var e=0,k=a.length;e<k;e++){if(e in a&&c.call(b,a[e],e,a)===m)break}else for(e in a)if(l.call(a,e)&&c.call(b,a[e],e,a)===m)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(c,b);h(a,function(a,g,G){e[e.length]=c.call(b,a,g,G)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var k=d!==void 0;a==null&&(a=[]);if(u&&a.reduce===u)return e&&(c=b.bind(c,e)),k?a.reduce(c,d):a.reduce(c);h(a,function(a,b,f){k?d=c.call(e,d,a,b,f):(d=a,k=!0)});if(!k)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(v&&a.reduceRight===v)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;A(a,function(a,g,f){if(c.call(b,a,g,f))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(c,b);h(a,function(a,g,f){c.call(b,a,g,f)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;h(a,function(a,g,f){c.call(b,a,g,f)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=!0;if(a==null)return e;if(x&&a.every===x)return a.every(c,b);h(a,function(a,g,f){if(!(e=e&&c.call(b,a,g,f)))return m});return e};var A=b.some=b.any=function(a,c,d){c=c||b.identity;var e=!1;if(a==null)return e;if(y&&a.some===y)return a.some(c,d);h(a,function(a,b,f){if(e|=c.call(d,a,b,f))return m});return!!e};b.include=b.contains=function(a,c){var b= !1;if(a==null)return b;if(o&&a.indexOf===o)return a.indexOf(c)!=-1;A(a,function(a){if(b=a===c)return!0});return b};b.invoke=function(a,c){var d=f.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,f){return{value:a,criteria:c.call(d,a,b,f)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,b){var d={};h(a,function(a,f){var g=b(a,f);(d[g]||(d[g]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(b.isArray(a))return f.call(a);if(b.isArguments(a))return f.call(a);return b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?f.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,d){return f.call(a,b==null||d?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));a[a.length]=d;return a},[])};b.without=function(a){return b.difference(a,f.call(arguments,1))};b.uniq=b.unique=function(a,c){return b.reduce(a,function(a,e,f){if(0==f||(c===!0?b.last(a)!=e:!b.include(a,e)))a[a.length]=e;return a},[])};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var c=f.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a,c){return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=f.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(o&&a.indexOf===o)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===q&&q)return q.apply(a,f.call(arguments,1));var d=f.call(arguments,2);return function(){return a.apply(b,d.concat(f.call(arguments)))}};b.bindAll=function(a){var c=f.call(arguments,1);c.length==0&&(c=b.functions(a));h(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=f.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(f.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return B(a,b,!1)};b.debounce=function(a,b){return B(a,b,!0)};b.once=function(a){var b=!1,d;return function(){if(b)return d;b=!0;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(f.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=f.call(arguments);return function(){for(var b=f.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=F||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)l.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){h(f.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){h(f.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,c){if(a===c)return!0;var d=typeof a;if(d!=typeof c)return!1;if(a==c)return!0;if(!a&&c||a&&!c)return!1;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual)return a.isEqual(c);if(c.isEqual)return c.isEqual(a);if(b.isDate(a)&&b.isDate(c))return a.getTime()===c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!1;if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(d!=="object")return!1;if(a.length&&a.length!==c.length)return!1;d=b.keys(a);var e=b.keys(c);if(d.length!=e.length)return!1;for(var f in a)if(!(f in c)||!b.isEqual(a[f],c[f]))return!1;return!0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(l.call(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=n||function(a){return E.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||!a.getTimezoneOffset||!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){p._=C;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.mixin=function(a){h(b.functions(a),function(c){H(c,b[c]=a[c])})};var I=0;b.uniqueId=function(a){var b=I++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};b.template=function(a,c){var d=b.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return c?d(c):d};var j=function(a){this._wrapped=a};b.prototype=j.prototype;var r=function(a,c){return c?b(a).chain():a},H=function(a,c){j.prototype[a]=function(){var a=f.call(arguments);D.call(a,this._wrapped);return r(c.apply(b,a),this._chain)}};b.mixin(b);h(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=i[a];j.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});h(["concat","join","slice"],function(a){var b=i[a];j.prototype[a]=function(){return r(b.apply(this._wrapped,arguments),this._chain)}});j.prototype.chain=function(){this._chain=!0;return this};j.prototype.value=function(){return this._wrapped}})();
}

if (typeof reqwest === 'undefined') {
  /**
   * Reqwest! A general purpose XHR connection manager
   * (c) Dustin Diaz 2011
   * https://github.com/ded/reqwest
   * license MIT
   */
  !function(a,b){typeof module!="undefined"?module.exports=b():typeof define=="function"&&define.amd?define(a,b):this[a]=b()}("reqwest",function(){function handleReadyState(a,b,c){return function(){a&&a[readyState]==4&&(twoHundo.test(a.status)?b(a):c(a))}}function setHeaders(a,b){var c=b.headers||{},d;c.Accept=c.Accept||defaultHeaders.accept[b.type]||defaultHeaders.accept["*"],!b.crossOrigin&&!c[requestedWith]&&(c[requestedWith]=defaultHeaders.requestedWith),c[contentType]||(c[contentType]=b.contentType||defaultHeaders.contentType);for(d in c)c.hasOwnProperty(d)&&a.setRequestHeader(d,c[d])}function generalCallback(a){lastValue=a}function urlappend(a,b){return a+(/\?/.test(a)?"&":"?")+b}function handleJsonp(a,b,c,d){var e=uniqid++,f=a.jsonpCallback||"callback",g=a.jsonpCallbackName||"reqwest_"+e,h=new RegExp("((^|\\?|&)"+f+")=([^&]+)"),i=d.match(h),j=doc.createElement("script"),k=0;i?i[3]==="?"?d=d.replace(h,"$1="+g):g=i[3]:d=urlappend(d,f+"="+g),win[g]=generalCallback,j.type="text/javascript",j.src=d,j.async=!0,typeof j.onreadystatechange!="undefined"&&(j.event="onclick",j.htmlFor=j.id="_reqwest_"+e),j.onload=j.onreadystatechange=function(){if(j[readyState]&&j[readyState]!=="complete"&&j[readyState]!=="loaded"||k)return!1;j.onload=j.onreadystatechange=null,j.onclick&&j.onclick(),a.success&&a.success(lastValue),lastValue=undefined,head.removeChild(j),k=1},head.appendChild(j)}function getRequest(a,b,c){var d=(a.method||"GET").toUpperCase(),e=typeof a=="string"?a:a.url,f=a.processData!==!1&&a.data&&typeof a.data!="string"?reqwest.toQueryString(a.data):a.data||null,g;return(a.type=="jsonp"||d=="GET")&&f&&(e=urlappend(e,f),f=null),a.type=="jsonp"?handleJsonp(a,b,c,e):(g=xhr(),g.open(d,e,!0),setHeaders(g,a),g.onreadystatechange=handleReadyState(g,b,c),a.before&&a.before(g),g.send(f),g)}function Reqwest(a,b){this.o=a,this.fn=b,init.apply(this,arguments)}function setType(a){var b=a.match(/\.(json|jsonp|html|xml)(\?|$)/);return b?b[1]:"js"}function init(o,fn){function complete(a){o.timeout&&clearTimeout(self.timeout),self.timeout=null,o.complete&&o.complete(a)}function success(resp){var r=resp.responseText;if(r)switch(type){case"json":try{resp=win.JSON?win.JSON.parse(r):eval("("+r+")")}catch(err){return error(resp,"Could not parse JSON in response",err)}break;case"js":resp=eval(r);break;case"html":resp=r}fn(resp),o.success&&o.success(resp),complete(resp)}function error(a,b,c){o.error&&o.error(a,b,c),complete(a)}this.url=typeof o=="string"?o:o.url,this.timeout=null;var type=o.type||setType(this.url),self=this;fn=fn||function(){},o.timeout&&(this.timeout=setTimeout(function(){self.abort()},o.timeout)),this.request=getRequest(o,success,error)}function reqwest(a,b){return new Reqwest(a,b)}function normalize(a){return a?a.replace(/\r?\n/g,"\r\n"):""}function serial(a,b){var c=a.name,d=a.tagName.toLowerCase(),e=function(a){a&&!a.disabled&&b(c,normalize(a.attributes.value&&a.attributes.value.specified?a.value:a.text))};if(a.disabled||!c)return;switch(d){case"input":if(!/reset|button|image|file/i.test(a.type)){var f=/checkbox/i.test(a.type),g=/radio/i.test(a.type),h=a.value;(!f&&!g||a.checked)&&b(c,normalize(f&&h===""?"on":h))}break;case"textarea":b(c,normalize(a.value));break;case"select":if(a.type.toLowerCase()==="select-one")e(a.selectedIndex>=0?a.options[a.selectedIndex]:null);else for(var i=0;a.length&&i<a.length;i++)a.options[i].selected&&e(a.options[i])}}function eachFormElement(){var a=this,b,c,d,e=function(b,c){for(var e=0;e<c.length;e++){var f=b[byTag](c[e]);for(d=0;d<f.length;d++)serial(f[d],a)}};for(c=0;c<arguments.length;c++)b=arguments[c],/input|select|textarea/i.test(b.tagName)&&serial(b,a),e(b,["input","select","textarea"])}function serializeQueryString(){return reqwest.toQueryString(reqwest.serializeArray.apply(null,arguments))}function serializeHash(){var a={};return eachFormElement.apply(function(b,c){b in a?(a[b]&&!isArray(a[b])&&(a[b]=[a[b]]),a[b].push(c)):a[b]=c},arguments),a}var context=this,win=window,doc=document,old=context.reqwest,twoHundo=/^20\d$/,byTag="getElementsByTagName",readyState="readyState",contentType="Content-Type",requestedWith="X-Requested-With",head=doc[byTag]("head")[0],uniqid=0,lastValue,xmlHttpRequest="XMLHttpRequest",isArray=typeof Array.isArray=="function"?Array.isArray:function(a){return a instanceof Array},defaultHeaders={contentType:"application/x-www-form-urlencoded",accept:{"*":"text/javascript, text/html, application/xml, text/xml, */*",xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript",js:"application/javascript, text/javascript"},requestedWith:xmlHttpRequest},xhr=win[xmlHttpRequest]?function(){return new XMLHttpRequest}:function(){return new ActiveXObject("Microsoft.XMLHTTP")};return Reqwest.prototype={abort:function(){this.request.abort()},retry:function(){init.call(this,this.o,this.fn)}},reqwest.serializeArray=function(){var a=[];return eachFormElement.apply(function(b,c){a.push({name:b,value:c})},arguments),a},reqwest.serialize=function(){if(arguments.length===0)return"";var a,b,c=Array.prototype.slice.call(arguments,0);return a=c.pop(),a&&a.nodeType&&c.push(a)&&(a=null),a&&(a=a.type),a=="map"?b=serializeHash:a=="array"?b=reqwest.serializeArray:b=serializeQueryString,b.apply(null,c)},reqwest.toQueryString=function(a){var b="",c,d=encodeURIComponent,e=function(a,c){b+=d(a)+"="+d(c)+"&"};if(isArray(a))for(c=0;a&&c<a.length;c++)e(a[c].name,a[c].value);else for(var f in a){if(!Object.hasOwnProperty.call(a,f))continue;var g=a[f];if(isArray(g))for(c=0;c<g.length;c++)e(f,g[c]);else e(f,a[f])}return b.replace(/&$/,"").replace(/%20/g,"+")},reqwest.compat=function(a,b){return a&&(a.type&&(a.method=a.type)&&delete a.type,a.dataType&&(a.type=a.dataType),a.jsonpCallback&&(a.jsonpCallbackName=a.jsonpCallback)&&delete a.jsonpCallback,a.jsonp&&(a.jsonpCallback=a.jsonp)),new Reqwest(a,b)},reqwest})
}

if (typeof bean === 'undefined') {
  /**
   * bean.js - copyright Jacob Thornton 2011
   * https://github.com/fat/bean
   * MIT License
   * special thanks to:
   * dean edwards: http://dean.edwards.name/
   * dperini: https://github.com/dperini/nwevents
   * the entire mootools team: github.com/mootools/mootools-core
   */
  !function(a,b,c){typeof module!="undefined"?module.exports=c(a,b):typeof define=="function"&&typeof define.amd=="object"?define(c):b[a]=c(a,b)}("bean",this,function(a,b){var c=window,d=b[a],e=/over|out/,f=/[^\.]*(?=\..*)\.|.*/,g=/\..*/,h="addEventListener",i="attachEvent",j="removeEventListener",k="detachEvent",l="ownerDocument",m="target",n="querySelectorAll",o=document||{},p=o.documentElement||{},q=p[h],r=q?h:i,s=Array.prototype.slice,t=/click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i,u=/mouse.*(wheel|scroll)/i,v=/^text/i,w=/^touch|^gesture/i,x={},y=function(a,b,c){for(c=0;c<b.length;c++)a[b[c]]=1;return a}({},("click dblclick mouseup mousedown contextmenu mousewheel mousemultiwheel DOMMouseScroll mouseover mouseout mousemove selectstart selectend keydown keypress keyup orientationchange focus blur change reset select submit load unload beforeunload resize move DOMContentLoaded readystatechange message error abort scroll "+(q?"show input invalid touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend readystatechange pageshow pagehide popstate hashchange offline online afterprint beforeprint dragstart dragenter dragover dragleave drag drop dragend loadstart progress suspend emptied stalled loadmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate play pause ratechange volumechange cuechange checking noupdate downloading cached updateready obsolete ":"")).split(" ")),z=function(){function c(a){var c=a.relatedTarget;return c?c!==this&&c.prefix!=="xul"&&!/document/.test(this.toString())&&!b(c,this):c===null}var a="compareDocumentPosition",b=a in p?function(b,c){return c[a]&&(c[a](b)&16)===16}:"contains"in p?function(a,b){return b=b.nodeType===9||b===window?p:b,b!==a&&b.contains(a)}:function(a,b){while(a=a.parentNode)if(a===b)return 1;return 0};return{mouseenter:{base:"mouseover",condition:c},mouseleave:{base:"mouseout",condition:c},mousewheel:{base:/Firefox/.test(navigator.userAgent)?"DOMMouseScroll":"mousewheel"}}}(),A=function(){var a="altKey attrChange attrName bubbles cancelable ctrlKey currentTarget detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey srcElement target timeStamp type view which".split(" "),b=a.concat("button buttons clientX clientY dataTransfer fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" ")),c=b.concat("wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ axis".split(" ")),d=a.concat("char charCode key keyCode keyIdentifier keyLocation".split(" ")),f=a.concat(["data"]),g=a.concat("touches targetTouches changedTouches scale rotation".split(" ")),h=a.concat(["data","origin","source"]),i="preventDefault",j=function(a){return function(){a[i]?a[i]():a.returnValue=!1}},k="stopPropagation",l=function(a){return function(){a[k]?a[k]():a.cancelBubble=!0}},n=function(a){return function(){a[i](),a[k](),a.stopped=!0}},q=function(a,b,c){var d,e;for(d=c.length;d--;)e=c[d],!(e in b)&&e in a&&(b[e]=a[e])};return function(r,s){var x={originalEvent:r,isNative:s};if(!r)return x;var y,z=r.type,A=r[m]||r.srcElement;x[i]=j(r),x[k]=l(r),x.stop=n(x),x[m]=A&&A.nodeType===3?A.parentNode:A;if(s){if(z.indexOf("key")!==-1)y=d,x.keyCode=r.keyCode||r.which;else if(t.test(z)){y=b,x.rightClick=r.which===3||r.button===2,x.pos={x:0,y:0};if(r.pageX||r.pageY)x.clientX=r.pageX,x.clientY=r.pageY;else if(r.clientX||r.clientY)x.clientX=r.clientX+o.body.scrollLeft+p.scrollLeft,x.clientY=r.clientY+o.body.scrollTop+p.scrollTop;e.test(z)&&(x.relatedTarget=r.relatedTarget||r[(z==="mouseover"?"from":"to")+"Element"])}else w.test(z)?y=g:u.test(z)?y=c:v.test(z)?y=f:z==="message"&&(y=h);q(r,x,y||a)}return x}}(),B=function(a,b){return!q&&!b&&(a===o||a===c)?p:a},C=function(){function a(a,b,c,d,e){var f=this.isNative=y[b]&&a[r];this.element=a,this.type=b,this.handler=c,this.original=d,this.namespaces=e,this.custom=z[b],this.eventType=q||f?b:"propertychange",this.customType=!q&&!f&&b,this[m]=B(a,f),this[r]=this[m][r]}return a.prototype={inNamespaces:function(a){var b,c;if(!a)return!0;if(!this.namespaces)return!1;for(b=a.length;b--;)for(c=this.namespaces.length;c--;)if(a[b]===this.namespaces[c])return!0;return!1},matches:function(a,b,c){return this.element===a&&(!b||this.original===b)&&(!c||this.handler===c)}},a}(),D=function(){var a={},b=function(c,d,e,f,g){if(!d||d==="*")for(var h in a)h.charAt(0)==="$"&&b(c,h.substr(1),e,f,g);else{var i=0,j,k=a["$"+d],l=c==="*";if(!k)return;for(j=k.length;i<j;i++)if(l||k[i].matches(c,e,f))if(!g(k[i],k,i,d))return}},c=function(b,c,d){var e,f=a["$"+c];if(f)for(e=f.length;e--;)if(f[e].matches(b,d,null))return!0;return!1},d=function(a,c,d){var e=[];return b(a,c,d,null,function(a){return e.push(a)}),e},e=function(b){return(a["$"+b.type]||(a["$"+b.type]=[])).push(b),b},f=function(c){b(c.element,c.type,null,c.handler,function(b,c,d){return c.splice(d,1),c.length===0&&delete a["$"+b.type],!1})},g=function(){var b,c=[];for(b in a)b.charAt(0)==="$"&&(c=c.concat(a[b]));return c};return{has:c,get:d,put:e,del:f,entries:g}}(),E=o[n]?function(a,b){return b[n](a)}:function(){throw new Error("Bean: No selector engine installed")},F=function(a){E=a},G=q?function(a,b,c,d){a[d?h:j](b,c,!1)}:function(a,b,c,d,e){e&&d&&a["_on"+e]===null&&(a["_on"+e]=0),a[d?i:k]("on"+b,c)},H=function(a,b,d){var e=b.__beanDel,f=function(f){return f=A(f||((this[l]||this.document||this).parentWindow||c).event,!0),e&&(f.currentTarget=e.ft(f[m],a)),b.apply(a,[f].concat(d))};return f.__beanDel=e,f},I=function(a,b,d,e,f,g){var h=b.__beanDel,i=function(i){var j=h?h.ft(i[m],a):this;if(e?e.apply(j,arguments):q?!0:i&&i.propertyName==="_on"+d||!i)i&&(i=A(i||((this[l]||this.document||this).parentWindow||c).event,g),i.currentTarget=j),b.apply(a,i&&(!f||f.length===0)?arguments:s.call(arguments,i?0:1).concat(f))};return i.__beanDel=h,i},J=function(a,b,c,d,e){return function(){a(b,c,e),d.apply(this,arguments)}},K=function(a,b,c,d){var e,f,h,i=b&&b.replace(g,""),j=D.get(a,i,c);for(e=0,f=j.length;e<f;e++)j[e].inNamespaces(d)&&((h=j[e])[r]&&G(h[m],h.eventType,h.handler,!1,h.type),D.del(h))},L=function(a,b,c,d,e){var h,i=b.replace(g,""),j=b.replace(f,"").split(".");if(D.has(a,i,c))return a;i==="unload"&&(c=J(K,a,i,c,d)),z[i]&&(z[i].condition&&(c=I(a,c,i,z[i].condition,e,!0)),i=z[i].base||i),h=D.put(new C(a,i,c,d,j[0]&&j)),h.handler=h.isNative?H(a,h.handler,e):I(a,h.handler,i,!1,e,!1),h[r]&&G(h[m],h.eventType,h.handler,!0,h.customType)},M=function(a,b,c){var d=function(b,d){var e,f=typeof a=="string"?c(a,d):a;for(;b&&b!==d;b=b.parentNode)for(e=f.length;e--;)if(f[e]===b)return b},e=function(a){var c=d(a[m],this);c&&b.apply(c,arguments)};return e.__beanDel={ft:d,selector:a,$:c},e},N=function(a,b,c){var d,e,h,i,j=K,k=b&&typeof b=="string";if(k&&b.indexOf(" ")>0){b=b.split(" ");for(i=b.length;i--;)N(a,b[i],c);return a}e=k&&b.replace(g,""),e&&z[e]&&(e=z[e].type);if(!b||k){if(h=k&&b.replace(f,""))h=h.split(".");j(a,e,c,h)}else if(typeof b=="function")j(a,null,b);else for(d in b)b.hasOwnProperty(d)&&N(a,d,b[d]);return a},O=function(a,b,c,d,e){var f,g,h,i,j=c,k=c&&typeof c=="string";if(b&&!c&&typeof b=="object")for(f in b)b.hasOwnProperty(f)&&O.apply(this,[a,f,b[f]]);else{i=arguments.length>3?s.call(arguments,3):[],g=(k?c:b).split(" "),k&&(c=M(b,j=d,e||E))&&(i=s.call(i,1)),this===x&&(c=J(N,a,b,c,j));for(h=g.length;h--;)L(a,g[h],c,j,i)}return a},P=function(){return O.apply(x,arguments)},Q=q?function(a,b,d){var e=o.createEvent(a?"HTMLEvents":"UIEvents");e[a?"initEvent":"initUIEvent"](b,!0,!0,c,1),d.dispatchEvent(e)}:function(a,b,c){c=B(c,a),a?c.fireEvent("on"+b,o.createEventObject()):c["_on"+b]++},R=function(a,b,c){var d,e,h,i,j,k=b.split(" ");for(d=k.length;d--;){b=k[d].replace(g,"");if(i=k[d].replace(f,""))i=i.split(".");if(!i&&!c&&a[r])Q(y[b],b,a);else{j=D.get(a,b),c=[!1].concat(c);for(e=0,h=j.length;e<h;e++)j[e].inNamespaces(i)&&j[e].handler.apply(a,c)}}return a},S=function(a,b,c){var d=0,e=D.get(b,c),f=e.length,g,h;for(;d<f;d++)e[d].original&&(h=e[d].handler.__beanDel,h?g=[a,h.selector,e[d].type,e[d].original,h.$]:g=[a,e[d].type,e[d].original],O.apply(null,g));return a},T={add:O,one:P,remove:N,clone:S,fire:R,setSelectorEngine:F,noConflict:function(){return b[a]=d,this}};if(c[i]){var U=function(){var a,b=D.entries();for(a in b)b[a].type&&b[a].type!=="unload"&&N(b[a].element,b[a].type);c[k]("onunload",U),c.CollectGarbage&&c.CollectGarbage()};c[i]("onunload",U)}return T})
}

(function() {  
  /**
   * Called after the map API has been loaded.
   */
  function mappingCallback() {
    /**
     * Domready without jQuery - https://github.com/cms/domready.
     */
    var domReady=function(){function a(){e?document.removeEventListener("DOMContentLoaded",a,!0):"complete"===document.readyState&&document.detachEvent("onreadystatechange",a);b()}function h(){if(!c){try{document.documentElement.doScroll("left")}catch(f){window.setTimeout(arguments.callee,15);return}b()}}function b(){if(!c){c=!0;for(var f=d.length,a=0;a<f;a++)d[a].call(document)}}var e=!!document.addEventListener,c=!1,g=!1,d=[];if(e)document.addEventListener("DOMContentLoaded",a,!0),window.addEventListener("load",b,!1);else{document.attachEvent("onreadystatechange",a);window.attachEvent("onload",b);try{g=null===window.frameElement}catch(i){}document.documentElement.doScroll&&g&&h()}return function(a){return c?a.call(document):d.push(a)}}();

    domReady(function() {
      require([
        'Event',
        'Util/Util'
      ], function(Event, Util) {
        Util.injectCss(NPMap.config.server + '/resources/css/base.css');
        
        require([
          NPMap.config.server + '/Map/Map.' + NPMap.config.api + '.js'
        ], function(map) {
          var interval = setInterval(function() {
            if (map._isReady === true) {
              var LAYER_TYPES = {
                    arcgisserverrest: 'ArcGisServerRest',
                    geojson: 'GeoJson',
                    googlefusion: 'GoogleFusion',
                    json: 'Json',
                    kml: 'Kml',
                    nativetiled: 'NativeTiled',
                    nativevectors: 'NativeVectors',
                    tilestream: 'TileStream',
                    xml: 'Xml',
                    zoomify: 'Zoomify'
                  },
                  layerHandlers = [],
                  scripts = [];

              clearInterval(interval);
              
              if (NPMap.config.baseLayers) {
                for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
                  var baseLayerType = NPMap.config.baseLayers[i].type;

                  if (baseLayerType && _.indexOf(layerHandlers, baseLayerType) === -1) {
                    layerHandlers.push(baseLayerType);
                  }
                }
              }
              
              if (NPMap.config.layers) {
                for (var j = 0; j < NPMap.config.layers.length; j++) {
                  var layerType = NPMap.config.layers[j].type;

                  if (layerType && _.indexOf(layerHandlers, layerType) === -1) {
                    layerHandlers.push(layerType);
                  }
                }
              }
              
              for (var k = 0; k < layerHandlers.length; k++) {
                var layerHandlerType = layerHandlers[k].toLowerCase();
                
                require([
                  NPMap.config.server + '/Layer/Layer.' + LAYER_TYPES[layerHandlerType] + '.js'
                ], function(layerHandler) {
                  // TODO: Need to migrate baseLayer loads out of Map classes to here. Or migrate both baseLayer and layer loads into NPMap.Map.
                  /*
                  if (NPMap.config.baseLayers) {
                    for (var j = 0; j < NPMap.config.baseLayers.length; j++) {
                      if (NPMap.config.baseLayers[j].type.toLowerCase() === layerType) {
                        layerHandler.setBaseLayer(NPMap.config.baseLayers[j]);
                      }
                    }
                  }
                  */

                  if (NPMap.config.layers) {
                    for (var l = 0; l < NPMap.config.layers.length; l++) {
                      var layer = NPMap.config.layers[l];

                      if (layer.type.toLowerCase() === layerHandlerType) {
                        layer.type = LAYER_TYPES[layerHandlerType];

                        if (typeof layer.visible === 'undefined' || layer.visible === true) {
                          layer.visible = true;

                          layerHandler.create(NPMap.config.layers[l]);
                        }
                      }
                    }
                  }
                });
              }

              if (NPMap.config.modules) {
                for (var m = 0; m < NPMap.config.modules.length; m++) {
                  var name = NPMap.config.modules[m].name.toLowerCase();

                  if (name === 'edit' || name === 'route') {
                    scripts.push(NPMap.config.server + '/Module/Module.' + name + '.' + NPMap.config.api + '.js');
                  } else {
                    throw new Error('Invalid module name: "' + name + '".');
                  }
                }
              }

              require(scripts, function() {
                function callback() {
                  var div = document.getElementById('npmap'),
                      divLoading = document.getElementById('npmap-loading'),
                      divMask = document.getElementById('npmap-mask'),
                      location = escape(window.top.location),
                      query = escape(window.top.location.search),
                      locationUrl = location.replace(query, '');

                  divMask.parentNode.removeChild(divMask);
                  divLoading.parentNode.removeChild(divLoading);
                  NPMap.Event.processQueue();

                  if (location.indexOf('localhost') === -1 && location.indexOf('file:') === -1 && location.indexOf('file%3A') === -1) {
                    setTimeout(function() {
                      reqwest({
                        type: 'jsonp',
                        url: 'http://maps.nps.gov/track/load?a=' + NPMap.config.api + '&q=' + query + '&u=' + locationUrl + '&v=' + NPMap.version + '&callback=?'
                      });
                    }, 1000);
                  }
                };

                delete NPMap.apiLoaded;

                if (NPMap.config.events && (typeof NPMap.config.events.init === 'function')) {
                  NPMap.config.events.init(callback);
                } else {
                  callback();
                }
              });
            }
          }, 5);
        });
      });
    });
  }
  /**
   * Called after jQuery and requirejs have loaded.
   */
  function requirementsCallback() {
    /**
     * jQuery resize event v1.1 - http://benalman.com/projects/jquery-resize-plugin/
     */
    var w=window;(function(b,g,k){function h(){l=g[e](function(){c.each(function(){var a=b(this),c=a.width(),d=a.height(),j=b.data(this,i);if(c!==j.w||d!==j.h)a.trigger(f,[j.w=c,j.h=d])});h()},d[m])}var g=w,c=b([]),d=b.resize=b.extend(b.resize,{}),l,e="setTimeout",f="resize",i=f+"-special-event",m="delay";d[m]=250;d.throttleWindow=!0;b.event.special[f]={setup:function(){if(!d.throttleWindow&&this[e])return!1;var a=b(this);c=c.add(a);b.data(this,i,{w:a.width(),h:a.height()});1===c.length&&h()},teardown:function(){if(!d.throttleWindow&&this[e])return!1;var a=b(this);c=c.not(a);a.removeData(i);c.length||clearTimeout(l)},add:function(a){function c(a,d,e){var g=b(this),h=b.data(this,i);h.w=d!==k?d:g.width();h.h=e!==k?e:g.height();f.apply(this,arguments)}if(!d.throttleWindow&&this[e])return!1;var f;if(b.isFunction(a))return f=a,c;f=a.handler;a.handler=c}}})(jQuery,this);jQuery.resize.delay=100;jQuery.resize.throttleWindow=!1;

    var apiUrl = null,
        callback = null,
        preLoaded = false;
    
    if (typeof $ === 'undefined') {
      $ = jQuery;
    }

    require({
      baseUrl: NPMap.config.server
    });

    NPMap.apiLoaded = function() {
      if (NPMap.config.events && (typeof NPMap.config.events.preinit === 'function')) {
        NPMap.config.events.preinit(mappingCallback);
      } else {
        mappingCallback();
      }
    };

    switch (NPMap.config.api) {
      case 'Bing':
        apiUrl = 'http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onscriptload=callback';
        callback = function() {
          var interval = setInterval(function() {
            if (typeof Microsoft !== 'undefined' && typeof Microsoft.Maps !== 'undefined' && typeof Microsoft.Maps.Globals !== 'undefined') {
              clearInterval(interval);
              
              if (document.getElementsByTagName('head')[0].innerHTML.indexOf('veapicore.js') === -1) {
                var s = document.createElement('script');
                s.src = Microsoft.Maps.Globals.jsPath + 'veapicore.js';
                document.body.appendChild(s);
              }
              
              interval = setInterval(function() {
                if (typeof Microsoft.Maps.Map !== 'undefined') {
                  clearInterval(interval);
                  NPMap.apiLoaded();
                }
              }, 5);
            }
          }, 5);
        };
        break;
      case 'Esri':
        // TODO: Upgrade to 3.0 ('http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.0' or 'http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.0compact') when Esri and/or Dojo get their act together with AMD.
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
      case 'Google':
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
          callback = NPMap.apiLoaded();
          preLoaded = true;
        } else {
          apiUrl = 'http://maps.googleapis.com/maps/api/js?v=3&sensor=true&callback=NPMap.apiLoaded';
          
          if (NPMap.config.credentials) {
            if (NPMap.config.credentials.slice(0, 1) === '&') {
              apiUrl += NPMap.config.credentials;
            }
          } else {
            apiUrl += '&client=gme-usgovernmentdepartment&channel=nps-npmap';
          }
          
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
      case 'Leaflet':
        apiUrl = 'http://www.nps.gov/npmap/scripts/libs/leaflet/leaflet.js';
        callback = function() {
          var interval = setInterval(function() {
            if (typeof L !== 'undefined') {
              clearInterval(interval);
              NPMap.apiLoaded();
              NPMap.Util.injectCss('http://www.nps.gov/npmap/scripts/libs/leaflet/leaflet.css');
              
              // http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
              var ie=function(){for(var a=3,b=document.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="<\!--[if gt IE "+ ++a+"]><i></i><![endif]--\>",c[0];);return 4<a?a:void 0}();
              
              if (ie < 8) {
                NPMap.Util.injectCss('http://www.nps.gov/npmap/scripts/libs/leaflet/leaflet.ie.css');
              }
            }
          }, 5);
        };
        break;
      case 'ModestMaps':
        apiUrl = 'http://www.nps.gov/npmap/scripts/libs/modestmaps-2.0.1.min.js';
        callback = function() {
          var interval = setInterval(function() {
            if (typeof com  !== 'undefined' && typeof com.modestmaps !== 'undefined' && typeof com.modestmaps.Map !== 'undefined') {
              clearInterval(interval);
              NPMap.apiLoaded();
            }
          }, 5);
        };
        break;
      default:
        throw new Error('Invalid base API specified.');
    }

    if (preLoaded) {
      if (callback) {
        callback();
      }
    } else {
      s = document.createElement('script');
      s.src = apiUrl;

      if (window.attachEvent && document.all) {
        s.onreadystatechange = function() {
          if (this.readyState === 'complete' || this.readyState === 'loaded') {
            if (callback) {
              callback();
            }
          }
        };
      } else {
        s.onload = function() {
          if (callback) {
            callback();
          }
        };
      }
      
      document.body.appendChild(s);
    }
  }

  var s = document.createElement('script'),
      u = 'http://www.nps.gov/npmap/libs/require-2.0.4';

  if (typeof window.jQuery  === 'undefined') {
    u += '-jquery-1.7.2';
  }
  
  s.src = u + '.min.js';

  if (window.attachEvent && document.all) {
    s.onreadystatechange = function() {
      if (this.readyState === 'complete' || this.readyState === 'loaded') {
        requirementsCallback();
      }
    };
  } else {
    s.onload = requirementsCallback;
  }
  
  document.body.appendChild(s);
})();