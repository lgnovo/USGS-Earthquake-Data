// Creating the map object
let myMap = L.map("map", {
    center: [27.96044, -82.30695],
    zoom: 3,
});

// Adding the OpenStreetMap tile layer (default)
let openStreetMapLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Adding the OpenTopoMap tile layer
let openTopoMapLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

// Load the GeoJSON earthquake data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define base layers
let baseLayers = {
    "OpenStreetMap": openStreetMapLayer,
    "OpenTopoMap": openTopoMapLayer,
    "Satellite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }),
};

// Create a layer group for overlays
let overlayLayers = {
    "Tectonic Plates": L.geoJSON(),
    "Earthquakes": L.geoJSON(),
};

// Add tectonic plate boundaries data to the overlays
$.getJSON(plateBoundariesURL, function (plateBoundaries) {
    overlayLayers["Tectonic Plates"].addData(plateBoundaries);
});

// Load the GeoJSON earthquake data and add it to the overlays
d3.json(geoData).then(function (data) {
    overlayLayers["Earthquakes"].addData(data);
});

// Add control layer
L.control.layers(baseLayers, overlayLayers).addTo(myMap);

// Add legend
let legend = L.control({ position: "bottomleft" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let magnitudes = [-10, 10, 30, 50, 70, 90];
    let colors = ["green", "yellowgreen", "yellow", "orange", "orangered", "red"];

    div.innerHTML = "<strong>Magnitude</strong><br>";
    for (let i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' +
            colors[i] +
            '">&nbsp;&nbsp;&nbsp;</i> ' +
            magnitudes[i] +
            (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }

    return div;
};

legend.addTo(myMap);