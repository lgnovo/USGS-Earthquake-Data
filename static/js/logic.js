//store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Create a map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {
  // Establish colors for depth
  function mapColor(depth) {
      switch (true) {
          case depth > 90:
              return "red";
          case depth > 70:
              return "orange";
          case depth > 50:
              return "gold";
          case depth > 30:
              return "yellow";
          case depth > 10:
              return "lime";
          default:
              return "palegreen";
      }
  }

  // Establish magnitude size
  function mapRadius(mag) {
      if (mag === 0) {
          return 1;
      }
      return mag * 4;
  }

  function mapStyle(feature) {
      return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: mapColor(feature.geometry.coordinates[2]),
          color: "black",
          radius: mapRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
      };
  }

  // Add earthquake data to the map
  L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
      },
      style: mapStyle,
      // Activate pop-up data when circles are clicked
      onEachFeature: function (feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
      }
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];
    let colors = ["palegreen", "lime", "yellow", "gold", "orange", "red"];
  
    // Create a box for the legend
    div.innerHTML = '<h4>Depth Interval Indicator</h4>';
    var legendBox = '<div class="legend-box">';
  
    // Add legend items with colors
    for (var i = 0; i < depth.length; i++) {
      legendBox +=
        '<div class="legend-item"><i style="background:' +
        colors[i] +
        '"></i> ' +
        depth[i] +
        (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+") +
        "</div>";
    }
  
    // Close the legend box
    legendBox += '</div>';
  
    // Append the legend box to the div
    div.innerHTML = legendBox;
  
    return div;
  };
  
legend.addTo(myMap);
});