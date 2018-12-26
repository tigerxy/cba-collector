/*var x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
}*/

function alert(type, message) {
    var html = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
    '   <strong>' + message + '</strong>' +
    '       <button class="close" type="button" data-dismiss="alert" aria-label="Close">' +
    '           <span aria-hidden="true">&times;</span>' +
    '       </button>'
    '   </div>';
    $('#alert').append(html);
}

function onAddTrees(event) {
    $.post("/api", {
        size: 1,
        lon: event.data.getLatLng().lng,
        lat: event.data.getLatLng().lat,
        accuracy: event.data.getRadius(),
        token: "asdf"
    })
        .done(function () {
            alert('success', 'Haufen erfolgreich hinzugefügt.');
        })
        .fail(function () {
            alert('danger', 'Fehler');
        })
        .always(function () {
            $('#addModal').modal('hide');
        });
}

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    /*L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);*/

    //console.log(e.latlng);
    gpsPosition.setLatLng(e.latlng);
    gpsPosition.setRadius(radius);
    gpsPosition.addTo(map);
}

function onLocationError(e) {
    console.error(e.message);
    //alert('danger', 'Position konnte nicht ermittelt werden.');
}

var map = L.map('map').fitWorld();

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);

//TODO: Ajax load geojson from api
$.getJSON("/api", function () { })
.done(function (data) {
    console.log(data);
    L.geoJSON(data, {
        style: function (feature) {
            return { color: feature.properties.color };
        }
    }).bindPopup(function (layer) {
        return layer.feature.properties.description;
    }).addTo(map);
})
.fail(function (err) {
    console.error(err.message);
});

var gpsPosition = L.circle([0, 0]);


map.locate({ watch: true, enableHighAccuracy: true });
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

$('#add').on("click", gpsPosition, onAddTrees);