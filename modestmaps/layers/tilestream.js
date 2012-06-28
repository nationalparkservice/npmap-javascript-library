define([
  '../../layers/tilestream.js'
], function(tilestream) {
  // TODO: You should only add the portions of Wax that you're using.
  /* wax - 6.2.3 - 1.0.4-590-gcd05aa2 */
  var wax=wax||{},html4={atype:{NONE:0,URI:1,URI_FRAGMENT:11,SCRIPT:2,STYLE:3,ID:4,IDREF:5,IDREFS:6,GLOBAL_NAME:7,LOCAL_NAME:8,CLASSES:9,FRAME_TARGET:10},ATTRIBS:{"*::class":9,"*::dir":0,"*::id":4,"*::lang":0,"*::onclick":2,"*::ondblclick":2,"*::onkeydown":2,"*::onkeypress":2,"*::onkeyup":2,"*::onload":2,"*::onmousedown":2,"*::onmousemove":2,"*::onmouseout":2,"*::onmouseover":2,"*::onmouseup":2,"*::style":3,"*::title":0,"a::accesskey":0,"a::coords":0,"a::href":1,"a::hreflang":0,"a::name":7,"a::onblur":2,
  "a::onfocus":2,"a::rel":0,"a::rev":0,"a::shape":0,"a::tabindex":0,"a::target":10,"a::type":0,"area::accesskey":0,"area::alt":0,"area::coords":0,"area::href":1,"area::nohref":0,"area::onblur":2,"area::onfocus":2,"area::shape":0,"area::tabindex":0,"area::target":10,"bdo::dir":0,"blockquote::cite":1,"br::clear":0,"button::accesskey":0,"button::disabled":0,"button::name":8,"button::onblur":2,"button::onfocus":2,"button::tabindex":0,"button::type":0,"button::value":0,"canvas::height":0,"canvas::width":0,
  "caption::align":0,"col::align":0,"col::char":0,"col::charoff":0,"col::span":0,"col::valign":0,"col::width":0,"colgroup::align":0,"colgroup::char":0,"colgroup::charoff":0,"colgroup::span":0,"colgroup::valign":0,"colgroup::width":0,"del::cite":1,"del::datetime":0,"dir::compact":0,"div::align":0,"dl::compact":0,"font::color":0,"font::face":0,"font::size":0,"form::accept":0,"form::action":1,"form::autocomplete":0,"form::enctype":0,"form::method":0,"form::name":7,"form::onreset":2,"form::onsubmit":2,
  "form::target":10,"h1::align":0,"h2::align":0,"h3::align":0,"h4::align":0,"h5::align":0,"h6::align":0,"hr::align":0,"hr::noshade":0,"hr::size":0,"hr::width":0,"iframe::align":0,"iframe::frameborder":0,"iframe::height":0,"iframe::marginheight":0,"iframe::marginwidth":0,"iframe::width":0,"img::align":0,"img::alt":0,"img::border":0,"img::height":0,"img::hspace":0,"img::ismap":0,"img::name":7,"img::src":1,"img::usemap":11,"img::vspace":0,"img::width":0,"input::accept":0,"input::accesskey":0,"input::align":0,
  "input::alt":0,"input::autocomplete":0,"input::checked":0,"input::disabled":0,"input::ismap":0,"input::maxlength":0,"input::name":8,"input::onblur":2,"input::onchange":2,"input::onfocus":2,"input::onselect":2,"input::readonly":0,"input::size":0,"input::src":1,"input::tabindex":0,"input::type":0,"input::usemap":11,"input::value":0,"ins::cite":1,"ins::datetime":0,"label::accesskey":0,"label::for":5,"label::onblur":2,"label::onfocus":2,"legend::accesskey":0,"legend::align":0,"li::type":0,"li::value":0,
  "map::name":7,"menu::compact":0,"ol::compact":0,"ol::start":0,"ol::type":0,"optgroup::disabled":0,"optgroup::label":0,"option::disabled":0,"option::label":0,"option::selected":0,"option::value":0,"p::align":0,"pre::width":0,"q::cite":1,"select::disabled":0,"select::multiple":0,"select::name":8,"select::onblur":2,"select::onchange":2,"select::onfocus":2,"select::size":0,"select::tabindex":0,"table::align":0,"table::bgcolor":0,"table::border":0,"table::cellpadding":0,"table::cellspacing":0,"table::frame":0,
  "table::rules":0,"table::summary":0,"table::width":0,"tbody::align":0,"tbody::char":0,"tbody::charoff":0,"tbody::valign":0,"td::abbr":0,"td::align":0,"td::axis":0,"td::bgcolor":0,"td::char":0,"td::charoff":0,"td::colspan":0,"td::headers":6,"td::height":0,"td::nowrap":0,"td::rowspan":0,"td::scope":0,"td::valign":0,"td::width":0,"textarea::accesskey":0,"textarea::cols":0,"textarea::disabled":0,"textarea::name":8,"textarea::onblur":2,"textarea::onchange":2,"textarea::onfocus":2,"textarea::onselect":2,
  "textarea::readonly":0,"textarea::rows":0,"textarea::tabindex":0,"tfoot::align":0,"tfoot::char":0,"tfoot::charoff":0,"tfoot::valign":0,"th::abbr":0,"th::align":0,"th::axis":0,"th::bgcolor":0,"th::char":0,"th::charoff":0,"th::colspan":0,"th::headers":6,"th::height":0,"th::nowrap":0,"th::rowspan":0,"th::scope":0,"th::valign":0,"th::width":0,"thead::align":0,"thead::char":0,"thead::charoff":0,"thead::valign":0,"tr::align":0,"tr::bgcolor":0,"tr::char":0,"tr::charoff":0,"tr::valign":0,"ul::compact":0,
  "ul::type":0},eflags:{OPTIONAL_ENDTAG:1,EMPTY:2,CDATA:4,RCDATA:8,UNSAFE:16,FOLDABLE:32,SCRIPT:64,STYLE:128},ELEMENTS:{a:0,abbr:0,acronym:0,address:0,applet:16,area:2,b:0,base:18,basefont:18,bdo:0,big:0,blockquote:0,body:49,br:2,button:0,canvas:0,caption:0,center:0,cite:0,code:0,col:2,colgroup:1,dd:1,del:0,dfn:0,dir:0,div:0,dl:0,dt:1,em:0,fieldset:0,font:0,form:0,frame:18,frameset:16,h1:0,h2:0,h3:0,h4:0,h5:0,h6:0,head:49,hr:2,html:49,i:0,iframe:4,img:2,input:2,ins:0,isindex:18,kbd:0,label:0,legend:0,
  li:1,link:18,map:0,menu:0,meta:18,nobr:0,noembed:4,noframes:20,noscript:20,object:16,ol:0,optgroup:0,option:1,p:1,param:18,pre:0,q:0,s:0,samp:0,script:84,select:0,small:0,span:0,strike:0,strong:0,style:148,sub:0,sup:0,table:0,tbody:1,td:1,textarea:8,tfoot:1,th:1,thead:1,title:24,tr:1,tt:0,u:0,ul:0,"var":0},ueffects:{NOT_LOADED:0,SAME_DOCUMENT:1,NEW_DOCUMENT:2},URIEFFECTS:{"a::href":2,"area::href":2,"blockquote::cite":0,"body::background":1,"del::cite":0,"form::action":2,"img::src":1,"input::src":1,
  "ins::cite":0,"q::cite":0},ltypes:{UNSANDBOXED:2,SANDBOXED:1,DATA:0},LOADERTYPES:{"a::href":2,"area::href":2,"blockquote::cite":2,"body::background":1,"del::cite":2,"form::action":2,"img::src":1,"input::src":1,"ins::cite":2,"q::cite":2}},html=function(a){function e(a,b){var d;d=j(b);if(h.hasOwnProperty(d))d=h[d];else{var c=d.match(o);d=c?String.fromCharCode(parseInt(c[1],10)):(c=d.match(m))?String.fromCharCode(parseInt(c[1],16)):""}return d}function d(a){return a.replace(r,e)}function b(a){return a.replace(l,
  "&amp;").replace(q,"&lt;").replace(v,"&gt;").replace(y,"&#34;").replace(w,"&#61;")}function c(a){return a.replace(s,"&amp;$1").replace(q,"&lt;").replace(v,"&gt;")}function f(b){return function(g,f){var g=""+g,e=null,h=!1,l=[],n=void 0,q=void 0,m=void 0;for(b.startDoc&&b.startDoc(f);g;){var p=g.match(h?u:A),g=g.substring(p[0].length);if(h)if(p[1]){var o=j(p[1]);if(p[2]){p=p[3];switch(p.charCodeAt(0)){case 34:case 39:p=p.substring(1,p.length-1)}p=d(p.replace(k,""))}else p=o;l.push(o,p)}else{if(p[4]){void 0!==
  q&&(m?b.startTag&&b.startTag(n,l,f):b.endTag&&b.endTag(n,f));if(m&&q&(a.eflags.CDATA|a.eflags.RCDATA)&&(e=null===e?j(g):e.substring(e.length-g.length),h=e.indexOf("</"+n),0>h&&(h=g.length),h))q&a.eflags.CDATA?b.cdata&&b.cdata(g.substring(0,h),f):b.rcdata&&b.rcdata(c(g.substring(0,h)),f),g=g.substring(h);n=q=m=void 0;l.length=0;h=!1}}else p[1]?b.pcdata&&b.pcdata(p[0],f):p[3]?(m=!p[2],h=!0,n=j(p[3]),q=a.ELEMENTS.hasOwnProperty(n)?a.ELEMENTS[n]:void 0):p[4]?b.pcdata&&b.pcdata(p[4],f):p[5]&&b.pcdata&&
  (o=p[5],b.pcdata("<"===o?"&lt;":">"===o?"&gt;":"&amp;",f))}b.endDoc&&b.endDoc(f)}}function g(d){var g,c;return f({startDoc:function(){g=[];c=!1},startTag:function(f,e,j){if(!c&&a.ELEMENTS.hasOwnProperty(f)){var h=a.ELEMENTS[f];if(!(h&a.eflags.FOLDABLE))if(h&a.eflags.UNSAFE)c=!(h&a.eflags.EMPTY);else if(e=d(f,e)){h&a.eflags.EMPTY||g.push(f);j.push("<",f);f=0;for(h=e.length;f<h;f+=2){var l=e[f],k=e[f+1];null!==k&&void 0!==k&&j.push(" ",l,'="',b(k),'"')}j.push(">")}}},endTag:function(b,d){if(c)c=!1;
  else if(a.ELEMENTS.hasOwnProperty(b)){var f=a.ELEMENTS[b];if(!(f&(a.eflags.UNSAFE|a.eflags.EMPTY|a.eflags.FOLDABLE))){if(f&a.eflags.OPTIONAL_ENDTAG)for(f=g.length;0<=--f;){var e=g[f];if(e===b)break;if(!(a.ELEMENTS[e]&a.eflags.OPTIONAL_ENDTAG))return}else for(f=g.length;0<=--f&&g[f]!==b;);if(!(0>f)){for(var h=g.length;--h>f;)e=g[h],a.ELEMENTS[e]&a.eflags.OPTIONAL_ENDTAG||d.push("</",e,">");g.length=f;d.push("</",b,">")}}}},pcdata:function(a,b){c||b.push(a)},rcdata:function(a,b){c||b.push(a)},cdata:function(a,
  b){c||b.push(a)},endDoc:function(a){for(var b=g.length;0<=--b;)a.push("</",g[b],">");g.length=0}})}var j;j=function(a){return a.toLowerCase()};var h={lt:"<",gt:">",amp:"&",nbsp:"\u00a0",quot:'"',apos:"'"},n=/^(?:https?|mailto|data)$/i,o=/^#(\d+)$/,m=/^#x([0-9A-Fa-f]+)$/,k=/\0/g,r=/&(#\d+|#x[0-9A-Fa-f]+|\w+);/g,l=/&/g,s=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi,q=/</g,v=/>/g,y=/\"/g,w=/\=/g,u=RegExp("^\\s*(?:(?:([a-z][a-z-]*)(\\s*=\\s*(\"[^\"]*\"|'[^']*'|(?=[a-z][a-z-]*\\s*=)|[^>\"'\\s]*))?)|(/?>)|[\\s\\S][^a-z\\s>]*)",
  "i"),A=RegExp("^(?:&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);|<\!--[\\s\\S]*?--\>|<!\\w[^>]*>|<\\?[^>*]*>|<(/)?([a-z][a-z0-9]*)|([^<&>]+)|([<&>]))","i"),p=/^(?:([^:/?#]+):)?/;return{escapeAttrib:b,makeHtmlSanitizer:g,makeSaxParser:f,normalizeRCData:c,sanitize:function(b,d,f){var c=[];g(function(b,g){for(var c=0;c<g.length;c+=2){var e=g[c],h=g[c+1],j=null,l;if((l=b+"::"+e,a.ATTRIBS.hasOwnProperty(l))||(l="*::"+e,a.ATTRIBS.hasOwnProperty(l)))j=a.ATTRIBS[l];if(null!==j)switch(j){case a.atype.NONE:break;case a.atype.SCRIPT:case a.atype.STYLE:h=
  null;break;case a.atype.ID:case a.atype.IDREF:case a.atype.IDREFS:case a.atype.GLOBAL_NAME:case a.atype.LOCAL_NAME:case a.atype.CLASSES:h=f?f(h):h;break;case a.atype.URI:h=(e=(""+h).match(p))?!e[1]||n.test(e[1])?d&&d(h):null:null;break;case a.atype.URI_FRAGMENT:h&&"#"===h.charAt(0)?(h=f?f(h):h)&&(h="#"+h):h=null;break;default:h=null}else h=null;g[c+1]=h}return g})(b,c);return c.join("")},unescapeEntities:d}}(html4),html_sanitize=html.sanitize;
  "undefined"!==typeof window&&(window.html=html,window.html_sanitize=html_sanitize);html4.ATTRIBS["*::style"]=0;html4.ELEMENTS.style=0;html4.ATTRIBS["a::target"]=0;html4.ELEMENTS.video=0;html4.ATTRIBS["video::src"]=0;html4.ATTRIBS["video::poster"]=0;html4.ATTRIBS["video::controls"]=0;html4.ELEMENTS.audio=0;html4.ATTRIBS["audio::src"]=0;html4.ATTRIBS["video::autoplay"]=0;html4.ATTRIBS["video::controls"]=0;var Mustache="undefined"!==typeof module&&module.exports||{};
  (function(a){function e(a){return(""+a).replace(/[&<>"'\/]/g,function(a){return w[a]||a})}function d(a,b,d,g){for(var g=g||"<template>",f=b.split("\n"),c=Math.max(d-3,0),e=Math.min(f.length,d+3),f=f.slice(c,e),h=0,j=f.length;h<j;++h){e=h+c+1;f[h]=(e===d?" >> ":"    ")+f[h]}a.template=b;a.line=d;a.file=g;a.message=[g+":"+d,f.join("\n"),"",a.message].join("\n");return a}function b(a,b,d){if(a===".")return b[b.length-1];for(var a=a.split("."),g=a.length-1,f=a[g],c,e,h=b.length,j,l;h;){l=b.slice(0);e=
  b[--h];for(j=0;j<g;){e=e[a[j++]];if(e==null)break;l.push(e)}if(e&&typeof e==="object"&&f in e){c=e[f];break}}typeof c==="function"&&(c=c.call(l[l.length-1]));return c==null?d:c}function c(a,d,g,f){var c="",a=b(a,d);if(f){if(a==null||a===false||r(a)&&a.length===0)c=c+g()}else if(r(a))l(a,function(a){d.push(a);c=c+g();d.pop()});else if(typeof a==="object"){d.push(a);c=c+g();d.pop()}else if(typeof a==="function")var e=d[d.length-1],c=c+(a.call(e,g(),function(a){return h(a,e)})||"");else a&&(c=c+g());
  return c}function f(b,c){for(var c=c||{},g=c.tags||a.tags,f=g[0],e=g[g.length-1],h=['var buffer = "";',"\nvar line = 1;","\ntry {",'\nbuffer += "'],j=[],l=false,k=false,n=function(){if(l&&!k&&!c.space)for(;j.length;)h.splice(j.pop(),1);else j=[];k=l=false},m=[],o,r,v,y=function(a){g=q(a).split(/\s+/);r=g[0];v=g[g.length-1]},w=function(a){h.push('";',o,'\nvar partial = partials["'+q(a)+'"];',"\nif (partial) {","\n  buffer += render(partial,stack[stack.length - 1],partials);","\n}",'\nbuffer += "')},
  u=function(a,g){var f=q(a);if(f==="")throw d(Error("Section name may not be empty"),b,B,c.file);m.push({name:f,inverted:g});h.push('";',o,'\nvar name = "'+f+'";',"\nvar callback = (function () {","\n  return function () {",'\n    var buffer = "";','\nbuffer += "')},D=function(a){u(a,true)},E=function(a){var a=q(a),g=m.length!=0&&m[m.length-1].name;if(!g||a!=g)throw d(Error('Section named "'+a+'" was never opened'),b,B,c.file);a=m.pop();h.push('";',"\n    return buffer;","\n  };","\n})();");a.inverted?
  h.push("\nbuffer += renderSection(name,stack,callback,true);"):h.push("\nbuffer += renderSection(name,stack,callback);");h.push('\nbuffer += "')},F=function(a){h.push('";',o,'\nbuffer += lookup("'+q(a)+'",stack,"");','\nbuffer += "')},G=function(a){h.push('";',o,'\nbuffer += escapeHTML(lookup("'+q(a)+'",stack,""));','\nbuffer += "')},B=1,z,x,t=0,H=b.length;t<H;++t)if(b.slice(t,t+f.length)===f){t=t+f.length;z=b.substr(t,1);o="\nline = "+B+";";r=f;v=e;l=true;switch(z){case "!":t++;x=null;break;case "=":t++;
  e="="+e;x=y;break;case ">":t++;x=w;break;case "#":t++;x=u;break;case "^":t++;x=D;break;case "/":t++;x=E;break;case "{":e="}"+e;case "&":t++;k=true;x=F;break;default:k=true;x=G}z=b.indexOf(e,t);if(z===-1)throw d(Error('Tag "'+f+'" was not closed properly'),b,B,c.file);f=b.substring(t,z);x&&x(f);for(x=0;~(x=f.indexOf("\n",x));){B++;x++}t=z+e.length-1;f=r;e=v}else{z=b.substr(t,1);switch(z){case '"':case "\\":k=true;h.push("\\"+z);break;case "\r":break;case "\n":j.push(h.length);h.push("\\n");n();B++;
  break;default:s.test(z)?j.push(h.length):k=true;h.push(z)}}if(m.length!=0)throw d(Error('Section "'+m[m.length-1].name+'" was not closed properly'),b,B,c.file);n();h.push('";',"\nreturn buffer;","\n} catch (e) { throw {error: e, line: line}; }");e=h.join("").replace(/buffer \+= "";\n/g,"");c.debug&&(typeof console!="undefined"&&console.log?console.log(e):typeof print==="function"&&print(e));return e}function g(a,g){var j=f(a,g),l=new Function("view,partials,stack,lookup,escapeHTML,renderSection,render",
  j);return function(f,j){var j=j||{},k=[f];try{return l(f,j,k,b,e,c,h)}catch(n){throw d(n.error,a,n.line,g.file);}}}function j(a,b){b=b||{};if(b.cache!==false){u[a]||(u[a]=g(a,b));return u[a]}return g(a,b)}function h(a,b,g){return j(a)(b,g)}a.name="mustache.js";a.version="0.5.0-dev";a.tags=["{{","}}"];a.parse=f;a.compile=j;a.render=h;a.clearCache=function(){u={}};a.to_html=function(a,b,g,f){a=h(a,b,g);if(typeof f==="function")f(a);else return a};var n=Object.prototype.toString,o=Array.isArray,m=Array.prototype.forEach,
  k=String.prototype.trim,r;r=o?o:function(a){return n.call(a)==="[object Array]"};var l;l=m?function(a,b,g){return m.call(a,b,g)}:function(a,b,g){for(var f=0,c=a.length;f<c;++f)b.call(g,a[f],f,a)};var s=/^\s*$/,q;if(k)q=function(a){return a==null?"":k.call(a)};else{var v,y;if(s.test("\u00a0")){v=/^\s+/;y=/\s+$/}else{v=/^[\s\xA0]+/;y=/[\s\xA0]+$/}q=function(a){return a==null?"":(""+a).replace(v,"").replace(y,"")}}var w={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},u={}})(Mustache);
  wax.bwdetect=function(a,e){function d(){wax.bw=-1;var a=new Image;a.src=f;var g=true,d=setTimeout(function(){if(g&&wax.bw==-1){b.bw(0);g=false}},c);a.onload=function(){if(g&&wax.bw==-1){clearTimeout(d);b.bw(1);g=false}}}var b={},c=a.threshold||400,f="http://a.tiles.mapbox.com/mapbox/1.0.0/blue-marble-topo-bathy-jul/0/0/0.png?preventcache="+ +new Date,g=1,j=a.auto===void 0?true:a.auto;b.bw=function(a){if(!arguments.length)return g;if(wax.bwlisteners&&wax.bwlisteners.length){listeners=wax.bwlisteners;
  wax.bwlisteners=[];for(i=0;i<listeners;i++)listeners[i](a)}wax.bw=a;g!=(g=a)&&e(a)};b.add=function(){j&&d();return this};if(wax.bw==-1){wax.bwlisteners=wax.bwlisteners||[];wax.bwlisteners.push(b.bw)}else wax.bw!==void 0?b.bw(wax.bw):b.add();return b};
  wax.formatter=function(a){function e(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function d(a){return a}var b={},c;if(a&&typeof a==="string")try{eval("f = "+a)}catch(f){console&&console.log(f)}else c=a&&typeof a==="function"?a:function(){};b.format=function(a,b){try{return html_sanitize(c(a,b),e,d)}catch(f){console&&console.log(f)}};return b};
  wax.gi=function(a,e){var e=e||{},d={},b=e.resolution||4,c=e.tileSize||256;d.grid_tile=function(){return a};d.getKey=function(f,g){if(a&&a.grid&&!(g<0||f<0))if(!(Math.floor(g)>=c||Math.floor(f)>=c)){var d=a.grid[Math.floor(g/b)].charCodeAt(Math.floor(f/b));d>=93&&d--;d>=35&&d--;return d-32}};d.gridFeature=function(b,g){var d=this.getKey(b,g),c=a.keys;if(c&&c[d]&&a.data[c[d]])return a.data[c[d]]};d.tileFeature=function(b,g,d){if(a){d=wax.u.offset(d);return feature=this.gridFeature(b-d.left,g-d.top)}};
  return d};
  wax.gm=function(){function a(a){typeof a==="string"&&(a=[a]);return function(b){if(b)if(b=/\/(\d+)\/(\d+)\/(\d+)\.[\w\._]+/.exec(b))return a[parseInt(b[2],10)%a.length].replace(/\{z\}/g,b[1]).replace(/\{x\}/g,b[2]).replace(/\{y\}/g,b[3])}}var e=4,d={},b,c,f=function(a){return a.replace(/(\.png|\.jpg|\.jpeg)(\d*)/,".grid.json")};d.formatter=function(a){if(!arguments.length)return c;c=wax.formatter(a);return d};d.template=function(a){if(!arguments.length)return c;c=wax.template(a);return d};d.gridUrl=
  function(b){if(!arguments.length)return f;f=typeof b==="function"?b:a(b);return d};d.getGrid=function(a,b){var h=f(a);if(!c||!h)return b(null,null);wax.request.get(h,function(a,d){if(a)return b(a,null);b(null,wax.gi(d,{formatter:c,resolution:e}))});return d};d.tilejson=function(a){if(!arguments.length)return b;a.template?d.template(a.template):a.formatter&&d.formatter(a.formatter);a.grids&&d.gridUrl(a.grids);if(a.resolution)e=a.resolution;b=a;return d};return d};wax=wax||{};
  wax.interaction=function(){function a(a){for(var b=n(),d=0;d<b.length;d++)if(b[d][0]<a.y&&b[d][0]+256>a.y&&b[d][1]<a.x&&b[d][1]+256>a.x)return b[d][2];return false}function e(a){var b;if(g){window.clearTimeout(g);g=null;b=true}else b=false;if(!b){f=true;j=wax.u.eventoffset(a);if(a.type==="mousedown")bean.add(document.body,"click",d);else if(a.type==="touchstart"&&a.touches.length===1){bean.fire(c,"off");bean.add(k(),s)}}}function d(a){var b={},e=wax.u.eventoffset(a);f=false;for(var l in a)b[l]=a[l];
  bean.remove(document.body,"mouseup",d);bean.remove(k(),s);a.type==="touchend"?c.click(a,j):Math.round(e.y/h)===Math.round(j.y/h)&&Math.round(e.x/h)===Math.round(j.x/h)&&(g=window.setTimeout(function(){g=null;c.click(b,e)},300));return d}var b=wax.gm(),c={},f=false,g=false,j,h=4,n,o,m,k,r,l={mousemove:function(a){if(!f){var d=wax.u.eventoffset(a);c.screen_feature(d,function(d){d?bean.fire(c,"on",{parent:k(),data:d,formatter:b.formatter().format,e:a}):bean.fire(c,"off")})}},touchstart:e,mousedown:e},
  s={touchend:d,touchmove:d,touchcancel:function(){bean.remove(k(),s);f=false}};c.click=function(a,d){c.screen_feature(d,function(d){d&&bean.fire(c,"on",{parent:k(),data:d,formatter:b.formatter().format,e:a})})};c.screen_feature=function(d,c){var f=a(d);f||c(null);b.getGrid(f.src,function(a,b){if(a||!b)return c(null);var e=b.tileFeature(d.x,d.y,f);c(e)})};c.attach=function(a){if(!arguments.length)return o;o=a;return c};c.detach=function(a){if(!arguments.length)return m;m=a;return c};c.map=function(a){if(!arguments.length)return r;
  r=a;o&&o(r);bean.add(k(),l);bean.add(k(),"touchstart",e);return c};c.grid=function(a){if(!arguments.length)return n;n=a;return c};c.remove=function(){m&&m(r);bean.remove(k(),l);bean.fire(c,"remove");return c};c.tilejson=function(a){if(!arguments.length)return b.tilejson();b.tilejson(a);return c};c.formatter=function(){return b.formatter()};c.on=function(a,b){bean.add(c,a,b);return c};c.off=function(a,b){bean.remove(c,a,b);return c};c.gridmanager=function(a){if(!arguments.length)return b;b=a;return c};
  c.parent=function(a){k=a;return c};return c};wax=wax||{};
  wax.request={cache:{},locks:{},promises:{},get:function(a,e){if(this.cache[a])return e(this.cache[a][0],this.cache[a][1]);this.promises[a]=this.promises[a]||[];this.promises[a].push(e);if(!this.locks[a]){var d=this;this.locks[a]=true;reqwest({url:a+(~a.indexOf("?")?"&":"?")+"callback=grid",type:"jsonp",jsonpCallback:"callback",success:function(b){d.locks[a]=false;d.cache[a]=[null,b];for(b=0;b<d.promises[a].length;b++)d.promises[a][b](d.cache[a][0],d.cache[a][1])},error:function(b){d.locks[a]=false;
  d.cache[a]=[b,null];for(b=0;b<d.promises[a].length;b++)d.promises[a][b](d.cache[a][0],d.cache[a][1])}})}}};wax.template=function(a){function e(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function d(a){return a}return{format:function(b,c){var f={},g;for(g in c)f[g]=c[g];b.format&&(f["__"+b.format+"__"]=true);return html_sanitize(Mustache.to_html(a,f),e,d)}}};wax||(wax={});
  wax.tilejson=function(a,e){reqwest({url:a+(~a.indexOf("?")?"&":"?")+"callback=grid",type:"jsonp",jsonpCallback:"callback",success:e,error:e})};wax=wax||{};wax.tooltip={};
  wax.u={offset:function(a){var e=a.offsetWidth||parseInt(a.style.width,10),d=a.offsetHeight||parseInt(a.style.height,10),b=document.body,c=0,f=0,g=function(a){if(!(a===b||a===document.documentElement)){c=c+a.offsetTop;f=f+a.offsetLeft;if(a=a.style.transform||a.style.WebkitTransform||a.style.OTransform||a.style.MozTransform||a.style.msTransform)if(match=a.match(/translate\((.+)px, (.+)px\)/)){c=c+parseInt(match[2],10);f=f+parseInt(match[1],10)}else if(match=a.match(/translate3d\((.+)px, (.+)px, (.+)px\)/)){c=
  c+parseInt(match[2],10);f=f+parseInt(match[1],10)}else if(match=a.match(/matrix3d\(([\-\d,\s]+)\)/)){a=match[1].split(",");c=c+parseInt(a[13],10);f=f+parseInt(a[12],10)}else if(match=a.match(/matrix\(.+, .+, .+, .+, (.+), (.+)\)/)){c=c+parseInt(match[2],10);f=f+parseInt(match[1],10)}}};g(a);try{for(;a=a.offsetParent;)g(a)}catch(j){}c=c+b.offsetTop;f=f+b.offsetLeft;c=c+b.parentNode.offsetTop;f=f+b.parentNode.offsetLeft;a=document.defaultView?window.getComputedStyle(b.parentNode,null):b.parentNode.currentStyle;
  if(b.parentNode.offsetTop!==parseInt(a.marginTop,10)&&!isNaN(parseInt(a.marginTop,10))){c=c+parseInt(a.marginTop,10);f=f+parseInt(a.marginLeft,10)}return{top:c,left:f,height:d,width:e}},$:function(a){return typeof a==="string"?document.getElementById(a):a},indexOf:function(a,e){var d=Array.prototype.indexOf;if(a===null)return-1;var b;if(d&&a.indexOf===d)return a.indexOf(e);d=0;for(b=a.length;d<b;d++)if(a[d]===e)return d;return-1},eventoffset:function(a){if(!a)a=window.event;if(a.pageX||a.pageY)return{x:a.pageX,
  y:a.pageY};if(a.clientX||a.clientY){var e=document.documentElement,d=document.body,b=document.body.parentNode.currentStyle,c=parseInt(b.marginTop,10)||0,b=parseInt(b.marginLeft,10)||0;return{x:a.clientX+(e&&e.scrollLeft||d&&d.scrollLeft||0)-(e&&e.clientLeft||d&&d.clientLeft||0)+b,y:a.clientY+(e&&e.scrollTop||d&&d.scrollTop||0)-(e&&e.clientTop||d&&d.clientTop||0)+c}}if(a.touches&&a.touches.length===1)return{x:a.touches[0].pageX,y:a.touches[0].pageY}},limit:function(a,e,d){var b;return function(){var c=
  this,f=arguments,g=function(){b=null;a.apply(c,f)};d&&clearTimeout(b);if(d||!b)b=setTimeout(g,e)}},throttle:function(a,e){return this.limit(a,e,false)}};wax=wax||{};wax.mm=wax.mm||{};wax.mm.attribution=function(a,e){var e=e||{},d;return{element:function(){return d.element()},appendTo:function(a){wax.u.$(a).appendChild(d.element());return this},init:function(){d=wax.attribution();d.content(e.attribution);d.element().className="wax-attribution wax-mm";return this}}.init()};wax=wax||{};
  wax=wax||{};wax.mm=wax.mm||{};wax._={};wax.mm.bwdetect=function(a,e){var e=e||{},d=e.jpg||".jpg70";wax._.bw_png=e.png||".png128";wax._.bw_jpg=d;return wax.bwdetect(e,function(b){wax._.bw=!b;for(b=0;b<a.layers.length;b++)a.getLayerAt(b).provider instanceof wax.mm.connector&&a.getLayerAt(b).setProvider(a.getLayerAt(b).provider)})};
  wax.mm.hash=function(a){return wax.hash({getCenterZoom:function(){var e=a.getCenter(),d=a.getZoom(),b=Math.max(0,Math.ceil(Math.log(d)/Math.LN2));return[d.toFixed(2),e.lat.toFixed(b),e.lon.toFixed(b)].join("/")},setCenterZoom:function(e){a.setCenterZoom(new MM.Location(e[1],e[2]),e[0])},bindChange:function(e){a.addCallback("drawn",e)},unbindChange:function(e){a.removeCallback("drawn",e)}})};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.interaction=function(){function a(){e=true}var e=false,d,b,c=["zoomed","panned","centered","extentset","resized","drawn"];return wax.interaction().attach(function(d){if(!arguments.length)return b;b=d;for(var e=0;e<c.length;e++)b.addCallback(c[e],a)}).detach(function(){for(var d=0;d<c.length;d++)b.removeCallback(c[d],a)}).parent(function(){return b.parent}).grid(function(){var a=b.getLayerAt(0).levels[Math.round(b.getZoom())];if(e||!(d!==void 0&&d.length)){var c=b.getLayerAt(0).tiles,j=[],h;
  for(h in c)if(c[h].parentNode===a){var n=wax.u.offset(c[h]);j.push([n.top,n.left,c[h]])}d=j}return d})};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm._provider=function(a){this.options={tiles:a.tiles,scheme:a.scheme||"xyz",minzoom:a.minzoom||0,maxzoom:a.maxzoom||22,bounds:a.bounds||[-180,-90,180,90]}};
  wax.mm._provider.prototype={outerLimits:function(){return[this.locationCoordinate(new MM.Location(this.options.bounds[0],this.options.bounds[1])).zoomTo(this.options.minzoom),this.locationCoordinate(new MM.Location(this.options.bounds[2],this.options.bounds[3])).zoomTo(this.options.maxzoom)]},getTile:function(a){if(!(coord=this.sourceCoordinate(a))||coord.zoom<this.options.minzoom||coord.zoom>this.options.maxzoom)return null;coord.row=this.options.scheme==="tms"?Math.pow(2,coord.zoom)-coord.row-1:
  coord.row;a=this.options.tiles[parseInt(Math.pow(2,coord.zoom)*coord.row+coord.column,10)%this.options.tiles.length].replace("{z}",coord.zoom.toFixed(0)).replace("{x}",coord.column.toFixed(0)).replace("{y}",coord.row.toFixed(0));wax._&&wax._.bw&&(a=a.replace(".png",wax._.bw_png).replace(".jpg",wax._.bw_jpg));return a}};MM&&MM.extend(wax.mm._provider,MM.MapProvider);wax.mm.connector=function(a){a=new wax.mm._provider(a);return new MM.Layer(a)};
  
  var 
      // Wax bandwidth detection.
      bw = wax.mm.bwdetect(NPMap.modestmaps.map.Map, {
        auto: true,
        png: '.png64?'
      }),
      //
      count,
      //
      countAdded = 0,
      //
      interaction,
      //
      tileJson;
  
  /**
   *
   */
  function load() {
    tilestream.load(function(data) {
      tileJson = data;
              
      // TODO: This index can come from the layer config too.
      NPMap.modestmaps.map.Map.insertLayerAt(0, new wax.mm.connector(tileJson));
      
      if (tileJson.grids) {
        interaction = setupInteraction(tileJson);
      }
    });
  }
  /**
   * Sets up interaction on the map.
   * @param {Object} tileJson The json config object to use to setup interaction.
   * @return {Object}
   */
  function setupInteraction(tileJson) {
    return wax.mm.interaction().map(NPMap.modestmaps.map.Map).tilejson(tileJson).on({
      off: function() {
        document.body.style.cursor = 'auto';

        NPMap.Map.hideTip();
      },
      on: function(args) {
        var data = args.data,
            e = args.e,
            eo = wax.u.eventoffset(e),
            offset = NPMap.utils.getMapDivOffset(),
            position = {
              x: eo.x - offset.left,
              y: eo.y - offset.top
            };
            
        switch (e.type) {
          case 'click':
            var content,
                title = 'Results';
                
            NPMap.InfoBox.hide();
            NPMap.modestmaps.map.positionClickDot(position);

            // TODO: This should be used in conjunction with "clustering".
            // TODO: Need to support if content and title configs are strings.
            if (typeof data === 'object' && _.size(data) === 1) {
              var layer = NPMap.map.getLayerByName(NPMap.utils.getFirstPropertyOfObject(data));

              content = layer.identify.content(data);
              title = layer.identify.title(data);
            } else if (NPMap.config.identify && NPMap.config.identify.content) {
              content = NPMap.config.identify.content(data);
              title = NPMap.config.identify.title(data);
            }

            NPMap.InfoBox.show(content, title);
            
            break;
          case 'mousemove':
            var content = null;

            document.body.style.cursor = 'pointer';
            
            if (typeof NPMap.config.hover !== 'undefined') {
              content = NPMap.config.hover(data);
            }
            
            if (content) {
              NPMap.Map.showTip(content, position);
            }

            break;
        };
      }
    });
  }
  /**
   * Sets up a TileStream layer.
   * @param {Object} layer
   * @param {Object} properties
   */
  function setupLayer(layer, properties) {
    if (properties.grids) {
      layer.grids = properties.grids;
    }

    if (properties.tiles) {
      layer.tiles = properties.tiles;
    }

    if (!layer.attribution && properties.attribution) {
      layer.attribution = properties.attribution;
    }
    
    layer.bounds = properties.bounds;
    layer.center = properties.center;
    layer.download = properties.download;
    layer.maxzoom = properties.maxzoom;
    layer.minzoom = properties.minzoom;
    layer.version = properties.version;
  }
  
  count = tilestream.getAllVisibleLayers().length;
  
  NPMap.modestmaps.layers = NPMap.modestmaps.layers || {};
  
  return NPMap.modestmaps.layers.TileStream = {
    /**
     * Add a TileStream layer to the map. No layerConfig parameter is passed in here, as TileStream layers are "aware" of each other, and must be processed together.
     */
    addLayer: function() {
      countAdded++;
      
      if (count === countAdded) {
        load();
      }
    },
    /**
     * Refreshes all TileStream layers from the baseLayers and layers configs.
     */
    refreshLayers: function() {
      // TODO: The index should not be hardcoded here.
      NPMap.modestmaps.map.Map.removeLayerAt(0);
      load();
    }
  };
});