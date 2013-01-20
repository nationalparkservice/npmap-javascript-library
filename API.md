<h1 id="notes">Notes</h1>
<ol>
  <li>NPMap is designed to be as simple and targeted as possible. It is comprised of simple JavaScript modules, and it does not support everything that full-featured mapping libraries support. That said, it does support even the most advanced cases by making the underlying classes and objects that are exposed via whichever <a href="http://www.nps.gov/npmap/support/library/base-apis/">base API</a> your map uses available.</li>
  <li>Module properties and methods that start with an underscore (i.e. <code>_zoomToLatLngs</code>) are considered private and may change at any time. <strong>Do not use them.</strong></li>
</ol>
<h1 id="specifications">Specifications</h1>
<p>By design, NPMap doesn't create or utilize traditional JavaScript classes. It, rather, uses simple objects and utility methods specific to whichever base API is being used by the map to convert objects to and from native base API objects.</p>
<p>These specifications document the structure of objects you'll see when interacting directly with NPMap's modules. If you are interacting with objects that aren't proxied through one of the NPMap modules, you'll need to take a look at the API docs for the <a href="http://www.nps.gov/npmap/support/library/base-apis/">base API</a> itself to see what the expected format is. Here are links to the API docs for each base API that NPMap supports:</p>
<ul>
  <li><a href="http://msdn.microsoft.com/en-us/library/gg427610.aspx">Bing</a></li>
  <li><a href="https://developers.google.com/maps/documentation/javascript/reference">Google</a></li>
  <li><a href="http://leafletjs.com/reference.html">Leaflet</a></li>
  <li><a href="https://github.com/stamen/modestmaps-js/wiki">Modest Maps</a></li>
</ul>
<h2 id="specifications-bounds">Bounds</h2>
<p>NPMap always expects and returns coordinates in Decimal Degrees.</p>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td style="width:50%;">Property</td>
      <td>Type</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>e</code></td>
      <td><code>{Number}</code></td>
    </tr>
    <tr>
      <td><code>n</code></td>
      <td><code>{Number}</code></td>
    </tr>
    <tr>
      <td><code>s</code></td>
      <td><code>{Number}</code></td>
    </tr>
    <tr>
      <td><code>w</code></td>
      <td><code>{Number}</code></td>
    </tr>
  </tbody>
</table>
<h2 id="specifications-latlng">LatLng</h2>
<p>NPMap always expects and returns coordinates in Decimal Degrees.</p>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td style="width:50%;">Property</td>
      <td>Type</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>lat</code></td>
      <td><code>{Number}</code></td>
    </tr>
    <tr>
      <td><code>lng</code></td>
      <td><code>{Number}</code></td>
    </tr>
  </tbody>
</table>
<h2 id="specifications-layer">Layer</h2>
<p>In NPMap, a layer object is really just a configuration object for either a baseLayer or layer that NPMap appends properties to and uses to manage the layer within the context of the map.</p>
<p>The properties that are defined on an individual layer object depend on the type of <a href="http://www.nps.gov/npmap/support/library/layer-handlers">layer handler</a> that the layer utilizes. There are, however, some properties that are used fairly consistently across the different types of layers that NPMap supports.</p>
<p>For "vector" layers (<code>GeoJson</code>, <code>Json</code>, <code>Kml</code>, <code>NativeVectors</code>, and <code>Xml</code>), the following properties are added to the layer config object:</p>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td>Property</td>
      <td>Type</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>identify</code></td>
      <td><code>{Object}</code></td>
      <td><p>An object with <code>'content'</code>, <code>'title'</code>, and optionally <code>'footer'</code> and <code>'cluster'</code> configs that are used by NPMap to configure the InfoBox display for this layer. If these configs aren't specified in the initial layer config object, NPMap will use the default display parameters to display information for an identify operation.</p></td>
    </tr>
    <tr>
      <td><code>shapes</code></td>
      <td><code>{Array}</code></td>
      <td><p>An array of the <a href="#specifications-shape">shapes</a> that have been added to the map for this layer.</p></td>
    </tr>
    <tr>
      <td><code>styleNpmap</code></td>
      <td><code>{Object}</code></td>
      <td><p>The set of marker, line, and polygon styles that will be used to style the shapes on the map. If the <code>style</code> config isn't specified in the layer config object, NPMap will utilize a set of default styles.</p>
    </tr>
  </tbody>
</table>
<p>For "raster" or "tiled" layers (<code>ArcGisServerRest</code>, <code>CartoDb</code>, <code>GoogleFusion</code>, <code>Tiled</code>, <code>TileStream</code>, and <code>Zoomify</code>), the following properties are added to the layer config object:</p>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td>Property</td>
      <td>Type</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>api</code></td>
      <td><code>{Object}</code></td>
      <td><p>The "native" layer object.</p></td>
    </tr>
    <tr>
      <td><code>identify</code></td>
      <td><code>{Object}</code></td>
      <td><p>An object with <code>'content'</code>, <code>'title'</code> and optionally <code>'footer'</code> and <code>'cluster'</code> configs that are used by NPMap to configure the InfoBox display for this layer. If these configs aren't specified in the initial layer config object, NPMap will use a set of default display parameters for click (identify) operations.</p></td>
    </tr>
  </tbody>
</table>
<h2 id="specifications-point">Point</h2>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td style="width:50%;">Property</td>
      <td>Type</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>x</code></td>
      <td><code>{Number}</code></td>
    </tr>
    <tr>
      <td><code>y</code></td>
      <td><code>{Number}</code></td>
    </tr>
  </tbody>
