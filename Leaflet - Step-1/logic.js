//  w17.1.9-10 & W17.2.4 
// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

// store our API  inside query url (all earthquakes in the last seven days/ all week  )
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var lineUrl="https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json";

//**************************Part I Layers****************************

//1. create all three layers (Refer W17.1.9 Activity step 1-7: Create multiple layers, set default display)
//https://stackoverflow.com/questions/37166172/mapbox-tiles-and-leafletjs (mapbox id type)
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  maxZoom: 9,
  zoomOffset: -1,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // 2.Create two separate layer groups: one for earthquakes and one for tectonic plates
var earthquakes = L.layerGroup();
var tectonicplates = L.layerGroup();


// 3.Create a baseMaps object
var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoormap,
  };

// 4.Create an overlay object
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Fault Lines": tectonicplates
  };

// 5.define a map object (default display)
var myMap = L.map("map", {
    center: [-25.27, 133.77],
    zoom: 5,
    layers: [satellitemap, earthquakes, tectonicplates]
  });
// 6. Pass our map layers into our layer control
// 7. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
 
  
  //**************************Part II****************************
// Perform a GET request to the query URL



// d3.json(queryUrl).then(function(data) {
//     // once we get a response , send data.features object to the  createFeatures function 
//     createFeatures(data.features);
//     });

//     function createFeatures(earthquakeData)
//     // define this function to run for each features in the feature array 
//     // give each feature a pop up: describing place and time (convert the time format) of the earthquake 

//     function onEachFeature(feature, layer) {
//         layer.bindPopup("<h3>" + feature.properties.place +
//           "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//       }

