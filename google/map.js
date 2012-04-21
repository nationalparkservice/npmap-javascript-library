define([
  NPMap.config.server + '/map.js'
], function(core) {
  var 
      // The initially-active base layer.
      activeBaseLayer,
      // The current bounds of the map.
      bounds,
      // An array of the default base layers for the Google baseAPI.
      defaultBaseLayers = [{
        code: 'HYBRID',
        type: 'Aerial'
      },{
        code: 'ROADMAP',
        type: 'Street'
      },{
        code: 'SATELLITE',
        type: 'Aerial',
      },{
        code: 'TERRAIN',
        type: 'Topo'
      }],
      // Helps handle map single and double-click events.
      doubleClicked = false,
      // The initial bounds of the map.
      initialBounds,
      // Is there at least one clustered layer in the map?
      clustered = NPMap.Map.hasClusteredLayer(),
      // The initial center latitude/longitude of the map.
      initialCenter,
      // The initial zoom level of the map.
      initialZoom,
      // The map object.
      map,
      // The map config object.
      mapConfig,
      // The initial mapTypeId of the map.
      mapTypeId,
      // An array of mapTypeIds for the map.
      mapTypeIds = [],
      // The max zoom level for the map.
      max = 19,
      // The min zoom level for the map.
      min = 0,
      // The last zoom level.
      oldZoom,
      // An overlay object to use to convert points to latLngs and back.
      overlay = null,
      // Is there at least one tiled layer in the map?
      tiled = NPMap.Map.hasTiledLayer(),
      // What should NPMap use to set the initial center and zoom level?
      use = 'bbox';
  
  if (NPMap.config.center && NPMap.config.zoom) {
    use = 'centerAndZoom';
  }
  
  if (NPMap.config.baseLayers) {
    $.each(NPMap.config.baseLayers, function(i, v) {
      if (v.visible) {
        activeBaseLayer = v;
      }
      
      if (v.code === 'roadmap' || v.code === 'satellite' || v.code === 'terrain') {
        mapTypeIds.push(google.maps.MapTypeId[v.code.toUpperCase()]);
      } else {
        mapTypeIds.push(v.code);
      }
    });
  }
  
  if (activeBaseLayer) {
    if (activeBaseLayer.code === 'roadmap' || activeBaseLayer.code === 'satellite' || activeBaseLayer.code === 'terrain') {
      mapTypeId = google.maps.MapTypeId[activeBaseLayer.code.toUpperCase()]; 
    } else {
      mapTypeId = activeBaseLayer.code;
    }
  } else {
    activeBaseLayer = {
      code: 'terrain',
      visible: true
    };
    mapTypeId = google.maps.MapTypeId.TERRAIN;

    NPMap.config.baseLayers = [
      activeBaseLayer
    ];
  }
  
  mapConfig = {
    disableDefaultUI: true,
    draggable: (function() {
      if (NPMap.utils.doesPropertyExist(NPMap, 'NPMap.config.tools.mouse.draggable')) {
        return NPMap.config.tools.mouse.draggable;
      } else {
        return true;
      }
    })(),
    keyboardShortcuts: (function() {
      if (NPMap.utils.doesPropertyExist(NPMap, 'NPMap.config.tools.keyboard')) {
        return NPMap.config.tools.keyboard;
      } else {
        return true;
      }
    })(), 
    mapTypeControl: false,
    mapTypeId: mapTypeId,
    noClear: true,
    panControl: false,
    scaleControl: (function() {
      if (NPMap.utils.doesPropertyExist(NPMap, 'NPMap.config.tools.controls.scaleBar')) {
        if (NPMap.config.tools.controls.scaleBar === true) {
          mapConfig.scaleControlOptions = {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
            style: google.maps.ScaleControlStyle.DEFAULT
          };
        }

        return NPMap.config.tools.controls.scaleBar;
      } else {
        return false;
      }
    })(),
    scrollWheel: (function() {
      if (NPMap.utils.doesPropertyExist(NPMap, 'NPMap.config.tools.mouse.scrollWheel')) {
        return NPMap.config.tools.mouse.scrollWheel;
      } else {
        return true;
      }
    })(),
    streetViewControl: false,
    zoomControl: false
  };
  
  if (use === 'bbox') {
    initialBounds = new google.maps.LatLngBounds(new google.maps.LatLng(29.713, -111), new google.maps.LatLng(46.82, -79));
    map = new google.maps.Map(document.getElementById(NPMap.config.div), mapConfig);
    map.fitBounds(initialBounds);
  } else {
    initialCenter = new google.maps.LatLng(NPMap.config.center.lat, NPMap.config.center.lng);
    initialZoom = NPMap.config.zoom;
    mapConfig.center = initialCenter;
    mapConfig.zoom = initialZoom;
    map = new google.maps.Map(document.getElementById('npmap'), mapConfig);
  }
  
  $.each(NPMap.config.baseLayers, function(i, v) {
    if (v.code != 'roadmap' || v.code != 'satellite' || v.code != 'terrain') {
      map.mapTypes.set(v.code, new google.maps.StyledMapType(v.style, {
        alt: v.alt ? v.alt : null,
        name: v.name
      }));
    }
  });
  
  var interval = setInterval(function() {
    bounds = map.getBounds();
    
    if (bounds) {
      clearInterval(interval);
      
      var enableKeyDragZoom;
      
      (function() {
        // TODO: Make this configurable.
        // TODO: You can do better than this.
        /**
         * keydragzoom 2.0.6 - http://code.google.com/p/google-maps-utility-library-v3/source/browse/trunk/keydragzoom/
         */
        eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(B(){9 u=B(a){9 b;2q(a){1t"4k":b="3X";1u;1t"3x":b="2t";1u;1t"3i":b="38";1u;2X:b=a}Q b};9 t=B(h){9 b;9 a={};A(H.1I&&H.1I.1C){b=h.3t.1I.1C(h,"");A(b){a.F=P(b.2p,10)||0;a.1m=P(b.2i,10)||0;a.C=P(b.2P,10)||0;a.1n=P(b.2L,10)||0;Q a}}1e A(H.1x.1y){A(h.1y){a.F=P(u(h.1y.2p),10)||0;a.1m=P(u(h.1y.2i),10)||0;a.C=P(u(h.1y.2P),10)||0;a.1n=P(u(h.1y.2L),10)||0;Q a}}a.F=P(h.7["1E-F-G"],10)||0;a.1m=P(h.7["1E-1m-G"],10)||0;a.C=P(h.7["1E-C-G"],10)||0;a.1n=P(h.7["1E-1n-G"],10)||0;Q a};9 v={x:0,y:0};9 s=B(e){v.x=(1h H.1x.1O!=="1r"?H.1x.1O:H.26.1O);v.y=(1h H.1x.1N!=="1r"?H.1x.1N:H.26.1N)};s();9 q=B(e){9 a=0,1Z=0;e=e||1L.J;A(1h e.2F!=="1r"){a=e.2F;1Z=e.37}1e A(1h e.2Q!=="1r"){a=e.2Q+v.x;1Z=e.2Z+v.y}Q{C:a,F:1Z}};9 n=B(h){9 e=h.2k;9 g=h.2h;9 b=h.2g;4i(b!==R){A(b!==H.26&&b!==H.1x){e-=b.1O;g-=b.1N}9 m=b;9 f=m.2k;9 a=m.2h;A(!f&&!a&&1L.1C){9 d=H.1I.1C(m,R).42||H.1I.1C(m,R).41;A(d){A(1h d==="3Z"){9 c=d.3U(",");f+=P(c[4],10)||0;a+=P(c[5],10)||0}}}e+=f;g+=a;b=b.2g}Q{C:e,F:g}};9 o=B(a,b){A(a&&b){1c(9 x 3L b){A(b.3J(x)){a[x]=b[x]}}}Q a};9 r=B(h,a){A(1h a!=="1r"){h.7.1v=a}A(1h h.7.1v!=="1r"&&h.7.1v!==""){h.7.3H="3G(1v="+(h.7.1v*3E)+")"}};B S(a,d){9 b=6;9 c=13 E.D.3w();c.3v=B(){b.2w(a,d)};c.3r=B(){};c.3p=B(){};c.2u(a);6.1B=c}S.N.2w=B(a,c){9 i;9 b=6;6.K=a;c=c||{};6.19=c.3m||"1M";6.19=6.19.3j();6.T=t(6.K.14());6.8=[];1c(i=0;i<4;i++){6.8[i]=H.1P("29");6.8[i].3d=B(){};o(6.8[i].7,{28:"39",1v:0.25,2z:"32"});o(6.8[i].7,c.30);o(6.8[i].7,c.2Y);o(6.8[i].7,{1T:"23",2l:"2j",W:"1b"});A(6.19==="1M"){6.8[i].7.2W="1b"}r(6.8[i]);A(6.8[i].7.28==="2U"){6.8[i].7.28="2T";r(6.8[i],0)}6.K.14().2e(6.8[i])}6.1z=c.4g||11;6.2N=c.4b||"";6.1X=c.47||E.D.46.44;6.1W=c.43||13 E.D.2K(35,0);6.2f=c.40||R;6.2I=c.3Y||"3W"+(H.3V.3T==="3S:"?"s":"")+"://D.3R.3Q/3P/3O/1U/3N.3M";6.X=c.3K||13 E.D.2K(20,20);6.Z=c.3I||{};6.Z.1l=6.Z.1l||"2D 1F 2b 2C 2B";6.Z.1F=6.Z.1F||"2D 1l 2b 2C 2B";6.I=H.1P("29");o(6.I.7,{1E:"2t 3F #3D"});o(6.I.7,c.3B);o(6.I.7,{1T:"23",W:"1b"});r(6.I);6.K.14().2e(6.I);6.1d=t(6.I);6.2a=[E.D.J.1a(H,"3A",B(e){b.2y(e)}),E.D.J.1a(H,"3y",B(e){b.1R(e)}),E.D.J.1a(6.8[0],"1A",B(e){b.1D(e)}),E.D.J.1a(6.8[1],"1A",B(e){b.1D(e)}),E.D.J.1a(6.8[2],"1A",B(e){b.1D(e)}),E.D.J.1a(6.8[3],"1A",B(e){b.1D(e)}),E.D.J.1a(H,"1A",B(e){b.2x(e)}),E.D.J.1a(H,"3u",B(e){b.1Q(e)}),E.D.J.1a(H,"3s",B(e){b.2v(e)}),E.D.J.1a(1L,"3q",s)];6.Y=11;6.1K=11;6.1k=11;6.V=R;6.12=R;6.1s=R;6.15=R;6.27=R;6.1j=R;A(6.1z){6.L=6.2s(6.1W);A(6.2f!==R){6.L.3o=6.2f}6.K.1U[6.1X].3n(6.L);6.2r=6.K.1U[6.1X].1g-1}};S.N.2s=B(a){9 b;9 c;9 d=6;b=H.1P("29");b.3l=6.2N;b.7.1T="3k";b.7.2l="2j";b.7.M=6.X.M+"w";b.7.G=6.X.G+"w";b.1q=6.Z.1l;c=H.1P("3h");c.3g=6.2I;c.7.1T="23";c.7.C=-(6.X.G*2)+"w";c.7.F=0+"w";b.2e(c);b.3f=B(e){d.Y=!d.Y;A(d.Y){d.L.1p.7.C=-(d.X.G*0)+"w";d.L.1q=d.Z.1F;d.24=1f;E.D.J.1i(d,"2o")}1e{d.L.1p.7.C=-(d.X.G*2)+"w";d.L.1q=d.Z.1l;E.D.J.1i(d,"2n")}d.1Q(e)};b.3e=B(){d.L.1p.7.C=-(d.X.G*1)+"w"};b.3c=B(){A(d.Y){d.L.1p.7.C=-(d.X.G*0)+"w";d.L.1q=d.Z.1F}1e{d.L.1p.7.C=-(d.X.G*2)+"w";d.L.1q=d.Z.1l}};b.3z=B(){Q 11};o(b.7,{2z:"3b",3a:a.M+"w",3C:a.G+"w"});Q b};S.N.1S=B(e){9 a;e=e||1L.J;a=(e.36&&6.19==="1M")||(e.34&&6.19==="2A")||(e.33&&6.19==="2E");A(!a){2q(e.31){1t 16:A(6.19==="1M"){a=1f}1u;1t 17:A(6.19==="2E"){a=1f}1u;1t 18:A(6.19==="2A"){a=1f}1u}}Q a};S.N.2H=B(){9 c=6.27;A(c){9 b=6.1j;9 a=6.K.14();Q c.C>b.C&&c.C<(b.C+a.2m)&&c.F>b.F&&c.F<(b.F+a.2G)}1e{Q 11}};S.N.2c=B(){9 i;A(6.K&&6.Y&&6.2H()){9 d=6.K.14();6.1s=d.2m-(6.T.C+6.T.1n);6.15=d.2G-(6.T.F+6.T.1m);A(6.24){9 a=P(6.L.7.C,10)+6.1W.G;9 b=P(6.L.7.F,10)+6.1W.M;9 c=6.X.G;9 e=6.X.M;6.8[0].7.F="U";6.8[0].7.C="U";6.8[0].7.G=a+"w";6.8[0].7.M=6.15+"w";6.8[1].7.F="U";6.8[1].7.C=(a+c)+"w";6.8[1].7.G=(6.1s-(a+c))+"w";6.8[1].7.M=6.15+"w";6.8[2].7.F="U";6.8[2].7.C=a+"w";6.8[2].7.G=c+"w";6.8[2].7.M=b+"w";6.8[3].7.F=(b+e)+"w";6.8[3].7.C=a+"w";6.8[3].7.G=c+"w";6.8[3].7.M=(6.15-(b+e))+"w";1c(i=0;i<6.8.1g;i++){6.8[i].7.W="22"}}1e{6.8[0].7.C="U";6.8[0].7.F="U";6.8[0].7.G=6.1s+"w";6.8[0].7.M=6.15+"w";1c(i=1;i<6.8.1g;i++){6.8[i].7.G="U";6.8[i].7.M="U"}1c(i=0;i<6.8.1g;i++){6.8[i].7.W="22"}}}1e{1c(i=0;i<6.8.1g;i++){6.8[i].7.W="1b"}}};S.N.2y=B(e){A(6.K&&!6.Y&&6.1S(e)){6.1j=n(6.K.14());6.Y=1f;6.24=11;6.2c();E.D.J.1i(6,"2o")}A(6.1z&&6.1S(e)){6.L.7.W="1b"}};S.N.1H=B(e){9 a=q(e);9 p=13 E.D.1G();p.x=a.C-6.1j.C-6.T.C;p.y=a.F-6.1j.F-6.T.F;p.x=O.1o(p.x,6.1s);p.y=O.1o(p.y,6.15);p.x=O.1V(p.x,0);p.y=O.1V(p.y,0);Q p};S.N.1D=B(e){A(6.K&&6.Y){6.1j=n(6.K.14());6.1k=1f;6.V=6.12=6.1H(e);6.I.7.G=6.I.7.M="U";9 a=6.1B.21();9 b=a.2d(6.V);A(6.1z){6.L.7.W="1b"}E.D.J.1i(6,"2V",b)}};S.N.2x=B(e){6.1K=1f};S.N.1Q=B(e){6.27=q(e);A(6.1k){6.12=6.1H(e);9 c=O.1o(6.V.x,6.12.x);9 b=O.1o(6.V.y,6.12.y);9 f=O.1w(6.V.x-6.12.x);9 g=O.1w(6.V.y-6.12.y);9 d=O.1V(0,f-(6.1d.C+6.1d.1n));9 a=O.1V(0,g-(6.1d.F+6.1d.1m));6.8[0].7.F="U";6.8[0].7.C="U";6.8[0].7.G=c+"w";6.8[0].7.M=6.15+"w";6.8[1].7.F="U";6.8[1].7.C=(c+f)+"w";6.8[1].7.G=(6.1s-(c+f))+"w";6.8[1].7.M=6.15+"w";6.8[2].7.F="U";6.8[2].7.C=c+"w";6.8[2].7.G=f+"w";6.8[2].7.M=b+"w";6.8[3].7.F=(b+g)+"w";6.8[3].7.C=c+"w";6.8[3].7.G=f+"w";6.8[3].7.M=(6.15-(b+g))+"w";6.I.7.F=b+"w";6.I.7.C=c+"w";6.I.7.G=d+"w";6.I.7.M=a+"w";6.I.7.W="22";E.D.J.1i(6,"2b",13 E.D.1G(c,b+g),13 E.D.1G(c+f,b),6.1B.21())}1e A(!6.1K){6.1j=n(6.K.14());6.2c()}};S.N.2v=B(e){9 z;9 g=6;6.1K=11;A(6.1k){A((6.1H(e).x===6.V.x)&&(6.1H(e).y===6.V.y)){6.1R(e);Q}9 k=O.1o(6.V.x,6.12.x);9 f=O.1o(6.V.y,6.12.y);9 l=O.1w(6.V.x-6.12.x);9 b=O.1w(6.V.y-6.12.y);9 c=1f;A(c){k+=6.T.C;f+=6.T.F}9 m=6.1B.21();9 d=m.2d(13 E.D.1G(k,f+b));9 j=m.2d(13 E.D.1G(k+l,f));9 h=13 E.D.2S(d,j);z=6.K.2J();6.K.2R(h);A(6.K.2J()<z){6.K.4f(z)}9 a=m.2O(d);9 i=m.2O(j);A(c){a.x-=6.T.C;a.y-=6.T.F;i.x-=6.T.C;i.y-=6.T.F}6.I.7.C=a.x+"w";6.I.7.F=i.y+"w";6.I.7.G=(O.1w(i.x-a.x)-(6.1d.C+6.1d.1n))+"w";6.I.7.M=(O.1w(i.y-a.y)-(6.1d.F+6.1d.1m))+"w";4e(B(){g.I.7.W="1b"},4d);6.1k=11;6.1Q(e);E.D.J.1i(6,"4c",h);A(!6.1S(e)){6.1R(e)}}};S.N.1R=B(e){9 i;A(6.K&&6.Y){6.Y=11;A(6.1k){6.I.7.W="1b";6.1k=11}1c(i=0;i<6.8.1g;i++){6.8[i].7.W="1b"}A(6.1z){6.L.1p.7.C=-(6.X.G*2)+"w";6.L.1q=6.Z.1l;6.L.7.W=""}E.D.J.1i(6,"2n")}};E.D.1Y.N.4a=B(a){6.1J=13 S(6,a)};E.D.1Y.N.49=B(){9 i;9 d=6.1J;A(d){1c(i=0;i<d.2a.1g;++i){E.D.J.48(d.2a[i])}6.14().2M(d.I);1c(i=0;i<d.8.1g;i++){6.14().2M(d.8[i])}A(d.1z){6.1U[d.1X].4h(d.2r)}d.1B.2u(R);6.1J=R}};E.D.1Y.N.45=B(){Q 6.1J!==R};E.D.1Y.N.4j=B(){Q 6.1J}})();',62,269,'||||||this|style|veilDiv_|var|||||||||||||||||||||||px||||if|function|left|maps|google|top|width|document|boxDiv_|event|map_|buttonDiv_|height|prototype|Math|parseInt|return|null|DragZoom|borderWidths_|0px|startPt_|display|visualSize_|hotKeyDown_|visualTips_||false|endPt_|new|getDiv|mapHeight_||||key_|addDomListener|none|for|boxBorderWidths_|else|true|length|typeof|trigger|mapPosn_|dragging_|off|bottom|right|min|firstChild|title|undefined|mapWidth_|case|break|opacity|abs|documentElement|currentStyle|visualEnabled_|mousedown|prjov_|getComputedStyle|onMouseDown_|border|on|Point|getMousePoint_|defaultView|dragZoom_|mouseDown_|window|shift|scrollTop|scrollLeft|createElement|onMouseMove_|onKeyUp_|isHotKeyDown_|position|controls|max|visualPositionOffset_|visualPosition_|Map|posY||getProjection|block|absolute|activatedByControl_||body|mousePosn_|backgroundColor|div|listeners_|drag|setVeilVisibility_|fromContainerPixelToLatLng|appendChild|visualPositionIndex_|offsetParent|offsetTop|borderBottomWidth|hidden|offsetLeft|overflow|offsetWidth|deactivate|activate|borderTopWidth|switch|controlIndex_|initControl_|4px|setMap|onMouseUp_|init_|onMouseDownDocument_|onKeyDown_|cursor|alt|mode|zoom|Turn|ctrl|pageX|offsetHeight|isMouseOnMap_|visualSprite_|getZoom|Size|borderRightWidth|removeChild|visualClass_|fromLatLngToContainerPixel|borderLeftWidth|clientX|fitBounds|LatLngBounds|white|transparent|dragstart|MozUserSelect|default|veilStyle|clientY|paneStyle|keyCode|crosshair|ctrlKey|altKey||shiftKey|pageY|6px|gray|marginTop|pointer|onmouseout|onselectstart|onmouseover|onclick|src|img|thick|toLowerCase|relative|className|key|push|index|onRemove|scroll|draw|mouseup|ownerDocument|mousemove|onAdd|OverlayView|medium|keyup|ondragstart|keydown|boxStyle|marginLeft|736AFF|100|solid|alpha|filter|visualTips|hasOwnProperty|visualSize|in|png|dragzoom_btn|ftr|mapfiles|com|gstatic|https|protocol|split|location|http|2px|visualSprite|string|visualPositionIndex|WebkitTransform|MozTransform|visualPositionOffset|LEFT_TOP|keyDragZoomEnabled|ControlPosition|visualPosition|removeListener|disableKeyDragZoom|enableKeyDragZoom|visualClass|dragend|1000|setTimeout|setZoom|visualEnabled|removeAt|while|getDragZoomObject|thin'.split('|'),0,{}))

        enableKeyDragZoom = function() {
          map.enableKeyDragZoom({
            boxStyle: {
              border: '3px solid #cc9900'
            }
          });
        };
      })();
      
      function inEasternOrWesternHemisphere(lng) {
        if (lng < 0) {
          return 'western';
        } else {
          return 'eastern';
        }
      }
      
      if (!initialBounds) {
        initialBounds = map.getBounds();
      }
      
      if (!initialCenter) {
        initialCenter = map.getCenter();
      }
      
      if (!initialZoom) {
        initialZoom = map.getZoom();
      }
      
      if (NPMap.config.restrictToBoundingBox) {
        google.maps.event.addListener(map, 'center_changed', function() {
          if (!bounds.contains(map.getCenter())) {
            var c = map.getCenter(),
                lat = c.lat(),
                lng = c.lng(),
                maxX = bounds.getNorthEast().lng(),
                maxY = bounds.getNorthEast().lat(),
                minX = bounds.getSouthWest().lng(),
                minY = bounds.getSouthWest().lat();
            
            if (lng < minX) {
              lng = minX;
            }
            
            if (lng > maxX) {
              lng = maxX;
            }
            
            if (lat < minY) {
              lat = minY;
            }
            
            if (lat > maxY) {
              lat = maxY;
            }
            
            map.setCenter(new google.maps.LatLng(centerLat, centerLng));
          }
        });
      }
      
      /*
      if (NPMap.config.restrictZoom) {
        if (NPMap.config.restrictZoom.max) {
          var max;
      
          if (NPMap.config.restrictZoom.max === 'auto') {
            max = initialZoom;
          } else {
            max = NPMap.config.restrictZoom.max;
          }
           
          map.setOptions({
            maxZoom: max
          });
        }
        
        if (NPMap.config.restrictZoom.min) {
          var min;
          
          if (NPMap.config.restrictZoom.min === 'auto') {
            min = initialZoom;
          } else {
            min = NPMap.config.restrictZoom.min;
          }
          
          map.setOptions({
            minZoom: min
          });
        }
      }
      
      if (NPMap.config.restrictZoom) {
        max = NPMap.config.restrictZoom.max;
        
        if (NPMap.config.restrictZoom.min === 'auto') {
          min = initialZoom;
        } else {
          min = NPMap.config.restrictZoom.min;
        }
        
        google.maps.event.addListener(NPMap.google.map.Map, 'zoom_changed', function() {
          var currentZoom = NPMap.google.map.Map.getZoom();
          
          if (currentZoom < min) {
            NPMap.google.map.Map.setZoom(min);
          } else if (currentZoom > max) {
            NPMap.google.map.Map.setZoom(max);
          }
        });
      }
      */
      
      /*
      google.maps.event.addListener(NPMap.google.map.Map, 'center_changed', function() {
        var bounds = NPMap.google.map.Map.getBounds(),
            center = NPMap.google.map.Map.getCenter(),
            ne = bounds.getNorthEast(),
            sw = bounds.getSouthWest(),
            neHemisphere = inEasternOrWesternHemisphere(ne.lng()),
            swHemisphere = inEasternOrWesternHemisphere(sw.lng());
        
        if (swHemisphere === 'eastern' && neHemisphere === 'western') {
          var plus;
          
          if (sw.lng() > 0) {
             plus = 180 - sw.lng();
          } else {
             plus = 180 + sw.lng();
          }
          
          plus++;
          
          NPMap.google.map.Map.setCenter(new google.maps.LatLng(center.lat(), center.lng() + plus));
        }
      });
      */
      
      google.maps.event.addListener(map, 'center_changed', function() {
        if (NPMap.InfoBox.visible) {
          NPMap.InfoBox.reposition();
        }
      });
      google.maps.event.addListener(map, 'click', function(e) {
        doubleClicked = false;
        
        setTimeout(function() {
          if (!doubleClicked) {
            NPMap.Event.trigger('NPMap.Map', 'click', e);
          }
        }, 250);
      });
      google.maps.event.addListener(map, 'dblclick', function(e) {
        doubleClicked = true;
        NPMap.Event.trigger('NPMap.Map', 'doubleclick', e);
      });
      google.maps.event.addListener(map, 'drag', function() {
        if (NPMap.InfoBox.visible) {
          NPMap.InfoBox.reposition();
        }
      });
      google.maps.event.addListener(map, 'zoom_changed', function(e) {
        var zoom = map.getZoom();
        
        if (zoom != oldZoom) {
          if (zoom === max) {
            map.disableKeyDragZoom();
          } else {
            enableKeyDragZoom();
          }
          
          if (NPMap.InfoBox.visible) {
            if (clustered || tiled) {
              NPMap.InfoBox.hide();
            } else {
              NPMap.InfoBox.reposition();
            }
          }

          NPMap.Event.trigger('NPMap.Map', 'zoomchanged');
        }
        
        oldZoom = zoom;
      });
      
      var intHtml = setInterval(function() {
            var a = $('a[title="Click to see this area on Google Maps"]');
            
            if (a.length > 0) {
              var d = $(a.parent().next().children()[0]),
                  attribution = $(d).html();
              
              function setAttribution(attr) {
                NPMap.Map.setAttribution(attr);
              }
              
              clearInterval(intHtml);
              
              a.parent().hide();
              d.hide();
              
              setAttribution(attribution);
              
              intHtml = setInterval(function() {
                a = $(d).html();
                
                if (a !== attribution) {
                  setAttribution(a);
                  attribution = a;
                }
              }, 500)
            }
          }, 500),
          intOverlay = setInterval(function() {
            if (!overlay) {
              try {
                overlay = new google.maps.OverlayView();
                overlay.draw = function() {};
                overlay.setMap(map);
              } catch(e) {
                
              }
            } else {
              clearInterval(intOverlay);
            }
          }, 100);
      
      core.init();
      
      NPMap.google.map.isReady = true;
    }
  }, 5);
  
  NPMap.google = NPMap.google || {};

  return NPMap.google.map = {
    /**
     * Adds a base layer to the map.
     * @param baseLayer An object with code, name, and visible properties.
     */
    addBaseLayer: function(baseLayer) {
      if (baseLayer.visible) {
        NPMap.google.map.switchBaseLayer(baseLayer.code);
      }
      
      return baseLayer;
    },
    /**
     * Adds a shape to the map.
     * @param {Object} shape The shape to add to the map. This can be a google.maps.Marker, Polyline, Polygon, Rectangle, or Circle object.
     */
    addShape: function(shape) {
      shape.setMap(map);
    },
    /**
     * Zooms to the center and zoom provided. If zoom isn't provided, the map will zoom to level 17.
     * @param {google.maps.LatLng} latLng
     * @param {Number} zoom
     */
    centerAndZoom: function(latLng, zoom) {
      if (zoom) {
        map.setZoom(zoom);
      } else {
        map.setZoom(17);
      }
      
      map.setCenter(latLng);
    },
    /**
     * Creates a Microsoft.Maps.Polyline object.
     */
    createLine: function() {
    
    },
    /**
     * Creates a google.maps.Marker object.
     * @param latLng {google.maps.LatLng} (Required) Where to place the marker.
     * @param options {google.maps.MarkerOptions} (Optional) Any additional options to apply to the marker.
     * @param data {Object} (Optional) An object with key/value pairs of information that need to be stored with the marker. This object will be added to the marker.data property.
     * @param {Function} clickHandler (Optional) A function to call when the marker is clicked.
     * @return {Microsoft.Maps.Pushpin}
     */
    createMarker: function(latLng, options, data, clickHandler) {
      options = options || {};
      
      options.position = latLng;

      return new google.maps.Marker(options);
    },
    /**
     * Creates a google.maps.Polygon object.
     * @param latLngs {Array} (Required) An array of google.maps.LatLng objects.
     * @param options {google.maps.PolygonOptions} (Optional) Any additional options to apply to the polygon.
     * @param data {Object} (Optional) An object with key/value pairs of information that need to be stored with the polygon. This object will be added to the polygon.data property.
     * @param {Function} clickHandler (Optional) A function to call when the marker is clicked.
     * @return {google.maps.Polygon}
     */
    createPolygon: function(latLngs, options, data, clickHandler) {
      // TODO: Hookup clickHandler config.
      options = options || {};

      options.paths = latLngs;

      return new google.maps.Polygon(options);
    },
    /**
     * Gets the center {google.maps.LatLng} of the map.
     * @return {google.maps.LatLng}
     */
    getCenter: function() {
      return map.getCenter();
    },
    /**
     * Gets the latLng (google.maps.LatLng) of the #npmap-clickdot div element.
     * @return {google.maps.LatLng}
     */
    getClickDotLatLng: function() {
      var position = $('#npmap-clickdot').position();
      
      return this.getLatLngFromPixel(new google.maps.Point(position.left, position.top));
    },
    /**
     * Gets a {google.maps.LatLng} from a {google.maps.Point}.
     * @param {google.maps.Point} point
     * @return {google.maps.LatLng}
     */
    getLatLngFromPixel: function(point) {
      return overlay.getProjection().fromContainerPixelToLatLng(point);
    },
    /**
     * Gets the anchor of a marker.
     * @param {} (Required) The Pushpin to get the anchor for.
     * @return {Object} An object with x and y properties.
     */
    getMarkerAnchor: function(marker) {
      
    },
    /**
     * Gets the icon for a marker.
     */
    getMarkerIcon: function(marker) {
      
    },
    /**
     * Gets the latLng {google.maps.LatLng} of the marker.
     * @param {Object} marker The marker to get the latLng for.
     * @return {Object}
     */
    getMarkerLatLng: function(marker) {
      
    },
    /**
     * Returns the maximum zoom level for this map.
     * @return {Number}
     */
    getMaxZoom: function() {
      return max;
    },
    /**
     * Returns the minimum zoom level for this map.
     * @return {Number}
     */
    getMinZoom: function() {
      return min;
    },
    /**
     * Returns a google.maps.Point object for a given latLng.
     * @param latLng {google.maps.LatLng} (Required)
     */
    getPixelFromLatLng: function(latLng) {
      return overlay.getProjection().fromLatLngToContainerPixel(latLng);
    },
    /**
     * Gets the zoom level of the map.
     * @return {Float}
     */
    getZoom: function() {
      return map.getZoom();
    },
    /**
     * Handles any necessary sizing and positioning for the map when its div is resized.
     */
    handleResize: function() {
      google.maps.event.trigger(map, 'resize');
    },
    /**
     * Tests to see if a latLng is within the map's current bounds.
     * @param latLng {Object/String} {Required} The latitude/longitude, either a {google.maps.LatLng} object or a string in "latitude,longitude" format, to test.
     * @return {Boolean}
     */
    isLatLngWithinMapBounds: function(latLng) {
      return map.getBounds().contains(latLng);
    },
    isReady: false,
    /**
     * Tests the equivalency of two {google.maps.LatLng} objects.
     * @param latLng1 {google.maps.LatLng} (Required) The first Location object.
     * @param latLng2 {google.maps.LatLng) (Required) The second Location object.
     * @returns {Boolean}
     */
    latLngsAreEqual: function(latLng1, latLng2) {
      
    },
    /**
     * Converts a {google.maps.LatLng} object to the NPMap representation of a latitude/longitude string.
     * @param latLng {google.maps.LatLng} The object to convert to a string.
     * @return {String} A latitude/longitude string in "latitude,longitude" format.
     */
    latLngToString: function(latLng) {
      return latLng.lat() + ',' + latLng.lng();
    },
    Map: map,
    /**
     * Iterates through the default base layers and returns a match if it exists.
     * @param {Object} baseLayer The baseLayer object.
     * @return {Object}
     */
    matchBaseLayer: function(baseLayer) {
      for (var i = 0; i < defaultBaseLayers.length; i++) {
        if (defaultBaseLayers[i].code === baseLayer.code) {
          return defaultBaseLayers[i];
        }
      }
      
      return null;
    },
    /**
     * Pans the map horizontally and vertically based on the pixels passed in.
     * @param {Object} pixels
     */
    panByPixels: function(pixels) {
      if (pixels.x !== 0) {
        pixels.x = -pixels.x;
      }
      
      if (pixels.y !== 0) {
        pixels.y = -pixels.y;
      }
      
      map.panBy(pixels.x, pixels.y);
    },
    /**
     * Positions the #npmap-clickdot div on top of the pushpin, lat/lng object, or lat/lng string that is passed in.
     * @param {google.maps.Marker} OR {google.maps.LatLng} OR {String} to The Pushpin, Location, or latitude/longitude string to position the div onto.
     */
    positionClickDot: function(to) {
      var offset = NPMap.utils.getMapDivOffset(),
          pixel = this.getPixelFromLatLng((function() {
            var latLng = null;

            if (typeof(to) === 'string') {
              to = to.split(',');
              latLng = new google.maps.LatLng(parseFloat(to[0]), parseFloat(to[1]));
            } else {
              if (to.lat()) {
                latLng = to;
              } else {
                latLng = to.getPosition();
              }
            }
            
            return latLng;
          })());

      $('#npmap-clickdot').hide().css({
        left: pixel.x,
        top: pixel.y,
      }).show();
    },
    /**
     * A google.maps.MapCanvasProjection object.
     */
    projection: null,
    /**
     * Removes a shape to the map.
     * @param {Object} shape The shape to remove from the map. This can be a google.maps.Marker, Polyline, Polygon, Rectangle, or Circle object.
     */
    removeShape: function(shape) {
      shape.setMap(null);
    },
    /**
     * Sets the marker's icon.
     * @param {Object} marker
     * @param {String} The url of the marker icon.
     */
    setMarkerIcon: function(marker, url) {
      
    },
    /**
     * Converts a lat/lng string ("latitude/longitude") to a {google.maps.LatLng} object.
     * @param {String} latLng The lat/lng string.
     * @return {Object}
     */
    stringToLatLng: function(latLng) {
      var split = latLng.split(',');
      
      return new google.maps.LatLng(parseFloat(split[0]), parseFloat(split[1]));
    },
    /**
     * Switches the base map.
     * @param {Object} type The base layer to switch to. Currently only the default Google Maps base maps are supported here.
     */
    switchBaseLayer: function(baseLayer) {
      NPMap.google.map.Map.setMapTypeId(google.maps.MapTypeId[baseLayer.code.toUpperCase()]);
    },
    /**
     * Zooms the map in by one zoom level.
     * @param toDot {Boolean} (Optional) If true, center and zoom will be called. Center is based on #npmap-clickdot location.
     */
    zoomIn: function(toDot) {
      if (toDot) {
        var position = $('#npmap-clickdot').position(),
            latLng = NPMap.google.map.projection.fromContainerPixelToLatLng(new google.maps.Point(position.left, position.top));
        
        NPMap.google.map.centerAndZoom(latLng.lat() + ',' + latLng.lng(), map.getZoom() + 1);
      } else {
        map.setZoom(map.getZoom() + 1);
      }
    },
    /**
     * Zooms the map out by one zoom level.
     */
    zoomOut: function() {
      map.setZoom(map.getZoom() - 1);
    },
    /**
     * Set the center and then zoom level of the map back to the initial extent. The initial extent is automatically set when the map loads, but NPMap.google.map.initialCenter and NPMap.google.map.initialZoom can be overriden at anytime.
     */
    zoomToExtent: function() {
      map.setCenter(NPMap.google.map.initialCenter);
      map.setZoom(NPMap.google.map.initialZoom);
    },
    /**
     * Zooms the map to its initial extent.
     */
    zoomToInitialExtent: function() {
      this.centerAndZoom(initialCenter, initialZoom);
    },
    /**
     * Zooms the map to a lat/lng.
     * @param {Object} latLng The {google.maps.LatLng} object to zoom the map to.
     */
    zoomToLatLng: function(latLng) {
      this.centerAndZoom(latLng, 16);
    },
    /**
     * Zooms the map to the extent of an array of lat/lng objects.
     * @param {Array} latLngs The array of google.maps.LatLng objects.
     */
    zoomToLatLngs: function(latLngs) {
      var bounds = new google.maps.LatLngBounds();

      $.each(latLngs, function(i, v) {
        bounds.extend(v);
      });

      map.fitBounds(bounds);
    }
  };
});