</table>
<h2 id="specifications-shape">Shape</h2>
<p>NPMap stores important metadata as a property on all the lines, markers, and polygons that it creates. It uses these metadata to make information about the shapes available via <code>click</code> and <code>mouseover</code> operations and various modules and tools.</p>
<p>All of the metadata that NPMap stores with a shape is contained in the <code>npmap</code> object, so if you have a reference to a <code>shape</code>, you can access the NPMap metadata via the <code>shape.npmap</code> property. This object contains the following properties:</p>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td style="width:50%;">Property</td>
      <td>Type</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>data</code></td>
      <td><code>{Object}</code></td>
    </tr>
    <tr>
      <td><code>layerName</code></td>
      <td><code>{String}</code></td>
    </tr>
    <tr>
      <td><code>layerType</code></td>
      <td><code>{String}</code></td>
    </tr>
    <tr>
      <td><code>type</code></td>
      <td><code>{String}</code></td>
    </tr>
  </tbody>
</table>
<h1 id="npmap.config">NPMap.config</h1>
<p>The <code>NPMap.config</code> object is used to set configuration properties that NPMap uses to build the map. You must create this object <strong>before</strong> loading the NPMap library into your web page.</p>
<h2 id="npmap.config-example">Example</h2>
<pre data-line="3-10"><code>var NPMap = NPMap || {};

NPMap.config = {
  center: {
    lat: 36,
    lng: -96
  },
  div: 'map',
  zoom: 4
};

(function() {
  var s = document.createElement('script');
  s.src = 'http://www.nps.gov/npmap/1.0.0/bootstrap.js';
  document.body.appendChild(s);
})();
</code></pre>
<h2 id="npmap.config-options">Options</h2>
<p>The following properties can be set in the <a href="#npmap.config"><code>NPMap.config</code></a> object. Note that the only required property is <code>NPMap.config.div</code>.</p>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td>Option</td>
      <td>Type</td>
      <td>Default</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>api</code></td>
      <td><code>{String}</code></td>
      <td><code>'bing'</code></td>
      <td><p>The base API to use for the web map.</p></td>
    </tr>
    <tr>
      <td><code>baseLayers</code></td>
      <td><code>{Array}</code></td>
      <td><code>null</code></td>
      <td><p>The baseLayers to add to the map. Only one baseLayer can be visible at a time. NPMap will iterate through the baseLayers {Array} and will add the first layer whose <code>visibility</code> property is either <code>undefined</code> or <code>true</code> to the map. The visible baseLayer always lives at the bottom of the map, or, in other words, at <code>z-index</code> of 0.</p></td>
    </tr>
    <tr>
      <td><code>center</code></td>
      <td><code>{Object}</code></td>
<td><pre><code>{
  lat: 36,
  lng: -96
}
</code></pre></td>
      <td><p>The latitude/longitude to initialize the map with. If this is <code>null</code> or missing either the <code>lat</code> or <code>lng</code> property, NPMap will default to the center of the continental United States.</p></td>
    </tr>
    <tr>
      <td><code>credentials</code></td>
      <td><code>{String}</code></td>
      <td><code>'nps'</code></td>
      <td><p>This property tells NPMap whether or not you are an NPS employee, contractor, or partner. If you are an NPS employee, you do not need to specify this property. If you are not and you are using either the <code>bing</code> or <code>google</code> base API, you should set this property to either your Bing Maps API key or your Google Maps channel and client URL parameters. See the credentials section of the <a href="http://www.nps.gov/npmap/support/library/base-apis/bing.html#credentials">Bing</a> and <a href="http://www.nps.gov/npmap/support/library/base-apis/google.html#credentials">Google</a> base API docs for more information.</p></td>
    </tr>
    <tr>
      <td><code>div</code></td>
      <td><code>{String}</code></td>
      <td><code>null</code></td>
      <td><p>This property is <strong>required</strong>. The <code>id</code> of the HTML <code>div</code> element to render the map into. NPMap will automatically size the map to take up 100% of the height and width of the div. If/when this <code>div</code> is resized, NPMap will automatically resize the map and reposition/resize any toolbars or modules that have been added to the map.</p></td>
    </tr>
    <tr>
      <td><code>events</code></td>
      <td><code>{Object}</code></td>
      <td><code>null</code></td>
      <td><p>An object with event functions that NPMap should call before, during, and/or after the map creation. The current valid events are <code>preinit</code> and <code>init</code>. The <code>preinit</code> event occurs after the non-mapping dependencies are loaded, but before the mapping library is loaded and the web map is created. The <code>init</code> event occurs after all of the dependencies, including the mapping library, have been loaded and NPMap has created the map. Each of these functions must accept a callback function as a parameter and call the callback function (<code>callback();</code>).</p></td>
    </tr>
    <tr>
      <td><code>hideLogo</code></td>
      <td><code>{Boolean}</code></td>
      <td><code>false</code></td>
      <td><p>Tells NPMap to hide the NPMap logo. If possible, help us spread the word about this project by leaving the logo on the map!</p></td>
    </tr>
    <tr>
      <td><code>infobox</code></td>
      <td><code>{Object}</code></td>
      <td><code>null</code></td>
      <td><p>The global infobox configuration. You can use this object to customize how the InfoBox looks and behaves.</p></td>
    </tr>
    <tr>
      <td><code>layers</code></td>
      <td><code>{Array}</code></td>
      <td><code>null</code></td>
      <td><p>The layers to add to the map.</p></td>
    </tr>
    <tr>
      <td><code>modules</code></td>
      <td><code>{Array}</code></td>
      <td><code>null</code></td>
      <td><p>The modules to add to the map.</p></td>
    </tr>
    <tr>
      <td><code>server</code></td>
      <td><code>{String}</code></td>
      <td><code>'http://www.nps.gov/npmap/1.0.0'</code></td>
      <td><p>Allows you to load NPMap from an alternative location. This is only necessary if you're developing or serving NPMap from your own server.</p></td>
    </tr>
    <tr>
      <td><code>tools</code></td>
      <td><code>{Object}</code></td>
      <td><code>null</code></td>
      <td><p>Holds configuration information for NPMap's tools.</p></td>
    </tr>
    <tr>
      <td><code>zoom</code></td>
      <td><code>{Number}</code></td>
      <td><code>4</code></td>
      <td><p>An integer zoom level to initialize the map with.</p></td>
    </tr>
    <tr>
      <td><code>zoomRange</code></td>
      <td><code>{Object}</code></td>
