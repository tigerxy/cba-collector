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
    $.post("/api/tree", {
        size: 1,
        lon: event.data.getLatLng().lng,
        lat: event.data.getLatLng().lat,
        accuracy: event.data.getRadius(),
        token: token
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

function loadAreas(geojson) {
    $.getJSON("/api/area", function () { })
        .done(function (data) {
            console.log(data);
            var geo = L.geoJSON(data, { style: { color: 'red', fill: false } });
            geo.addTo(map);
            map.fitBounds(geo.getBounds());
        })
        .fail(function (err) {
            console.error(err.message);
        })
        .always(function () {
        });
}

function loadTrees(geojson, time = 0) {
    $.getJSON("/api/tree?time=" + time, function () { })
        .done(function (data) {
            console.log(data);
            data.length > 0 ? geojson.addData(data) : 0;
        })
        .fail(function (err) {
            console.error(err.message);
        })
        .always(function () {
            time = Date.now();
            setTimeout(function () {
                loadTrees(geojson, time)
            }, 3000);
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
    //gpsPosition.addTo(map);
}

function onLocationError(e) {
    console.error(e.message);
    //alert('danger', 'Position konnte nicht ermittelt werden.');
}

var TreeIcon = L.Icon.extend({
    options: {
        iconSize: [30, 35],
        iconAnchor: [15, 35],
        popupAnchor: [0, -37]
    }
});

var greenIcon = new TreeIcon({ iconUrl: '/images/tree_green.png' }),
    yellowIcon = new TreeIcon({ iconUrl: '/images/tree_yellow.png' }),
    redIcon = new TreeIcon({ iconUrl: '/images/tree_red.png' }),
    greyIcon = new TreeIcon({ iconUrl: '/images/tree_grey.png' });

var map = L.map('map').fitWorld();

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);


var gpsPosition = L.circle([51, 9], { radius: 1500000 });
gpsPosition.addTo(map);

var treePosition = L.geoJSON([], {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: greenIcon });
    }
});
treePosition.bindPopup(function (layer) {
    return layer.feature.properties.description;
});
treePosition.addTo(map);

loadAreas(treePosition);
loadTrees(treePosition);


map.locate({ watch: true, enableHighAccuracy: true });
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

$('#add').on("click", gpsPosition, onAddTrees);