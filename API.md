<h1 id="notes">Notes</h1>

- Module properties and methods that start with an underscore (i.e. <code>_zoomToLatLngs</code>) are considered private and may change at any time. Do not use them.

<h1 id="specifications">Specifications</h1>

By design, NPMap doesn't create or utilize traditional JavaScript classes. It, rather, uses simple objects and utility methods specific to whichever base API is being used by the map to convert objects to and from native base API objects.

These specifications document the structure of objects you'll see when interacting directly with NPMap's modules. If you are interacting with objects that aren't proxied through one of the NPMap modules, you'll need to take a look at the API docs for the base API itself to see what the expected format is.

<h2 id="specifications-bounds">Bounds</h2>

NPMap always expects and returns coordinates in Decimal Degrees.

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

NPMap always expects and returns coordinates in Decimal Degrees.

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

NPMap stores important metadata as a property on all the lines, markers, and polygons that it creates. It uses these metadata to make information about the shapes available via <code>click</code> and <code>mouseover</code> operations and various modules and tools.

All of the metadata that NPMap stores with a shape is contained in the <code>npmap</code> object, so if you have a reference to a <code>shape</code>, you can access the NPMap metadata via the <code>shape.npmap</code> property. This object contains the following properties:

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
  </tbody>
</table>

<h1 id="npmap.config">NPMap.config</h1>

The <code>NPMap.config</code> object is used to set configuration properties that NPMap uses to build the map. You must create this object **before** loading the NPMap library into your web page.

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
  s.type = 'text/javascript';
  document.body.appendChild(s);
})();
</code></pre>
<h2 id="npmap.config-options">Options</h2>

The following properties can be set in the <a href="#npmapconfig"><code>NPMap.config</code></a> object. Note that the only required property is <code>NPMap.config.div</code>.

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

The map is the core component of NPMap. The <code>NPMap.Map</code> module facilitates creating and interacting with a map built with one of the supported base APIs. To create a map, you will need to create a <code>NPMap.config</code> object and then load the NPMap library into your web page.

<h2 id="npmap.map-dependencies">Dependencies</h2>

- [MapBox Wax](http://mapbox.com/wax/)

<h2 id="npmap.map-methods">Methods</h2>
<table class="table table-bordered table-condensed table-striped">
  <thead>
    <tr>
      <td>Name</td>
      <td>Return Value</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>addControl(el:HtmlElement, callback:Function, stopPropagation:Boolean)</code></td>
      <td><code>null</code></td>
      <td><p>Adds an HTML element to the map div.</p></td>
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
      <td><code>getMaxZoom()</code></td>
      <td><code>{Number}</code></td>
      <td><p>Gets the maximum zoom level for the map.</p></td>
    </tr>
    <tr>
      <td><code>getMinZoom()</code></td>
      <td><code>{Number}</code></td>
      <td><p>Gets the minimum zoom level for the map.</p></td>
    </tr>
  </tbody>
</table>
<h2 id="npmap.map-properties">Properties</h2>
<h2 id="npmap.map-events">Events</h2>

The <code>NPMap.Map</code> module exposes both mouse and map events. You can subscribe to and unsubscribe from these events using the <a href="#npmapevent"><code>NPMap.Event</code></a> module.

You can see these events in action on the [map events example](http://www.nps.gov/npmap/support/library/examples/map-events.html).

<h3 id="npmap.map-events-mouse">Mouse Events</h3>

Once you subscribe to one of these events, your handler will receive the {MouseEvent} as a parameter when the event is fired.

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

Base API-specific code lives in one of the submodules that hang off of the <code>NPMap.Map</code> module. Generally speaking, you should not interact directly with these submodules, but if you need to do something programatically that isn't supported by the <code>NPMap.Map</code> module, you may need to.

- <a href="http://www.nps.gov/npmap/support/library/base-apis/bing.html"><code>NPMap.Map.Bing</code></a>
- <a href="http://www.nps.gov/npmap/support/library/base-apis/google.html"><code>NPMap.Map.Google</code></a>
- <a href="http://www.nps.gov/npmap/support/library/base-apis/leaflet.html"><code>NPMap.Map.Leaflet</code></a>
- <a href="http://www.nps.gov/npmap/support/library/base-apis/modestmaps.html"><code>NPMap.Map.ModestMaps</code></a>

<h1 id="npmap.layer">NPMap.Layer</h1>
<h1 id="npmap.event">NPMap.Event</h1>
<h1 id="npmap.infobox">NPMap.InfoBox</h1>
<h1 id="npmap.util">NPMap.Util</h1>