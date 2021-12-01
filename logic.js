
// store our API  inside query url (all earthquakes in the last seven days/ all week  )
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//store tectonic plates API into line url 
var lineUrl="https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json";

 //************************** Layers****************************
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
  
  // 5.define a map object (default display, satellite and earthquakes )
  var myMap = L.map("map", {
      center: [-25.27, 133.77],
      zoom: 5,
      layers: [satellitemap, earthquakes]
    });
  // 6. Pass our map layers into our layer control and add layer to the map 
  // 7. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  //**************************Markers****************************
// Perform a GET request to the query URL
d3.json(queryUrl),function(earthdata) {
    //creating function to determine size of markers based on value of the magnitute
    function markerSize(mag){
    // in case mag =0, 
    if (mag ===0){
        return 10;
        }
        return mag*10;
    }
// create  function to determine the color of the markers based on value of the magnitute
//https://gis.stackexchange.com/questions/322535/custom-marker-colours-in-leaflet-based-on-attribute
//https://www.color-hex.com/ (reference for color) //https://www.color-hex.com/color-palette/4699

    function colorscale(mag){
        switch(true){
            case mag > 5:
            return "#ff0000";
            case mag > 4:
            return "#ff4d00";
            case mag > 3:
            return "#ff7400";
            case mag > 2:
            return "#ffc100";
            case mag > 0:
            return "#baffc9";
         }
        }
// create new function with finalised markers with above functions ( define size and color)
        function finalMarkers(feature){
            return{
            fillOpacity: 0.75,
            color: "#ffffff",
            fillColor: colorscale(feature.properties.mag),
            radius: markerSize(feature.properties.mag)   
            }
        }
// refer 17.1.10 activity 
 // Perform a GET request to the query URL 
d3.json(queryUrl).then(function(earthdata) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  })
  
  function createFeatures(earthdata) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    //https://leafletjs.com/reference.html#marker
    //https://leafletjs.com/reference.html#geojson-pointtolayer
    var earthquakes = L.geoJSON(earthdata, {
      onEachFeature: onEachFeature,
      style: finalMarkers,
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
    // add all data into earthquake layer groups 
    }).addTo(earthquakes);
    // add above layer into map 
    earthquakes.addTo(myMap);

//geting tectonic plate geojson data (url)
d3.json(lineUrl, function(tectonicdata){
    //add layer 
    L.geoJSON(tectonicdata,{
        color: "yellow",
    }).addto(tectonicplates);
    tectonicplates.addTo(myMap);
}); 

//Legend refer  17.2.4

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        magrange = [0, 1, 2, 3, 4, 5];
        div.innerHTML += "<h3>Magnitude</h3>"
        for (var i = 0; i < magrange.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + colorscale(magrange[i] + 1) + '"></i> ' +
                magrange[i] + (magrange[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);})
