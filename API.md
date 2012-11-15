# Specifications

By design, NPMap doesn't create or utilize traditional JavaScript classes. It, rather, uses simple objects and utility methods specific to whichever base API is being used by the map to convert objects to and from native base API objects.

These specifications document the structure of objects you'll see when interacting directly with NPMap's modules. If you are interacting with objects that aren't proxied through one of the NPMap modules, you'll need to take a look at the API docs for the base API itself to see what the expected format is.

## Bounds

NPMap always expects and returns coordinates in Decimal Degrees.

<table class="table table-bordered table-condensed">
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

## LatLng

NPMap always expects and returns coordinates in Decimal Degrees.

<table class="table table-bordered table-condensed">
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

## Point

<table class="table table-bordered table-condensed">
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

## Shape

NPMap stores important metadata as a property on all the lines, markers, and polygons that it creates. It uses these metadata to make information about the shapes available via <code>click</code> and <code>mouseover</code> operations and various modules and tools.

All of the metadata that NPMap stores with a shape is contained in the <code>npmap</code> object, so if you have a reference to a <code>shape</code>, you can access the NPMap metadata via the <code>shape.npmap</code> property. This object contains the following properties:

<table class="table table-bordered table-condensed">
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

# NPMap.config

The <code>NPMap.config</code> object is used to set configuration properties that NPMap uses to build the map. You must create this object **before** loading the NPMap library into your web page.

## Example

<pre data-line="3-11"><code>var NPMap = NPMap || {};

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

## Options

The following properties can be set in the <a href="#npmapconfig"><code>NPMap.config</code></a> object. Note that the only required property is <code>NPMap.config.div</code>.

<table class="table table-bordered table-condensed">
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
      <td>The base API to use for the web map.</td>
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
      <td>The latitude/longitude to initialize the map with. If this is <code>null</code> or missing either the <code>lat</code> or <code>lng</code> property, NPMap will default to the center of the continental United States.</td>
    </tr>
    <tr>
      <td><code>credentials</code></td>
      <td><code>{String}</code></td>
      <td><code>'nps'</code></td>
      <td>This property tells NPMap whether or not you are an NPS employee, contractor, or partner. If you are an NPS employee, you do not need to specify this property. If you are not and you are using either the <code>bing</code> or <code>google</code> base API, you should set this property to either your Bing Maps API key or your Google Maps channel and client URL parameters. See the credentials section of the <a href="http://www.nps.gov/npmap/support/library/base-apis/bing.html#credentials">Bing</a> and <a href="http://www.nps.gov/npmap/support/library/base-apis/google.html#credentials">Google</a> base API docs for more information.</td>
    </tr>
    <tr>
      <td><code>div</code></td>
      <td><code>{String}</code></td>
      <td><code>null</code></td>
      <td>This property is <em>required</em>. The <code>id</code> of the HTML <code>div</code> element to render the map into. NPMap will automatically size the map to take up 100% of the height and width of the div. If/when this <code>div</code> is resized, NPMap will automatically resize the map.</td>
    </tr>
    <tr>
      <td><code>events</code></td>
      <td><code>{Object}</code></td>
      <td><code>null</code></td>
      <td>An object with event functions that NPMap should call before, during, and/or after the map creation. The current valid events are <code>preinit</code> and <code>init</code>. The <code>preinit</code> event occurs after the non-mapping dependencies are loaded, but before the mapping library is loaded and the web map is created. The <code>init</code> event occurs after all of the dependencies, including the mapping library, have been loaded and NPMap has created the map. Each of these functions must accept a callback function as a parameter and call the callback function (<code>callback();</code>).</td>
    </tr>
    <tr>
      <td><code>hideLogo</code></td>
      <td><code>{Boolean}</code></td>
      <td><code>false</code></td>
      <td>Tells NPMap to hide the NPMap logo. If possible, help us spread the word about NPMap by leaving the logo on the map!</td>
    </tr>
    <tr>
      <td><code>infobox</code></td>
      <td><code>{Object}</code></td>
      <td><code>null</code></td>
      <td>The global infobox configuration. You can use this object to customize how the InfoBox looks and behaves.</td>
    </tr>
    <tr>
      <td><code>layers</code></td>
      <td><code>{Array}</code></td>
      <td><code>null</code></td>
      <td>The layers to add to the map.</td>
    </tr>
    <tr>
      <td><code>modules</code></td>
      <td><code>{Array}</code></td>
      <td><code>null</code></td>
      <td>The modules to add to the map.</td>
    </tr>
    <tr>
      <td><code>server</code></td>
      <td><code>{String}</code></td>
      <td><code>'http://www.nps.gov/npmap/1.0.0'</code></td>
      <td>Allows you to load NPMap from an alternative location. This is only necessary if you're developing or serving NPMap from your own server.</td>
    </tr>
    <tr>
      <td><code>tools</code></td>
      <td><code>{Object}</code></td>
      <td><code>null</code></td>
      <td>Holds configuration information for NPMap's tools.</td>
    </tr>
    <tr>
      <td><code>zoom</code></td>
      <td><code>{Number}</code></td>
      <td><code>4</code></td>
      <td>An integer zoom level to initialize the map with.</td>
    </tr>
    <tr>
      <td><code>zoomRange</code></td>
      <td><code>{Object}</code></td>
<td><pre><code>{
  min: 0,
  max: 19
}
</code></pre></td>
      <td>The minimum and maximum zoom levels to restrict the map to.</td>
    </tr>
  </tbody>
</table>

# NPMap.Map

The map is the core component of NPMap. <code>NPMap.Map</code> is a factory that facilitates creating and interacting with a map built using one of the supported base APIs. To create a map, you will need to create a <code>NPMap.config</code> object and then load the NPMap library into your web page.

## Events

<div class="span-6">
  <p>Mouse:</p>
  <ul>
    <li>click</li>
    <li>dblclick</li>
    <li>mousedown</li>
    <li>mousemove</li>
    <li>mouseout</li>
    <li>mouseover</li>
    <li>mouseup</li>
    <li>shapeclick</li>
  </ul>
</div>
<div class="span-6">
  <p>Map State:</p>
  <ul>
    <li>baselayerchanged</li>
    <li>panend</li>
    <li>panstart</li>
    <li>ready</li>
    <li>viewchange</li>
    <li>viewchangeend</li>
    <li>viewchangestart</li>
    <li>zoomend</li>
    <li>zoomstart</li>
 </ul>
</div>
<table class="table table-bordered table-condensed">
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
      <td>Option</td>
      <td>Type</td>
      <td>Default</td>
      <td>Description</td>
    </tr>
  </tbody>
</table>

## Submodules

- <a href="../base-apis/bing.html"><code>bing</code></a>
- <a href="../base-apis/esri.html"><code>esri</code></a>
- <a href="../base-apis/google.html"><code>google</code></a>
- <a href="../base-apis/leaflet.html"><code>leaflet</code></a>
- <a href="../base-apis/modestmaps.html"><code>modestmaps</code></a>

# NPMap.Layer

# NPMap.Event

# NPMap.InfoBox

# NPMap.Util