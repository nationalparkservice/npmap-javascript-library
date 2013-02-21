define([
  'Util/Util.Xml'
], function(Util) {
  /**
   * https://github.com/nationalparkservice/togeojson
   */
  var toGeoJSON=function(){function g(b,a){var e=b.getElementsByTagName(a);return e.length?e[0]:null}function k(b){return b&&b.firstChild&&b.firstChild.nodeValue}function x(b){b=b.replace(u,"").split(",");for(var a=0,e=[];a<b.length;a++)e[a]=parseFloat(b[a]);return e}function y(b){b=b.replace(v,"").split(B);for(var a=[],e=0;e<b.length;e++)a.push(x(b[e]));return a}function z(){return{type:"FeatureCollection",features:[]}}var u=/\s*/g,v=/^\s*|\s*$/g,B=/\s+/;return t={kml:function(b,a){function e(b){var a,c,f,p,h=[];if(g(b,"MultiGeometry"))return e(g(b,"MultiGeometry"));for(f=0;f<l.length;f++)if(c=b.getElementsByTagName(l[f]))for(p=0;p<c.length;p++)if(a=c[p],"Point"==l[f])h.push({type:"Point",coordinates:x(k(g(a,"coordinates")))});else if("LineString"==l[f])h.push({type:"LineString",coordinates:y(k(g(a,"coordinates")))});else if("Polygon"==l[f]){var d=a.getElementsByTagName("LinearRing"),j=[];for(a=0;a<d.length;a++)j.push(y(k(g(d[a],"coordinates"))));h.push({type:"Polygon",coordinates:j})}return h}function q(a){var b=e(a),c,f={},d=k(g(a,"name"));c=k(g(a,"styleUrl"));var h=k(g(a,"description"));a=g(a,"ExtendedData");if(!b.length)return!1;d&&(f.name=d);c&&j[c]&&(f.styleUrl=c,f.styleHash=j[c]);h&&(f.description=h);if(a){d=a.getElementsByTagName("Data");h=a.getElementsByTagName("SimpleData");for(c=0;c<d.length;c++)f[d[c].getAttribute("name")]=k(g(d[c],"value"));for(c=0;c<h.length;c++)f[h[c].getAttribute("name")]=k(h[c])}return[{type:"Feature",geometry:1===b.length?b[0]:{type:"GeometryCollection",geometries:b},properties:f}]}a=a||{};var n=z(),j={},l=["Polygon","LineString","Point"],A=b.getElementsByTagName("Placemark"),m=b.getElementsByTagName("Style");if(a.styles)for(var r=0;r<m.length;r++){var u=j,v="#"+m[r].id,d;d=m[r].innerHTML;if(!d||!d.length)d=0;else{for(var w=0,s=0;w<d.length;w++)s=(s<<5)-s+d.charCodeAt(w)|0;d=s}u[v]=d.toString(16)}for(m=0;m<A.length;m++)n.features=n.features.concat(q(A[m]));return n},gpx:function(b){var a,e=b.getElementsByTagName("trk"),q=z();for(b=0;b<e.length;b++){a=e[b];var n=k(g(a,"name")),j=a.getElementsByTagName("trkpt"),l=[];for(a=0;a<j.length;a++)l.push([parseFloat(j[a].getAttribute("lon")),parseFloat(j[a].getAttribute("lat"))]);q.features.push({type:"Feature",properties:{name:n||""},geometry:{type:"LineString",coords:l}})}return q}}}();
  
  return NPMap.Util.Xml.Kml = {
    toGeoJson: function(kml) {
      return toGeoJSON.kml(kml, {
        styles: true
      });
    }
  };
});