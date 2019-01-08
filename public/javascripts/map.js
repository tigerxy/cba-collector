//-------------------------------------
// Map
//-------------------------------------

function alert(type, message) {
    var html = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
        '   <strong>' + message + '</strong>' +
        '       <button class="close" type="button" data-dismiss="alert" aria-label="Close">' +
        '           <span aria-hidden="true">&times;</span>' +
        '       </button>'
    '   </div>';
    $('#alert').append(html);
}

function onAddTrees(size, latlng) {
    $.post("/api/tree", {
        size: size,
        lon: latlng.lng,
        lat: latlng.lat
    })
        .done(function () {
            alert('success', 'Haufen erfolgreich hinzugefügt.');
        })
        .fail(function () {
            alert('danger', 'Fehler');
        })
        .always(function () {
            openDialog('main');
            //$('#addModal').modal('hide');
        });
}

function loadAreas(geojson) {
    $.getJSON("/api/area", function () { })
        .done(function (data) {
            console.log(data);
            var bounds = null;
            var geo = L.geoJSON(data, {
                style: function (feature) {
                    if (feature.properties.yours) {
                        return {
                            color: 'red',
                            fill: false
                        };
                    } else {
                        return {
                            color: 'gray',
                            opacity: 0.5,
                            fill: true,
                            fillColor: 'gray'
                        };
                    }
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties.yours) {
                        bounds = layer.getBounds();
                    }
                }
            });
            geo.addTo(map);
            map.fitBounds(bounds == null ? geo.getBounds() : bounds);
        })
        .fail(function (err) {
            console.error(err);
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
            }, 30000);
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

$.ajaxSetup({
    headers: {
        token: token
    }
});

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

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var gpsPosition = L.circle([51, 9], { radius: 1500000 });
gpsPosition.addTo(map);

var treePosition = L.geoJSON([], {
    pointToLayer: function (feature, latlng) {
        var icon;
        switch (feature.properties.status[feature.properties.status.length - 1].action) {
            case 'remove':
                icon = redIcon;
                break;
            case 'add':
                icon = greenIcon;
                break;
            default:
                icon = greyIcon;
                break;
        }
        return L.marker(latlng, { icon: icon });
    },
    onEachFeature: function onEachFeature(feature, layer) {
        //layer.bindPopup(feature.properties.creator);
        layer.on('click', function () { openDialog('edit', feature); });
    }
});
treePosition.addTo(map);

loadAreas(treePosition);
loadTrees(treePosition);


map.locate({ watch: true, enableHighAccuracy: true });
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//var cross = L.control.centerCross({ show: false });
//map.addControl(cross);
var cross = L.centerCross();
map.addLayer(cross);
cross.setVisible(false);


//-------------------------------------
// Dialogs
//-------------------------------------
function openDialog(dialogName, data) {
    cross.setVisible(false);
    $('.dialog').addClass('inactive');
    $('#' + dialogName + 'Dialog').removeClass('inactive');
    $('body').trigger(dialogName, data);
}

function onOpenDialog(e) {
    var o = e.target.attributes.open.nodeValue;
    openDialog(o);
}

$('#add').on("click", function (e) {
    onAddTrees(1, map.getCenter());
});
$('.openDialog').on("click", onOpenDialog);
$('body').on('add', function (e) {
    map.flyTo(gpsPosition.getLatLng());
    cross.setVisible(true);
});
$('body').on('main', function (e) {
});
$('body').on('edit', function (e, feature) {
    console.log(feature);
});