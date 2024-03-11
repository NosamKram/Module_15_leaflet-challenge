// Store API endpoint in queryURL
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform GET request
d3.json(queryURL).then(function(data) {
    createMarkers(data.features);
});

// Function to create marker features
function createMarkers(data) {
    // Feature popup that gives location, magnitude, and depth of each earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`);
    }

    // Create geoJSON layer
    let earthquakeMarkers = L.geoJSON(data, { 
        pointToLayer: function(feature,latlng) {
            let markerStyle = {
                fillOpacity: 1,
                color: "Black",
                fillColor: markerColor(feature.geometry.coordinates[2]),
                radius: markerSize(feature.properties.mag)
            }
            return L.circleMarker(latlng,markerStyle);
        },
        onEachFeature: onEachFeature
    });

    createMap(earthquakeMarkers);
}

// Function to return marker color based on depth
function markerColor(depth) {
    if (depth < 10)
        return "lightgreen";
    else if (depth < 30)
        return "greenyellow";
    else if (depth < 50)
        return "yellow";
    else if (depth < 70)
        return "orange";
    else if (depth < 90)
        return "orangered";
    else
        return "red";
}

// Function to return marker size based on magnitude
function markerSize(mag) {
    return mag * 5;
}

// Function to create map
function createMap(earthquakeMarkers) {
    // Add a tile layer.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a map object.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street,earthquakeMarkers]
    });

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        div.style.backgroundColor = "white";
        div.style.width = "75px";
        depthLabels = [-10, 10, 30, 50, 70, 90];
        const colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#800080"];
    
        div.innerHTML += "<h3 style='text-align: left'>Depth</h3>";
    
        for (let i = 0; i < depthLabels.length; i++) {
            div.innerHTML +=
                '<div style="display: flex; align-items: center;">' +
                '<div style="width: 20px; height: 10px; background-color: ' + colors[i] + '; margin-right: 5px;"></div>' +
                depthLabels[i] +
                (depthLabels[i + 1] ? "–" + depthLabels[i + 1] + "<br>" : "+") +
                '</div>';
        }
        return div;
    };
    legend.addTo(myMap)   
    
}