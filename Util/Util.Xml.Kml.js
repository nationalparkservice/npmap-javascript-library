define([
  'Util/Util.Xml'
], function(Util) {
  /**
   * https://github.com/tmcw/togeojson
   */
  var toGeoJSON={kml:function(s,n){function g(a,b){var c=a.getElementsByTagName(b);return c.length?c[0]:null}function h(a){return a.firstChild?a.firstChild.nodeValue:null}function t(a){a=a.replace(x,"").split(",");for(var b=0,c=[];b<a.length;b++)c[b]=parseFloat(a[b]);return c}function u(a){a=a.replace(y,"").split(z);for(var b=[],c=0;c<a.length;c++)b.push(t(a[c]));return b}function v(a){var b,c,e,l,d=[];if(g(a,"MultiGeometry"))return v(g(a,"MultiGeometry"));for(e=0;e<k.length;e++)if(c=a.getElementsByTagName(k[e]))for(l=0;l<c.length;l++)if(b=c[l],"Point"==k[e])d.push({type:"Point",coordinates:t(h(g(b,"coordinates")))});else if("LineString"==k[e])d.push({type:"LineString",coordinates:u(h(g(b,"coordinates")))});else if("Polygon"==k[e]){var f=b.getElementsByTagName("LinearRing"),j=[];for(b=0;b<f.length;b++)j.push(u(h(g(f[b],"coordinates"))));d.push({type:"Polygon",coordinates:j})}return d}function A(a){var b=v(a),c,e={};c=h(g(a,"name"));var d=h(g(a,"styleUrl")),f=h(g(a,"description"));a=g(a,"ExtendedData");if(!b.length)return!1;c&&(e.name=c);d&&p[d]&&(e.styleUrl=d,e.styleHash=p[d]);f&&(e.description=f);if(a){d=a.getElementsByTagName("Data");for(c=0;c<d.length;c++)e[d[c].getAttribute("name")]=h(g(d[c],"value"))}return[{type:"Feature",geometry:1===b.length?b[0]:{type:"GeometryCollection",geometries:b},properties:e}]}n=n||{};var q={type:"FeatureCollection",features:[]},p={},k=["Polygon","LineString","Point"],x=/\s*/g,y=/^\s*|\s*$/g,z=/\s+/,w=s.getElementsByTagName("Placemark"),f=s.getElementsByTagName("Style");if(n.styles)for(var j=0;j<f.length;j++){var B=p,C="#"+f[j].id,d;d=f[j].innerHTML;if(!d||!d.length)d=0;else{for(var r=0,m=0;r<d.length;r++)m=(m<<5)-m+d.charCodeAt(r)|0;d=m}B[C]=d.toString(16)}for(f=0;f<w.length;f++)q.features=q.features.concat(A(w[f]));return q}};

  return NPMap.Util.Xml.Kml = {
    toGeoJson: function(kml) {
      return toGeoJSON.kml(kml, {
        styles: true
      });
    }
  };
});