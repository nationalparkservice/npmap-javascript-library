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
      <td><code>String</code></td>
      <td><code>'bing'</code></td>
      <td>The base API to use for the web map.</td>
    </tr>
    <tr>
      <td><code>baseLayers</code></td>
      <td><code>Array</code></td>
      <td><code>null</code></td>
      <td>The baseLayers to add to the map.</td>
    </tr>
    <tr>
      <td><code>center</code></td>
      <td><code>Object</code></td>
<td><pre><code>{
  lat: 36,
  lng: -96
}
</code></pre></td>
      <td>The latitude/longitude to initialize the map with. If this is <code>null</code> or missing either the <code>lat</code> or <code>lng</code> property, NPMap will default to the center of the continental United States.</td>
    </tr>
    <tr>
      <td><code>div</code></td>
      <td><code>String</code></td>
      <td><code>null</code></td>
      <td>The <code>id</code> of the HTML <code>div</code> element to render the map into. NPMap will automatically size the map to take up 100% of the height and width of the div. If/when this <code>div</code> is resized, NPMap will automatically resize the map.</td>
    </tr>
    <tr>
      <td><code>events</code></td>
      <td><code>Object</code></td>
      <td><code>null</code></td>
      <td>An object with event functions that NPMap should call before, during, and/or after the map creation. The current valid events are <code>preinit</code> and <code>init</code>. The <code>preinit</code> event occurs after the non-mapping dependencies are loaded, but before the mapping library is loaded and the web map is created. The <code>init</code> event occurs after all of the dependencies, including the mapping library, have been loaded and NPMap has created the map. Each of these functions must accept a callback function as a parameter and call the callback function (<code>callback();</code>).</td>
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