// Creating the map object
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine the marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 10; // Increased size multiplier for larger markers
}

// Function to determine the color based on depth
function getColor(depth) {
  return depth > 90 ? '#ff5f65' :  // Very Deep
         depth > 70 ? '#fca45d' :
         depth > 50 ? '#fdb72a' :
         depth > 30 ? '#f7db11' :
         depth > 10 ? '#dcf401' :  // Shallow
                      '#a3f603';   // Very Shallow
}

// Getting our GeoJSON data
d3.json(link).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
          // Get the magnitude and depth
          let magnitude = feature.properties.mag;
          let depth = feature.geometry.coordinates[2];

          // Create a circle marker with size and color based on magnitude and depth
          return L.circleMarker(latlng, {
              radius: markerSize(magnitude),
              fillColor: getColor(depth),
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
          });
      },
      onEachFeature: function(feature, layer) {
        // Add popups with larger font size for information about the earthquake
        layer.bindPopup(
          "<div style='font-size: 40px;'>" +  // Adjust the font size here
          "Magnitude: " + feature.properties.mag + "<br>" +
          "Depth: " + feature.geometry.coordinates[2] + " km<br>" +
          "Location: " + feature.properties.place + 
          "</div>"
        );
    }
}).addTo(myMap);
});

// Create a legend control
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  let depths = [0, 10, 30, 50, 70, 90]; // Define the depth intervals
  let colors = [
      '#a3f603', // 0-10 (Very Shallow)
      '#dcf401', // 10-30
      '#f7db11', // 30-50
      '#fdb72a', // 50-70
      '#fca45d', // 70-90
      '#ff5f65'  // >90 (Very Deep)
  ];

  // Add the title for the legend
  let legendInfo = "<h4 style='font-size:24px;'>Depth (km)</h4>";  // Increased font size for the legend title
  div.innerHTML = legendInfo;

  // Loop through the depth intervals and colors to create legend items with larger size
  for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
          '<i style="background:' + colors[i] + '; width: 40px; height: 40px; display: inline-block; margin-right: 15px;"></i> ' +  // Increased box size
          '<span style="font-size:22px;">' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '</span><br>' : '+</span>');  // Increased font size for legend text
  }

  return div;
};

// Add the legend to the map
legend.addTo(myMap);
