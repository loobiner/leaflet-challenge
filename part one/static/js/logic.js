// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 50,
  id: "mapbox.light",
  accessToken: mapboxAPI
});
//coordinates for center of USA 39.8283° N, 98.5795° W
// Initialize all of the LayerGroups we'll be using
var layers = {
    EARTHQUAKESfiveToSeven: new L.LayerGroup(),
    EARTHQUAKESsevenToNine: new L.LayerGroup(),
    EARTHQUAKESaboveNine: new L.LayerGroup()
  };

// Create the map with our layers
var map = L.map("map-id", {
    center: [39.8283, -98.5795],
    zoom: 50,
    layers: [
      layers.EARTHQUAKESfiveToSeven,
      layers.EARTHQUAKESsevenToNine,
      layers.EARTHQUAKESaboveNine
    ]
  });

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
    "Earthquakes with magnitude greater than 9": layers.EARTHQUAKESaboveNine,
    "Earthquakes with magnitude between 7 and 9": layers.EARTHQUAKESsevenToNine,
    "Earthquakes with magnitude between 5 and 7": layers.EARTHQUAKESfiveToSeven
  };

  // Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);


// Initialize an object containing icons for each layer group
var icons = {
    EARTHQUAKESaboveNine: L.ExtraMarkers.icon({
      icon: "ion-settings",
      iconColor: "red",
      markerColor: "red",
      shape: "circle"
    }),
    EARTHQUAKESsevenToNine: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "yellow",
        markerColor: "yellow",
        shape: "circle"
      }),
    EARTHQUAKESfiveToSeven: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "green",
        markerColor: "green",
        shape: "circle"
      })
  };


//I will be using data for large magnitude earthquakes from the last 30 days
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", function(earthquakeData){
    var earthquakeMagnitude = earthquakeData.properties.mag;
    var earthquakeTitle = earthquakeData.properties.title;
    var earthquakeCoordinates = earthquakeData.geometry.coordinates;

    // Create an object to keep of the number of markers in each layer
    var earthquakeCount = {
        EARTHQUAKESaboveNine: 0,
        EARTHQUAKESsevenToNine: 0,
        EARTHQUAKESfiveToSeven: 0
      };
    
    // Initialize a earthquakeStatusCode, which will be used as a key to access the appropriate layers, icons, and earthquake count for layer group
    var earthquakeStatusCode;
    
    // Loop through earthquakeData
    for (var i = 0; i < earthquakeData.length; i++) {
        // Create a new earthquake object
        var earthquakeInfo = Object.assign({}, earthquakeTitle[i], earthquakeMagnitude[i], earthquakeCoordinates[i]);
        // If an earthquake's magnitude is between 5 an 7
        if (earthquakeMagnitude < 7 && earthquakeMagnitude >= 5) {
          earthquakeStatusCode = "EARTHQUAKESfiveToSeven";
        }
        // If an earthquake's magnitude is between 7 and 9
        else if (earthquakeMagnitude < 9 && earthquakeMagnitude >= 7) {
          earthquakeStatusCode = "EARTHQUAKESsevenToNine";
        }
        // If an earthquake's magnitude is greater than 9
        else if (earthquakeMagnitude >= 9) {
          earthquakeStatusCode = "EARTHQUAKESaboveNine";
        }
        // Otherwise the station is normal
        else {};
        }
        // Update the earthquake count
        earthquakeCount[earthquakeStatusCode]++;
        // Create a new marker with the appropriate icon and coordinates
        var newMarker = L.marker([earthquakeCoordinates], {
            icon: icons[earthquakeStatusCode]
        });

        // Add the new marker to the appropriate layer
        newMarker.addTo(layers[earthquakeStatusCode]);

        // Bind a popup to the marker that will  display on click. This will be rendered as HTML
        newMarker.bindPopup(earthquakeTitle);
           
        // Call the updateLegend function, which will... update the legend!
        updateLegend(earthquakeCount);
        });

        // Update the legend's innerHTML with the last updated time and station count
function updateLegend(time, earthquakeCount) {
    document.querySelector(".legend").innerHTML = [
      "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
      "<p class='over-nine'>Magnitude of 9.0 or Greater: " + earthquakeCount.EARTHQUAKESaboveNine + "</p>",
      "<p class='seven-to-nine'>Magnitude Between 7.0 and 9.0: " + earthquakeCount.EARTHQUAKESsevenToNine + "</p>",
      "<p class='five-to-seven'>Magnitude Between 5.0 and 7.0: " + earthquakeCount.EARTHQUAKESfiveToSeven + "</p>",
    ].join("");
  }




















///commented out so that I can easily referrence structure of geojson while coding

    //{"type":"Feature",
    //"properties":{"mag":5,
    //            "place":"71km WNW of Talkeetna, Alaska",
   //             "time":1570192082388,
   //             "updated":1570910098768,
  //              "tz":-540,
 //               "url":"https://earthquake.usgs.gov/earthquakes/eventpage/ak019cqb6c9o",
 //               "detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/ak019cqb6c9o.geojson",
//                 "felt":592,
//                 "cdi":4.9000000000000004,
//                 "mmi":3.7200000000000002,
//                 "alert":"green",
//                 "status":"reviewed",
//                 "tsunami":1,
//                 "sig":675,
//                 "net":"ak",
//                 "code":"019cqb6c9o",
//                 "ids":",at00pyunyq,ak019cqb6c9o,us70005qnc,",
//                 "sources":",at,ak,us,",
//                 "types":",dyfi,geoserve,ground-failure,impact-link,losspager,moment-tensor,oaf,origin,phase-data,shakemap,",
//                 "nst":null,
//                 "dmin":null,
//                 "rms":0.80000000000000004,
//                 "gap":null,
//                 "magType":"mww",
///                 "type":"earthquake",
//                 "title":"M 5.0 - 71km WNW of Talkeetna, Alaska"},
//    "geometry":{"type":"Point",
//                "coordinates":[-151.5831,62.505000000000003,91.299999999999997]},
//    "id":"ak019cqb6c9o"},

