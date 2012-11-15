## Specifications

By design, NPMap doesn't create or utilize traditional JavaScript classes. It, rather, uses simple objects and utility methods that are specific to whichever base API is being used by the map to convert objects to and from objects that are native to the base API.

These specifications document the structure of objects you'll see when interacting directly with NPMap's modules (<code>NPMap.Map</code>, <code>NPMap.Layer</code>, etc.). If you are interacting with objects that aren't proxied through one of the NPMap modules, you'll need to take a look at the API docs for the base API itself to see what the expected format is.

### Bounds

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

### LatLng

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

### Point

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

### Shape

NPMap stores important metadata as a property on all the lines, markers, and polygons that it creates. It uses these metadata to make information about the shapes available via <code>click</code> and <code>mouseover</code> operations and various modules and tools.

All of the metadata that NPMap stores with a shape is contained in the <code>npmap</code> object, so if you have a reference to a shape, you can access the NPMap metadata via the <code>shape.npmap</code> property. This object will contain the following properties:

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

## NPMap.Map

The map is the core component of NPMap. <code>NPMap.Map</code> is a factory that facilitates creating and interacting with a map built using one of the supported base APIs. To create a map, you will need to use the <code>NPMap.config</code> object. It is fully documented <a href="#npmap.config">here</a>.

#### Example

<pre data-line="3-11"><code>
var NPMap = NPMap || {};

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

#### Events

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

#### Submodules

- <a href="../base-apis/bing.html"><code>bing</code></a>
- <a href="../base-apis/esri.html"><code>esri</code></a>
- <a href="../base-apis/google.html"><code>google</code></a>
- <a href="../base-apis/leaflet.html"><code>leaflet</code></a>
- <a href="../base-apis/modestmaps.html"><code>modestmaps</code></a>

## NPMap.Layer

## NPMap.Event

## NPMap.InfoBox

## NPMap.Util