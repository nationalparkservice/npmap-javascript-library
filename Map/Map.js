/** wax 6.4.3 **/
var wax = {};
var html4={atype:{NONE:0,URI:1,URI_FRAGMENT:11,SCRIPT:2,STYLE:3,ID:4,IDREF:5,IDREFS:6,GLOBAL_NAME:7,LOCAL_NAME:8,CLASSES:9,FRAME_TARGET:10},ATTRIBS:{"*::class":9,"*::dir":0,"*::id":4,"*::lang":0,"*::onclick":2,"*::ondblclick":2,"*::onkeydown":2,"*::onkeypress":2,"*::onkeyup":2,"*::onload":2,"*::onmousedown":2,"*::onmousemove":2,"*::onmouseout":2,"*::onmouseover":2,"*::onmouseup":2,"*::style":3,"*::title":0,"a::accesskey":0,"a::coords":0,"a::href":1,"a::hreflang":0,"a::name":7,"a::onblur":2,"a::onfocus":2,"a::rel":0,"a::rev":0,"a::shape":0,"a::tabindex":0,"a::target":10,"a::type":0,"area::accesskey":0,"area::alt":0,"area::coords":0,"area::href":1,"area::nohref":0,"area::onblur":2,"area::onfocus":2,"area::shape":0,"area::tabindex":0,"area::target":10,"bdo::dir":0,"blockquote::cite":1,"br::clear":0,"button::accesskey":0,"button::disabled":0,"button::name":8,"button::onblur":2,"button::onfocus":2,"button::tabindex":0,"button::type":0,"button::value":0,"canvas::height":0,"canvas::width":0,"caption::align":0,"col::align":0,"col::char":0,"col::charoff":0,"col::span":0,"col::valign":0,"col::width":0,"colgroup::align":0,"colgroup::char":0,"colgroup::charoff":0,"colgroup::span":0,"colgroup::valign":0,"colgroup::width":0,"del::cite":1,"del::datetime":0,"dir::compact":0,"div::align":0,"dl::compact":0,"font::color":0,"font::face":0,"font::size":0,"form::accept":0,"form::action":1,"form::autocomplete":0,"form::enctype":0,"form::method":0,"form::name":7,"form::onreset":2,"form::onsubmit":2,"form::target":10,"h1::align":0,"h2::align":0,"h3::align":0,"h4::align":0,"h5::align":0,"h6::align":0,"hr::align":0,"hr::noshade":0,"hr::size":0,"hr::width":0,"iframe::align":0,"iframe::frameborder":0,"iframe::height":0,"iframe::marginheight":0,"iframe::marginwidth":0,"iframe::width":0,"img::align":0,"img::alt":0,"img::border":0,"img::height":0,"img::hspace":0,"img::ismap":0,"img::name":7,"img::src":1,"img::usemap":11,"img::vspace":0,"img::width":0,"input::accept":0,"input::accesskey":0,"input::align":0,"input::alt":0,"input::autocomplete":0,"input::checked":0,"input::disabled":0,"input::ismap":0,"input::maxlength":0,"input::name":8,"input::onblur":2,"input::onchange":2,"input::onfocus":2,"input::onselect":2,"input::readonly":0,"input::size":0,"input::src":1,"input::tabindex":0,"input::type":0,"input::usemap":11,"input::value":0,"ins::cite":1,"ins::datetime":0,"label::accesskey":0,"label::for":5,"label::onblur":2,"label::onfocus":2,"legend::accesskey":0,"legend::align":0,"li::type":0,"li::value":0,"map::name":7,"menu::compact":0,"ol::compact":0,"ol::start":0,"ol::type":0,"optgroup::disabled":0,"optgroup::label":0,"option::disabled":0,"option::label":0,"option::selected":0,"option::value":0,"p::align":0,"pre::width":0,"q::cite":1,"select::disabled":0,"select::multiple":0,"select::name":8,"select::onblur":2,"select::onchange":2,"select::onfocus":2,"select::size":0,"select::tabindex":0,"table::align":0,"table::bgcolor":0,"table::border":0,"table::cellpadding":0,"table::cellspacing":0,"table::frame":0,"table::rules":0,"table::summary":0,"table::width":0,"tbody::align":0,"tbody::char":0,"tbody::charoff":0,"tbody::valign":0,"td::abbr":0,"td::align":0,"td::axis":0,"td::bgcolor":0,"td::char":0,"td::charoff":0,"td::colspan":0,"td::headers":6,"td::height":0,"td::nowrap":0,"td::rowspan":0,"td::scope":0,"td::valign":0,"td::width":0,"textarea::accesskey":0,"textarea::cols":0,"textarea::disabled":0,"textarea::name":8,"textarea::onblur":2,"textarea::onchange":2,"textarea::onfocus":2,"textarea::onselect":2,"textarea::readonly":0,"textarea::rows":0,"textarea::tabindex":0,"tfoot::align":0,"tfoot::char":0,"tfoot::charoff":0,"tfoot::valign":0,"th::abbr":0,"th::align":0,"th::axis":0,"th::bgcolor":0,"th::char":0,"th::charoff":0,"th::colspan":0,"th::headers":6,"th::height":0,"th::nowrap":0,"th::rowspan":0,"th::scope":0,"th::valign":0,"th::width":0,"thead::align":0,"thead::char":0,"thead::charoff":0,"thead::valign":0,"tr::align":0,"tr::bgcolor":0,"tr::char":0,"tr::charoff":0,"tr::valign":0,"ul::compact":0,"ul::type":0},eflags:{OPTIONAL_ENDTAG:1,EMPTY:2,CDATA:4,RCDATA:8,UNSAFE:16,FOLDABLE:32,SCRIPT:64,STYLE:128},ELEMENTS:{a:0,abbr:0,acronym:0,address:0,applet:16,area:2,b:0,base:18,basefont:18,bdo:0,big:0,blockquote:0,body:49,br:2,button:0,canvas:0,caption:0,center:0,cite:0,code:0,col:2,colgroup:1,dd:1,del:0,dfn:0,dir:0,div:0,dl:0,dt:1,em:0,fieldset:0,font:0,form:0,frame:18,frameset:16,h1:0,h2:0,h3:0,h4:0,h5:0,h6:0,head:49,hr:2,html:49,i:0,iframe:4,img:2,input:2,ins:0,isindex:18,kbd:0,label:0,legend:0,li:1,link:18,map:0,menu:0,meta:18,nobr:0,noembed:4,noframes:20,noscript:20,object:16,ol:0,optgroup:0,option:1,p:1,param:18,pre:0,q:0,s:0,samp:0,script:84,select:0,small:0,span:0,strike:0,strong:0,style:148,sub:0,sup:0,table:0,tbody:1,td:1,textarea:8,tfoot:1,th:1,thead:1,title:24,tr:1,tt:0,u:0,ul:0,"var":0},ueffects:{NOT_LOADED:0,SAME_DOCUMENT:1,NEW_DOCUMENT:2},URIEFFECTS:{"a::href":2,"area::href":2,"blockquote::cite":0,"body::background":1,"del::cite":0,"form::action":2,"img::src":1,"input::src":1,"ins::cite":0,"q::cite":0},ltypes:{UNSANDBOXED:2,SANDBOXED:1,DATA:0},LOADERTYPES:{"a::href":2,"area::href":2,"blockquote::cite":2,"body::background":1,"del::cite":2,"form::action":2,"img::src":1,"input::src":1,"ins::cite":2,"q::cite":2}},html=function(a){function e(a,c){var b;b=h(c);if(g.hasOwnProperty(b))b=g[b];else{var d=b.match(o);b=d?String.fromCharCode(parseInt(d[1],10)):(d=b.match(k))?String.fromCharCode(parseInt(d[1],16)):""}return b}function d(a){return a.replace(r,e)}function c(a){return a.replace(w,"&amp;").replace(u,"&lt;").replace(x,"&gt;").replace(A,"&#34;").replace(C,"&#61;")}function j(a){return a.replace(t,"&amp;$1").replace(u,"&lt;").replace(x,"&gt;")}function b(c){return function(b,e){var b=String(b),D=null,g=!1,f=[],y=void 0,k=void 0,t=void 0;for(c.startDoc&&c.startDoc(e);b;){var n=b.match(g?z:p),b=b.substring(n[0].length);if(g)if(n[1]){var r=h(n[1]);if(n[2]){n=n[3];switch(n.charCodeAt(0)){case 34:case 39:n=n.substring(1,n.length-1)}n=d(n.replace(m,""))}else n=r;f.push(r,n)}else{if(n[4]){void 0!==k&&(t?c.startTag&&c.startTag(y,f,e):c.endTag&&c.endTag(y,e));if(t&&k&(a.eflags.CDATA|a.eflags.RCDATA)&&(D=null===D?h(b):D.substring(D.length-b.length),g=D.indexOf("</"+y),0>g&&(g=b.length),g))k&a.eflags.CDATA?c.cdata&&c.cdata(b.substring(0,g),e):c.rcdata&&c.rcdata(j(b.substring(0,g)),e),b=b.substring(g);y=k=t=void 0;f.length=0;g=!1}}else n[1]?c.pcdata&&c.pcdata(n[0],e):n[3]?(t=!n[2],g=!0,y=h(n[3]),k=a.ELEMENTS.hasOwnProperty(y)?a.ELEMENTS[y]:void 0):n[4]?c.pcdata&&c.pcdata(n[4],e):n[5]&&c.pcdata&&(r=n[5],c.pcdata("<"===r?"&lt;":">"===r?"&gt;":"&amp;",e))}c.endDoc&&c.endDoc(e)}}function f(d){var e,g;return b({startDoc:function(){e=[];g=!1},startTag:function(b,p,h){if(!g&&a.ELEMENTS.hasOwnProperty(b)){var f=a.ELEMENTS[b];if(!(f&a.eflags.FOLDABLE))if(f&a.eflags.UNSAFE)g=!(f&a.eflags.EMPTY);else if(p=d(b,p)){f&a.eflags.EMPTY||e.push(b);h.push("<",b);b=0;for(f=p.length;b<f;b+=2){var j=p[b],m=p[b+1];null!==m&&void 0!==m&&h.push(" ",j,'="',c(m),'"')}h.push(">")}}},endTag:function(b,c){if(g)g=!1;else if(a.ELEMENTS.hasOwnProperty(b)){var d=a.ELEMENTS[b];if(!(d&(a.eflags.UNSAFE|a.eflags.EMPTY|a.eflags.FOLDABLE))){if(d&a.eflags.OPTIONAL_ENDTAG)for(d=e.length;0<=--d;){var p=e[d];if(p===b)break;if(!(a.ELEMENTS[p]&a.eflags.OPTIONAL_ENDTAG))return}else for(d=e.length;0<=--d&&e[d]!==b;);if(!(0>d)){for(var f=e.length;--f>d;)p=e[f],a.ELEMENTS[p]&a.eflags.OPTIONAL_ENDTAG||c.push("</",p,">");e.length=d;c.push("</",b,">")}}}},pcdata:function(a,b){g||b.push(a)},rcdata:function(a,b){g||b.push(a)},cdata:function(a,b){g||b.push(a)},endDoc:function(a){for(var b=e.length;0<=--b;)a.push("</",e[b],">");e.length=0}})}var h;h=function(a){return a.toLowerCase()};var g={lt:"<",gt:">",amp:"&",nbsp:"\u00a0",quot:'"',apos:"'"},l=/^(?:https?|mailto|data)$/i,o=/^#(\d+)$/,k=/^#x([0-9A-Fa-f]+)$/,m=/\0/g,r=/&(#\d+|#x[0-9A-Fa-f]+|\w+);/g,w=/&/g,t=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi,u=/</g,x=/>/g,A=/\"/g,C=/\=/g,z=RegExp("^\\s*(?:(?:([a-z][a-z-]*)(\\s*=\\s*(\"[^\"]*\"|'[^']*'|(?=[a-z][a-z-]*\\s*=)|[^>\"'\\s]*))?)|(/?>)|[\\s\\S][^a-z\\s>]*)","i"),p=RegExp("^(?:&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);|<\!--[\\s\\S]*?--\>|<!\\w[^>]*>|<\\?[^>*]*>|<(/)?([a-z][a-z0-9]*)|([^<&>]+)|([<&>]))","i"),y=/^(?:([^:/?#]+):)?/;return{escapeAttrib:c,makeHtmlSanitizer:f,makeSaxParser:b,normalizeRCData:j,sanitize:function(b,c,d){var e=[];f(function(b,e){for(var p=0;p<e.length;p+=2){var g=e[p],f=e[p+1],h=null,m;if((m=b+"::"+g,a.ATTRIBS.hasOwnProperty(m))||(m="*::"+g,a.ATTRIBS.hasOwnProperty(m)))h=a.ATTRIBS[m];if(null!==h)switch(h){case a.atype.NONE:break;case a.atype.SCRIPT:case a.atype.STYLE:f=null;break;case a.atype.ID:case a.atype.IDREF:case a.atype.IDREFS:case a.atype.GLOBAL_NAME:case a.atype.LOCAL_NAME:case a.atype.CLASSES:f=d?d(f):f;break;case a.atype.URI:f=(g=(""+f).match(y))?!g[1]||l.test(g[1])?c&&c(f):null:null;break;case a.atype.URI_FRAGMENT:f&&"#"===f.charAt(0)?(f=d?d(f):f)&&(f="#"+f):f=null;break;default:f=null}else f=null;e[p+1]=f}return e})(b,e);return e.join("")},unescapeEntities:d}}(html4),html_sanitize=html.sanitize;"undefined"!==typeof window&&(window.html=html,window.html_sanitize=html_sanitize);html4.ATTRIBS["*::style"]=0;html4.ELEMENTS.style=0;html4.ATTRIBS["a::target"]=0;html4.ELEMENTS.video=0;html4.ATTRIBS["video::src"]=0;html4.ATTRIBS["video::poster"]=0;html4.ATTRIBS["video::controls"]=0;html4.ELEMENTS.audio=0;html4.ATTRIBS["audio::src"]=0;html4.ATTRIBS["video::autoplay"]=0;html4.ATTRIBS["video::controls"]=0;var Mustache="undefined"!==typeof module&&module.exports||{};(function(a){function e(a){return String(a).replace(/[&<>"'\/]/g,function(a){return C[a]||a})}function d(a,b,c,d){for(var d=d||"<template>",e=b.split("\n"),f=Math.max(c-3,0),g=Math.min(e.length,c+3),e=e.slice(f,g),h=0,m=e.length;h<m;++h){g=h+f+1;e[h]=(g===c?" >> ":"    ")+e[h]}a.template=b;a.line=c;a.file=d;a.message=[d+":"+c,e.join("\n"),"",a.message].join("\n");return a}function c(a,b,c){if(a===".")return b[b.length-1];for(var a=a.split("."),d=a.length-1,e=a[d],g,f,h=b.length,m,j;h;){j=b.slice(0);f=b[--h];for(m=0;m<d;){f=f[a[m++]];if(f==null)break;j.push(f)}if(f&&typeof f==="object"&&e in f){g=f[e];break}}typeof g==="function"&&(g=g.call(j[j.length-1]));return g==null?c:g}function j(a,b,d,e){var f="",a=c(a,b);if(e){if(a==null||a===false||r(a)&&a.length===0)f=f+d()}else if(r(a))w(a,function(a){b.push(a);f=f+d();b.pop()});else if(typeof a==="object"){b.push(a);f=f+d();b.pop()}else if(typeof a==="function")var h=b[b.length-1],f=f+(a.call(h,d(),function(a){return g(a,h)})||"");else a&&(f=f+d());return f}function b(b,c){for(var c=c||{},e=c.tags||a.tags,f=e[0],g=e[e.length-1],h=['var buffer = "";',"\nvar line = 1;","\ntry {",'\nbuffer += "'],m=[],j=false,k=false,r=function(){if(j&&!k&&!c.space)for(;m.length;)h.splice(m.pop(),1);else m=[];k=j=false},l=[],n,x,o,A=function(a){e=u(a).split(/\s+/);x=e[0];o=e[e.length-1]},w=function(a){h.push('";',n,'\nvar partial = partials["'+u(a)+'"];',"\nif (partial) {","\n  buffer += render(partial,stack[stack.length - 1],partials);","\n}",'\nbuffer += "')},C=function(a,e){var f=u(a);if(f==="")throw d(Error("Section name may not be empty"),b,B,c.file);l.push({name:f,inverted:e});h.push('";',n,'\nvar name = "'+f+'";',"\nvar callback = (function () {","\n  return function () {",'\n    var buffer = "";','\nbuffer += "')},z=function(a){C(a,true)},E=function(a){var a=u(a),e=l.length!=0&&l[l.length-1].name;if(!e||a!=e)throw d(Error('Section named "'+a+'" was never opened'),b,B,c.file);a=l.pop();h.push('";',"\n    return buffer;","\n  };","\n})();");a.inverted?h.push("\nbuffer += renderSection(name,stack,callback,true);"):h.push("\nbuffer += renderSection(name,stack,callback);");h.push('\nbuffer += "')},F=function(a){h.push('";',n,'\nbuffer += lookup("'+u(a)+'",stack,"");','\nbuffer += "')},G=function(a){h.push('";',n,'\nbuffer += escapeHTML(lookup("'+u(a)+'",stack,""));','\nbuffer += "')},B=1,v,s,q=0,H=b.length;q<H;++q)if(b.slice(q,q+f.length)===f){q=q+f.length;v=b.substr(q,1);n="\nline = "+B+";";x=f;o=g;j=true;switch(v){case "!":q++;s=null;break;case "=":q++;g="="+g;s=A;break;case ">":q++;s=w;break;case "#":q++;s=C;break;case "^":q++;s=z;break;case "/":q++;s=E;break;case "{":g="}"+g;case "&":q++;k=true;s=F;break;default:k=true;s=G}v=b.indexOf(g,q);if(v===-1)throw d(Error('Tag "'+f+'" was not closed properly'),b,B,c.file);f=b.substring(q,v);s&&s(f);for(s=0;~(s=f.indexOf("\n",s));){B++;s++}q=v+g.length-1;f=x;g=o}else{v=b.substr(q,1);switch(v){case '"':case "\\":k=true;h.push("\\"+v);break;case "\r":break;case "\n":m.push(h.length);h.push("\\n");r();B++;break;default:t.test(v)?m.push(h.length):k=true;h.push(v)}}if(l.length!=0)throw d(Error('Section "'+l[l.length-1].name+'" was not closed properly'),b,B,c.file);r();h.push('";',"\nreturn buffer;","\n} catch (e) { throw {error: e, line: line}; }");g=h.join("").replace(/buffer \+= "";\n/g,"");c.debug&&(typeof console!="undefined"&&console.log?console.log(g):typeof print==="function"&&print(g));return g}function f(a,f){var h=b(a,f),m=new Function("view,partials,stack,lookup,escapeHTML,renderSection,render",h);return function(b,h){var h=h||{},k=[b];try{return m(b,h,k,c,e,j,g)}catch(t){throw d(t.error,a,t.line,f.file);}}}function h(a,b){b=b||{};if(b.cache!==false){z[a]||(z[a]=f(a,b));return z[a]}return f(a,b)}function g(a,b,c){return h(a)(b,c)}a.name="mustache.js";a.version="0.5.0-dev";a.tags=["{{","}}"];a.parse=b;a.compile=h;a.render=g;a.clearCache=function(){z={}};a.to_html=function(a,b,c,d){a=g(a,b,c);if(typeof d==="function")d(a);else return a};var l=Object.prototype.toString,o=Array.isArray,k=Array.prototype.forEach,m=String.prototype.trim,r;r=o?o:function(a){return l.call(a)==="[object Array]"};var w;w=k?function(a,b,c){return k.call(a,b,c)}:function(a,b,c){for(var d=0,e=a.length;d<e;++d)b.call(c,a[d],d,a)};var t=/^\s*$/,u;if(m)u=function(a){return a==null?"":m.call(a)};else{var x,A;if(t.test("\u00a0")){x=/^\s+/;A=/\s+$/}else{x=/^[\s\xA0]+/;A=/[\s\xA0]+$/}u=function(a){return a==null?"":String(a).replace(x,"").replace(A,"")}}var C={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},z={}})(Mustache);wax.attribution=function(){function a(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function e(a){return a}var d;return{content:function(c){if(typeof c==="undefined")return d.innerHTML;d.innerHTML=html_sanitize(c,a,e);return this},element:function(){return d},init:function(){d=document.createElement("div");d.className="wax-attribution";return this}}.init()};wax=wax||{};wax.bwdetect=function(a,e){var d={},c=a.threshold||400,j="http://a.tiles.mapbox.com/mapbox/1.0.0/blue-marble-topo-bathy-jul/0/0/0.png?preventcache="+ +new Date,b=1,f=a.auto===void 0?true:a.auto;d.bw=function(a){if(!arguments.length)return b;if(wax.bwlisteners&&wax.bwlisteners.length){listeners=wax.bwlisteners;wax.bwlisteners=[];for(i=0;i<listeners;i++)listeners[i](a)}wax.bw=a;b!=(b=a)&&e(a)};d.add=function(){if(f){wax.bw=-1;var a=new Image;a.src=j;var b=true,e=setTimeout(function(){if(b&&wax.bw==-1){d.bw(0);b=false}},c);a.onload=function(){if(b&&wax.bw==-1){clearTimeout(e);d.bw(1);b=false}}}return this};if(wax.bw==-1){wax.bwlisteners=wax.bwlisteners||[];wax.bwlisteners.push(d.bw)}else wax.bw!==void 0?d.bw(wax.bw):d.add();return d};wax.formatter=function(a){function e(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function d(a){return a}var c={},j;if(a&&typeof a==="string")try{eval("f = "+a)}catch(b){console&&console.log(b)}else j=a&&typeof a==="function"?a:function(){};c.format=function(a,b){try{return html_sanitize(j(a,b),e,d)}catch(c){console&&console.log(c)}};return c};wax.gi=function(a,e){var e=e||{},d={},c=e.resolution||4,j=e.tileSize||256;d.grid_tile=function(){return a};d.getKey=function(b,d){if(a&&a.grid&&!(d<0||b<0))if(!(Math.floor(d)>=j||Math.floor(b)>=j)){var e=a.grid[Math.floor(d/c)].charCodeAt(Math.floor(b/c));e>=93&&e--;e>=35&&e--;return e-32}};d.gridFeature=function(b,c){var d=this.getKey(b,c),e=a.keys;if(e&&e[d]&&a.data[e[d]])return a.data[e[d]]};d.tileFeature=function(b,c,d){if(a){d=wax.u.offset(d);return feature=this.gridFeature(b-d.left,c-d.top)}};return d};wax.gm=function(){var a=4,e={},d,c,j=function(a){if(a)return a.replace(/(\.png|\.jpg|\.jpeg)(\d*)/,".grid.json")};e.formatter=function(a){if(!arguments.length)return c;c=wax.formatter(a);return e};e.template=function(a){if(!arguments.length)return c;c=wax.template(a);return e};e.gridUrl=function(a){if(!arguments.length)return j;if(a){var c;if(typeof a==="function")c=a;else{var d=a;typeof d==="string"&&(d=[d]);c=function(a){if(a)if(a=/\/(\d+)\/(\d+)\/(\d+)\.[\w\._]+/.exec(a))return d[parseInt(a[2],10)%d.length].replace(/\{z\}/g,a[1]).replace(/\{x\}/g,a[2]).replace(/\{y\}/g,a[3])}}j=c}else j=function(){return null};return e};e.getGrid=function(b,d){var h=j(b);if(!c||!h)return d(null,null);wax.request.get(h,function(b,e){if(b)return d(b,null);d(null,wax.gi(e,{formatter:c,resolution:a}))});return e};e.tilejson=function(b){if(!arguments.length)return d;b.template?e.template(b.template):b.formatter?e.formatter(b.formatter):c=void 0;e.gridUrl(b.grids);if(b.resolution)a=b.resolution;d=b;return e};return e};wax=wax||{};wax.hash=function(a){function e(){var b=a.getCenterZoom();if(d!==b){d=b;b=window.location;b.replace(b.toString().replace(b.hash||/$/,"#"+d))}}var a=a||{},d,c={},j=wax.u.throttle(e,500);c.add=function(){var b=location.hash.substring(1);if(b!==d){b:{for(var b=(d=b).split("/"),c=0;c<b.length;c++){b[c]=Number(b[c]);if(isNaN(b[c])){b=true;break b}}if(b.length<3)b=true;else{b.length==3&&a.setCenterZoom(b);b=void 0}}b&&e()}a.bindChange(j);return this};c.remove=function(){a.unbindChange(j);return this};return c.add()};wax=wax||{};wax.interaction=function(){function a(a){var d;if(b){window.clearTimeout(b);b=null;d=true}else d=false;if(!d){j=true;f=wax.u.eventoffset(a);if(a.type==="mousedown")bean.add(document.body,"click",e);else if(a.type==="touchstart"&&a.touches.length===1){bean.fire(c,"off");bean.add(k(),w)}}}function e(a){var d={},g=wax.u.eventoffset(a);j=false;for(var m in a)d[m]=a[m];bean.remove(document.body,"mouseup",e);bean.remove(k(),w);a.type==="touchend"?c.click(a,f):Math.round(g.y/h)===Math.round(f.y/h)&&Math.round(g.x/h)===Math.round(f.x/h)&&(b=window.setTimeout(function(){b=null;c.click(d,g)},300));return e}var d=wax.gm(),c={},j=false,b=false,f,h=4,g,l,o,k,m,r={mousemove:function(a){if(!j){var b=wax.u.eventoffset(a);c.screen_feature(b,function(b){b?bean.fire(c,"on",{parent:k(),data:b,formatter:d.formatter().format,e:a}):bean.fire(c,"off")})}},touchstart:a,mousedown:a},w={touchend:e,touchmove:e,touchcancel:function(){bean.remove(k(),w);j=false}};c.click=function(a,b){c.screen_feature(b,function(b){b&&bean.fire(c,"on",{parent:k(),data:b,formatter:d.formatter().format,e:a})})};c.screen_feature=function(a,b){var c;a:{for(var e=g(),f=0;f<e.length;f++)if(e[f][0]<a.y&&e[f][0]+256>a.y&&e[f][1]<a.x&&e[f][1]+256>a.x){c=e[f][2];break a}c=false}c||b(null);d.getGrid(c.src,function(d,e){if(d||!e)return b(null);var f=e.tileFeature(a.x,a.y,c);b(f)})};c.attach=function(a){if(!arguments.length)return l;l=a;return c};c.detach=function(a){if(!arguments.length)return o;o=a;return c};c.map=function(b){if(!arguments.length)return m;m=b;l&&l(m);bean.add(k(),r);bean.add(k(),"touchstart",a);return c};c.grid=function(a){if(!arguments.length)return g;g=a;return c};c.remove=function(){o&&o(m);bean.remove(k(),r);bean.fire(c,"remove");return c};c.tilejson=function(a){if(!arguments.length)return d.tilejson();d.tilejson(a);return c};c.formatter=function(){return d.formatter()};c.on=function(a,b){bean.add(c,a,b);return c};c.off=function(a,b){bean.remove(c,a,b);return c};c.gridmanager=function(a){if(!arguments.length)return d;d=a;return c};c.parent=function(a){k=a;return c};return c};var wax=wax||{};wax.legend=function(){function a(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function e(a){return a}var d,c={},j;c.element=function(){return j};c.content=function(b){if(!arguments.length)return d.innerHTML;if(b){d.innerHTML=html_sanitize(b,a,e);d.style.display="block"}else{d.innerHTML="";d.style.display="none"}return c};c.add=function(){j=document.createElement("div");j.className="wax-legends";d=j.appendChild(document.createElement("div"));d.className="wax-legend";d.style.display="none";return c};return c.add()};wax=wax||{};wax.location=function(){function a(a){console.log(a);if(a.e.type!=="mousemove"&&a.e.type)if(a=a.formatter({format:"location"},a.data))window.location.href=a}return{events:function(){return{on:a}}}};wax=wax||{};wax.movetip={};wax.movetip=function(){function a(a){a=wax.u.eventoffset(a);if(h.height+a.y>g.top+g.height&&g.height>h.height){a.y=a.y-h.height;l.className=l.className+" flip-y"}if(h.width+a.x>g.left+g.width){a.x=a.x-h.width;l.className=l.className+" flip-x"}l.style.left=a.x+"px";l.style.top=a.y+"px"}function e(a){var b=document.createElement("div");b.className="wax-tooltip wax-tooltip-0";b.innerHTML=a;return b}function d(){if(l){l.parentNode.removeChild(l);l=null}}function c(c){var f;if(!b){if(c.e.type==="mousemove"||!c.e.type){f=c.formatter({format:"teaser"},c.data);if(!f)return;d();o.style.cursor="pointer";l=document.body.appendChild(e(f))}else{f=c.formatter({format:"teaser"},c.data);if(!f)return;d();f=document.body.appendChild(e(f));f.className=f.className+" wax-popup";var j=f.appendChild(document.createElement("a"));j.href="#close";j.className="close";j.innerHTML="Close";b=true;l=f;h=wax.u.offset(l);g=wax.u.offset(o);a(c.e);bean.add(j,"click touchend",function(a){a.stop();d();b=false})}if(l){h=wax.u.offset(l);g=wax.u.offset(o);a(c.e)}}}function j(){o.style.cursor="default";b||d()}var b=false,f={},h,g,l,o;f.parent=function(a){if(!arguments.length)return o;o=a;return f};f.events=function(){return{on:c,off:j}};return f};wax=wax||{};wax.request={cache:{},locks:{},promises:{},get:function(a,e){if(this.cache[a])return e(this.cache[a][0],this.cache[a][1]);this.promises[a]=this.promises[a]||[];this.promises[a].push(e);if(!this.locks[a]){var d=this;this.locks[a]=true;reqwest({url:a+(~a.indexOf("?")?"&":"?")+"callback=grid",type:"jsonp",jsonpCallback:"callback",success:function(c){d.locks[a]=false;d.cache[a]=[null,c];for(c=0;c<d.promises[a].length;c++)d.promises[a][c](d.cache[a][0],d.cache[a][1])},error:function(c){d.locks[a]=false;d.cache[a]=[c,null];for(c=0;c<d.promises[a].length;c++)d.promises[a][c](d.cache[a][0],d.cache[a][1])}})}}};wax.template=function(a){function e(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function d(a){return a}return{format:function(c,j){var b={},f;for(f in j)b[f]=j[f];c.format&&(b["__"+c.format+"__"]=true);return html_sanitize(Mustache.to_html(a,b),e,d)}}};wax||(wax={});wax.tilejson=function(a,e){reqwest({url:a+(~a.indexOf("?")?"&":"?")+"callback=grid",type:"jsonp",jsonpCallback:"callback",success:e,error:e})};wax=wax||{};wax.tooltip={};wax.tooltip=function(){function a(a){var b=document.createElement("div");b.className="wax-tooltip wax-tooltip-0";b.innerHTML=a;return b}function e(){this.parentNode&&this.parentNode.removeChild(this)}function d(){for(var a;a=g.pop();)if(f&&o){bean.add(a,o,e);a.className=a.className+" wax-fade"}else a.parentNode&&a.parentNode.removeChild(a)}function c(c){var e;if(c.e.type==="mousemove"||!c.e.type){if(!b)if((e=c.content||c.formatter({format:"teaser"},c.data))&&e!=l){d();k.style.cursor="pointer";g.push(k.appendChild(a(e)));l=e}}else{e=c.content||c.formatter({format:"full"},c.data);if(!e){c.e.type&&c.e.type.match(/touch/)&&(e=c.content||c.formatter({format:"teaser"},c.data));if(!e)return}d();k.style.cursor="pointer";c=k.appendChild(a(e));c.className=c.className+" wax-popup";e=c.appendChild(document.createElement("a"));e.href="#close";e.className="close";e.innerHTML="Close";b=true;g.push(c);bean.add(e,"touchstart mousedown",function(a){a.stop()});bean.add(e,"click touchend",function(a){a.stop();d();b=false})}}function j(){k.style.cursor="default";l=null;b||d()}var b=false,f=false,h={},g=[],l,o,k;document.body.style["-webkit-transition"]!==void 0?o="webkitTransitionEnd":document.body.style.MozTransition!==void 0&&(o="transitionend");h.parent=function(a){if(!arguments.length)return k;k=a;return h};h.animate=function(a){if(!arguments.length)return f;f=a;return h};h.events=function(){return{on:c,off:j}};return h};wax=wax||{};wax.u={offset:function(a){var e=a.offsetWidth||parseInt(a.style.width,10),d=a.offsetHeight||parseInt(a.style.height,10),c=document.body,j=0,b=0,f=function(a){if(!(a===c||a===document.documentElement)){j=j+a.offsetTop;b=b+a.offsetLeft;if(a=a.style.transform||a.style.WebkitTransform||a.style.OTransform||a.style.MozTransform||a.style.msTransform)if(match=a.match(/translate\((.+)px, (.+)px\)/)){j=j+parseInt(match[2],10);b=b+parseInt(match[1],10)}else if(match=a.match(/translate3d\((.+)px, (.+)px, (.+)px\)/)){j=j+parseInt(match[2],10);b=b+parseInt(match[1],10)}else if(match=a.match(/matrix3d\(([\-\d,\s]+)\)/)){a=match[1].split(",");j=j+parseInt(a[13],10);b=b+parseInt(a[12],10)}else if(match=a.match(/matrix\(.+, .+, .+, .+, (.+), (.+)\)/)){j=j+parseInt(match[2],10);b=b+parseInt(match[1],10)}}};f(a);try{for(;a=a.offsetParent;)f(a)}catch(h){}j=j+c.offsetTop;b=b+c.offsetLeft;j=j+c.parentNode.offsetTop;b=b+c.parentNode.offsetLeft;a=document.defaultView?window.getComputedStyle(c.parentNode,null):c.parentNode.currentStyle;if(c.parentNode.offsetTop!==parseInt(a.marginTop,10)&&!isNaN(parseInt(a.marginTop,10))){j=j+parseInt(a.marginTop,10);b=b+parseInt(a.marginLeft,10)}return{top:j,left:b,height:d,width:e}},$:function(a){return typeof a==="string"?document.getElementById(a):a},indexOf:function(a,e){var d=Array.prototype.indexOf;if(a===null)return-1;var c;if(d&&a.indexOf===d)return a.indexOf(e);d=0;for(c=a.length;d<c;d++)if(a[d]===e)return d;return-1},eventoffset:function(a){if(!a)a=window.event;if(a.pageX||a.pageY)return{x:a.pageX,y:a.pageY};if(a.clientX||a.clientY){var e=document.documentElement,d=document.body,c=document.body.parentNode.currentStyle,j=parseInt(c.marginTop,10)||0,c=parseInt(c.marginLeft,10)||0;return{x:a.clientX+(e&&e.scrollLeft||d&&d.scrollLeft||0)-(e&&e.clientLeft||d&&d.clientLeft||0)+c,y:a.clientY+(e&&e.scrollTop||d&&d.scrollTop||0)-(e&&e.clientTop||d&&d.clientTop||0)+j}}if(a.touches&&a.touches.length===1)return{x:a.touches[0].pageX,y:a.touches[0].pageY}},limit:function(a,e,d){var c;return function(){var j=this,b=arguments,f=function(){c=null;a.apply(j,b)};d&&clearTimeout(c);if(d||!c)c=setTimeout(f,e)}},throttle:function(a,e){return this.limit(a,e,false)}};

define([
  'Event',
  'InfoBox',
  'Util/Util'
], function(Event, InfoBox, Util) {
  var
      //
      activeNotificationMessages = [],
      //
      activeNotificationMessagesHeight = 0,
      // The map div.
      divMap = document.getElementById(NPMap.config.div),
      // Does the map have active tile layers?
      hasTiled = false,
      // Is the map in fullscreen mode?
      isFullScreen = false,
      // The zoom level to scale in meters.
      zoomScales = [
        [0, 295829355],
        [1, 147914668],
        [2, 73957339],
        [3, 36978669],
        [4, 18489335],
        [5, 9244667],
        [6, 4622334],
        [7, 2311166],
        [8, 1155583],
        [9, 577792],
        [10, 288896],
        [11, 144448],
        [12, 72224],
        [13, 36112],
        [14, 18056],
        [15, 9028],
        [16, 4514],
        [17, 2257],
        [18, 1128],
        [19, 564]
      ];

  /**
   * Creates a notify div.
   * @param {String} message
   * @param {String} title (Optional)
   * @param {String} type (Optional)
   * @return {Object}
   */
  function createNotify(message, title, type) {
    var cls = 'content',
        html = '';
        msg = document.createElement('div');

    if (type) {
      cls += ' ' + type;
    }

    msg.className = cls;

    if (title) {
      html += '<h3>' + title + '</h3><p>' + message + '</p>';
    } else {
      html += '<p style="text-align:center;">' + message + '</p>';
    }

    msg.innerHTML = html;

    return msg;
  }
  /**
   * Hooks up the click event to an element.
   * @param {String} id
   * @param {Function} func
   * @return {Object}
   */
  function hookUpClickEvent(id, func) {
    var el = document.getElementsById(id);
    
    Util.stopAllPropagation(el);
    bean.add(el, 'click', function(e) {
      func();
    });

    return el;
  }
  /**
   * Sets the width of the attribution control based on the width of the map and logos and positions it.
   */
  function setAttributionMaxWidthAndPosition() {
    var divAttribution = document.getElementById('npmap-attribution'),
        divOverviewMap = document.getElementById('npmap-overviewmap'),
        max = Util.getOuterDimensions(divMap).width - Util.getOuterDimensions(document.getElementById('npmap-logos')).width - 40,
        right = 0;

    if (divOverviewMap) {
      var divOverviewMapWidth = Util.getOuterDimensions(divOverviewMap).width;

      max = max - divOverviewMapWidth;
      right = divOverviewMapWidth;
    }
    
    divAttribution.style.maxWidth = max + 'px';
    divAttribution.style.right = right + 'px';
  }
  
  /**
   * @class NPMap.Map
   *
   * The base class for all map objects. No "baseApi" specific code lives here.
   */
  return NPMap.Map = {
    // An array of event handler objects that have been added to this class.
    _events: [{
      event: 'zoomchange',
      func: function() {
        if (!NPMap.InfoBox.marker) {
          NPMap.InfoBox.hide();
        }
      }
    },{
      event: 'zoomchanged',
      func: function() {
        if (!NPMap.InfoBox.marker) {
          NPMap.InfoBox.hide();
        }
      }
    }],
    /**
     * Creates a line using the baseApi's line class, if it exists.
     * @param {Array} latLngs An array of the latitude/longitude strings, in "latitude,longitude" format, to use to create the line.
     * @param {Object} options (Optional) Line options.
     */
    _createLine: function(latLngs, options) {
      var apiLatLngs = [],
          me = this;
      
      _.each(latLngs, function(latLng) {
        apiLatLngs.push(me.latLngToApi(latLng));
      });
      
      return NPMap.Map[NPMap.config.api].createLine(apiLatLngs, options);
    },
    /**
     * Creates a marker using the baseApi's marker class, if it exists.
     * @param {String} latLng The latitude/longitude string, in "latitude,longitude" format, to use to create the marker.
     * @param {Object} options (Optional) Marker options.
     */
    _createMarker: function(latLng, options) {
      return NPMap.Map[NPMap.config.api].createMarker(this.latLngToApi(latLng), options);
    },
    /**
     * Creates a polygon using the baseApi's marker class, if it exists.
     * @param {Array} latLngs An array of latitude/longitude strings, in "latitude,longitude" format, to use to create the polygon.
     * @param {Object} options (Optional) Polygon options.
     * @return {Object}
     */
    _createPolygon: function(latLngs, options) {
      var apiLatLngs = [],
          me = this;

      for (var i = 0; i < latLngs.length; i++) {
        apiLatLngs.push(me.latLngToApi(latLngs[i]));
      }

      return NPMap.Map[NPMap.config.api].createPolygon(apiLatLngs, options);
    },
    /**
     * Initializes the construction of the NPMap.Map class. This is called by the baseApi map object after its map is created and should never be called manually.
     */
    _init: function() {
      var 
          // Self-reference.
          me = this;

      Util.safeLoad('NPMap.Map.' + NPMap.config.api, function() {
        var
            // The attribution control div.
            attribution = document.createElement('div'),
            // The "clickdot" div.
            clickdot = document.createElement('div'),
            // An array of elements to add to the map div.
            elements = [],
            // HTML for the logos div.
            logosHtml = '',
            // The config object for NPMap's modules.
            modulesConfig = NPMap.config.modules || null,
            // The notify div.
            notify = document.createElement('div'),
            // The progress div.
            progress = document.createElement('div'),
            // The tip div.
            tip = document.createElement('div'),
            // The config object for NPMap's tools. Supports legacy config information too.
            toolsConfig = (function() {
              if (NPMap.config.tools) {
                return {
                  fullscreen: NPMap.config.tools.fullscreen || false,
                  navigation: NPMap.config.tools.navigation || {
                    pan: NPMap.config.tools.pan || 'home',
                    position: 'top left',
                    zoom: NPMap.config.tools.zoom || 'small'
                  },
                  overview: NPMap.config.tools.overview || false,
                  print: NPMap.config.tools.print || false,
                  share: NPMap.config.tools.share || false
                };
              } else if (typeof NPMap.config.tools === 'undefined') {
                return {
                  fullscreen: false,
                  navigation: {
                    pan: 'home',
                    position: 'top left',
                    zoom: 'small'
                  },
                  overview: false,
                  print: false,
                  share: false
                };
              } else {
                return {};
              }
            })();

        function hookUpNavigationControl(id, handler) {
          var el = document.getElementById(id);
          
          bean.add(el, 'click dblclick mousedown', function(e) {
            e.stop();
          });
          bean.add(el, 'mouseup', function(e) {
            e.stop();
            handler();
          });
          
          return el;
        }

        if (NPMap.config.api === 'Bing') {
          divMap = document.getElementById(NPMap.config.div).getElementsByTagName('div')[0]
        }

        bean.add(divMap, 'contextmenu', function(e) {
          e.stop();
        });

        attribution.id = 'npmap-attribution';
        elements.push({
          el: attribution,
          func: setAttributionMaxWidthAndPosition
        });
        clickdot.id = 'npmap-clickdot';
        elements.push({
          el: clickdot
        });
        notify.id = 'npmap-notify';
        elements.push({
          el: notify
        });
        progress.id = 'npmap-progressbar';
        progress.innerHTML = '<div></div>';
        elements.push({
          el: progress
        });
        tip.className = 'padded rounded shadowed transparent';
        tip.id = 'npmap-tip';
        elements.push({
          el: tip
        });
        
        if (NPMap.config.api.toLowerCase() !== 'leaflet' && NPMap.config.api.toLowerCase() !== 'modestmaps') {
          logosHtml += '<span style="display:block;float:left;margin-right:8px;"><img src="' + NPMap.config.server + '/resources/img/' + NPMap.config.api.toLowerCase() + 'logo.png" /></span>';
        }
        
        if (!NPMap.config.hideNpmapLogo) {
          logosHtml += '<span style="display:block;float:right;"><a href="http://www.nps.gov/npmap" target="_blank"><img src="' + NPMap.config.server + '/resources/img/npmaplogo.png" alt="NPMap - Web Mapping for the U.S. National Park Service" /></a></span>';
        }

        if (logosHtml.length > 0) {
          // The logo div.
          var logos = document.createElement('div');
          
          logos.id = 'npmap-logos';
          logos.innerHTML = logosHtml;
          logos.style.cssText = 'bottom:3px;height:30px;left:5px;position:absolute;z-index:30;';
          elements.push({
            el: logos,
            func: function() {
              Util.monitorResize(document.getElementById('npmap-logos'), function() {
                setAttributionMaxWidthAndPosition();
              });
              setAttributionMaxWidthAndPosition();
            }
          })
        }

        if (toolsConfig.navigation) {
          var
              // An array of callback functions.
              callbacks = [],
              // The navigation controls div.
              navigation = document.createElement('div'),
              // HTML string for the navigation div.
              navigationHtml = '',
              // The position string for the navigation tools.
              position = toolsConfig.navigation.position.split(' ');
              
          if (toolsConfig.navigation.pan) {
            var compass = toolsConfig.navigation.pan;

            navigation.style.width = '58px';

            navigationHtml += '<div id="npmap-navigation-compass" class="npmap-navigation-compass-' + compass + '"><a id="npmap-navigation-compass-east" class="pointer"></a><a id="npmap-navigation-compass-north" class="pointer"></a><a id="npmap-navigation-compass-south" class="pointer"></a><a id="npmap-navigation-compass-west" class="pointer"></a>';
            
            if (compass === 'home') {
              navigationHtml += '<a id="npmap-navigation-compass-center" class="pointer"></a>';
            }
            
            navigationHtml += '</div>';

            callbacks.push(function() {
              var buttons = [];

              buttons.push(hookUpNavigationControl('npmap-navigation-compass-east', function() {
                NPMap.Map.panInDirection('east');
              }));
              buttons.push(hookUpNavigationControl('npmap-navigation-compass-north', function() {
                NPMap.Map.panInDirection('north');
              }));
              buttons.push(hookUpNavigationControl('npmap-navigation-compass-south', function() {
                NPMap.Map.panInDirection('south');
              }));
              buttons.push(hookUpNavigationControl('npmap-navigation-compass-west', function() {
                NPMap.Map.panInDirection('west');
              }));
              
              if (compass === 'home') {
                hookUpNavigationControl('npmap-navigation-compass-center', function() {
                  me.toInitialExtent();
                });
              }
              
              for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i],
                    compassEl = document.getElementById('npmap-navigation-compass');
                    
                button.direction = button.id.split('-')[3];
                
                bean.add(button, 'mouseenter', function(e) {
                  compassEl.className = compassEl.className.replace('npmap-navigation-compass-' + compass, ' npmap-navigation-compass-' + compass + '-' + this.direction + '-over');
                });
                bean.add(button, 'mouseleave', function(e) {
                  compassEl.className = compassEl.className.replace(' npmap-navigation-compass-' + compass + '-' + this.direction + '-over', 'npmap-navigation-compass-' + compass);
                });
              }
            });
          }
          
          if (toolsConfig.navigation.zoom === 'small') {
            navigationHtml += '<div id="npmap-navigation-small-zoom" class="npmap-navigation-small-zoom"';
            
            if (typeof toolsConfig.navigation.pan !== 'undefined') {
              navigationHtml += ' style="margin-left:17px;margin-top:5px;"';
            }
            
            navigationHtml += '><a id="npmap-navigation-small-zoom-in" class="pointer"></a><a id="npmap-navigation-small-zoom-out" class="pointer"></a></div>';

            callbacks.push(function() {
              var buttons = [];
            
              buttons.push(hookUpNavigationControl('npmap-navigation-small-zoom-in', function() {
                NPMap.Map.zoomIn();
              }));
              buttons.push(hookUpNavigationControl('npmap-navigation-small-zoom-out', function() {
                NPMap.Map.zoomOut();
              }));
              
              for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i],
                    divZoom = document.getElementById('npmap-navigation-small-zoom'); 
                
                button.inOrOut = button.id.split('-')[4];
                
                bean.add(button, 'mouseenter', function(e) {
                  divZoom.className += '-' + this.inOrOut + '-over';
                });
                bean.add(button, 'mouseleave', function(e) {
                  divZoom.className = divZoom.className.replace('-' + this.inOrOut + '-over', '');
                });
              }
            });
          }

          if (position[0] === 'bottom') {
            navigation.style.bottom = '15px';
          } else {
            navigation.style.top = '15px';
          }
          
          if (position[1]) {
            if (position[1] === 'left') {
              navigation.style.left = '15px';
            } else {
              navigation.style.right = '15px';
            }
          } else {
            navigation.style.left = '15px';
          }

          navigation.id = 'npmap-navigation';
          navigation.innerHTML = navigationHtml;
          navigation.style.position = 'absolute';
          navigation.style.zIndex = '30';
          elements.push({
            el: navigation,
            func: function() {
              for (var i = 0; i < callbacks.length; i++) {
                callbacks[i]();
              }
            }
          });
        }
        
        if (toolsConfig.fullscreen || toolsConfig.print || toolsConfig.share) {
          var callbacks = [],
              html = '<ul id="npmap-tools">',
              toolbar = document.createElement('div');

          if (toolsConfig.print) {
            html += '<li id="npmap-toolbar-print"><div class="npmap-toolbar-print"></div></li>';

            callbacks.push(function() {
              
            });
          }

          if (toolsConfig.share) {
            html += '<li id="npmap-toolbar-share"><div class="npmap-toolbar-share"></div></li>';

            callbacks.push(function() {
              
            });
          }

          if (toolsConfig.fullscreen) {
            html += '<li id="npmap-toolbar-fullscreen"><div class="npmap-toolbar-fullscreen"></div></li>';

            callbacks.push(function() {
              hookUpClickEvent('npmap-toolbar-fullscreen', function() {
                NPMap.Map.toggleFullScreen();
              });
            });
          }
          
          toolbar.innerHTML = html + '</ul>';
          toolbar.id = 'npmap-toolbar';
          
          document.getElementById('npmap-map').style.top = '28px';
          document.getElementById('npmap').insertBefore(toolbar, document.getElementById('npmap-map'));

          for (var i = 0; i < callbacks.length; i ++) {
            callbacks[i]();
          }
        }

        if (NPMap.config.modules && NPMap.config.modules.length > 0) {
          var count = 0;

          for (var i = 0; i < NPMap.config.modules.length; i++) {
            var name = NPMap.config.modules[i].name.toLowerCase();

            if (name !== 'edit' && name !== 'route') {
              count++;
            }
          }

          if (count > 0) {
            var modules = document.createElement('div'),
                modulesHtml = '',
                tabs = document.createElement('div'),
                tabsHtml = '';

            for (var j = 0; j < NPMap.config.modules.length; j++) {
              var module = NPMap.config.modules[j],
                  nameLower = module.name.toLowerCase();

              if (nameLower !== 'edit' && nameLower !== 'route') {
                modulesHtml += '<div id="npmap-modules-' + nameLower + '">Test</div>';
                tabsHtml += '<div id="npmap-module-tab-' + nameLower + '" class="npmap-module-tab" onclick="NPMap.Map.handleModuleTabClick(this);return false;"><div class="npmap-module-tab-' + nameLower + '"></div></div>';
              }
            }

            modules.id = 'npmap-modules';
            modules.innerHTML = '<div id="npmap-modules-close" class="npmap-module-tab" style="position:absolute;right:-29px;top:' + (document.getElementById('npmap-toolbar') ? '45px' : '15px') + ';z-index:1;" onclick="NPMap.Map.handleModuleCloseClick();return false;"><div class="npmap-module-tab-close"></div></div>';
            tabs.id = 'npmap-modules-tabs';
            tabs.innerHTML = tabsHtml;

            elements.push({
              el: tabs,
              func: function() {

              }
            });

            document.getElementById('npmap').insertBefore(modules, document.getElementById('npmap-map'));
          }
        }

        // TODO: This is currently Bing specific.
        if ((toolsConfig.overviewMap || toolsConfig.overview) && NPMap.config.api === 'bing') {
          var divOverview = document.createElement('div');

          divOverview.id = 'npmap-overview';
          divOverview.innerHTML = '<div id="npmap-overview-title" style="color:#454545;display:none;padding:8px;position:absolute;">Overview Map</div><div id="npmap-overview-map" style="bottom:0px;left:0px;position:absolute;right:0px;top:0px;"></div>';
          divOverview.style.bottom = Util.getOuterDimensions(document.getElementById('npmap-attribution')).height + 'px';
          
          elements.push({
            el: divOverview,
            func: function() {
              var divOverviewButton = document.createElement('div'),
                  divOverviewMap = document.getElementById('npmap-overview-map'),
                  divOverviewTitle = document.getElementById('npmap-overview-title'),
                  mapOverview = new Microsoft.Maps.Map(divOverviewMap, {
                    credentials: NPMap.config.credentials ? NPMap.config.credentials : 'AqZQwVLETcXEgQET2dUEQIFcN0kDsUrbY8sRKXQE6dTkhCDw9v8H_CY8XRfZddZm',
                    disablePanning: true,
                    disableZooming: true,
                    fixedMapPosition: true,
                    mapTypeId: Microsoft.Maps.MapTypeId.road,
                    showBreadcrumb: false,
                    showCopyright: false,
                    showDashboard: false,
                    showLogo: false,
                    showMapTypeSelector: false,
                    showScalebar: false
                  });

              function updateOverviewMap() {
                var bounds = NPMap.bing.map.Map.getBounds(),
                    nw = bounds.getNorthwest(),
                    se = bounds.getSoutheast(),
                    ne = new Microsoft.Maps.Location(se.latitude, nw.longitude),
                    sw = new Microsoft.Maps.Location(nw.latitude, se.longitude);
                
                mapOverview.setView({
                  bounds: bounds,
                  padding: 20
                });
                mapOverview.entities.clear();

                if (Util.hasClass(divOverviewButton, 'expanded')) {
                  mapOverview.entities.push(new Microsoft.Maps.Polygon([
                    nw,
                    ne,
                    se,
                    sw,
                    nw
                  ], {
                    fillColor: new Microsoft.Maps.Color(175, 218, 233, 228),
                    strokeColor: new Microsoft.Maps.Color(255, 186, 197, 191),
                    strokeThickness: 1
                  }));
                }
              }

              Util.stopAllPropagation(divOverview);

              divOverviewButton.id = 'npmap-overviewmap-button';
              divOverviewButton.className = 'npmap-overview-open cursor';
              divOverviewButton.style.cssText = 'position:absolute;';

              document.getElementById('npmap-overview-map').appendChild(divOverviewButton);

              bean.add(divOverviewButton, 'click', function() {
                if (Util.hasClass(this, 'expanded')) {
                  this.style.display = 'none';
                  divOverviewMap.style.top = '0px';
                  // TODO: Animate this resize.
                  divOverview.style.height = '48px';
                  divOverview.style.width = '48px';
                  
                  mapOverview.setOptions({
                    height: 48,
                    width: 48
                  });
                  setAttributionMaxWidthAndPosition();
                  updateOverviewMap();
                  Util.removeClass(this, 'npmap-overview-close-over');
                  Util.removeClass(this, 'expanded');
                  Util.addClass(this, 'npmap-overview-open');
                  mapOverview.entities.clear();
                } else {
                  divOverviewTitle.style.display = 'block';
                  divOverviewMap.style.top = Util.getOuterDimensions(divOverviewTitle).height + 'px';
                  // TODO: Animate this resize.
                  divOverview.style.height = '173px';
                  divOverview.style.width = '174px';

                  mapOverview.setOptions({
                    height: 173,
                    width: 174
                  });
                  setAttributionMaxWidthAndPosition();
                  updateOverviewMap();
                  Util.removeClass(this, 'npmap-overview-open');
                  Util.removeClass(this, 'npmap-overview-open-over');
                  Util.addClass(this, 'npmap-overview-close');
                  Util.addClass(this, 'expanded');
                }
              });
              bean.add(divOverviewButton, 'mouseover', function() {
                if (Util.hasClass(this, 'expanded')) {
                  Util.removeClass(this, 'npmap-overview-close');
                  Util.addClass(this, 'npmap-overview-close-over');
                } else {
                  Util.removeClass(this, 'npmap-overview-open');
                  Util.addClass('npmap-overview-open-over');
                }
              });
              bean.add(divOverviewButton, 'mouseout', function() {
                if (Util.hasClass(this, 'expanded')) {
                  Util.removeClass(this, 'npmap-overview-close-over');
                  Util.addClass(this, 'npmap-overview-close');
                } else {
                  Util.removeClass(this, 'npmap-overview-open-over');
                  Util.addClass(this, 'npmap-overview-open');
                }
              });
              
              /*
              Microsoft.Maps.Events.addHandler(overviewMap, 'viewchangeend', function() {
                NPMap.bing.map.Map.setView({
                  center: overviewMap.getCenter()
                });
              });
              */
              
              Event.add('NPMap.Map', 'viewchanged', function(e) {
                updateOverviewMap();
              });
            }
          });
        }

        if (NPMap.config.baseLayers && NPMap.config.baseLayers.length > 1) {
          /*
          var divSwitcher = document.createElement('div'),
              divSwitcherMenu = document.createElement('div');

          // TODO: Write this yourself.
          (function(b){var d=function(){b(".jdropdown-menu").css({display:"none"});b(".jdropdown-anchor").removeClass("jdropdown-active");b(this).trigger("jdropdown.close")},f={init:function(a){return this.each(function(){var c=b(this),e=c.data("items");c.data("jdropdown")||(b(a.container).addClass("jdropdown-menu"),b(this).addClass("jdropdown-anchor").data("jdropdown",{items:"object"===typeof e?e:a.items,anchor:b(this),menu:b(a.container),options:a}).on({click:h}));return this})},destroy:function(){}},h=function(a){a.preventDefault();
          if(b(this).hasClass("jdropdown-active"))d();else{d();var a=b(this).data("jdropdown"),c=b(this).position(),e=a.menu;e.data("jdropdown",a).empty();(b.isFunction(a.renderMenu)?b.isFunction(a.renderItem)?a.renderItem(a.renderMenu(),a.items):g(a.renderMenu(),a.items):b.isFunction(a.renderItem)?a.renderItem(b("<ul></ul>"),a.items):g(b("<ul></ul>"),a.items)).appendTo(e);"left"==a.options.orientation?a.menu.css({display:"block",left:c.left,position:"absolute",top:c.top+b(this).outerHeight()}):a.menu.css({display:"block",
          left:c.left-e.outerWidth()+b(this).outerWidth(),position:"absolute",top:c.top+b(this).outerHeight()});b(this).addClass("jdropdown-active").trigger("jdropdown.open")}},g=function(a,c){b.each(c,function(e,d){b("<li"+(e===c.length-1?"":' style="border-bottom:solid 1px #F2F1EF;"')+"></li>").data("jdropdown.item",d).append(b("<a></a>").attr({href:"javascript:void(0)","class":d["class"]}).html('<div style="color:#818177;height:28px;line-height:28px;vertical-align:middle;"><div style="float:left;text-align:center;width:35px;"><img src="'+
          d.icon+'" style="height:22px;margin-top:3px;" /></div><div style="float:right;width:105px;">'+d.label+"</div></div>").on({click:i})).appendTo(a)});return a},i=function(){d();b(this).trigger("jdropdown.selectItem")};b(document).on("click",function(a){a=b(a.target);!a.parents().hasClass("jdropdown-menu")&&!a.parents().hasClass("jdropdown-anchor")&&!a.hasClass("jdropdown-menu")&&!a.hasClass("jdropdown-anchor")&&d()});b.fn.jdropdown=function(a){if(f[a])return f[a].apply(this,Array.prototype.slice.call(arguments,
          1));if("object"===typeof a||!a)return f.init.apply(this,arguments)}})(jQuery);
          
          divSwitcher.className = 'npmap-switcher-dropdown';
          divSwitcher.id = 'npmap-switcher';
          divSwitcher.innerHTML = '<div id="npmap-switcher-dropdown-left"></div><div id="npmap-switcher-dropdown-icon"></div><div id="npmap-switcher-dropdown-text"></div><div id="npmap-switcher-dropdown-right"></div>';
          divSwitcherMenu.id = 'npmap-switcher-menu';
          
          elements.push({
            el: divSwitcher
          }, {
            el: divSwitcherMenu,
            func: function() {
              var activeIcon,
                  activeLabel,
                  items = [];
              
              function setIcon(url) {
                document.getElementById('npmap-switcher-dropdown-icon').innerHTML = '<img src="' + url + '" style="height:15px;margin-top:4.5px;" />';
              }
              function setLabel(text) {
                document.getElementById('npmap-switcher-dropdown-text').innerHTML = text.toUpperCase();
              }
              
              _.each(NPMap.config.baseLayers, function(baseLayer) {
                var icon = NPMap.config.server + '/resources/img/tools/switcher/aerial-large.png', // TODO: Specify generic icon url.
                    label = baseLayer.code,
                    match = NPMap.Map[NPMap.config.api].matchBaseLayer(baseLayer),
                    type = baseLayer.type;
                
                if (match) {
                  label = null;
                  
                  if (baseLayer.name) {
                    label = baseLayer.name;
                  } else if (match.name) {
                    label = match.name;
                  }
                  
                  type = match.type;
                  
                  switch (match.type) {
                    case 'Aerial':
                      if (!label) {
                        label = 'Aerial View';
                      }
                      
                      icon = NPMap.config.server + '/resources/img/tools/switcher/aerial-large.png';
                      
                      break;
                    case 'NPS':
                      if (!label) {
                        label = 'NPS View';
                      }
                      
                      icon = NPMap.config.server + '/resources/img/tools/switcher/nps-large.png';
                      
                      break;
                    case 'Street':
                      if (!label) {
                        label = 'Street View';
                      }
                      
                      icon = NPMap.config.server + '/resources/img/tools/switcher/street-large.png';
                      
                      break;
                    case 'Topo':
                      if (!label) {
                        label = 'Topo View';
                      }
                      
                      icon = NPMap.config.server + '/resources/img/tools/switcher/topo-large.png';
                      
                      break;
                  }
                } else {
                  if (baseLayer.icon) {
                    icon = baseLayer.icon;
                  }
                  
                  if (baseLayer.name) {
                    label = baseLayer.name;
                  }
                }
                
                if (typeof baseLayer.visible !== undefined && baseLayer.visible === true) {
                  activeIcon = icon;
                  activeLabel = label;
                }
                
                items.push({
                  baseLayer: baseLayer,
                  icon: icon,
                  label: label
                });
              });
              
              setIcon(activeIcon);
              setLabel(activeLabel);
              
              items.sort(function(a, b) {
                return a.label > b.label;
              });
              $('.npmap-switcher-dropdown').jdropdown({
                container: '#npmap-switcher-menu',
                items: items,
                orientation: 'right'
              });
              $(document).on('jdropdown.selectItem', '#npmap-switcher-menu a', function(e, event) {
                var data = $(this).parent().data('jdropdown.item');
                
                e.preventDefault();
                setIcon(data.icon.replace('large', 'small'));
                setLabel(data.label);
                NPMap.Map[NPMap.config.api].switchBaseLayer(data.baseLayer);
              });
            }
          });
          */
        }

        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];

          me.addElementToMapDiv(element.el, element.func);
        }

        var interval = setInterval(function() {
          if (NPMap.Map[NPMap.config.api] && NPMap.Map[NPMap.config.api]._isReady === true) {
            // TODO: Iterate through all child elements of #npmap-map and detect width and set InfoBox padding.

            Util.monitorResize(divMap, function() {
              setAttributionMaxWidthAndPosition();
              NPMap.Map.handleResize();
            });
            clearInterval(interval);
            Event.trigger('NPMap.Map', 'ready');
          }
        }, 250);
      });
    },
    /**
     * Adds an HTML element to the map div.
     * @param {Object} el
     * @param {Function} callback (Optional)
     * @param {Boolean} stopPropagation (Optiona)
     */
    addElementToMapDiv: function(el, callback, stopPropagation) {
      if (el.style.cssText.indexOf('z-index') === -1) {
        el.style.zIndex = '30';
      }

      NPMap.Map[NPMap.config.api].addElementToMapDiv(el);

      if (typeof stopPropagation === 'undefined' || stopPropagation === true) {
        Util.stopAllPropagation(el);
      }

      if (callback) {
        callback();
      }
    },
    /**
     * Adds an array of HTML elements to the map div.
     * @param {Array} els
     * @param {Function} callback (Optional)
     */
    addElementsToMapDiv: function(els, callback) {
      var me = this;

      for (var i = 0; i < els.length; i++) {
        me.addElementToMapDiv(els[i], callback);
      }
    },
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map. This can be a marker, line, or polygon object for the active baseApi.
     */
    addShape: function(shape) {
      NPMap.Map[NPMap.config.api].addShape(shape);
    },
    /**
     * Adds a tile layer to the map.
     * @param {Object} layer
     */
    addTileLayer: function(layer) {
      NPMap.Map[NPMap.config.api].addTileLayer(layer);
    },
    /**
     * Adds a Zoomify layer to the map.
     * @param {Object} layer
     */
    addZoomifyLayer: function(layer) {
      NPMap.Map[NPMap.config.api].addZoomifyLayer(layer);
    },
    /**
     * Converts an API bounds to a NPMap bounds.
     * @param {Object} bounds
     * @return {Object}
     */
    boundsFromApi: function(bounds) {
      return NPMap.Map[NPMap.config.api].boundsFromApi(bounds);
    },
    /**
     * Converts a NPMap bounds to an API bounds.
     * @param {Object}
     * @return {Object}
     */
    boundsToApi: function(bounds) {
      return NPMap.Map[NPMap.config.api].boundsToApi(bounds);
    },
    /**
     * Builds the attribution string for the visible layers.
     * @param {String} attribution An attribution string to add to the visible layer attribution.
     * @return {String}
     */
    buildAttributionStringForVisibleLayers: function(attribution) {
      var attr = [],
          me = this;
      
      if (attribution) {
        _.each(attribution.split('|'), function(v) {
          attr.push(v);
        });
      }
      
      _.each(me.getVisibleLayers(), function(v) {
        if (v.attribution) {
          _.each(v.attribution.split('|'), function(v2) {
            var credit = v2.replace(/^\s*/, '').replace(/\s*$/, '');

            if (_.indexOf(attr, credit) === -1) {
              attr.push(credit);
            }
          });
        }
      });

      if (attr.length > 0) {
        attr.sort();
        return attr.join(' | ');
      } else {
        return null;
      }
    },
    /**
     * Centers then zooms the map.
     * @param {Object} latLng The latLng object to center the map on.
     */
    center: function(latLng) {
      NPMap.Map[NPMap.config.api].center(NPMap.Map[NPMap.config.api].latLngToApi(latLng));
    },
    /**
     * Centers then zooms the map.
     * @param {String} latLng The latLng string, in "latitude,longitude" format, to center the map on.
     * @param {Integer} zoom The zoom level to zoom the map to.
     * @param {Function} callback (Optional) A callback function to call after the map has been centered and zoomed.
     */
    centerAndZoom: function(latLng, zoom, callback) {
      NPMap.Map[NPMap.config.api].centerAndZoom(NPMap.Map[NPMap.config.api].latLngToApi(latLng), zoom, callback);
    },
    /**
     * Creates a line using the baseApi's line class, if it exists.
     * @param {Array} latLngs An array of the latitude/longitude strings, in "latitude,longitude" format, to use to create the line.
     * @param {Object} options (Optional) Line options.
     */
    createLine: function(latLngs, options) {
      return NPMap.Map[NPMap.config.api].createLine(latLngs, NPMap.Map[NPMap.config.api].convertLineOptions(options));
    },
    /**
     * Creates a marker using the baseApi's marker class, if it exists.
     * @param {String} latLng The latitude/longitude string, in "latitude,longitude" format, to use to create the marker.
     * @param {Object} options (Optional) Marker options.
     */
    createMarker: function(latLng, options) {
      return this._createMarker(latLng, NPMap.Map[NPMap.config.api].convertMarkerOptions(options));
    },
    /**
     * Creates a polygon using the baseApi's marker class, if it exists.
     * @param {Array} latLngs An array of latitude/longitude strings, in "latitude,longitude" format, to use to create the polygon.
     * @param {Object} options (Optional) Polygon options.
     * @return {Object}
     */
    createPolygon: function(latLngs, options) {
      return NPMap.Map[NPMap.config.api].createPolygon(latLngs, NPMap.Map[NPMap.config.api].convertPolygonOptions(options));
    },
    /**
     * Creates a Zoomify layer.
     * @param {Object} config
     * @return {Object}
     */
    createZoomifyLayer: function(config) {
      return NPMap.Map[NPMap.config.api].createZoomifyLayer(config);
    },
    /**
     * Gets the active layer types for both baseLayers and layers.
     * @return {Array}
     */
    getActiveLayerTypes: function() {
      var types = [];
      
      if (NPMap.config.baseLayers) {
        for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
          var baseLayer = NPMap.config.baseLayers[i],
              baseLayerType = baseLayer.type;

          if ((typeof baseLayer.visible === 'undefined' || baseLayer.visible === true) && _.indexOf(types, baseLayerType) === -1) {
            types.push(baseLayerType);
          }
        }
      }

      if (NPMap.config.layers) {
        for (var j = 0; j < NPMap.config.layers.length; j++) {
          var layer = NPMap.config.layers[j],
              layerType = layer.type;

          if ((typeof layer.visible === 'undefined' || layer.visible === true) && _.indexOf(types, layerType) === -1) {
            types.push(layerType);
          }
        }
      }

      return types;
    },
    /**
     *
     */
    getBounds: function() {
      return this.boundsFromApi(NPMap.Map[NPMap.config.api].getBounds());
    },
    /**
     * Gets the center of the map.
     * @return {String}
     */
    getCenter: function() {
      return this.latLngFromApi(NPMap.Map[NPMap.config.api].getCenter());
    },
    /**
     * Gets the container div.
     */
    getContainerDiv: function() {
      return NPMap.Map[NPMap.config.api].getContainerDiv();
    },
    /**
     * Returns the layerConfig object for a layer.
     * @param {String} layerId The id of the layer to search for.
     * @param {Array} layers (Optional) The array of layers to search. If this is undefined or null, the NPMap.config.layers array will be searched.
     * @returns {Object}
     */
    getLayerById: function(layerId, layers) {
      if (!layers) {
        layers = NPMap.config.layers;
      }
      
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].id === layerId) {
          return layers[i];
        }
      }
    },
    /**
     * Returns the layerConfig object for a layer.
     * @param {String} layerName The name of the layer to search for.
     * @param {Array} layers (Optional) The array of layers to search. If this is undefined or null, the NPMap.config.layers array will be searched.
     * @return {Object}
     */
    getLayerByName: function(layerName, layers) {
      if (!layers) {
        layers = NPMap.config.layers;
      }
      
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].name === layerName) {
          return layers[i];
        }
      }
    },
    /**
     * Get the marker latitude and longitude, in "latitude,longitude" format.
     * @param {Object} marker
     * @return {String}
     */
    getMarkerLatLng: function(marker) {
      return this.latLngFromApi(NPMap.Map[NPMap.config.api].getMarkerLatLng(marker));
    },
    /**
     * Gets a marker option.
     * @param {Object} marker The baseApi marker object.
     * @param {String} option The option to get. Currently the valid options are: 'icon'.
     */
    getMarkerOption: function(marker, option) {
      return NPMap.Map[NPMap.config.api].getMarkerOption(marker, option);
    },
    /**
     * Gets the visibility property of a marker.
     * @param {Object} marker The marker to check the visibility for.
     */
    getMarkerVisibility: function(marker) {
      return NPMap.Map[NPMap.config.api].getMarkerVisibility(marker);
    },
    /**
     * Gets the maximum zoom level for this map.
     * @return {Number}
     */
    getMaxZoom: function() {
      return NPMap.Map[NPMap.config.api].getMaxZoom();
    },
    /**
     * Gets the minimum zoom level for this map.
     * @return {Number}
     */
    getMinZoom: function() {
      return NPMap.Map[NPMap.config.api].getMinZoom();
    },
    /**
     * Builds out an array of visible layers. Can filter out visible layers that have either grids or tiles, if the checkFor parameter is passed in.
     */
    getVisibleLayers: function() {
      var layers = [];

      if (NPMap.config.layers) {
        _.each(NPMap.config.layers, function(layer) {
          if (layer.visible) {
            layers.push(layer);
          }
        });
      }
    
      return layers;
    },
    /**
     * Gets the zoom level of the map.
     * @return {Number}
     */
    getZoom: function() {
      return NPMap.Map[NPMap.config.api].getZoom();
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     */
    handleResize: function() {
      if (typeof NPMap.Map[NPMap.config.api] !== 'undefined') {
        NPMap.Map[NPMap.config.api].handleResize();
      }
      
      if (NPMap.InfoBox.visible) {
        NPMap.InfoBox.reposition();
      }
    },
    /**
     * Checks to see if a clustered layer has been added to the map.
     * @return {Boolean}
     */
    hasClusteredLayer: function() {
      hasClustered = false;
      
      if (NPMap.config.layers) {
        for (var i = 0; i < NPMap.config.layers.length; i++) {
          var layer = NPMap.config.layers[i];

          if (layer.type === 'NativeVectors' && layer.clustered === true) {
            hasClustered = true;
            break;
          }
        }
      }
      
      return hasClustered;
    },
    /**
     * Checks to see if a tiled layer has been added to the map.
     * @return {Boolean}
     */
    hasTiledLayer: function() {
      hasTiled = false;
      
      if (NPMap.config.layers) {
        for (var i = 0; i < NPMap.config.layers.length; i++) {
          var layer = NPMap.config.layers[i];

          if ((layer.type === 'NativeVectors' && layer.tiled) || (layer.type === 'ArcGisServerRest' || layer.type === 'TileStream')) {
            hasTiled = true;
            break;
          }
        }
      }
      
      return hasTiled;
    },
    /**
     * Hides the progress bar.
     */
    hideProgressBar: function() {
      var divProgressBar = document.getElementById('npmap-progressbar');

      divProgressBar.childNodes[0].style.width = '100%';

      morpheus(divProgressBar, {
        complete: function() {
          divProgressBar.style.display = 'none';
          divProgressBar.style.opacity = 1;
        },
        duration: 1000,
        opacity: 0
      });
    },
    /**
     * Hides a shape.
     * @param {Object} shape The shape to hide.
     */
    hideShape: function(shape) {
      NPMap.Map[NPMap.config.api].hideShape(shape);
    },
    /**
     * Hides the tip.
     */
    hideTip: function() {
      var tip = document.getElementById('npmap-tip');

      if (tip) {
        tip.style.display = 'none';
      }
    },
    /**
     * Tests to see if a latLng is within the map's current bounds.
     * @param latLng {String} {Required} The latitude/longitude string, in "latitude,longitude" format, to test.
     * @return {Boolean}
     */
    isLatLngWithinMapBounds: function(latLng) {
      return NPMap.Map[NPMap.config.api].isLatLngWithinMapBounds(latLng);
    },
    /**
     * Tests the equivalency of two location strings.
     * @param {String} latLng1 The first latLng string.
     * @param {String} latLng2 The second latLng string.
     * @returns {Boolean}
     */
    latLngsAreEqual: function(latLng1, latLng2) {
      var areEqual = false;

      if ((latLng1.lat.toFixed(7) === latLng2.lat.toFixed(7)) && (latLng1.lng.toFixed(7) === latLng2.lng.toFixed(7))) {
        areEqual = true;
      }

      return areEqual;
    },
    /**
     * Converts a baseApi lat/lng object to a lat/lng string in "latitude/longitude" format.
     * @param {Object} latLng The lat/lng object.
     * @return {String}
     */
    latLngFromApi: function(latLng) {
      return NPMap.Map[NPMap.config.api].latLngFromApi(latLng);
    },
    /**
     * Converts a lat/lng string ("latitude/longitude") to a baseApi's latLng object.
     * @param {String} latLng The lat/lng string.
     * @return {Object}
     */
    latLngToApi: function(latLng) {
      return NPMap.Map[NPMap.config.api].latLngToApi(latLng);
    },
    /**
     * Turns meters into a zoom level. This function is not precise, as it is impossible to get precise meter scale values for the entire earth reprojected to web mercator. Only use this in cases where approximate numbers are acceptable.
     * @param {Number} meters
     * @return {Number}
     */
    metersToZoomLevel: function(meters) {
      var z;

      for (var i = 0; i < zoomScales.length; i++) {
        var zoom = zoomScales[i][0];
        
        if (meters >= zoomScales[i][1]) {
          if (zoomScales[i - 1]) {
            if (meters < zoomScales[i - 1][1]) {
              z = zoomScales[i + 1][0];
            }
          } else {
            z = zoom;
          }
        } else if (meters < zoomScales[zoomScales.length - 1][1]) {
          z = zoom;
        }
      }

      return z;
    },
    /**
     * Shows the notification.
     * @param {String} message
     * @param {String} title (Optional)
     * @param {String} type (Optional) Valid values are 'error', 'info', or 'success'.
     * @param {Number} interval (Optional)
     */
    notify: function(message, title, type, interval) {
      // TODO: This needs work. To see bug, show a bunch of notifications one after the other, wait for them to start hiding, then try to show some more.
      var height,
          msg = createNotify(message, title, type);

      msg.style.display = 'none';

      document.getElementById('npmap-notify').appendChild(msg);

      height = Util.getOuterDimensions(msg).height;
      interval = interval || 3000;
      msg.style.top = -height + 'px';
      msg.style.display = 'block';

      morpheus(msg, {
        complete: function() {
          setTimeout(function() {
            activeNotificationMessagesHeight = activeNotificationMessagesHeight - height;

            morpheus(activeNotificationMessages, {
              complete: function() {
                activeNotificationMessages.splice(activeNotificationMessages.indexOf(msg), 1);
                msg.parentNode.removeChild(msg);
              },
              duration: 100,
              top: '-=' + height + 'px'
            });
          }, interval);
        },
        duration: 400,
        top: activeNotificationMessagesHeight + 'px'
      });
      activeNotificationMessages.push(msg);

      activeNotificationMessagesHeight = activeNotificationMessagesHeight + height;
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     * @param {Function} callback (Optional)
     */
    panByPixels: function(pixels, callback) {
      NPMap.Map[NPMap.config.api].panByPixels(pixels, callback);
    },
    /**
     * Pans the map in a direction by a quarter of the current map viewport.
     * @param {String} direction The direction to pan the map in. Valid directions are 'east', 'north', 'south', and 'west'.
     */
    panInDirection: function(direction) {
      var divMapDimensions = Util.getOuterDimensions(divMap),
          h = divMapDimensions.height,
          me = this,
          w = divMapDimensions.width;

      switch (direction) {
        case 'east':
          me.panByPixels({
            x: - (w / 4),
            y: 0
          });
          break;
        case 'north':
          me.panByPixels({
            x: 0,
            y: h / 4
          });
          break;
        case 'south':
          me.panByPixels({
            x: 0,
            y: - (h / 4)
          });
          break;
        case 'west':
          me.panByPixels({
            x: w / 4,
            y: 0
          });
          break;
      }
    },
    /**
     * Removes a shape from the map.
     * @param {Object} shape The shape to remove from the map.
     */
    removeShape: function(shape) {
      NPMap.Map[NPMap.config.api].removeShape(shape);
    },
    /**
     * Sets the attribution string for the map.
     * @param {String} attribution
     */
    setAttribution: function(attribution) {
      var divAttribution = document.getElementById('npmap-attribution');

      if (divAttribution) {
        divAttribution.innerHTML = attribution;
      } else {
        var interval = setInterval(function() {
          divAttribution = document.getElementsByTagName('npmap-attribution');

          if (divAttribution) {
            clearInterval(interval);
            divAttribution.innerHTML = attribution;
          }
        }, 250);
      }
    },
    /**
     * Sets the map bounds.
     * @param {Object} bounds
     */
    setBounds: function(bounds) {
      NPMap.Map[NPMap.config.api].setBounds(bounds);
    },
    /**
     * Sets the map cursor.
     * @param {String} cursor
     */
    setCursor: function(cursor) {
      var div = this.getContainerDiv();

      if (div.style.cursor) {
        div.style.cursor.replace(/cursor:[^;]+/g, '');
      }

      div.style.cursor = cursor;
    },
    /**
     * Sets the initial center of the map. This initial center is stored with the map, and is used by the setInitialExtent method, among other things.
     * @param {Object} c
     */
    setInitialCenter: function(center) {
      NPMap.Map[NPMap.config.api].setInitialCenter(this.latLngToApi(center));
    },
    /**
     * Sets the initial zoom of the map. This initial zoom is stored with the map, and is used by the setInitialExtent method, among other things.
     * @param {Number} zoom
     */
    setInitialZoom: function(zoom) {
      NPMap.Map[NPMap.config.api].setInitialZoom(zoom);
    },
    /**
     * Sets a marker's options.
     * @param {Object} marker The baseApi marker object.
     * @param {Object} options The options to set. Currently the valid options are: 'class', 'icon', 'label', 'visible', and 'zIndex'.
     */
    setMarkerOptions: function(marker, options) {
      NPMap.Map[NPMap.config.api].setMarkerOptions(marker, options);
    },
    /**
     * Sets the notify target to an HTML element other than the map div. This can only be called after NPMap has been initialized.
     * @param {Object} target
     */
    setNotifyTarget: function(target) {
      target.appendChild(document.getElementById('npmap-notify'));
    },
    /**
     *
     */
    setZoomRestrictions: function(restrictions) {
      NPMap.Map[NPMap.config.api].setZoomRestrictions(restrictions);
    },
    /**
     * Shows the progress bar.
     * @param {Number} value (Optional) The value to start the progress bar at.
     */
    showProgressBar: function(value) {
      document.getElementById('npmap-progressbar').style.display = 'block';

      if (!value) {
        value = 0;
      }

      this.updateProgressBar(value);
    },
    /**
     * Shows a shape.
     * @param {Object} shape The shape to show.
     */
    showShape: function(shape) {
      NPMap.Map[NPMap.config.api].showShape(shape);
    },
    /**
     * Shows the tip.
     * @param {String} content
     * @param {Object} position
     */
    showTip: function(content, position) {
      var divMapDimensions = Util.getOuterDimensions(divMap),
          divTip = document.getElementById('npmap-tip');

      divTip.innerHTML = content;
      divTip.style.bottom = divMapDimensions.height - position.y + 'px';
      divTip.style.right = divMapDimensions.width - position.x + 'px';
      divTip.style.display = 'block';
    },
    /**
     * Toggles fullscreen mode on or off.
     */
    toggleFullScreen: function() {
      var baseApi = NPMap.Map[NPMap.config.api],
          currentCenter = baseApi.getCenter(),
          currentZoom = baseApi.getZoom(),
          divNpmap = document.getElementById('npmap');

      /*
      if (el.requestFullScreen || el.mozRequestFullScreen || el.webkitRequestFullScreen) {
        document.onfullscreenchange = function(e) {
          if (document.fullScreenElement || document.mozFullScreenElement || document.webkitFullScreenElement) {
            isFullScreen = true;
          } else {
            isFullScreen = false;
          }
        };

        if (isFullScreen) {
          if (el.cancelFullScreen) {
            el.cancelFullScreen();
          } else if (el.mozCancelFullScreen) {
            el.mozCancelFullScreen();
          } else {
            document.webkitCancelFullScreen();
          }

          isFullScreen = false;
        } else {
          if (el.requestFullScreen) {
            el.requestFullScreen();
          } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
          } else {
            el.webkitRequestFullScreen();
          }

          isFullScreen = true;
        }
      } else {
        */
        var dimensionsWindow = Util.getWindowDimensions(),
            divMask = document.getElementById('npmap-fullscreen-mask');
        
        if (NPMap.InfoBox.visible) {
          currentCenter = baseApi.latLngToApi(NPMap.InfoBox.latLng);
        }

        if (isFullScreen) {
          document.body.style.overflow = 'visible';

          Util.removeClass(divMap, 'npmap-fullscreen-map');

          divMap.style.height = '100%';
          divMap.style.width = '100%';

          divMapParent.appendChild(divMap);

          divMask.style.display = 'none';
          document.getElementById('npmap-infobox').style.zIndex = '999999';
        } else {
          if (!divMask) {
            var div = document.createElement('div');
            div.id = 'npmap-fullscreen-mask';
            document.body.appendChild(div);
            divMask = document.getElementById('npmap-fullscreen-mask');
          }

          document.body.style.overflow = 'hidden';
          divMask.style.display = 'block';
          
          divMap.addClass('npmap-fullscreen-map');
          divMap.style.height = dimensionsWindow.height + 'px';
          divMap.style.width = dimensionsWindow.width + 'px';

          divMask.appendChild(divMap);
          
          isFullScreen = true;
          document.getElementById('npmap-infobox').style.zIndex = '99999999999999';
        }
      //}
      
      baseApi.handleResize(function() {
        baseApi.centerAndZoom(currentCenter, currentZoom);
      });
    },


    /*
    handleModuleCloseClick: function() {
      console.log(0);

      NPMap.Map.toggleModule('search', false);
    },
    handleModuleTabClick: function(el) {
      NPMap.Map.toggleModule(el.id.replace('npmap-module-tab-', ''), true);
    },
    */


    /**
     * Toggles a module on or off.
     * @param {String} module
     * @param {Boolean} on
     */
    toggleModule: function(module, on) {
      /*
      console.log(module);
      
      var $module = $('#npmap-modules-' + module),
          $modules = $('#npmap-modules');

      if (on) {
        $('#npmap-modules-tabs').hide();
        $module.show();
        $modules.show();
        $('#npmap-map').css({
          left: $modules.outerWidth() + 'px'
        });
        $('#npmap-toolbar').css({
          left: $modules.outerWidth() + 'px'
        });
      } else {
        console.log('here');

        $modules.hide();
        $('#npmap-map').css({
          left: '0'
        });
        $('#npmap-toolbar').css({
          left: '0'
        });
        $module.hide();
        $('#npmap-modules-tabs').show();
      }
      */
    },
    /**
     * Zooms and/or pans the map to its initial extent.
     */
    toInitialExtent: function() {
      NPMap.Map[NPMap.config.api].toInitialExtent();
    },
    /**
     * DEPRECATED: Updates a marker's icon.
     * @param {Object} marker A baseApi marker object.
     * @param {String} icon The url of the new icon.
     */
    updateMarkerIcon: function(marker, icon) {
      NPMap.Map[NPMap.config.api].updateMarkerIcon(marker, icon);
    },
    /**
     * DEPRECATED: Updates a marker's label.
     * @param {Object} marker A baseApi marker object.
     * @param {String} label The new label string.
     */
    updateMarkerLabel: function(marker, label) {
      NPMap.Map[NPMap.config.api].updateMarkerLabel(marker, label);
    },
    /**
     * Updates the progress bar value.
     * @param {Number} value The value to update the progress bar with.
     */
    updateProgressBar: function(value) {
      document.getElementById('npmap-progressbar').childNodes[0].style.width = value + '%';
    },
    /**
     * Zooms the map to a zoom level.
     * @param {Number} zoom
     */
    zoom: function(zoom) {
      NPMap.Map[NPMap.config.api].zoom(zoom);
    },
    /**
     * Zooms the map in by one zoom level.
     */
    zoomIn: function() {
      NPMap.Map[NPMap.config.api].zoomIn();
    },
    /**
     * Zooms the map out by one zoom level.
     */
    zoomOut: function() {
      NPMap.Map[NPMap.config.api].zoomOut();
    },
    /**
     * Zooms the map to a bounding box.
     * @param {Object} bbox A bbox object with nw and se lat/lng strings.
     */
    zoomToBoundingBox: function(bbox) {
      NPMap.Map[NPMap.config.api].zoomToBoundingBox({
        nw: NPMap.Map[NPMap.config.api].latLngToApi(bbox.nw),
        se: NPMap.Map[NPMap.config.api].latLngToApi(bbox.se)
      });
    },
    /**
     * Zooms the map to a lat/lng.
     * @param {String} latLng The lat/lng string, in "latitude,longitude" format, to zoom the map to.
     */
    zoomToLatLng: function(latLng) {
      NPMap.Map[NPMap.config.api].zoomToLatLng(this.latLngToApi(latLng));
    },
    /**
     * Zooms the map to the extent of an array of lat/lng strings.
     * @param {Array} latLngs The array of lat/lng strings.
     */
    zoomToLatLngs: function(latLngs) {
      var apiLatLngs = [],
          me = this;
      
      _.each(latLngs, function(latLng) {
        apiLatLngs.push(me.latLngToApi(latLng));
      });
      
      NPMap.Map[NPMap.config.api].zoomToLatLngs(apiLatLngs);
    },
    /**
     * Zooms the map to the extent of an array of marker objects.
     * @param {Array} markers The array of marker objects.
     */
    zoomToMarkers: function(markers) {
      NPMap.Map[NPMap.config.api].zoomToMarkers(markers);
    }
  };
});