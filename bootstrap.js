NPMap.version = '1.0.0';

if (!NPMap.config) {
  throw new Error('The NPMap.config object does not exist!');
}

if (!NPMap.config.div) {
  throw new Error('The NPMap.config.div string does not exist!');
}

if (typeof document.getElementById(NPMap.config.div) !== 'object') {
  throw new Error('The HTML element specified in the NPMap.config.div string does not exist on the page!');
}

if (NPMap.config.api) {
  if (NPMap.config.api === 'bing' || NPMap.config.api === 'google' || NPMap.config.api === 'leaflet') {
    NPMap.config.api = NPMap.config.api.charAt(0).toUpperCase() + NPMap.config.api.slice(1);
  } else if (NPMap.config.api === 'modestmaps') {
    NPMap.config.api = 'ModestMaps';
  } else {
    throw new Error('The NPMap.config.api property is invalid!');
  }
} else {
  NPMap.config.api = 'Bing';
}

if (typeof NPMap.config.server === 'undefined') {
  var scripts = document.getElementsByTagName('script');

  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].src;

    if (typeof src === 'string' && src.indexOf('/bootstrap.js') !== -1) {
      NPMap.config.server = src.replace('/bootstrap.js', '');
    }
  }
}

document.getElementById(NPMap.config.div).innerHTML = '<div id="npmap" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div id="npmap-mask" style="background-color:#F5F5F5;display:block;height:100%;left:0;position:absolute;top:0;width:100%;z-index:2;"><div id="npmap-loading" style="-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;-moz-box-shadow:0 0 3px 3px #CA702D;-webkit-box-shadow:0 0 3px 3px #CA702D;box-shadow:0 0 3px 3px #CA702D;background-color:black;border:solid black 2px;height:60px;left:50%;margin-left:-30px;margin-top:-30px;position:absolute;top:50%;width:60px;z-index:3;"><img src="' + NPMap.config.server + '/resources/img/loader.gif" /></div></div><div id="npmap-map" style="bottom:0;left:0;position:absolute;right:0;top:0;z-index:0;"></div></div>';

NPMap.config._div = 'npmap-map';

