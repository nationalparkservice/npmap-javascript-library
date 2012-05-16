define([
  '../../layers/tilestream.js'
], function(tilestream) {
  // TODO: You should only add the portions of Wax that you're using.
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
  "ins::cite":0,"q::cite":0},ltypes:{UNSANDBOXED:2,SANDBOXED:1,DATA:0},LOADERTYPES:{"a::href":2,"area::href":2,"blockquote::cite":2,"body::background":1,"del::cite":2,"form::action":2,"img::src":1,"input::src":1,"ins::cite":2,"q::cite":2}},html=function(b){function a(a,b){var c;c=h(b);if(j.hasOwnProperty(c))c=j[c];else{var e=c.match(k);c=e?String.fromCharCode(parseInt(e[1],10)):(e=c.match(m))?String.fromCharCode(parseInt(e[1],16)):""}return c}function c(b){return b.replace(n,a)}function e(a){return a.replace(o,
  "&amp;").replace(s,"&lt;").replace(r,"&gt;").replace(x,"&#34;").replace(t,"&#61;")}function d(a){return a.replace(q,"&amp;$1").replace(s,"&lt;").replace(r,"&gt;")}function f(a){return function(e,f){var e=""+e,g=null,j=!1,l=[],o=void 0,m=void 0,k=void 0;for(a.startDoc&&a.startDoc(f);e;){var n=e.match(j?v:u),e=e.substring(n[0].length);if(j)if(n[1]){var r=h(n[1]);if(n[2]){n=n[3];switch(n.charCodeAt(0)){case 34:case 39:n=n.substring(1,n.length-1)}n=c(n.replace(p,""))}else n=r;l.push(r,n)}else{if(n[4]){void 0!==
  m&&(k?a.startTag&&a.startTag(o,l,f):a.endTag&&a.endTag(o,f));if(k&&m&(b.eflags.CDATA|b.eflags.RCDATA)&&(g=null===g?h(e):g.substring(g.length-e.length),j=g.indexOf("</"+o),0>j&&(j=e.length),j))m&b.eflags.CDATA?a.cdata&&a.cdata(e.substring(0,j),f):a.rcdata&&a.rcdata(d(e.substring(0,j)),f),e=e.substring(j);o=m=k=void 0;l.length=0;j=!1}}else n[1]?a.pcdata&&a.pcdata(n[0],f):n[3]?(k=!n[2],j=!0,o=h(n[3]),m=b.ELEMENTS.hasOwnProperty(o)?b.ELEMENTS[o]:void 0):n[4]?a.pcdata&&a.pcdata(n[4],f):n[5]&&a.pcdata&&
  (r=n[5],a.pcdata("<"===r?"&lt;":">"===r?"&gt;":"&amp;",f))}a.endDoc&&a.endDoc(f)}}function g(a){var c,d;return f({startDoc:function(){c=[];d=!1},startTag:function(f,g,h){if(!d&&b.ELEMENTS.hasOwnProperty(f)){var j=b.ELEMENTS[f];if(!(j&b.eflags.FOLDABLE))if(j&b.eflags.UNSAFE)d=!(j&b.eflags.EMPTY);else if(g=a(f,g)){j&b.eflags.EMPTY||c.push(f);h.push("<",f);f=0;for(j=g.length;f<j;f+=2){var l=g[f],o=g[f+1];null!==o&&void 0!==o&&h.push(" ",l,'="',e(o),'"')}h.push(">")}}},endTag:function(a,e){if(d)d=!1;
  else if(b.ELEMENTS.hasOwnProperty(a)){var f=b.ELEMENTS[a];if(!(f&(b.eflags.UNSAFE|b.eflags.EMPTY|b.eflags.FOLDABLE))){if(f&b.eflags.OPTIONAL_ENDTAG)for(f=c.length;0<=--f;){var g=c[f];if(g===a)break;if(!(b.ELEMENTS[g]&b.eflags.OPTIONAL_ENDTAG))return}else for(f=c.length;0<=--f&&c[f]!==a;);if(!(0>f)){for(var h=c.length;--h>f;)g=c[h],b.ELEMENTS[g]&b.eflags.OPTIONAL_ENDTAG||e.push("</",g,">");c.length=f;e.push("</",a,">")}}}},pcdata:function(a,b){d||b.push(a)},rcdata:function(a,b){d||b.push(a)},cdata:function(a,
  b){d||b.push(a)},endDoc:function(a){for(var b=c.length;0<=--b;)a.push("</",c[b],">");c.length=0}})}var h;h=function(a){return a.toLowerCase()};var j={lt:"<",gt:">",amp:"&",nbsp:"\u00a0",quot:'"',apos:"'"},l=/^(?:https?|mailto|data)$/i,k=/^#(\d+)$/,m=/^#x([0-9A-Fa-f]+)$/,p=/\0/g,n=/&(#\d+|#x[0-9A-Fa-f]+|\w+);/g,o=/&/g,q=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi,s=/</g,r=/>/g,x=/\"/g,t=/\=/g,v=RegExp("^\\s*(?:(?:([a-z][a-z-]*)(\\s*=\\s*(\"[^\"]*\"|'[^']*'|(?=[a-z][a-z-]*\\s*=)|[^>\"'\\s]*))?)|(/?>)|[\\s\\S][^a-z\\s>]*)",
  "i"),u=RegExp("^(?:&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);|<\!--[\\s\\S]*?--\>|<!\\w[^>]*>|<\\?[^>*]*>|<(/)?([a-z][a-z0-9]*)|([^<&>]+)|([<&>]))","i"),w=/^(?:([^:/?#]+):)?/;return{escapeAttrib:e,makeHtmlSanitizer:g,makeSaxParser:f,normalizeRCData:d,sanitize:function(a,c,e){var f=[];g(function(a,f){for(var d=0;d<f.length;d+=2){var g=f[d],h=f[d+1],j=null,o;if((o=a+"::"+g,b.ATTRIBS.hasOwnProperty(o))||(o="*::"+g,b.ATTRIBS.hasOwnProperty(o)))j=b.ATTRIBS[o];if(null!==j)switch(j){case b.atype.NONE:break;case b.atype.SCRIPT:case b.atype.STYLE:h=
  null;break;case b.atype.ID:case b.atype.IDREF:case b.atype.IDREFS:case b.atype.GLOBAL_NAME:case b.atype.LOCAL_NAME:case b.atype.CLASSES:h=e?e(h):h;break;case b.atype.URI:h=(g=(""+h).match(w))?!g[1]||l.test(g[1])?c&&c(h):null:null;break;case b.atype.URI_FRAGMENT:h&&"#"===h.charAt(0)?(h=e?e(h):h)&&(h="#"+h):h=null;break;default:h=null}else h=null;f[d+1]=h}return f})(a,f);return f.join("")},unescapeEntities:c}}(html4),html_sanitize=html.sanitize;
  "undefined"!==typeof window&&(window.html=html,window.html_sanitize=html_sanitize);html4.ATTRIBS["*::style"]=0;html4.ELEMENTS.style=0;
  var Mustache=function(){var b={},a=function(){};a.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":true},context:{},render:function(a,b,d,f){if(!f){this.context=b;this.buffer=[]}if(this.includes("",a)){var a=this.render_pragmas(a),g=this.render_section(a,b,d);g===false&&(g=this.render_tags(a,b,d,f));if(f)return g;this.sendLines(g)}else{if(f)return a;this.send(a)}},send:function(a){a!==""&&this.buffer.push(a)},sendLines:function(a){if(a)for(var a=a.split("\n"),
  b=0;b<a.length;b++)this.send(a[b])},render_pragmas:function(a){if(!this.includes("%",a))return a;var b=this,d=this.getCachedRegex("render_pragmas",function(a,b){return RegExp(a+"%([\\w-]+) ?([\\w]+=[\\w]+)?"+b,"g")});return a.replace(d,function(a,c,d){if(!b.pragmas_implemented[c])throw{message:"This implementation of mustache doesn't understand the '"+c+"' pragma"};b.pragmas[c]={};if(d){a=d.split("=");b.pragmas[c][a[0]]=a[1]}return""})},render_partial:function(a,b,d){a=this.trim(a);if(!d||d[a]===
  void 0)throw{message:"unknown_partial '"+a+"'"};return typeof b[a]!="object"?this.render(d[a],b,d,true):this.render(d[a],b[a],d,true)},render_section:function(a,b,d){if(!this.includes("#",a)&&!this.includes("^",a))return false;var f=this,g=this.getCachedRegex("render_section",function(a,b){return RegExp("^([\\s\\S]*?)"+a+"(\\^|\\#)\\s*(.+)\\s*"+b+"\n*([\\s\\S]*?)"+a+"\\/\\s*\\3\\s*"+b+"\\s*([\\s\\S]*)$","g")});return a.replace(g,function(a,c,g,k,m,p){var a=c?f.render_tags(c,b,d,true):"",p=p?f.render(p,
  b,d,true):"",n,k=f.find(k,b);g==="^"?n=!k||f.is_array(k)&&k.length===0?f.render(m,b,d,true):"":g==="#"&&(n=f.is_array(k)?f.map(k,function(a){return f.render(m,f.create_context(a),d,true)}).join(""):f.is_object(k)?f.render(m,f.create_context(k),d,true):typeof k==="function"?k.call(b,m,function(a){return f.render(a,b,d,true)}):k?f.render(m,b,d,true):"");return a+n+p})},render_tags:function(a,b,d,f){for(var g=this,h=function(){return g.getCachedRegex("render_tags",function(a,b){return RegExp(a+"(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?"+
  b+"+","g")})},j=h(),l=function(a,c,f){switch(c){case "!":return"";case "=":g.set_delimiters(f);j=h();return"";case ">":return g.render_partial(f,b,d);case "{":return g.find(f,b);default:return g.escape(g.find(f,b))}},a=a.split("\n"),k=0;k<a.length;k++){a[k]=a[k].replace(j,l,this);f||this.send(a[k])}if(f)return a.join("\n")},set_delimiters:function(a){a=a.split(" ");this.otag=this.escape_regex(a[0]);this.ctag=this.escape_regex(a[1])},escape_regex:function(a){if(!arguments.callee.sRE)arguments.callee.sRE=
  RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)","g");return a.replace(arguments.callee.sRE,"\\$1")},find:function(a,b){var a=this.trim(a),d;if(b[a]===false||b[a]===0||b[a])d=b[a];else if(this.context[a]===false||this.context[a]===0||this.context[a])d=this.context[a];return typeof d==="function"?d.apply(b):d!==void 0?d:""},includes:function(a,b){return b.indexOf(this.otag+a)!=-1},escape:function(a){return(""+(a===null?"":a)).replace(/&(?!\w+;)|["'<>\\]/g,function(a){switch(a){case "&":return"&amp;";
  case '"':return"&quot;";case "'":return"&#39;";case "<":return"&lt;";case ">":return"&gt;";default:return a}})},create_context:function(a){if(this.is_object(a))return a;var b=".";if(this.pragmas["IMPLICIT-ITERATOR"])b=this.pragmas["IMPLICIT-ITERATOR"].iterator;var d={};d[b]=a;return d},is_object:function(a){return a&&typeof a=="object"},is_array:function(a){return Object.prototype.toString.call(a)==="[object Array]"},trim:function(a){return a.replace(/^\s*|\s*$/g,"")},map:function(a,b){if(typeof a.map==
  "function")return a.map(b);for(var d=[],f=a.length,g=0;g<f;g++)d.push(b(a[g]));return d},getCachedRegex:function(a,e){var d=b[this.otag];d||(d=b[this.otag]={});var f=d[this.ctag];f||(f=d[this.ctag]={});(d=f[a])||(d=f[a]=e(this.otag,this.ctag));return d}};return{name:"mustache.js",version:"0.4.0-dev",to_html:function(b,e,d,f){var g=new a;if(f)g.send=f;g.render(b,e||{},d);if(!f)return g.buffer.join("\n")}}}();
  wax.attribution=function(){function b(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function a(a){return a}var c;return{content:function(e){if(typeof e==="undefined")return c.innerHTML;c.innerHTML=html_sanitize(e,b,a);return this},element:function(){return c},init:function(){c=document.createElement("div");c.className="wax-attribution";return this}}.init()};wax=wax||{};
  wax.bwdetect=function(b,a){function c(){wax.bw=-1;var a=new Image;a.src=f;var b=true,c=setTimeout(function(){if(b&&wax.bw==-1){e.bw(0);b=false}},d);a.onload=function(){if(b&&wax.bw==-1){clearTimeout(c);e.bw(1);b=false}}}var e={},d=b.threshold||400,f="http://a.tiles.mapbox.com/mapbox/1.0.0/blue-marble-topo-bathy-jul/0/0/0.png?preventcache="+ +new Date,g=1,h=b.auto===void 0?true:b.auto;e.bw=function(b){if(!arguments.length)return g;if(wax.bwlisteners&&wax.bwlisteners.length){listeners=wax.bwlisteners;
  wax.bwlisteners=[];for(i=0;i<listeners;i++)listeners[i](b)}wax.bw=b;g!=(g=b)&&a(b)};e.add=function(){h&&c();return this};if(wax.bw==-1){wax.bwlisteners=wax.bwlisteners||[];wax.bwlisteners.push(e.bw)}else wax.bw!==void 0?e.bw(wax.bw):e.add();return e};
  wax.formatter=function(b){function a(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function c(a){return a}var e={},d;if(b&&typeof b==="string")try{eval("f = "+b)}catch(f){console&&console.log(f)}else d=b&&typeof b==="function"?b:function(){};e.format=function(b,f){try{return html_sanitize(d(b,f),a,c)}catch(e){console&&console.log(e)}};return e};
  wax.gi=function(b,a){var a=a||{},c={},e=a.resolution||4,d=a.tileSize||256;c.grid_tile=function(){return b};c.getKey=function(a,c){if(b&&b.grid&&!(c<0||a<0))if(!(Math.floor(c)>=d||Math.floor(a)>=d)){var h=b.grid[Math.floor(c/e)].charCodeAt(Math.floor(a/e));h>=93&&h--;h>=35&&h--;return h-32}};c.gridFeature=function(a,c){var d=this.getKey(a,c),e=b.keys;if(e&&e[d]&&b.data[e[d]])return b.data[e[d]]};c.tileFeature=function(a,c,e){if(b){e=wax.u.offset(e);return feature=this.gridFeature(a-e.left,c-e.top)}};
  return c};
  wax.gm=function(){function b(a){typeof a==="string"&&(a=[a]);return function(b){if(b)if(b=/\/(\d+)\/(\d+)\/(\d+)\.[\w\._]+/.exec(b))return a[parseInt(b[2],10)%a.length].replace("{z}",b[1]).replace("{x}",b[2]).replace("{y}",b[3])}}var a=4,c={},e,d,f=function(a){return a.replace(/(\.png|\.jpg|\.jpeg)(\d*)/,".grid.json")};c.formatter=function(a){if(!arguments.length)return d;d=wax.formatter(a);return c};c.template=function(a){if(!arguments.length)return d;d=wax.template(a);return c};c.gridUrl=function(a){if(!arguments.length)return f;
  f=typeof a==="function"?a:b(a);return c};c.getGrid=function(b,e){var j=f(b);if(!d||!j)return e(null,null);wax.request.get(j,function(b,c){if(b)return e(b,null);e(null,wax.gi(c,{formatter:d,resolution:a}))});return c};c.tilejson=function(b){if(!arguments.length)return e;b.template?c.template(b.template):b.formatter&&c.formatter(b.formatter);b.grids&&c.gridUrl(b.grids);if(b.resolution)a=b.resolution;e=b;return c};return c};wax=wax||{};
  wax.hash=function(b){function a(){var a=b.getCenterZoom();if(c!==a){c=a;a=window.location;a.replace(a.toString().replace(a.hash,"#"+c))}}var b=b||{},c,e={},d=wax.u.throttle(a,500);e.add=function(){var e=location.hash.substring(1);if(e!==c){var g;b:{for(var e=(c=e).split("/"),h=0;h<e.length;h++){e[h]=Number(e[h]);if(isNaN(e[h])){g=true;break b}}e.length<3?g=true:e.length==3&&b.setCenterZoom(e)}g&&a()}b.bindChange(d);return this};e.remove=function(){b.unbindChange(d);return this};return e.add()};
  wax=wax||{};
  wax.interaction=function(){function b(a){for(var b=k(),c=0;c<b.length;c++)if(b[c][0]<a.y&&b[c][0]+256>a.y&&b[c][1]<a.x&&b[c][1]+256>a.x)return b[c][2];return false}function a(a){var b;if(h){window.clearTimeout(h);h=null;b=true}else b=false;if(!b){g=true;j=wax.u.eventoffset(a);if(a.type==="mousedown")bean.add(document.body,"mouseup",c);else if(a.type==="touchstart"&&a.touches.length===1){bean.fire(f,"off");bean.add(n(),s)}}}function c(a){var b={},d=wax.u.eventoffset(a);g=false;for(var f in a)b[f]=a[f];
  bean.remove(document.body,"mouseup",c);bean.remove(n(),s);a.type==="touchend"?e(a,j):Math.round(d.y/l)===Math.round(j.y/l)&&Math.round(d.x/l)===Math.round(j.x/l)&&(h=window.setTimeout(function(){h=null;e(b,d)},300));return c}function e(a,c){var e=b(c);e&&d.getGrid(e.src,function(b,g){if(!b&&g){var h=g.tileFeature(c.x,c.y,e);h&&bean.fire(f,"on",{parent:n(),data:h,formatter:d.formatter().format,e:a})}})}var d=wax.gm(),f={},g=false,h=false,j,l=4,k,m,p,n,o,q={mousemove:function(a){if(!g){var c=wax.u.eventoffset(a),
  e=b(c),h;e&&d.getGrid(e.src,function(b,g){if(!b&&g)(h=g.tileFeature(c.x,c.y,e))?bean.fire(f,"on",{parent:n(),data:h,formatter:d.formatter().format,e:a}):bean.fire(f,"off")})}},touchstart:a,mousedown:a},s={touchend:c,touchmove:c,touchcancel:function(){bean.remove(n(),s);g=false}};f.attach=function(a){if(!arguments.length)return m;m=a;return f};f.detach=function(a){if(!arguments.length)return p;p=a;return f};f.map=function(b){if(!arguments.length)return o;o=b;m&&m(o);bean.add(n(),q);bean.add(n(),"touchstart",
  a);return f};f.grid=function(a){if(!arguments.length)return k;k=a;return f};f.remove=function(){p&&p(o);bean.remove(n(),q);bean.fire(f,"remove");return f};f.tilejson=function(a){if(!arguments.length)return d.tilejson();d.tilejson(a);return f};f.formatter=function(){return d.formatter()};f.on=function(a,b){bean.add(f,a,b);return f};f.off=function(a,b){bean.remove(f,a,b);return f};f.gridmanager=function(a){if(!arguments.length)return d;d=a;return f};f.parent=function(a){n=a;return f};return f};
  var wax=wax||{};
  wax.legend=function(){function b(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function a(a){return a}var c,e={},d;e.element=function(){return d};e.content=function(d){if(!arguments.length)return c.innerHTML;if(d){c.innerHTML=html_sanitize(d,b,a);c.style.display="block"}else{c.innerHTML="";c.style.display="none"}return e};e.add=function(){d=document.createElement("div");d.className="wax-legends";c=d.appendChild(document.createElement("div"));c.className="wax-legend";c.style.display="none";return e};
  return e.add()};wax=wax||{};wax.movetip={};
  wax.movetip=function(){function b(a){a=wax.u.eventoffset(a);if(h.height+a.y>j.top+j.height&&j.height>h.height){a.y=a.y-h.height;l.className=l.className+" flip-y"}if(h.width+a.x>j.left+j.width){a.x=a.x-h.width;l.className=l.className+" flip-x"}l.style.left=a.x+"px";l.style.top=a.y+"px"}function a(a){var b=document.createElement("div");b.className="wax-tooltip wax-tooltip-0";b.innerHTML=a;return b}function c(){if(l){l.parentNode.removeChild(l);l=null}}function e(e){var d;if(!f){if(e.e.type==="mousemove"||
  !e.e.type){d=e.formatter({format:"teaser"},e.data);if(!d)return;c();k.style.cursor="pointer";l=document.body.appendChild(a(d))}else{d=e.formatter({format:"teaser"},e.data);if(!d)return;c();d=document.body.appendChild(a(d));d.className=d.className+" wax-popup";var g=d.appendChild(document.createElement("a"));g.href="#close";g.className="close";g.innerHTML="Close";f=true;l=d;h=wax.u.offset(l);j=wax.u.offset(k);b(e.e);bean.add(g,"click touchend",function(a){a.stop();c();f=false})}if(l){h=wax.u.offset(l);
  j=wax.u.offset(k);b(e.e)}}}function d(){k.style.cursor="default";f||c()}var f=false,g={},h,j,l,k;g.parent=function(a){if(!arguments.length)return k;k=a;return g};g.events=function(){return{on:e,off:d}};return g};wax=wax||{};
  wax.request={cache:{},locks:{},promises:{},get:function(b,a){if(this.cache[b])return a(this.cache[b][0],this.cache[b][1]);this.promises[b]=this.promises[b]||[];this.promises[b].push(a);if(!this.locks[b]){var c=this;this.locks[b]=true;reqwest({url:b+(~b.indexOf("?")?"&":"?")+"callback=grid",type:"jsonp",jsonpCallback:"callback",success:function(a){c.locks[b]=false;c.cache[b]=[null,a];for(a=0;a<c.promises[b].length;a++)c.promises[b][a](c.cache[b][0],c.cache[b][1])},error:function(a){c.locks[b]=false;
  c.cache[b]=[a,null];for(a=0;a<c.promises[b].length;a++)c.promises[b][a](c.cache[b][0],c.cache[b][1])}})}}};wax.template=function(b){function a(a){if(/^(https?:\/\/|data:image)/.test(a))return a}function c(a){return a}return{format:function(e,d){var f={},g;for(g in d)f[g]=d[g];e.format&&(f["__"+e.format+"__"]=true);return html_sanitize(Mustache.to_html(b,f),a,c)}}};wax||(wax={});
  wax.tilejson=function(b,a){reqwest({url:b+(~b.indexOf("?")?"&":"?")+"callback=grid",type:"jsonp",jsonpCallback:"callback",success:a,error:a})};wax=wax||{};wax.tooltip={};
  wax.tooltip=function(){function b(a){var b=document.createElement("div");b.className="wax-tooltip wax-tooltip-0";b.innerHTML=a;return b}function a(){this.parentNode&&this.parentNode.removeChild(this)}function c(){for(var b;b=j.pop();)if(g&&k){bean.add(b,k,a);b.className=b.className+" wax-fade"}else b.parentNode&&b.parentNode.removeChild(b)}function e(a){var e;if((a.e.type==="mousemove"||!a.e.type)&&!f){if((e=a.content||a.formatter({format:"teaser"},a.data))&&e!=l){c();m.style.cursor="pointer";j.push(m.appendChild(b(e)));
  l=e}}else{e=a.content||a.formatter({format:"full"},a.data);if(!e){a.e.type&&a.e.type.match(/touch/)&&(e=a.content||a.formatter({format:"teaser"},a.data));if(!e)return}c();m.style.cursor="pointer";a=m.appendChild(b(e));a.className=a.className+" wax-popup";e=a.appendChild(document.createElement("a"));e.href="#close";e.className="close";e.innerHTML="Close";f=true;j.push(a);bean.add(e,"click touchend",function(a){a.stop();c();f=false})}}function d(){m.style.cursor="default";l=null;f||c()}var f=false,
  g=false,h={},j=[],l,k,m;document.body.style["-webkit-transition"]!==void 0?k="webkitTransitionEnd":document.body.style.MozTransition!==void 0&&(k="transitionend");h.parent=function(a){if(!arguments.length)return m;m=a;return h};h.animate=function(a){if(!arguments.length)return g;g=a;return h};h.events=function(){return{on:e,off:d}};return h};wax=wax||{};
  wax.u={offset:function(b){var a=b.offsetWidth||parseInt(b.style.width,10),c=b.offsetHeight||parseInt(b.style.height,10),e=document.body,d=0,f=0,g=function(a){if(!(a===e||a===document.documentElement)){d=d+a.offsetTop;f=f+a.offsetLeft;if(a=a.style.transform||a.style.WebkitTransform||a.style.OTransform||a.style.MozTransform||a.style.msTransform)if(match=a.match(/translate\((.+)px, (.+)px\)/)){d=d+parseInt(match[2],10);f=f+parseInt(match[1],10)}else if(match=a.match(/translate3d\((.+)px, (.+)px, (.+)px\)/)){d=
  d+parseInt(match[2],10);f=f+parseInt(match[1],10)}else if(match=a.match(/matrix3d\(([\-\d,\s]+)\)/)){a=match[1].split(",");d=d+parseInt(a[13],10);f=f+parseInt(a[12],10)}else if(match=a.match(/matrix\(.+, .+, .+, .+, (.+), (.+)\)/)){d=d+parseInt(match[2],10);f=f+parseInt(match[1],10)}}};g(b);try{for(;b=b.offsetParent;)g(b)}catch(h){}d=d+e.offsetTop;f=f+e.offsetLeft;d=d+e.parentNode.offsetTop;f=f+e.parentNode.offsetLeft;b=document.defaultView?window.getComputedStyle(e.parentNode,null):e.parentNode.currentStyle;
  if(e.parentNode.offsetTop!==parseInt(b.marginTop,10)&&!isNaN(parseInt(b.marginTop,10))){d=d+parseInt(b.marginTop,10);f=f+parseInt(b.marginLeft,10)}return{top:d,left:f,height:c,width:a}},$:function(b){return typeof b==="string"?document.getElementById(b):b},indexOf:function(b,a){var c=Array.prototype.indexOf;if(b===null)return-1;var e;if(c&&b.indexOf===c)return b.indexOf(a);c=0;for(e=b.length;c<e;c++)if(b[c]===a)return c;return-1},keys:Object.keys||function(b){var a=Object.prototype.hasOwnProperty;
  if(b!==Object(b))throw new TypeError("Invalid object");var c=[],e;for(e in b)a.call(b,e)&&(c[c.length]=e);return c},eventoffset:function(b){if(!b)b=window.event;if(b.pageX||b.pageY)return{x:b.pageX,y:b.pageY};if(b.clientX||b.clientY){var a=document.documentElement,c=document.body,e=document.body.parentNode.currentStyle,d=parseInt(e.marginTop,10)||0,e=parseInt(e.marginLeft,10)||0;return{x:b.clientX+(a&&a.scrollLeft||c&&c.scrollLeft||0)-(a&&a.clientLeft||c&&c.clientLeft||0)+e,y:b.clientY+(a&&a.scrollTop||
  c&&c.scrollTop||0)-(a&&a.clientTop||c&&c.clientTop||0)+d}}if(b.touches&&b.touches.length===1)return{x:b.touches[0].pageX,y:b.touches[0].pageY}},limit:function(b,a,c){var e;return function(){var d=this,f=arguments,g=function(){e=null;b.apply(d,f)};c&&clearTimeout(e);if(c||!e)e=setTimeout(g,a)}},throttle:function(b,a){return this.limit(b,a,false)}};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.attribution=function(b,a){var a=a||{},c;return{element:function(){return c.element()},appendTo:function(a){wax.u.$(a).appendChild(c.element());return this},init:function(){c=wax.attribution();c.content(a.attribution);c.element().className="wax-attribution wax-mm";return this}}.init()};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.boxselector=function(b,a,c){function e(a){a=new MM.Point(a.clientX,a.clientY);a.x=a.x+(document.body.scrollLeft+document.documentElement.scrollLeft);a.y=a.y+(document.body.scrollTop+document.documentElement.scrollTop);for(var c=b.parent;c;c=c.offsetParent){a.x=a.x-c.offsetLeft;a.y=a.y-c.offsetTop}return a}function d(a){if(a.shiftKey){m=p=e(a);r=x=true;q.left=m.x+"px";q.top=m.y+"px";q.width=q.height=0;v(document,"mousemove",g);v(document,"mouseup",h);b.parent.style.cursor="crosshair";return MM.cancelEvent(a)}}
  function f(a){var b=e(a),c=parseInt(o.offsetLeft,10),d=parseInt(o.offsetTop,10),f=c+parseInt(o.offsetWidth,10),j=d+parseInt(o.offsetHeight,10);r=b.x-c<=t||f-b.x<=t;if((x=b.y-d<=t||j-b.y<=t)||r){m={x:b.x-c<f-b.x?f:c,y:b.y-d<j-b.y?j:d};p={x:b.x-c<f-b.x?c:f,y:b.y-d<j-b.y?d:j};v(document,"mousemove",g);v(document,"mouseup",h);return MM.cancelEvent(a)}}function g(a){var c=e(a);q.display="block";if(r){q.left=(c.x<m.x?c.x:m.x)+"px";q.width=Math.abs(c.x-m.x)-2*s+"px"}if(x){q.top=(c.y<m.y?c.y:m.y)+"px";q.height=
  Math.abs(c.y-m.y)-2*s+"px"}l(c,b.parent);return MM.cancelEvent(a)}function h(a){a=e(a);a=b.pointLocation(new MM.Point(r?a.x:p.x,x?a.y:p.y));l2=b.pointLocation(m);y.extent([new MM.Location(Math.max(a.lat,l2.lat),Math.min(a.lon,l2.lon)),new MM.Location(Math.min(a.lat,l2.lat),Math.max(a.lon,l2.lon))]);u(document,"mousemove",g);u(document,"mouseup",h);b.parent.style.cursor="auto"}function j(a){l(e(a),o)}function l(a,b){var c=parseInt(o.offsetLeft,10),e=parseInt(o.offsetTop,10),d=c+parseInt(o.offsetWidth,
  10),f=e+parseInt(o.offsetHeight,10),g="";a.y-e<=t?g="n":f-a.y<=t&&(g="s");a.x-c<=t?g=g+"w":d-a.x<=t&&(g=g+"e");g!==""&&(g=g+"-resize");b.style.cursor=g}function k(a){if(o&&w){var b=a.locationPoint(w[1]),c=a.locationPoint(w[0]),e=o.style;e.display="block";e.height="auto";e.width="auto";e.left=Math.max(0,c.x)+"px";e.top=Math.max(0,c.y)+"px";e.right=Math.max(0,a.dimensions.x-b.x)+"px";e.bottom=Math.max(0,a.dimensions.y-b.y)+"px"}}var m=null,p=null,n=typeof c==="function"?c:c.callback,o,q,s=0,r=false,
  x=false,t=5,v=MM.addEvent,u=MM.removeEvent,w,y={extent:function(a,c){if(!a)return w;w=[new MM.Location(Math.max(a[0].lat,a[1].lat),Math.min(a[0].lon,a[1].lon)),new MM.Location(Math.min(a[0].lat,a[1].lat),Math.max(a[0].lon,a[1].lon))];k(b);c||n(w)},add:function(a){o=o||document.createElement("div");o.id=a.parent.id+"-boxselector-box";o.className="boxselector-box";a.parent.appendChild(o);q=o.style;s=parseInt(window.getComputedStyle(o).borderWidth,10);v(a.parent,"mousedown",d);v(o,"mousedown",f);v(a.parent,
  "mousemove",j);a.addCallback("drawn",k);return this},remove:function(){b.parent.removeChild(o);u(b.parent,"mousedown",d);u(o,"mousedown",f);u(b.parent,"mousemove",j);b.removeCallback("drawn",k)}};return y.add(b)};wax=wax||{};wax.mm=wax.mm||{};wax._={};wax.mm.bwdetect=function(b,a){var a=a||{},c=a.jpg||".jpg70";wax._.bw_png=a.png||".png128";wax._.bw_jpg=c;return wax.bwdetect(a,function(a){wax._.bw=!a;for(a=0;a<b.layers.length;a++)b.getLayerAt(a).provider instanceof wax.mm.connector&&b.getLayerAt(a).setProvider(b.getLayerAt(a).provider)})};
  wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.fullscreen=function(b){function a(a){a&&a.stop();e?d.original():d.full()}function c(a,c){b.dimensions=new MM.Point(a,c);b.parent.style.width=Math.round(b.dimensions.x)+"px";b.parent.style.height=Math.round(b.dimensions.y)+"px";b.dispatchCallback("resized",b.dimensions)}var e=false,d={},f,g=document.body,h;d.add=function(){f=document.createElement("a");f.className="wax-fullscreen";f.href="#fullscreen";f.innerHTML="fullscreen";bean.add(f,"click",a);return this};d.full=function(){if(!e){e=true;
  h=[b.parent.offsetWidth,b.parent.offsetHeight];b.parent.className=b.parent.className+" wax-fullscreen-map";g.className=g.className+" wax-fullscreen-view";c(b.parent.offsetWidth,b.parent.offsetHeight)}};d.original=function(){if(e){e=false;b.parent.className=b.parent.className.replace(" wax-fullscreen-map","");g.className=g.className.replace(" wax-fullscreen-view","");c(h[0],h[1])}};d.appendTo=function(a){wax.u.$(a).appendChild(f);return this};return d.add(b)};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.hash=function(b){return wax.hash({getCenterZoom:function(){var a=b.getCenter(),c=b.getZoom(),e=Math.max(0,Math.ceil(Math.log(c)/Math.LN2));return[c.toFixed(2),a.lat.toFixed(e),a.lon.toFixed(e)].join("/")},setCenterZoom:function(a){b.setCenterZoom(new MM.Location(a[1],a[2]),a[0])},bindChange:function(a){b.addCallback("drawn",a)},unbindChange:function(a){b.removeCallback("drawn",a)}})};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.interaction=function(){function b(){a=true}var a=false,c,e,d=["zoomed","panned","centered","extentset","resized","drawn"];return wax.interaction().attach(function(a){if(!arguments.length)return e;e=a;for(var c=0;c<d.length;c++)e.addCallback(d[c],b)}).detach(function(){for(var a=0;a<d.length;a++)e.removeCallback(d[a],b)}).parent(function(){return e.parent}).grid(function(){var b=e.getLayerAt(0).levels[Math.round(e.getZoom())];if(a||!(c!==void 0&&c.length)){var d=e.getLayerAt(0).tiles,h=[],j;
  for(j in d)if(d[j].parentNode===b){var l=wax.u.offset(d[j]);h.push([l.top,l.left,d[j]])}c=h}return c})};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.latlngtooltip=function(b){function a(){console.log("here");f=true}function c(){f=false}function e(a){if(!a.shiftKey||f)d.parentNode===b.parent&&b.parent.removeChild(d);else{a=new MM.Point(a.clientX,a.clientY);a.x=a.x+(document.body.scrollLeft+document.documentElement.scrollLeft);a.y=a.y+(document.body.scrollTop+document.documentElement.scrollTop);for(var c=b.parent;c;c=c.offsetParent){a.x=a.x-c.offsetLeft;a.y=a.y-c.offsetTop}c=b.pointLocation(a);c=c.lat.toFixed(2)+", "+c.lon.toFixed(2);d.innerHTML=
  c;a.scale=a.width=a.height=1;a.x=a.x+10;MM.moveElement(d,a);b.parent.appendChild(d)}}var d,f=false;return{add:function(){MM.addEvent(b.parent,"mousemove",e);MM.addEvent(b.parent,"mousedown",a);MM.addEvent(b.parent,"mouseup",c);d=document.createElement("div");d.className="wax-latlngtooltip";return this},remove:function(){MM.removeEvent(b.parent,"mousemove",e);MM.removeEvent(b.parent,"mousedown",a);MM.removeEvent(b.parent,"mouseup",c);return this}}.add()};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.legend=function(b,a){var a=a||{},c;return{add:function(){c=wax.legend().content(a.legend||"");return this},content:function(a){a&&c.content(a.legend||"")},element:function(){return c.element()},appendTo:function(a){wax.u.$(a).appendChild(c.element());return this}}.add()};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.pointselector=function(b,a,c){function e(a){var a=wax.u.eventoffset(a),a=new MM.Point(a.x,a.y),c=parseFloat(MM.getStyle(document.documentElement,"margin-left")),d=parseFloat(MM.getStyle(document.documentElement,"margin-top"));if(!isNaN(c))a.x=a.x-c;if(!isNaN(d))a.y=a.y-d;for(c=b.parent;c;c=c.offsetParent){a.x=a.x-c.offsetLeft;a.y=a.y-c.offsetTop}return a}function d(a){for(var b=[],c=0;c<a.length;c++)b.push(new MM.Location(a[c].lat,a[c].lon));return b}function f(){new MM.Point(0,0);for(var a=
  0;a<p.length;a++){var c=b.locationPoint(p[a]);if(!p[a].pointDiv){p[a].pointDiv=document.createElement("div");p[a].pointDiv.className="wax-point-div";p[a].pointDiv.style.position="absolute";p[a].pointDiv.style.display="block";p[a].pointDiv.location=p[a];bean.add(p[a].pointDiv,"mouseup",function(){var c=p[a];return function(a){MM.removeEvent(b.parent,"mouseup",h);m.deleteLocation(c,a)}}());b.parent.appendChild(p[a].pointDiv)}p[a].pointDiv.style.left=c.x+"px";p[a].pointDiv.style.top=c.y+"px"}}function g(a){j=
  e(a);bean.add(b.parent,"mouseup",h)}function h(a){if(j){l=e(a);if(MM.Point.distance(j,l)<k){m.addLocation(b.pointLocation(j));n(d(p))}j=null}}var j=null,l=null,k=5,m={},p=[],n=typeof c==="function"?c:c.callback;m.addLocation=function(a){p.push(a);f();n(d(p))};m.locations=function(){return p};m.add=function(a){bean.add(a.parent,"mousedown",g);a.addCallback("drawn",f);return this};m.remove=function(a){bean.remove(a.parent,"mousedown",g);a.removeCallback("drawn",f);for(a=p.length-1;a>-1;a--)m.deleteLocation(p[a]);
  return this};m.deleteLocation=function(a,b){if(!b||confirm("Delete this point?")){a.pointDiv.parentNode.removeChild(a.pointDiv);p.splice(wax.u.indexOf(p,a),1);n(d(p))}};return m.add(b)};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.zoombox=function(b){function a(a){a=new MM.Point(a.clientX,a.clientY);a.x=a.x+(document.body.scrollLeft+document.documentElement.scrollLeft);a.y=a.y+(document.body.scrollTop+document.documentElement.scrollTop);for(var c=b.parent;c;c=c.offsetParent){a.x=a.x-c.offsetLeft;a.y=a.y-c.offsetTop}return a}function c(e){if(g){g=false;var e=a(e),e=b.pointLocation(e),f=b.pointLocation(j);b.setExtent([e,f]);h.style.display="none";MM.removeEvent(b.parent,"mousemove",d);MM.removeEvent(b.parent,"mouseup",
  c);b.parent.style.cursor="auto"}}function e(e){if(e.shiftKey&&!this.drawing){g=true;j=a(e);h.style.left=j.x+"px";h.style.top=j.y+"px";MM.addEvent(b.parent,"mousemove",d);MM.addEvent(b.parent,"mouseup",c);b.parent.style.cursor="crosshair";return MM.cancelEvent(e)}}function d(b){if(g){var c=a(b);h.style.display="block";h.style.left=c.x<j.x?c.x+"px":j.x+"px";h.style.width=Math.abs(c.x-j.x)+"px";h.style.top=c.y<j.y?c.y+"px":j.y+"px";h.style.height=Math.abs(c.y-j.y)+"px";return MM.cancelEvent(b)}}var f=
  {},g=false,h,j=null;f.add=function(a){h=h||document.createElement("div");h.id=a.parent.id+"-zoombox-box";h.className="zoombox-box";a.parent.appendChild(h);MM.addEvent(a.parent,"mousedown",e);return this};f.remove=function(){b.parent.removeChild(h);MM.removeEvent(b.parent,"mousedown",e)};return f.add(b)};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm.zoomer=function(b){var a=document.createElement("a");a.innerHTML="+";a.href="#";a.className="zoomer zoomin";bean.add(a,"mousedown dblclick",function(a){a.stop()});bean.add(a,"click",function(a){a.stop();b.zoomIn()},false);var c=document.createElement("a");c.innerHTML="-";c.href="#";c.className="zoomer zoomout";bean.add(c,"mousedown dblclick",function(a){a.stop()});bean.add(c,"click",function(a){a.stop();b.zoomOut()});return{add:function(b){b.addCallback("drawn",function(b){if(b.coordinate.zoom===
  b.coordLimits[0].zoom)c.className="zoomer zoomout zoomdisabled";else if(b.coordinate.zoom===b.coordLimits[1].zoom)a.className="zoomer zoomin zoomdisabled";else{a.className="zoomer zoomin";c.className="zoomer zoomout"}});return this},appendTo:function(b){wax.u.$(b).appendChild(a);wax.u.$(b).appendChild(c);return this}}.add(b)};wax=wax||{};wax.mm=wax.mm||{};
  wax.mm._provider=function(b){this.options={tiles:b.tiles,scheme:b.scheme||"xyz",minzoom:b.minzoom||0,maxzoom:b.maxzoom||22,bounds:b.bounds||[-180,-90,180,90]}};
  wax.mm._provider.prototype={outerLimits:function(){return[this.locationCoordinate(new MM.Location(this.options.bounds[0],this.options.bounds[1])).zoomTo(this.options.minzoom),this.locationCoordinate(new MM.Location(this.options.bounds[2],this.options.bounds[3])).zoomTo(this.options.maxzoom)]},getTile:function(b){if(!(coord=this.sourceCoordinate(b))||coord.zoom<this.options.minzoom||coord.zoom>this.options.maxzoom)return null;coord.row=this.options.scheme==="tms"?Math.pow(2,coord.zoom)-coord.row-1:
  coord.row;b=this.options.tiles[parseInt(Math.pow(2,coord.zoom)*coord.row+coord.column,10)%this.options.tiles.length].replace("{z}",coord.zoom.toFixed(0)).replace("{x}",coord.column.toFixed(0)).replace("{y}",coord.row.toFixed(0));wax._&&wax._.bw&&(b=b.replace(".png",wax._.bw_png).replace(".jpg",wax._.bw_jpg));return b}};MM&&MM.extend(wax.mm._provider,MM.MapProvider);wax.mm.connector=function(b){b=new wax.mm._provider(b);return new MM.Layer(b)};
  
  var count,
      countAdded = 0,
      interaction,
      tileJson;
      
  /**
   * Gets the number of visible TileStream layers.
   * @return {Number}
   */
  function getNumberOfVisibleTileStreamLayers() {
    c = 0;
    
    if (NPMap.config.baseLayers) {
      for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
        if (isVisibleAndTileStream(NPMap.config.baseLayers[i])) {
          c++;
        }
      }
    }
    
    if (NPMap.config.layers) {
      for (var i = 0; i < NPMap.config.layers.length; i++) {
        if (isVisibleAndTileStream(NPMap.config.layers[i])) {
          c++;
        }
      }
    }
    
    return c;
  }
  /**
   * Checks to see if a layer is visible and is of type 'TileStream'.
   * @param {Object} layer
   * @return {Boolean}
   */
  function isVisibleAndTileStream(layer) {
    return (layer.type === 'TileStream' && (typeof layer.visible === 'undefined' || layer.visible));
  }
  /**
   * Sets up interaction on the map.
   * @param {Object} tileJson The json config object to use to setup interaction.
   * @return {Object}
   */
  function setupInteraction(tileJson) {
    return wax.mm.interaction().map(NPMap.modestmaps.map.Map).tilejson(tileJson).on({
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
          case 'mouseup':
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
            var content;

            document.body.style.cursor = 'pointer';
            
            if (typeof NPMap.config.hover !== 'undefined') {
              content = NPMap.config.hover(data);
            }
            
            if (content) {
              NPMap.Map.showTip(content, position);
            }

            break;
        };
      },
      off: function() {
        document.body.style.cursor = 'auto';

        NPMap.Map.hideTip();
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
  
  count = getNumberOfVisibleTileStreamLayers();
  
  NPMap.modestmaps.layers = NPMap.modestmaps.layers || {};
  
  return NPMap.modestmaps.layers.TileStream = {
    /**
     * Add a TileStream layer to the map. No layerConfig parameter is passed in here, as TileStream layers are "aware" of each other, and must be processed together.
     */
    addLayer: function() {
      countAdded++;
      
      if (count === countAdded) {
        var url = 'http://api.tiles.mapbox.com/v3/';
        
        if (NPMap.config.baseLayers) {
          for (var i = 0; i < NPMap.config.baseLayers.length; i++) {
            var baseLayer = NPMap.config.baseLayers[i];
            
            if (isVisibleAndTileStream(baseLayer)) {
              url += baseLayer.id + ',';
            }
          }
        }
        
        if (NPMap.config.layers) {
          for (var i = 0; i < NPMap.config.layers.length; i++) {
            var layer = NPMap.config.layers[i];
            
            if (isVisibleAndTileStream(layer)) {
              url += layer.id + ',';
            }
          }
        }
        
        url = url.slice(0, url.length - 1);
        url += '.jsonp';
        
        reqwest({
          jsonpCallbackName: 'grid',
          success: function(data) {
            tileJson = data;
            
            // TODO: This index can come from the layer config too.
            NPMap.modestmaps.map.Map.insertLayerAt(0, new wax.mm.connector(tileJson));
            
            if (tileJson.grids) {
              interaction = setupInteraction(tileJson);
            }
          },
          type: 'jsonp',
          url: url
        });
      }
    },
    resetLayers: function(layers) {
      /*
      attribution = NPMap.Map.buildAttributionStringForVisibleLayers();
      grids = getVisibleLayersUrls('grids');
      tileJson = {
        maxzoom: maxZoom,
        minzoom: minZoom,
        scheme: 'xyz'
      };
      tiles = getVisibleLayersUrls('tiles');
      
      
      
      if (attribution) {
        NPMap.Map.setAttribution(attribution);
      }

      if (interaction) {
        interaction.off();
        interaction = null;
      }

      if (grids.length > 0) {
        var url = 'http://api.tiles.mapbox.com/v3/';

        $.each(NPMap.config.layers, function(i, v) {
          if (v.visible) {
            url += v.id + ',';
          }
        });

        url = url.slice(0, url.length - 1);
        url += '.jsonp';

        reqwest({
          jsonpCallbackName: 'grid',
          success: function(data) {
            NPMap.config.formatter = data.formatter;
            tileJson.formatter = data.formatter;
            tileJson.grids = grids;

            if (tiles.length > 0) {
              tileJson.tiles = tiles;
            }

            map.setLayerAt(0, new wax.mm.connector(tileJson));

            interaction = setupInteraction(data);
          },
          type: 'jsonp',
          url: url
        });
      } else {
        if (tiles.length > 0) {
          tileJson.tiles = tiles;
        }

        map.setLayerAt(0, new wax.mm.connector(tileJson));
      }
      */
    }
  };
});