<td><pre><code>{
  min: 0,
  max: 19
}
</code></pre></td>
      <td><p>The minimum and maximum zoom levels to restrict the map to.</p></td>
    </tr>
  </tbody>
</table>
<h1 id="npmap.map">NPMap.Map</h1>
<p>The map is the core component of NPMap. The <code>NPMap.Map</code> module facilitates creating and interacting with a map built with one of the supported base APIs. To create a map, you will need to create a <code>NPMap.config</code> object and then load the NPMap library into your web page.</p>
<h2 id="npmap.map-dependencies">Dependencies</h2>
<ul>
  <li>CartoDB (<a href="https://github.com/nationalparkservice/cartodb-gmapsv3">Google</a> and <a href="https://github.com/nationalparkservice/cartodb-leaflet">Leaflet</a>)</li>
  <li><a href="http://mapbox.com/wax/">MapBox Wax</a></li>
</ul>
<h2 id="npmap.map-methods">Methods</h2>
<table class="table table-bordered table-condensed table-striped" style="width:100%;">
  <thead>
    <tr>
      <td>Method</td>
      <td>Return Value</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="max-width:450px;word-wrap:break-word;"><code>addControl(el:HtmlElement, callback:Function, stopPropagation:Boolean)</code></td>
      <td><code>null</code></td>
      <td><p>Adds an HTML element to the map div.</p></td>
    </tr>
    <tr>
      <td><code>addLayer(config, silent?)</code></td>
      <td><code>null</code></td>
      <td><p>Adds a layer to the map.</p></td>
    </tr>
    <tr>
      <td><code>addShape(shape)</code></td>
      <td><code>null</code></td>
      <td><p>Adds a shape (marker, line, or polygon) to the map.</p></td>
    </tr>
    <tr>
      <td><code>addTileLayer(layer)</code></td>
      <td><code>null</code></td>
      <td><p>Adds a tile layer to the map.</p></td>
    </tr>
    <tr>
      <td><code>addZoomifyLayer(layer)</code></td>
      <td><code>null</code></td>
      <td><p>Adds a Zoomify layer to the map.</p></td>
    </tr>
    <tr>
      <td><code>boundsFromApi(bounds)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Converts an API bounds to an NPMap bounds.</p></td>
    </tr>
    <tr>
      <td><code>boundsGetCenter(bounds)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the center lat/lng of a bounds object.</p></td>
    </tr>
    <tr>
      <td><code>boundsToApi(bounds)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Converts an NPMap bounds to an API bounds.</p></td>
    </tr>
    <tr>
      <td><code>center(latLng)</code></td>
      <td><code>null</code></td>
      <td><p>Centers the map.</p></td>
    </tr>
    <tr>
      <td><code>centerAndZoom(latLng, zoom, callback?)</code></td>
      <td><code>null</code></td>
      <td><p>Centers the map.</p></td>
    </tr>
    <tr>
      <td><code>closeModules()</code></td>
      <td><code>null</code></td>
      <td><p>Closes the modules panel.</p></td>
    </tr>
    <tr>
      <td><code>createLine(latLngs, options?)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Creates a line.</p></td>
    </tr>
    <tr>
      <td><code>createMarker(latLng, options?)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Creates a marker.</p></td>
    </tr>
    <tr>
      <td><code>createPolygon(latLngs, options?)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Creates a polygon.</p></td>
    </tr>
    <tr>
      <td><code>createZoomifyLayer(config)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Creates a Zoomify layer.</p></td>
    </tr>
    <tr>
      <td><code>getBounds()</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the map bounds.</p></td>
    </tr>
    <tr>
      <td><code>getCenter()</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the center of the map.</p></td>
    </tr>
    <tr>
      <td><code>getMapElement()</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the map element.</p></td>
    </tr>
    <tr>
      <td><code>getBounds()</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the map bounds.</p></td>
    </tr>
    <tr>
      <td><code>getLineLatLngs(line)</code></td>
      <td><code>{Array}</code></td>
      <td><p>Gets the lat/lngs of a line.</p></td>
    </tr>
    <tr>
      <td><code>getMaxZoom()</code></td>
      <td><code>{Number}</code></td>
      <td><p>Gets the maximum zoom level for the map.</p></td>
    </tr>
    <tr>
      <td><code>getMinZoom()</code></td>
      <td><code>{Number}</code></td>
      <td><p>Gets the minimum zoom level for the map.</p></td>
    </tr>
    <tr>
      <td><code>getPolygonLatLngs(polygon)</code></td>
      <td><code>{Array}</code></td>
      <td><p>Gets the lat/lngs of a polygon.</p></td>
    </tr>
    <tr>
      <td><code>getZoom()</code></td>
      <td><code>{Number}</code></td>
      <td><p>Gets the zoom level of the map.</p></td>
    </tr>
    <tr>
      <td><code>handleResize()</code></td>
      <td><code>null</code></td>
      <td><p>Handles any necessary sizing and positioning for the map when its parent HTML element is resized. You should not need to call this manually.</p></td>
    </tr>
    <tr>
      <td><code>hasClusteredLayer()</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>Checks to see if a clustered layer has been added to the map.</p></td>
    </tr>
    <tr>
      <td><code>hasTiledLayer()</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>Checks to see if a tiled layer has been added to the map.</p></td>
    </tr>
    <tr>
      <td><code>hideLayer(config, silent?)</code></td>
      <td><code>null</code></td>
      <td><p>Hides a layer.</p></td>
    </tr>
    <tr>
      <td><code>hideProgressBar()</code></td>
      <td><code>null</code></td>
      <td><p>Hides the progress bar.</p></td>
    </tr>
    <tr>
      <td><code>hideShape(shape)</code></td>
      <td><code>null</code></td>
      <td><p>Hides a shape.</p></td>
    </tr>
    <tr>
      <td><code>hideTip(shape)</code></td>
      <td><code>null</code></td>
      <td><p>Hides the tip.</p></td>
    </tr>
    <tr>
      <td><code>isLatLngWithinMapBounds(latLng)</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>Tests to see if a latLng is within the map's current bounds.</p></td>
    </tr>
    <tr>
      <td><code>latLngsAreEqual(latLng1, latLng2)</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>Tests the equivalency of two lat/lng objects.</p></td>
    </tr>
    <tr>
      <td><code>latLngFromApi(latLng)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Converts a base API lat/lng object to an NPMap lat/lng object.</p></td>
    </tr>
    <tr>
      <td><code>latLngToApi(latLng)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Converts an NPMap lat/lng object to a base API latLng object.</p></td>
    </tr>
    <tr>
      <td><code>latLngToPixel(latLng)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Converts an NPMap lat/lng object to an NPMap pixel object.</p></td>
    </tr>
    <tr>
      <td><code>metersToZoomLevel(meters)</code></td>
      <td><code>{Number}</code></td>
      <td><p>Turns meters into a zoom level. This function is not precise, as it is impossible to get precise meter scale values for the entire earth reprojected to web mercator.</p></td>
    </tr>
    <tr>
      <td><code>notify(message, title?, type?, interval?)</code></td>
      <td><code>null</code></td>
      <td><p>Shows a notification.</p></td>
    </tr>
    <tr>
      <td><code>openModule(el)</code></td>
      <td><code>null</code></td>
      <td><p>Opens the UI for a module.</p></td>
    </tr>
    <tr>
      <td><code>panByPixels(pixel, callback?)</code></td>
      <td><code>null</code></td>
      <td><p>Pans the map horizontally and/or vertically based on the pixel object passed in.</p></td>
    </tr>
    <tr>
      <td><code>panInDirection(direction)</code></td>
      <td><code>null</code></td>
      <td><p>Pans the map in a direction by a quarter of the current map viewport.</p></td>
    </tr>
    <tr>
      <td><code>pixelFromApi(pixel)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Converts a base API pixel object to its NPMap equivalent.</p></td>
    </tr>
    <tr>
      <td><code>pixelToApi(pixel)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Converts an NPMap pixel object to its base API equivalent.</p></td>
    </tr>
    <tr>
      <td><code>pixelToLatLng(pixel)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Converts an NPMap pixel object to an NPMap lat/lng object.</p></td>
    </tr>
    <tr>
      <td><code>removeLayer(config, silent?)</code></td>
      <td><code>null</code></td>
      <td><p>Removes a layer from the map.</p></td>
    </tr>
    <tr>
      <td><code>removeShape(shape)</code></td>
      <td><code>null</code></td>
      <td><p>Removes a shape from the map.</p></td>
    </tr>
    <tr>
      <td><code>setBounds(bounds)</code></td>
      <td><code>null</code></td>
      <td><p>Sets the map bounds.</p></td>
    </tr>
    <tr>
      <td><code>setCursor(cursor)</code></td>
      <td><code>null</code></td>
      <td><p>Sets the map cursor.</p></td>
    </tr>
    <tr>
      <td><code>setInitialCenter(center)</code></td>
      <td><code>null</code></td>
      <td><p>Sets the initial center of the map. This initial center is stored with the map, and is used by the setInitialExtent method, among other things.</p></td>
    </tr>
    <tr>
      <td><code>setInitialZoom(zoom)</code></td>
      <td><code>null</code></td>
      <td><p>Sets the initial zoom of the map. This initial zoom is stored with the map, and is used by the setInitialExtent method, among other things.</p></td>
    </tr>
    <tr>
      <td><code>setMarkerOptions(marker, options)</code></td>
      <td><code>null</code></td>
      <td><p>Sets a marker's options.</p></td>
    </tr>
    <tr>
      <td><code>setNotifyTarget(el)</code></td>
      <td><code>null</code></td>
      <td><p>Sets the notify target to an HTML element other than the map div. This can only be called after NPMap has been initialized.</p></td>
    </tr>
    <tr>
      <td><code>setZoomRestrictions(restrictions)</code></td>
      <td><code>null</code></td>
      <td><p>Sets min and/or max zoom restrictions on the map.</p></td>
    </tr>
    <tr>
      <td><code>showLayer(config, silent?)</code></td>
      <td><code>null</code></td>
      <td><p>Shows a layer.</p></td>
    </tr>
    <tr>
      <td><code>showProgressBar(value)</code></td>
      <td><code>null</code></td>
      <td><p>Shows the progress bar.</p></td>
    </tr>
    <tr>
      <td><code>showShape(shape)</code></td>
      <td><code>null</code></td>
      <td><p>Shows a shape.</p></td>
    </tr>
    <tr>
      <td><code>showTip(content, position)</code></td>
      <td><code>null</code></td>
      <td><p>Shows the tip.</p></td>
    </tr>
    <tr>
      <td><code>toBounds(bounds)</code></td>
      <td><code>null</code></td>
      <td><p>Zooms the map to a bounding box.</p></td>
    </tr>
    <tr>
      <td><code>toggleFullScreen()</code></td>
      <td><code>null</code></td>
      <td><p>Toggles fullscreen mode on or off.</p></td>
    </tr>
    <tr>
      <td><code>toInitialExtent()</code></td>
      <td><code>null</code></td>
      <td><p>Zooms and/or pans the map to its initial extent.</p></td>
    </tr>
    <tr>
      <td><code>toLatLngs(latLngs)</code></td>
      <td><code>null</code></td>
      <td><p>Zooms the map to the extent of an array of lat/lng objects.</p></td>
    </tr>
    <tr>
      <td><code>toShapes(shapes)</code></td>
      <td><code>null</code></td>
      <td><p>Zooms the map to the extent of an array of shapes (markers, lines, and polygons).</p></td>
    </tr>
    <tr>
      <td><code>updateAttribution()</code></td>
      <td><code>null</code></td>
      <td><p>Updates the map attribution. Looks at the <Code>NPMap.Map[NPMap.config.api]._attribution</code> property and iterates through all of the visible baseLayers and layers and looks at their attribution property as well.</p></td>
    </tr>
    <tr>
      <td><code>updateProgressBar(value)</code></td>
      <td><code>null</code></td>
      <td><p>Updates the progress bar value.</p></td>
    </tr>
    <tr>
      <td><code>zoom(zoom)</code></td>
      <td><code>null</code></td>
      <td><p>Zooms the map to a zoom level.</p></td>
    </tr>
    <tr>
      <td><code>zoomIn()</code></td>
      <td><code>null</code></td>
      <td><p>Zooms the map in by one zoom level.</p></td>
    </tr>
    <tr>
      <td><code>zoomOut()</code></td>
      <td><code>null</code></td>
      <td><p>Zooms the map out by one zoom level.</p></td>
    </tr>
  </tbody>