if (typeof JSON === 'undefined') {
  /**
   * JSON v3.2.4 | http://bestiejs.github.com/json3 | Copyright 2012, Kit Cambridge | http://kit.mit-license.org
   */
  ;(function(){var e=void 0,i=!0,k=null,l={}.toString,m,n,p="function"===typeof define&&define.c,q=!p&&"object"==typeof exports&&exports;q||p?"object"==typeof JSON&&JSON?p?q=JSON:(q.stringify=JSON.stringify,q.parse=JSON.parse):p&&(q=this.JSON={}):q=this.JSON||(this.JSON={});var r,t,u,x,z,B,C,D,E,F,G,H,I,J=new Date(-3509827334573292),K,O,P;try{J=-109252==J.getUTCFullYear()&&0===J.getUTCMonth()&&1==J.getUTCDate()&&10==J.getUTCHours()&&37==J.getUTCMinutes()&&6==J.getUTCSeconds()&&708==J.getUTCMilliseconds()}catch(Q){}function R(b){var c,a,d,j=b=="json";if(j||b=="json-stringify"||b=="json-parse"){if(b=="json-stringify"||j){if(c=typeof q.stringify=="function"&&J){(d=function(){return 1}).toJSON=d;try{c=q.stringify(0)==="0"&&q.stringify(new Number)==="0"&&q.stringify(new String)=='""'&&q.stringify(l)===e&&q.stringify(e)===e&&q.stringify()===e&&q.stringify(d)==="1"&&q.stringify([d])=="[1]"&&q.stringify([e])=="[null]"&&q.stringify(k)=="null"&&q.stringify([e,l,k])=="[null,null,null]"&&q.stringify({A:[d,i,false,k,"\x00\u0008\n\u000c\r\t"]})=='{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}'&&q.stringify(k,d)==="1"&&q.stringify([1,2],k,1)=="[\n 1,\n 2\n]"&&q.stringify(new Date(-864E13))=='"-271821-04-20T00:00:00.000Z"'&&q.stringify(new Date(864E13))=='"+275760-09-13T00:00:00.000Z"'&&q.stringify(new Date(-621987552E5))=='"-000001-01-01T00:00:00.000Z"'&&q.stringify(new Date(-1))=='"1969-12-31T23:59:59.999Z"'}catch(f){c=false}}if(!j)return c}if(b=="json-parse"||j){if(typeof q.parse=="function")try{if(q.parse("0")===0&&!q.parse(false)){d=q.parse('{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');if(a=d.a.length==5&&d.a[0]==1){try{a=!q.parse('"\t"')}catch(o){}if(a)try{a=q.parse("01")!=1}catch(g){}}}}catch(h){a=false}if(!j)return a}return c&&a}}if(!R("json")){J||(K=Math.floor,O=[0,31,59,90,120,151,181,212,243,273,304,334],P=function(b,c){return O[c]+365*(b-1970)+K((b-1969+(c=+(c>1)))/4)-K((b-1901+c)/100)+K((b-1601+c)/400)});if(!(m={}.hasOwnProperty))m=function(b){var c={},a;if((c.__proto__=k,c.__proto__={toString:1},c).toString!=l)m=function(a){var b=this.__proto__,a=a in(this.__proto__=k,this);this.__proto__=b;return a};else{a=c.constructor;m=function(b){var c=(this.constructor||a).prototype;return b in this&&!(b in c&&this[b]===c[b])}}c=k;return m.call(this,b)};n=function(b,c){var a=0,d,j,f;(d=function(){this.valueOf=0}).prototype.valueOf=0;j=new d;for(f in j)m.call(j,f)&&a++;d=j=k;if(a)a=a==2?function(a,b){var c={},d=l.call(a)=="[object Function]",f;for(f in a)!(d&&f=="prototype")&&!m.call(c,f)&&(c[f]=1)&&m.call(a,f)&&b(f)}:function(a,b){var c=l.call(a)=="[object Function]",d,f;for(d in a)!(c&&d=="prototype")&&m.call(a,d)&&!(f=d==="constructor")&&b(d);(f||m.call(a,d="constructor"))&&b(d)};else{j=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"];a=function(a,b){var c=l.call(a)=="[object Function]",d;for(d in a)!(c&&d=="prototype")&&m.call(a,d)&&b(d);for(c=j.length;d=j[--c];m.call(a,d)&&b(d));}}a(b,c)};R("json-stringify")||(r={"\\":"\\\\",'"':'\\"',"\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"},t=function(b,c){return("000000"+(c||0)).slice(-b)},u=function(b){for(var c='"',a=0,d;d=b.charAt(a);a++)c=c+('\\"\u0008\u000c\n\r\t'.indexOf(d)>-1?r[d]:r[d]=d<" "?"\\u00"+t(2,d.charCodeAt(0).toString(16)):d);return c+'"'},x=function(b,c,a,d,j,f,o){var g=c[b],h,s,v,w,L,M,N,y,A;if(typeof g=="object"&&g){h=l.call(g);if(h=="[object Date]"&&!m.call(g,"toJSON"))if(g>-1/0&&g<1/0){if(P){v=K(g/864E5);for(h=K(v/365.2425)+1970-1;P(h+1,0)<=v;h++);for(s=K((v-P(h,0))/30.42);P(h,s+1)<=v;s++);v=1+v-P(h,s);w=(g%864E5+864E5)%864E5;L=K(w/36E5)%24;M=K(w/6E4)%60;N=K(w/1E3)%60;w=w%1E3}else{h=g.getUTCFullYear();s=g.getUTCMonth();v=g.getUTCDate();L=g.getUTCHours();M=g.getUTCMinutes();N=g.getUTCSeconds();w=g.getUTCMilliseconds()}g=(h<=0||h>=1E4?(h<0?"-":"+")+t(6,h<0?-h:h):t(4,h))+"-"+t(2,s+1)+"-"+t(2,v)+"T"+t(2,L)+":"+t(2,M)+":"+t(2,N)+"."+t(3,w)+"Z"}else g=k;else if(typeof g.toJSON=="function"&&(h!="[object Number]"&&h!="[object String]"&&h!="[object Array]"||m.call(g,"toJSON")))g=g.toJSON(b)}a&&(g=a.call(c,b,g));if(g===k)return"null";h=l.call(g);if(h=="[object Boolean]")return""+g;if(h=="[object Number]")return g>-1/0&&g<1/0?""+g:"null";if(h=="[object String]")return u(g);if(typeof g=="object"){for(b=o.length;b--;)if(o[b]===g)throw TypeError();o.push(g);y=[];c=f;f=f+j;if(h=="[object Array]"){s=0;for(b=g.length;s<b;A||(A=i),s++){h=x(s,g,a,d,j,f,o);y.push(h===e?"null":h)}b=A?j?"[\n"+f+y.join(",\n"+f)+"\n"+c+"]":"["+y.join(",")+"]":"[]"}else{n(d||g,function(b){var c=x(b,g,a,d,j,f,o);c!==e&&y.push(u(b)+":"+(j?" ":"")+c);A||(A=i)});b=A?j?"{\n"+f+y.join(",\n"+f)+"\n"+c+"}":"{"+y.join(",")+"}":"{}"}o.pop();return b}},q.stringify=function(b,c,a){var d,j,f,o,g,h;if(typeof c=="function"||typeof c=="object"&&c)if(l.call(c)=="[object Function]")j=c;else if(l.call(c)=="[object Array]"){f={};o=0;for(g=c.length;o<g;h=c[o++],(l.call(h)=="[object String]"||l.call(h)=="[object Number]")&&(f[h]=1));}if(a)if(l.call(a)=="[object Number]"){if((a=a-a%1)>0){d="";for(a>10&&(a=10);d.length<a;d=d+" ");}}else l.call(a)=="[object String]"&&(d=a.length<=10?a:a.slice(0,10));return x("",(h={},h[""]=b,h),j,f,d,"",[])});R("json-parse")||(z=String.fromCharCode,B={"\\":"\\",'"':'"',"/":"/",b:"\u0008",t:"\t",n:"\n",f:"\u000c",r:"\r"},C=function(){H=I=k;throw SyntaxError();},D=function(){for(var b=I,c=b.length,a,d,j,f,o;H<c;){a=b.charAt(H);if("\t\r\n ".indexOf(a)>-1)H++;else{if("{}[]:,".indexOf(a)>-1){H++;return a}if(a=='"'){d="@";for(H++;H<c;){a=b.charAt(H);if(a<" ")C();else if(a=="\\"){a=b.charAt(++H);if('\\"/btnfr'.indexOf(a)>-1){d=d+B[a];H++}else if(a=="u"){j=++H;for(f=H+4;H<f;H++){a=b.charAt(H);a>="0"&&a<="9"||a>="a"&&a<="f"||a>="A"&&a<="F"||C()}d=d+z("0x"+b.slice(j,H))}else C()}else{if(a=='"')break;d=d+a;H++}}if(b.charAt(H)=='"'){H++;return d}}else{j=H;if(a=="-"){o=i;a=b.charAt(++H)}if(a>="0"&&a<="9"){for(a=="0"&&(a=b.charAt(H+1),a>="0"&&a<="9")&&C();H<c&&(a=b.charAt(H),a>="0"&&a<="9");H++);if(b.charAt(H)=="."){for(f=++H;f<c&&(a=b.charAt(f),a>="0"&&a<="9");f++);f==H&&C();H=f}a=b.charAt(H);if(a=="e"||a=="E"){a=b.charAt(++H);(a=="+"||a=="-")&&H++;for(f=H;f<c&&(a=b.charAt(f),a>="0"&&a<="9");f++);f==H&&C();H=f}return+b.slice(j,H)}o&&C();if(b.slice(H,H+4)=="true"){H=H+4;return i}if(b.slice(H,H+5)=="false"){H=H+5;return false}if(b.slice(H,H+4)=="null"){H=H+4;return k}}C()}}return"$"},E=function(b){var c,a;b=="$"&&C();if(typeof b=="string"){if(b.charAt(0)=="@")return b.slice(1);if(b=="["){for(c=[];;a||(a=i)){b=D();if(b=="]")break;if(a)if(b==","){b=D();b=="]"&&C()}else C();b==","&&C();c.push(E(b))}return c}if(b=="{"){for(c={};;a||(a=i)){b=D();if(b=="}")break;if(a)if(b==","){b=D();b=="}"&&C()}else C();(b==","||typeof b!="string"||b.charAt(0)!="@"||D()!=":")&&C();c[b.slice(1)]=E(D())}return c}C()}return b},G=function(b,c,a){a=F(b,c,a);a===e?delete b[c]:b[c]=a},F=function(b,c,a){var d=b[c],j;if(typeof d=="object"&&d)if(l.call(d)=="[object Array]")for(j=d.length;j--;)G(d,j,a);else n(d,function(b){G(d,b,a)});return a.call(b,c,d)},q.parse=function(b,c){var a,d;H=0;I=b;a=E(D());D()!="$"&&C();H=I=k;return c&&l.call(c)=="[object Function]"?F((d={},d[""]=a,d),"",c):a})}p&&define(function(){return q});}());
}

/**
 * Log - http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
 * License: Public Domain
 */
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try {console.log();return window.console;}catch(err){return window.console={};}})());

if (!window.Modernizr) {
  /**
   * Modernizr 2.0.6 (Custom Build)
   * Contains: boxshadow | opacity | iepp | cssclasses | testprop | testallprops | prefixes | domprefixes | load
   * License: MIT & BSD (http://modernizr.com/license/)
   */
  ;window.Modernizr=function(a,b,c){function B(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+o.join(c+" ")+c).split(" ");return A(d,b)}function A(a,b){for(var d in a)if(k[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function z(a,b){return!!~(""+a).indexOf(b)}function y(a,b){return typeof a===b}function x(a,b){return w(n.join(a+";")+(b||""))}function w(a){k.cssText=a}var d="2.0.6",e={},f=!0,g=b.documentElement,h=b.head||b.getElementsByTagName("head")[0],i="modernizr",j=b.createElement(i),k=j.style,l,m=Object.prototype.toString,n=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),o="Webkit Moz O ms Khtml".split(" "),p={},q={},r={},s=[],t,u={}.hasOwnProperty,v;!y(u,c)&&!y(u.call,c)?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],c)},p.boxshadow=function(){return B("boxShadow")},p.opacity=function(){x("opacity:.55");return/^0.55$/.test(k.opacity)};for(var C in p)v(p,C)&&(t=C.toLowerCase(),e[t]=p[C](),s.push((e[t]?"":"no-")+t));w(""),j=l=null,a.attachEvent&&function(){var a=b.createElement("div");a.innerHTML="<elem></elem>";return a.childNodes.length!==1}()&&function(a,b){function s(a){var b=-1;while(++b<g)a.createElement(f[b])}a.iepp=a.iepp||{};var d=a.iepp,e=d.html5elements||"abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",f=e.split("|"),g=f.length,h=new RegExp("(^|\\s)("+e+")","gi"),i=new RegExp("<(/*)("+e+")","gi"),j=/^\s*[\{\}]\s*$/,k=new RegExp("(^|[^\\n]*?\\s)("+e+")([^\\n]*)({[\\n\\w\\W]*?})","gi"),l=b.createDocumentFragment(),m=b.documentElement,n=m.firstChild,o=b.createElement("body"),p=b.createElement("style"),q=/print|all/,r;d.getCSS=function(a,b){if(a+""===c)return"";var e=-1,f=a.length,g,h=[];while(++e<f){g=a[e];if(g.disabled)continue;b=g.media||b,q.test(b)&&h.push(d.getCSS(g.imports,b),g.cssText),b="all"}return h.join("")},d.parseCSS=function(a){var b=[],c;while((c=k.exec(a))!=null)b.push(((j.exec(c[1])?"\n":c[1])+c[2]+c[3]).replace(h,"$1.iepp_$2")+c[4]);return b.join("\n")},d.writeHTML=function(){var a=-1;r=r||b.body;while(++a<g){var c=b.getElementsByTagName(f[a]),d=c.length,e=-1;while(++e<d)c[e].className.indexOf("iepp_")<0&&(c[e].className+=" iepp_"+f[a])}l.appendChild(r),m.appendChild(o),o.className=r.className,o.id=r.id,o.innerHTML=r.innerHTML.replace(i,"<$1font")},d._beforePrint=function(){p.styleSheet.cssText=d.parseCSS(d.getCSS(b.styleSheets,"all")),d.writeHTML()},d.restoreHTML=function(){o.innerHTML="",m.removeChild(o),m.appendChild(r)},d._afterPrint=function(){d.restoreHTML(),p.styleSheet.cssText=""},s(b),s(l);d.disablePP||(n.insertBefore(p,n.firstChild),p.media="print",p.className="iepp-printshim",a.attachEvent("onbeforeprint",d._beforePrint),a.attachEvent("onafterprint",d._afterPrint))}(a,b),e._version=d,e._prefixes=n,e._domPrefixes=o,e.testProp=function(a){return A([a])},e.testAllProps=B,g.className=g.className.replace(/\bno-js\b/,"")+(f?" js "+s.join(" "):"");return e}(this,this.document),function(a,b,c){function k(a){return!a||a=="loaded"||a=="complete"}function j(){var a=1,b=-1;while(p.length- ++b)if(p[b].s&&!(a=p[b].r))break;a&&g()}function i(a){var c=b.createElement("script"),d;c.src=a.s,c.onreadystatechange=c.onload=function(){!d&&k(c.readyState)&&(d=1,j(),c.onload=c.onreadystatechange=null)},m(function(){d||(d=1,j())},H.errorTimeout),a.e?c.onload():n.parentNode.insertBefore(c,n)}function h(a){var c=b.createElement("link"),d;c.href=a.s,c.rel="stylesheet",c.type="text/css";if(!a.e&&(w||r)){var e=function(a){m(function(){if(!d)try{a.sheet.cssRules.length?(d=1,j()):e(a)}catch(b){b.code==1e3||b.message=="security"||b.message=="denied"?(d=1,m(function(){j()},0)):e(a)}},0)};e(c)}else c.onload=function(){d||(d=1,m(function(){j()},0))},a.e&&c.onload();m(function(){d||(d=1,j())},H.errorTimeout),!a.e&&n.parentNode.insertBefore(c,n)}function g(){var a=p.shift();q=1,a?a.t?m(function(){a.t=="c"?h(a):i(a)},0):(a(),j()):q=0}function f(a,c,d,e,f,h){function i(){!o&&k(l.readyState)&&(r.r=o=1,!q&&j(),l.onload=l.onreadystatechange=null,m(function(){u.removeChild(l)},0))}var l=b.createElement(a),o=0,r={t:d,s:c,e:h};l.src=l.data=c,!s&&(l.style.display="none"),l.width=l.height="0",a!="object"&&(l.type=d),l.onload=l.onreadystatechange=i,a=="img"?l.onerror=i:a=="script"&&(l.onerror=function(){r.e=r.r=1,g()}),p.splice(e,0,r),u.insertBefore(l,s?null:n),m(function(){o||(u.removeChild(l),r.r=r.e=o=1,j())},H.errorTimeout)}function e(a,b,c){var d=b=="c"?z:y;q=0,b=b||"j",C(a)?f(d,a,b,this.i++,l,c):(p.splice(this.i++,0,a),p.length==1&&g());return this}function d(){var a=H;a.loader={load:e,i:0};return a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=r&&!s,u=s?l:n.parentNode,v=a.opera&&o.call(a.opera)=="[object Opera]",w="webkitAppearance"in l.style,x=w&&"async"in b.createElement("script"),y=r?"object":v||x?"img":"script",z=w?"img":y,A=Array.isArray||function(a){return o.call(a)=="[object Array]"},B=function(a){return Object(a)===a},C=function(a){return typeof a=="string"},D=function(a){return o.call(a)=="[object Function]"},E=[],F={},G,H;H=function(a){function f(a){var b=a.split("!"),c=E.length,d=b.pop(),e=b.length,f={url:d,origUrl:d,prefixes:b},g,h;for(h=0;h<e;h++)g=F[b[h]],g&&(f=g(f));for(h=0;h<c;h++)f=E[h](f);return f}function e(a,b,e,g,h){var i=f(a),j=i.autoCallback;if(!i.bypass){b&&(b=D(b)?b:b[a]||b[g]||b[a.split("/").pop().split("?")[0]]);if(i.instead)return i.instead(a,b,e,g,h);e.load(i.url,i.forceCSS||!i.forceJS&&/css$/.test(i.url)?"c":c,i.noexec),(D(b)||D(j))&&e.load(function(){d(),b&&b(i.origUrl,h,g),j&&j(i.origUrl,h,g)})}}function b(a,b){function c(a){if(C(a))e(a,h,b,0,d);else if(B(a))for(i in a)a.hasOwnProperty(i)&&e(a[i],h,b,i,d)}var d=!!a.test,f=d?a.yep:a.nope,g=a.load||a.both,h=a.callback,i;c(f),c(g),a.complete&&b.load(a.complete)}var g,h,i=this.yepnope.loader;if(C(a))e(a,0,i,0);else if(A(a))for(g=0;g<a.length;g++)h=a[g],C(h)?e(h,0,i,0):A(h)?H(h):B(h)&&b(h,i);else B(a)&&b(a,i)},H.addPrefix=function(a,b){F[a]=b},H.addFilter=function(a){E.push(a)},H.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",G=function(){b.removeEventListener("DOMContentLoaded",G,0),b.readyState="complete"},0)),a.yepnope=d()}(this,this.document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
}

if (typeof morpheus === 'undefined') {
  /**
   * Morpheus - A Brilliant Animator
   * https://github.com/ded/morpheus - (c) Dustin Diaz 2011
   * License: MIT
   */
  !function(e,t){typeof define=="function"?define(t):typeof module!="undefined"?module.exports=t():this[e]=t()}("morpheus",function(){function w(e,t,n){if(Array.prototype.indexOf)return e.indexOf(t);for(n=0;n<e.length;++n)if(e[n]===t)return n}function E(e){var t,n=b.length;r&&e>1e12&&(e=i());for(t=n;t--;)b[t](e);b.length&&y(E)}function S(e){b.push(e)===1&&y(E)}function x(e){var t,n=w(b,e);n>=0&&(t=b.slice(n+1),b.length=n,b=b.concat(t))}function T(e,t){var n={},r;if(r=e.match(l))n.rotate=H(r[1],t?t.rotate:null);if(r=e.match(c))n.scale=H(r[1],t?t.scale:null);if(r=e.match(h))n.skewx=H(r[1],t?t.skewx:null),n.skewy=H(r[3],t?t.skewy:null);if(r=e.match(p))n.translatex=H(r[1],t?t.translatex:null),n.translatey=H(r[3],t?t.translatey:null);return n}function N(e){var t="";return"rotate"in e&&(t+="rotate("+e.rotate+"deg) "),"scale"in e&&(t+="scale("+e.scale+") "),"translatex"in e&&(t+="translate("+e.translatex+"px,"+e.translatey+"px) "),"skewx"in e&&(t+="skew("+e.skewx+"deg,"+e.skewy+"deg)"),t}function C(e,t,n){return"#"+(1<<24|e<<16|t<<8|n).toString(16).slice(1)}function k(e){var t=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);return(t?C(t[1],t[2],t[3]):e).replace(/#(\w)(\w)(\w)$/,"#$1$1$2$2$3$3")}function L(e){return e.replace(/-(.)/g,function(e,t){return t.toUpperCase()})}function A(e){return typeof e=="function"}function O(e){return Math.sin(e*Math.PI/2)}function M(e,t,n,r,s,u){function d(e){var i=e-c;if(i>a||h)return u=isFinite(u)?u:1,h?p&&t(u):t(u),x(d),n&&n.apply(f);isFinite(u)?t(l*r(i/a)+s):t(r(i/a))}r=A(r)?r:B.easings[r]||O;var a=e||o,f=this,l=u-s,c=i(),h=0,p=0;return S(d),{stop:function(e){h=1,p=e,e||(n=null)}}}function _(e,t){var n=e.length,r=[],i,s;for(i=0;i<n;++i)r[i]=[e[i][0],e[i][1]];for(s=1;s<n;++s)for(i=0;i<n-s;++i)r[i][0]=(1-t)*r[i][0]+t*r[parseInt(i+1,10)][0],r[i][1]=(1-t)*r[i][1]+t*r[parseInt(i+1,10)][1];return[r[0][0],r[0][1]]}function D(e,t,n){var r=[],i,s,o,u;for(i=0;i<6;i++)o=Math.min(15,parseInt(t.charAt(i),16)),u=Math.min(15,parseInt(n.charAt(i),16)),s=Math.floor((u-o)*e+o),s=s>15?15:s<0?0:s,r[i]=s.toString(16);return"#"+r.join("")}function P(e,t,n,r,i,s,u){if(i=="transform"){u={};for(var a in n[s][i])u[a]=a in r[s][i]?Math.round(((r[s][i][a]-n[s][i][a])*e+n[s][i][a])*o)/o:n[s][i][a];return u}return typeof n[s][i]=="string"?D(e,n[s][i],r[s][i]):(u=Math.round(((r[s][i]-n[s][i])*e+n[s][i])*o)/o,i in d||(u+=t[s][i]||"px"),u)}function H(e,t,n,r,i){return(n=a.exec(e))?(i=parseFloat(n[2]))&&t+(n[1]=="+"?1:-1)*i:parseFloat(e)}function B(e,t){var n=e?n=isFinite(e.length)?e:[e]:[],r,i=t.complete,s=t.duration,o=t.easing,a=t.bezier,l=[],c=[],h=[],p=[],d,y;delete t.complete,delete t.duration,delete t.easing,delete t.bezier,a&&(d=t.left,y=t.top,delete t.right,delete t.bottom,delete t.left,delete t.top);for(r=n.length;r--;){l[r]={},c[r]={},h[r]={};if(a){var b=g(n[r],"left"),w=g(n[r],"top"),E=[H(A(d)?d(n[r]):d||0,parseFloat(b)),H(A(y)?y(n[r]):y||0,parseFloat(w))];p[r]=A(a)?a(n[r],E):a,p[r].push(E),p[r].unshift([parseInt(b,10),parseInt(w,10)])}for(var S in t){var x=g(n[r],S),C,O=A(t[S])?t[S](n[r]):t[S];if(typeof O=="string"&&u.test(O)&&!u.test(x)){delete t[S];continue}l[r][S]=S=="transform"?T(x):typeof O=="string"&&u.test(O)?k(x).slice(1):parseFloat(x),c[r][S]=S=="transform"?T(O,l[r][S]):typeof O=="string"&&O.charAt(0)=="#"?k(O).slice(1):H(O,parseFloat(x)),typeof O=="string"&&(C=O.match(f))&&(h[r][S]=C[1])}}return M.apply(n,[s,function(e,i,s){for(r=n.length;r--;){a&&(s=_(p[r],e),n[r].style.left=s[0]+"px",n[r].style.top=s[1]+"px");for(var o in t)i=P(e,h,l,c,o,r),o=="transform"?n[r].style[v]=N(i):o=="opacity"&&!m?n[r].style.filter="alpha(opacity="+i*100+")":n[r].style[L(o)]=i}},i,o])}var e=document,t=window,n=t.performance,r=n&&(n.now||n.webkitNow||n.msNow||n.mozNow),i=r?function(){return r.call(n)}:function(){return+(new Date)},s=e.documentElement,o=1e3,u=/^rgb\(|#/,a=/^([+\-])=([\d\.]+)/,f=/^(?:[\+\-]=)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,l=/rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,c=/scale\(((?:[+\-]=)?([\d\.]+))\)/,h=/skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,p=/translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,d={lineHeight:1,zoom:1,zIndex:1,opacity:1,transform:1},v=function(){var t=e.createElement("a").style,n=["webkitTransform","MozTransform","OTransform","msTransform","Transform"],r;for(r=0;r<n.length;r++)if(n[r]in t)return n[r]}(),m=function(){return typeof e.createElement("a").style.opacity!="undefined"}(),g=e.defaultView&&e.defaultView.getComputedStyle?function(t,n){n=n=="transform"?v:n;var r=null,i=e.defaultView.getComputedStyle(t,"");return i&&(r=i[L(n)]),t.style[n]||r}:s.currentStyle?function(e,t){t=L(t);if(t=="opacity"){var n=100;try{n=e.filters["DXImageTransform.Microsoft.Alpha"].opacity}catch(r){try{n=e.filters("alpha").opacity}catch(i){}}return n/100}var s=e.currentStyle?e.currentStyle[t]:null;return e.style[t]||s}:function(e,t){return e.style[L(t)]},y=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.msRequestAnimationFrame||t.oRequestAnimationFrame||function(e){t.setTimeout(function(){e(+(new Date))},17)}}(),b=[];return B.tween=M,B.getStyle=g,B.bezier=_,B.transform=v,B.parseTransform=T,B.formatTransform=N,B.easings={},B})
}

if (typeof _ === 'undefined') {
  /**
   * Underscore.js 1.3.3
   * (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
   * License: MIT
   */
  (function(){function r(a,c,d){if(a===c)return 0!==a||1/a==1/c;if(null==a||null==c)return a===c;a._chain&&(a=a._wrapped);c._chain&&(c=c._wrapped);if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return!1;switch(e){case "[object String]":return a==""+c;case "[object Number]":return a!=+a?c!=+c:0==a?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if("object"!=typeof a||"object"!=typeof c)return!1;for(var f=d.length;f--;)if(d[f]==a)return!0;d.push(a);var f=0,g=!0;if("[object Array]"==e){if(f=a.length,g=f==c.length)for(;f--&&(g=f in a==f in c&&r(a[f],c[f],d)););}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return!1;for(var h in a)if(b.has(a,h)&&(f++,!(g=b.has(c,h)&&r(a[h],c[h],d))))break;if(g){for(h in c)if(b.has(c,h)&&!f--)break;g=!f}}d.pop();return g}var s=this,I=s._,o={},k=Array.prototype,p=Object.prototype,i=k.slice,J=k.unshift,l=p.toString,K=p.hasOwnProperty,y=k.forEach,z=k.map,A=k.reduce,B=k.reduceRight,C=k.filter,D=k.every,E=k.some,q=k.indexOf,F=k.lastIndexOf,p=Array.isArray,L=Object.keys,t=Function.prototype.bind,b=function(a){return new m(a)};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=b),exports._=b):s._=b;b.VERSION="1.3.3";var j=b.each=b.forEach=function(a,c,d){if(a!=null)if(y&&a.forEach===y)a.forEach(c,d);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(d,a[e],e,a)===o)break}else for(e in a)if(b.has(a,e)&&c.call(d,a[e],e,a)===o)break};b.map=b.collect=function(a,c,b){var e=[];if(a==null)return e;if(z&&a.map===z)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});if(a.length===+a.length)e.length=a.length;return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(A&&a.reduce===A){e&&(c=b.bind(c,e));return f?a.reduce(c,d):a.reduce(c)}j(a,function(a,b,i){if(f)d=c.call(e,d,a,b,i);else{d=a;f=true}});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(B&&a.reduceRight===B){e&&(c=b.bind(c,e));return f?a.reduceRight(c,d):a.reduceRight(c)}var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,c,d,e):b.reduce(g,c)};b.find=b.detect=function(a,c,b){var e;G(a,function(a,g,h){if(c.call(b,a,g,h)){e=a;return true}});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(C&&a.filter===C)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(D&&a.every===D)return a.every(c,b);j(a,function(a,g,h){if(!(e=e&&c.call(b,a,g,h)))return o});return!!e};var G=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(E&&a.some===E)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return o});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;if(q&&a.indexOf===q)return a.indexOf(c)!=-1;return b=G(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(b.isFunction(c)?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.shuffle=function(a){var b=[],d;j(a,function(a,f){d=Math.floor(Math.random()*(f+1));b[f]=b[d];b[d]=a});return b};b.sortBy=function(a,c,d){var e=b.isFunction(c)?c:function(a){return a[c]};return b.pluck(b.map(a,function(a,b,c){return{value:a,criteria:e.call(d,a,b,c)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c===void 0?1:d===void 0?-1:c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:b.isArray(a)||b.isArguments(a)?i.call(a):a.toArray&&b.isFunction(a.toArray)?a.toArray():b.values(a)};b.size=function(a){return b.isArray(a)?a.length:b.keys(a).length};b.first=b.head=b.take=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,e=[];a.length<3&&(c=true);b.reduce(d,function(d,g,h){if(c?b.last(d)!==g||!d.length:!b.include(d,g)){d.push(g);e.push(a[h])}return d},[]);return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1),true);return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d){d=b.sortedIndex(a,c);return a[d]===c?d:-1}if(q&&a.indexOf===q)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(F&&a.lastIndexOf===F)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){if(arguments.length<=1){b=a||0;a=0}for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;){g[f++]=a;a=a+d}return g};var H=function(){};b.bind=function(a,c){var d,e;if(a.bind===t&&t)return t.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));H.prototype=a.prototype;var b=new H,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var e=c.apply(this,arguments);return b.has(d,e)?d[e]:d[e]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(null,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i,j=b.debounce(function(){h=g=false},c);return function(){d=this;e=arguments;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);j()},c));g?h=true:i=a.apply(d,e);j();g=true;return i}};b.debounce=function(a,b,d){var e;return function(){var f=this,g=arguments;d&&!e&&a.apply(f,g);clearTimeout(e);e=setTimeout(function(){e=null;d||a.apply(f,g)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments,0));return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=L||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var c=[],d;for(d in a)b.has(a,d)&&(c[c.length]=d);return c};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});return a};b.pick=function(a){var c={};j(b.flatten(i.call(arguments,1)),function(b){b in a&&(c[b]=a[b])});return c};b.defaults=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return r(a,b,[])};b.isEmpty=function(a){if(a==null)return true;if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(b.has(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=p||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return l.call(a)=="[object Arguments]"};b.isArguments(arguments)||(b.isArguments=function(a){return!(!a||!b.has(a,"callee"))});b.isFunction=function(a){return l.call(a)=="[object Function]"};b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isFinite=function(a){return b.isNumber(a)&&isFinite(a)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)=="[object Date]"};b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.has=function(a,b){return K.call(a,b)};b.noConflict=function(){s._=I;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.result=function(a,c){if(a==null)return null;var d=a[c];return b.isFunction(d)?d.call(a):d};b.mixin=function(a){j(b.functions(a),function(c){M(c,b[c]=a[c])})};var N=0;b.uniqueId=function(a){var b=N++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var u=/.^/,n={"\\":"\\","'":"'",r:"\r",n:"\n",t:"\t",u2028:"\u2028",u2029:"\u2029"},v;for(v in n)n[n[v]]=v;var O=/\\|'|\r|\n|\t|\u2028|\u2029/g,P=/\\(\\|'|r|n|t|u2028|u2029)/g,w=function(a){return a.replace(P,function(a,b){return n[b]})};b.template=function(a,c,d){d=b.defaults(d||{},b.templateSettings);a="__p+='"+a.replace(O,function(a){return"\\"+n[a]}).replace(d.escape||u,function(a,b){return"'+\n_.escape("+w(b)+")+\n'"}).replace(d.interpolate||u,function(a,b){return"'+\n("+w(b)+")+\n'"}).replace(d.evaluate||u,function(a,b){return"';\n"+w(b)+"\n;__p+='"})+"';\n";d.variable||(a="with(obj||{}){\n"+a+"}\n");var a="var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n"+a+"return __p;\n",e=new Function(d.variable||"obj","_",a);if(c)return e(c,b);c=function(a){return e.call(this,a,b)};c.source="function("+(d.variable||"obj")+"){\n"+a+"}";return c};b.chain=function(a){return b(a).chain()};var m=function(a){this._wrapped=a};b.prototype=m.prototype;var x=function(a,c){return c?b(a).chain():a},M=function(a,c){m.prototype[a]=function(){var a=i.call(arguments);J.call(a,this._wrapped);return x(c.apply(b,a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];m.prototype[a]=function(){var d=this._wrapped;b.apply(d,arguments);var e=d.length;(a=="shift"||a=="splice")&&e===0&&delete d[0];return x(d,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];m.prototype[a]=function(){return x(b.apply(this._wrapped,arguments),this._chain)}});m.prototype.chain=function(){this._chain=true;return this};m.prototype.value=function(){return this._wrapped}}).call(this);
}

// Tell Underscore.js to do mustache-style templating.
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

if (typeof reqwest === 'undefined') {
  /**
   * Reqwest! A general purpose XHR connection manager
   * (c) Dustin Diaz 2011
   * https://github.com/ded/reqwest
   * License: MIT
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
  var s = document.createElement('script');
  
  /**
   * Called after the map API has been loaded.
   */
  function mappingCallback() {
    function callback() {
      NPMap.Util.injectCss(NPMap.config.server + '/resources/css/base.css');
      
      if (NPMap.config.api === 'Leaflet') {
        NPMap.Util.injectCss(NPMap.config.server + '/libs/leaflet/leaflet.css');
        
        // http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
        var ie=function(){for(var a=3,b=document.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="<\!--[if gt IE "+ ++a+"]><i></i><![endif]--\>",c[0];);return 4<a?a:void 0}();
        
        if (ie < 8) {
          NPMap.Util.injectCss(NPMap.config.server + '/libs/leaflet/leaflet.ie.css');
        }
      }

      require([
        'Layer/Layer',
        NPMap.config.server + '/Map/Map.' + NPMap.config.api + '.js',
        'Meta'
      ], function(Layer, MapApi, META) {
        NPMap.Event.add('NPMap.Map', 'ready', function() {
          var layerHandlers = [],
              scripts = [];
              
          if (NPMap.config.baseLayers) {
            for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
              var type = NPMap.config.baseLayers[i].type;

              if (type !== 'Api' && _.indexOf(layerHandlers, type) === -1) {
                layerHandlers.push(type);
              }
            }
          }
          
          if (NPMap.config.layers) {
            /**
             * DOCS:
             *   NPMap sorts layers automatically here. Layers that have zIndex properties defined always sort first, then layers with no zIndex values defined are assigned a zIndex value,
             *   in the order they were added to the map.
             */
            var needsIncrement = false,
                startIndex = 1,
                zIndexes = [];

            for (var i = 0; i < NPMap.config.layers.length; i++) {
              if (NPMap.config.layers[i].zIndex === 0) {
                needsIncrement = true;
                break;
              }
            }

            _.each(NPMap.config.layers, function(layer) {
              if (layer.zIndex) {
                if (needsIncrement) {
                  layer.zIndex = layer.zIndex + 1;
                }

                zIndexes.push(layer.zIndex);
              }
            });

            zIndexes.sort();

            if (zIndexes.length > 0) {
              startIndex = zIndexes[zIndexes.length - 1] + 1;
            }

            _.each(NPMap.config.layers, function(layer) {
              if (typeof layer.zIndex !== 'number') {
                layer.zIndex = startIndex;
                startIndex++;
              }
            });

            NPMap.config.layers.sort(function(a, b) {
              return a.zIndex > b.zIndex;
            });

            for (var i = 1; i < NPMap.config.layers.length; i++) {
              var layer = NPMap.config.layers[i];

              if (layer.zIndex - NPMap.config.layers[i - 1].zIndex !== 1) {
                layer.zIndex = NPMap.config.layers[i - 1].zIndex + 1;
              }
            }

            _.each(NPMap.config.layers, function(layer) {
              var layerType = layer.type;

              if (layerType && _.indexOf(layerHandlers, layerType) === -1) {
                layerHandlers.push(layerType);
              }
            });
          }
          
          _.each(layerHandlers, function(layerHandler) {
            (function() {
              var layerHandlerType = (function() {
                for (var l = 0; l < META.layerHandlers.length; l++) {
                  if (META.layerHandlers[l].name.toLowerCase() === layerHandler.toLowerCase()) {
                    return META.layerHandlers[l].name;
                  }
                }
              })();

              if (layerHandlerType) {
                require([
                  NPMap.config.server + '/Layer/Layer.' + layerHandlerType + '.js'
                ], function(layerHandler) {
                  if (NPMap.config.baseLayers) {
                    var activeBaseLayer;

                    _.each(NPMap.config.baseLayers, function(baseLayer) {
                      baseLayer.zIndex = 0;

                      if (baseLayer.type.toLowerCase() === layerHandlerType.toLowerCase()) {
                        baseLayer.type = layerHandlerType;
                        
                        if (typeof baseLayer.visible === 'undefined' || baseLayer.visible === true) {
                          baseLayer.visible = true;
                          
                          if (!activeBaseLayer) {
                            activeBaseLayer = baseLayer;
                          }
                        } else {
                          baseLayer.visible = false;
                        }
                      }
                    });

                    if (activeBaseLayer) {
                      Layer.add(activeBaseLayer);
                    }
                  }

                  if (NPMap.config.layers) {
                    _.each(NPMap.config.layers, function(layer) {
                      if (layer.type && (layer.type.toLowerCase() === layerHandlerType.toLowerCase())) {
                        layer.type = layerHandlerType;

                        if (typeof layer.visible === 'undefined' || layer.visible === true) {
                          layer.visible = true;

                          Layer.add(layer);
                        }
                      }
                    });
                  }
                });
              }
            })();
          });

          if (NPMap.config.modules) {
            _.each(NPMap.config.modules, function(module) {
              var name = module.name.toLowerCase();

              if (name === 'edit' || name === 'route') {
                switch (name) {
                  case 'edit':
                    name = 'Edit';
                    break;
                  case 'route':
                    name = 'Route';
                    break;
                }

                scripts.push(NPMap.config.server + '/Module/Module.' + name + '.' + NPMap.config.api + '.js');
              }
            });
          }

          require(scripts, function() {
            function callback() {
              var div = document.getElementById('npmap'),
                  divLoading = document.getElementById('npmap-loading'),
                  divMask = document.getElementById('npmap-mask');
                  
              divMask.parentNode.removeChild(divMask);
              divLoading.parentNode.removeChild(divLoading);

              try {
                var location = escape(window.top.location),
                    query = escape(window.top.location.search);

                if (location.indexOf('localhost') === -1 && location.indexOf('file:') === -1 && location.indexOf('file%3A') === -1) {
                  setTimeout(function() {
                    reqwest({
                      type: 'jsonp',
                      url: 'http://maps.nps.gov/track/load?a=' + NPMap.config.api + '&q=' + query + '&u=' + location.replace(query, '') + '&v=' + NPMap.version + '&callback=?'
                    });
                  }, 1000);
                }
              } catch(e) {
                
              }
            }

            delete NPMap.apiLoaded;

            if (NPMap.config.events && (typeof NPMap.config.events.init === 'function')) {
              NPMap.config.events.init(callback);
            } else {
              callback();
            }
          });
        });
      });
    }

    /**
     * DomReady code borrowed from jQuery.
     */
    if(document.addEventListener)DOMContentLoaded=function(){document.removeEventListener("DOMContentLoaded",DOMContentLoaded,false);callback()};else if(document.attachEvent)DOMContentLoaded=function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",DOMContentLoaded);callback()}};if(document.readyState==="complete")setTimeout(callback,1);if(document.addEventListener){document.addEventListener("DOMContentLoaded",DOMContentLoaded,false);window.addEventListener("load",callback,false)}else if(document.attachEvent){document.attachEvent("onreadystatechange",DOMContentLoaded);window.attachEvent("onload",callback)};
  }
  /**
   * Called after requirejs has been loaded.
   */
  function requirementsCallback() {
    var apiUrl = null,
        callback = null,
        preLoaded = false;

    require({
      baseUrl: NPMap.config.server
    });

    require([
      'Event',
      'Util/Util'
    ], function(Event, Util) {
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
        case 'Google':
          if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
            callback = NPMap.apiLoaded();
            preLoaded = true;
          } else {
            apiUrl = 'http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=NPMap.apiLoaded';
            
            if (NPMap.config.credentials) {
              if (NPMap.config.credentials.slice(0, 1) === '&') {
                apiUrl += NPMap.config.credentials;
              }
            } else if (window.location.protocol !== 'file:') {
              var host = window.location.host;

              if (host.indexOf('.nps.doi.net') !== -1 || host.indexOf('inside.nps.gov') !== -1 || host.indexOf('insidemaps.nps.gov' !== -1)) {
                apiUrl += '&client=gme-nationalparkservice2';
              } else {
                apiUrl += '&client=gme-nationalparkservice1';
              }

              apiUrl += '&channel=npmap';
            }
            
            if (NPMap.config.modules) {
              for (var i = 0; i < NPMap.config.modules.length; i++) {
                if (NPMap.config.modules[i].name.toLowerCase() === 'edit') {
                  apiUrl += '&libraries=drawing';
                  break;
                }
              }
            }
          }
          
          break;
        case 'Leaflet':
          apiUrl = NPMap.config.server + '/libs/leaflet/leaflet.js';
          callback = function() {
            var interval = setInterval(function() {
              if (typeof L !== 'undefined') {
                clearInterval(interval);
                NPMap.apiLoaded();
              }
            }, 5);
          };
          break;
        case 'ModestMaps':
          apiUrl = NPMap.config.server + '/libs/modestmaps/3.3.5.min.js';
          callback = function() {
            var interval = setInterval(function() {
              if (typeof MM  !== 'undefined' && typeof MM.Map !== 'undefined') {
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
    });
  }

  s.src = NPMap.config.server + '/libs/requirejs/2.1.2.min.js';

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