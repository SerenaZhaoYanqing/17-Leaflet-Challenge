
// store our API  inside query url (all earthquakes in the last seven days/ all week  )
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//store tectonic plates API into line url 
var lineUrl="https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json"

 //************************** Layers****************************
//Refer W17.1.9 Activity step 1-7: Create multiple layers, set default display)
//https://stackoverflow.com/questions/37166172/mapbox-tiles-and-leafletjs (mapbox id type)

// 1.Create two separate layer groups: one for earthquakes and one for tectonic plates
var earthquakes = new L.layerGroup();
var tectonicplates = new L.layerGroup();
// 2. create all three layers (
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    id: "satellite-v9",
    accessToken: API_KEY
  });
  
  var grayscaleMap =L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "light-v10",
    accessToken: API_KEY
  });
  
  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      id: "outdoors-v11",
      accessToken: API_KEY
  });
  

  
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
      //set  NY as center
      center: [40.730610, -73.935242],
      zoom: 5,
      layers: [satellitemap, earthquakes,tectonicplates]
    });

  // 6. Pass our map layers into our layer control and add layer to the map 
  // 7. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  //**************************Markers****************************
// Perform a GET request to the query URL
d3.json(queryUrl),function(earthquakeData) {
    //creating function to determine size of markers based on value of the magnitute
    function markerSize(mag){
    // in case mag =0, 
    if (mag ===0){
        return 10;
        }
        return mag*10;
    }

// create  function to determine the color of the markers based on value of the magnitute

// final style of markers ( define size and color, set two different function)
        function finalMarkers(feature){
            return{
            fillOpacity: 0.75,
            color: "#ffffff",
            fillColor: colorscale(feature.properties.mag),
            radius: markerSize(feature.properties.mag)   
            };
        }
  
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

// refer 17.1.10 activity 

L.geoJSON(earthquakeData, {
  //https://leafletjs.com/reference.html#geojson-pointtolayer
  //https://leafletjs.com/reference.html#marker
  pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
  },
  style: finalMarkers,
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + 
      "</h3><hr><p>Date & Time: " + new Date(feature.properties.time) + 
      "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }
//  add all data into earthquake layer groups 
}).addTo(earthquakes);
// Add earthquakes Layer to the Map
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
    legend.addTo(myMap);
  }; 
  
  