</table>
<h2 id="npmap.map-properties">Properties</h2>
<p><code>NPMap.Map</code> does not expose any public properties.</p>
<h2 id="npmap.map-events">Events</h2>
<p>The <code>NPMap.Map</code> module exposes both mouse and map events. You can subscribe to and unsubscribe from these events using the <a href="#npmap.event"><code>NPMap.Event</code></a> module.</p>
<p>You can see these events in action on the [map events example](http://www.nps.gov/npmap/support/library/examples/map-events.html).</p>
<h3 id="npmap.map-events-mouse">Mouse Events</h3>
<p>Once you subscribe to one of these events, your handler will receive the {MouseEvent} as a parameter when the event is fired.</p>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td>Name</td>
      <td>Argument</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>click</code></td>
      <td><code>{MouseEvent}</code></td>
      <td><p>This event is fired whenever the map is single-clicked using the left mouse button.</p></td>
    </tr>
    <tr>
      <td><code>dblclick</code></td>
      <td><code>{MouseEvent}</code></td>
      <td><p>This event is fired whenever the map is double-clicked using the left mouse button.</p></td>
    </tr>
    <tr>
      <td><code>mousedown</code></td>
     <td><code>{MouseEvent}</code></td>
      <td><p>This event is fired whenever the left mouse button is pushed down, but before it is released.</p></td>
    </tr>
    <tr>
      <td><code>mousemove</code></td>
      <td><code>{MouseEvent}</code></td>
      <td><p>This event is fired whenever the mouse is moved over the map. It fires continously.</p></td>
    </tr>
    <tr>
      <td><code>mouseout</code></td>
      <td><code>{MouseEvent}</code></td>
      <td><p>This event is fired whenever the mouse is moved off of the map's div element.</p></td>
    </tr>
    <tr>
      <td><code>mouseover</code></td>
      <td><code>{MouseEvent}</code></td>
      <td><p>This event is fired whenever the mouse is moved onto the map's div element.</p></td>
    </tr>
    <tr>
      <td><code>mouseup</code></td>
      <td><code>{MouseEvent}</code></td>
      <td><p>This event is fired whenever the left mouse button is released after is has been pushed down.</p></td>
    </tr>
    <tr>
      <td><code>shapeclick</code></td>
      <td><code>{MouseEvent}</code></td>
      <td><p>This event a shape object (marker, line, or polygon) is clicked on the map.</p></td>
    </tr>
  </tbody>
</table>
<h3 id="npmap.map-events-map">Map Events</h3>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td>Name</td>
      <td>Argument</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>baselayerchanged</code></td>
      <td><code>{Object}</code></td>
      <td><p>This event is fired whenever the map's base layer is changed.</p></td>
    </tr>
    <tr>
      <td><code>panend</code></td>
      <td><code>null</code></td>
      <td><p>This event is fired after the map has been panned.</p></td>
    </tr>
    <tr>
      <td><code>panstart</code></td>
      <td><code>null</code></td>
      <td><p>This event is fired when the map starts to pan.</p></td>
    </tr>
    <tr>
      <td><code>ready</code></td>
      <td><code>null</code></td>
      <td><p>This event fires once when the map has been loaded and is ready to be interated with programatically.</p></td>
    </tr>
    <tr>
      <td><code>viewchange</code></td>
      <td><code>null</code></td>
      <td><p>This event is fired continously while the map's view is changing.</p></td>
    </tr>
    <tr>
      <td><code>viewchangeend</code></td>
      <td><code>null</code></td>
      <td><p>This event is fired after the map's view has changed.</p></td>
    </tr>
    <tr>
      <td><code>viewchangestart</code></td>
      <td><code>null</code></td>
      <td><p>This event is fired when the map's view starts to change.</p></td>
    </tr>
    <tr>
      <td><code>zoomend</code></td>
      <td><code>null</code></td>
      <td><p>This event is fired after the map has been zoomed in or out.</p></td>
    </tr>
    <tr>
      <td><code>zoomstart</code></td>
      <td><code>null</code></td>
      <td><p>This event is fired when the map starts to zoom in or out.</p></td>
    </tr>
  </tbody>
</table>
<h2 id="npmap.map-submodules">Submodules</h2>
<p>Base API-specific code lives in one of the submodules that hang off of the <code>NPMap.Map</code> module. Generally speaking, you should not interact directly with these submodules, but if you need to do something programatically that isn't supported by the <code>NPMap.Map</code> module, you may need to.</p>
<p>One property that you may need to access is the underlying map object that has been created using the base API. This property can be accessed at <code>NPMap.Map['Bing'|'Google'|'Leaflet'|'ModestMaps'].map</code>. Once NPMap has initialized the map and loaded all of its tools and modules, you can use this map to access functionality that is provided by the base API but not supported by one of the NPMap modules.</p>
<ul>
  <li><a href="http://www.nps.gov/npmap/support/library/base-apis/bing.html"><code>NPMap.Map.Bing</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/base-apis/google.html"><code>NPMap.Map.Google</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/base-apis/leaflet.html"><code>NPMap.Map.Leaflet</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/base-apis/modestmaps.html"><code>NPMap.Map.ModestMaps</code></a></li>
</ul>
<h1 id="npmap.infobox">NPMap.InfoBox</h1>
<h2 id="npmap.infobox-methods">Methods</h2>
<table class="table table-bordered table-condensed table-striped" style="width:100%;">
  <thead>
    <tr>
      <td>Method</td>
      <td>Return Value</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>hide()</code></td>
      <td><code>null</code></td>
      <td><p>Hides the InfoBox.</p></td>
    </tr>
    <tr>
      <td><code>removeAction(el)</code></td>
      <td><code>null</code></td>
      <td><p>Removes an action HTML element (<code>&lt;a&gt;</code>)from the InfoBox.</p></td>
    </tr>
    <tr>
      <td><code>reposition()</code></td>
      <td><code>null</code></td>
      <td><p>Repositions the npmap-clickdot div then repositions the InfoBox. If the marker or npmap-clickdot is not in the current map bounds, it is hidden.</p></td>
    </tr>
    <tr>
      <td style="max-width:450px;word-wrap:break-word;"><code>show(content, title, footer, actions, styles, target?)</code></td>
      <td><code>null</code></td>
      <td><p>Shows the InfoBox.</p></td>
    </tr>
  </tbody>
</table>
<h2 id="npmap.infobox-properties">Properties</h2>
<table class="table table-bordered table-condensed table-striped" style="width:100%;">
  <thead>
    <tr>
      <td>Property</td>
      <td>Type</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>actions</code></td>
      <td><code>{Array}</code></td>
      <td><p>An array of action objects associated with the current identify operation. If the InfoBox is hidden, this will be <code>null</code>.</p></td>
    </tr>
    <tr>
      <td><code>results</code></td>
      <td><code>{Array}</code></td>
      <td><p>An array of result objects for the current identify operation. If the InfoBox is hidden, this will be <code>null</code>.</p></td>
    </tr>
    <tr>
      <td><code>latLng</code></td>
      <td><code>{Object}</code></td>
      <td><p>The current latitude/longitude of the InfoBox. If the InfoBox is hidden, this will be <code>null</code>.</p></td>
    </tr>
    <tr>
      <td><code>marker</code></td>
      <td><code>{Object}</code></td>
      <td><p>The current marker, if a marker is present. This is <code>null</code> if the InfoBox is displaying without a marker or if the InfoBox is hidden.</p></td>
    </tr>
    <tr>
      <td><code>visible</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>This is <code>true</code> if the InfoBox is currently visible.</p></td>
    </tr>
  </tbody>
</table>
<h2 id="npmap.infobox-events">Events</h2>
<p>The <code>NPMap.InfoBox</code> module exposes a few events that can be utilized. You can subscribe to and unsubscribe from these events using the <a href="#npmap.event"><code>NPMap.Event</code></a> module.</p>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td>Name</td>
      <td>Argument</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>hide</code></td>
      <td><code>null</code></td>
      <td><p>This event is fired when the InfoBox is hidden.</p></td>
    </tr>
    <tr>
      <td><code>show</code></td>
      <td><code>null</code></td>
      <td><p>This event is fired when the InfoBox is shown.</p></td>
    </tr>
  </tbody>
</table>
<h1 id="npmap.layer">NPMap.Layer</h1>
<h2 id="npmap.layer-methods">Methods</h2>
<table class="table table-bordered table-condensed table-striped" style="width:100%;">
  <thead>
    <tr>
      <td>Method</td>
      <td>Return Value</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>getActiveLayerTypes()</code></td>
      <td><code>{Array}</code></td>
      <td><p>Gets the active layer types for both the baseLayers and layers configs.</p></td>
    </tr>
    <tr>
      <td><code>getLayerById(id, layers?)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets a layer config object by layer id.</p></td>
    </tr>
    <tr>
      <td><code>getLayerHandlerMeta(name)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Get the META information for a layer handler.</p></td>
    </tr>
    <tr>
      <td><code>getLayerByName(name, layers?)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets a layer config object by layer name.</p></td>
    </tr>
    <tr>
      <td><code>getName(config)</code></td>
      <td><code>{String}</code></td>
      <td><p>Gets the layer name.</p></td>
    </tr>
    <tr>
      <td><code>getType(config)</code></td>
      <td><code>{String}</code></td>
      <td><p>Gets the layer type.</p></td>
    </tr>
    <tr>
      <td><code>getVisibleLayers()</code></td>
      <td><code>{String}</code></td>
      <td><p>Gets the layers that are currently visible.</p></td>
    </tr>
    <tr>
      <td><code>iterateThroughAllLayers(func)</code></td>
      <td><code>{Function}</code></td>
      <td><p>Iterates through all the objects in the NPMap.config.baseLayers and NPMap.config.layers configs.</p><p>The function will be passed each of the layer config objects as a parameter.</p></td>
    </tr>
    <tr>
      <td><code>iterateThroughBaseLayers(func)</code></td>
      <td><code>{Function}</code></td>
      <td><p>Iterates through all the objects in the NPMap.config.baseLayers config.</p><p>The function will be passed each of the layer config objects as a parameter.</p></td>
    </tr>
    <tr>
      <td><code>iterateThroughLayers(func)</code></td>
      <td><code>{Function}</code></td>
      <td><p>Iterates through all the objects in the NPMap.config.layers config.</p><p>The function will be passed each of the layer config objects as a parameter.</p></td>
    </tr>
  </tbody>
</table>
<h2 id="npmap.layer-properties">Properties</h2>
<p><code>NPMap.Layer</code> does not expose any public properties.</p>
<h2 id="npmap.layer-events">Events</h2>
<p>The <code>NPMap.Layer</code> module exposes several events that can be utilized to hook custom behaviors up to layers. You can subscribe to and unsubscribe from these events using the <a href="#npmap.event"><code>NPMap.Event</code></a> module.</p>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td>Name</td>
      <td>Argument</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>added</code></td>
      <td><code>{Object}</code></td>
      <td><p>This event is fired when a new baseLayer or layer is added to the map.</p></td>
    </tr>
    <tr>
      <td><code>beforeadd</code></td>
      <td><code>{Object}</code></td>
      <td><p>This event is fired before a new baseLayer or layer is added to the map.</p></td>
    </tr>
    <tr>
      <td><code>ready</code></td>
      <td><code>null</code></td>
      <td><p>This event fires once when all the layers the map has been initialized with have been added to the map.</p></td>
    </tr>
    <tr>
      <td><code>removed</code></td>
      <td><code>{Object}</code></td>
      <td><p>This event is fired when a baseLayer or layer is removed from the map.</p></td>
    </tr>
  </tbody>
</table>
<h2 id="npmap.layer-submodules">Submodules</h2>
<p>Code that is specific to the individual layer handlers hang off of the <code>NPMap.Layer</code> module.</p>
<ul>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/arcgisserverrest.html"><code>NPMap.Layer.ArcGisServerRest</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/cartodb.html"><code>NPMap.Layer.CartoDb</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/geojson.html"><code>NPMap.Layer.GeoJson</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/googlefusion.html"><code>NPMap.Layer.GoogleFusion</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/json.html"><code>NPMap.Layer.Json</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/kml.html"><code>NPMap.Layer.Kml</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/nativevectors.html"><code>NPMap.Layer.NativeVectors</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/tiled.html"><code>NPMap.Layer.Tiled</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/tilestream.html"><code>NPMap.Layer.TileStream</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/xml.html"><code>NPMap.Layer.Xml</code></a></li>
  <li><a href="http://www.nps.gov/npmap/support/library/layer-handlers/zoomify.html"><code>NPMap.Layer.Zoomify</code></a></li>
</ul>
<h1 id="npmap.event">NPMap.Event</h1>
<h2 id="npmap.event-example">Example</h2>
<pre><code>
// Add an event.
var eventId = NPMap.Event.add('NPMap.Map', 'click', function(e) {
  console.log(e); // The click event.
});

// Remove the event.
NPMap.Event.remove(eventId);
</code></pre>
<h2 id="npmap.event-methods">Methods</h2>
<table class="table table-bordered table-condensed table-striped" style="width:100%;">
  <thead>
    <tr>
      <td>Method</td>
      <td>Return Value</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="max-width:450px;word-wrap:break-word;"><code>add(obj, event, func, single?)</code></td>
      <td><code>{Number}</code></td>
      <td><p>Adds an event.</p></td>
    </tr>
    <tr>
      <td><code>get(obj?)</code></td>
      <td><code>{Number}</code></td>
      <td><p>Gets all the events or, optionally, just the events that have been added to a module.</p></td>
    </tr>
    <tr>
      <td><code>remove(id)</code></td>
      <td><code>null</code></td>
      <td><p>Removes an event.</p></td>
    </tr>
    <tr>
      <td><code>trigger(obj, event, e?)</code></td>
      <td><code>null</code></td>
      <td><p>Triggers an event.</p></td>
    </tr>
  </tbody>
</table>
<h2 id="npmap.event-properties">Properties</h2>
<p><code>NPMap.Event</code> does not expose any public properties.</p>
<h2 id="npmap.event-events">Events</h2>
<p><code>NPMap.Event</code> does not trigger any events.</p>
<h1 id="npmap.util">NPMap.Util</h1>
<p>The <code>NPMap.Util</code> module contains helper methods that make certain tasks easier. NPMap also loads and utilizes the <a href="http://underscorejs.org">Underscore</a> library, so you can utilize any of the methods it exposes in addition to the <code>NPMap.Util</code> methods.</p>
<h2 id="npmap.util-methods">Methods</h2>
<table class="table table-bordered table-condensed table-striped" style="width:100%;">
  <thead>
    <tr>
      <td>Method</td>
      <td>Return Value</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>addClass(el, cls)</code></td>
      <td><code>null</code></td>
      <td><p>Adds a CSS class to an element.</p></td>
    </tr>
    <tr>
      <td><code>bindEventToElement(el, name, handler)</code></td>
      <td><code>null</code></td>
      <td><p>Adds a CSS class to an element.</p></td>
    </tr>
    <tr>
      <td><code>convertOpacity(opacity)</code></td>
      <td><code>{Number}</code></td>
      <td><p>Converts a 0-255 opacity to 0-1.0.</p></td>
    </tr>
    <tr>
      <td><code>doesPropertyExist(obj, prop)</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>Given an object, does a property exist?</p></td>
    </tr>
    <tr>
      <td><code>eventCancelMouseWheel(e)</code></td>
      <td><code>null</code></td>
      <td><p>Cancels a <code>mousewheel</code> event.</p></td>
    </tr>
    <tr>
      <td><code>eventCancelPropagation(e)</code></td>
      <td><code>null</code></td>
      <td><p>Cross-browser cancel event propagation.</p></td>
    </tr>
    <tr>
      <td><code>getElementsByClass(cls)</code></td>
      <td><code>{Array}</code></td>
      <td><p>Gets elements by class name.</p></td>
    </tr>
    <tr>
      <td><code>getFirstPropertyOfObject(obj)</code></td>
      <td><code>{Array}|{Boolean}|{Function}|{Object}</code></td>
      <td><p>Gets the first property of an object.</p></td>
    </tr>
    <tr>
      <td><code>getMousePositionPage()</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the mouse position, in pixels and relative to the page, for a MouseEvent object.</p></td>
    </tr>
    <tr>
      <td><code>getNextElement(el)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the next sibling element.</p></td>
    </tr>
    <tr>
      <td><code>getOffset(el)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the offset, in pixels, of an element.</p></td>
    </tr>
    <tr>
      <td><code>getOuterDimensions(el)</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the outer dimensions, in pixels, of an HTML element.</p></td>
    </tr>
    <tr>
      <td><code>getScrollBarWidth()</code></td>
      <td><code>{Number}</code></td>
      <td><p>Gets the width of the browser's vertical scrollbar.</p></td>
    </tr>
    <tr>
      <td><code>getScrollPosition()</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the current scroll position, in pixels, of the browser window.</p></td>
    </tr>
    <tr>
      <td><code>getWindowDimensions()</code></td>
      <td><code>{Object}</code></td>
      <td><p>Gets the current window dimensions, in pixels.</p></td>
    </tr>
    <tr>
      <td><code>hasClass(el, cls)</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>Checks to see if an HTML element has a CSS class.</p></td>
    </tr>
    <tr>
      <td><code>hexToRgb(hex)</code></td>
      <td><code>{String}</code></td>
      <td><p>Converts a HEX color to RGB.</p></td>
    </tr>
    <tr>
      <td><code>injectCss(locations, callback?</code></td>
      <td><code>null</code></td>
      <td><p>Injects a CSS stylesheet or multiple CSS stylesheets into the page.</p></td>
    </tr>
    <tr>
      <td><code>isBetween(start, end, test</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>Returns true if the test number falls between the start and end numbers.</p></td>
    </tr>
    <tr>
      <td><code>isInt(n)</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>Returns true if the number passed in is an integer.</p></td>
    </tr>
    <tr>
      <td><code>isRightClick(e)</code></td>
      <td><code>{Boolean}</code></td>
      <td><p>Detects if a MouseEvent is a right-click event.</p></td>
    </tr>
    <tr>
      <td><code>iterateThroughChildNodes(el, func)</code></td>
      <td><code>null</code></td>
      <td><p>Iterates through all of the child nodes of an element.</p></td>
    </tr>
    <tr>
      <td><code>monitorResize(el, handler)</code></td>
      <td><code>null</code></td>
      <td><p>Monitors an HTML element and calls the handler when its size changes.</p></td>
    </tr>
    <tr>
      <td><code>removeClass(el, cls)</code></td>
      <td><code>null</code></td>
      <td><p>Removes a CSS class from an HTML element.</p></td>
    </tr>
    <tr>
      <td><code>safeLoad(module, callback)</code></td>
      <td><code>null</code></td>
      <td><p>Checks to make sure a module has been loaded before calling callback function. This function assumes that the module resides in the NPMap namespace.</p></td>
    </tr>
    <tr>
      <td><code>stopAllPropagation(el)</code></td>
      <td><code>null</code></td>
      <td><p>Stops the propagation of all events on an HTML element.</p></td>
    </tr>
    <tr>
      <td><code>stripHtmlFromString(html)</code></td>
      <td><code>{String}</code></td>
      <td><p>Strips all HTML from a string.</p></td>
    </tr>
    <tr>
      <td><code>trimString(string)</code></td>
      <td><code>{String}</code></td>
      <td><p>Trims whitespace from the beginning and end of a string.</p></td>
    </tr>
  </tbody>
<table>
<h2 id="npmap.util-properties">Properties</h2>
<p><code>NPMap.Util</code> does not expose any public properties.</p>
<h2 id="npmap.util-events">Events</h2>
<p><code>NPMap.Util</code> does not trigger any events.</p>
<h2 id="npmap.layer-submodules">Submodules</h2>
<p>A few utility modules hang off of the <code>NPMap.Util</code> module:</p>
<ul>
  <li><code>NPMap.Util.Json</code>
    <ul>
      <li><code>NPMap.Util.Json.GeoJson</code></li>
    </ul>
  </li>
  <li><code>NPMap.Util.Xml</code>
    <ul>
      <li><code>NPMap.Util.Xml.Kml</code></li>
    </ul>
  </li>
</ul>